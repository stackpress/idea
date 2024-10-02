/**
 * Exceptions are used to give more information
 * of an error that has occured
 */
export default class Exception extends Error {
  /**
   * Error code
   */
  public code: number;

  /**
   * Starting index
   */
  public start = 0;

  /**
   * ending index
   */
  public end = 0;

  /**
   * General use expressive reasons
   */
  static for(message: string, ...values: string[]): Exception {
    values.forEach(function(value) {
      message = message.replace('%s', value);
    });

    return new this(message);
  }

  /**
   * An exception should provide a message and a name
   */
  constructor(message: string, code = 500) {
    super();
    this.message = message;
    this.name = this.constructor.name;
    this.code = code;
  }

  /**
   * Expressive way to set an error code
   */
  withCode(code: number): Exception {
    this.code = code;
    return this;
  }

  /**
   * Expressive way to set syntax position
   */
  withPosition(start: number, end: number): Exception {
    this.start = start;
    this.end = end;
    return this;
  }

  /**
   * Converts error to JSON
   */
  toJSON(): Record<string, any> {
    return {
      error: true,
      code: this.code,
      message: this.message
    };
  }
}