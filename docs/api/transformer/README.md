# Idea Transformer

Comprehensive API documentation for the `@stackpress/idea-transformer` library - a powerful schema transformation tool that processes `.idea` schema files and executes plugins to generate code and other outputs.

 1. [Overview](#1-overview)
 2. [Quick Start](#2-quick-start)
 3. [API Reference](#3-api-reference)
 4. [Architecture](#4-architecture)
 5. [Usage Patterns](#5-usage-patterns)
 6. [Common Use Cases](#6-common-use-cases)
 7. [Examples](#7-examples)
 8. [Error Handling](#8-error-handling)
 9. [Best Practices](#9-best-practices)

## 1. Overview

The idea-transformer library provides a complete solution for processing schema files and generating code through a flexible plugin system. This library serves as the core transformation engine that bridges schema definitions with code generation.

The idea-transformer library provides a complete solution for:

 - **Schema Processing**: Load and parse `.idea` schema files with support for imports and merging
 - **Plugin System**: Execute transformation plugins that generate code, documentation, or other outputs
 - **CLI Integration**: Command-line interface for processing schemas in build pipelines
 - **Type Safety**: Full TypeScript support with comprehensive type definitions

## 2. Quick Start

Get started with the idea-transformer library in just a few steps. This section shows you how to install the library and perform basic schema transformation operations.

```bash
npm install @stackpress/idea-transformer
```

```typescript
import Transformer from '@stackpress/idea-transformer';

// Load and process a schema
const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();
```

## 3. API Reference

The API reference provides detailed documentation for all components and interfaces available in the idea-transformer library. This section covers the main classes and their methods for schema processing and plugin execution.

### 3.1. Core Components

The core components form the foundation of the transformation system, providing the main classes and interfaces you'll use to process schemas and execute plugins.

| Component | Description | Documentation |
|-----------|-------------|---------------|
| **[Transformer](./Transformer.md)** | Main class for loading and transforming schema files | [View Docs](./Transformer.md) |
| **[Terminal](./Terminal.md)** | Command-line interface for schema processing | [View Docs](./Terminal.md) |

### 3.2. Key Features

The idea-transformer library offers several key features that make schema processing and code generation efficient and reliable. These features work together to provide a comprehensive transformation solution.

#### 3.2.1. Schema Loading and Processing

The transformer provides robust schema loading capabilities that handle complex schema structures and dependencies. This includes support for modular schemas and intelligent merging strategies.

 - Support for both `.idea` and `.json` schema files
 - Automatic dependency resolution with `use` directives
 - Intelligent schema merging based on mutability rules
 - Comprehensive error handling and validation

#### 3.2.2. Plugin System

The plugin system enables extensible code generation through a type-safe and flexible architecture. Plugins can access the complete schema context and generate any type of output.

 - Type-safe plugin development with `PluginProps` and `PluginWithCLIProps`
 - Access to complete schema configuration and transformation context
 - CLI integration for interactive plugins
 - Flexible plugin configuration system

#### 3.2.3. Command-Line Interface

The CLI provides convenient command-line access for integrating schema processing into build pipelines and development workflows. It supports various configuration options and batch processing capabilities.

 - Simple CLI for processing schemas in build pipelines
 - Configurable working directories and file extensions
 - Integration with npm scripts and build tools
 - Support for batch processing multiple schemas

## 4. Architecture

The idea-transformer follows a clear architectural pattern that separates concerns between schema loading, processing, and output generation. This design enables flexible plugin development and maintainable code generation workflows.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Schema File   │───▶│   Transformer   │───▶│    Plugins      │
│   (.idea/.json) │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Schema Config  │    │ Generated Files │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
```

## 5. Usage Patterns

This section demonstrates common usage patterns for the idea-transformer library. These patterns show how to integrate the transformer into different development workflows and use cases.

### 5.1. Basic Schema Transformation

The most common usage pattern involves loading a schema file and executing all configured plugins. This pattern is suitable for most build processes and automated workflows.

```typescript
import Transformer from '@stackpress/idea-transformer';

// Load schema and execute plugins
const transformer = await Transformer.load('./schema.idea');
await transformer.transform();
```

### 5.2. CLI Usage

The command-line interface provides a simple way to process schemas from build scripts or CI/CD pipelines. This pattern is ideal for integrating schema processing into existing build workflows.

```bash
# Process schema file
node cli.js transform --input ./schema.idea

# Using short flag
node cli.js transform --i ./schema.idea
```

### 5.3. Plugin Development

Creating custom plugins allows you to extend the transformer with domain-specific code generation. This pattern shows the basic structure for developing type-safe plugins.

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';

export default async function myPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;
  
  // Process schema and generate output
  const content = generateFromSchema(schema);
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
}
```

## 6. Common Use Cases

The idea-transformer library supports a wide variety of use cases for code generation and schema processing. These use cases demonstrate the flexibility and power of the transformation system.

### 6.1. Code Generation

Generate various code artifacts from your schema definitions to maintain consistency across your application. This use case covers the most common code generation scenarios.

 - Generate TypeScript interfaces from schema models
 - Create enum definitions from schema enums
 - Build API client libraries from schema definitions
 - Generate database migration files

### 6.2. Documentation

Create comprehensive documentation from your schemas to improve developer experience and API usability. This use case focuses on generating human-readable documentation.

 - Create API documentation from schema
 - Generate schema reference guides
 - Build interactive schema explorers
 - Create validation rule documentation

### 6.3. Validation

Build validation systems from your schema definitions to ensure data integrity across your application. This use case covers various validation library integrations.

 - Generate validation schemas (Joi, Yup, Zod)
 - Create form validation rules
 - Build API request/response validators
 - Generate test fixtures and mock data

### 6.4. Build Integration

Integrate schema processing into your build pipeline for automated code generation and consistent development workflows. This use case covers various build system integrations.

 - Integrate with webpack, rollup, or other bundlers
 - Add to npm scripts for automated generation
 - Use in CI/CD pipelines for consistent builds
 - Create watch mode for development workflows

## 7. Examples

This section provides practical examples of using the idea-transformer library for common code generation tasks. These examples demonstrate real-world usage patterns and best practices.

### 7.1. TypeScript Interface Generation

This example shows how to create a plugin that generates TypeScript interfaces from schema models. The example includes both the schema definition and the plugin implementation.

```typescript
// schema.idea
model User {
  id String @id
  name String @required
  email String @required @unique
  role UserRole
  profile Profile?
}

enum UserRole {
  ADMIN "admin"
  USER "user"
}

type Profile {
  bio String
  avatar String?
}

plugin "./generate-types.js" {
  output "./generated/types.ts"
}
```

```typescript
// generate-types.js
export default async function generateTypes({ schema, config, transformer }) {
  let content = '';
  
  // Generate enums
  if (schema.enum) {
    for (const [name, enumDef] of Object.entries(schema.enum)) {
      content += `export enum ${name} {\n`;
      for (const [key, value] of Object.entries(enumDef)) {
        content += `  ${key} = "${value}",\n`;
      }
      content += '}\n\n';
    }
  }
  
  // Generate interfaces
  if (schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      content += `export interface ${name} {\n`;
      for (const column of model.columns) {
        const optional = column.required ? '' : '?';
        content += `  ${column.name}${optional}: ${mapType(column.type)};\n`;
      }
      content += '}\n\n';
    }
  }
  
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
}
```

### 7.2. CLI Integration

This example demonstrates how to integrate the idea-transformer CLI into your npm scripts for automated code generation during the build process.

```json
{
  "scripts": {
    "generate": "idea transform --input ./schema.idea",
    "build": "npm run generate && tsc",
    "dev": "npm run generate && npm run build -- --watch"
  }
}
```

## 8. Error Handling

The idea-transformer library provides comprehensive error handling to help you identify and resolve issues during schema processing. This section covers error types and handling strategies.

The library provides comprehensive error handling with detailed error messages:

```typescript
import { Exception } from '@stackpress/idea-parser';

try {
  const transformer = await Transformer.load('./schema.idea');
  await transformer.transform();
} catch (error) {
  if (error instanceof Exception) {
    console.error('Schema error:', error.message);
    console.error('Error code:', error.code);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 9. Best Practices

Following best practices ensures maintainable, scalable, and reliable schema processing workflows. These guidelines help you avoid common pitfalls and optimize your development experience.

### 9.1. Schema Organization

Organize your schemas for maintainability and clarity to support team collaboration and long-term project success. Proper organization makes schemas easier to understand and modify.

 - Use `use` directives to split large schemas into manageable files
 - Organize shared types and enums in separate files
 - Follow consistent naming conventions across schemas
 - Document complex relationships and business rules

### 9.2. Plugin Development

Follow these guidelines when developing plugins to ensure reliability, maintainability, and type safety. Good plugin development practices lead to more robust code generation.

 - Always validate plugin configuration
 - Use TypeScript for type safety
 - Handle errors gracefully with meaningful messages
 - Use the transformer's file loader for consistent path resolution

### 9.3. Build Integration

Integrate schema processing effectively into your workflow to maximize productivity and maintain consistency across environments. Proper build integration ensures reliable code generation.

 - Add schema generation to your build process
 - Use watch mode during development
 - Version control generated files when appropriate
 - Document the generation process for team members
