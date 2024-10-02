//types
import type { 
  LiteralToken, 
  PropertyToken, 
  IdentifierToken,
  DeclarationToken 
} from '../types';

import Lexer from '../types/Lexer';
import { scalar, scan } from '../definitions';

import AbstractTree from './AbstractTree';

export default class EnumTree extends AbstractTree<DeclarationToken> {
  //the language used
  static definitions(lexer: Lexer) {
    super.definitions(lexer);
    lexer.define('EnumWord', (code, index) => scan(
      '_EnumWord', 
      /^enum/, 
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
    return this.enum();
  }

  /**
   * Builds the enum syntax
   */
  enum(): DeclarationToken {
    //enum
    const type = this._lexer.expect('EnumWord');
    this._lexer.expect('whitespace');
    //enum Foobar
    const id = this._lexer.expect<IdentifierToken>('CapitalIdentifier');
    this._lexer.expect('whitespace');
    //enum Foobar {
    this._lexer.expect('{');
    this.noncode();
    const props: PropertyToken[] = [];
    //enum Foobar {
    //  FOO "bar"
    //  ...
    this.dotry(() => {
      props.push(this.property());
    });
    //enum Foobar {
    //  FOO "bar"
    //  ...
    //}
    this._lexer.expect('}');
  
    return {
      type: 'VariableDeclaration',
      kind: 'enum',
      start: type.start,
      end: this._lexer.index,
      declarations: [
        {
          type: 'VariableDeclarator',
          start: id.start,
          end: this._lexer.index,
          id,
          init: {
            type: 'ObjectExpression',
            start: type.start,
            end: this._lexer.index,
            properties: props
          }
        }
      ]
    };
  }

  /**
   * Builds the property syntax
   */
  property(): PropertyToken {
    //FOO
    const key = this._lexer.expect<IdentifierToken>('UpperIdentifier');
    this._lexer.expect('whitespace');
    //FOO "bar"
    const value = this._lexer.expect<LiteralToken>(scalar);
    this._lexer.expect('whitespace');
    this.noncode();
    return {
      type: 'Property',
      kind: 'init',
      start: key.start,
      end: value.end,
      method: false,
      shorthand: false,
      computed: false,
      key,
      value
    };
  }
};