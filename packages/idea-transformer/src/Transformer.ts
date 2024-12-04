//types
import type { SchemaConfig, TypeConfig } from '@stackpress/idea-parser';
import type { TransformerOptions } from './types';
//others
import fs from 'node:fs';
import path from 'node:path';
import { parse, Exception } from '@stackpress/idea-parser';
import FileLoader from '@stackpress/types/dist/system/FileLoader';
import NodeFS from '@stackpress/types/dist/system/NodeFS';

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
              if (!parent) {
                //add it to schema (parent)
                schema.type[name] = type;
                continue;
                //if parent isnt final
              }
              // If the parent is mutable, perform a soft merge 
              if (parent.mutable ) {
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
              // If no parent or parent is not mutable, add the model 
              // to the schema (parent)
              if (!parent || !parent.mutable) {
                //add it to schema (parent)
                schema.model[name] = model;
                continue;
                //if parent isnt final
              } else if (parent.mutable) {
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
  public transform(extras?: T) {
    // Ensure the plugin not exists or is not object if the
    // conditions are true will throw an error.
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
        callback({
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
    //To ensure that the column of both the parent and child objects is 
    //initialized as an array if it is undefined or null.
    parent.columns = parent.columns || [];
    child.columns = child.columns || [];
    // Merge the attributes of the child into parent 
    // and also ensure that the attributes of child is only merged if 
    // they are valid, not null and not undefined 
    if (typeof child.attributes === 'object'
      && child.attributes !== null
      && child.attributes !== undefined) {
      parent.attributes = {
        ...child.attributes,
        ...parent.attributes,
      };
    }
    // The column of the child is densn't exist in the parent,It will 
    // add to the start of the parent column. If the column already
    // exist in the parent, make a merged with the parent and child
    child.columns.reverse().forEach(column => {
      const existingColumn = parent.columns.find(c => c.name === column.name)
      //find the same column in parent and if not found, 
      if (!existingColumn) {
        //add it
        parent.columns.unshift(column);
      } else {
        // Deep merge attributes within the column if they exist
        existingColumn.attributes = {
          ...column.attributes,
          ...existingColumn.attributes,
        };
      }
    });
  }
}