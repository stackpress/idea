# Idea Transformer

Comprehensive API documentation for the `@stackpress/idea-transformer` library - a powerful schema transformation tool that processes `.idea` schema files and executes plugins to generate code and other outputs.

## 1. Overview

The idea-transformer library provides a complete solution for:

- **Schema Processing**: Load and parse `.idea` schema files with support for imports and merging
- **Plugin System**: Execute transformation plugins that generate code, documentation, or other outputs
- **CLI Integration**: Command-line interface for processing schemas in build pipelines
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## 2. Quick Start

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

### 3.1. Core Components

| Component | Description | Documentation |
|-----------|-------------|---------------|
| **[Transformer](./Transformer.md)** | Main class for loading and transforming schema files | [View Docs](./Transformer.md) |
| **[Terminal](./Terminal.md)** | Command-line interface for schema processing | [View Docs](./Terminal.md) |

### 3.2. Key Features

#### 3.2.1. Schema Loading and Processing
- Support for both `.idea` and `.json` schema files
- Automatic dependency resolution with `use` directives
- Intelligent schema merging based on mutability rules
- Comprehensive error handling and validation

#### 3.2.2. Plugin System
- Type-safe plugin development with `PluginProps` and `PluginWithCLIProps`
- Access to complete schema configuration and transformation context
- CLI integration for interactive plugins
- Flexible plugin configuration system

#### 3.2.3. Command-Line Interface
- Simple CLI for processing schemas in build pipelines
- Configurable working directories and file extensions
- Integration with npm scripts and build tools
- Support for batch processing multiple schemas

## 4. Architecture

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

### 5.1. Basic Schema Transformation

```typescript
import Transformer from '@stackpress/idea-transformer';

// Load schema and execute plugins
const transformer = await Transformer.load('./schema.idea');
await transformer.transform();
```

### 5.2. CLI Usage

```bash
# Process schema file
node cli.js transform --input ./schema.idea

# Using short flag
node cli.js transform --i ./schema.idea
```

### 5.3. Plugin Development

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

### 6.1. Code Generation
- Generate TypeScript interfaces from schema models
- Create enum definitions from schema enums
- Build API client libraries from schema definitions
- Generate database migration files

### 6.2. Documentation
- Create API documentation from schema
- Generate schema reference guides
- Build interactive schema explorers
- Create validation rule documentation

### 6.3. Validation
- Generate validation schemas (Joi, Yup, Zod)
- Create form validation rules
- Build API request/response validators
- Generate test fixtures and mock data

### 6.4. Build Integration
- Integrate with webpack, rollup, or other bundlers
- Add to npm scripts for automated generation
- Use in CI/CD pipelines for consistent builds
- Create watch mode for development workflows

## 7. Examples

### 7.1. TypeScript Interface Generation

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

### 9.1. Schema Organization
- Use `use` directives to split large schemas into manageable files
- Organize shared types and enums in separate files
- Follow consistent naming conventions across schemas
- Document complex relationships and business rules

### 9.2. Plugin Development
- Always validate plugin configuration
- Use TypeScript for type safety
- Handle errors gracefully with meaningful messages
- Use the transformer's file loader for consistent path resolution

### 9.3. Build Integration
- Add schema generation to your build process
- Use watch mode during development
- Version control generated files when appropriate
- Document the generation process for team members
