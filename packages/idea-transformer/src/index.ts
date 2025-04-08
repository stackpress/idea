export type {
  CLIProps,
  FileLoaderOptions,
  TerminalOptions,
  PluginProps,
  PluginWithCLIProps
} from './types';

import Transformer from './Transformer';
import Terminal, { terminalControls } from './Terminal';

export { Transformer, Terminal, terminalControls };