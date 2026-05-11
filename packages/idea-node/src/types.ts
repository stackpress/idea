//modules
import type { FileSystem } from '@stackpress/lib/types';
//idea-node
import type Terminal from './Terminal.js';
import type Transformer from './Transformer.js';

//--------------------------------------------------------------------//
// Rust Types

export type NativeBinding = {
  tokenize(source: string): Token[];
  parse(source: string): SchemaConfig;
  parseAst(source: string): SchemaToken;
  final(source: string): FinalSchemaConfig;
};

export type NativeError = Error & {
  code?: string | number,
  start?: number,
  end?: number
};

//--------------------------------------------------------------------//
// Parser Types

export type Scalar = string | number | boolean | null;

export type Data = Scalar | Data[] | { [key: string]: Data };

export type AttributeValue = true | Data[];

export type ImportToken = {
  type: 'ImportDeclaration',
  start: number,
  end: number,
  specifiers: [],
  source: LiteralToken
};

export type SchemaToken = {
  type: 'Program',
  kind: 'schema',
  start: number,
  end: number,
  body: Array<DeclarationToken | ImportToken>
};

export type DeclarationToken = {
  type: 'VariableDeclaration',
  kind: 'enum' | 'prop' | 'type' | 'model' | 'plugin',
  mutable?: boolean,
  start: number,
  end: number,
  declarations: [DeclaratorToken]
};

export type DeclaratorToken = {
  type: 'VariableDeclarator',
  start: number,
  end: number,
  id: IdentifierToken,
  init: ObjectToken
};

export type IdentifierToken = {
  type: 'Identifier',
  start: number,
  end: number,
  name: string
};

export type ObjectToken = {
  type: 'ObjectExpression',
  start: number,
  end: number,
  properties: PropertyToken[]
};

export type PropertyToken = {
  type: 'Property',
  kind: 'init',
  start: number,
  end: number,
  key: IdentifierToken,
  value: DataToken,
  method?: boolean,
  shorthand?: boolean,
  computed?: boolean
};

export type ArrayToken = {
  type: 'ArrayExpression',
  start: number,
  end: number,
  elements: DataToken[]
};

export type LiteralToken = {
  type: 'Literal',
  start: number,
  end: number,
  value: Data,
  raw: string
};

export type DataToken =
  | IdentifierToken
  | LiteralToken
  | ObjectToken
  | ArrayToken;

export type Token = {
  kind: string,
  start: number,
  end: number,
  lexeme: string,
  value?: unknown
};

export type EnumConfig = Record<string, Data>;

export type PluginConfig = Record<string, Data>;

export type PropConfig = Record<string, Data>;

export type ColumnConfig = {
  name: string,
  type: string,
  attributes: Record<string, AttributeValue>,
  required: boolean,
  multiple: boolean
};

export type TypeConfig = {
  name: string,
  mutable: boolean,
  attributes: Record<string, AttributeValue>,
  columns: ColumnConfig[]
};

export type ModelConfig = TypeConfig;

export type FinalSchemaConfig = {
  enum?: Record<string, EnumConfig>,
  type?: Record<string, TypeConfig>,
  model?: Record<string, ModelConfig>,
  plugin?: Record<string, PluginConfig>
};

export type SchemaConfig = FinalSchemaConfig & {
  prop?: Record<string, PropConfig>,
  use?: string[]
};

//--------------------------------------------------------------------//
// Transformer Types

export type CLIProps = { cli: Terminal };

export type FileLoaderOptions = { cwd?: string, fs?: FileSystem };

export type TerminalOptions = FileLoaderOptions & {
  brand?: string,
  extname?: string
};

export type PluginProps<T extends Record<string, unknown> = Record<string, never>> = T & {
  config: PluginConfig,
  schema: SchemaConfig,
  transformer: Transformer<Record<string, unknown>>,
  cwd: string
};

export type PluginWithCLIProps = PluginProps<CLIProps>;
