#!/usr/bin/env node
import { Terminal } from '@stackpress/idea-transformer';
new Terminal(process.argv.slice(2), process.cwd()).run();