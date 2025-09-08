//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav, SS } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Lexer');
  const description = _(
    'The Lexer class implements the Parser interface and provides tokenization and parsing utilities for schema code. It manages a dictionary of token definitions and handles the parsing process by matching patterns against the input code.'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

const examples = [
  `import { Lexer } from '@stackpress/idea-parser';
    `,
  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('enum Status { ACTIVE "Active" }');
lexer.define('enum', enumReader);

// Clone preserves code, index position, and all definitions
const clonedLexer = lexer.clone();
console.log(clonedLexer.index); // Same index as original
console.log(clonedLexer.dictionary); // Same definitions as original`,
  `import { Lexer } from '@stackpress/idea-parser';
import definitions from '@stackpress/idea-parser/definitions';

const lexer = new Lexer();

// Load all predefined token definitions
Object.keys(definitions).forEach((key) => {
  lexer.define(key, definitions[key]);
});

// Define a custom token
lexer.define('customKeyword', (code, start, lexer) => {
  if (code.substring(start, start + 6) === 'custom') {
    return {
      type: 'Keyword',
      value: 'custom',
      start: start,
      end: start + 6
    };
  }
  return undefined;
});`,
  `import { Lexer } from '@stackpress/idea-parser';
import definitions, { data } from '@stackpress/idea-parser/definitions';

const lexer = new Lexer();
Object.keys(definitions).forEach((key) => {
  lexer.define(key, definitions[key]);
});

// Parse a float literal
lexer.load('4.4');
const floatToken = lexer.expect('Float');
console.log(floatToken.value); // 4.4
console.log(floatToken.start); // 0
console.log(floatToken.end); // 3

// Parse any data type (scalar, object, or array)
lexer.load('"hello world"');
const stringToken = lexer.expect(data);
console.log(stringToken.value); // 'hello world'

// Expect one of multiple token types
lexer.load('true');
const booleanToken = lexer.expect(['Boolean', 'String', 'Integer']);
console.log(booleanToken.value); // true`,
  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.define('String', definitions['String']);

const definition = lexer.get('String');
if (definition) {
  console.log('Definition key:', definition.key); // 'String'
  console.log('Reader function:', typeof definition.reader); // 'function'
} else {
  console.log('Definition not found');
}`,
  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();

// Load code from the beginning
lexer.load('enum Status { ACTIVE "Active" }');
console.log(lexer.index); // 0

// Load code starting from a specific position
lexer.load('enum Status { ACTIVE "Active" }', 5);
console.log(lexer.index); // 5
console.log(lexer.substring(5, 11)); // 'Status'`,
  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.define('literal', (code, start) => {
  if (code.startsWith('42', start)) {
    return { type: 'Literal', value: 42, start, end: start + 2 };
  }
  return undefined;
});

const code = '42';

// Match against specific token types
const match = lexer.match(code, 0, ['literal']);
if (match) {
  console.log('Matched:', match.type); // 'Literal'
  console.log('Value:', match.value); // 42
}

// Match against all available definitions (pass undefined for keys)
const match2 = lexer.match('42', 0, undefined);
if (match2) {
  console.log('Matched:', match2.type); // 'Literal'
}`,
  `import { Lexer } from '@stackpress/idea-parser';
import definitions from '@stackpress/idea-parser/definitions';

const lexer = new Lexer();
Object.keys(definitions).forEach((key) => {
  lexer.define(key, definitions[key]);
});

lexer.load('enum Status { ACTIVE "Active" }');

// Test if next token matches (doesn't advance index)
if (lexer.next('AnyIdentifier')) {
  console.log('Next token is an identifier');
  console.log(lexer.index); // Still 0
}

// Test for multiple possible tokens
if (lexer.next(['String', 'Integer', 'Boolean'])) {
  console.log('Next token is a literal value');
}`,
  `import { Lexer } from '@stackpress/idea-parser';
import definitions from '@stackpress/idea-parser/definitions';

const lexer = new Lexer();
Object.keys(definitions).forEach((key) => {
  lexer.define(key, definitions[key]);
});

lexer.load('/* some comment */ enum Status');

// Try to parse optional whitespace/comments
const comment = lexer.optional('note');
if (comment) {
  console.log('Found comment:', comment.value); // '/* some comment */'
}

// Skip optional whitespace
lexer.optional('whitespace');

// Now parse the enum keyword
const enumToken = lexer.expect('AnyIdentifier');
console.log(enumToken.name); // 'enum'`,
  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load(''); // Empty string

// Read the next token (tries all definitions)
const nextToken = lexer.read();
console.log(nextToken); // undefined (no tokens in empty string)

lexer.load('42');
lexer.define('Integer', definitions['Integer']);

const token = lexer.read();
if (token) {
  console.log('Token type:', token.type); // 'Literal'
  console.log('Token value:', token.value); // 42
}`,
  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('some code');

// Extract specific portions of code
const substring = lexer.substring(5, 9);
console.log(substring); // 'code'

// Return empty string when start and end are the same
const empty = lexer.substring(5, 5);
console.log(empty); // ''`,
  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('enum Status { ACTIVE "Active" }');

// Find next space from current position
const spaceIndex = lexer.nextSpace();
console.log(spaceIndex); // 4 (position of space after 'enum')

// If no space found, returns code length
lexer.load('enumStatus');
const endIndex = lexer.nextSpace();
console.log(endIndex); // 10 (length of code)`,
  `import { Lexer } from '@stackpress/idea-parser';
import { Compiler } from '@stackpress/idea-parser';
import definitions, { data } from '@stackpress/idea-parser/definitions';

const lexer = new Lexer();
Object.keys(definitions).forEach((key) => {
  lexer.define(key, definitions[key]);
});

// Parse a simple object
lexer.load('{ foo "bar" bar 4.4 }');
const objectToken = lexer.expect('Object');
const compiled = Compiler.object(objectToken);
console.log(compiled); // { foo: 'bar', bar: 4.4 }

// Parse nested objects
lexer.load('{ foo "bar" zoo { foo false bar null } }');
const nestedToken = lexer.expect('Object');
const nestedCompiled = Compiler.object(nestedToken);
console.log(nestedCompiled.zoo.foo); // false
console.log(nestedCompiled.zoo.bar); // null`,
  `// Parse a simple array
lexer.load('[ 4.4 "bar" false null ]');
const arrayToken = lexer.expect('Array');
const compiledArray = Compiler.array(arrayToken);
console.log(compiledArray); // [4.4, 'bar', false, null]

// Parse nested arrays
lexer.load('[ 4.4 "bar" [ 4 true ] ]');
const nestedArrayToken = lexer.expect('Array');
const nestedArray = Compiler.array(nestedArrayToken);
console.log(nestedArray[2]); // [4, true]

// Parse array of objects
lexer.load('[ { label "US" value "United States" } { label "CA" value "Canada" } ]');
const objectArrayToken = lexer.expect('Array');
const objectArray = Compiler.array(objectArrayToken);
console.log(objectArray[0].label); // 'US'
console.log(objectArray[1].value); // 'Canada'`,
  `// Parse block comments
lexer.load('/* some comment */');
const noteToken = lexer.expect('note');
console.log(noteToken.type); // '_Note'
console.log(noteToken.value); // '/* some comment */'

// Parse line comments
lexer.load('//some comment');
const commentToken = lexer.expect('comment');
console.log(commentToken.type); // '_Comment'
console.log(commentToken.value); // '//some comment'

// Parse multiline block comments
lexer.load("/* 
  some 
  // comment
*/");
const multilineToken = lexer.expect('note');
console.log(multilineToken.value); // Contains newlines and nested //`,
  `const lexer = new Lexer();

// Throws: "Unknown definition unknownKey"
try {
  lexer.expect('unknownKey');
} catch (error) {
  console.log(error.message); // "Unknown definition unknownKey"
}

// Throws: "Unknown definition missingKey"
try {
  lexer.match('some code', 0, ['missingKey']);
} catch (error) {
  console.log(error.message); // "Unknown definition missingKey"
}`,
  `import { Exception } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.define('String', definitions['String']);
lexer.load('42'); // Number, not string

try {
  lexer.expect('String'); // Expecting string but found number
} catch (error) {
  if (error instanceof Exception) {
    console.log(error.message); // "Unexpected 42 expecting String"
    console.log(error.start); // Position where error occurred
    console.log(error.end); // End position for error highlighting
  }
}`,
  `import { Lexer, EnumTree } from '@stackpress/idea-parser';

// AST classes configure lexers with appropriate definitions
const lexer = new Lexer();
EnumTree.definitions(lexer); // Adds enum-specific token definitions

lexer.load('enum Status { ACTIVE "Active" INACTIVE "Inactive" }');

const enumTree = new EnumTree(lexer);
const result = enumTree.enum(); // Parse enum using configured lexer`,
  `// Save current state for potential backtracking
const checkpoint = lexer.clone();

try {
  // Try to parse complex structure
  const result = parseComplexStructure(lexer);
  return result;
} catch (error) {
  // Restore state and try alternative parsing
  const restoredLexer = checkpoint;
  return parseAlternativeStructure(restoredLexer);
}`,
  `// Parse different types based on lookahead
if (lexer.next('AnyIdentifier')) {
  const identifier = lexer.expect('AnyIdentifier');
  if (identifier.name === 'enum') {
    // Parse enum declaration
  } else if (identifier.name === 'model') {
    // Parse model declaration
  }
}`,
  `import type { Reader } from '@stackpress/idea-parser';

const customReader: Reader = (code, start, lexer) => {
  // Check if pattern matches at current position
  if (!code.startsWith('custom', start)) {
    return undefined; // No match
  }
  
  // Calculate end position
  const end = start + 6;
  
  // Return token object
  return {
    type: 'CustomToken',
    value: 'custom',
    start: start,
    end: end
  };
};

// Register the custom reader
lexer.define('custom', customReader);`
]

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Lexer</H1>
      <P>The Lexer class implements the Parser interface and provides tokenization and parsing utilities for schema code. It manages a dictionary of token definitions and handles the parsing process by matching patterns against the input code.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[0]}
      </Code>

      <H2>Properties</H2>
      <P>The following properties are available when instantiating a Lexer.</P>

      <Table className="text-left mt-5">
        <Thead className="theme-bg-bg2 text-left">Property</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>dictionary</C></Tcol>
          <Tcol><C>Record&#8249;string, Definition&#8250;</C> Shallow copy of all token definitions</Tcol>
          <Tcol>The current index position in the code</Tcol>
        </Trow>
        <Trow>
          <Tcol><C>index</C></Tcol>
          <Tcol><C>number</C></Tcol>
          <Tcol>Current parsing position in the code</Tcol>
        </Trow>
      </Table>

      <H2>Methods</H2>
      <P>The following methods are available when instantiating a Lexer.</P>

      <H2>Cloning the Lexer</H2>
      <P>The following example shows how to create an exact copy of the lexer's current state.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[1]}
      </Code>

      <SS>Returns</SS>
      <li className='my-2 list-none'>A new Lexer instance with identical state to original</li>

      <H2>Defining Token Patterns</H2>
      <P>The following example shows how to register token definitions for parsing.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[2]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>key</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol>Unique identifier for the token definition</Tcol>
        </Trow>
        <Trow>
          <Tcol><C>reader</C></Tcol>
          <Tcol><C>Reader</C></Tcol>
          <Tcol>Function that attempts to match and parse the token</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>Void (modifies the lexer's internal dictionary).</li>

      <H2>Expecting Specific Tokens</H2>
      <P>The following example shows how to require specific tokens at the current position.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[3]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>keys</C></Tcol>
          <Tcol><C>string | string[]</C></Tcol>
          <Tcol>Token definition key(s) to expect</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The matched token object, or throws an exception if no match is found.</li>

      <H2>Getting Token Definitions</H2>
      <P>The following example shows how to retrieve registered token definitions.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[4]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>key</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol>The token definition key to retrieve</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The Definition object if found, undefined otherwise.</li>

      <H2>Loading Code</H2>
      <P>The following example shows how to load code for parsing.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[5]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>code</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol>The source code to parse</Tcol>
        </Trow>
        <Trow>
          <Tcol><C>index</C></Tcol>
          <Tcol><C>number</C></Tcol>
          <Tcol>Starting position in the code (default: 0)</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The Lexer instance to allow method chaining.</li>

      <H2>Matching Tokens</H2>
      <P>The following example shows how to find the first matching token from available definitions.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[6]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>code</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol>The code to match against</Tcol>
        </Trow>
        <Trow>
          <Tcol><C>start</C></Tcol>
          <Tcol><C>number</C></Tcol>
          <Tcol>Starting position for matching</Tcol>
        </Trow>
        <Trow>
          <Tcol><C>keys</C></Tcol>
          <Tcol><C>string[]</C></Tcol>
          <Tcol>Optional array of definition keys to try (default: all definitions)</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The first matching token object, or null if no match is found.</li>

      <H2>Testing for Next Tokens</H2>
      <P>The following example shows how to check if the next tokens match without consuming them.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[7]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>names</C></Tcol>
          <Tcol><C>string | string[]</C></Tcol>
          <Tcol>Token definition key(s) to test for</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>true if the next token(s) match, false otherwise. Does not advance the index.</li>

      <H2>Optional Token Parsing</H2>
      <P>The following example shows how to optionally parse tokens without throwing errors.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[8]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>names</C></Tcol>
          <Tcol><C>string | string[]</C></Tcol>
          <Tcol>Token definition key(s) to try parsing</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The matched token object if found, undefined otherwise.</li>

      <H2>Reading Ahead</H2>
      <P>The following example shows how to read the next available token.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[9]}
      </Code>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The next available token object, or undefined if no token can be parsed.</li>

      <H2>Getting Substrings</H2>
      <P>The following example shows how to extract portions of the source code.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[10]}
      </Code>

      <H2>Parameters</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>start</C></Tcol>
          <Tcol><C>number</C></Tcol>
          <Tcol>Starting position in the code</Tcol>
        </Trow>
        <Trow>
          <Tcol><C>end</C></Tcol>
          <Tcol><C>number</C></Tcol>
          <Tcol>Ending position in the code</Tcol>
        </Trow>
      </Table>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The substring of code between start and end positions.</li>

      <H2>Finding Next Space</H2>
      <P>The following example shows how to find the next whitespace character (useful for error reporting).</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[11]}
      </Code>

      <SS>Returns</SS>
      <li className='my-2 list-none'>The index of the next space character, or the code length if no space is found.</li>

      <H2>Parsing Complex Data Structures</H2>
      <P>The Lexer can parse complex nested data structures using the predefined token definitions:</P>

      <H3>Parsing Objects</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[12]}
      </Code>

      <H3>Parsing Arrays</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[13]}
      </Code>

      <H3>Parsing Comments</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[14]}
      </Code>

      <H2>Error Handling</H2>
      <P>The Lexer provides detailed error information when parsing fails:</P>

      <H3>Unknown Definitions</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[15]}
      </Code>

      <H3>Unexpected Tokens</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[16]}
      </Code>

      <H2>Predefined Token Definitions</H2>
      <P>The library comes with comprehensive predefined token definitions:</P>

      <H3>Literals</H3>
      <ul className='my-2 list-disc pl-5 '>
        <li className='my-2'><C>Null</C>: Matches null keyword</li>
        <li className='my-2'><C>Boolean</C>: Matches true and false</li>
        <li className='my-2'><C>String</C>: Matches quoted strings "hello"</li>
        <li className='my-2'><C>Float</C>: Matches decimal numbers 4.4, -3.14</li>
        <li className='my-2'><C>Integer</C>: Matches whole numbers 42, -10</li>
        <li className='my-2'><C>Environment</C>: Matches environment variables env("VAR_NAME")</li>
      </ul>

      <H3>Identifiers</H3>
      <ul className='my-2 list-disc pl-5'>
        <li className='my-2'><C>AnyIdentifier</C>: Matches any valid identifier [a-z_][a-z0-9_]*</li>
        <li><C>UpperIdentifier</C>: Matches uppercase identifiers [A-Z_][A-Z0-9_]*</li>
        <li className='my-2'><C>CapitalIdentifier</C>: Matches capitalized identifiers [A-Z_][a-zA-Z0-9_]*</li>
        <li className='my-2'><C>CamelIdentifier</C>: Matches camelCase identifiers [a-z_][a-zA-Z0-9_]*</li>
        <li className='my-2'><C>LowerIdentifier</C>: Matches lowercase identifiers [a-z_][a-z0-9_]*</li>
        <li className='my-2'><C>AttributeIdentifier</C>: Matches attribute identifiers @field.input</li>
      </ul>

      <H3>Structural</H3>
      <ul className='my-2 list-disc pl-5'>
        <li className='my-2'><C>Array</C>: Matches array expressions [ ... ]</li>
        <li className='my-2'><C>Object</C>: Matches object expressions &#123; ... &#125;</li>
        <li className='my-2'><C>&#123;, &#125;, [, ], (, )</C>: Bracket and brace tokens</li>
        <li className='my-2'><C>!</C>: Final modifier token</li>
      </ul>

      <H3>Whitespace and Comments</H3>
      <ul className='my-2 list-disc pl-5'>
        <li className='my-2'><C>whitespace</C>: Matches any whitespace \s+</li>
        <li className='my-2'><C>space</C>: Matches spaces only</li>
        <li className='my-2'><C>line</C>: Matches line breaks</li>
        <li className='my-2'><C>note</C>: Matches block comments /* ... */</li>
        <li className='my-2'><C>comment</C>: Matches line comments // ...</li>
      </ul>

      <H3>Data Groups</H3>
      <ul className='my-2 list-disc pl-5'>
        <li><C>scalar</C>: Array of scalar types ['Null', 'Boolean', 'String', 'Float', 'Integer', 'Environment']</li>
        <li><C>data</C>: Array of all data types [...scalar, 'Object', 'Array']</li>
      </ul>

      <H2>Usage with AST</H2>
      <P>The Lexer is typically used by AST classes for parsing specific language constructs:</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[17]}
      </Code>

      <H2>Advanced Usage Patterns</H2>

      <H3>Backtracking with Clone</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[18]}
      </Code>

      <H3>Conditional Parsing</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[19]}
      </Code>

      <H3>Custom Reader Functions</H3>
      <P>Reader functions should follow this pattern:</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[20]}
      </Code>

      <Nav
        prev={{ text: 'API Reference', href: '/docs/parser/api-reference' }}
        next={{ text: 'Compiler', href: '/docs/parser/pages/compiler' }}
      />

    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </Layout>
  );
}




