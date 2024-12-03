import type { FileSystem } from '@stackpress/types/dist/types';
import type { PluginConfig, SchemaConfig } from '@stackpress/idea-parser';
import type Terminal from './Terminal';
import FileLoader from '@stackpress/types/dist/system/FileLoader';
//--------------------------------------------------------------------//
// Terminal Types

export type CLIProps = { cli: Terminal };
export type TerminalOptions = { cwd?: string, fs?: FileSystem };


//--------------------------------------------------------------------//
// Transformer Types

export type TransformerOptions = { 
  cwd?: string, 
  fs?: FileSystem 
  loader?: FileLoader
};


//--------------------------------------------------------------------//
// Plugin Types

export type PluginProps<T extends {}> = T & {
  config: PluginConfig,
  schema: SchemaConfig,
  cwd: string
};

export type PluginWithCLIProps = PluginProps<CLIProps>;