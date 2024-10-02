import type { 
  LiteralToken, 
  ObjectToken, 
  ArrayToken, 
  UnknownToken 
} from '../src/types';

import { describe, it } from 'mocha';
import { expect } from 'chai';
import Lexer from '../src/types/Lexer';
import Compiler from '../src/types/Compiler';
import definitions, { data } from '../src/definitions';

describe('Lexer/Compiler', () => {
  it('Should parse Args', async () => {
    const lexer = new Lexer();
    Object.keys(definitions).forEach((key) => {
      lexer.define(key, definitions[key]);
    });

    //float 
    (() => {
      lexer.load('4.4');
      const token = lexer.expect<LiteralToken>(data);
      expect(token.type).to.equal('Literal');
      expect(token.value).to.equal(4.4);
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(3);
    })();
    //int
    (() => {
      lexer.load('44');
      const token = lexer.expect<LiteralToken>(data);
      expect(token.type).to.equal('Literal');
      expect(token.value).to.equal(44);
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(2);
    })();
    //null
    (() => {
      lexer.load('null');
      const token = lexer.expect<LiteralToken>(data);
      expect(token.type).to.equal('Literal');
      expect(token.value).to.equal(null);
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(4);
    })();
    //true
    (() => {
      lexer.load('true');
      const token = lexer.expect<LiteralToken>(data);
      expect(token.type).to.equal('Literal');
      expect(token.value).to.equal(true);
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(4);
    })();
    //false
    (() => {
      lexer.load('false');
      const token = lexer.expect<LiteralToken>(data);
      expect(token.type).to.equal('Literal');
      expect(token.value).to.equal(false);
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(5);
    })();
    //string
    (() => {
      lexer.load('"foobar"');
      const token = lexer.expect<LiteralToken>(data);
      expect(token.type).to.equal('Literal');
      expect(token.value).to.equal('foobar');
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(8);
    })();
    //basic object
    (() => {
      lexer.load('{ foo "bar" bar 4.4 }');
      const token = lexer.expect<ObjectToken>(data);
      expect(token.type).to.equal('ObjectExpression');

      const actual = Compiler.object(token);
      expect(actual.foo).to.equal('bar');
      expect(actual.bar).to.equal(4.4);
    })();
    //object object
    (() => {
      lexer.load('{ foo "bar" bar 4.4 zoo { foo false bar null } }');
      const token = lexer.expect<ObjectToken>(data);
      expect(token.type).to.equal('ObjectExpression');

      const actual = Compiler.object<{
        foo: string;
        bar: number;
        zoo: { foo: boolean, bar: null };
      }>(token);
      expect(actual.foo).to.equal('bar');
      expect(actual.bar).to.equal(4.4);
      expect(actual.zoo.foo).to.equal(false);
      expect(actual.zoo.bar).to.equal(null);
    })();
    //object array
    (() => {
      lexer.load('{ foo "bar" bar 4.4 zoo [ 4 true ] }');
      const token = lexer.expect<ObjectToken>(data);
      expect(token.type).to.equal('ObjectExpression');

      const actual = Compiler.object<{
        foo: string;
        bar: number;
        zoo: [number, boolean];
      }>(token);
      expect(actual.foo).to.equal('bar');
      expect(actual.bar).to.equal(4.4);
      expect(actual.zoo[0]).to.equal(4);
      expect(actual.zoo[1]).to.equal(true);
    })();
    //basic array
    (() => {
      lexer.load('[ 4.4 "bar" false null ]');
      const token = lexer.expect<ArrayToken>(data);
      expect(token.type).to.equal('ArrayExpression');

      const actual = Compiler.array(token);
      expect(actual[0]).to.equal(4.4);
      expect(actual[1]).to.equal('bar');
      expect(actual[2]).to.equal(false);
      expect(actual[3]).to.equal(null);
    })();
    //array array
    (() => {
      lexer.load('[ 4.4 "bar" false null [ 4 true ] ]');
      const token = lexer.expect<ArrayToken>(data);
      expect(token.type).to.equal('ArrayExpression');

      const actual = Compiler.array<[
        number,
        string,
        boolean,
        null,
        [number, boolean]
      ]>(token);
      expect(actual[0]).to.equal(4.4);
      expect(actual[1]).to.equal('bar');
      expect(actual[2]).to.equal(false);
      expect(actual[3]).to.equal(null);
      expect(actual[4][0]).to.equal(4);
      expect(actual[4][1]).to.equal(true);
    })();
    //array object
    (() => {
      lexer.load('[ 4.4 "bar" false null { foo false bar null } ]');
      const token = lexer.expect<ArrayToken>(data);
      expect(token.type).to.equal('ArrayExpression');

      const actual = Compiler.array<[
        number,
        string,
        boolean,
        null,
        { foo: boolean, bar: null }
      ]>(token);
      expect(actual[0]).to.equal(4.4);
      expect(actual[1]).to.equal('bar');
      expect(actual[2]).to.equal(false);
      expect(actual[3]).to.equal(null);
      expect(actual[4].foo).to.equal(false);
      expect(actual[4].bar).to.equal(null);
    })();
    //array object
    (() => {
      lexer.load('[ { label "United States" value "US" } { label "Mexico" value "MX" } { label "Canada" value "CA" } ]');
      const token = lexer.expect<ArrayToken>(data);
      expect(token.type).to.equal('ArrayExpression');

      const actual = Compiler.array<{ label: string, value: string }[]>(token);
      expect(actual[0].label).to.equal('United States');
      expect(actual[0].value).to.equal('US');
      expect(actual[1].label).to.equal('Mexico');
      expect(actual[1].value).to.equal('MX');
      expect(actual[2].label).to.equal('Canada');
      expect(actual[2].value).to.equal('CA');
    })();
  });

  it('Should parse comments', async () => {
    const lexer = new Lexer();
    Object.keys(definitions).forEach((key) => {
      lexer.define(key, definitions[key]);
    });

    (() => {
      lexer.load('/* some comment */');
      const token = lexer.expect<UnknownToken>('note');
      expect(token.type).to.equal('_Note');
      expect(token.value).to.equal('/* some comment */');
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(18);
    })();

    (() => {
      lexer.load('//some comment');
      const token = lexer.expect<UnknownToken>('comment');
      expect(token.type).to.equal('_Comment');
      expect(token.value).to.equal('//some comment');
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(14);
    })();

    (() => {
      lexer.load('/* some // comment */');
      const token = lexer.expect<UnknownToken>('note');
      expect(token.type).to.equal('_Note');
      expect(token.value).to.equal('/* some // comment */');
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(21);
    })();

    (() => {
      lexer.load('/* some // comment */');
      const token = lexer.expect<UnknownToken>([ 'note', 'comment' ]);
      expect(token.type).to.equal('_Note');
      expect(token.value).to.equal('/* some // comment */');
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(21);
    })();

    (() => {
      lexer.load('//so/*me com*/ment');
      const token = lexer.expect<UnknownToken>('comment');
      expect(token.type).to.equal('_Comment');
      expect(token.value).to.equal('//so/*me com*/ment');
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(18);
    })();

    (() => {
      lexer.load('//so/*me com*/ment');
      const token = lexer.expect<UnknownToken>([ 'note', 'comment' ]);
      expect(token.type).to.equal('_Comment');
      expect(token.value).to.equal('//so/*me com*/ment');
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(18);
    })();

    (() => {
      lexer.load(`/* 
        some 
        // comment
      */`);
      const token = lexer.expect<UnknownToken>('note');
      expect(token.type).to.equal('_Note');
      expect(token.value).to.equal("/* \n        some \n        // comment\n      */");
      expect(token.start).to.equal(0);
      expect(token.end).to.equal(45);
    })();
  });
});
