import fs from 'fs';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import PropTree from '../src/trees/PropTree';

describe('Prop Tree', () => {
  it('Should parse Prop', async () => {
    const actual = PropTree.parse(fs.readFileSync(`${__dirname}/fixtures/prop.idea`, 'utf8'));
    const expected = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/prop.json`, 'utf8'));
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(expected);
  });
});
