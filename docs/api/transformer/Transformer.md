# Transformer

A class for loading, processing, and transforming schema files with plugin support and schema merging capabilities. The Transformer class serves as the core component of the idea-transformer library, providing comprehensive functionality for schema processing, plugin execution, and file management.

```typescript
import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();
```

 1. [Overview](#1-overview)
 2. [Loading a Transformer](#2-loading-a-transformer)
 3. [Properties](#3-properties)
 4. [Methods](#4-methods)
 5. [Usage Examples](#5-usage-examples)
 6. [Error Scenarios](#6-error-scenarios)
 7. [Best Practices](#7-best-practices)
 8. [Integration with Other Tools](#8-integration-with-other-tools)

## 1. Overview

The Transformer class provides a comprehensive solution for processing schema files and executing transformations. This section outlines the core capabilities and responsibilities of the Transformer class within the idea-transformer ecosystem.

The `Transformer` class is the core component of the idea-transformer library. It handles:

- Loading schema files (both `.idea` and `.json` formats)
- Processing and merging schema configurations from multiple files
- Executing plugins defined in the schema
- Managing file dependencies and imports

## 2. Loading a Transformer

The load method creates a new Transformer instance configured with the specified input file and options. This is the primary way to create a transformer and begin working with schema files.

The following example shows how to create a new Transformer instance.

```typescript
import Transformer from '@stackpress/idea-transformer';

// Load with default options
const transformer = await Transformer.load('./schema.idea');

// Load with custom options
const transformer = await Transformer.load('./schema.idea', {
  cwd: '/custom/working/directory',
  fs: customFileSystem
});
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `input` | `string` | Path to the schema file to load |
| `options` | `FileLoaderOptions` | Optional configuration for file loading |

**Returns**

A promise that resolves to a new Transformer instance configured with the specified input file and options.

## 3. Properties

The properties section describes the instance variables available on Transformer objects. These properties provide access to the underlying file system operations and configuration details needed for schema processing.

**Properties**

The following properties are available when instantiating a Transformer.

| Property | Type | Description |
|----------|------|-------------|
| `loader` | `FileLoader` | File system loader for handling file operations |
| `input` | `string` | Absolute path to the input schema file |

## 4. Methods

The methods section covers the instance methods available on Transformer objects. These methods provide the core functionality for loading schema configurations, processing dependencies, and executing plugin transformations.

### 4.1. Loading Schema Configuration

The schema method loads and processes the complete schema configuration, including all dependencies and imports. This method handles the complex process of merging multiple schema files and resolving all references.

The following example shows how to load and process the schema configuration.

```typescript
const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();

console.log(schema.model); // Access model definitions
console.log(schema.enum); // Access enum definitions
console.log(schema.type); // Access type definitions
console.log(schema.prop); // Access prop definitions
console.log(schema.plugin); // Access plugin configurations
```

**Returns**

A promise that resolves to a `SchemaConfig` object containing all processed schema definitions.

**Features**

- **File Format Support**: Automatically detects and handles both `.idea` and `.json` schema files
- **Dependency Resolution**: Processes `use` directives to import and merge external schema files
- **Schema Merging**: Intelligently merges child schemas into parent schemas based on mutability rules
- **Caching**: Caches the processed schema to avoid redundant processing

**Schema Merging Rules**

When processing `use` directives, the transformer applies these merging rules:

1. **Props and Enums**: Simple merge where parent takes precedence
2. **Types and Models**: 
   - If parent doesn't exist or is immutable: child is added
   - If parent is mutable: attributes and columns are merged
   - Child columns are prepended to parent columns
   - Parent attributes take precedence over child attributes

### 4.2. Transforming with Plugins

The transform method executes all plugins defined in the schema configuration. This method coordinates the plugin execution process, providing each plugin with the necessary context and handling any errors that occur during transformation.

The following example shows how to execute all plugins defined in the schema.

```typescript
const transformer = await Transformer.load('./schema.idea');

// Transform with no additional context
await transformer.transform();

// Transform with additional context
await transformer.transform({
  outputDir: './generated',
  debug: true
});
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `extras` | `T` | Optional additional context to pass to plugins |

**Returns**

A promise that resolves when all plugins have been executed.

**Plugin Execution Process**

1. **Validation**: Ensures plugins are defined in the schema
2. **Module Resolution**: Resolves plugin file paths relative to the schema file
3. **Dynamic Import**: Loads plugin modules dynamically
4. **Context Injection**: Passes context including transformer, schema, config, and extras
5. **Execution**: Calls each plugin function with the injected context

**Plugin Context**

Each plugin receives a context object with the following properties:

```typescript
{
  transformer: Transformer,  // The transformer instance
  config: PluginConfig,      // Plugin-specific configuration
  schema: SchemaConfig,      // Complete processed schema
  cwd: string,              // Current working directory
  ...extras                 // Any additional context passed to transform()
}
```

## 5. Usage Examples

This section provides practical examples of how to use the Transformer class in various scenarios. These examples demonstrate common patterns and best practices for working with schema files, plugins, and transformations.

### 5.1. Basic Schema Loading

Basic schema loading demonstrates the fundamental workflow for loading and accessing schema configurations. This example shows how to create a transformer instance and retrieve different parts of the processed schema.

```typescript
import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();

// Access different parts of the schema
console.log('Models:', Object.keys(schema.model || {}));
console.log('Enums:', Object.keys(schema.enum || {}));
console.log('Types:', Object.keys(schema.type || {}));
```

### 5.2. Working with Multiple Schema Files

Working with multiple schema files shows how the Transformer handles complex schema hierarchies with imports and dependencies. This example demonstrates how the use directive enables modular schema organization.

```typescript
// main.idea
/*
use "./shared/types.idea"
use "./shared/enums.idea"

model User {
  id String @id
  profile Profile  // From shared/types.idea
  role UserRole    // From shared/enums.idea
}
*/

const transformer = await Transformer.load('./main.idea');
const schema = await transformer.schema();

// The schema now includes definitions from all imported files
console.log(schema.type?.Profile);  // Available from shared/types.idea
console.log(schema.enum?.UserRole); // Available from shared/enums.idea
```

### 5.3. Plugin Development and Execution

Plugin development and execution demonstrates how to create and use plugins with the Transformer. This example shows both the schema configuration and plugin implementation, illustrating the complete plugin workflow.

```typescript
// schema.idea
/*
plugin "./plugins/generate-types.js" {
  output "./generated/types.ts"
  format "typescript"
}
*/

// plugins/generate-types.js
export default function generateTypes({ transformer, config, schema, cwd }) {
  const outputPath = config.output;
  const format = config.format;
  
  // Generate TypeScript types based on schema
  let content = '';
  
  if (schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      content += `export interface ${name} {\n`;
      for (const column of model.columns) {
        const optional = column.required ? '' : '?';
        content += `  ${column.name}${optional}: ${column.type};\n`;
      }
      content += '}\n\n';
    }
  }
  
  // Write generated content to file
  await writeFile(path.resolve(cwd, outputPath), content);
}

// Execute the transformation
const transformer = await Transformer.load('./schema.idea');
await transformer.transform({
  timestamp: new Date().toISOString()
});
```

### 5.4. Error Handling

Error handling examples show how to properly catch and handle different types of errors that can occur during schema processing and transformation. This includes both expected errors from the idea-parser and unexpected runtime errors.

```typescript
import { Exception } from '@stackpress/idea-parser';

try {
  const transformer = await Transformer.load('./schema.idea');
  const schema = await transformer.schema();
  await transformer.transform();
} catch (error) {
  if (error instanceof Exception) {
    console.error('Schema processing error:', error.message);
    console.error('Error code:', error.code);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### 5.5. Custom File System

Custom file system usage demonstrates how to configure the Transformer to work with different file system implementations. This is useful for testing, custom storage backends, or specialized deployment scenarios.

```typescript
import { NodeFS } from '@stackpress/lib';

// Using custom file system
const customFS = new NodeFS();
const transformer = await Transformer.load('./schema.idea', {
  fs: customFS,
  cwd: '/custom/working/directory'
});
```

## 6. Error Scenarios

This section covers common error conditions that can occur when using the Transformer class. Understanding these scenarios helps developers implement proper error handling and debugging strategies.

### 6.1. File Not Found

File not found errors occur when the specified schema file doesn't exist or isn't accessible. This section shows how these errors are reported and how to handle them appropriately.

```typescript
// Throws: "Input file /path/to/nonexistent.idea does not exist"
const transformer = await Transformer.load('./nonexistent.idea');
await transformer.schema(); // Error thrown here
```

### 6.2. No Plugins Defined

No plugins defined errors occur when attempting to execute transformations on schemas that don't have any plugin configurations. This section explains when this error occurs and how to handle it.

```typescript
// If schema has no plugins defined
const transformer = await Transformer.load('./schema-without-plugins.idea');
await transformer.transform(); // Throws: "No plugins defined in schema file"
```

### 6.3. Invalid Plugin Module

Invalid plugin module scenarios occur when plugin files exist but don't export the expected function interface. This section covers how the Transformer handles these situations and what developers should expect.

```typescript
// If plugin file doesn't export a function
const transformer = await Transformer.load('./schema.idea');
await transformer.transform(); // Plugin is silently skipped if not a function
```

## 7. Best Practices

This section outlines recommended approaches for using the Transformer class effectively. Following these practices helps ensure reliable, maintainable, and efficient schema processing workflows.

### 7.1. Schema Organization

Schema organization best practices help maintain clean, modular, and reusable schema files. This section provides guidance on structuring schema hierarchies and managing dependencies effectively.

```idea
// Organize schemas hierarchically
// shared/base.idea - Common types and enums
// modules/user.idea - User-specific models
// main.idea - Main schema that imports others

use "./shared/base.idea"
use "./modules/user.idea"

// Additional models specific to this schema
model Application {
  id String @id
  users User[]
}
```

### 7.2. Plugin Development

Plugin development best practices ensure that plugins are robust, reliable, and integrate well with the Transformer ecosystem. This section covers validation, error handling, and proper use of the plugin context.

```typescript
// Always validate plugin configuration
export default async function myPlugin({ config, schema, transformer, cwd }) {
  // Validate required configuration
  if (!config.output) {
    throw new Error('Plugin requires output configuration');
  }
  
  // Use transformer's file loader for consistent path resolution
  const outputPath = await transformer.loader.absolute(config.output);
  
  // Process schema safely
  const models = schema.model || {};
  const enums = schema.enum || {};
  
  // Generate output...
}
```

### 7.3. Error Recovery

Error recovery strategies help build resilient applications that can handle schema processing failures gracefully. This section demonstrates patterns for implementing robust error handling and recovery mechanisms.

```typescript
// Implement graceful error handling
async function processSchema(schemaPath) {
  try {
    const transformer = await Transformer.load(schemaPath);
    const schema = await transformer.schema();
    await transformer.transform();
    return { success: true, schema };
  } catch (error) {
    console.error(`Failed to process ${schemaPath}:`, error.message);
    return { success: false, error: error.message };
  }
}
```

## 8. Integration with Other Tools

This section demonstrates how to integrate the Transformer class with other development tools and workflows. These examples show practical applications in build systems, testing frameworks, and development environments.

### 8.1. Build Systems

Build system integration shows how to incorporate schema transformation into automated build processes. This enables continuous generation of code, documentation, and other artifacts from schema definitions.

```typescript
// Integration with build tools
import Transformer from '@stackpress/idea-transformer';

export async function buildSchemas(inputDir, outputDir) {
  const schemaFiles = await glob(`${inputDir}/**/*.idea`);
  
  for (const schemaFile of schemaFiles) {
    const transformer = await Transformer.load(schemaFile);
    await transformer.transform({ outputDir });
  }
}
```

### 8.2. Testing

Testing integration demonstrates how to write tests for schema transformations and validate that schemas are processed correctly. This is essential for maintaining schema quality and catching regressions.

```typescript
// Testing schema transformations
import { expect } from 'chai';

describe('Schema Transformation', () => {
  it('should process schema correctly', async () => {
    const transformer = await Transformer.load('./test-schema.idea');
    const schema = await transformer.schema();
    
    expect(schema.model).to.have.property('User');
    expect(schema.model.User.columns).to.have.length.greaterThan(0);
  });
});
```
