# Lexer

The Lexer class implements the Parser interface and provides tokenization and parsing utilities for schema code. It manages a dictionary of token definitions and handles the parsing process by matching patterns against the input code.

```typescript
import { Lexer } from '@stackpress/idea-parser';
```

 1. [Properties](#1-properties)
 2. [Methods](#2-methods)
 3. [Parsing Complex Data Structures](#3-parsing-complex-data-structures)
 4. [Error Handling](#4-error-handling)
 5. [Predefined Token Definitions](#5-predefined-token-definitions)
 6. [Usage with AST](#6-usage-with-ast)
 7. [Advanced Usage Patterns](#7-advanced-usage-patterns)

## 1. Properties

The following properties are available when instantiating a Lexer.

| Property | Type | Description |
|----------|------|-------------|
| `dictionary` | `Record<string, Definition>` | Shallow copy of all token definitions |
| `index` | `number` | Current parsing position in the code |

## 2. Methods

The following methods are available when instantiating a Lexer.

### 2.1. Cloning the Lexer

The following example shows how to create an exact copy of the lexer's current state.

```typescript
import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('enum Status { ACTIVE "Active" }');
lexer.define('enum', enumReader);

// Clone preserves code, index position, and all definitions
const clonedLexer = lexer.clone();
console.log(clonedLexer.index); // Same index as original
console.log(clonedLexer.dictionary); // Same definitions as original
```

**Returns**

A new Lexer instance with identical state to the original.

### 2.2. Defining Token Patterns

The following example shows how to register token definitions for parsing.

```typescript
import { Lexer } from '@stackpress/idea-parser';
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
});
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier for the token definition |
| `reader` | `Reader` | Function that attempts to match and parse the token |

**Returns**

Void (modifies the lexer's internal dictionary).

### 2.3. Expecting Specific Tokens

The following example shows how to require specific tokens at the current position.

```typescript
import { Lexer } from '@stackpress/idea-parser';
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
console.log(booleanToken.value); // true
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `keys` | `string \| string[]` | Token definition key(s) to expect |

**Returns**

The matched token object, or throws an exception if no match is found.

### 2.4. Getting Token Definitions

The following example shows how to retrieve registered token definitions.

```typescript
import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.define('String', definitions['String']);

const definition = lexer.get('String');
if (definition) {
  console.log('Definition key:', definition.key); // 'String'
  console.log('Reader function:', typeof definition.reader); // 'function'
} else {
  console.log('Definition not found');
}
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `key` | `string` | The token definition key to retrieve |

**Returns**

The Definition object if found, undefined otherwise.

### 2.5. Loading Code

The following example shows how to load code for parsing.

```typescript
import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();

// Load code from the beginning
lexer.load('enum Status { ACTIVE "Active" }');
console.log(lexer.index); // 0

// Load code starting from a specific position
lexer.load('enum Status { ACTIVE "Active" }', 5);
console.log(lexer.index); // 5
console.log(lexer.substring(5, 11)); // 'Status'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The source code to parse |
| `index` | `number` | Starting position in the code (default: 0) |

**Returns**

The Lexer instance to allow method chaining.

### 2.6. Matching Tokens

The following example shows how to find the first matching token from available definitions.

```typescript
import { Lexer } from '@stackpress/idea-parser';

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
}
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The code to match against |
| `start` | `number` | Starting position for matching |
| `keys` | `string[]` | Optional array of definition keys to try (default: all definitions) |

**Returns**

The first matching token object, or null if no match is found.

### 2.7. Testing for Next Tokens

The following example shows how to check if the next tokens match without consuming them.

```typescript
import { Lexer } from '@stackpress/idea-parser';
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
}
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `names` | `string \| string[]` | Token definition key(s) to test for |

**Returns**

`true` if the next token(s) match, `false` otherwise. Does not advance the index.

### 2.8. Optional Token Parsing

The following example shows how to optionally parse tokens without throwing errors.

```typescript
import { Lexer } from '@stackpress/idea-parser';
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
console.log(enumToken.name); // 'enum'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `names` | `string \| string[]` | Token definition key(s) to try parsing |

**Returns**

The matched token object if found, undefined otherwise.

### 2.9. Reading Ahead

The following example shows how to read the next available token.

```typescript
import { Lexer } from '@stackpress/idea-parser';

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
}
```

**Returns**

The next available token object, or undefined if no token can be parsed.

### 2.10. Getting Substrings

The following example shows how to extract portions of the source code.

```typescript
import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('some code');

// Extract specific portions of code
const substring = lexer.substring(5, 9);
console.log(substring); // 'code'

// Return empty string when start and end are the same
const empty = lexer.substring(5, 5);
console.log(empty); // ''
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `start` | `number` | Starting position in the code |
| `end` | `number` | Ending position in the code |

**Returns**

The substring of code between start and end positions.

### 2.11. Finding Next Space

The following example shows how to find the next whitespace character (useful for error reporting).

```typescript
import { Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
lexer.load('enum Status { ACTIVE "Active" }');

// Find next space from current position
const spaceIndex = lexer.nextSpace();
console.log(spaceIndex); // 4 (position of space after 'enum')

// If no space found, returns code length
lexer.load('enumStatus');
const endIndex = lexer.nextSpace();
console.log(endIndex); // 10 (length of code)
```

**Returns**

The index of the next space character, or the code length if no space is found.

## 3. Parsing Complex Data Structures

The Lexer can parse complex nested data structures using the predefined token definitions:

### 3.1. Parsing Objects

The following examples demonstrate how to parse object literals using the Lexer. Objects in the schema language use key-value pairs without colons, where keys are identifiers and values can be any data type.

```typescript
import { Lexer } from '@stackpress/idea-parser';
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
console.log(nestedCompiled.zoo.bar); // null
```

### 3.2. Parsing Arrays

```typescript
// Parse a simple array
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
console.log(objectArray[1].value); // 'Canada'
```

### 3.3. Parsing Comments

The following examples show how to parse different types of comments in the schema language. Comments can be either single-line comments starting with `//` or multi-line block comments enclosed in `/* */`.

```typescript
// Parse block comments
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
lexer.load(`/* 
  some 
  // comment
*/`);
const multilineToken = lexer.expect('note');
console.log(multilineToken.value); // Contains newlines and nested //
```

## 4. Error Handling

The Lexer provides detailed error information when parsing fails:

**Unknown Definitions**

```typescript
const lexer = new Lexer();

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
}
```

**Unexpected Tokens**


```typescript
import { Exception } from '@stackpress/idea-parser';

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
}
```

## 5. Predefined Token Definitions

The library comes with comprehensive predefined token definitions:

**Literals**

- **`Null`**: Matches `null` keyword
- **`Boolean`**: Matches `true` and `false`
- **`String`**: Matches quoted strings `"hello"`
- **`Float`**: Matches decimal numbers `4.4`, `-3.14`
- **`Integer`**: Matches whole numbers `42`, `-10`
- **`Environment`**: Matches environment variables `env("VAR_NAME")`

**Identifiers**

- **`AnyIdentifier`**: Matches any valid identifier `[a-z_][a-z0-9_]*`
- **`UpperIdentifier`**: Matches uppercase identifiers `[A-Z_][A-Z0-9_]*`
- **`CapitalIdentifier`**: Matches capitalized identifiers `[A-Z_][a-zA-Z0-9_]*`
- **`CamelIdentifier`**: Matches camelCase identifiers `[a-z_][a-zA-Z0-9_]*`
- **`LowerIdentifier`**: Matches lowercase identifiers `[a-z_][a-z0-9_]*`
- **`AttributeIdentifier`**: Matches attribute identifiers `@field.input`

**Structural**

- **`Array`**: Matches array expressions `[ ... ]`
- **`Object`**: Matches object expressions `{ ... }`
- **`{`, `}`, `[`, `]`, `(`, `)`**: Bracket and brace tokens
- **`!`**: Final modifier token

**Whitespace and Comments**

- **`whitespace`**: Matches any whitespace `\s+`
- **`space`**: Matches spaces only
- **`line`**: Matches line breaks
- **`note`**: Matches block comments `/* ... */`
- **`comment`**: Matches line comments `// ...`

**Data Groups**

- **`scalar`**: Array of scalar types `['Null', 'Boolean', 'String', 'Float', 'Integer', 'Environment']`
- **`data`**: Array of all data types `[...scalar, 'Object', 'Array']`

## 6. Usage with AST

The Lexer is typically used by AST classes for parsing specific language constructs:

```typescript
import { Lexer, EnumTree } from '@stackpress/idea-parser';

// AST classes configure lexers with appropriate definitions
const lexer = new Lexer();
EnumTree.definitions(lexer); // Adds enum-specific token definitions

lexer.load('enum Status { ACTIVE "Active" INACTIVE "Inactive" }');

const enumTree = new EnumTree(lexer);
const result = enumTree.enum(); // Parse enum using configured lexer
```

## 7. Advanced Usage Patterns

The following patterns demonstrate advanced techniques for using the Lexer in complex parsing scenarios. These patterns are useful for implementing sophisticated parsing logic and error recovery mechanisms.

### 7.1. Backtracking with Clone

Backtracking allows you to save the lexer's state and restore it if parsing fails. This is useful for trying alternative parsing strategies without losing your position in the code.

```typescript
// Save current state for potential backtracking
const checkpoint = lexer.clone();

try {
  // Try to parse complex structure
  const result = parseComplexStructure(lexer);
  return result;
} catch (error) {
  // Restore state and try alternative parsing
  const restoredLexer = checkpoint;
  return parseAlternativeStructure(restoredLexer);
}
```

### 7.2. Conditional Parsing

Conditional parsing allows you to make parsing decisions based on lookahead tokens. This technique is useful for parsing languages with context-sensitive grammar rules.

```typescript
// Parse different types based on lookahead
if (lexer.next('AnyIdentifier')) {
  const identifier = lexer.expect('AnyIdentifier');
  if (identifier.name === 'enum') {
    // Parse enum declaration
  } else if (identifier.name === 'model') {
    // Parse model declaration
  }
}
```

### 7.3. Custom Reader Functions

Reader functions should follow this pattern:

```typescript
import type { Reader } from '@stackpress/idea-parser';

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
lexer.define('custom', customReader);
```
