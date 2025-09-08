//node
import fs from 'node:fs';
import path from 'node:path';
//stackpress
import type { Server } from 'stackpress/server';

const mime: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

export default function plugin(server: Server) {
  server.on('route', async _ => {
    //static assets
    server.on('request', async (req, res) => {  
      //if there is a body or a code that is not 404, skip
      if (res.body || (res.code && res.code !== 404)) return;
      //get the resource pathname
      const resource = req.url.pathname.substring(1).replace(/\/\//, '/'); 
      //if no pathname, skip
      if (resource.length === 0) return;
      const assets = server.config.get<string>('assets');
      const file = path.resolve(assets, resource);
      if (fs.existsSync(file)) {
        const ext = path.extname(file);
        const type = mime[ext] || 'application/octet-stream';
        res.setBody(type, fs.createReadStream(file));
      }
    });
  });
};