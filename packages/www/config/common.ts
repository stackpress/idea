//node
import path from 'node:path';

export type { Config } from 'stackpress/types';

export const cwd = process.cwd();
export const docs = path.join(cwd, 'docs');
export const build = path.join(cwd, '.build');
export const assets = path.join(cwd, 'public');

export const brand = {
  name: 'Stackpress',
  logo: '/logo.png',
  icon: '/icon.png',
  favicon: '/favicon.ico'
};

export const server = {
  port: 3000,
  cwd: cwd
};

export const view = {
  //url flag (ie. ?json) used to disable template 
  //rendering and show the raw json data instead
  noview: 'json',
  //used by vite and in development mode
  //to determine the root of the project
  base: '/',
  //frontend notification display settings
  notify: {
    position: 'bottom-center',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
};

export const session = {
  //name of the session cookie
  key: 'session',
  //used to generate the session id
  seed: 'abc123',
  access: { GUEST: [ { method: 'ALL', route: '/**' } ] }
};

export const cookie = { 
  //see: https://github.com/jshttp/cookie?tab=readme-ov-file#options-1
  path: '/' 
};

export const language = {
  //url flag (ie. ?json) used to change the user's locale
  //this is also the name of the cookie used to store the locale
  key: 'locale',
  //default locale
  locale: 'en_US',
  //languages and translations
  languages: {
    en_US: {
      label: 'EN',
      translations: {
        'Sign In': 'Signin',
        'Home Page': 'Home Page'
      }
    },
    th_TH: {
      label: 'TH',
      translations: {
        'Sign In': 'Signin',
        'Home Page': 'Home Pagesss'
      }
    }
  }
};

export const cli = {
  label: '[WWW]',
  idea: path.join(cwd, 'schema.idea')
};