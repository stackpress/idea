//node
import fs from 'node:fs/promises';
import path from 'node:path';
//stackpress
import { Terminal } from 'stackpress/terminal';
import * as scripts from 'stackpress/scripts';
//plugins
import { docs } from './config/common.js';
import bootstrap from './config/build.js';

async function build() {
  const server = await bootstrap();
  const cli = new Terminal(['build'], server);

  cli.control.system('Copying public to docs...');
  await fsCopyFolder(path.join(cli.cwd, 'public'), docs);

  cli.control.system('Building pages, client and styles...');
  await scripts.build(server);

  cli.control.system('Generating markup in docs...');
  const ignore = Array.from(server.action.expressions.keys());
  const routes = Array.from(server.routes.entries()).filter(
    ([event]) => !ignore.includes(event)
  );

  for (const [event, route] of routes) {
    const request = server.request({
      url: new URL(`https://www.stackpress.io${route.path}`),
    });
    const response = await server.resolve(event, request);
    cli.control.system(`Generating ${request.url.href} ...`);
    if (response.results) {
      const routepath = route.path.replace(/^\//, '');
      const filepath = routepath === '' ? 'index.html' : `${routepath}.html`;
      await fsWriteFile(
        path.join(docs, filepath),
        response.results as string
      )
    }
  }
};

async function fsWriteFile(file: string, data: string) {
  const dirname = path.dirname(file);
  if (!await fsExists(dirname)) {
    await fs.mkdir(dirname, { recursive: true });
  }
  await fs.writeFile(file, data, 'utf-8');
}

async function fsCopyFile(source: string, destination: string) {
  if (await fsExists(source)) {
    const dirname = path.dirname(destination);
    if (!await fsExists(dirname)) {
      await fs.mkdir(dirname, { recursive: true });
    }
    await fs.copyFile(source, destination);
  }
};

async function fsCopyFolder(source: string, destination: string) {
  //find all the files from source
  const files = await fs.readdir(source);
  for (const file of files) {
    //ignore . and ..
    if (file === '.' || file === '..') continue;
    //make an absolute source path
    const absolute = path.join(source, file);
    const stat = await fs.stat(absolute);
    //if file is a directory, recurse
    if (stat.isDirectory()) {
      fsCopyFolder(
        path.join(source, file),
        path.join(destination, file)
      );
      continue;
    }
    await fsCopyFile(absolute, path.join(destination, file));
  }
};

async function fsExists(path: string) {
  return await fs.access(path).then(() => true).catch(() => false);
}

build().then(() => {
  console.log('Build completed successfully.');
  process.exit(0);
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});