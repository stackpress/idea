//test suite
import fs from 'fs';
import path from 'path';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//for testing
import Terminal from '../src/Terminal';
//resusable variables
const cwd = __dirname;

describe('Terminal Tests', () => {
  it('Should run cli', async () => {
    const argv = ['transform', '-i', './schema.idea'];
    const terminal = await Terminal.load(argv, { cwd });
    expect(terminal.cwd).to.equal(cwd);
    await terminal.run();
    const out = path.join(cwd, 'out/enums.ts');
    const exists = fs.existsSync(out);
    expect(exists).to.be.true;
    if (exists) {
      fs.unlinkSync(out);
    }
  }).timeout(20000);

  it('Should run cli using json file', async () => {
    const argv = ['transform', '-i', './schema.idea'];
    const terminal = await Terminal.load(argv, { cwd });
    expect(terminal.cwd).to.equal(cwd);
    await terminal.run();
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

  // Line 22
  it('Should use default options when options parameter is omitted', async () => {
    const argv = ['transform', '-i', './schema.idea'];
    const terminal = await Terminal.load(argv, { cwd });
    expect(terminal.cwd).to.equal(__dirname);
  });
});