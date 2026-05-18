import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, '..', '..');
const docsDir = path.join(rootDir, 'docs');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4173);

const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8']
]);

await ensureDocsBuilt();

const server = http.createServer(async(request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
    const filepath = await resolveRequestPath(url.pathname);
    const ext = path.extname(filepath);
    const content = await fs.readFile(filepath);

    response.writeHead(200, {
      'content-type': types.get(ext) || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    response.end(content);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 500, {
      'content-type': 'text/plain; charset=utf-8'
    });
    response.end(error.code === 'ENOENT' ? 'Not found' : String(error));
  }
});

server.listen(port, host, () => {
  console.log(`Serving docs from ${docsDir} on http://${host}:${port}`);
});

async function ensureDocsBuilt() {
  await fs.access(path.join(docsDir, 'index.html'));
}

async function resolveRequestPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const cleanPath = decoded.replace(/^\/+/, '');
  const basePath = path.join(docsDir, cleanPath);

  if (!cleanPath || decoded.endsWith('/')) {
    return path.join(basePath, 'index.html');
  }

  try {
    const stats = await fs.stat(basePath);
    if (stats.isDirectory()) {
      return path.join(basePath, 'index.html');
    }
    return basePath;
  } catch {
    if (!path.extname(basePath)) {
      return path.join(basePath, 'index.html');
    }
    throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
  }
}
