import type { CompletionContext, OffsetRange } from '../shared/types';

/**
 * Completion works best when the server only looks at the current line.
 * That keeps the heuristic fast and avoids reparsing partial documents
 * during every keystroke.
 */
function getLinePrefix(text: string, offset: number) {
  const start = text.lastIndexOf('\n', offset - 1) + 1;
  return text.slice(start, offset);
}

function getLineSuffix(text: string, offset: number) {
  const end = text.indexOf('\n', offset);
  return text.slice(offset, end === -1 ? text.length : end);
}

function currentPrefix(text: string, offset: number) {
  const match = text.slice(0, offset).match(/[@A-Za-z0-9._\/-]+$/);
  return match?.[0] || '';
}

/**
 * Import completion only needs the quoted segment after `use`, so the
 * source range is reduced to the editable path fragment.
 */
function importSourceRange(linePrefix: string, offset: number): OffsetRange | null {
  const useMatch = linePrefix.match(/^\s*use\s+"[^"]*$/);
  if (!useMatch) {
    return null;
  }

  const quoteOffset = linePrefix.lastIndexOf('"');
  return { start: offset - (linePrefix.length - quoteOffset), end: offset };
}

/**
 * The language server classifies the cursor into a small set of editing
 * contexts. That classification is what lets completion stay specific
 * instead of dumping every keyword and symbol into one list.
 */
export function getCompletionContext(text: string, offset: number): CompletionContext {
  const linePrefix = getLinePrefix(text, offset);
  const lineSuffix = getLineSuffix(text, offset);
  const prefix = currentPrefix(text, offset);
  const trimmed = linePrefix.trim();

  const importRange = importSourceRange(linePrefix, offset);
  if (importRange) {
    return {
      kind: 'import-path',
      prefix: linePrefix.slice(linePrefix.lastIndexOf('"') + 1),
      sourceRange: importRange
    };
  }

  if (/@[\w.]*$/.test(linePrefix)) {
    return { kind: 'attribute-position', prefix: prefix.replace(/^@/, '') };
  }

  // Open attribute calls should prefer reusable schema symbols as arguments.
  if (/@[\w.]+\([^)]*$/.test(linePrefix)) {
    return { kind: 'attribute-arg-position', prefix };
  }

  // A trailing space after a finished type usually means the user wants
  // column attributes next, not another type suggestion.
  if (/^\s*[a-z_][a-zA-Z0-9_]*\s+[A-Za-z_][a-zA-Z0-9_\[\]\?]*\s+$/.test(linePrefix)) {
    return { kind: 'attribute-position', prefix: '' };
  }

  // Partially typed capitalized values should still be treated as types,
  // including arbitrary project-specific names like `Datetime` or `Hash`.
  if (/^\s*[a-z_][a-zA-Z0-9_]*\s+[A-Za-z_][a-zA-Z0-9_]*$/.test(trimmed)
    || /^\s*[a-z_][a-zA-Z0-9_]*\s+[A-Za-z_]*$/.test(trimmed)
    || /^\s*[a-z_][a-zA-Z0-9_]*\s+[A-Za-z_][a-zA-Z0-9_\[\]\?]*$/.test(trimmed)) {
    return { kind: 'type-position', prefix };
  }

  if (/^\s*$/.test(trimmed) || /^(use|plugin|enum|prop|type|model)?\s*[A-Za-z_]*$/.test(trimmed)) {
    return { kind: 'top-level-keyword', prefix };
  }

  // Closing-paren cases show up when the list opens late in the edit cycle.
  if (lineSuffix.startsWith(')') && /@[\w.]+\([^)]*$/.test(linePrefix)) {
    return { kind: 'attribute-arg-position', prefix };
  }

  return { kind: 'unknown', prefix };
}
