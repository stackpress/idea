import fs from 'fs';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//NOTE: no extensions in tests because it's excluded in tsconfig.json and
//we are testing in a typescript environment via `ts-mocha -r tsx` (esm)
import PropTree from '../src/trees/PropTree';


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

describe('Prop Tree', () => {
  it('Should parse Prop', async () => {
    const actualRaw = PropTree.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/prop.idea`, 'utf8'));
    const expectedRaw = JSON.parse(fs.readFileSync(`${import.meta.dirname}/fixtures/prop.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const expected = cleanAST(expectedRaw);
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });

  // Line 36
  it('Should throw an error when the input code is an emty string', () => {
    expect(() => {
      const lexerMock = {
        expect: (tokenType: string) => { throw new Error('Unexpected end of input'); },
        load: () => {}
      };
      const propTree = new PropTree();
      (propTree as any)._lexer = lexerMock;
      propTree.parse('');
    }).to.throw(Error, 'Unexpected end of input');
  });



});
