//idea-node
import nativeBinding from '../loader.cjs';
import type {
  NativeError,
  Token
} from './types.js';
import Exception from './Exception.js';

/**
 * The Parser class is a wrapper around the native Rust binding that 
 * provides methods for tokenizing, parsing, and finalizing schema 
 * strings. It converts native errors into JavaScript exceptions with
 * proper stack traces and span information.
 */
export default class Parser {
  /**
   * The parser no longer owns native probing logic. That work lives in
   * the package-root loader so every build can share the same boundary.
   */
  public constructor() {}

  /**
   * The tokenize method is used to get the raw tokens from the parser 
   * without any post-processing. This is useful for tools that want to 
   * do their own custom processing of the tokens or for debugging 
   * purposes.
   */
  public tokenize(source: string): Token[] {
    try {
      return nativeBinding.tokenize(source);
    } catch (e) {
      throw this._error(e);
    }
  }

  /**
   * The parse method is used to get the initial schema config from 
   * the source string. This config may still contain unresolved imports 
   * and plugins, and is primarily useful for tools that want to do their 
   * own custom processing of the schema or for debugging purposes.
   */
  public parse(source: string) {
    try {
      return nativeBinding.parse(source);
    } catch (e) {
      throw this._error(e);
    }
  }

  /**
   * The parseAst method is used to get the raw AST from the parser 
   * without any post-processing. This is useful for tools that want 
   * to do their own custom processing of the AST or for debugging 
   * purposes.
   */
  public parseAst(source: string) {
    try {
      return nativeBinding.parseAst(source);
    } catch (e) {
      throw this._error(e);
    }
  }

  /**
   * The final method is used to get the fully-resolved schema config 
   * with all imports and plugins applied.
   */
  public final(source: string) {
    try {
      return nativeBinding.final(source);
    } catch (e) {
      throw this._error(e);
    }
  }

  /**
   * Rust encodes structured parser errors as JSON so JavaScript 
   * consumers can keep a normal Error shape without losing span data.
   */
  protected _error(error: unknown) {
    if (!(error instanceof Error)) {
      return new Exception(String(error));
    }

    try {
      const payload = JSON.parse(error.message) as NativeError;

      const exception = new Exception(payload.message);
      if (typeof payload.code === 'number') {
        exception.withCode(payload.code);
      } else if (typeof payload.code === 'string') {
        Object.defineProperty(exception, 'code', {
          configurable: true,
          enumerable: true,
          value: payload.code,
          writable: true
        });
      }
      if (payload.start !== undefined && payload.end !== undefined) {
        exception.withPosition(payload.start, payload.end);
      }
      return exception;
    } catch {
      return Exception.upgrade(error);
    }
  }
};
