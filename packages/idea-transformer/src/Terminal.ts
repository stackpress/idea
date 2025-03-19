//types
import type { CLIProps, FileLoaderOptions } from './types';
//others
import EventTerminal from '@stackpress/lib/EventTerminal';
import Transformer from './Transformer';

export default class IdeaTerminal extends EventTerminal {
  // brand to prefix in all logs
  public static brand: string = '[IDEA]';
  // you can use a custom extension
  public static extension: string = 'idea';

  /**
   * Terminal factory loader
   */
  public static async load(
    args: string[], 
    options: FileLoaderOptions = {}
  ) {
    const cwd = options.cwd || process.cwd();
    //set flags
    const flags = [ 'input', 'i' ];
    //fetermine filepath
    const filepath = `${cwd}/schema.${this.extension}`;
    //get io from commandline
    const input = this.expect(args, flags, filepath);
    //make a transformer
    const transformer = await Transformer.load<CLIProps>(input, options);
    return new IdeaTerminal(args, transformer, cwd);
  }

  //access to static methods from the instance
  //@ts-ignore - Types of construct signatures are incompatible.
  public readonly terminal: typeof IdeaTerminal;
  //transformer
  public readonly transformer: Transformer<CLIProps>;

  /**
   * Preloads the input and output settings
   */
  constructor(
    args: string[], 
    transformer: Transformer<CLIProps>, 
    cwd = process.cwd()
  ) {
    super(args, cwd);
    this.terminal = this.constructor as typeof IdeaTerminal;
    this.transformer = transformer;
    this.on('transform', async _ => {
      await this.transformer.transform({ cli: this });
    });
  }
}