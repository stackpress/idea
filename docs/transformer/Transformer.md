# Transformer

A class for loading, processing, and transforming schema files with plugin support and schema merging capabilities.

```typescript
import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();
```

## Overview

The `Transformer` class is the core component of the idea-transformer library. It handles:

- Loading schema files (both `.idea` and `.json` formats)
- Processing and merging schema configurations from multiple files
- Executing plugins defined in the schema
- Managing file dependencies and imports

## Static Methods

The following methods can be accessed directly from the Transformer class.

### Loading a Transformer

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

## Properties

The following properties are available when instantiating a Transformer.

| Property | Type | Description |
|----------|------|-------------|
| `loader` | `FileLoader` | File system loader for handling file operations |
| `input` | `string` | Absolute path to the input schema file |

## Methods

The following methods are available when instantiating a Transformer.

### Loading Schema Configuration

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

### Transforming with Plugins

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

## Usage Examples

### Basic Schema Loading

```typescript
import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();

// Access different parts of the schema
console.log('Models:', Object.keys(schema.model || {}));
console.log('Enums:', Object.keys(schema.enum || {}));
console.log('Types:', Object.keys(schema.type || {}));
```

### Working with Multiple Schema Files

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

### Plugin Development and Execution

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

### Error Handling

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

### Custom File System

```typescript
import { NodeFS } from '@stackpress/lib';

// Using custom file system
const customFS = new NodeFS();
const transformer = await Transformer.load('./schema.idea', {
  fs: customFS,
  cwd: '/custom/working/directory'
});
```

## Error Scenarios

### File Not Found

```typescript
// Throws: "Input file /path/to/nonexistent.idea does not exist"
const transformer = await Transformer.load('./nonexistent.idea');
await transformer.schema(); // Error thrown here
```

### No Plugins Defined

```typescript
// If schema has no plugins defined
const transformer = await Transformer.load('./schema-without-plugins.idea');
await transformer.transform(); // Throws: "No plugins defined in schema file"
```

### Invalid Plugin Module

```typescript
// If plugin file doesn't export a function
const transformer = await Transformer.load('./schema.idea');
await transformer.transform(); // Plugin is silently skipped if not a function
```

## Best Practices

### Schema Organization

```typescript
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

### Plugin Development

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

### Error Recovery

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

## Integration with Other Tools

### Build Systems

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

### Testing

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