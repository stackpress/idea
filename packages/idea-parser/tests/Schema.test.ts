import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import SchemaTree from '../src/trees/SchemaTree';
import Compiler from '../src/types/Compiler';

use(deepEqualInAnyOrder);

describe('Schema Tree', () => {
  it('Should parse Schema', async () => {
    const actual = SchemaTree.parse(fs.readFileSync(`${__dirname}/fixtures/schema.idea`, 'utf8'));
    const schema = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/schema.json`, 'utf8'));
    //console.log(JSON.stringify(actual, null, 2));
    expect(actual).to.deep.equalInAnyOrder(schema);

    //console.log(JSON.stringify(Compiler.schema(actual), null, 2));
    const references = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/references.json`, 'utf8'));
    expect(Compiler.schema(actual)).to.deep.equalInAnyOrder(references);
    //console.log(JSON.stringify(Compiler.final(actual), null, 2));
    const final = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/final.json`, 'utf8'));
    expect(Compiler.final(actual)).to.deep.equalInAnyOrder(final);
  });
});
