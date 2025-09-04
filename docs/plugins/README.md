# Idea Plugins

The following documentation explains how to develop plugins for `.idea` files. This comprehensive guide covers everything from basic plugin structure to advanced development patterns, providing developers with the knowledge needed to create powerful code generation plugins for the idea ecosystem.

 1. [Plugin Development Guide](#1-plugin-development-guide)
 2. [Plugin Examples](#2-plugin-examples)
 3. [Plugin Configuration](#3-plugin-configuration)
 4. [Error Handling](#4-error-handling)
 5. [Best Practices](#5-best-practices)
 6. [Available Tutorials](#6-available-tutorials)
 7. [Advanced Tutorials](#7-advanced-tutorials)
 8. [Getting Started](#8-getting-started)

## 1. Plugin Development Guide

This section covers the fundamental concepts and structures needed to create effective plugins for the idea ecosystem. Plugins are JavaScript or TypeScript modules that process schema definitions and generate various outputs like code, documentation, or configuration files.

Creating a plugin involves just exporting a function like the example below:

```typescript
import type { PluginWithCLIProps } from '@stackpress/idea';

export default function generate(props: PluginWithCLIProps) {}
```

### 1.1. Basic Plugin Structure

The basic plugin structure provides the foundation for all idea plugins. This structure ensures consistency across plugins and provides access to essential functionality like schema processing, file operations, and configuration management.

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

**Properties**

The `PluginProps` contains the following properties.

| Property | Type | Description |
|----------|------|-------------|
| `config` | `PluginConfig` | Plugin-specific configuration from the schema |
| `schema` | `SchemaConfig` | Complete processed schema configuration |
| `transformer` | `Transformer<{}>` | The transformer instance executing the plugin |
| `cwd` | `string` | Current working directory for file operations |

### 1.2. CLI-Aware Plugin Structure

CLI-aware plugins extend the basic plugin structure to include command-line interface capabilities. These plugins can interact with the terminal, access CLI-specific properties, and provide enhanced user experiences through interactive features and detailed logging.

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

**Properties**

The `PluginWithCLIProps` contains the following properties.

| Property | Type | Description |
|----------|------|-------------|
| `config` | `PluginConfig` | Plugin-specific configuration from the schema |
| `schema` | `SchemaConfig` | Complete processed schema configuration |
| `transformer` | `Transformer<{}>` | The transformer instance executing the plugin |
| `cwd` | `string` | Current working directory for file operations |
| `cli` | `Terminal` | Terminal instance for CLI interactions |

### 1.3. Custom Plugin Props

Custom plugin props allow developers to extend the base plugin functionality with additional properties and configuration options. This feature enables plugins to receive custom data, maintain state, and implement specialized behaviors beyond the standard plugin interface.

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

## 2. Plugin Examples

This section provides practical examples of common plugin implementations. These examples demonstrate real-world patterns and best practices for creating plugins that generate TypeScript interfaces, enums, and interactive CLI tools.

### 2.1. TypeScript Interface Generator

The TypeScript interface generator demonstrates how to create a plugin that processes schema models and types to generate TypeScript interface definitions. This example shows how to handle type mapping, optional properties, and namespace organization.

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

### 2.2. Enum Generator

The enum generator plugin shows how to process schema enum definitions and convert them into TypeScript enum declarations. This example demonstrates simple schema processing and file generation patterns that can be adapted for other output formats.

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

### 2.3. CLI-Interactive Plugin

The CLI-interactive plugin demonstrates how to create plugins that provide rich command-line experiences. This example shows how to use the CLI properties for user interaction, progress reporting, and adaptive behavior based on the execution context.

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

## 3. Plugin Configuration

Plugin configuration enables developers to customize plugin behavior through schema declarations. This section covers how to define configuration options in schema files, access configuration within plugins, and implement flexible plugin behavior based on user preferences.

### 3.1. Schema Plugin Definition

Schema plugin definitions specify how plugins are declared and configured within `.idea` schema files. This declarative approach allows users to configure multiple plugins with different settings while maintaining clean, readable schema files.

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

### 3.2. Plugin Configuration Access

Plugin configuration access demonstrates how plugins can read and utilize configuration options provided in schema files. This section shows how to access both simple and nested configuration values, provide defaults, and implement conditional behavior based on configuration settings.

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

## 4. Error Handling

Proper error handling is essential for creating robust plugins that provide clear feedback when issues occur. This section covers error handling strategies, validation patterns, and techniques for graceful failure recovery in plugin development.

### 4.1. Plugin Error Handling

Plugin error handling demonstrates how to implement comprehensive error checking and reporting in plugins. This approach ensures that plugins fail gracefully with meaningful error messages, helping users quickly identify and resolve configuration or schema issues.

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

### 4.2. Graceful Error Recovery

Graceful error recovery shows how plugins can implement fallback mechanisms and continue operation even when primary functionality fails. This approach improves plugin reliability and provides better user experiences by attempting alternative approaches when errors occur.

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

## 5. Best Practices

This section outlines essential best practices for plugin development, covering type safety, configuration validation, file operations, and CLI integration. Following these practices ensures that plugins are reliable, maintainable, and provide excellent developer experiences.

### 5.1. Type Safety

Type safety is crucial for creating reliable plugins that catch errors at compile time rather than runtime. This section demonstrates how to use TypeScript effectively in plugin development, including proper typing for configuration objects and plugin properties.

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

### 5.2. Configuration Validation

Configuration validation ensures that plugins receive valid configuration options and fail early with clear error messages when configuration is invalid. This approach prevents runtime errors and provides better debugging experiences for plugin users.

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

### 5.3. File Operations

File operations in plugins should follow consistent patterns for path resolution, directory creation, and error handling. This section demonstrates best practices for working with files and directories in a way that's compatible with the idea transformer system.

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

### 5.4. CLI Integration

CLI integration enables plugins to provide rich command-line experiences by adapting behavior based on the execution context. This section shows how to use CLI properties effectively and create plugins that work well in both programmatic and interactive environments.

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

## 6. Available Tutorials

This section provides links to comprehensive tutorials for creating specific types of plugins. Each tutorial includes step-by-step instructions, complete code examples, and explanations of key concepts for building production-ready plugins.

### 6.1. Meta Coding With TSMorph

The [TSMorph Plugin Guide](./ts-morph-plugin-guide.md) demonstrates how to create powerful code generation plugins using `ts-morph`, a TypeScript library that provides an easier way to programmatically navigate and manipulate TypeScript and JavaScript code. This guide is essential for developers who need to generate complex TypeScript code with proper syntax and formatting.

### 6.2. Database Integration Plugins

The [MySQL Tables Plugin](./mysql-tables-plugin.md) tutorial teaches you how to create a plugin that generates MySQL `CREATE TABLE` statements from your schema.

Learn how to create a plugin that generates MySQL `CREATE TABLE` statements from your schema.

**What you'll learn:**
 - Parse schema models and their columns
 - Map schema types to MySQL data types
 - Generate SQL DDL statements with constraints
 - Handle primary keys, foreign keys, and indexes
 - Implement proper error handling and validation

**Generated Output:** SQL files that can be executed to create database tables

### 6.3. Frontend Development Plugins

The [HTML Form Plugin](./html-form-plugin.md) tutorial demonstrates how to create a plugin that generates responsive HTML forms from your schema.

Learn how to create a plugin that generates responsive HTML forms from your schema.

**What you'll learn:**
 - Generate HTML form elements based on field types
 - Support multiple CSS frameworks (Bootstrap, Tailwind, Custom)
 - Include client-side validation and constraints
 - Handle different form layouts and themes
 - Create accessible, responsive forms

**Generated Output:** Complete HTML files with forms, styling, and JavaScript validation

### 6.4. Documentation Generation Plugins

The [Markdown Documentation Plugin](./markdown-docs-plugin.md) tutorial shows how to create a plugin that generates comprehensive markdown documentation from your schema.

Learn how to create a plugin that generates comprehensive markdown documentation from your schema.

**What you'll learn:**
 - Parse all schema elements (models, types, enums, props)
 - Generate structured documentation with navigation
 - Include examples and cross-references
 - Support multiple documentation formats and templates
 - Create both single-file and multi-file documentation

**Generated Output:** Markdown documentation files with complete schema reference

## 7. Advanced Tutorials

This section covers advanced plugin development topics for developers who need to create sophisticated code generation tools. These tutorials demonstrate complex patterns and integration techniques for building enterprise-grade plugins.

### 7.1. API Development Plugins

#### 7.1.1. GraphQL Schema Plugin

The [GraphQL Schema Plugin](./graphql-schema-plugin.md) tutorial teaches you how to create a plugin that generates GraphQL type definitions and schemas from your schema.

**What you'll learn:**
 - Generate GraphQL type definitions from models and types
 - Create queries, mutations, and subscriptions
 - Support for custom scalars and directives
 - Handle relationships and nested types
 - Generate complete GraphQL schema files

**Generated Output:** GraphQL schema files with type definitions, queries, and mutations

#### 7.1.2. TypeScript Interface Plugin

The [TypeScript Interface Plugin](./typescript-interfaces-plugin.md) tutorial demonstrates how to create a plugin that generates TypeScript interfaces and types from your schema.

**What you'll learn:**
 - Generate TypeScript interfaces from models and types
 - Create enums and utility types
 - Support for namespaces and modules
 - Handle optional and array types
 - Generate comprehensive type definitions

**Generated Output:** TypeScript definition files with interfaces, types, and enums

#### 7.1.3. API Client Plugin

The [API Client Plugin](./api-client-plugin.md) tutorial shows how to create a plugin that generates API client libraries from your schema.

**What you'll learn:**
 - Generate REST and GraphQL API clients
 - Support multiple authentication strategies
 - Create type-safe client methods
 - Handle request/response transformations
 - Generate both JavaScript and TypeScript clients

**Generated Output:** Complete API client libraries with methods and types

### 7.2. Validation and Testing Plugins

Validation and testing plugins help ensure data quality and application reliability by generating validation schemas and test data. These plugins are essential for building robust applications that can handle edge cases and maintain data integrity across different environments.

#### 7.2.1. Validation Plugin

The [Validation Plugin](./validation-plugin.md) tutorial teaches you how to create a plugin that generates Zod validation schemas from your schema.

**What you'll learn:**
 - Generate Zod schemas from models and types
 - Create custom validators and transformations
 - Handle complex validation rules
 - Support for nested object validation
 - Generate comprehensive validation suites

**Generated Output:** Zod validation schemas with custom validators

#### 7.2.2. Test Data Plugin

The [Test Data Plugin](./test-data-plugin.md) tutorial demonstrates how to create a plugin that generates realistic test data and fixtures from your schema.

**What you'll learn:**
 - Generate realistic mock data using Faker.js
 - Create factory functions for dynamic data generation
 - Support for relationships and constraints
 - Generate test fixtures and seed data
 - Handle localization and custom generators

**Generated Output:** Test data files, factories, and fixtures in multiple formats

### 7.3. Documentation and Specification Plugins

The [OpenAPI Specification Plugin](./openapi-spec-plugin.md) tutorial shows how to create a plugin that generates OpenAPI 3.0 specifications from your schema.

**What you'll learn:**
 - Generate OpenAPI 3.0 compliant specifications
 - Create schemas and CRUD endpoints automatically
 - Support multiple authentication schemes
 - Generate multiple output formats (JSON, YAML, HTML)
 - Include validation rules and examples

**Generated Output:** Complete OpenAPI specifications with interactive documentation

## 8. Getting Started

This section provides essential information for developers who are new to plugin development. It covers prerequisites, basic concepts, and step-by-step guidance for creating your first plugin.

### 8.1. Prerequisites

Before starting plugin development, ensure you have the necessary knowledge and tools. These prerequisites will help you understand the examples and successfully implement your own plugins.

Before starting these tutorials, make sure you have:

 - Basic understanding of TypeScript/JavaScript
 - Familiarity with the `idea-transformer` plugin system
 - Understanding of the target technology (MySQL, HTML/CSS, Markdown)

### 8.2. Plugin Development Basics

Plugin development follows consistent patterns that make it easy to create new plugins once you understand the core concepts. This section outlines the fundamental steps and patterns used across all plugin types.

All plugins in the `idea-transformer` system follow a similar pattern:

 1. **Import Types**: Use the provided TypeScript types for type safety
 2. **Define Configuration**: Specify what configuration options your plugin accepts
 3. **Validate Input**: Check that required configuration is provided
 4. **Process Schema**: Parse the schema and extract relevant information
 5. **Generate Output**: Create the target files or content
 6. **Handle Errors**: Provide meaningful error messages and graceful failure

### 8.3. Common Plugin Structure

The common plugin structure provides a template that can be adapted for any type of code generation. This structure ensures consistency across plugins and includes all essential components for robust plugin development.

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

### 8.4. Schema Structure

Understanding the schema structure is crucial for plugin development. The processed schema provides a standardized format that plugins can rely on, regardless of the original `.idea` file structure.

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

### 8.5. Implementation Guidelines

These implementation guidelines help ensure that your plugins are reliable, maintainable, and follow established patterns. Following these guidelines will make your plugins easier to debug and extend.

#### 8.5.1. Type Safety

Type safety prevents runtime errors and provides better development experiences through IDE support and compile-time error checking.

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

#### 8.5.2. Configuration Validation

Configuration validation ensures that plugins receive valid input and fail early with clear error messages when configuration is incorrect.

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

#### 8.5.3. File Operations

File operations should follow consistent patterns for path resolution, directory creation, and error handling to ensure compatibility with the idea transformer system.

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

#### 8.5.4. Error Handling

Comprehensive error handling provides better user experiences and makes plugins more reliable in production environments.

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

#### 8.5.5. Schema Processing

Schema processing should handle optional elements gracefully and provide meaningful defaults to ensure plugins work with various schema configurations.

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

### 8.6. Usage in Schema Files

This section demonstrates how to use plugins within `.idea` schema files, showing the declarative syntax for plugin configuration and how multiple plugins can work together to generate comprehensive outputs.

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

### 8.7. Next Steps

After completing the getting started section, you'll be ready to dive into specific tutorials and start building your own plugins. These next steps will guide you toward becoming proficient in plugin development.

 1. **Choose a Tutorial**: Start with the tutorial that matches your immediate needs
 2. **Follow Along**: Each tutorial provides step-by-step instructions with complete code examples
 3. **Customize**: Adapt the examples to your specific requirements
 4. **Extend**: Use the patterns learned to create your own custom plugins

### 8.8. Additional Plugin Ideas

Beyond the provided tutorials, there are many other types of plugins you can create using the patterns and techniques covered in this documentation:

 - **Database Migration Generator**: Create migration files for various databases
 - **Form Validation Generator**: Generate client-side validation rules
 - **Mock Server Generator**: Create mock API servers for testing
 - **Documentation Site Generator**: Build complete documentation websites
 - **Configuration File Generator**: Generate app configuration files
 - **Seed Data Generator**: Create database seed scripts
 - **API Test Generator**: Generate automated API test suites

Happy coding! 🚀
