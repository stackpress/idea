//types
import type { 
  Data,
  DataToken,
  ArrayToken,
  EnumConfig,
  PropConfig,
  TypeConfig,
  ModelConfig,
  ObjectToken, 
  ImportToken,
  SchemaToken,
  ColumnConfig,
  SchemaConfig,
  LiteralToken, 
  UseReferences,
  PluginConfig,
  IdentifierToken, 
  DeclarationToken,
  FinalSchemaConfig
} from '../types';

import Exception from './Exception';

export default class Compiler {
  /**
   * Compiles an array tree into an actual array
   */
  static array<T = Data[]>(token: ArrayToken, references: UseReferences = false) {
    return token.elements.map(element => this.data(element, references)) as T;
  }

  /**
   * Compiles an array, object or scalar tree into the actual value
   */
  static data(token: DataToken, references: UseReferences = false): Data {
    if (token.type === 'ObjectExpression') {
      return this.object(token, references);
    } else if (token.type === 'ArrayExpression') {
      return this.array(token, references);
    } else if (token.type === 'Literal') {
      return this.literal(token);
    } else if (token.type === 'Identifier') {
      return this.identifier(token, references);
    }
    throw Exception.for('Invalid data token type');
  }

  /**
   * Converts an enum tree into a json version
   */
  static enum(token: DeclarationToken) {
    if (token.kind !== 'enum') {
      throw Exception.for('Invalid Enum');
    }
    //ex. Roles
    const name = token.declarations?.[0].id?.name as string;
    const options: EnumConfig = {};
    token.declarations[0].init.properties.forEach(property => {
      options[property.key.name] = (property.value as LiteralToken).value;
    });
    return [ name, options ] as [ string, EnumConfig ];
  }

  /**
   * Converts a schema tree into a final json version
   * (Removes prop and use references)
   */
  static final(token: SchemaToken) {
    const schema = this.schema(token, true);
    delete schema.use;
    delete schema.prop;
    return schema as FinalSchemaConfig;
  }

  /**
   * Compiles an identifier into the actual value it's referencing
   */
  static identifier(token: IdentifierToken, references: UseReferences = false) {
    if (references && token.name in references) {
      return references[token.name];
    } else if (references === false) {
      return '${' + token.name + '}';
    }

    throw Exception.for(`Unknown reference ${token.name}`);
  }

  /**
   * Compiles a literal into the actual value
   */
  static literal(token: LiteralToken) {
    return token.value;
  }

  /**
   * Converts a model tree into a json version
   */
  static model(token: DeclarationToken, references: UseReferences = false) {
    //ex. Foobar
    const name = token.declarations[0].id?.name;
    const value: Record<string, any> = {};
    token.declarations[0].init.properties.forEach(property => {
      value[property.key.name] = this.data(property.value, references);
    });

    if (typeof value.columns !== 'object') {
      throw Exception.for('Expecting a columns property');
    }

    //change from key/value to array to preserve the order
    const columns: ColumnConfig[] = [];
    for (const name in value.columns) {
      const column = value.columns[name];
      column.name = name;
      if (typeof column.type === 'string') {
        column.required = !column.type.endsWith('?');
        column.type = column.type.replace(/\?$/, '');
        column.multiple = column.type.endsWith('[]');
        column.type = column.type.replace(/\[\]$/, '');
      }
      columns.push({
        type: column.type,
        name: column.name,
        required: column.required,
        multiple: column.multiple,
        attributes: column.attributes,
        ...column
      });
    }
    value.columns = columns;

    return [ name, { name, ...value } ] as [ string, ModelConfig ];
  }

  /**
   * Compiles an object tree into the actual object
   */
  static object<T = Data>(token: ObjectToken, references: UseReferences = false) {
    return Object.fromEntries(token.properties.map(property => [ 
      property.key.name, 
      this.data(property.value, references) 
    ])) as Record<string, T>;
  }

  /**
   * Converts an plugin tree into a json version
   */
  static plugin(token: DeclarationToken) {
    if (token.kind !== 'plugin') {
      throw Exception.for('Invalid Plugin');
    }
    //ex. ./custom-plugin
    const name = token.declarations?.[0].id?.name as string;
    const value: PluginConfig = {};
    token.declarations[0].init.properties.forEach(property => {
      value[property.key.name] = this.data(property.value);
    });
    return [ name, value ] as [ string, PluginConfig ];
  }

