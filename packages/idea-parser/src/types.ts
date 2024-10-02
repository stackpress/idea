export type Reader = (
  code: string, 
  start: number, 
  lexer: Parser
) => Token|undefined;

export type Definition = { key: string, reader: Reader };

export type UnknownToken = { 
  type: string;
  start: number;
  end: number;
  value: any;
  raw: string;
};

export type ImportToken = {
  type: 'ImportDeclaration';
  start: number;
  end: number;
  specifiers: [],
  source: LiteralToken
}

export type SchemaToken = {
  type: 'Program';
  kind: 'schema';
  start: number;
  end: number;
  body: (DeclarationToken|ImportToken)[];
};

export type DeclarationToken = {
  type: 'VariableDeclaration';
  kind: string;
  start: number;
  end: number;
  declarations: [ DeclaratorToken ];
};

export type DeclaratorToken = {
  type: 'VariableDeclarator';
  start: number;
  end: number;
  id: IdentifierToken;
  init: ObjectToken;
};

export type IdentifierToken = {
  type: 'Identifier';
  name: string;
  start: number;
  end: number;
};

export type ObjectToken = {
  type: 'ObjectExpression';
  start: number;
  end: number;
  properties: PropertyToken[];
};

export type PropertyToken = {
  type: 'Property';
  kind: 'init';
  start: number;
  end: number;
  key: IdentifierToken;
  value: DataToken;
  method: boolean;
  shorthand: boolean;
  computed: boolean;
};

export type ArrayToken = {
  type: 'ArrayExpression';
  start: number;
  end: number;
  elements: DataToken[];
};

export type LiteralToken = {
  type: 'Literal';
  start: number;
  end: number;
  value: any;
  raw: string;
};

export type Token = DataToken|UnknownToken;
export type DataToken = IdentifierToken|LiteralToken|ObjectToken|ArrayToken;
export type UseReferences = Record<string, any>|false;

export type Scalar = string|number|null|boolean;
export type Data = Scalar|Data[]|{ [key: string]: Data };

export interface Parser {
  get dictionary(): Record<string, Definition>;
  get index(): number;
  clone(): Parser;
  define(key: string, reader: Reader, type?: string): void;
  expect<T = Token>(keys: string | string[]): T;
  get(key: string): Definition|undefined;
  load(code: string, index: number): this;
  match(code: string, start: number, keys?: string[]): Token|null;
  next(keys: string | string[]): boolean;
  optional<T = Token>(keys: string | string[]): T | undefined;
  read(): Token | undefined
}

export type EnumConfig = Record<string, Scalar>;
export type PluginConfig = Record<string, Data>;
export type PropConfig = Record<string, Data>;
export type ColumnConfig = {
  name: string,
  type: string,
  attributes: Record<string, Data>,
  required: boolean,
  multiple: boolean
};

export type TypeConfig = {
  name: string,
  attributes: Record<string, Data>,
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