import fs from 'fs';
import { describe, it } from 'mocha';
import { expect, use } from 'chai';
import deepEqualInAnyOrder from 'deep-equal-in-any-order';
//NOTE: no extensions in tests because it's excluded in tsconfig.json and
//we are testing in a typescript environment via `ts-mocha -r tsx` (esm)
import { parse, final } from '../src';

use(deepEqualInAnyOrder);

const dirname = typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;

/*
* The cleanAST function is used to remove start and end
* properties from ASTs for comparison.
*/
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
    const actualRaw = parse(fs.readFileSync(`${dirname}/fixtures/schema.idea`, 'utf8'));
    const schemaRaw = JSON.parse(fs.readFileSync(`${dirname}/fixtures/schema.json`, 'utf8'));

    const actual = cleanAST(actualRaw);
    const schema = cleanAST(schemaRaw);
    console.log(JSON.stringify(JSON.parse(actual), null, 2));
    expect(actual).to.deep.equalInAnyOrder(schema);

    const last = JSON.parse(fs.readFileSync(`${dirname}/fixtures/final.json`, 'utf8'));
    //console.log(last, null, 2));
    expect(final(actual)).to.deep.equalInAnyOrder(last);
  });
});