  /**
   * Converts a prop tree into a json version
   */
  static prop(token: DeclarationToken, references: UseReferences = false) {
    if (token.kind !== 'prop') {
      throw Exception.for('Invalid Prop');
    }
    //ex. Foobar
    const name = token.declarations[0].id.name;
    const value: PropConfig = {};
    token.declarations[0].init.properties.forEach(property => {
      value[property.key.name] = this.data(property.value, references);
    });
    return [ name, value ] as [ string, PropConfig ];
  }

  /**
   * Converts a schema tree into a json version
   */
  static schema(token: SchemaToken, finalize = false) {
    if (token.kind !== 'schema') {
      throw Exception.for('Invalid Schema');
    }

    const schema: SchemaConfig = {};
    const references: Record<string, any> = {};
    //deal with uses
    const uses = token.body.filter(
      token => token.type === 'ImportDeclaration'
    ) as ImportToken[];
    uses.forEach(use => {
      schema.use = schema.use || [];
      schema.use.push(this.use(use));
    });
    //deal with declarations
    const declarations = token.body as DeclarationToken[];
    declarations.filter(declaration => declaration.kind).forEach(declaration => {
      if (declaration.kind === 'enum') {
        schema.enum = schema.enum || {};
        const [ key, value ] = this.enum(declaration);
        schema.enum[key] = value;
        if (references[key]) {
          throw Exception.for('Duplicate %s', key);
        }
        references[key] = value;
      } else if (declaration.kind === 'prop') {
        schema.prop = schema.prop || {};
        const [ key, value ] = this.prop(
          declaration, 
          finalize ? references: false
        );
        schema.prop[key] = value;
        if (references[key]) {
          throw Exception.for('Duplicate %s', key);
        }
        references[key] = value;
      } else if (declaration.kind === 'type') {
        schema.type = schema.type || {};
        const [ key, value ] = this.type(
          declaration, 
          finalize ? references: false
        );
        schema.type[key] = value;
        if (references[key]) {
          throw Exception.for('Duplicate %s', key);
        }
        references[key] = value;
      } else if (declaration.kind === 'model') {
        schema.model = schema.model || {};
        const [ key, value ] = this.model(
          declaration, 
          finalize ? references: false
        );
        schema.model[key] = value;
        if (references[key]) {
          throw Exception.for('Duplicate %s', key);
        }
        references[key] = value;
      } else if (declaration.kind === 'plugin') {
        schema.plugin = schema.plugin || {};
        const [ key, value ] = this.plugin(declaration);
        schema.plugin[key] = value;
        if (references[key]) {
          throw Exception.for('Duplicate %s', key);
        }
        references[key] = value;
      }
    });

    return schema;
  }

  /**
   * Converts a type tree into a json version
   */
  static type(token: DeclarationToken, references: UseReferences = false) {
    if (token.kind !== 'type') {
      throw Exception.for('Invalid Type');
    }
    //ex. Foobar
    const name = token.declarations[0].id.name;
    const value: Record<string, any> = {};
    token.declarations[0].init.properties.forEach(property => {
      value[property.key.name] = this.data(property.value, references);
    });

    if (typeof value.columns !== 'object') {
      throw Exception.for('Expecting a columns property');
    }

    //change from key/value to array to preserve the order
    const columns: ColumnConfig[] = [];
    for (const name in value.columns) {
      const column = value.columns[name];
      column.name = name;
      if (typeof column.type === 'string') {
        column.required = !column.type.endsWith('?');
        column.type = column.type.replace(/\?$/, '');
        column.multiple = column.type.endsWith('[]');
        column.type = column.type.replace(/\[\]$/, '');
      }
      columns.push({
        type: column.type,
        name: column.name,
        required: column.required,
        multiple: column.multiple,
        attributes: column.attributes,
        ...column
      });
    }
    value.columns = columns;

    return [ name, { name, ...value } ] as [ string, TypeConfig ];
  }

  /**
   * Converts an use tree into a json version
   */
  static use(token: ImportToken) {
    if (token.type !== 'ImportDeclaration') {
      throw Exception.for('Invalid Import');
    }
    //ex. ./another.idea
    return token.source.value;
  }
};