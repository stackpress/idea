//types
import type { 
  LiteralToken, 
  DeclarationToken, 
  ObjectToken 
} from '../types';

import Lexer from '../types/Lexer';
import { scan } from '../definitions';

import AbstractTree from './AbstractTree';

export default class PluginTree extends AbstractTree<DeclarationToken> {
  //the language used
  static definitions(lexer: Lexer) {
    super.definitions(lexer);
    lexer.define('PluginWord', (code, index) => scan(
      '_PluginWord', 
      /^plugin/, 
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
    return this.plugin();
  }

  /**
   * Builds the plugin syntax
   */
  plugin(): DeclarationToken {
    //plugin
    const type = this._lexer.expect('PluginWord');
    this._lexer.expect('whitespace');
    //plugin "Foobar"
    const id = this._lexer.expect<LiteralToken>('String');
    this._lexer.expect('whitespace');
    //plugin "Foobar" {...}
    const init = this._lexer.expect<ObjectToken>('Object');
  
    return {
      type: 'VariableDeclaration',
      kind: 'plugin',
      start: type.start,
      end: this._lexer.index,
      declarations: [
        {
          type: 'VariableDeclarator',
          start: id.start,
          end: this._lexer.index,
          id: {
            type: 'Identifier',
            start: id.start,
            end: id.end,
            name: id.value
          },
          init
        }
      ]
    };
  }
};