//types
import type { CLIProps, TerminalOptions } from './types';
//others
import EventTerminal from '@stackpress/lib/dist/event/EventTerminal';
import Transformer from './Transformer';

export default class IdeaTerminal extends EventTerminal {
  // brand to prefix in all logs
  public static brand: string = '[IDEA]';
  // you can use a custom extension
  public static extension: string = 'idea';

  //access to static methods from the instance
  //@ts-ignore - Types of construct signatures are incompatible.
  public readonly terminal: typeof IdeaTerminal;
  //transformer
  public readonly transformer: Transformer<CLIProps>;

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
    this.transformer = new Transformer<CLIProps>(input, options);
    this.on('transform', async _ => {
      await this.transformer.transform({ cli: this });
    });
  }
}