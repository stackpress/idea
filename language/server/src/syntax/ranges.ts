import type { TextDocument } from 'vscode-languageserver-textdocument';
import type { OffsetRange } from '../shared/types';

/**
 * Offset comparisons are the common currency inside the language server
 * because the parser reports byte offsets instead of editor positions.
 */
export function containsOffset(range: OffsetRange, offset: number) {
  return offset >= range.start && offset <= range.end;
}

/**
 * Sorting by the smallest containing range makes it easier to prefer the
 * most specific match when multiple syntax nodes overlap.
 */
export function compareRanges(a: OffsetRange, b: OffsetRange) {
  return a.start - b.start || a.end - b.end;
}

/**
 * Conversion to LSP positions is delayed until the boundary so the core
 * logic can stay editor-agnostic.
 */
export function toLspRange(document: TextDocument, range: OffsetRange) {
  return {
    start: document.positionAt(range.start),
    end: document.positionAt(range.end)
  };
}
