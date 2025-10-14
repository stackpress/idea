//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
import clsx from 'clsx';
//local
import { H1, H2, P, C, Nav, SS } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
//-----------------------------------------------------------------

const examples = [
  `import { Lexer } from '@stackpress/idea-parser';`,

  //--------------------------------------------------------------------

  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('enum Status { ACTIVE "Active" }');
lexer.define('enum', enumReader);

// Clone preserves code, index position, and all definitions
const clonedLexer = lexer.clone();
console.log(clonedLexer.index); // Same index as original
console.log(clonedLexer.dictionary); // Same definitions as original`,

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();

// Load code from the beginning
lexer.load('enum Status { ACTIVE "Active" }');
console.log(lexer.index); // 0

// Load code starting from a specific position
lexer.load('enum Status { ACTIVE "Active" }', 5);
console.log(lexer.index); // 5
console.log(lexer.substring(5, 11)); // 'Status'`,

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

  `import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('some code');

// Extract specific portions of code
const substring = lexer.substring(5, 9);
console.log(substring); // 'code'

// Return empty string when start and end are the same
const empty = lexer.substring(5, 5);
console.log(empty); // ''`,

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

  `import { Lexer, EnumTree } from '@stackpress/idea-parser';

// AST classes configure lexers with appropriate definitions
const lexer = new Lexer();
EnumTree.definitions(lexer); // Adds enum-specific token definitions

lexer.load('enum Status { ACTIVE "Active" INACTIVE "Inactive" }');

const enumTree = new EnumTree(lexer);
const result = enumTree.enum(); // Parse enum using configured lexer`,

  //--------------------------------------------------------------------

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

  //--------------------------------------------------------------------

  `// Parse different types based on lookahead
if (lexer.next('AnyIdentifier')) {
  const identifier = lexer.expect('AnyIdentifier');
  if (identifier.name === 'enum') {
    // Parse enum declaration
  } else if (identifier.name === 'model') {
    // Parse model declaration
  }
}`,

  //--------------------------------------------------------------------
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
];

//-----------------------------------------------------------------

//styles
//-----------------------------------------------------------------

const anchorStyles = clsx(
  'cursor-pointer',
  'hover:text-blue-700',
  'text-blue-500',
);

