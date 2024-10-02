//types
import type { LiteralToken, ImportToken } from '../types';

import Lexer from '../types/Lexer';
import { scan } from '../definitions';

import AbstractTree from './AbstractTree';

export default class UseTree extends AbstractTree<ImportToken> {
  //the language used
  static definitions(lexer: Lexer) {
    super.definitions(lexer);
    lexer.define('UseWord', (code, index) => scan(
      '_UseWord', 
      /^use/, 
      code, 
      index
    ));
    return lexer;
  }

  /**
   * (Main) Builds the syntax tree
   */
  static parse(code: string, start = 0) {
    return new this().parse(code, start);
  }

  /**
   * Builds the enum syntax
   */
  parse(code: string, start = 0) {
    this._lexer.load(code, start);
    return this.use();
  }

  /**
   * Builds the enum syntax
   */
  use(): ImportToken {
    //use
    const type = this._lexer.expect('UseWord');
    this._lexer.expect('whitespace');
    //use "Foobar"
    const imported = this._lexer.expect<LiteralToken>('String');
  
    return {
      type: 'ImportDeclaration',
      start: type.start,
      end: this._lexer.index,
      specifiers: [],
      source: {
        type: 'Literal',
        start: imported.start,
        end: imported.end,
        value: imported.value,
        raw: imported.raw
      }
    };
  }
};