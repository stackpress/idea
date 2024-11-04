//types
import type { SchemaConfig } from '@stackpress/idea-parser';
import type { TransformerOptions } from './types';
//others
import fs from 'fs';
import path from 'path';
import { parse, Exception } from '@stackpress/idea-parser';
import FileLoader from '@stackpress/types/dist/filesystem/FileLoader';
import NodeFS from '@stackpress/types/dist/filesystem/NodeFS';

export default class Transformer<T extends Record<string, unknown>> {
  //current working directory
  public readonly loader: FileLoader;
  //cached input file
  public readonly input: string;
  //cached schema
  protected _schema: SchemaConfig|null = null;

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
}