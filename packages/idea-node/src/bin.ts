#!/usr/bin/env node

//idea-node
import { Terminal } from './index.js';

/**
 * Runs the CLI through the merged package entrypoint so published consumers
 * and workspace users execute the same code path.
 */
async function main() {
  const terminal = await Terminal.load(process.argv.slice(2));

  await terminal.run();
}

main().catch(console.error);
