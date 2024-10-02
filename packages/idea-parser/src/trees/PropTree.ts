import type { 
  DeclarationToken, 
  IdentifierToken, 
  ObjectToken 
} from '../types';

import Lexer from '../types/Lexer';
import { scan } from '../definitions';

import AbstractTree from './AbstractTree';


export default class PropTree extends AbstractTree<DeclarationToken> {
  //the language used
  static definitions(lexer: Lexer) {
    super.definitions(lexer);
    lexer.define('PropWord', (code, index) => scan(
      '_PropWord', 
      /^prop/, 
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
    return this.prop();
  }

  /**
   * Builds the prop syntax  
   */
  prop(): DeclarationToken {
    //prop
    const type = this._lexer.expect('PropWord');
    this._lexer.expect('whitespace');
    //prop Foobar
    const id = this._lexer.expect<IdentifierToken>('CapitalIdentifier');
    this._lexer.expect('whitespace');
    //prop Foobar {
    const init = this._lexer.expect<ObjectToken>('Object');
  
    return {
      type: 'VariableDeclaration',
      kind: 'prop',
      start: type.start,
      end: init.end,
      declarations: [
        {
          type: 'VariableDeclarator',
          start: id.start,
          end: init.end,
          id,
          init
        }
      ]
    };
  }
};