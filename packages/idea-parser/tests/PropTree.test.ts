import fs from 'fs';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import PropTree from '../src/trees/PropTree';

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
    const actualRaw = PropTree.parse(fs.readFileSync(`${__dirname}/fixtures/prop.idea`, 'utf8'));
    const expectedRaw = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/prop.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const expected = cleanAST(expectedRaw);
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
