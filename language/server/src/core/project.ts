import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  CompletionItemKind,
  DiagnosticSeverity,
  SymbolKind
} from 'vscode-languageserver/node';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { ATTRIBUTE_REGISTRY } from './attribute-registry';
import { getCompletionContext } from './completion-context';
import { formatIdea } from './formatting';
import { BUILTIN_TYPES, IDEA_KEYWORDS } from '../shared/constants';
import type {
  CompletionContext,
  IdeaDeclaration,
  IdeaDiagnostic,
  IdeaDocument,
  IdeaImport,
  IdeaReference,
  IdeaSymbol,
  OffsetRange
} from '../shared/types';
import { resolveImportUri, resolvePluginUri, toFsPath } from '../shared/uri';
import { containsOffset } from '../syntax/ranges';
import { createIdeaDocument } from '../syntax/normalize';

type CompletionItemData = {
  type: 'keyword' | 'builtin' | 'symbol' | 'attribute' | 'import';
  name: string;
  uri?: string;
};

/**
 * LSP symbol kinds do not map one-to-one with Idea concepts, so the
 * translation is centralized here to keep the editor output consistent.
 */
function symbolKind(kind: IdeaSymbol['kind']) {
  switch (kind) {
    case 'enum': return SymbolKind.Enum;
    case 'prop': return SymbolKind.Constant;
    case 'type': return SymbolKind.Class;
    case 'model': return SymbolKind.Struct;
    case 'plugin': return SymbolKind.Module;
    case 'column': return SymbolKind.Field;
  }
}

/**
 * Completion item kinds are intentionally coarse. The label and detail
 * carry most of the meaning for this language.
 */
function completionKind(kind: string) {
  switch (kind) {
    case 'keyword': return CompletionItemKind.Keyword;
    case 'builtin': return CompletionItemKind.TypeParameter;
    case 'attribute': return CompletionItemKind.Property;
    case 'import': return CompletionItemKind.File;
    default: return CompletionItemKind.Class;
  }
}

/**
 * A readable one-line declaration summary is reused across hover and
 * completion resolution.
 */
function describeDeclaration(declaration: IdeaDeclaration) {
  if (declaration.kind === 'enum') {
    return `enum ${declaration.name}`;
  }
  if (declaration.kind === 'prop') {
    return `prop ${declaration.name}`;
  }
  if (declaration.kind === 'plugin') {
    return `plugin "${declaration.name}"`;
  }
  return `${declaration.kind} ${declaration.name}`;
}

export class IdeaProject {
  private readonly documents = new Map<string, IdeaDocument>();

  /**
   * Open documents always win over disk content so editor feedback tracks
   * unsaved changes instead of whatever happened to be on disk.
   */
  update(uri: string, text: string, version: number | null) {
    this._loadDocument(uri, text, version, new Set<string>(), true);
  };

  /**
   * Only ephemeral on-disk documents are dropped. Open editor documents
   * are managed by the LSP lifecycle instead.
   */
  close(uri: string) {
    const document = this.documents.get(uri);
    if (document?.version !== null) {
      this.documents.delete(uri);
    }
  };

  /**
   * Watched-file refresh only applies to imported files. Open buffers
   * should not be replaced by background disk reads.
   */
  refreshFromDisk(uri: string) {
    if (!this.documents.has(uri)) {
      return;
    }

    const current = this.documents.get(uri);
    if (current?.version !== null) {
      return;
    }

    const text = fs.existsSync(toFsPath(uri))
      ? fs.readFileSync(toFsPath(uri), 'utf8')
      : '';
    this._loadDocument(uri, text, null, new Set<string>(), false);
  };

  /**
   * Document lookup stays intentionally thin because most feature methods
   * want to reason from the normalized document model directly.
   */
  get(uri: string) {
    return this.documents.get(uri);
  };

  /**
   * Workspace symbol queries flatten every loaded document because import
   * resolution already constrained the graph to relevant files.
   */
  allSymbols(query?: string) {
    const normalized = query?.toLowerCase() || '';
    return [...this.documents.values()]
      .flatMap(document => document.symbols)
      .filter(symbol => !query || symbol.name.toLowerCase().includes(normalized));
  };

  /**
   * Outline symbols preserve declaration structure so child columns can be
   * nested under their parent model or type in the editor tree.
   */
  documentSymbols(uri: string) {
    return this.get(uri)?.declarations || [];
  };

