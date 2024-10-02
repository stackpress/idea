import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import EnumTree from '../src/trees/EnumTree';

use(deepEqualInAnyOrder);

describe('Enum Tree', () => {
  it('Should parse Enums', async () => {
    const actual = EnumTree.parse(fs.readFileSync(`${__dirname}/fixtures/enum.idea`, 'utf8'));
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/enum.json`, 'utf8'));
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
