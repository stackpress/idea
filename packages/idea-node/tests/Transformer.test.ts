import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from 'chai';
import { describe, it } from 'mocha';

import type { TypeConfig } from '../src/index.js';

import Transformer from '../src/Transformer.js';

const cwd = path.dirname(fileURLToPath(import.meta.url));
const idea = path.resolve(cwd, 'schema.idea');
const use = path.resolve(cwd, 'use.idea');

describe('Transformer Tests', () => {
  it('Should get processed schema', async () => {
    const transformer = await Transformer.load(idea, { cwd });
    const actual = await transformer.schema();
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
    expect(actual.model?.Profile?.columns[0].name).to.equal('id');
    expect(actual.model?.Profile?.columns[1].name).to.equal('addresses');
    expect(actual.model?.Profile?.columns[2].attributes.label?.[0])
      .to.equal('Full Name');
    expect(
      actual.model?.File?.columns.find(c => c.name === 'Hash')
    ).to.be.undefined;
  }).timeout(20000);

  it('Should make enums', async () => {
    const transformer = await Transformer.load(idea, { cwd });
    await transformer.transform();
    const out = path.join(cwd, 'out/enums.ts');
    const exists = fs.existsSync(out);
    expect(exists).to.be.true;
    if (exists) {
      fs.unlinkSync(out);
    }
  }).timeout(20000);

  it('Should throw an error if the input file does not exist', async () => {
    const nonExistentPath = path.resolve(cwd, 'nonexistent.idea');
    const transformer = await Transformer.load(nonExistentPath, { cwd });

    let trigger = 0;

    try {
      await transformer.schema();
    } catch (error) {
      const exception = error as Error;

      expect(exception.message)
        .to.equal(`Input file ${nonExistentPath} does not exist`);
      trigger = 1;
    }

    expect(trigger).to.equal(1);
  });

  it('Should throw an error if no plugins are defined in the schema file', async () => {
    const transformer = await Transformer.load(idea, { cwd });
    transformer['_schema'] = {
      ...transformer['_schema'],
      plugin: undefined
    };

    let trigger = 0;

    try {
      await transformer.transform();
    } catch (error) {
      const exception = error as Error;

      expect(exception.message).to.equal('No plugins defined in schema file');
      trigger = 1;
    }

    expect(trigger).to.equal(1);
  });

  it('Should merge child attributes into parent attributes', async () => {
    const transformer = await Transformer.load(idea, { cwd });
    const parentType = { attributes: { name: 'parent' } };
    const childType = { attributes: { name: 'child' } };

    transformer['_merge'](
      parentType as unknown as TypeConfig,
      childType as unknown as TypeConfig
    );

    expect(parentType.attributes).to.deep.equal({ name: 'parent' });
  });

  it('Should keep schema loading stable across idea and imported fixtures', async () => {
    const transformerIdea = await Transformer.load(idea, { cwd });
    const transformerJson = await Transformer.load(use, { cwd });
    const useIdea = await transformerIdea.schema();
    const useJson = await transformerJson.schema();

    expect(useJson).to.deep.equal(useIdea);
  });
});
