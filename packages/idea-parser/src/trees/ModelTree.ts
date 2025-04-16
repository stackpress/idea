//models
import { 
  DeclarationToken, 
  IdentifierToken, 
  PropertyToken 
} from '../types.js';

import Lexer from '../Lexer.js';
import TypeTree from './TypeTree.js';

import { scan } from '../definitions.js';

export default class ModelTree extends TypeTree {
  //the language used
  static definitions(lexer: Lexer) {
    super.definitions(lexer);
    lexer.define('ModelWord', (code, index) => scan(
      '_ModelWord', 
      /^model/, 
      code, 
      index
    ));
    return lexer;
  }

  /**
   * (Main) Builds the syntax tree
   */
  static parse(code: string, start = 0) {
    return new ModelTree().parse(code, start);
  }

  /**
   * Builds the model syntax
   */
  model(): DeclarationToken {
    //model
    const type = this._lexer.expect('ModelWord');
    this._lexer.expect('whitespace');
    //model Foobar
    const id = this._lexer.expect<IdentifierToken>('CapitalIdentifier');
    //model Foobar!
    const final = this._lexer.optional('!');
    this._lexer.expect('whitespace');
    const properties: PropertyToken[] = [];
    //model Foobar @id("foo" "bar")
    this.dotry(() => {
      properties.push(this.parameter());
      this.noncode();
    });
    this.noncode();
    //model Foobar @id("foo" "bar") {
    this._lexer.expect('{');
    this.noncode();
    const columns: PropertyToken[] = [];
    //model Foobar @id("foo" "bar") {
    //  foo String @id("foo" "bar")
    //  ...
    this.dotry(() => {
      columns.push(this.property());
    });
    //model Foobar @id("foo" "bar") {
    //  foo String @id("foo" "bar")
    //  ...
    //}
    this._lexer.expect('}');
  
    return {
      type: 'VariableDeclaration',
      kind: 'model',
      mutable: !Boolean(final),
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

  /**
   * Builds the model syntax
   */
  parse(code: string, start = 0) {
    this._lexer.load(code, start);
    return this.model();
  }
};