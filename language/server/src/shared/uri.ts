import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * The language server uses file URIs everywhere, but filesystem work is
 * easier with absolute paths.
 */
export function toFsPath(uri: string) {
  return fileURLToPath(uri);
}

/**
 * LSP responses expect file URIs, so every resolved filesystem path flows
 * back through this helper.
 */
export function toFileUri(filePath: string) {
  return pathToFileURL(filePath).toString();
}

/**
 * Package-style imports need more than a relative lookup. Walking ancestor
 * directories lets the server behave sensibly in monorepos and in installed
 * package layouts without hard-coding a single repository structure.
 */
function candidatePaths(fromUri: string, source: string) {
  const start = path.dirname(toFsPath(fromUri));
  const directories: string[] = [];
  let current = start;

  while (true) {
    directories.push(current);
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return directories.flatMap(directory => [
    path.resolve(directory, source),
    path.resolve(directory, 'node_modules', source),
    path.resolve(directory, 'packages', source)
  ]);
}

/**
 * Plugin directives may point at either a concrete file or a package
 * directory, so resolution prefers the package entry files users are most
 * likely to have in practice.
 */
function resolveModuleEntry(candidate: string) {
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) {
    return null;
  }

  return [
    path.join(candidate, 'package.json'),
    path.join(candidate, 'index.js'),
    path.join(candidate, 'index.cjs'),
    path.join(candidate, 'index.mjs'),
    path.join(candidate, 'dist', 'index.js')
  ].find(entry => fs.existsSync(entry)) || null;
}

/**
 * Idea supports two different string-based path shapes:
 * schema imports that should land on `.idea` files and plugin targets that
 * should land on a package entry. Keeping both in one resolver avoids
 * duplicating the monorepo traversal rules.
 */
function resolvePathCandidate(fromUri: string, source: string, mode: 'schema' | 'module') {
  if (path.isAbsolute(source)) {
    return source;
  }

  if (source.startsWith('./') || source.startsWith('../')) {
    return path.resolve(path.dirname(toFsPath(fromUri)), source);
  }

  if (mode === 'schema') {
    return candidatePaths(fromUri, source)
      .find(candidate => candidate.endsWith('.idea') && fs.existsSync(candidate))
      || path.resolve(path.dirname(toFsPath(fromUri)), source);
  }

  return candidatePaths(fromUri, source)
    .map(resolveModuleEntry)
    .find(Boolean)
    || path.resolve(path.dirname(toFsPath(fromUri)), source);
}

/**
 * `use` directives always resolve to another Idea document.
 */
export function resolveImportUri(fromUri: string, source: string) {
  return toFileUri(resolvePathCandidate(fromUri, source, 'schema'));
}

/**
 * `plugin` directives resolve to a loadable package entry when possible.
 */
export function resolvePluginUri(fromUri: string, source: string) {
  return toFileUri(resolvePathCandidate(fromUri, source, 'module'));
}
