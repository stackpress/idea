# Exception

The Exception class extends the Exception class from `@stackpress/lib` to provide enhanced error handling specific to the idea parser library. It includes position information and better error reporting for parsing failures.

```typescript
import { Exception } from '@stackpress/idea-parser';
```

## Overview

Exception is a specialized error class that extends the base Exception class with additional functionality for parser-specific error handling. It automatically includes position information when parsing fails, making it easier to identify and fix syntax errors in schema files.

## Usage Examples

### Basic Error Handling

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

### Position Information

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

### Common Error Scenarios

#### Syntax Errors

```typescript
try {
  parse('enum Status { ACTIVE "Active"'); // Missing closing brace
} catch (error) {
  console.log(error.message); // "Unexpected end of input expecting }"
}
```

#### Invalid Token Types

```typescript
try {
  parse('model user { id String }'); // Invalid - should be capitalized
} catch (error) {
  console.log(error.message); // "Expected CapitalIdentifier but got something else"
}
```

#### Unknown References

```typescript
try {
  parse('model User { name String @field.input(UnknownProp) }');
} catch (error) {
  console.log(error.message); // "Unknown reference UnknownProp"
}
```

#### Duplicate Declarations

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

## Integration with AST

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

## Error Recovery

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

## Language Server Integration

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

## Inherited Features

Since Exception extends the base Exception class from `@stackpress/lib`, it inherits all the enhanced error handling features:

- Template-based error messages
- Enhanced stack trace parsing
- Position information support
- HTTP status code integration
- Validation error aggregation

For more details on the base Exception functionality, refer to the [@stackpress/lib Exception documentation](https://github.com/stackpress/lib#exception).

## Best Practices

### Always Check Error Type

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

### Use Position Information

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

### Provide Helpful Error Messages

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
