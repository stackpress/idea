//modules
import Terminal, { control } from '@stackpress/lib/Terminal';
//idea-node
import type { CLIProps, TerminalOptions } from './types.js';
import Transformer from './Transformer.js';

export { control };

/**
 * Terminal class to provide a command-line interface for the idea schema 
 * transformation process. It preloads the CLI settings and wires the 
 * transform command to allow users to easily transform their schema 
 * files using the idea package.
 */
class IdeaTerminal extends Terminal {
  /**
   * Loads the terminal with defaults that match the merged idea-node package.
   */
  public static async load(
    args: string[],
    options: TerminalOptions = {}
  ) {
    return new IdeaTerminal(args, options);
  };

  // The loader resolves schema files relative to the caller, not the process root.
  public readonly cwd: string;

  // Keeping the extension configurable makes the CLI usable in fixture-driven tests.
  public readonly extname: string;

  /**
   * Preloads the CLI settings and wires the transform command once.
   */
  constructor(
    args: string[],
    options: TerminalOptions = {}
  ) {
    super(args, options.brand || '[IDEA]');
    this.cwd = options.cwd || process.cwd();
    this.extname = options.extname || '.idea';

    this.on('transform', async _ => {
      const flags = [ 'input', 'i' ];
      const filepath = `${this.cwd}/schema${this.extname}`;
      const input = this.expect(flags, filepath);
      const transformer = await Transformer.load<CLIProps>(input, options);

      await transformer.transform({ cli: this });
    });
  }
};

export default IdeaTerminal;
