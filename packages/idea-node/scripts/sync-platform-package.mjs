import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(dirname, '..');

const targets = {
  'android-arm64': 'idea-node-android-arm64',
  'android-arm-eabi': 'idea-node-android-arm-eabi',
  'darwin-universal': 'idea-node-darwin-universal',
  'darwin-x64': 'idea-node-darwin-x64',
  'darwin-arm64': 'idea-node-darwin-arm64',
  'freebsd-x64': 'idea-node-freebsd-x64',
  'linux-x64-musl': 'idea-node-linux-x64-musl',
  'linux-x64-gnu': 'idea-node-linux-x64-gnu',
  'linux-arm64-musl': 'idea-node-linux-arm64-musl',
  'linux-arm64-gnu': 'idea-node-linux-arm64-gnu',
  'linux-arm-musleabihf': 'idea-node-linux-arm-musleabihf',
  'linux-arm-gnueabihf': 'idea-node-linux-arm-gnueabihf',
  'linux-riscv64-musl': 'idea-node-linux-riscv64-musl',
  'linux-riscv64-gnu': 'idea-node-linux-riscv64-gnu',
  'linux-s390x-gnu': 'idea-node-linux-s390x-gnu',
  'win32-x64-msvc': 'idea-node-win32-x64-msvc',
  'win32-ia32-msvc': 'idea-node-win32-ia32-msvc',
  'win32-arm64-msvc': 'idea-node-win32-arm64-msvc'
};

/**
 * Local development still builds the native binary into the main package root.
 * Publishing will move binaries into optional platform packages, so we mirror
 * any locally built host binary into the matching package directory here.
 */
for (const [target, packageName] of Object.entries(targets)) {
  const binaryName = `idea_node.${target}.node`;
  const source = path.join(packageRoot, binaryName);

  if (!existsSync(source)) {
    continue;
  }

  const destinationRoot = path.resolve(packageRoot, '..', packageName);
  const destination = path.join(destinationRoot, binaryName);

  mkdirSync(destinationRoot, { recursive: true });
  copyFileSync(source, destination);
  console.log(`synced ${binaryName} -> ${packageName}`);
}
