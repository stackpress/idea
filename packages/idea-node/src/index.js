import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(import.meta.url));

function loadBinding() {
  const candidates = [
    join(root, '..', 'idea_node.darwin-arm64.node'),
    join(root, '..', 'idea_node.darwin-x64.node'),
    join(root, '..', 'idea_node.linux-x64-gnu.node'),
    join(root, '..', 'idea_node.linux-arm64-gnu.node'),
    join(root, '..', 'idea_node.win32-x64-msvc.node')
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return require(candidate);
    }
  }

  throw new Error(
    'Unable to locate the native idea-node binding. Run `npm run build --workspace packages/idea-node` first.'
  );
}

function normalizeError(error) {
  try {
    const payload = JSON.parse(error.message);
    const normalized = new Error(payload.message);
    normalized.code = payload.code;
    normalized.start = payload.start;
    normalized.end = payload.end;
    return normalized;
  } catch {
    return error;
  }
}

const binding = loadBinding();

export function tokenize(source) {
  try {
    return binding.tokenize(source);
  } catch (error) {
    throw normalizeError(error);
  }
}

export function parse(source) {
  try {
    return binding.parse(source);
  } catch (error) {
    throw normalizeError(error);
  }
}

export function parseAst(source) {
  try {
    return binding.parseAst(source);
  } catch (error) {
    throw normalizeError(error);
  }
}

export function final(source) {
  try {
    return binding.final(source);
  } catch (error) {
    throw normalizeError(error);
  }
}
