//types
import type { PluginConfig, SchemaConfig } from '@stackpress/idea-parser';
//others
import fs from 'fs';
import path from 'path';
import { parse, Exception } from '@stackpress/idea-parser';
import Loader from './Loader';

export type PluginProps<T extends {}> = T & {
  config: PluginConfig,
  schema: SchemaConfig,
  cwd: string
};

export default class Transformer<T extends {}> {
  //current working directory
  protected _cwd;
  //cached input file
  protected _input = '';
  //cached schema
  protected _schema: SchemaConfig|null = null;

  /**
   * Returns the current working directory
   */
  get cwd() {
    return this._cwd;
  }

  /**
   * Returns the input
   */
  get input() {
    return this._input;
  }

  /**
   * Tries to load the schema file
   */
  get schema() {
    if (!this._schema) {
      //check if input file exists
      if (!fs.existsSync(this._input)) {
        throw Exception.for('Input file %s does not exist', this._input);
      }
      //parse schema
      const schema = parse(fs.readFileSync(this._input, 'utf8'));
      //look for use
      if (Array.isArray(schema.use)) {
        schema.use.forEach((file: string) => {
          const absolute = Loader.absolute(file, this._cwd);
          const dirname = path.dirname(absolute);
          const transformer = new Transformer(absolute, dirname);
          const parent = transformer.schema;
          //soft merge the object values of enum, 
          //type, model from parent to schema
          if (parent.prop) {
            schema.prop = { ...parent.prop, ...schema.prop };
          }
          if (parent.enum) {
            schema.enum = { ...parent.enum, ...schema.enum };
          }
          if (parent.type) {
            schema.type = { ...parent.type, ...schema.type };
          }
          if (parent.model) {
            schema.model = { ...parent.model, ...schema.model };
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
  constructor(input: string, cwd = Loader.cwd()) {
    this._input = input;
    this._cwd = cwd;
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
      const module = Loader.absolute(plugin, this._cwd);
      //get the plugin config
      const config = this.schema.plugin[plugin] as Record<string, any>;
      //load the callback
      let callback = Loader.require(module);
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
          cwd: this._cwd 
        });
      }
      //dont do anything else if it's not a function
    }
  }
}