//types
import type { CLIProps, TerminalOptions } from './types';
//others
import Terminal from '@stackpress/types/dist/Terminal';
import Transformer from './Transformer';

export default class IdeaTerminal extends Terminal {
  // brand to prefix in all logs
  public static brand: string = '[IDEA]';
  // you can use a custom extension
  public static extension: string = 'idea';

  //access to static methods from the instance
  //@ts-ignore - Types of construct signatures are incompatible.
  public readonly terminal: typeof IdeaTerminal;
  //transformer
  protected _transformer: Transformer<CLIProps>;

  /**
   * Preloads the input and output settings
   */
  constructor(args: string[], options: TerminalOptions = {}) {
    super(args, options.cwd);
    this.terminal = this.constructor as typeof IdeaTerminal;
    //get io from commandline
    const input = this.expect(
      [ 'input', 'i' ], 
      `${this.cwd}/schema.${this.terminal.extension}`
    );
    this._transformer = new Transformer<CLIProps>(input, options);
    this.on('transform', _ => {
      this._transformer.transform({ cli: this });
    });
  }
}