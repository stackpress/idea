# Idea Parser

A TypeScript library for parsing `.idea` schema files into Abstract Syntax Trees (AST) and converting them to readable JSON configurations. This library is designed to help developers work with schema definitions in a structured and type-safe manner.

- [1. Installation](#1-installation)
- [2. Quick Start](#2-quick-start)
- [3. Core Concepts](#3-core-concepts)
- [4. API Reference](#4-api-reference)
- [5. Examples](#5-examples)
- [6. Best Practices](#6-best-practices)

## 1. Installation

Install the package using npm:

```bash
npm install @stackpress/idea-parser
```

## 2. Quick Start

The library provides two main functions for parsing schema files:

### 2.1. Basic Usage

```typescript
import { parse, final } from '@stackpress/idea-parser';

// Parse a schema file into JSON (includes references)
const schemaCode = `
prop Text { type "text" }
enum Roles {
  ADMIN "Admin"
  USER "User"
}
model User {
  id String @id
  name String @field.input(Text)
  role Roles
}
`;

// Parse with references intact
const parsedSchema = parse(schemaCode);

// Parse and clean up references (final version)
const finalSchema = final(schemaCode);
```

### 2.2. Difference Between `parse` and `final`

- **`parse(code: string)`**: Converts schema code to JSON while preserving prop and use references
- **`final(code: string)`**: Like `parse` but removes prop and use references for a clean final output

## 3. Core Concepts

### 3.1. Schema Structure

An `.idea` schema file can contain several types of declarations:

1. **Plugins**: External integrations and configurations
2. **Use statements**: Import other schema files
3. **Props**: Reusable property configurations
4. **Enums**: Enumerated value definitions
5. **Types**: Custom type definitions with columns
6. **Models**: Database model definitions

### 3.2. Processing Flow

The library follows this processing flow:

```
Raw Schema Code → SchemaTree → Compiler → JSON Output
```

1. **Raw Code**: Your `.idea` schema file content
2. **SchemaTree**: Parses the entire file into an Abstract Syntax Tree
3. **Compiler**: Converts AST tokens into structured JSON
4. **JSON Output**: Final configuration object

## 4. API Reference

### 4.1. Main Functions

#### 4.1.1. `parse(code: string)`

Converts schema code into a JSON representation with references preserved.

**Parameters:**
- `code` (string): The schema code to parse

**Returns:**
- `SchemaConfig`: JSON object representing the parsed schema

**Example:**
```typescript
import { parse } from '@stackpress/idea-parser';

const result = parse(`
prop Text { type "text" }
model User {
  name String @field.input(Text)
}
`);

console.log(result);
// Output includes prop references: { prop: { Text: { type: "text" } }, ... }
```

#### 4.1.2. `final(code: string)`

Converts schema code into a clean JSON representation with references resolved and removed.

**Parameters:**
- `code` (string): The schema code to parse

**Returns:**
- `FinalSchemaConfig`: Clean JSON object without prop/use references

**Example:**
```typescript
import { final } from '@stackpress/idea-parser';

const result = final(`
prop Text { type "text" }
model User {
  name String @field.input(Text)
}
`);

console.log(result);
// Output has resolved references: { model: { User: { ... } } }
// No 'prop' section in output
```

### 4.2. Core Classes

- **[Compiler](./Compiler.md)**: Static methods for converting AST tokens to JSON
- **[Lexer](./Lexer.md)**: Tokenization and parsing utilities
- **[SchemaTree](./SchemaTree.md)**: Main parser for complete schema files
- **[Syntax Trees](./Trees.md)**: Individual parsers for different schema elements
- **[Tokens](./Tokens.md)**: AST token structures and type definitions

### 4.3. Exception Handling

The library uses a custom `Exception` class that extends the standard Exception class for better error reporting.

```typescript
import { Exception } from '@stackpress/idea-parser';

try {
  const result = parse(invalidCode);
} catch (error) {
  if (error instanceof Exception) {
    console.log('Parsing error:', error.message);
  }
}
```

## 5. Examples

### 5.1. Complete Schema Example

```typescript
import { final } from '@stackpress/idea-parser';

const schemaCode = `
plugin "./database-plugin" {
  provider "postgresql"
  url env("DATABASE_URL")
}

prop Text { type "text" }
prop Email { type "email" format "email" }

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
  GUEST "Guest User"
}

type Address {
  street String @field.input(Text) @is.required
  city String @field.input(Text) @is.required
  country String @field.select
  postal String @field.input(Text)
}

model User! {
  id String @id @default("nanoid()")
  email String @field.input(Email) @is.required @is.unique
  name String @field.input(Text) @is.required
  role UserRole @default("USER")
  address Address?
  active Boolean @default(true)
  created Date @default("now()")
  updated Date @default("updated()")
}
`;

const result = final(schemaCode);
console.log(JSON.stringify(result, null, 2));
```

### 5.2. Working with Individual Components

```typescript
import { Compiler, EnumTree, ModelTree } from '@stackpress/idea-parser';

// Parse individual enum
const enumCode = `enum Status { ACTIVE "Active" INACTIVE "Inactive" }`;
const enumAST = EnumTree.parse(enumCode);
const [enumName, enumConfig] = Compiler.enum(enumAST);

// Parse individual model
const modelCode = `model User { id String @id name String }`;
const modelAST = ModelTree.parse(modelCode);
const [modelName, modelConfig] = Compiler.model(modelAST);
```

## 6. Best Practices

### 6.1. Use Type Safety

The library is built with TypeScript and provides comprehensive type definitions:

```typescript
import type { SchemaConfig, ModelConfig } from '@stackpress/idea-parser';

const schema: SchemaConfig = parse(code);
```

### 6.2. Handle Errors Gracefully

Always wrap parsing operations in try-catch blocks:

```typescript
import { parse, Exception } from '@stackpress/idea-parser';

try {
  const result = parse(schemaCode);
  // Process result
} catch (error) {
  if (error instanceof Exception) {
    console.error('Schema parsing failed:', error.message);
    // Handle parsing error
  } else {
    console.error('Unexpected error:', error);
    // Handle other errors
  }
}
```

### 6.3. Choose the Right Function

- Use `parse()` when you need to preserve references for further processing
- Use `final()` when you want a clean output for final consumption

### 6.4. Validate Schema Structure

Ensure your schema follows the expected structure:

```ts
// Good: Proper model structure
model User {
  id String @id
  name String
}

// Bad: Missing required properties
model User {
  // Missing columns - will throw error
}
```

### 6.5. Use Meaningful Names

Choose descriptive names for your schema elements:

```ts
// Good
enum UserStatus { ACTIVE "Active" SUSPENDED "Suspended" }
prop EmailInput { type "email" format "email" }

// Less clear
enum Status { A "Active" S "Suspended" }
prop Input { type "email" }
```

## 7. Error Handling

Common errors and their solutions:

### 7.1. Invalid Schema Structure
```
Error: "Invalid Schema"
```
**Solution**: Ensure your schema follows the correct syntax and structure.

### 7.2. Missing Required Properties
```
Error: "Expecting a columns property"
```
**Solution**: Models and types must have a columns definition.

### 7.3. Duplicate Declarations
```
Error: "Duplicate [name]"
```
**Solution**: Each declaration name must be unique within the schema.

### 7.4. Unknown References
```
Error: "Unknown reference [name]"
```
**Solution**: Ensure all referenced props and types are defined before use.

## 8. Next Steps

- [Lexer API Reference](./Lexer.md)
- [Compiler API Reference](./Compiler.md)
- [AST Reference](./Trees.md)
- [Token Reference](./Tokens.md)
- [Exception Handling](./Exception.md)
