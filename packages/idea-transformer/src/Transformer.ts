//types
import type { SchemaConfig, TypeConfig } from '@stackpress/idea-parser';
import type { TransformerOptions } from './types';
//others
import fs from 'node:fs';
import path from 'node:path';
import { parse, Exception } from '@stackpress/idea-parser';
import FileLoader from '@stackpress/lib/dist/system/FileLoader';
import NodeFS from '@stackpress/lib/dist/system/NodeFS';

export default class Transformer<T extends Record<string, unknown>> {
  //current working directory
  public readonly loader: FileLoader;
  //cached input file
  public readonly input: string;
  //cached schema
  protected _schema?: SchemaConfig;

  /**
   * Tries to load the schema file
   */
  get schema() {
    if (!this._schema) {
      //check if input file exists
      if (!fs.existsSync(this.input)) {
        throw Exception.for('Input file %s does not exist', this.input);
      }
      //parse schema
      const schema = parse(fs.readFileSync(this.input, 'utf8'));
      //look for use
      if (Array.isArray(schema.use)) {
        schema.use.forEach((file: string) => {
          const absolute = this.loader.absolute(file);
          const dirname = path.dirname(absolute);
          const transformer = new Transformer(absolute, {
            cwd: dirname,
            fs: this.loader.fs
          });
          const child = transformer.schema;
          //soft merge the object values of enum, 
          //type, model from parent to schema
          if (child.prop) {
            schema.prop = { ...child.prop, ...schema.prop };
          }
          if (child.enum) {
            schema.enum = { ...child.enum, ...schema.enum };
          }
          if (child.type) {
            //make sure there is a schema type
            schema.type = schema.type || {};
            //loop through child types
            for (const [name, type] of Object.entries(child.type)) {
              const parent = schema.type[name];
              //if type from child doesn't exist in schema (parent)
              //or if no parent or parent is not mutable
              if (!parent || !parent.mutable) {
                //add it to schema (parent)
                schema.type[name] = type;
                continue;
              }
              //if the parent is mutable
              if (parent.mutable) {
                //soft merge type ito parent
                this._merge(parent, type);
              }
            }
          }
          if (child.model) {
            //make sure there is a schema model
            schema.model = schema.model || {};
            //loop through child types
            for (const [ name, model ] of Object.entries(child.model)) {
              const parent = schema.model[name];
              //if type from child doesn't exist in schema (parent)
              //or if no parent or parent is not mutable
              if (!parent || !parent.mutable) {
                //add it to schema (parent)
                schema.model[name] = model;
                continue;
              } 
              //if the parent is mutable
              if (parent.mutable) {
                //soft merge type into parent
                this._merge(parent, model);
              }
            }
          }
        });
      }
      //finalize schema
      delete schema.use;
      //set schema
      this._schema = schema;
    }

    return this._schema;
  }

  /**
   * Preloads the input
  */
  constructor(input: string, options: TransformerOptions = {}) {
    this.loader = new FileLoader(options.fs || new NodeFS(), options.cwd);
    this.input = this.loader.absolute(input);
  }

  /**
   * Transform all plugins
   */
  public async transform(extras?: T) {
    //ensure the plugin not exists or is not object 
    //if the conditions are true will throw an error.
    if (!this.schema.plugin || typeof this.schema.plugin !== 'object') {
      throw Exception.for('No plugins defined in schema file');
    }
    //loop through plugins
    for (const plugin in this.schema.plugin) {
      //determine the module path
      const module = this.loader.absolute(plugin);
      //get the plugin config
      const config = this.schema.plugin[plugin] as Record<string, any>;
      //load the callback
      let callback = this.loader.require(module);
      //check for default
      if (callback.default) {
        callback = callback.default;
      }
      //check if it's a function
      if (typeof callback === 'function') {
        //call the callback
        await callback({
          ...extras,
          config,
          schema: this.schema,
          cwd: this.loader.cwd
        });
      }
      //dont do anything else if it's not a function
    }
  }

  /**
   * Merges the child type with the parent type.
   * This is the logic for use() directive in schema files.
   */
  protected _merge(parent: TypeConfig, child: TypeConfig) {
    //merge the attributes if there are child attributes
    if (child.attributes) {
      //if the parent doesn't have attributes but the child does,
      if (!parent.attributes) {
        //set the attributes of the parent to the child
        parent.attributes = child.attributes;
      } else {
        //merge the attributes of the child into parent
        parent.attributes = {
          ...child.attributes,
          ...parent.attributes
        };
      }
    }
    //make sure we are dealing with arrays
    const parentColumns = parent.columns || [];
    const childColumns = child.columns || [];
    //if the column of the child is doesn't exist in the parent,  
    //it will add to the start of the parent column. If the column 
    //already exist in the parent, make a merged with the parent 
    //and child...
    childColumns.reverse().forEach(childColumn => {
      //find the same column in parent 
      const parentColumn = parentColumns.find(
        parentColumn => parentColumn.name === childColumn.name
      );
      //and if not found
      if (!parentColumn) {
        //make sure there are parent columns
        if (!Array.isArray(parent.columns)) {
          parent.columns = [];
        }
        //now add it
        parent.columns.unshift(childColumn);
      }
      //it exists in the parent, so parent takes precedence...
      //don't merge column attributes, because no functionality for 
      //finality in columns exist yet.
    });
  }
}