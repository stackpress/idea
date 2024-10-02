import type { 
  DataToken, 
  DeclarationToken, 
  IdentifierToken, 
  LiteralToken, 
  PropertyToken 
} from '../types';

import Lexer from '../types/Lexer';
import { data, scan } from '../definitions';

import AbstractTree from './AbstractTree';

export default class TypeTree extends AbstractTree<DeclarationToken> {
  static data = [ ...data, 'CapitalIdentifier' ];

  //the language used
  static definitions(lexer: Lexer) {
    super.definitions(lexer);
    lexer.define('Type', (code, index) => {
      const regexp = /^[A-Z][a-zA-Z0-9_]*((\[\])|\?)?/;
      const results = scan('Literal', regexp, code, index);
      if (results) {
        const square = code.substring(
          results.end, 
          results.end + 2
        );
        if (results.end > index && square === '[]') {
          results.end += 2;
          results.value += square;
        }
        results.raw = `"${results.value}"`;
      }
      return results;
    }); 
    lexer.define('TypeWord', (code, index) => scan(
      '_TypeWord', 
      /^type/, 
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
   * Builds the type syntax
   */
  parse(code: string, start = 0) {
    this._lexer.load(code, start);
    return this.type();
  }

  /**
   * Builds the parameter syntax
   */
  parameter(): PropertyToken {
    // @id
    const key = this._lexer.expect<IdentifierToken>('AttributeIdentifier');
    key.name = key.name.slice(1);
    const elements: DataToken[] = [];
    // @id(
    if (this._lexer.optional('(')) {
      this.noncode();
      // @id("foo" "bar"
      const data = (this.constructor as typeof TypeTree).data;
      //keep parsing data until we reach the end
      let results: DataToken|undefined;
      do {
        results = this._lexer.optional<DataToken>(data);
        if (results) {
          elements.push(results);
          this.noncode();
          continue;
        }
      } while(results);
      // @id("foo" "bar")
      this._lexer.expect(')');
    }
    //assuming no args
    return {
      type: 'Property',
      kind: 'init',
      start: key.start,
      end: this._lexer.index,
      method: false,
      shorthand: false,
      computed: false,
      key,
      value: elements.length ? {
        type: 'ArrayExpression',
        start: key.start,
        end: this._lexer.index,
        elements
      } : {
        type: 'Literal',
        start: key.start,
        end: this._lexer.index,
        value: true,
        raw: 'true'
      }
    };
  }

  /**
   * Builds the property syntax
   */
  property(): PropertyToken {
    //foo
    const key = this._lexer.expect<IdentifierToken>('CamelIdentifier');
    this._lexer.expect('whitespace');
    //foo String
    const value = this._lexer.expect<LiteralToken>('Type');
    this._lexer.expect('whitespace');
    const properties: PropertyToken[] = [];
    //foo String @id("foo" "bar") ...
    this.dotry(() => {
      properties.push(this.parameter());
      this.noncode();
    });
    return {
      type: 'Property',
      kind: 'init',
      start: key.start,
      end: this._lexer.index,
      method: false,
      shorthand: false,
      computed: false,
      key,
      value: {
        type: 'ObjectExpression',
        start: value.start,
        end: this._lexer.index,
        properties: [
          {
            type: 'Property',
            kind: 'init',
            start: value.start,
            end: value.end,
            method: false,
            shorthand: false,
            computed: false,
            key: {
              type: 'Identifier',
              start: value.start,
              end: value.end,
              name: 'type',
            },
            value
          },
          {
            type: 'Property',
            kind: 'init',
            start: value.start,
            end: this._lexer.index,
            method: false,
            shorthand: false,
            computed: false,
            key: {
              type: 'Identifier',
              start: value.start,
              end: value.end,
              name: 'attributes',
            },
            value: {
              type: 'ObjectExpression',
              start: value.start,
              end: value.end,
              properties
            }
          }
        ]
      } 
    };
  }

  /**
   * Builds the type syntax
   */
  type(): DeclarationToken {
    //type
    const type = this._lexer.expect('TypeWord');
    this._lexer.expect('whitespace');
    //type Foobar
    const id = this._lexer.expect<IdentifierToken>('CapitalIdentifier');
    this._lexer.expect('whitespace');
    const properties: PropertyToken[] = [];
    //type Foobar @id("foo" "bar")
    this.dotry(() => {
      properties.push(this.parameter());
      this.noncode();
    });
    this.noncode();
    //type Foobar @id("foo" "bar") {
    this._lexer.expect('{');
    this.noncode();
    const columns: PropertyToken[] = [];
    //type Foobar @id("foo" "bar") {
    //  foo String @id("foo" "bar")
    //  ...
    this.dotry(() => {
      columns.push(this.property());
    });
    //type Foobar @id("foo" "bar") {
    //  foo String @id("foo" "bar")
    //  ...
    //}
    this._lexer.expect('}');
  
    return {
      type: 'VariableDeclaration',
      kind: 'type',
      start: type.start,
      end: this._lexer.index,
      declarations: [{
        type: 'VariableDeclarator',
        start: type.start,
        end: this._lexer.index,
        id,
        init: {
          type: 'ObjectExpression',
          start: type.start,
          end: this._lexer.index,
          properties: [
            {
              type: 'Property',
              kind: 'init',
              start: type.start,
              end: this._lexer.index,
              method: false,
              shorthand: false,
              computed: false,
              key: {
                type: 'Identifier',
                start: type.start,
                end: type.end,
                name: 'attributes',
              },
              value: {
                type: 'ObjectExpression',
                start: type.start,
                end: type.end,
                properties
              }
            },
            {
              type: 'Property',
              kind: 'init',
              start: type.start, 
              end: this._lexer.index,
              method: false,
              shorthand: false,
              computed: false,
              key: {
                type: 'Identifier',
                start: type.start,
                end: type.end,
                name: 'columns',
              },
              value: {
                type: 'ObjectExpression',
                start: type.start,
                end: type.end,
                properties: columns
              }
            }
          ]
        }
      }]
    };
  }
};