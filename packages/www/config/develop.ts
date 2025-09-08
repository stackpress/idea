//modules
import unocss from 'unocss/vite';
//stackpress
import { server as http } from 'stackpress/http';
//config
import type { Config } from './common.js';
import * as common from './common.js';

export const config: Config = {
  server: {
    ...common.server,
    mode: 'development'
  },
  view: {
    ...common.view,
    //reactus specific settings
    engine: {
      //base path (used in vite)
      basePath: '/',
      //client script route prefix used in the document markup
      //ie. /client/[id][extname]
      //<script type="module" src="/client/[id][extname]"></script>
      //<script type="module" src="/client/abc123.tsx"></script>
      clientRoute: '/client',
      //filepath to a global css file
      cssFiles: [ 
        'frui/frui.css', 
        'stackpress/stackpress.css', 
        'virtual:uno.css' 
      ],
      //vite plugins
      plugins: [ unocss() ]
    }
  },
  brand: common.brand,
  cli: common.cli,
  cookie: common.cookie,
  language: common.language,
  session: common.session
};

export default async function bootstrap() {
  //make a server
  const server = http();
  //set config
  server.config.set(config);
  //load the plugins
  await server.bootstrap();
  //initialize the plugins
  await server.resolve('config');
  //add events
  await server.resolve('listen');
  //add routes
  await server.resolve('route');
  //return the server
  return server;
};