  /**
   * Diagnostics are cached on the document so the publish step can remain
   * a cheap projection into LSP ranges.
   */
  diagnostics(uri: string) {
    return this.get(uri)?.diagnostics || [];
  };

  /**
   * Completion starts with a small syntactic classifier and only then
   * builds a result set. That keeps unrelated items out of the list.
   */
  getCompletions(uri: string, offset: number) {
    const document = this.get(uri);
    if (!document) {
      return [];
    }

    const context = getCompletionContext(document.text, offset);
    return this._completionsForContext(document, context);
  };

  /**
   * Completion items stay lightweight until a user focuses one. Resolve
   * fills in the human-facing detail lazily.
   */
  resolveCompletion(item: { data?: CompletionItemData }) {
    const data = item.data;
    if (!data) {
      return item;
    }

    if (data.type === 'attribute') {
      const attribute = ATTRIBUTE_REGISTRY.find(candidate => candidate.name === data.name);
      if (attribute) {
        return {
          ...item,
          detail: `@${attribute.name}`,
          documentation: attribute.documentation
        };
      }
    }

    if (data.type === 'symbol' && data.uri) {
      const declaration = this.get(data.uri)?.declarations.find(candidate => candidate.name === data.name);
      if (declaration) {
        return {
          ...item,
          detail: describeDeclaration(declaration),
          documentation: declaration.kind === 'enum'
            ? declaration.entries.map(entry => `${entry.name} = ${String(entry.value)}`).join('\n')
            : declaration.kind === 'type' || declaration.kind === 'model'
              ? declaration.columns.map(column => `${column.name}: ${column.typeName}`).join('\n')
              : undefined
        };
      }
    }

    if (data.type === 'builtin') {
      return {
        ...item,
        detail: `${data.name} builtin type`,
        documentation: 'Built-in Idea scalar type.'
      };
    }

    return item;
  };

  /**
   * Hover prefers the smallest meaningful source span so users get a
   * stable explanation even in dense declaration lines.
   */
  getHover(uri: string, offset: number) {
    const document = this.get(uri);
    if (!document) {
      return null;
    }

    for (const declaration of document.declarations) {
      if (containsOffset(declaration.nameRange, offset)) {
        const pluginTarget = declaration.kind === 'plugin'
          ? this._resolvePluginTarget(uri, declaration.name)
          : null;
        return {
          range: declaration.nameRange,
          markdown: [
            '```idea',
            describeDeclaration(declaration),
            '```',
            pluginTarget ? `Resolves to \`${toFsPath(pluginTarget)}\`` : ''
          ].filter(Boolean).join('\n\n')
        };
      }

      if (declaration.kind === 'type' || declaration.kind === 'model') {
        for (const column of declaration.columns) {
          if (containsOffset(column.nameRange, offset)) {
            const suffix = `${column.nullable ? '?' : ''}${column.multiple ? '[]' : ''}`;
            return {
              range: column.nameRange,
              markdown: ['```idea', `${column.name} ${column.typeName}${suffix}`, '```'].join('\n')
            };
          }

          if (containsOffset(column.typeRange, offset)) {
            return {
              range: column.typeRange,
              markdown: ['```idea', `${column.typeName}`, '```'].join('\n')
            };
          }

          for (const attribute of column.attributes) {
            if (containsOffset(attribute.nameRange, offset)) {
              return {
                range: attribute.nameRange,
                markdown: [`\`@${attribute.name}\``, 'Column attribute.'].join('\n\n')
              };
            }
          }
        }
      }
    }

    for (const imported of document.imports) {
      if (containsOffset(imported.sourceRange, offset)) {
        return {
          range: imported.sourceRange,
          markdown: imported.resolvedUri
            ? `Resolves to \`${toFsPath(imported.resolvedUri)}\``
            : 'Unresolved import'
        };
      }
    }

    return null;
  };

