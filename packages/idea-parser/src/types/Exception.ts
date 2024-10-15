/**
 * Exceptions are used to give more information
 * of an error that has occured
 */
export default class Exception extends Error {
  /**
   * General use expressive reasons
   */
  public static for(message: string, ...values: unknown[]) {
    values.forEach(function(value) {
      message = message.replace('%s', String(value));
    });

    return new this(message);
  }

  /**
   * Expressive error report
   */
  public static forErrorsFound(errors: Record<string, string|string[]>) {
    const exception = new this('Invalid Parameters');
    exception.errors = errors;
    return exception;
  }

  /**
   * Requires that the condition is true
   */
  public static require(
    condition: boolean, 
    message: string, 
    ...values: any[]
  ): void {
    if (!condition) {
      for (const value of values) {
        message = message.replace('%s', value);
      } 

      throw new this(message);
    }
  }

  /**
   * Error code
   */
  public code: number;

  /**
   * Itemized errors
   */
  public errors: Record<string, string|string[]> = {};

  /**
   * Starting index
   */
  public start = 0;

  /**
   * ending index
   */
  public end = 0;

  /**
   * An exception should provide a message and a name
   */
  public constructor(message: string, code = 500) {
    super();
    this.message = message;
    this.name = this.constructor.name;
    this.code = code;
  }

  /**
   * Converts error to JSON
   */
  public toJSON() {
    return JSON.stringify(this.toResponse(), null, 2);
  }

  /**
   * Converts error to Response object
   */
  public toResponse() {
    const json: {
      code: number;
      status: string;
      errors?: Record<string, string|string[]>;
    } = {
      code: this.code,
      status: this.message
    };
    if (this.errors) {
      json.errors = this.errors;
    }
    return json;
  }

  /**
   * Expressive way to set an error code
   */
  public withCode(code: number) {
    this.code = code;
    return this;
  }
  
  /**
   * Adds error list
   */
  public withErrors(errors: Record<string, string|string[]>) {
    this.errors = errors;
    return this;
  }

  /**
   * Expressive way to set syntax position
   */
  public withPosition(start: number, end: number) {
    this.start = start;
    this.end = end;
    return this;
  }
}

