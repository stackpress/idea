# Idea Plugins

The following documentation explains how to develop plugins for `.idea` files. Creating a plugin involves just exporting a function like the example below.

```typescript
import type { PluginWithCLIProps } from '@stackpress/idea';

export default function generate(props: PluginWithCLIProps) {}
```

## Plugin Development Guide

### Basic Plugin Structure

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

export default async function myPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;
  
  // 1. Validate configuration
  if (!config.output) {
    throw new Error('Plugin requires "output" configuration');
  }
  
  // 2. Process schema
  const content = processSchema(schema);
  
  // 3. Resolve output path
  const outputPath = await transformer.loader.absolute(config.output);
  
  // 4. Write output
  await fs.writeFile(outputPath, content, 'utf8');
}

function processSchema(schema: SchemaConfig): string {
  // Implementation for processing schema
  return '// Generated content';
}
```

The `PluginProps` contains the following properties.

| Property | Type | Description |
|----------|------|-------------|
| `config` | `PluginConfig` | Plugin-specific configuration from the schema |
| `schema` | `SchemaConfig` | Complete processed schema configuration |
| `transformer` | `Transformer<{}>` | The transformer instance executing the plugin |
| `cwd` | `string` | Current working directory for file operations |

### CLI-Aware Plugin Structure

```typescript
import type { PluginWithCLIProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';

export default async function cliPlugin(props: PluginWithCLIProps) {
  const { config, schema, transformer, cwd, cli } = props;
  
  // Access CLI properties
  const workingDir = cli.cwd;
  const fileExtension = cli.extname;
  
  // Use CLI for logging or user interaction
  console.log(`Processing schema in: ${workingDir}`);
  
  // Process based on CLI context
  if (config.interactive) {
    // Interactive mode logic
    console.log('Running in interactive mode...');
  }
  
  // Generate output
  const content = generateContent(schema, { workingDir, fileExtension });
  
  // Write to file
  const outputPath = path.resolve(workingDir, config.output);
  await fs.writeFile(outputPath, content, 'utf8');
  
  console.log(`Generated: ${outputPath}`);
}
```

The `PluginWithCLIProps` contains the following properties.

| Property | Type | Description |
|----------|------|-------------|
| `config` | `PluginConfig` | Plugin-specific configuration from the schema |
| `schema` | `SchemaConfig` | Complete processed schema configuration |
| `transformer` | `Transformer<{}>` | The transformer instance executing the plugin |
| `cwd` | `string` | Current working directory for file operations |
| `cli` | `Terminal` | Terminal instance for CLI interactions |

### Custom Plugin Props

You can extend the base plugin props with custom properties:

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';

// Define custom props
interface CustomProps {
  timestamp: string;
  version: string;
  debug: boolean;
}

// Use custom props in plugin
export default async function customPlugin(props: PluginProps<CustomProps>) {
  const { config, schema, transformer, cwd, timestamp, version, debug } = props;
  
  if (debug) {
    console.log(`Plugin executed at ${timestamp} for version ${version}`);
  }
  
  // Plugin implementation
}

// Usage with transformer
const transformer = await Transformer.load('./schema.idea');
await transformer.transform({
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  debug: true
});
```

## Plugin Examples

### TypeScript Interface Generator

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface TypeGenConfig {
  output: string;
  namespace?: string;
  exportType?: 'named' | 'default';
}

export default async function generateInterfaces(
  props: PluginProps<{ config: TypeGenConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  let content = '';
  
  // Add namespace if specified
  if (config.namespace) {
    content += `export namespace ${config.namespace} {\n`;
  }
  
  // Generate interfaces from models
  if (schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      content += generateInterface(name, model);
    }
  }
  
  // Generate types from type definitions
  if (schema.type) {
    for (const [name, type] of Object.entries(schema.type)) {
      content += generateType(name, type);
    }
  }
  
  // Close namespace
  if (config.namespace) {
    content += '}\n';
  }
  
  // Write to output file
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.writeFile(outputPath, content, 'utf8');
}

function generateInterface(name: string, model: any): string {
  let content = `export interface ${name} {\n`;
  
  for (const column of model.columns || []) {
    const optional = column.required ? '' : '?';
    const type = mapToTypeScript(column.type);
    content += `  ${column.name}${optional}: ${type};\n`;
  }
  
  content += '}\n\n';
  return content;
}

function generateType(name: string, type: any): string {
  // Implementation for generating TypeScript types
  return `export type ${name} = any; // TODO: Implement\n\n`;
}

function mapToTypeScript(schemaType: string): string {
  const typeMap: Record<string, string> = {
    'String': 'string',
    'Number': 'number',
    'Boolean': 'boolean',
    'Date': 'Date',
    'JSON': 'any'
  };
  
  return typeMap[schemaType] || 'any';
}
```

### Enum Generator

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';

export default async function generateEnums(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  if (!schema.enum) {
    console.log('No enums found in schema');
    return;
  }
  
  let content = '// Generated Enums\n\n';
  
  for (const [name, enumDef] of Object.entries(schema.enum)) {
    content += `export enum ${name} {\n`;
    
    for (const [key, value] of Object.entries(enumDef)) {
      content += `  ${key} = "${value}",\n`;
    }
    
    content += '}\n\n';
  }
  
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.writeFile(outputPath, content, 'utf8');
  
  console.log(`Generated enums: ${outputPath}`);
}
```

### CLI-Interactive Plugin

```typescript
import type { PluginWithCLIProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

export default async function interactiveGenerator(props: PluginWithCLIProps) {
  const { config, schema, transformer, cli } = props;
  
  // Use CLI for interactive prompts
  console.log(`\n🚀 Interactive Generator`);
  console.log(`Working Directory: ${cli.cwd}`);
  console.log(`Schema Extension: ${cli.extname}`);
  
  // Process based on available schema elements
  const hasModels = schema.model && Object.keys(schema.model).length > 0;
  const hasEnums = schema.enum && Object.keys(schema.enum).length > 0;
  const hasTypes = schema.type && Object.keys(schema.type).length > 0;
  
  console.log(`\n📊 Schema Summary:`);
  console.log(`  Models: ${hasModels ? Object.keys(schema.model!).length : 0}`);
  console.log(`  Enums: ${hasEnums ? Object.keys(schema.enum!).length : 0}`);
  console.log(`  Types: ${hasTypes ? Object.keys(schema.type!).length : 0}`);
  
  // Generate based on configuration
  const outputs: string[] = [];
  
  if (config.generateModels && hasModels) {
    const modelContent = generateModels(schema.model!);
    const modelPath = path.resolve(cli.cwd, 'generated/models.ts');
    await fs.mkdir(path.dirname(modelPath), { recursive: true });
    await fs.writeFile(modelPath, modelContent, 'utf8');
    outputs.push(modelPath);
  }
  
  if (config.generateEnums && hasEnums) {
    const enumContent = generateEnums(schema.enum!);
    const enumPath = path.resolve(cli.cwd, 'generated/enums.ts');
    await fs.mkdir(path.dirname(enumPath), { recursive: true });
    await fs.writeFile(enumPath, enumContent, 'utf8');
    outputs.push(enumPath);
  }
  
  // Report results
  console.log(`\n✅ Generated ${outputs.length} files:`);
  outputs.forEach(file => console.log(`  📄 ${file}`));
}

function generateModels(models: Record<string, any>): string {
  // Implementation for generating models
  return '// Generated models\n';
}

function generateEnums(enums: Record<string, any>): string {
  // Implementation for generating enums
  return '// Generated enums\n';
}
```

## Plugin Configuration

### Schema Plugin Definition

```typescript
// schema.idea
plugin "./plugins/my-plugin.js" {
  output "./generated/output.ts"
  format "typescript"
  options {
    strict true
    comments true
  }
}
```

### Plugin Configuration Access

```typescript
export default async function myPlugin(props: PluginProps<{}>) {
  const { config } = props;
  
  // Access top-level config
  const output = config.output;
  const format = config.format;
  
  // Access nested options
  const options = config.options || {};
  const strict = options.strict || false;
  const comments = options.comments || false;
  
  // Use configuration in plugin logic
  if (strict) {
    // Enable strict mode
  }
  
  if (comments) {
    // Add comments to generated code
  }
}
```

## Error Handling

### Plugin Error Handling

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';

export default async function safePlugin(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate required configuration
    if (!config.output) {
      throw new Error('Missing required "output" configuration');
    }
    
    // Validate schema has required elements
    if (!schema.model || Object.keys(schema.model).length === 0) {
      throw new Error('Schema must contain at least one model');
    }
    
    // Process schema
    const content = await processSchema(schema);
    
    // Write output
    const outputPath = await transformer.loader.absolute(config.output);
    await writeOutput(outputPath, content);
    
    console.log(`✅ Plugin completed successfully: ${outputPath}`);
    
  } catch (error) {
    console.error(`❌ Plugin failed:`, error.message);
    throw error; // Re-throw to stop transformation
  }
}
```

### Graceful Error Recovery

```typescript
export default async function resilientPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  const warnings: string[] = [];
  
  try {
    // Attempt primary functionality
    await primaryGeneration(schema, config);
  } catch (error) {
    warnings.push(`Primary generation failed: ${error.message}`);
    
    // Fallback to basic generation
    try {
      await fallbackGeneration(schema, config);
      warnings.push('Used fallback generation');
    } catch (fallbackError) {
      throw new Error(`Both primary and fallback generation failed: ${fallbackError.message}`);
    }
  }
  
  // Report warnings
  if (warnings.length > 0) {
    console.warn('Plugin completed with warnings:');
    warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`));
  }
}
```

## Best Practices

### Type Safety

```typescript
// Always use proper typing for plugin props
import type { PluginProps, PluginWithCLIProps } from '@stackpress/idea-transformer/types';

// Define custom config types
interface MyPluginConfig {
  output: string;
  format: 'typescript' | 'javascript';
  strict?: boolean;
}

// Use typed props
export default async function typedPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  const { config } = props;
  
  // TypeScript will enforce config structure
  const output: string = config.output; // ✅ Type-safe
  const format: 'typescript' | 'javascript' = config.format; // ✅ Type-safe
  const strict: boolean = config.strict ?? false; // ✅ Type-safe with default
}
```

### Configuration Validation

```typescript
function validateConfig(config: any): asserts config is MyPluginConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('Plugin requires "output" configuration as string');
  }
  
  if (!config.format || !['typescript', 'javascript'].includes(config.format)) {
    throw new Error('Plugin requires "format" to be "typescript" or "javascript"');
  }
}

export default async function validatedPlugin(props: PluginProps<{}>) {
  validateConfig(props.config);
  
  // Now config is properly typed
  const { output, format } = props.config;
}
```

### File Operations

```typescript
// Use transformer's file loader for consistent path resolution
export default async function filePlugin(props: PluginProps<{}>) {
  const { config, transformer } = props;
  
  // ✅ Use transformer.loader for path resolution
  const outputPath = await transformer.loader.absolute(config.output);
  
  // ✅ Create directories if needed
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // ✅ Write file with proper error handling
  try {
    await fs.writeFile(outputPath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to write output file: ${error.message}`);
  }
}
```

### CLI Integration

```typescript
// Use CLI props when available
export default async function adaptivePlugin(props: PluginWithCLIProps) {
  const { cli, config } = props;
  
  // Adapt behavior based on CLI context
  const outputDir = config.outputDir || path.join(cli.cwd, 'generated');
  const verbose = config.verbose || false;
  
  if (verbose) {
    console.log(`Generating files in: ${outputDir}`);
    console.log(`Working directory: ${cli.cwd}`);
    console.log(`File extension: ${cli.extname}`);
  }
  
  // Use CLI working directory for relative paths
  const absoluteOutputDir = path.resolve(cli.cwd, outputDir);
  
  // Generate files...
}
```

This directory contains comprehensive tutorials for creating plugins that work with the `idea-transformer` library. These tutorials demonstrate how to process `.idea` schema files and generate various outputs.

## [Meta Coding With TSMorph](./ts-morph-plugin-guide.md)

This guide demonstrates how to create powerful code generation plugins using `ts-morph`, a TypeScript library that provides an easier way to programmatically navigate and manipulate TypeScript and JavaScript code.

## Available Tutorials

### 1. [MySQL Tables Plugin](./mysql-tables-plugin.md)

Learn how to create a plugin that generates MySQL `CREATE TABLE` statements from your schema.

**What you'll learn:**
- Parse schema models and their columns
- Map schema types to MySQL data types
- Generate SQL DDL statements with constraints
- Handle primary keys, foreign keys, and indexes
- Implement proper error handling and validation

**Generated Output:** SQL files that can be executed to create database tables

---

### 2. [HTML Form Plugin](./html-form-plugin.md)

Learn how to create a plugin that generates responsive HTML forms from your schema.

**What you'll learn:**
- Generate HTML form elements based on field types
- Support multiple CSS frameworks (Bootstrap, Tailwind, Custom)
- Include client-side validation and constraints
- Handle different form layouts and themes
- Create accessible, responsive forms

**Generated Output:** Complete HTML files with forms, styling, and JavaScript validation

---

### 3. [Markdown Documentation Plugin](./markdown-docs-plugin.md)

Learn how to create a plugin that generates comprehensive markdown documentation from your schema.

**What you'll learn:**
- Parse all schema elements (models, types, enums, props)
- Generate structured documentation with navigation
- Include examples and cross-references
- Support multiple documentation formats and templates
- Create both single-file and multi-file documentation

**Generated Output:** Markdown documentation files with complete schema reference

---

## Getting Started

### Prerequisites

Before starting these tutorials, make sure you have:

- Basic understanding of TypeScript/JavaScript
- Familiarity with the `idea-transformer` plugin system
- Understanding of the target technology (MySQL, HTML/CSS, Markdown)

### Plugin Development Basics

All plugins in the `idea-transformer` system follow a similar pattern:

1. **Import Types**: Use the provided TypeScript types for type safety
2. **Define Configuration**: Specify what configuration options your plugin accepts
3. **Validate Input**: Check that required configuration is provided
4. **Process Schema**: Parse the schema and extract relevant information
5. **Generate Output**: Create the target files or content
6. **Handle Errors**: Provide meaningful error messages and graceful failure

### Common Plugin Structure

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface MyPluginConfig {
  output: string;
  // ... other configuration options
}

export default async function myPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  // 1. Validate configuration
  if (!config.output) {
    throw new Error('Plugin requires "output" configuration');
  }
  
  // 2. Process schema
  const content = processSchema(schema);
  
  // 3. Write output
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  console.log(`✅ Generated: ${outputPath}`);
}
```

