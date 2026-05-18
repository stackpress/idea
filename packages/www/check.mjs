import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, '..', '..');
const docsDir = path.join(rootDir, 'docs');

const requiredFiles = [
  'index.html',
  '.nojekyll',
  'assets/site.css',
  'assets/brand/idea.svg',
  'assets/brand/idea.png',
  'assets/brand/icon.png',
  'getting-started/index.html',
  'reference/specification/index.html'
];

await check();

async function check() {
  const htmlFiles = await collectHtmlFiles(docsDir);
  const failures = [];

  for (const filepath of requiredFiles) {
    try {
      await fs.access(path.join(docsDir, filepath));
    } catch {
      failures.push(`Missing required output: ${filepath}`);
    }
  }

  if (!htmlFiles.length) {
    failures.push('No generated HTML files found in docs/.');
  }

  for (const filepath of htmlFiles) {
    const html = await fs.readFile(filepath, 'utf8');
    const relpath = path.relative(docsDir, filepath).split(path.sep).join('/');

    assertIncludes(failures, relpath, html, '<title>');
    assertIncludes(failures, relpath, html, 'name="description"');
    assertIncludes(failures, relpath, html, 'rel="canonical"');
    assertIncludes(failures, relpath, html, 'property="og:title"');
    assertIncludes(failures, relpath, html, 'name="twitter:card"');

    if (html.includes('{{') || html.includes('}}')) {
      failures.push(`${relpath}: unresolved template placeholder found.`);
    }

    if (hasLocalMarkdownHref(html)) {
      failures.push(`${relpath}: leaked local .md link found in generated HTML.`);
    }

    for (const href of collectInternalReferences(html)) {
      const resolved = resolveOutputReference(filepath, href);
      if (!resolved) {
        continue;
      }

      try {
        await fs.access(resolved);
      } catch {
        failures.push(`${relpath}: broken internal reference ${href}`);
      }
    }
  }

  if (failures.length) {
    console.error('www:check failed');
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`www:check passed (${htmlFiles.length} HTML files checked)`);
}

async function collectHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullpath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(fullpath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullpath);
    }
  }

  return files;
}

function assertIncludes(failures, relpath, html, marker) {
  if (!html.includes(marker)) {
    failures.push(`${relpath}: missing ${marker}`);
  }
}

function collectInternalReferences(html) {
  const refs = [];
  const pattern = /\b(?:href|src)="([^"]+)"/g;
  let match = pattern.exec(html);

  while (match) {
    const value = match[1];
    if (
      value &&
      !value.startsWith('#') &&
      !/^(https?:|mailto:|data:)/.test(value)
    ) {
      refs.push(value);
    }
    match = pattern.exec(html);
  }

  return refs;
}

function hasLocalMarkdownHref(html) {
  const pattern = /\bhref="([^"]+\.md(?:#[^"]*)?)"/g;
  let match = pattern.exec(html);

  while (match) {
    const value = match[1];
    if (
      value &&
      !/^(https?:|mailto:|data:)/.test(value)
    ) {
      return true;
    }
    match = pattern.exec(html);
  }

  return false;
}

function resolveOutputReference(fromFile, href) {
  const [pathname] = href.split('#');
  if (!pathname) {
    return null;
  }

  const candidate = path.resolve(path.dirname(fromFile), pathname);
  if (path.extname(candidate)) {
    return candidate;
  }

  return path.join(candidate, 'index.html');
}
