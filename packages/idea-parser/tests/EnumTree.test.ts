import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import EnumTree from '../src/trees/EnumTree';

use(deepEqualInAnyOrder);
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

describe('Enum Tree', () => {
  it('Should parse Enums', async () => {
    const actualRaw = EnumTree.parse(fs.readFileSync(`${__dirname}/fixtures/enum.idea`, 'utf8'));
    const expectedRaw = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/enum.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const expected = cleanAST(expectedRaw);
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
