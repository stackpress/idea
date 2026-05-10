import type { ServerCapabilities } from 'vscode-languageserver/node';
import { TextDocumentSyncKind } from 'vscode-languageserver/node';

/**
 * Capability declaration stays separate from server bootstrapping so the
 * supported feature surface is easy to scan and evolve.
 */
export const serverCapabilities: ServerCapabilities = {
  textDocumentSync: TextDocumentSyncKind.Incremental,
  completionProvider: {
    resolveProvider: true,
    triggerCharacters: ['@', '.', '"']
  },
  hoverProvider: true,
  definitionProvider: true,
  documentSymbolProvider: true,
  workspaceSymbolProvider: true,
  documentFormattingProvider: true
};
