export type {
  Reader,
  Definition,
  UnknownToken,
  ImportToken,
  SchemaToken,
  DeclarationToken,
  DeclaratorToken,
  IdentifierToken,
  ObjectToken,
  PropertyToken,
  ArrayToken,
  LiteralToken,
  Token,
  DataToken,
  UseReferences,
  Scalar,
  Data,
  Parser,
  EnumConfig,
  PluginConfig,
  PropConfig,
  ColumnConfig,
  TypeConfig,
  ModelConfig,
  FinalSchemaConfig,
  SchemaConfig
} from './types.js';

import AbstractTree from './trees/AbstractTree.js';
import EnumTree from './trees/EnumTree.js';
import PropTree from './trees/PropTree.js';
import TypeTree from './trees/TypeTree.js';
import ModelTree from './trees/ModelTree.js';
import SchemaTree from './trees/SchemaTree.js';
import PluginTree from './trees/PluginTree.js';
import Exception from './Exception.js';
import Lexer from './Lexer.js';
import Compiler from './Compiler.js';

export { 
  Exception, 
  Lexer, 
  Compiler,
  AbstractTree, 
  EnumTree,
  PropTree,
  TypeTree,
  ModelTree,
  SchemaTree,
  PluginTree
};

export function final(code: string) {
  return Compiler.final(SchemaTree.parse(code));
}

export function parse(code: string) {
  return Compiler.schema(SchemaTree.parse(code));
}