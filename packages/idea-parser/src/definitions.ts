import type { 
  Reader, 
  DataToken, 
  UnknownToken, 
  IdentifierToken 
} from './types';
const definitions: Record<string, Reader> = {
  'line': (code, index) => reader(
    '_Line', 
    /^[\n\r]+$/, 
    code, 
    index
  ),
  'space': (code, index) => scan(
    '_Space', 
    /^[ ]+/, 
    code, 
    index
  ),
  'whitespace': (code, index) => scan(
    '_Whitespace', 
    /^\s+/, 
    code, 
    index
  ),
  'note': (code, index) => reader(
    '_Note', 
    /^\/\*(?:(?!\*\/).)+\*\/$/s, 
    code, 
    index
  ),
  'comment': (code, index) => scan(
    '_Comment', 
    /^\/\/[^\n\r]*/, 
    code, 
    index
  ),
  ')': (code, index) => scan(
    '_ParenClose', 
    /^\)/, 
    code, 
    index
  ),
  '(': (code, index) => scan(
    '_ParenOpen', 
    /^\(/, 
    code, 
    index
  ),
  '}': (code, index) => scan(
    '_BraceClose', 
    /^\}/, 
    code, 
    index
  ),
  '{': (code, index) => scan(
    '_BraceOpen', 
    /^\{/, 
    code, 
    index
  ),
  ']': (code, index) => scan(
    '_SquareClose', 
    /^\]/, 
    code, 
    index
  ),
  '[': (code, index) => scan(
    '_SquareOpen', 
    /^\[/, 
    code, 
    index
  ),
  'Null': (code: string, index: number) => {
    return code.substring(index, index + 4) === 'null' 
      ? { 
        type: 'Literal', 
        start: index,
        end: index + 4,
        value: null,
        raw: 'null'
      } : undefined; 
  },
  'Boolean': (code, index) => {
    if (code.substring(index, index + 4) === 'true') {
      return { 
        type: 'Literal', 
        start: index,
        end: index + 4,
        value: true,
        raw: 'true'
      };
    }
    if (code.substring(index, index + 5) === 'false') {
      return { 
        type: 'Literal', 
        start: index,
        end: index + 5,
        value: false,
        raw: 'false'
      };
    }
    return undefined;
  },
  'String': (code, index) => {
    if (code.charAt(index) !== '"') {
      return undefined;
    }

    const end = code.indexOf('"', index + 1) + 1;
    if (end < index) {
      return undefined;
    }

    const value = code.slice(index + 1, end - 1);

    return { 
      type: 'Literal',
      start: index,
      end,
      value,
      raw: `'${value}'`
    };
  },
  'Float': (code, start) => {
    const match = code.slice(start).match(/^\d+\.\d+/);
    if (match !== null && match.index === 0) {
      const end = start + match[0].length;
      const value = code.substring(start, end);
      return { 
        type: 'Literal', 
        start, 
        end, 
        value: parseFloat(value), 
        raw: `${value}` 
      };
    }

    return undefined;
  },
  'Integer': (code, start) => {
    const match = code.slice(start).match(/^[0-9]+/);
    if (match !== null && match.index === 0) {
      const end = start + match[0].length;
      const value = code.substring(start, end);
      return { 
        type: 'Literal', 
        start, 
        end, 
        value: parseInt(value), 
        raw: `${value}` 
      };
    }
    return undefined;
  },
  'Array': (code, index, lexer) => {
    const elements: DataToken[] = [];
    const subparser = lexer.clone().load(code, index);
    try {
      subparser.expect('[');
      subparser.optional('whitespace');
      while (subparser.next(data)) {
        const value = subparser.expect(data) as DataToken;
        subparser.optional('whitespace');
        elements.push(value);
      }
      subparser.expect(']');
    } catch(e) {
      return undefined;
    }
    
    return { 
      type: 'ArrayExpression',
      start: index,
      end: subparser.index,
      elements
    };
  },
  'Object': (code, index, lexer) => {
    const properties: any[] = [];
    const subparser = lexer.clone().load(code, index);
    try {
      subparser.expect('{');
      subparser.optional('whitespace');
      while (subparser.next('AnyIdentifier')) {
        const key = subparser.expect<IdentifierToken>('AnyIdentifier');
        subparser.expect('whitespace');
        const value = subparser.expect<DataToken>(data);
        subparser.optional('whitespace');
        properties.push({
          type: 'Property',
          start: key.start,
          end: value.end,
          key: {
            type: 'Identifier',
            start: key.start,
            end: key.end,
            name: key.name
          },
          value: value
        });
      }
      subparser.expect('}');
    } catch(e) {
      return undefined;
    }
    return { 
      type: 'ObjectExpression',
      start: index,
      end: subparser.index,
      properties
    };
  },
  'Environment': (code, index) => {
    if (code.substring(index, index + 5) !== 'env("') {
      return undefined;
    }

    const end = code.indexOf('")', index + 5) + 2;
    if (end < index) {
      return undefined;
    }

    const value = process.env[code.slice(index + 5, end - 2)] || '';

    return { 
      type: 'Literal',
      start: index,
      end,
      value,
      raw: `'${value}'`
    };
  },
  'AnyIdentifier': (code, index) => identifier(
    /^[a-z_][a-z0-9_]*/i, 
    code, 
    index
  ),
  'UpperIdentifier': (code, index) => identifier(
    /^[A-Z_][A-Z0-9_]*/i, 
    code, 
    index
  ),
  'CapitalIdentifier': (code, index) => identifier(
    /^[A-Z_][a-zA-Z0-9_]*/i, 
    code, 
    index
  ),
  'CamelIdentifier': (code, index) => identifier(
    /^[a-z_][a-zA-Z0-9_]*/, 
    code, 
    index
  ),
  'LowerIdentifier': (code, index) => identifier(
    /^[a-z_][a-z0-9_]*/i, 
    code, 
    index
  ),
  'AttributeIdentifier': (code, start) => {
    const match = code.slice(start).match(/^@[a-z](\.?[a-z0-9_]+)*/);
    if (match !== null && match.index === 0) {
      const end = start + match[0].length;
      const name = code.substring(start, end);
      return { type: 'Identifier', start, end, name };
    }
    return undefined;
  }
};

