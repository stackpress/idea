export type {
  CLIProps,
  FileLoaderOptions,
  TerminalOptions,
  PluginProps,
  PluginWithCLIProps
} from './types.js';

import Transformer from './Transformer.js';
import Terminal, { terminalControls } from './Terminal.js';

export { Transformer, Terminal, terminalControls };