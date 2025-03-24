import type { FileSystem } from '@stackpress/lib/types';
import type { 
  PluginConfig, 
  SchemaConfig 
} from '@stackpress/idea-parser/types';
import type Terminal from './Terminal';
import type Transformer from './Transformer';

//--------------------------------------------------------------------//
// Terminal Types

export type CLIProps = { cli: Terminal };
export type FileLoaderOptions = { cwd?: string, fs?: FileSystem };
export type TerminalOptions = FileLoaderOptions & { 
  brand?: string,
  extname?: string 
};

//--------------------------------------------------------------------//
// Plugin Types

export type PluginProps<T extends {}> = T & {
  config: PluginConfig,
  schema: SchemaConfig,
  transformer: Transformer<{}>,
  cwd: string
};

export type PluginWithCLIProps = PluginProps<CLIProps>;