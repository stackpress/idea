import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import ModelTree from '../src/trees/ModelTree';

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

describe('Model Tree', () => {
  it('Should parse Model', async () => {
    const actualRaw = ModelTree.parse(fs.readFileSync(`${__dirname}/fixtures/model.idea`, 'utf8'));
    const expectedRaw = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/model.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const expected = cleanAST(expectedRaw);
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