  /**
   * Definitions treat imports and plugin targets as navigable references
   * even though they are string literals rather than identifier tokens.
   */
  getDefinition(uri: string, offset: number) {
    const document = this.get(uri);
    if (!document) {
      return null;
    }

    for (const imported of document.imports) {
      if (containsOffset(imported.sourceRange, offset) && imported.resolvedUri) {
        return {
          uri: imported.resolvedUri,
          range: { start: 0, end: 0 }
        };
      }
    }

    const reference = this._referenceAt(document, offset);
    if (!reference) {
      const pluginDeclaration = document.declarations.find(candidate =>
        candidate.kind === 'plugin' && containsOffset(candidate.nameRange, offset)
      );
      if (pluginDeclaration) {
        const pluginTarget = this._resolvePluginTarget(uri, pluginDeclaration.name);
        if (pluginTarget) {
          return {
            uri: pluginTarget,
            range: { start: 0, end: 0 }
          };
        }
      }
      return null;
    }

    const symbol = this._resolveReference(uri, reference);
    if (!symbol) {
      return null;
    }

    return {
      uri: symbol.uri,
      range: symbol.nameRange
    };
  };

  /**
   * Formatting runs against the current in-memory text so unsaved changes
   * are formatted predictably.
   */
  format(uri: string) {
    const document = this.get(uri);
    return document ? formatIdea(document.text) : null;
  };

  /**
   * Recursive document loading builds the import graph while a `seen` set
   * prevents cycles from causing infinite recursion.
   */
  private _loadDocument(
    uri: string,
    text: string,
    version: number | null,
    seen: Set<string>,
    preserveOpenVersion: boolean
  ) {
    if (seen.has(uri)) {
      return;
    }
    seen.add(uri);

    const existing = this.documents.get(uri);
    if (existing && existing.version !== null && version === null && preserveOpenVersion) {
      return;
    }

    const document = createIdeaDocument(uri, text, version);
    this.documents.set(uri, document);

    for (const imported of document.imports) {
      try {
        const resolvedUri = resolveImportUri(uri, imported.source);
        imported.resolvedUri = resolvedUri;
        const importedPath = toFsPath(resolvedUri);
        if (fs.existsSync(importedPath)) {
          const importedText = fs.readFileSync(importedPath, 'utf8');
          this._loadDocument(
            resolvedUri,
            importedText,
            null,
            seen,
            preserveOpenVersion
          );
        }
      } catch {
        // Import failures are surfaced as diagnostics later so edits stay
        // responsive even while a file path is temporarily incomplete.
      }
    }

    document.diagnostics = this._validate(document);
  };

  /**
   * Semantic validation stays intentionally conservative. The parser
   * handles syntax; this layer only flags issues that are unambiguously
   * wrong, such as duplicate declarations or missing imports.
   */
  private _validate(document: IdeaDocument): IdeaDiagnostic[] {
    const diagnostics: IdeaDiagnostic[] = [];

    if (document.syntaxError) {
      diagnostics.push({
        message: document.syntaxError.message,
        severity: DiagnosticSeverity.Error,
        range: document.syntaxError.range
      });
      return diagnostics;
    }

    const seen = new Map<string, IdeaDeclaration>();
    for (const declaration of document.declarations) {
      if (seen.has(declaration.name)) {
        diagnostics.push({
          message: `Duplicate declaration ${declaration.name}`,
          severity: DiagnosticSeverity.Error,
          range: declaration.nameRange
        });
      } else {
        seen.set(declaration.name, declaration);
      }

      if (declaration.kind === 'type' || declaration.kind === 'model') {
        const columnNames = new Set<string>();
        for (const column of declaration.columns) {
          if (columnNames.has(column.name)) {
            diagnostics.push({
              message: `Duplicate column ${column.name}`,
              severity: DiagnosticSeverity.Error,
              range: column.nameRange
            });
          } else {
            columnNames.add(column.name);
          }
        }
      }
    }

    for (const imported of document.imports) {
      if (!imported.resolvedUri || !this.documents.has(imported.resolvedUri)) {
        diagnostics.push({
          message: `Unable to resolve import ${imported.source}`,
          severity: DiagnosticSeverity.Error,
          range: imported.sourceRange
        });
      }
    }

    return diagnostics;
  };

