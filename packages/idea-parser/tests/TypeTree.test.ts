import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
//NOTE: no extensions in tests because it's excluded in tsconfig.json and
//we are testing in a typescript environment via `ts-mocha -r tsx` (esm)
import TypeTree from '../src/trees/TypeTree';

use(deepEqualInAnyOrder);

/*
* The cleanAST function is used to remove start and end
* properties from ASTs for comparison.
*/
const cleanAST = (node: any) => {
  if (typeof node === 'object' && node !== null) {
    const { start, end, ...rest } = node;
    return Object.keys(rest).reduce((acc, key) => {
      acc[key] = Array.isArray(rest[key])
        ? rest[key].map(cleanAST)
        : cleanAST(rest[key]);
      return acc;
    }, {});
  }
  return node;
};

describe('Type Tree', () => {
  it('Should parse Type', async () => {
    const actualRaw = TypeTree.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/type.idea`, 'utf8'));
    const expectedRaw = JSON.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/type.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const expected = cleanAST(expectedRaw);
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
  it('Should be immutable', async () => {
    const actualRaw = TypeTree.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/mutable.idea`, 'utf8'));
    const expectedRaw = JSON.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/mutable.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const expected = cleanAST(expectedRaw);
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });


  // Line 39 - 40
  it('Should correctly identify "typeword" token at the start of the input string', () => {
    const lexerMock = {
      define: (name: string, callback: Function) => {
        if (name === 'TypeWord') {
          const result = callback('type Example', 0);
          expect(result).to.deep.equal({
            type: '_TypeWord',
            start: 0,
            end: 4,
            value: 'type',
            raw: 'type'
          });
        }
      }
    };
    TypeTree.definitions(lexerMock as any);
  });

  // Line 55
  it('Should throw an error when the input code is an empty string', () => {
    expect(() => {
      const lexerMock = {
        expect: (tokenType: string) => { throw new Error('Unexpected end of input'); },
        load: () => { }
      };
      const typeTree = new TypeTree();
      (typeTree as any)._lexer = lexerMock;
      typeTree.parse('');
    }).to.throw(Error, 'Unexpected end of input');
  });
});
