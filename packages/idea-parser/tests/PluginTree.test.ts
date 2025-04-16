import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
//NOTE: no extensions in tests because it's excluded in tsconfig.json and
//we are testing in a typescript environment via `ts-mocha -r tsx` (esm)
import PluginTree from '../src/trees/PluginTree';

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

describe('Plugin Tree', () => {
  it('Should parse Plugin', async () => {
    const actualRaw = PluginTree.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/plugin.idea`, 'utf8'));
    const expectedRaw = JSON.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/plugin.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const expected = cleanAST(expectedRaw);
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });

  // Line 36
  it('Should throw an error when the input code is an empty string', () => {
    expect(() => {
      const lexerMock = {
        expect: (tokenType: string) => { throw new Error('Unexpected end of input'); },
        load: () => {}
      };
      const pluginTree = new PluginTree();
      (pluginTree as any)._lexer = lexerMock; 
      pluginTree.parse('');
    }).to.throw(Error, 'Unexpected end of input');
  });
  
});
