//node
import path from 'node:path';
//modules
import Exception from '@stackpress/lib/Exception';
import FileLoader from '@stackpress/lib/FileLoader';
import NodeFS from '@stackpress/lib/NodeFS';
//idea-node
import type { SchemaConfig, TypeConfig } from './types.js';
import type { FileLoaderOptions } from './types.js';
import Parser from './Parser.js';

class Transformer<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Loads a transformer after resolving the entry file against 
   * the caller's FS.
   */
  public static async load<T extends Record<string, unknown>>(
    input: string,
    options: FileLoaderOptions = {}
  ) {
    const loader = new FileLoader(options.fs || new NodeFS(), options.cwd);
    const resolvedInput = await loader.absolute(input);

    return new Transformer<T>(resolvedInput, loader);
  };

  //The absolute input path is cached because plugin resolution 
  // depends on it.
  public readonly input: string;

  //The loader keeps path resolution and dynamic imports consistent 
  // across plugins.
  public readonly loader: FileLoader;

  //The parser is used to get the initial schema config with span
  // information for error reporting.
  public readonly parser: Parser;

  //Schema loading is lazy because the CLI can construct a transformer 
  // without using it.
  protected _schema?: SchemaConfig;

  /**
   * Preloads the schema and merges imported fragments before any 
   * plugin sees it.
   */
  constructor(input: string, loader: FileLoader) {
    this.input = input;
    this.loader = loader;
    this.parser = new Parser();
  }

  /**
   * Loads the schema once, merging imported types and models by mutability rules.
   */
  public async schema() {
    if (!this._schema) {
      if (!(await this.loader.fs.exists(this.input))) {
        throw Exception.for('Input file %s does not exist', this.input);
      }

      const content = await this.loader.fs.readFile(this.input, 'utf8');

      const schema: SchemaConfig = path.extname(this.input) === '.json'
        ? JSON.parse(content)
        : this.parser.parse(content);

      if (Array.isArray(schema.use)) {
        for (const file of schema.use) {
          const absolute = await this.loader.resolveFile(
            file,
            [ '.js' ],
            this.loader.cwd,
            true
          ) as string;
          const dirname = path.dirname(absolute);
          const transformer = await Transformer.load<T>(absolute, {
            cwd: dirname,
            fs: this.loader.fs
          });
          const child = await transformer.schema();

          if (child.prop) {
            schema.prop = { ...child.prop, ...schema.prop };
          }

          if (child.enum) {
            schema.enum = { ...child.enum, ...schema.enum };
          }

          if (child.type) {
            schema.type = schema.type || {};

            for (const [name, type] of Object.entries(child.type)) {
              const parent = schema.type[name];

              if (!parent || !parent.mutable) {
                schema.type[name] = type;
                continue;
              }

              if (parent.mutable) {
                this._merge(parent, type);
              }
            }
          }

          if (child.model) {
            schema.model = schema.model || {};

            for (const [name, model] of Object.entries(child.model)) {
              const parent = schema.model[name];

              if (!parent || !parent.mutable) {
                schema.model[name] = model;
                continue;
              }

              if (parent.mutable) {
                this._merge(parent, model);
              }
            }
          }
        }
      }

      delete schema.use;
      this._schema = schema;
    }

    return this._schema;
  };

  /**
   * Executes every configured plugin against the resolved final schema.
   */
  public async transform(extras?: T) {
    const schema = await this.schema();

    if (!schema.plugin || typeof schema.plugin !== 'object') {
      throw Exception.for('No plugins defined in schema file');
    }

    for (const plugin in schema.plugin) {
      const module = await this.loader.resolveFile(
        plugin,
        [ '.js', '.cjs', '.mjs', '.ts', '.mts' ],
        this.loader.cwd,
        true
      ) as string;

      const config = schema.plugin[plugin] as Record<string, unknown>;
      const callback = await this.loader.import<(...args: unknown[]) => unknown>(
        module,
        true
      );

      if (typeof callback === 'function') {
        await callback({
          ...extras,
          transformer: this,
          config,
          schema,
          cwd: this.loader.cwd
        });
      }
    }
  };

  /**
   * Merges imported definitions without overwriting the local author's intent.
   */
  protected _merge(parent: TypeConfig, child: TypeConfig) {
    if (child.attributes) {
      if (!parent.attributes) {
        parent.attributes = child.attributes;
      } else {
        parent.attributes = {
          ...child.attributes,
          ...parent.attributes
        };
      }
    }

    const parentColumns = parent.columns || [];
    const childColumns = child.columns || [];

    // Imported columns are prepended so shared base definitions stay ahead of local ones.
    childColumns.reverse().forEach(childColumn => {
      const parentColumn = parentColumns.find(
        parentColumn => parentColumn.name === childColumn.name
      );

      if (!parentColumn) {
        if (!Array.isArray(parent.columns)) {
          parent.columns = [];
        }

        parent.columns.unshift(childColumn);
      }
    });
  };
};

export default Transformer;
