# Exception

The Exception class extends the Exception class from `@stackpress/lib` to provide enhanced error handling specific to the idea parser library. It includes position information and better error reporting for parsing failures.

```typescript
import { Exception } from '@stackpress/idea-parser';
```

 1. [Overview](#1-overview)
 2. [Usage Examples](#2-usage-examples)
 3. [Integration with AST](#3-integration-with-ast)
 4. [Error Recovery](#4-error-recovery)
 5. [Language Server Integration](#5-language-server-integration)
 6. [Inherited Features](#6-inherited-features)
 7. [Best Practices](#7-best-practices)

## 1. Overview

Exception is a specialized error class that extends the base Exception class with additional functionality for parser-specific error handling. It automatically includes position information when parsing fails, making it easier to identify and fix syntax errors in schema files.

## 2. Usage Examples

The following examples demonstrates how to use exceptions.

### 2.1. Basic Error Handling

```typescript
import { parse, Exception } from '@stackpress/idea-parser';

try {
  const result = parse('invalid schema syntax');
} catch (error) {
  if (error instanceof Exception) {
    console.log('Parser error:', error.message);
    console.log('Error position:', error.start, '-', error.end);
    console.log('Stack trace:', error.stack);
  }
}
```

### 2.2. Position Information

Exception includes position information to help locate errors in the source code:

```typescript
import { EnumTree, Exception } from '@stackpress/idea-parser';

try {
  // Missing closing brace
  EnumTree.parse('enum Status { ACTIVE "Active"');
} catch (error) {
  if (error instanceof Exception) {
    console.log('Error message:', error.message);
    console.log('Error starts at character:', error.start);
    console.log('Error ends at character:', error.end);
    
    // Can be used for syntax highlighting in editors
    const errorRange = { start: error.start, end: error.end };
  }
}
```

### 2.3. Common Error Scenarios

The following examples demonstrate common error scenarios that can occur during parsing. Each scenario shows the type of error that triggers an Exception and how to handle it appropriately.

#### 2.3.1. Syntax Errors

Syntax errors occur when the parser encounters invalid syntax in the schema code. These are the most common type of parsing errors and typically involve missing brackets, braces, or other structural elements.

```typescript
try {
  parse('enum Status { ACTIVE "Active"'); // Missing closing brace
} catch (error) {
  console.log(error.message); // "Unexpected end of input expecting }"
}
```

#### 2.3.2. Invalid Token Types

Invalid token type errors occur when the parser encounters tokens that don't match the expected grammar rules. This commonly happens with incorrect capitalization or using reserved keywords incorrectly.

```typescript
try {
  parse('model user { id String }'); // Invalid - should be capitalized
} catch (error) {
  console.log(error.message); // "Expected CapitalIdentifier but got something else"
}
```

#### 2.3.3. Unknown References

Unknown reference errors occur when the parser encounters references to types, properties, or other identifiers that haven't been defined in the schema. This typically happens when referencing custom types or properties that don't exist.

```typescript
try {
  parse('model User { name String @field.input(UnknownProp) }');
} catch (error) {
  console.log(error.message); // "Unknown reference UnknownProp"
}
```

#### 2.3.4. Duplicate Declarations

Duplicate declaration errors occur when the same identifier is declared multiple times within the same scope. This prevents ambiguity in the schema and ensures each type, enum, or model has a unique name.

```typescript
try {
  parse(`
    enum Status { ACTIVE "Active" }
    enum Status { INACTIVE "Inactive" }
  `);
} catch (error) {
  console.log(error.message); // "Duplicate Status"
}
```

## 3. Integration with AST

All AST classes throw Exception when parsing fails:

```typescript
import { SchemaTree, EnumTree, ModelTree, Exception } from '@stackpress/idea-parser';

// Any parsing operation can throw Exception
try {
  const schema = SchemaTree.parse(schemaCode);
  const enumAST = EnumTree.parse(enumCode);
  const modelAST = ModelTree.parse(modelCode);
} catch (error) {
  if (error instanceof Exception) {
    // Handle parser-specific errors
    console.error('Parsing failed:', error.message);
  } else {
    // Handle other types of errors
    console.error('Unexpected error:', error);
  }
}
```

## 4. Error Recovery

While Exception indicates parsing failure, you can implement error recovery strategies:

```typescript
import { parse, Exception } from '@stackpress/idea-parser';

function parseWithFallback(code: string, fallbackCode?: string) {
  try {
    return parse(code);
  } catch (error) {
    if (error instanceof Exception && fallbackCode) {
      console.warn('Primary parsing failed, trying fallback:', error.message);
      return parse(fallbackCode);
    }
    throw error; // Re-throw if no fallback or different error type
  }
}
```

## 5. Language Server Integration

Exception's position information makes it ideal for language server implementations:

```typescript
import { parse, Exception } from '@stackpress/idea-parser';

function validateSchema(code: string) {
  try {
    parse(code);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof Exception) {
      return {
        valid: false,
        errors: [{
          message: error.message,
          range: {
            start: error.start,
            end: error.end
          },
          severity: 'error'
        }]
      };
    }
    throw error;
  }
}
```

## 6. Inherited Features

Since Exception extends the base Exception class from `@stackpress/lib`, it inherits all the enhanced error handling features:

- Template-based error messages
- Enhanced stack trace parsing
- Position information support
- HTTP status code integration
- Validation error aggregation

For more details on the base Exception functionality, refer to the [@stackpress/lib Exception documentation](https://github.com/stackpress/lib#exception).

## 7. Best Practices

The following best practices help ensure robust error handling when working with the Exception class. These guidelines promote consistent error handling patterns and improve debugging capabilities.

### 7.1. Always Check Error Type

Always check if an error is an instance of Exception before accessing parser-specific properties. This ensures your code can handle both parser errors and other types of errors gracefully.

```typescript
try {
  parse(schemaCode);
} catch (error) {
  if (error instanceof Exception) {
    // Handle parser errors specifically
    handleParserError(error);
  } else {
    // Handle other errors (network, file system, etc.)
    handleGenericError(error);
  }
}
```

### 7.2. Use Position Information

Leverage the position information provided by Exception to create helpful error displays and debugging tools. This information is particularly useful for IDE integrations and syntax highlighting.

```typescript
function highlightError(code: string, error: Exception) {
  const lines = code.split('\n');
  let currentPos = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const lineEnd = currentPos + lines[i].length;
    
    if (error.start >= currentPos && error.start <= lineEnd) {
      const lineStart = error.start - currentPos;
      const lineEnd = Math.min(error.end - currentPos, lines[i].length);
      
      console.log(`Line ${i + 1}: ${lines[i]}`);
      console.log(' '.repeat(lineStart + 8) + '^'.repeat(lineEnd - lineStart));
      break;
    }
    
    currentPos = lineEnd + 1; // +1 for newline
  }
}
```

### 7.3. Provide Helpful Error Messages

Enhance error messages with additional context such as file names, line numbers, or suggestions for fixing the error. This makes debugging easier and improves the developer experience.

```typescript
function parseWithContext(code: string, filename?: string) {
  try {
    return parse(code);
  } catch (error) {
    if (error instanceof Exception) {
      const context = filename ? ` in ${filename}` : '';
      throw new Exception(
        `Parse error${context}: ${error.message}`,
        error.code
      ).withPosition(error.start, error.end);
    }
    throw error;
  }
}
```