### Schema Structure

All plugins receive a processed schema with this structure:

```typescript
{
  model: {
    [modelName]: {
      mutable: boolean,
      columns: [
        {
          name: string,
          type: string,
          required: boolean,
          multiple: boolean,
          attributes: object
        }
      ]
    }
  },
  enum: {
    [enumName]: {
      [key]: value
    }
  },
  type: {
    [typeName]: {
      mutable: boolean,
      columns: [...]
    }
  },
  prop: {
    [propName]: {
      // Property configuration
    }
  }
}
```

## Best Practices

### 1. Type Safety

Always use the provided TypeScript types:

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';

interface MyPluginConfig {
  output: string;
  format?: 'json' | 'yaml';
}

export default async function myPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  // TypeScript will enforce the config structure
}
```

### 2. Configuration Validation

Validate all required configuration upfront:

```typescript
function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('Plugin requires "output" configuration');
  }
  
  if (config.format && !['json', 'yaml'].includes(config.format)) {
    throw new Error(`Unsupported format: ${config.format}`);
  }
}
```

### 3. File Operations

Use the transformer's file loader for consistent path resolution:

```typescript
// ✅ Good - uses transformer's file loader
const outputPath = await transformer.loader.absolute(config.output);

// ✅ Good - creates directories if needed
await fs.mkdir(path.dirname(outputPath), { recursive: true });

