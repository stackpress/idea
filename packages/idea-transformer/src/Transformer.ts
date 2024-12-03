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
            for (const [ name, type ] of Object.entries(child.type)) {
              const parent = schema.type[name];
              //if type from child doesn't exist in schema (parent)
              if (!parent) {
                //add it to schema (parent)
                schema.type[name] = type;
                continue;
              //if parent isnt final
              } else if (parent.mutable) {
                //soft merge type into parent
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
              if (!parent) {
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
    //if no plugins defined throw error
    if (!this.schema.plugin) {
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
    //type exists in schema (parent)
    //let's soft merge the attributes and columns
    const { attributes = {}, columns = [] } = child;
    //merge child attributes with schema attributes
    //where schema attributes take precedence
    parent.attributes = { 
      ...attributes, 
      ...parent.attributes 
    };
    //merge child columns with schema columns
    //where schema columns take precedence
    columns.reverse().forEach(column => {
      //find the same column in parent and if not found, 
      if (parent.columns.findIndex(
        c => c.name === column.name
      ) === -1) {
        //add it
        parent.columns.unshift(column);
      }
      //it exists in the parent, so parent takes precedence...
    });
  }
}