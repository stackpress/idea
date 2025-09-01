# Idea Parser

A TypeScript library for parsing `.idea` schema files into Abstract Syntax Trees (AST) and converting them to readable JSON configurations. This library is designed to help developers work with schema definitions in a structured and type-safe manner, providing comprehensive parsing capabilities for the idea schema format.

 1. [Installation](#1-installation)
 2. [Quick Start](#2-quick-start)
 3. [Core Concepts](#3-core-concepts)
 4. [API Reference](#4-api-reference)
 5. [Examples](#5-examples)
 6. [Best Practices](#6-best-practices)
 7. [Error Handling](#7-error-handling)
 8. [Next Steps](#8-next-steps)

## 1. Installation

This section covers how to install the idea-parser library in your project. The library is distributed through npm and provides TypeScript definitions out of the box for enhanced development experience.

Install the package using npm:

```bash
npm install @stackpress/idea-parser
```

## 2. Quick Start

This section provides a quick introduction to using the idea-parser library. The library offers two main parsing functions that serve different use cases, allowing you to choose the appropriate level of processing for your needs.

### 2.1. Basic Usage

Basic usage demonstrates the fundamental workflow for parsing schema files. This example shows how to use both parsing functions and understand their different outputs.

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

Understanding the difference between these two functions is crucial for choosing the right approach for your use case. This section explains when to use each function and what to expect from their outputs.

- **`parse(code: string)`**: Converts schema code to JSON while preserving prop and use references
- **`final(code: string)`**: Like `parse` but removes prop and use references for a clean final output

## 3. Core Concepts

This section explains the fundamental concepts and architecture of the idea-parser library. Understanding these concepts will help you work more effectively with schema files and make better decisions about how to structure your schemas.

### 3.1. Schema Structure

Schema structure defines the organization and components that make up an idea schema file. Understanding this structure is essential for creating valid schemas and working with the parser effectively.

An `.idea` schema file can contain several types of declarations:

1. **Plugins**: External integrations and configurations
2. **Use statements**: Import other schema files
3. **Props**: Reusable property configurations
4. **Enums**: Enumerated value definitions
5. **Types**: Custom type definitions with columns
6. **Models**: Database model definitions

### 3.2. Processing Flow

The processing flow describes how the parser transforms raw schema code into structured JSON output. This multi-stage process ensures that schemas are properly validated and converted into usable configurations.

The library follows this processing flow:

```
Raw Schema Code → SchemaTree → Compiler → JSON Output
```

1. **Raw Code**: Your `.idea` schema file content
2. **SchemaTree**: Parses the entire file into an Abstract Syntax Tree
3. **Compiler**: Converts AST tokens into structured JSON
4. **JSON Output**: Final configuration object

## 4. API Reference

This section provides comprehensive documentation for all public APIs exposed by the idea-parser library. The API is designed to be simple yet powerful, offering both high-level convenience functions and low-level access to parsing components.

### 4.1. Main Functions

The main functions provide the primary interface for parsing schema files. These functions handle the complete parsing workflow and return structured JSON representations of your schemas.

#### 4.1.1. `parse(code: string)`

The parse function converts schema code into a JSON representation while preserving all references and intermediate structures. This function is useful when you need to perform additional processing or analysis on the parsed schema.

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

The final function provides a clean, production-ready JSON representation of your schema with all references resolved and unnecessary structures removed. This is typically the function you'll use for generating final configurations.

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

The core classes provide the underlying functionality for parsing and compiling schema files. These classes can be used directly for advanced use cases or when you need fine-grained control over the parsing process.

- **[Compiler](./Compiler.md)**: Static methods for converting AST tokens to JSON
- **[Lexer](./Lexer.md)**: Tokenization and parsing utilities
- **[SchemaTree](./SchemaTree.md)**: Main parser for complete schema files
- **[Syntax Trees](./Trees.md)**: Individual parsers for different schema elements
- **[Tokens](./Tokens.md)**: AST token structures and type definitions

### 4.3. Exception Handling

Exception handling in the idea-parser library uses a custom Exception class that provides detailed error information. This section explains how to properly catch and handle parsing errors in your applications.

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

This section provides practical examples of using the idea-parser library in various scenarios. These examples demonstrate real-world usage patterns and help you understand how to apply the library to your specific needs.

### 5.1. Complete Schema Example

This comprehensive example demonstrates a complete schema file with all major components. It shows how different schema elements work together and how the parser processes complex schemas.

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

Working with individual components shows how to parse specific parts of a schema in isolation. This approach is useful for building tools that need to process schema elements independently or for testing specific parsing functionality.

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

This section outlines recommended approaches for using the idea-parser library effectively. Following these practices helps ensure reliable parsing, maintainable code, and optimal performance.

### 6.1. Use Type Safety

Type safety is one of the key benefits of using the idea-parser library. This section demonstrates how to leverage TypeScript features to catch errors early and improve code reliability.

The library is built with TypeScript and provides comprehensive type definitions:

```typescript
import type { SchemaConfig, ModelConfig } from '@stackpress/idea-parser';

const schema: SchemaConfig = parse(code);
```

### 6.2. Handle Errors Gracefully

Graceful error handling ensures that your applications can recover from parsing failures and provide meaningful feedback to users. This section shows patterns for implementing robust error handling.

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

Choosing the appropriate parsing function for your use case is important for performance and functionality. This section provides guidance on when to use each available function.

- Use `parse()` when you need to preserve references for further processing
- Use `final()` when you want a clean output for final consumption

### 6.4. Validate Schema Structure

Schema validation helps catch structural issues early in the development process. This section shows how to ensure your schemas follow the expected format and conventions.

Ensure your schema follows the expected structure:

```idea
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

Meaningful naming conventions improve schema readability and maintainability. This section provides guidelines for choosing descriptive names for schema elements.

Choose descriptive names for your schema elements:

```idea
// Good
enum UserStatus { ACTIVE "Active" SUSPENDED "Suspended" }
prop EmailInput { type "email" format "email" }

// Less clear
enum Status { A "Active" S "Suspended" }
prop Input { type "email" }
```

## 7. Error Handling

This section covers common error scenarios that can occur when parsing schema files. Understanding these errors and their solutions helps developers quickly identify and resolve parsing issues.

### 7.1. Invalid Schema Structure

Invalid schema structure errors occur when the schema doesn't follow the expected syntax or format. This section explains how to identify and fix structural issues in your schemas.
```
Error: "Invalid Schema"
```
**Solution**: Ensure your schema follows the correct syntax and structure.

### 7.2. Missing Required Properties

Missing required properties errors happen when essential elements are omitted from schema definitions. This section shows how to ensure all required properties are properly defined.
```
Error: "Expecting a columns property"
```
**Solution**: Models and types must have a columns definition.

### 7.3. Duplicate Declarations

Duplicate declaration errors occur when the same name is used for multiple schema elements. This section explains how to avoid naming conflicts and maintain unique identifiers.
```
Error: "Duplicate [name]"
```
**Solution**: Each declaration name must be unique within the schema.

### 7.4. Unknown References

Unknown reference errors happen when schemas reference undefined elements. This section shows how to properly define and reference schema components.
```
Error: "Unknown reference [name]"
```
**Solution**: Ensure all referenced props and types are defined before use.

## 8. Next Steps

This section provides links to additional documentation and resources for deeper exploration of the idea-parser library. These resources help you master advanced features and understand the complete API surface.

- [Lexer API Reference](./Lexer.md)
- [Compiler API Reference](./Compiler.md)
- [AST Reference](./Trees.md)
- [Token Reference](./Tokens.md)
- [Exception Handling](./Exception.md)