// ✅ Good - proper error handling
try {
  await fs.writeFile(outputPath, content, 'utf8');
} catch (error) {
  throw new Error(`Failed to write file: ${error.message}`);
}
```

### 4. Error Handling

Provide meaningful error messages and handle edge cases:

```typescript
export default async function myPlugin(props: PluginProps<{}>) {
  try {
    // Validate configuration
    validateConfig(props.config);
    
    // Check for required schema elements
    if (!props.schema.model || Object.keys(props.schema.model).length === 0) {
      console.warn('⚠️  No models found in schema. Skipping generation.');
      return;
    }
    
    // Process and generate
    // ...
    
    console.log('✅ Plugin completed successfully');
    
  } catch (error) {
    console.error(`❌ Plugin failed: ${error.message}`);
    throw error;
  }
}
```

### 5. Schema Processing

Handle optional schema elements gracefully:

```typescript
// ✅ Good - checks for existence before processing
if (schema.model) {
  for (const [modelName, model] of Object.entries(schema.model)) {
    // Process model
  }
}

// ✅ Good - provides defaults for optional attributes
const attributes = column.attributes || {};
const label = attributes.label || column.name;
const description = attributes.description || '';
```

## Usage in Schema Files

To use any of these plugins in your schema file:

```idea
// schema.idea
plugin "./plugins/mysql-tables-plugin.js" {
  output "./database/tables.sql"
  database "my_app"
  engine "InnoDB"
}

