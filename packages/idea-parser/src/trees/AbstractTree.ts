//types
import type { DeclarationToken } from '../types';

import Lexer from '../types/Lexer';

import definitions from '../definitions';

export default abstract class AbstractTree<T = DeclarationToken> {
  //the language used
  static definitions(lexer: Lexer) {
    Object.keys(definitions).forEach((key) => {
      lexer.define(key, definitions[key]);
    });
    return lexer;
  }

  //the parser
  protected _lexer: Lexer;

  /**
   * Creates a new parser 
   */
  constructor(lexer?: Lexer) {
    this._lexer = lexer || (
      this.constructor as typeof AbstractTree
    ).definitions(new Lexer());
  }

  /**
   * Consumes non code
   */
  public noncode() {
    while(this._lexer.optional(['whitespace', 'comment', 'note']));
  }

  /**
   * Builds the object syntax
   */
  public abstract parse(code: string, start: number): T;

  /**
   * Wrapper for do-try-catch-while
   */
  protected dotry(callback: () => void) {
    do {
      try {
        callback();
      } catch(error) {
        break;
      }
    } while(true);
  }
};