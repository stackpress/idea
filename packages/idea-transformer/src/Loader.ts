import fs from 'fs';
import path from 'path';

import { Exception } from '@stackpress/idea-parser';

/**
 * Loader
 */
export default class Loader {
  /**
   * Returns the absolute path to the file
   */
  static absolute(pathname: string, cwd?: string) {
    cwd = cwd || this.cwd();
    if (/^\.{1,2}\//.test(pathname)) {
      pathname = path.resolve(cwd, pathname);
    }
    //if the pathname does not start with /, 
    //the path should start with modules
    if (!pathname.startsWith('/')) {
      pathname = path.resolve(this.modules(cwd), pathname);
    }
    return pathname;
  }

  /**
   * Returns the current working directory
   */
  static cwd() {
    return process.cwd();
  }

  /**
   * Should locate the node_modules directory 
   * where idea is actually installed
   */
  static modules(cwd?: string): string {
    cwd = cwd || this.cwd();
    if (cwd === '/') {
      throw new Error('Could not find node_modules');
    }
    if (fs.existsSync(path.resolve(cwd, 'node_modules/@stackpress/idea-transformer'))) {
      return path.resolve(cwd, 'node_modules');
    }
    return this.modules(path.dirname(cwd));
  }

  /**
   * Returns the relative path from the source file to the required file
   * Note: This works better if using absolute paths from Loader.aboslute()
   */
  static relative(source: string, require: string, withExtname = false) {
    //if dont include extname
    if (!withExtname) {
      //check for extname
      const extname = path.extname(require);
      //if there is an extname
      if (extname.length) {
        //remove the extname
        require = require.substring(0, require.length - extname.length);
      }
    }
    //get the relative path
    const relative = path.relative(path.dirname(source), require);
    //if the relative path is not relative, make it relative
    return relative.startsWith('.') ? relative: `./${relative}`;
  }

  /**
   * require() should be monitored separately from the code
   */
  static require(file: string) {
    //if JSON, safely require it
    if (path.extname(file) === '.json') {
      const contents = fs.readFileSync(file, 'utf8');
      try {
        return JSON.parse(contents) || {};
      } catch(e) {}
      return {};
    }
    
    return require(file);
  }

  /**
   * Resolves the path name to a path that can be required
   */
  static resolve(pathname?: string, cwd?: string): string {
    cwd = cwd || this.cwd();
    //if no pathname
    if (!pathname) {
      pathname = cwd;
    //ex. plugin/foo -> node_modules/plugin
    //ex. ./plugin or ../plugin -> [cwd] / plugin 
    } else {
      pathname = this.absolute(pathname, cwd);
    }
    //ex. /plugin/foo
    //it's already absolute...

    //1. Check if pathname is literally a file
    let file = pathname;
    //2. check for [pathname].js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file += '.js';
    }
    //3. check for [pathname].json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file += 'on';
    }
    //4. Check for plugin.js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'plugin.js');
    }
    //5. Check for plugin.json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) { 
      file += 'on';
    }
    //6. Check for package.json
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'package.json');
    }
    //7. Check for index.js
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'index.js');
    }
    //8. Check for index.ts
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'index.ts');
    }
    //9. Check for plugin.ts
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = path.resolve(pathname, 'plugin.ts');
    }
    //10. Check for [pathname].ts
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      file = pathname + '.ts';
    }

    if (!fs.existsSync(file) && fs.lstatSync(file).isFile()) {
      throw Exception.for('Could not resolve `%s`', pathname);
    }

    return file;
  }
}