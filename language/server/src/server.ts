import {
  createConnection,
  type CompletionItem,
  DidChangeConfigurationNotification,
  type DidChangeWatchedFilesParams,
  type DocumentFormattingParams,
  type DocumentSymbolParams,
  type HoverParams,
  InitializeParams,
  InitializeResult,
  type Location,
  type TextDocumentPositionParams,
  type WorkspaceSymbolParams,
  ProposedFeatures,
  TextDocuments
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { serverCapabilities } from './lsp/capabilities';
import { IdeaProject } from './core/project';
import { toLspRange } from './syntax/ranges';

/**
 * The server entry point is intentionally thin. All language semantics live
 * in the project layer so the LSP wiring stays boring and easy to audit.
 */
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const project = new IdeaProject();

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;
  hasConfigurationCapability = !!(capabilities.workspace && capabilities.workspace.configuration);
  hasWorkspaceFolderCapability = !!(capabilities.workspace && capabilities.workspace.workspaceFolders);

  const result: InitializeResult = {
    capabilities: serverCapabilities
  };

  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true
      }
    };
  }

  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
});

/**
 * Each text change fully refreshes the in-memory model for that document.
 * The files are small enough that simplicity is worth more than incremental
 * AST bookkeeping right now.
 */
function syncDocument(textDocument: TextDocument) {
  project.update(textDocument.uri, textDocument.getText(), textDocument.version);
  publishDiagnostics(textDocument);
}

/**
 * Diagnostics are published from the normalized project state so every LSP
 * feature sees the same interpretation of the file.
 */
function publishDiagnostics(textDocument: TextDocument) {
  connection.sendDiagnostics({
    uri: textDocument.uri,
    diagnostics: project.diagnostics(textDocument.uri).map(diagnostic => ({
      severity: diagnostic.severity,
      message: diagnostic.message,
      range: toLspRange(textDocument, diagnostic.range)
    }))
  });
}

documents.onDidOpen(event => {
  syncDocument(event.document);
});

documents.onDidChangeContent(event => {
  syncDocument(event.document);
});

documents.onDidClose(event => {
  project.close(event.document.uri);
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

connection.onDidChangeWatchedFiles((change: DidChangeWatchedFilesParams) => {
  // Imported files may change underneath an open editor document, so every
  // open document is resynchronized after the dependency graph refreshes.
  for (const changed of change.changes) {
    project.refreshFromDisk(changed.uri);
  }

  for (const document of documents.all()) {
    syncDocument(document);
  }
});

connection.onCompletion((params: TextDocumentPositionParams) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  return project.getCompletions(
    document.uri,
    document.offsetAt(params.position)
  );
});

connection.onCompletionResolve((item: CompletionItem) => project.resolveCompletion(item) as CompletionItem);

connection.onHover((params: HoverParams) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  const hover = project.getHover(document.uri, document.offsetAt(params.position));
  if (!hover) {
    return null;
  }

  return {
    range: toLspRange(document, hover.range),
    contents: {
      kind: 'markdown',
      value: hover.markdown
    }
  };
});

connection.onDefinition((params: TextDocumentPositionParams): Location | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  const definition = project.getDefinition(document.uri, document.offsetAt(params.position));
  if (!definition) {
    return null;
  }

  const target = documents.get(definition.uri);
  return {
    uri: definition.uri,
    range: target ? toLspRange(target, definition.range) : {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 0 }
    }
  };
});

connection.onDocumentSymbol((params: DocumentSymbolParams) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  return project.documentSymbols(document.uri).map(declaration => ({
    name: declaration.name,
    kind: IdeaProject.symbolKind(declaration.kind),
    range: toLspRange(document, declaration.range),
    selectionRange: toLspRange(document, declaration.nameRange),
    children: declaration.kind === 'type' || declaration.kind === 'model'
      ? declaration.columns.map(column => ({
        name: column.name,
        kind: IdeaProject.symbolKind('column'),
        range: toLspRange(document, column.range),
        selectionRange: toLspRange(document, column.nameRange)
      }))
      : []
  }));
});

connection.onWorkspaceSymbol((params: WorkspaceSymbolParams) => {
  return project.allSymbols(params.query).map(symbol => ({
    name: symbol.name,
    kind: IdeaProject.symbolKind(symbol.kind),
    location: {
      uri: symbol.uri,
      range: documents.get(symbol.uri)
        ? toLspRange(documents.get(symbol.uri) as TextDocument, symbol.nameRange)
        : {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 }
        }
    }
  }));
});

connection.onDocumentFormatting((params: DocumentFormattingParams) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }

  const formatted = project.format(document.uri);
  if (formatted === null || formatted === document.getText()) {
    return [];
  }

  return [{
    range: {
      start: document.positionAt(0),
      end: document.positionAt(document.getText().length)
    },
    newText: formatted
  }];
});

documents.listen(connection);
connection.listen();