//-----------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Lexer');
  const description = _(
    'The Lexer class implements the Parser interface and provides ' +
    'tokenization and parsing utilities for schema code. It manages ' +
    'a dictionary of token definitions and handles the parsing ' +
    'process by matching patterns against the input code.'
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

export function Right() {
  //hooks
  const { _ } = useLanguage();

  return (
    <aside className="overflow-auto px-h-100-40 px-m-0 px-px-10 px-py-20">
      {/* API Reference Navigation*/}
      <h6 className="px-fs-14 px-mb-0 px-mt-0 px-pb-10 theme-muted uppercase">
        {_('API Reference')}
      </h6>
      <nav className="flex flex-col px-fs-14 px-lh-28">
        <div className="cursor-pointer text-blue-300">
          {_('Lexer API Reference')}
        </div>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/compiler"
        >
          {_('Compiler API Reference')}
        </a>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/ast"
        >
          {_('AST Reference')}
        </a>

        <a
          className={anchorStyles}
          href="/docs/parser/api-references/tokens"
        >
          {_('Token Reference')}
        </a>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/exception-handling"
        >
          {_('Exception Handling')}
        </a>
      </nav>

      {/* On This Page Navigation */}
      <h6 className="px-fs-14 px-mb-0 px-mt-30 px-pb-10 theme-muted uppercase">
        {_('On this page')}
      </h6>
      <nav className="flex flex-col px-fs-14 px-lh-28">
        <a
          className={anchorStyles}
          href="#lexer"
        >
          {_('A. Lexer')}
        </a>
        <a
          className={anchorStyles}
          href="#properties"
        >
          {_('1. Properties')}
        </a>
        <a
          className={anchorStyles}
          href="#methods"
        >
          {_('2. Methods')}
        </a>
        <a
          className={anchorStyles}
          href="#cloning"
        >
          {_('2.1 Cloning the Lexer')}
        </a>
        <a
          className={anchorStyles}
          href="#defining"
        >
          {_('2.2 Defining Token Patterns')}
        </a>
        <a
          className={anchorStyles}
          href="#expecting"
        >
          {_('2.3 Expecting Specific Tokens')}
        </a>
        <a
          className={anchorStyles}
          href="#getting"
        >
          {_('2.4 Getting Token Definitions')}
        </a>
        <a
          className={anchorStyles}
          href="#loading"
        >
          {_('2.5 Loading Code')}
        </a>
        <a
          className={anchorStyles}
          href="#matching"
        >
          {_('2.6 Matching Tokens')}
        </a>
        <a
          className={anchorStyles}
          href="#testing"
        >
          {_('2.7 Testing for Next Tokens')}
        </a>
        <a
          className={anchorStyles}
          href="#optional"
        >
          {_('2.8 Optional Token Parsing')}
        </a>
        <a
          className={anchorStyles}
          href="#reading-ahead"
        >
          {_('2.9 Reading Ahead')}
        </a>
        <a
          className={anchorStyles}
          href="#substrings"
        >
          {_('2.10 Getting Substrings')}
        </a>
        <a
          className={anchorStyles}
          href="#next-space"
        >
          {_('2.11 Finding Next Space')}
        </a>
        <a
          className={anchorStyles}
          href="#parsing-complex-data-structures"
        >
          {_('3. Parsing Complex Data Structures')}
        </a>
        <a
          className={anchorStyles}
          href="#error-handling"
        >
          {_('4. Error Handling')}
        </a>
        <a
          className={anchorStyles}
          href="#predefined-token-definitions"
        >
          {_('5. Predefined Token Definitions')}
        </a>
        <a
          className={anchorStyles}
          href="#usage-with-ast"
        >
          {_('6. Usage with AST')}
        </a>
        <a
          className={anchorStyles}
          href="#advanced-usage-patterns"
        >
          {_('7. Advanced Usage Patterns')}
        </a>
      </nav>
    </aside>
  );
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Lexer Section Content */}
      <section id="lexer">
        <H1>{_('Lexer')}</H1>
        <Translate>
          The Lexer class implements the Parser interface and provides
          tokenization and parsing utilities for schema code. It manages
          a dictionary of token definitions and handles the parsing
          process by matching patterns against the input code.
        </Translate>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[0]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Properties Section Content */}
      <section id="properties">
        <H1>{_('1. Properties')}</H1>
        <P>
          <Translate>
            The following properties are available when instantiating a Lexer.
          </Translate>
        </P>

        <Table className="mt-5 text-left">
          <Thead className="text-left theme-bg-bg2">{_('Property')}</Thead>
          <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
          <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
          <Trow>
            <Tcol><C>dictionary</C></Tcol>
            <Tcol><C>Record&#8249;string, Definition&#8250;</C> {_(
              'Shallow copy of all token definitions'
            )}</Tcol>
            <Tcol>{_('The current index position in the code')}</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>index</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>{_('Current parsing position in the code')}</Tcol>
          </Trow>
        </Table>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Methods Section Content */}
      <section id="methods">
        <H1>{_('2. Methods')}</H1>
        <P>
          <Translate>
            The following methods are available when instantiating
            a Lexer.
          </Translate>
        </P>

        {/* Cloning the Lexer Section Content */}
        <section id="cloning">
          <H2>{_('2.1 Cloning the Lexer')}</H2>
          <P>
            <Translate>
              The following example shows how to create an exact copy
              of the Lexer's current state.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[1]}
          </Code>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              A new Lexer instance with identical state to original
            </Translate>
          </li>
        </section>

        {/* Defining Token Patterns Section Content */}
        <section id="defining">
          <H2>{_('2.2 Defining Token Patterns')}</H2>
          <P>
            <Translate>
              The following example shows how to register token
              definitions for parsing.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[2]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>key</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>{_('Unique identifier for the token definition')}</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>reader</C></Tcol>
              <Tcol><C>Reader</C></Tcol>
              <Tcol>
                <Translate>
                  Function that attempts to match and parse the token
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              Void (modifies the lexer's internal dictionary).
            </Translate>
          </li>
        </section>

        {/* Expecting Specific Tokens Section Content */}
        <section id="expecting">
          <H2>{_('2.3 Expecting Specific Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to require specific
              tokens at the current position.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[3]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>keys</C></Tcol>
              <Tcol><C>string | string[]</C></Tcol>
              <Tcol>{_('Token definition key(s) to expect')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The matched token object, or throws an exception if
              no match is found.
            </Translate>
          </li>
        </section>

        {/* Getting Token Definitions Section Content */}
        <section id="getting">
          <H2>{_('2.4 Getting Token Definitions')}</H2>
          <P>
            <Translate>
              The following example shows how to retrieve registered
              token definitions.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[4]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>key</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>{_('The token definition key to retrieve')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The Definition object if found, undefined otherwise.
            </Translate>
          </li>
        </section>

        {/* Loading Code Section Content */}
        <section id="loading">
          <H2>{_('2.5 Loading Code')}</H2>
          <P>
            <Translate>
              The following example shows how to load code for parsing.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[5]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>code</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>{_('The source code to parse')}</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>index</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting position in the code (default: 0)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The Lexer instance to allow method chaining.
            </Translate>
          </li>
        </section>

        {/* Matching Tokens Section Content */}
        <section id="matching">
          <H2>{_('2.6 Matching Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to find the first
              matching token from available definitions.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[6]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>code</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>{_('The code to match against')}</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>{_('Starting position for matching')}</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>keys</C></Tcol>
              <Tcol><C>string[]</C></Tcol>
              <Tcol>
                <Translate>
                  Optional array of definition keys to try (default:
                  all definitions)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The first matching token object, or null if no match
              is found.
            </Translate>
          </li>
        </section>

        {/* Testing for Next Tokens Section Content */}
        <section id="testing">
          <H2>{_('2.7 Testing for Next Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to check if the next
              tokens match without consuming them.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[7]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>names</C></Tcol>
              <Tcol><C>string | string[]</C></Tcol>
              <Tcol>{_('Token definition key(s) to test for')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              true if the next token(s) match, false otherwise.
              Does not advance the index.
            </Translate>
          </li>
        </section>

        {/* Optional Token Parsing Section Content */}
        <section id="optional">
          <H2>{_('2.8 Optional Token Parsing')}</H2>
          <P>
            <Translate>
              The following example shows how to optionally parse
              tokens without throwing errors.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[8]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>names</C></Tcol>
              <Tcol><C>string | string[]</C></Tcol>
              <Tcol>{_('Token definition key(s) to try parsing')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The matched token object if found, undefined otherwise.
            </Translate>
          </li>
        </section>

        {/* Reading Ahead Section Content */}
        <section id="reading-ahead">
          <H2>{_('2.9 Reading Ahead')}</H2>
          <P>
            <Translate>
              The following example shows how to read the next 
              available token.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[9]}
          </Code>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The next available token object, or undefined if no 
              token can be parsed.
            </Translate>
          </li>
        </section>

        {/* Getting Substrings Section Content */}
        <section id="substrings">
          <H2>{_('2.10 Getting Substrings')}</H2>
          <P>
            <Translate>
              The following example shows how to extract portions 
              of the source code.
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[10]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">{_('Parameter')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Type')}</Thead>
            <Thead className="text-left theme-bg-bg2">{_('Description')}</Thead>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>{_('Starting position in the code')}</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>{_('Ending position in the code')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The substring of code between start and end positions.
            </Translate>
          </li>
        </section>

        {/* Finding Next Space Section Content */}
        <section id="next-space">
          <H2>{_('2.11 Finding Next Space')}</H2>
          <P>
            <Translate>
              The following example shows how to find the next 
              whitespace character (useful for error reporting).
            </Translate>
          </P>
          <Code copy language="javascript" className="bg-black text-white">
            {examples[11]}
          </Code>

          <SS>{_('Returns')}</SS>
          <li className="my-2 list-none">
            <Translate>
              The index of the next space character, or the code 
              length if no space is found.
            </Translate>
          </li>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Parsing Complex Data Structures Section Content */}
      <section id="parsing-complex-data-structures">
        <H1>{_('3. Parsing Complex Data Structures')}</H1>
        <P>
          <Translate>
            The Lexer can parse complex nested data structures using 
            the predefined token definitions:
          </Translate>
        </P>

        <H2>{_('Parsing Objects')}</H2>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[12]}
        </Code>

        <H2>{_('Parsing Arrays')}</H2>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[13]}
        </Code>

        <H2>{_('Parsing Comments')}</H2>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[14]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Error Handling Section Content */}
      <section id="error-handling">
        <H1>{_('4. Error Handling')}</H1>
        <P>
          <Translate>
            The Lexer provides detailed error information when 
            parsing fails:
          </Translate>
        </P>

        <H2>{_('Unknown Definitions')}</H2>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[15]}
        </Code>

        <H2>{_('Unexpected Tokens')}</H2>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[16]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Predefined Token Definitions Section Content */}
      <section id="predefined-token-definitions">
        <H1>{_('5. Predefined Token Definitions')}</H1>
        <P>
          <Translate>
            The library comes with comprehensive predefined token definitions:
          </Translate>
        </P>

        <H2>{_('Literals')}</H2>
        <ul className="list-disc my-2 pl-5 ">
          <li className="my-2"><C>Null</C>: {_('Matches null keyword')}</li>
          <li className="my-2"><C>Boolean</C>: {_('Matches true and false')}</li>
          <li className="my-2"><C>String</C>: {_(
            'Matches quoted strings "hello"'
          )}</li>
          <li className="my-2"><C>Float</C>: {_(
            'Matches decimal numbers 4.4, -3.14'
          )}</li>
          <li className="my-2"><C>Integer</C>: {_(
            'Matches whole numbers 42, -10'
          )}</li>
          <li className="my-2"><C>Environment</C>: {_(
            'Matches environment variables env("VAR_NAME")'
          )}</li>
        </ul>

        <H2>{_('Identifiers')}</H2>
        <ul className="list-disc my-2 pl-5">
          <li className="my-2"><C>AnyIdentifier</C>: {_(
            'Matches any valid identifier [a-z_][a-z0-9_]*'
          )}</li>
          <li><C>UpperIdentifier</C>: {_(
            'Matches uppercase identifiers [A-Z_][A-Z0-9_]*'
          )}</li>
          <li className="my-2"><C>CapitalIdentifier</C>: {_(
            'Matches capitalized identifiers [A-Z_][a-zA-Z0-9_]*'
          )}</li>
          <li className="my-2"><C>CamelIdentifier</C>: {_(
            'Matches camelCase identifiers [a-z_][a-zA-Z0-9_]*'
          )}</li>
          <li className="my-2"><C>LowerIdentifier</C>: {_(
            'Matches lowercase identifiers [a-z_][a-z0-9_]*'
          )}</li>
          <li className="my-2"><C>AttributeIdentifier</C>: {_(
            'Matches attribute identifiers @field.input'
          )}</li>
        </ul>

        <H2>{_('Structural')}</H2>
        <ul className="list-disc my-2 pl-5">
          <li className="my-2"><C>Array</C>: {_(
            'Matches array expressions [ ... ]'
          )}</li>
          <li className="my-2"><C>Object</C>: {_(
            'Matches object expressions &#123; ... &#125;'
          )}</li>
          <li className="my-2"><C>&#123;, &#125;, [, ], (, )</C>: {_(
            'Bracket and brace tokens'
          )}</li>
          <li className="my-2"><C>!</C>: {_('Final modifier token')}</li>
        </ul>

        <H2>{_('Whitespace and Comments')}</H2>
        <ul className="list-disc my-2 pl-5">
          <li className="my-2"><C>whitespace</C>: {_(
            'Matches any whitespace \\s+'
          )}</li>
          <li className="my-2"><C>space</C>: {_('Matches spaces only')}</li>
          <li className="my-2"><C>line</C>: {_('Matches line breaks')}</li>
          <li className="my-2"><C>note</C>: {_(
            'Matches block comments /* ... */'
          )}</li>
          <li className="my-2"><C>comment</C>: {_(
            'Matches line comments // ...'
          )}</li>
        </ul>

        <H2>{_('Data Groups')}</H2>
        <ul className="list-disc my-2 pl-5">
          <li><C>scalar</C>: {_(
            'Array of scalar types [\'Null\', \'Boolean\', \'String\', ' +
            '\'Float\', \'Integer\', \'Environment\']'
          )}</li>
          <li><C>data</C>: {_(
            'Array of all data types [...scalar, \'Object\', \'Array\']'
          )}</li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Usage with AST Section Content */}
      <section id="usage-with-ast">
        <H1>{_('6. Usage with AST')}</H1>
        <P>
          <Translate>
            The Lexer is typically used by AST classes for parsing 
            specific language constructs:
          </Translate>
        </P>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[17]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Advanced Usage Patterns Section Content */}
      <section id="advanced-usage-patterns">
        <H1>{_('7. Advanced Usage Patterns')}</H1>

        <H2>{_('Backtracking with Clone')}</H2>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[18]}
        </Code>

        <H2>{_('Conditional Parsing')}</H2>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[19]}
        </Code>

        <H2>{_('Custom Reader Functions')}</H2>
        <P>
          <Translate>
            Reader functions should follow this pattern:
          </Translate>
        </P>
        <Code copy language="javascript" className="bg-black text-white">
          {examples[20]}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('API Reference'),
          href: "/docs/parser/api-reference"
        }}
        next={{
          text: _('Compiler'),
          href: "/docs/parser/api-references/compiler"
        }}
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
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}




