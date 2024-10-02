import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import ModelTree from '../src/trees/ModelTree';

use(deepEqualInAnyOrder);

describe('Model Tree', () => {
  it('Should parse Model', async () => {
    const actual = ModelTree.parse(fs.readFileSync(`${__dirname}/fixtures/model.idea`, 'utf8'));
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/model.json`, 'utf8'));
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
