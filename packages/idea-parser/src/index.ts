import Exception from './types/Exception';
import Lexer from './types/Lexer';
import Compiler from './types/Compiler';
import AbstractTree from './trees/AbstractTree';
import EnumTree from './trees/EnumTree';
import PropTree from './trees/PropTree';
import TypeTree from './trees/TypeTree';
import ModelTree from './trees/ModelTree';
import SchemaTree from './trees/SchemaTree';
import PluginTree from './trees/PluginTree';

export type * from './types';
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