export const scalar = [
  'Null',  'Boolean', 'String',
  'Float', 'Integer', 'Environment'
];

export const data = [ ...scalar, 'Object', 'Array' ];

export function scan(
  type: string, 
  regexp: RegExp, 
  code: string, 
  start: number
): UnknownToken | undefined {
  const match = code.slice(start).match(regexp);
  if (match !== null && match.index === 0) {
    const end = start + match[0].length;
    const value = code.substring(start, end);
    return { type, start, end, value, raw: value };
  }

  return undefined;
}

export function reader(
  type: string, 
  regexp: RegExp, 
  code: string, 
  index: number
): UnknownToken | undefined {
  let value = '';
  let matched = false;
  const start = index;
  while (index < code.length) {
    //get the character (and increment index afterwards)
    const char = code.charAt(index++);
    if (!regexp.test(value + char)) {
      //if we never had a match
      if (!matched) {
        //add character to value anyways
        value += char;
        //let it keep parsing
        continue;
      }
      //if we do not have a value
      if (value.length === 0) {
        return undefined;
      }
      //return where we ended
      return { type, start, end: index - 1, value, raw: value };
    }
    //add character to value
    value += char;
    //remember last match
    matched = true;
  }
  //no more code...
  //did it end with a match?
  return matched && value.length
    ? { type, start, end: index, value, raw: value }
    : undefined;
}

export function identifier(
  regexp: RegExp, 
  code: string, 
  index: number
): IdentifierToken | undefined {
  const results = scan('Identifier', regexp, code, index);
  if (results) {
    return {
      type: 'Identifier',
      start: results.start,
      end: results.end,
      name: results.value
    };
  }

  return undefined;
}

export default definitions;