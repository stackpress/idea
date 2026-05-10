/**
 * Normalization turns parser-shaped tokens into a language-server friendly
 * document model. The parser stays responsible for syntax; this layer makes
 * cross-file lookups and LSP features practical.
 */
import {
  Exception,
  SchemaTree,
  type ArrayToken,
  type DataToken,
  type DeclarationToken,
  type IdentifierToken,
  type ImportToken,
  type LiteralToken,
  type ObjectToken,
  type PropertyToken,
  type SchemaToken
} from '@stackpress/idea-parser';
import type {
  EnumDeclaration,
  IdeaAttribute,
  IdeaColumn,
  IdeaDeclaration,
  IdeaDocument,
  IdeaImport,
  IdeaReference,
  IdeaSymbol,
  IdeaValue,
  ObjectDeclaration,
  OffsetRange,
  PluginDeclaration,
  PropDeclaration
} from '../shared/types';

function rangeFor(start: number, end: number): OffsetRange {
  return { start, end };
}

/**
 * The parser stores column types as string literals, so nullable and array
 * modifiers are unpacked here once and reused everywhere else.
 */
function typeParts(value: string) {
  return {
    nullable: value.endsWith('?'),
    multiple: value.replace(/\?$/, '').endsWith('[]'),
    name: value.replace(/\?$/, '').replace(/\[\]$/, '')
  };
}

/**
 * References can appear deeply nested inside attribute objects and arrays.
 * Collecting them during normalization avoids rewalking value trees later.
 */
function collectReferences(value: IdeaValue): IdeaReference[] {
  if (value.kind === 'reference') {
    return [{ kind: 'value', name: value.name, range: value.range }];
  }
  if (value.kind === 'array') {
    return value.values.flatMap(collectReferences);
  }
  if (value.kind === 'object') {
    return value.entries.flatMap(entry => collectReferences(entry.value));
  }
  return [];
}

/**
 * Value normalization keeps just enough structure for hover, completion,
 * and definitions without forcing the rest of the server to know parser
 * token shapes.
 */
function normalizeValue(token: DataToken): IdeaValue {
  if (token.type === 'Literal') {
    return {
      kind: 'literal',
      value: token.value,
      raw: token.raw,
      range: rangeFor(token.start, token.end)
    };
  }

  if (token.type === 'Identifier') {
    return {
      kind: 'reference',
      name: token.name,
      range: rangeFor(token.start, token.end)
    };
  }

  if (token.type === 'ArrayExpression') {
    return {
      kind: 'array',
      values: token.elements.map(normalizeValue),
      range: rangeFor(token.start, token.end)
    };
  }

  return {
    kind: 'object',
    entries: token.properties.map(property => ({
      key: property.key.name,
      keyRange: rangeFor(property.key.start, property.key.end),
      value: normalizeValue(property.value)
    })),
    range: rangeFor(token.start, token.end)
  };
}

/**
 * Attributes are represented uniformly whether they were written as a bare
 * flag or as a function-style attribute with arguments.
 */
function normalizeAttribute(property: PropertyToken): IdeaAttribute {
  const value = property.value.type === 'ArrayExpression'
    ? property.value.elements.map(normalizeValue)
    : [];
  const references = value.flatMap(collectReferences);
  return {
    name: property.key.name,
    range: rangeFor(property.start, property.end),
    nameRange: rangeFor(property.key.start, property.key.end),
    args: value,
    references
  };
}

/**
 * Columns are normalized into the exact fields the language server needs:
 * a readable type name, the original source ranges, and flattened
 * attribute metadata.
 */
function normalizeColumn(property: PropertyToken): IdeaColumn {
  const objectValue = property.value as ObjectToken;
  const typeProperty = objectValue.properties.find(candidate => candidate.key.name === 'type');
  const attributeProperty = objectValue.properties.find(candidate => candidate.key.name === 'attributes');
  const typeLiteral = typeProperty?.value as LiteralToken;
  const parsed = typeParts(String(typeLiteral.value));
  const attributeObject = attributeProperty?.value as ObjectToken | undefined;

  return {
    kind: 'column',
    name: property.key.name,
    range: rangeFor(property.start, property.end),
    nameRange: rangeFor(property.key.start, property.key.end),
    typeName: parsed.name,
    typeRange: rangeFor(typeLiteral.start, typeLiteral.end),
    nullable: parsed.nullable,
    multiple: parsed.multiple,
    attributes: attributeObject?.properties.map(normalizeAttribute) || []
  };
}

