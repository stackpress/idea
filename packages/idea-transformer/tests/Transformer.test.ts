//test suite
import fs from 'fs';
import path from 'path';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//for testing
import Transformer from '../src/Transformer';
import { TypeConfig } from '@stackpress/idea-parser';
//resusable variables
const cwd = __dirname;
const idea = path.resolve(cwd, 'schema.idea');
const use = path.resolve(cwd, 'use.idea');

describe('Transformer Tests', () => {
  it('Should get processed schema', () => {
    const transformer = new Transformer(idea, { cwd });
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
    //merge checks
    expect(actual.model?.Profile?.columns[0].name).to.equal('id');
    expect(actual.model?.Profile?.columns[1].name).to.equal('addresses');
    expect(actual.model?.Profile?.columns[2].attributes.label?.[0]).to.equal('Full Name');
    //final checks
    expect(
      // I'll exchange the references to the Hash to fix the issue 
      // I will use Hash to provide the unique identifier 
      // to cover the Line 80 - 81: schema.mode[name] = model; continue;
      actual.model?.File?.columns.find(c => c.name === 'Hash')
    ).to.be.undefined;
  }).timeout(20000);

  it('Should make enums', async () => {
    const transformer = new Transformer(idea, { cwd });
    await transformer.transform();
    const out = path.join(cwd, 'out/enums.ts');
    const exists = fs.existsSync(out);
    expect(exists).to.be.true;
    if (exists) {
      fs.unlinkSync(out);
    }
  }).timeout(20000);


  /*
 * UNIT TEST TO COVER THE UNCOVERED LINES
 */

  // LINE 26
  it('Should throw an error if the input file does not exist', () => {
    const nonExistentPath = path.resolve(cwd, 'nonexistent.idea');
    const transformer = new Transformer(nonExistentPath, { cwd });
    expect(() => transformer.schema).to.throw(`Input file ${nonExistentPath} does not exist`);
  });

  // lINE 109
  it('Should throw an error if no plugins are defined in the schema file', async () => {
    // Create a schema with no plugins
    const transformer = new Transformer(idea, { cwd });
    // Temporarily set the schema.plugins to undefined or an empty object to simulate the missing plugins
    transformer['_schema'] = {
      ...transformer['_schema'],
      plugin: undefined,
    };
    let trigger = 0;
    try {
      await transformer.transform()
    } catch(e) {
      expect(e.message).to.equal('No plugins defined in schema file');
      trigger = 1;
    }
    expect(trigger).to.equal(1);
  });


  /*
  * ADD MORE UNIT TEST TO ACHIEVE 85%
  */

  it('Should merge child attributes into parent attributes', () => {
    const transformer = new Transformer(idea, { cwd });
    const parentType = { attributes: { name: 'parent' } };
    const childType = { attributes: { name: 'child' } };
    transformer['_merge'](parentType as unknown as TypeConfig, childType as unknown as TypeConfig);
    expect(parentType.attributes).to.deep.equal({ name: 'parent' });
  });

  it('Should allow use json file into an idea file', () => {
    const transformerIdea = new Transformer(idea, { cwd });
    const transformerJson = new Transformer(use, { cwd });
    const useIdea = transformerIdea.schema.use;
    const useJson = transformerJson.schema.use;
    expect(useJson).to.deep.equal(useIdea);
  });


});