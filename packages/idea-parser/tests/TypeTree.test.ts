import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import TypeTree from '../src/trees/TypeTree';

use(deepEqualInAnyOrder);

describe('Type Tree', () => {
  it('Should parse Type', async () => {
    const actual = TypeTree.parse(fs.readFileSync(`${__dirname}/fixtures/type.idea`, 'utf8'));
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/type.json`, 'utf8'));
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
