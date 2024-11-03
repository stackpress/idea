import type FileSystem from '@stackpress/types/dist/filesystem/FileSystem';
import type Terminal from './Terminal';

//--------------------------------------------------------------------//
// Terminal Types

export type CLIProps = { cli: Terminal };
export type TerminalOptions = { cwd?: string, fs?: FileSystem };

//--------------------------------------------------------------------//
// Transformer Types

export type TransformerOptions = { cwd?: string, fs?: FileSystem };