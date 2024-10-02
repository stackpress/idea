//test suite
import fs from 'fs';
import path from 'path';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//for testing
import Loader from '../src/Loader';
import Transformer from '../src/Transformer';
import makeEnums from './in/make-enums';
//resusable variables
const cwd = __dirname;
const idea = Loader.absolute('./schema.idea', cwd);

describe('Transformer Tests', () => {
  it('Should get processed schema', () => {
    const transformer = new Transformer(idea, cwd);
    const actual = transformer.schema;
    const output = actual.plugin?.['./in/make-enums'].output;
    expect(output).to.equal('./out/enums.ts');
    expect(actual.model && 'Profile' in actual.model).to.be.true;
    expect(actual.model && 'Auth' in actual.model).to.be.true;
    expect(actual.model && 'Connection' in actual.model).to.be.true;
    expect(actual.model && 'File' in actual.model).to.be.true;
    expect(actual.type && 'Address' in actual.type).to.be.true;
    expect(actual.type && 'Contact' in actual.type).to.be.true;
    expect(actual.enum && 'Roles' in actual.enum).to.be.true;
    expect(actual.prop && 'Config' in actual.prop).to.be.true;
  }).timeout(20000);

  it('Should make enums', () => {
    const transformer = new Transformer<{}>(idea, cwd);
    transformer.transform();
    const out = path.join(cwd, 'out/enums.ts');
    const exists = fs.existsSync(out);
    expect(exists).to.be.true;
    if (exists) {
      fs.unlinkSync(out);
    }
  }).timeout(20000);
});