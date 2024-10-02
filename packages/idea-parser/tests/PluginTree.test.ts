import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import PluginTree from '../src/trees/PluginTree';

use(deepEqualInAnyOrder);

describe('Plugin Tree', () => {
  it('Should parse Plugin', async () => {
    const actual = PluginTree.parse(fs.readFileSync(`${__dirname}/fixtures/plugin.idea`, 'utf8'));
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/plugin.json`, 'utf8'));
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
