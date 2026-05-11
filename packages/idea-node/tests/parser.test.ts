import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { final, parse, parseAst, tokenize } from '../src/index.js';

const cwd = path.dirname(fileURLToPath(import.meta.url));

const fixture = readFileSync(
  path.join(cwd, '..', '..', 'idea-rust', 'tests', 'fixtures', 'schema.idea'),
  'utf8'
);

describe('Parser Tests', () => {
  it('Should tokenize schema', () => {
    const tokens = tokenize(fixture);
    expect(tokens.length).to.be.greaterThan(0);
  });

  it('Should parse schema into config', () => {
    process.env.DATABASE_URL = 'test';
    const schema = parse(fixture);
    expect(schema.plugin?.['./custom-plugin']).to.be.an('object');
    expect(schema.enum?.Roles).to.be.an('object');
  });

  it('Should parse schema into ast', () => {
    const schema = parseAst(fixture);
    expect(schema.kind).to.equal('schema');
    expect(schema.body.length).to.be.greaterThan(0);
  });

  it('Should finalize schema', () => {
    process.env.DATABASE_URL = 'test';
    const schema = final(fixture);
    expect(schema.plugin?.['./custom-plugin']).to.be.an('object');
    expect(schema.type?.Address).to.be.an('object');
    expect(schema.model?.User).to.be.an('object');
  });

  it('Should normalize parser errors from the native binding', () => {
    let trigger = 0;

    try {
      parse('model Broken {');
    } catch (error) {
      const exception = error as Error & {
        code?: string,
        start?: number,
        end?: number
      };

      expect(exception.message).to.be.a('string');
      expect(exception.code).to.be.a('string');
      expect(exception.start).to.be.a('number');
      expect(exception.end).to.be.a('number');
      trigger = 1;
    }

    expect(trigger).to.equal(1);
  });
});