plugin "./plugins/html-form-plugin.js" {
  output "./forms/user-form.html"
  title "User Registration"
  theme "bootstrap"
}

plugin "./plugins/markdown-docs-plugin.js" {
  output "./docs/schema.md"
  title "API Documentation"
  format "single"
  includeExamples true
}

model User {
  id String @id @default("nanoid()")
  email String @unique @field.input(Email)
  name String @field.input(Text)
  role UserRole @default("USER")
  active Boolean @default(true)
  created Date @default("now()")
}

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
}
```

## Next Steps

1. **Choose a Tutorial**: Start with the tutorial that matches your immediate needs
2. **Follow Along**: Each tutorial provides step-by-step instructions with complete code examples
3. **Customize**: Adapt the examples to your specific requirements
4. **Extend**: Use the patterns learned to create your own custom plugins

## Advanced Tutorials

### 4. [GraphQL Schema Plugin](./graphql-schema-plugin.md)

Learn how to create a plugin that generates GraphQL type definitions and schemas from your schema.

**What you'll learn:**
- Generate GraphQL type definitions from models and types
- Create queries, mutations, and subscriptions
- Support for custom scalars and directives
- Handle relationships and nested types
- Generate complete GraphQL schema files

**Generated Output:** GraphQL schema files with type definitions, queries, and mutations

---

### 5. [TypeScript Interface Plugin](./typescript-interfaces-plugin.md)

Learn how to create a plugin that generates TypeScript interfaces and types from your schema.

**What you'll learn:**
- Generate TypeScript interfaces from models and types
- Create enums and utility types
- Support for namespaces and modules
- Handle optional and array types
- Generate comprehensive type definitions

**Generated Output:** TypeScript definition files with interfaces, types, and enums

---

### 6. [API Client Plugin](./api-client-plugin.md)

Learn how to create a plugin that generates API client libraries from your schema.

**What you'll learn:**
- Generate REST and GraphQL API clients
- Support multiple authentication strategies
- Create type-safe client methods
- Handle request/response transformations
- Generate both JavaScript and TypeScript clients

**Generated Output:** Complete API client libraries with methods and types

---

### 7. [Validation Plugin](./validation-plugin.md)

Learn how to create a plugin that generates Zod validation schemas from your schema.

**What you'll learn:**
- Generate Zod schemas from models and types
- Create custom validators and transformations
- Handle complex validation rules
- Support for nested object validation
- Generate comprehensive validation suites

**Generated Output:** Zod validation schemas with custom validators

---

### 8. [Test Data Plugin](./test-data-plugin.md)

Learn how to create a plugin that generates realistic test data and fixtures from your schema.

**What you'll learn:**
- Generate realistic mock data using Faker.js
- Create factory functions for dynamic data generation
- Support for relationships and constraints
- Generate test fixtures and seed data
- Handle localization and custom generators

**Generated Output:** Test data files, factories, and fixtures in multiple formats

---

### 9. [OpenAPI Specification Plugin](./openapi-spec-plugin.md)

Learn how to create a plugin that generates OpenAPI 3.0 specifications from your schema.

**What you'll learn:**
- Generate OpenAPI 3.0 compliant specifications
- Create schemas and CRUD endpoints automatically
- Support multiple authentication schemes
- Generate multiple output formats (JSON, YAML, HTML)
- Include validation rules and examples

**Generated Output:** Complete OpenAPI specifications with interactive documentation

---

## Other Plugin Ideas

Additional plugins you can create using the patterns from these tutorials:

- **Database Migration Generator**: Create migration files for various databases
- **Form Validation Generator**: Generate client-side validation rules
- **Mock Server Generator**: Create mock API servers for testing
- **Documentation Site Generator**: Build complete documentation websites
- **Configuration File Generator**: Generate app configuration files
- **Seed Data Generator**: Create database seed scripts
- **API Test Generator**: Generate automated API test suites

Happy coding! 🚀
