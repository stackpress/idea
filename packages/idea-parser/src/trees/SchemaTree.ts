//types
import type { 
  SchemaToken, 
  ImportToken, 
  DeclarationToken 
} from '../types';

import Exception from '../types/Exception';
import Lexer from '../types/Lexer';

import AbstractTree from './AbstractTree';
import EnumTree from './EnumTree';
import PropTree from './PropTree';
import TypeTree from './TypeTree';
import ModelTree from './ModelTree';
import PluginTree from './PluginTree';
import UseTree from './UseTree';

type BodyToken = DeclarationToken|ImportToken;

export default class SchemaTree extends AbstractTree<SchemaToken> {
  //the language used
  static definitions(lexer: Lexer) {
    EnumTree.definitions(lexer);
    PropTree.definitions(lexer);
    TypeTree.definitions(lexer);
    ModelTree.definitions(lexer);
    PluginTree.definitions(lexer);
    UseTree.definitions(lexer);
    return lexer;
  }

  /**
   * (Main) Builds the syntax tree
   */
  static parse(code: string) {
    return new this().parse(code);
  }

  //placeholder for trees
  protected _enumTree: EnumTree;
  protected _propTree: PropTree;
  protected _typeTree: TypeTree;
  protected _modelTree: ModelTree;
  protected _pluginTree: PluginTree;
  protected _useTree: UseTree;

  /**
   * Creates a new parser 
   */
  constructor(lexer?: Lexer) {
    super(lexer);
    this._enumTree = new EnumTree(this._lexer);
    this._propTree = new PropTree(this._lexer);
    this._typeTree = new TypeTree(this._lexer);
    this._modelTree = new ModelTree(this._lexer);
    this._pluginTree = new PluginTree(this._lexer);
    this._useTree = new UseTree(this._lexer);
  }

  /**
   * Builds the type syntax
   */
  parse(code: string, start = 0): SchemaToken {
    this._lexer.load(code, start);
    this.noncode();
    const body: BodyToken[] = [];
    for (const token of this.dotryall(
      () => this._enumTree.enum(),
      () => this._propTree.prop(),
      () => this._typeTree.type(),
      () => this._modelTree.model(),
      () => this._pluginTree.plugin(),
      () => this._useTree.use()
    )) {
      body.push(token);
      this.noncode();
    }

    if (this._lexer.index < code.length) {
      const remainder = code.substring(
        this._lexer.index, 
        this._lexer.nextSpace()
      ).trim();
      if (remainder.length) {
        throw Exception
          .for(`Unexpected token %s`, remainder.replace(/[\n\r]/g, ' ').trim())
          .withPosition(this._lexer.index, this._lexer.nextSpace());
      }
    }

    return {
      type: 'Program',
      kind: 'schema',
      start: 0,
      end: this._lexer.index,
      body
    };
  }

  /**
   * Wrapper for do-try-catch-while
   */
  protected *dotryall(...all: (() => BodyToken|undefined)[]) {
    let token: BodyToken|undefined;
    do {
      token = undefined;
      for (const callback of all) {
        try {
          token = callback();
          if (token) {
            yield token;
            break;
          }
        } catch(error) {}
      }
    } while(token);
  }
};