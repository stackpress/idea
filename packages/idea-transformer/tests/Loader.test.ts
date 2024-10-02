//test suite
import path from 'path';
import { describe, it } from 'mocha';
import { expect } from 'chai';
//for testing
import Loader from '../src/Loader';
//resusable variables
const cwd = __dirname;

describe('Loader Tests', () => {
  it('Should get current absolute path', () => {
    const actual = Loader.absolute('./hello', cwd);
    expect(actual).to.equal(`${cwd}/hello`);
  });
  it('Should get .. absolute path', () => {
    const actual = Loader.absolute('../hello', cwd);
    expect(actual).to.equal(`${path.dirname(cwd)}/hello`);
  });
  it('Should get absolute node_modules path', () => {
    const actual = Loader.absolute('hello', cwd);
    expect(actual).to.contain('node_modules/hello');
  });
  it('Should get cwd', () => {
    const actual = Loader.cwd();
    expect(actual).to.equal(process.cwd());
  });
  it('Should find node_modules', () => {
    const actual = Loader.modules(cwd);
    expect(actual).to.contain('node_modules');
  });
});