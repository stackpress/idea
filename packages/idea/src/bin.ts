#!/usr/bin/env node
import { Terminal } from '@stackpress/idea-transformer';

async function main() {
  const terminal = await Terminal.load(process.argv.slice(2));
  await terminal.run();
}

main().catch(console.error);