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
  it('Should run cli', () => {
    const terminal = new Terminal(['transform', '-i', './schema.idea'], { cwd });
    expect(terminal.cwd).to.equal(cwd);
    terminal.run();
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
  it('Should use default options when options parameter is omitted', () => {
    const args = ['transform', '-i', './schema.idea'];
    const terminal = new Terminal(args);
    expect(terminal.cwd).to.equal(process.cwd());
  });


});