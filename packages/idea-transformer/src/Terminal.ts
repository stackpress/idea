//types
import { PluginProps } from './Transformer';
//others
import Terminal from '@stackpress/types/dist/Terminal';
import Transformer from './Transformer';
import Loader from './Loader';

export type CLIProps = { cli: Terminal };
export type TerminalTransformer = Transformer<CLIProps>
export type PluginWithCLIProps = PluginProps<CLIProps>;

export default class IdeaTerminal extends Terminal {
  // brand to prefix in all logs
  public static brand: string = '[IDEA]';
  // you can use a custom extension
  public static extension: string = 'idea';

  /**
   * Outputs a log 
   */
  public static output(
    message: string, 
    variables: string[] = [],
    color?: string
  ) {
    //add variables to message
    for (const variable of variables) {
      message = message.replace('%s', variable);
    }
    //add brand to message
    message = `${this.brand} ${message}`;
    //colorize the message
    if (color) {
      console.log(color, message);
      return;
    }
    //or just output the message
    console.log(message);
  }

  /**
   * Creates the name space given the space
   * and sets the value to that name space
   */
  public static params(...args: string[]) {
    const params: Record<string, any> = {};

    const format = (
      key: string|number, 
      value: any, 
      override?: boolean
    ) => {
      //parse value
      switch (true) {
        case typeof value !== 'string':
          break;
        case value === 'true':
          value = true;
          break;
        case value === 'false':
          value = false;
          break;
        case !isNaN(value) && !isNaN(parseFloat(value)):
          value = parseFloat(value);
          break;
        case !isNaN(value) && !isNaN(parseInt(value)):
          value = parseInt(value);
          break;
      }
  
      key = String(key);
  
      //if it's not set yet
      if (typeof params[key] === 'undefined' || override) {
        //just set it
        params[key] = value;
        return;
      }
  
      //it is set
      const current = params[key];
      //if it's not an array
      if (!Array.isArray(current)) {
        //make it into an array
        params[key] = [current, value];
        return;
      }
  
      //push the value
      current.push(value);
      params[key] = current;
      return;
    };

    let key, index = 0, i = 0, j = args.length;
    for (; i < j; i++) {
      const arg = args[i];
      const equalPosition = arg.indexOf('=');
      // --foo --bar=baz
      if (arg.substr(0, 2) === '--') { 
        // --foo --foo baz
        if (equalPosition === -1) {
          key = arg.substr(2);
          // --foo value
          if ((i + 1) < j && args[i + 1][0] !== '-') {
            format(key, args[i + 1]);
            i++;
            continue;
          }
          // --foo
          format(key, true);
          continue;
        }

        // --bar=baz
        format(
          arg.substr(2, equalPosition - 2), 
          arg.substr(equalPosition + 1)
        );
        continue;
      } 

      // -k=value -abc
      if (arg.substr(0, 1) === '-') {
        // -k=value
        if (arg.substr(2, 1) === '=') {
          format(arg.substr(1, 1), arg.substr(3));
          continue;
        }

        // -abc
        const chars = arg.substr(1);
        for (let k = 0; k < chars.length; k++) {
          key = chars[k];
          format(key, true);
        }

        // -a value1 -abc value2
        if ((i + 1) < j && args[i + 1][0] !== '-') {
          format(key as string, args[i + 1], true);
          i++;
        }

        continue;
      }

      if (equalPosition !== -1) {
        format(
          arg.substr(0, equalPosition), 
          arg.substr(equalPosition + 1)
        );
        continue;
      }

      if (arg.length) {
        // plain-arg
        format(index++, arg);
      }
    }
    
    return params;
  }

  //access to static methods from the instance
  public readonly terminal: typeof IdeaTerminal;
  //transformer
  protected _transformer: TerminalTransformer;

  /**
   * Preloads the input and output settings
   */
  constructor(args: string[], cwd = Loader.cwd()) {
    super(args, cwd);
    this.terminal = this.constructor as typeof IdeaTerminal;
    //get io from commandline
    const input = Loader.absolute(
      //get the idea location from the cli
      this.expect(
        [ 'input', 'i' ], 
        `${cwd}/schema.${this.terminal.extension}`
      ), 
      cwd
    );
    this._transformer = new Transformer<CLIProps>(input, cwd);
    this.on('transform', _ => {
      this._transformer.transform({ cli: this });
    });
  }
}