  /**
   * Context-specific completion generation is where the language starts to
   * feel intentional instead of generic.
   */
  private _completionsForContext(
    document: IdeaDocument,
    context: CompletionContext
  ) {
    if (context.kind === 'top-level-keyword') {
      return IDEA_KEYWORDS
        .filter(keyword => keyword.startsWith(context.prefix))
        .map(keyword => ({
          label: keyword,
          kind: completionKind('keyword'),
          insertText: keyword,
          data: { type: 'keyword', name: keyword } satisfies CompletionItemData
        }));
    }

    if (context.kind === 'type-position' || context.kind === 'attribute-arg-position') {
      const builtins = BUILTIN_TYPES
        .filter(name => name.toLowerCase().startsWith(context.prefix.toLowerCase()))
        .map(name => ({
          label: name,
          kind: completionKind('builtin'),
          insertText: name,
          data: { type: 'builtin', name } satisfies CompletionItemData
        }));

      const symbols = this._visibleSymbols(document.uri)
        .filter(symbol => ['enum', 'prop', 'type', 'model'].includes(symbol.kind))
        .filter(symbol => symbol.name.toLowerCase().startsWith(context.prefix.toLowerCase()))
        .map(symbol => ({
          label: symbol.name,
          kind: completionKind('symbol'),
          insertText: symbol.name,
          detail: symbol.kind,
          data: { type: 'symbol', name: symbol.name, uri: symbol.uri } satisfies CompletionItemData
        }));

      return [...builtins, ...symbols];
    }

    if (context.kind === 'attribute-position') {
      return ATTRIBUTE_REGISTRY
        .filter(attribute => attribute.name.startsWith(context.prefix))
        .map(attribute => ({
          label: `@${attribute.name}`,
          kind: completionKind('attribute'),
          insertText: `@${attribute.name}`,
          detail: attribute.targets.join(', '),
          data: { type: 'attribute', name: attribute.name } satisfies CompletionItemData
        }));
    }

    if (context.kind === 'import-path') {
      return this._importPathCompletions(document, context.prefix).map((item: string) => ({
        label: item,
        kind: completionKind('import'),
        insertText: item,
        data: { type: 'import', name: item } satisfies CompletionItemData
      }));
    }

    return [];
  };

  /**
   * Import path completion only suggests `.idea` files because that keeps
   * the result list aligned with what `use` can actually resolve.
   */
  private _importPathCompletions(document: IdeaDocument, prefix: string) {
    const documentPath = toFsPath(document.uri);
    const directory = path.resolve(path.dirname(documentPath), prefix || '.');
    const root = fs.existsSync(directory) && fs.statSync(directory).isDirectory()
      ? directory
      : path.dirname(directory);

    if (!fs.existsSync(root)) {
      return [];
    }

    return fs.readdirSync(root)
      .filter((name: string) => name.endsWith('.idea'))
      .map((name: string) => {
        const relative = path.relative(path.dirname(documentPath), path.join(root, name));
        return relative.startsWith('.') ? relative : `./${relative}`;
      });
  };

  /**
   * Visible symbols include the current document plus everything reachable
   * through imports, which mirrors how authors mentally treat shared schema
   * files.
   */
  private _visibleSymbols(uri: string, seen = new Set<string>()): IdeaSymbol[] {
    if (seen.has(uri)) {
      return [];
    }
    seen.add(uri);

    const document = this.documents.get(uri);
    if (!document) {
      return [];
    }

    const imported = document.imports.flatMap(item =>
      item.resolvedUri ? this._visibleSymbols(item.resolvedUri, seen) : []
    );
    return [...document.symbols, ...imported];
  };

  /**
   * References are precomputed during normalization so lookup here is just
   * a range membership check.
   */
  private _referenceAt(document: IdeaDocument, offset: number): IdeaReference | null {
    for (const reference of document.references) {
      if (containsOffset(reference.range, offset)) {
        return reference;
      }
    }

    return null;
  };

  /**
   * Column names are intentionally excluded because type references should
   * only land on top-level declarations.
   */
  private _resolveReference(fromUri: string, reference: IdeaReference): IdeaSymbol | null {
    return this._visibleSymbols(fromUri)
      .find(symbol => symbol.name === reference.name && symbol.kind !== 'column')
      || null;
  };

  /**
   * Plugin targets use package-style resolution because plugin strings are
   * typically package names rather than relative file paths.
   */
  private _resolvePluginTarget(fromUri: string, source: string) {
    try {
      const resolved = resolvePluginUri(fromUri, source);
      return fs.existsSync(toFsPath(resolved)) ? resolved : null;
    } catch {
      return null;
    }
  };

  static symbolKind = symbolKind;
}
