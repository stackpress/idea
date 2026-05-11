import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '..', '..');

const version = process.argv[2];

if (!version) {
  throw new Error('Expected a version argument, for example: 0.9.2');
}

const packageFile = path.join(root, 'packages', 'idea-node', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

for (const name of Object.keys(packageJson.optionalDependencies || {})) {
  packageJson.optionalDependencies[name] = version;
}

fs.writeFileSync(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(`prepared packages/idea-node/package.json for publish version ${version}`);
