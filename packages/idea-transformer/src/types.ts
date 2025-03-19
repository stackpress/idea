import type { FileSystem } from '@stackpress/lib/types';
import type { 
  PluginConfig, 
  SchemaConfig 
} from '@stackpress/idea-parser/types';
import type Terminal from './Terminal';

//--------------------------------------------------------------------//
// Terminal Types

export type CLIProps = { cli: Terminal };
export type FileLoaderOptions = { cwd?: string, fs?: FileSystem };

//--------------------------------------------------------------------//
// Plugin Types

export type PluginProps<T extends {}> = T & {
  config: PluginConfig,
  schema: SchemaConfig,
  cwd: string
};

export type PluginWithCLIProps = PluginProps<CLIProps>;