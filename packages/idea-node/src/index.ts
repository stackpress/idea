//idea-node
import Transformer from './Transformer.js';
import Terminal, { control } from './Terminal.js';
import Parser from './Parser.js';

const parser = new Parser();

export type {
  Scalar,
  Data,
  AttributeValue,
  ImportToken,
  SchemaToken,
  DeclarationToken,
  DeclaratorToken,
  IdentifierToken,
  ObjectToken,
  PropertyToken,
  ArrayToken,
  LiteralToken,
  DataToken,
  Token,
  EnumConfig,
  PluginConfig,
  PropConfig,
  ColumnConfig,
  TypeConfig,
  ModelConfig,
  FinalSchemaConfig,
  SchemaConfig,
  CLIProps,
  FileLoaderOptions,
  TerminalOptions,
  PluginProps,
  PluginWithCLIProps
} from './types.js';

export { Transformer, Terminal, control, Parser };

/**
 * A shared parser instance keeps the top-level API lightweight while
 * still exposing the Parser class for callers that want direct control.
 */
export function tokenize(source: string) {
  return parser.tokenize(source);
}

/**
 * This helper preserves the package-level parser API that existing
 * Node consumers already expect.
 */
export function parse(source: string) {
  return parser.parse(source);
}

/**
 * AST access stays separate so tooling can avoid schema finalization
 * when it only needs syntax structure.
 */
export function parseAst(source: string) {
  return parser.parseAst(source);
}

/**
 * The final helper resolves the source through the native parser and
 * returns the final schema config.
 */
export function final(source: string) {
  return parser.final(source);
}