/**
 * The symbol index is derived here once so outline, workspace symbol, and
 * definition requests all operate on the same source of truth.
 */
function declarationSymbols(uri: string, declaration: IdeaDeclaration): IdeaSymbol[] {
  const root: IdeaSymbol = {
    name: declaration.name,
    kind: declaration.kind,
    uri,
    range: declaration.range,
    nameRange: declaration.nameRange
  };

  if (declaration.kind !== 'type' && declaration.kind !== 'model') {
    return [root];
  }

  return [
    root,
    ...declaration.columns.map(column => ({
      name: column.name,
      kind: 'column' as const,
      uri,
      range: column.range,
      nameRange: column.nameRange,
      containerName: declaration.name,
      detail: column.typeName
    }))
  ];
}

function normalizeImport(token: ImportToken): IdeaImport {
  return {
    source: String(token.source.value),
    range: rangeFor(token.start, token.end),
    sourceRange: rangeFor(token.source.start, token.source.end)
  };
}

/**
 * Each declaration kind is normalized into a shape that matches how the
 * language server reasons about it, rather than how the parser emitted it.
 */
function normalizeDeclaration(token: DeclarationToken): IdeaDeclaration {
  const declarator = token.declarations[0];
  const nameToken = declarator.id as IdentifierToken;
  const base = {
    name: nameToken.name,
    range: rangeFor(token.start, token.end),
    nameRange: rangeFor(nameToken.start, nameToken.end)
  };

  if (token.kind === 'enum') {
    return {
      kind: 'enum',
      ...base,
      entries: declarator.init.properties.map(property => ({
        name: property.key.name,
        range: rangeFor(property.start, property.end),
        value: (property.value as LiteralToken).value
      }))
    } satisfies EnumDeclaration;
  }

  if (token.kind === 'prop') {
    const value = normalizeValue(declarator.init);
    return {
      kind: 'prop',
      ...base,
      value,
      references: collectReferences(value)
    } satisfies PropDeclaration;
  }

  if (token.kind === 'plugin') {
    const value = normalizeValue(declarator.init);
    return {
      kind: 'plugin',
      ...base,
      value,
      references: collectReferences(value)
    } satisfies PluginDeclaration;
  }

  const attributesObject = declarator.init.properties.find(property => property.key.name === 'attributes')?.value as ObjectToken;
  const columnsObject = declarator.init.properties.find(property => property.key.name === 'columns')?.value as ObjectToken;

  return {
    kind: token.kind as 'type' | 'model',
    ...base,
    mutable: token.mutable !== false,
    attributes: attributesObject?.properties.map(normalizeAttribute) || [],
    columns: columnsObject?.properties.map(normalizeColumn) || []
  } satisfies ObjectDeclaration;
}

function parseSchema(text: string): SchemaToken {
  return SchemaTree.parse(text);
}

/**
 * Syntax errors are kept as lightweight data so diagnostics can be emitted
 * even when document normalization cannot continue.
 */
export function createSyntaxError(error: Exception) {
  return {
    message: error.message,
    range: rangeFor(error.start, error.end)
  };
}

/**
 * This is the single entry point from raw document text into the internal
 * project model used by the language server.
 */
export function createIdeaDocument(uri: string, text: string, version: number | null): IdeaDocument {
  try {
    const schema = parseSchema(text);
    const imports = schema.body
      .filter(token => token.type === 'ImportDeclaration')
      .map(token => normalizeImport(token as ImportToken));
    const declarations = schema.body
      .filter(token => token.type === 'VariableDeclaration')
      .map(token => normalizeDeclaration(token as DeclarationToken));
    const symbols = declarations.flatMap(declaration => declarationSymbols(uri, declaration));
    const references = declarations.flatMap(declaration => {
      if (declaration.kind === 'type' || declaration.kind === 'model') {
        return declaration.columns.flatMap(column => [
          { kind: 'type' as const, name: column.typeName, range: column.typeRange },
          ...column.attributes.flatMap(attribute => attribute.references)
        ]);
      }
      if (declaration.kind === 'prop' || declaration.kind === 'plugin') {
        return declaration.references;
      }
      return [];
    });

    return {
      uri,
      version,
      text,
      imports,
      declarations,
      symbols,
      references,
      diagnostics: []
    };
  } catch (error) {
    const exception = error as Exception;
    return {
      uri,
      version,
      text,
      imports: [],
      declarations: [],
      symbols: [],
      references: [],
      diagnostics: [],
      syntaxError: createSyntaxError(exception)
    };
  }
}
