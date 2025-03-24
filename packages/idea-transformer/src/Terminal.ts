//types
import type { CLIProps, TerminalOptions } from './types';
//others
import Terminal, { terminalControls } from '@stackpress/lib/Terminal';
import Transformer from './Transformer';

export { terminalControls };

export default class IdeaTerminal extends Terminal {
  /**
   * Terminal factory loader
   */
  public static async load(
    args: string[], 
    options: TerminalOptions = {}
  ) {
    return new IdeaTerminal(args, options);
  }

  //current working directory
  public readonly cwd: string;
  //the idea file extension
  public readonly extname: string;

  /**
   * Returns the control brand
   */
  public get brand() {
    return this.controls.brand;
  }

  /**
   * Preloads the input and output settings
   */
  constructor(
    args: string[], 
    options: TerminalOptions = {}
  ) {
    super(args, options.brand || '[IDEA]');
    this.cwd = options.cwd || process.cwd();
    this.extname = options.extname || '.idea';
    this.on('transform', async _ => {
      //set flags
      const flags = [ 'input', 'i' ];
      //fetermine filepath
      const filepath = `${this.cwd}/schema${this.extname}`;
      //get io from commandline
      const input = this.expect(flags, filepath);
      //make a transformer
      const transformer = await Transformer.load<CLIProps>(input, options);
      await transformer.transform({ cli: this });
    });
  }
}