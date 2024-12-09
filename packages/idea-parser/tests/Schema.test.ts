import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
import SchemaTree from '../src/trees/SchemaTree';
import Compiler from '../src/Compiler';

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

describe('Schema Tree', () => {
  it('Should parse Schema', async () => {
    const actualRaw = SchemaTree.parse(fs.readFileSync(`${__dirname}/fixtures/schema.idea`, 'utf8'));
    const schemaRaw = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/schema.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const schema = cleanAST(schemaRaw);
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
