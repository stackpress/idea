# Tokens

Token types define the Abstract Syntax Tree (AST) structures used by the idea parser to represent parsed schema code. These types form the foundation of the parsing system, providing type-safe representations of schema elements.

```typescript
import type { 
  SchemaToken, 
  DeclarationToken, 
  IdentifierToken,
  LiteralToken,
  ObjectToken,
  ArrayToken,
  PropertyToken,
  ImportToken
} from '@stackpress/idea-parser';
```

 1. [Core Token Types](#1-core-token-types)
 2. [Declaration Tokens](#2-declaration-tokens)
 3. [Union Types](#3-union-types)
 4. [Parser Interface](#4-parser-interface)
 5. [Reference Types](#5-reference-types)
 6. [Usage Examples](#6-usage-examples)
 7. [Token Validation](#7-token-validation)
 8. [Integration with AST](#8-integration-with-ast)

## 1. Core Token Types

The following types define the fundamental token structures used throughout the parsing system.

### 1.1. UnknownToken

Base token structure for unrecognized or generic tokens during parsing.

```typescript
const unknownToken: UnknownToken = {
  type: 'CustomType',
  start: 0,
  end: 10,
  value: 'some value',
  raw: 'raw text'
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `string` | Token type identifier |
| `start` | `number` | Starting character position in source code |
| `end` | `number` | Ending character position in source code |
| `value` | `any` | Parsed value of the token |
| `raw` | `string` | Raw text from source code |

**Usage**

Used as a fallback for tokens that don't match specific patterns and as a base structure for other token types.

### 1.2. IdentifierToken

Represents identifiers such as variable names, type names, and property keys.

```typescript
const identifierToken: IdentifierToken = {
  type: 'Identifier',
  name: 'UserRole',
  start: 5,
  end: 13
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'Identifier'` | Always 'Identifier' for identifier tokens |
| `name` | `string` | The identifier name |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |

**Usage**

Used throughout the parser for:
- Enum names: `enum UserRole`
- Model names: `model User`
- Property names: `name String`
- Type references: `role UserRole`

**Examples from Tests**

```typescript
// From enum.json fixture
{
  "type": "Identifier",
  "start": 5,
  "end": 10,
  "name": "Roles"
}

// Property key identifier
{
  "type": "Identifier", 
  "start": 15,
  "end": 20,
  "name": "ADMIN"
}
```

### 1.3. LiteralToken

Represents literal values such as strings, numbers, booleans, and null.

```typescript
const stringLiteral: LiteralToken = {
  type: 'Literal',
  start: 21,
  end: 28,
  value: 'Admin',
  raw: '"Admin"'
};

const numberLiteral: LiteralToken = {
  type: 'Literal',
  start: 10,
  end: 12,
  value: 42,
  raw: '42'
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'Literal'` | Always 'Literal' for literal tokens |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |
| `value` | `any` | The parsed literal value |
| `raw` | `string` | Raw text representation from source |

**Usage**

Used for all scalar values in schema definitions:
- String literals: `"Admin"`, `"localhost"`
- Number literals: `5432`, `3.14`
- Boolean literals: `true`, `false`
- Null literals: `null`

**Examples from Tests**

```typescript
// From enum.json fixture
{
  "type": "Literal",
  "start": 21,
  "end": 28,
  "value": "Admin",
  "raw": "'Admin'"
}
```

### 1.4. ObjectToken

Represents object expressions containing key-value pairs.

```typescript
const objectToken: ObjectToken = {
  type: 'ObjectExpression',
  start: 0,
  end: 64,
  properties: [
    {
      type: 'Property',
      kind: 'init',
      start: 15,
      end: 28,
      method: false,
      shorthand: false,
      computed: false,
      key: { type: 'Identifier', name: 'ADMIN', start: 15, end: 20 },
      value: { type: 'Literal', value: 'Admin', start: 21, end: 28, raw: '"Admin"' }
    }
  ]
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'ObjectExpression'` | Always 'ObjectExpression' for object tokens |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |
| `properties` | `PropertyToken[]` | Array of property tokens |

**Usage**

Used for:
- Enum definitions: `{ ADMIN "Admin", USER "User" }`
- Model column definitions: `{ id String @id, name String }`
- Plugin configurations: `{ provider "postgresql", url env("DATABASE_URL") }`
- Attribute parameters: `@field.input({ type "text" })`

**Examples from Tests**

The enum fixture shows an ObjectToken containing three PropertyTokens for ADMIN, MANAGER, and USER enum values.

### 1.5. ArrayToken

Represents array expressions containing ordered elements.

```typescript
const arrayToken: ArrayToken = {
  type: 'ArrayExpression',
  start: 0,
  end: 25,
  elements: [
    { type: 'Literal', value: 'item1', start: 2, end: 9, raw: '"item1"' },
    { type: 'Literal', value: 'item2', start: 11, end: 18, raw: '"item2"' }
  ]
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'ArrayExpression'` | Always 'ArrayExpression' for array tokens |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |
| `elements` | `DataToken[]` | Array of data tokens |

**Usage**

Used for:
- Array type definitions: `String[]`
- Plugin feature lists: `previewFeatures ["fullTextSearch", "metrics"]`
- Attribute arrays: `@is.oneOf(["admin", "user", "guest"])`

### 1.6. PropertyToken

Represents key-value pairs within object expressions.

```typescript
const propertyToken: PropertyToken = {
  type: 'Property',
  kind: 'init',
  start: 15,
  end: 28,
  method: false,
  shorthand: false,
  computed: false,
  key: {
    type: 'Identifier',
    name: 'ADMIN',
    start: 15,
    end: 20
  },
  value: {
    type: 'Literal',
    value: 'Admin',
    start: 21,
    end: 28,
    raw: '"Admin"'
  }
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'Property'` | Always 'Property' for property tokens |
| `kind` | `'init'` | Always 'init' for initialization properties |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |
| `method` | `boolean` | Always false (not used for method properties) |
| `shorthand` | `boolean` | Always false (not used for shorthand properties) |
| `computed` | `boolean` | Always false (not used for computed properties) |
| `key` | `IdentifierToken` | Property key identifier |
| `value` | `DataToken` | Property value (literal, object, array, or identifier) |

**Usage**

Used within ObjectTokens for:
- Enum key-value pairs: `ADMIN "Admin"`
- Model column definitions: `id String`
- Plugin configuration options: `provider "postgresql"`
- Attribute parameters: `type "text"`

**Examples from Tests**

From the enum fixture, each enum value is represented as a PropertyToken with an IdentifierToken key and LiteralToken value.

## 2. Declaration Tokens

The following types represent top-level declarations in schema files.

### 2.1. DeclarationToken

Represents variable declarations for enums, props, types, models, and plugins.

```typescript
const enumDeclaration: DeclarationToken = {
  type: 'VariableDeclaration',
  kind: 'enum',
  start: 0,
  end: 64,
  declarations: [{
    type: 'VariableDeclarator',
    start: 5,
    end: 64,
    id: {
      type: 'Identifier',
      name: 'Roles',
      start: 5,
      end: 10
    },
    init: {
      type: 'ObjectExpression',
      start: 0,
      end: 64,
      properties: [/* property tokens */]
    }
  }]
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'VariableDeclaration'` | Always 'VariableDeclaration' for declarations |
| `kind` | `string` | Declaration type: 'enum', 'prop', 'type', 'model', 'plugin' |
| `mutable` | `boolean` | Optional mutability flag (for types and models) |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |
| `declarations` | `[DeclaratorToken]` | Array with single declarator token |

**Usage**

Used by all tree parsers (EnumTree, PropTree, TypeTree, ModelTree, PluginTree) to represent their respective declarations. The `kind` property determines how the Compiler processes the declaration.

**Examples from Tests**

The enum fixture shows a complete DeclarationToken with kind 'enum' containing the Roles enum definition.

### 2.2. DeclaratorToken

Represents the declarator part of a variable declaration, containing the identifier and initialization.

```typescript
const declaratorToken: DeclaratorToken = {
  type: 'VariableDeclarator',
  start: 5,
  end: 64,
  id: {
    type: 'Identifier',
    name: 'Roles',
    start: 5,
    end: 10
  },
  init: {
    type: 'ObjectExpression',
    start: 0,
    end: 64,
    properties: [/* property tokens */]
  }
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'VariableDeclarator'` | Always 'VariableDeclarator' for declarators |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |
| `id` | `IdentifierToken` | Declaration identifier (name) |
| `init` | `ObjectToken` | Initialization object containing the declaration body |

**Usage**

Used within DeclarationTokens to separate the declaration name from its body. The `id` contains the name (e.g., "Roles", "User") and `init` contains the definition object.

### 2.3. ImportToken

Represents use statements for importing other schema files.

```typescript
const importToken: ImportToken = {
  type: 'ImportDeclaration',
  start: 0,
  end: 25,
  specifiers: [],
  source: {
    type: 'Literal',
    value: './shared/types.idea',
    start: 4,
    end: 25,
    raw: '"./shared/types.idea"'
  }
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'ImportDeclaration'` | Always 'ImportDeclaration' for imports |
| `start` | `number` | Starting character position |
| `end` | `number` | Ending character position |
| `specifiers` | `[]` | Always empty array (not used for named imports) |
| `source` | `LiteralToken` | Source file path as literal token |

**Usage**

Used by UseTree to represent `use "./path/to/file.idea"` statements. The Compiler extracts the source path for dependency resolution.

### 2.4. SchemaToken

Represents the complete parsed schema file containing all declarations and imports.

```typescript
const schemaToken: SchemaToken = {
  type: 'Program',
  kind: 'schema',
  start: 0,
  end: 150,
  body: [
    // ImportTokens for use statements
    {
      type: 'ImportDeclaration',
      start: 0,
      end: 25,
      specifiers: [],
      source: { type: 'Literal', value: './types.idea', start: 4, end: 25, raw: '"./types.idea"' }
    },
    // DeclarationTokens for enums, props, types, models, plugins
    {
      type: 'VariableDeclaration',
      kind: 'enum',
      start: 27,
      end: 91,
      declarations: [/* declarator */]
    }
  ]
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `type` | `'Program'` | Always 'Program' for complete schemas |
| `kind` | `'schema'` | Always 'schema' for schema files |
| `start` | `number` | Starting character position (usually 0) |
| `end` | `number` | Ending character position |
| `body` | `(DeclarationToken\|ImportToken)[]` | Array of all declarations and imports |

**Usage**

Used by SchemaTree as the root token representing the entire parsed schema file. The Compiler processes the body array to generate the final schema configuration.

## 3. Union Types

The following types provide flexible token handling for different contexts.

### 3.1. Token

Union type for all possible token types that can be returned by readers.

```typescript
type Token = DataToken | UnknownToken;
```

**Usage**

Used as the return type for lexer operations and reader functions. Allows handling both recognized data tokens and unknown tokens.

### 3.2. DataToken

Union type for tokens representing data values.

```typescript
type DataToken = IdentifierToken | LiteralToken | ObjectToken | ArrayToken;
```

**Usage**

Used throughout the Compiler for processing data values. These tokens can be converted to actual JavaScript values using `Compiler.data()`.

## 4. Parser Interface

The following types define the parser interface and reader functions.

### 4.1. Reader

Function type for token readers that attempt to parse specific patterns.

```typescript
type Reader = (
  code: string, 
  start: number, 
  lexer: Parser
) => Token | undefined;
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | Source code being parsed |
| `start` | `number` | Starting position to attempt parsing |
| `lexer` | `Parser` | Parser instance for recursive parsing |

**Returns**

Token object if pattern matches, undefined otherwise.

**Usage**

Used to define token recognition patterns in the definitions system. Each token type has a corresponding reader function.

### 4.2. Definition

Pairs a token key with its reader function for lexer registration.

```typescript
type Definition = { 
  key: string, 
  reader: Reader 
};
```

**Properties**

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier for the token type |
| `reader` | `Reader` | Function that attempts to parse the token |

**Usage**

Used by the Lexer to register and manage token definitions. The key identifies the token type, and the reader attempts to parse it.

### 4.3. Parser

Interface defining the contract for parser implementations.

```typescript
interface Parser {
  get dictionary(): Record<string, Definition>;
  get index(): number;
  clone(): Parser;
  define(key: string, reader: Reader, type?: string): void;
  expect<T = Token>(keys: string | string[]): T;
  get(key: string): Definition | undefined;
  load(code: string, index: number): this;
  match(code: string, start: number, keys?: string[]): Token | null;
  next(keys: string | string[]): boolean;
  optional<T = Token>(keys: string | string[]): T | undefined;
  read(): Token | undefined;
}
```

**Usage**

Implemented by the Lexer class to provide consistent parsing operations across all tree parsers.

## 5. Reference Types

The following types handle reference resolution and data processing.

### 5.1. UseReferences

Type for managing prop and type references during compilation.

```typescript
type UseReferences = Record<string, any> | false;
```

**Usage**

Used by the Compiler to resolve identifier references:
- `false`: Return template strings like `${PropName}`
- `Record<string, any>`: Resolve identifiers to actual values
- Empty object `{}`: Throw error for unknown references

### 5.2. Scalar

Union type for primitive values that can be stored in schema configurations.

```typescript
type Scalar = string | number | null | boolean;
```

**Usage**

Used in enum configurations and other places where only primitive values are allowed.

### 5.3. Data

Recursive type for nested data structures in schema configurations.

```typescript
type Data = Scalar | Data[] | { [key: string]: Data };
```

**Usage**

Used throughout the system for representing complex nested data structures in plugin configurations, attributes, and other schema elements.

## 6. Usage Examples

### 6.1. Parsing and Token Generation

```typescript
import { EnumTree } from '@stackpress/idea-parser';

const enumCode = `enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}`;

// Parse generates a DeclarationToken
const enumToken = EnumTree.parse(enumCode);
console.log(enumToken.kind); // 'enum'
console.log(enumToken.declarations[0].id.name); // 'Roles'
```

### 6.2. Token Processing with Compiler

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Convert DeclarationToken to configuration
const [enumName, enumConfig] = Compiler.enum(enumToken);
console.log(enumName); // 'Roles'
console.log(enumConfig); // { ADMIN: 'Admin', MANAGER: 'Manager', USER: 'User' }
```

### 6.3. Working with Complex Tokens

```typescript
// ObjectToken processing
const objectToken: ObjectToken = {
  type: 'ObjectExpression',
  start: 0,
  end: 30,
  properties: [
    {
      type: 'Property',
      kind: 'init',
      start: 2,
      end: 15,
      method: false,
      shorthand: false,
      computed: false,
      key: { type: 'Identifier', name: 'type', start: 2, end: 6 },
      value: { type: 'Literal', value: 'text', start: 7, end: 13, raw: '"text"' }
    }
  ]
};

const compiled = Compiler.object(objectToken);
console.log(compiled); // { type: 'text' }
```

### 6.4. Error Handling with Tokens

```typescript
import { Exception } from '@stackpress/idea-parser';

try {
  const invalidToken = { kind: 'invalid' } as DeclarationToken;
  Compiler.enum(invalidToken);
} catch (error) {
  if (error instanceof Exception) {
    console.log('Token error:', error.message); // 'Invalid Enum'
  }
}
```

## 7. Token Validation

Tokens include position information for error reporting and validation:

```typescript
// Position information for error highlighting
const token: IdentifierToken = {
  type: 'Identifier',
  name: 'InvalidName',
  start: 10,
  end: 21
};

// Can be used to highlight errors in editors
const errorRange = { start: token.start, end: token.end };
```

## 8. Integration with AST

AST classes generate specific token types:

- **EnumTree**: Generates `DeclarationToken` with `kind: 'enum'`
- **PropTree**: Generates `DeclarationToken` with `kind: 'prop'`
- **TypeTree**: Generates `DeclarationToken` with `kind: 'type'`
- **ModelTree**: Generates `DeclarationToken` with `kind: 'model'`
- **PluginTree**: Generates `DeclarationToken` with `kind: 'plugin'`
- **UseTree**: Generates `ImportToken`
- **SchemaTree**: Generates `SchemaToken` containing all other tokens

Each AST class uses the Lexer to generate appropriate tokens, which are then processed by the Compiler to produce the final JSON configuration.
