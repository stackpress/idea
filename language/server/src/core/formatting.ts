/**
 * The formatter intentionally stays conservative. The current goal is to
 * normalize indentation and blank lines without rewriting author intent or
 * trying to become a full AST printer.
 */
export function formatIdea(text: string) {
  const lines = text.split(/\r?\n/);
  let indent = 0;
  const output: string[] = [];
  let previousBlank = false;

  for (const original of lines) {
    const trimmed = original.trim();

    if (!trimmed) {
      if (!previousBlank) {
        output.push('');
      }
      previousBlank = true;
      continue;
    }

    previousBlank = false;
    // Closing tokens reduce indentation before the line is emitted so the
    // brace itself lands at the expected depth.
    if (/^[}\]]/.test(trimmed)) {
      indent = Math.max(0, indent - 1);
    }

    output.push(`${'  '.repeat(indent)}${trimmed}`);

    const opens = (trimmed.match(/[\{\[]/g) || []).length;
    const closes = (trimmed.match(/[\}\]]/g) || []).length;
    indent = Math.max(0, indent + opens - closes);
  }

  return `${output.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}
