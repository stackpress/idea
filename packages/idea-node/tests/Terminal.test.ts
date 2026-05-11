import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from 'chai';
import { describe, it } from 'mocha';

import { Terminal } from '../src/index.js';

const cwd = path.dirname(fileURLToPath(import.meta.url));

describe('Terminal Tests', () => {
  it('Should expose terminal defaults from the merged package', async () => {
    const terminal = await Terminal.load(['transform'], { cwd });

    expect(terminal.cwd).to.equal(cwd);
    expect(terminal.extname).to.equal('.idea');
  });

  it('Should run the transform command through the public CLI entrypoint', async () => {
    const terminal = await Terminal.load(['transform'], { cwd });
    const output = path.join(cwd, 'out/enums.ts');

    await terminal.run();

    expect(fs.existsSync(output)).to.equal(true);

    if (fs.existsSync(output)) {
      fs.unlinkSync(output);
    }
  }).timeout(20000);
});
