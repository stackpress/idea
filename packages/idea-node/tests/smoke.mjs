import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { final, parse, parseAst, tokenize } from '../src/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(
  join(here, '..', '..', 'idea-rust', 'tests', 'fixtures', 'schema.idea'),
  'utf8'
);

process.env.DATABASE_URL = 'test';

assert.ok(tokenize(fixture).length > 0);
assert.equal(parseAst(fixture).kind, 'schema');

const result = final(fixture);
assert.ok(result.plugin['./custom-plugin']);
assert.ok(result.enum.Roles);
assert.ok(result.type.Address);
assert.ok(result.model.User);
assert.ok(parse(fixture).plugin['./custom-plugin']);
