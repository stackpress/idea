# GraphQL Schema Generator Plugin Tutorial

This tutorial demonstrates how to create a plugin that generates GraphQL type definitions from `.idea` schema files. The plugin will transform your schema models, types, and enums into proper GraphQL schema definitions.

 1. [Overview](#1-overview)
 2. [Prerequisites](#2-prerequisites)
 3. [Plugin Structure](#3-plugin-structure)
 4. [Implementation](#4-implementation)
 5. [Schema Configuration](#5-schema-configuration)
 6. [Usage Examples](#6-usage-examples)
 7. [Advanced Features](#7-advanced-features)
 8. [Best Practices](#8-best-practices)
 9. [Troubleshooting](#9-troubleshooting)

## 1. Overview

GraphQL is a query language and runtime for APIs that provides a complete and understandable description of the data in your API. This plugin transforms your `.idea` schema definitions into comprehensive GraphQL type definitions that enable type-safe API development with excellent tooling support.

This plugin generates GraphQL type definitions from your `.idea` schema, including:

 - **Types**: GraphQL object types from schema models
 - **Inputs**: GraphQL input types for mutations
 - **Enums**: GraphQL enum types from schema enums
 - **Scalars**: Custom scalar types when needed
 - **Queries and Mutations**: Basic CRUD operations

## 2. Prerequisites

Before implementing the GraphQL schema generator plugin, ensure you have the necessary development environment and knowledge. This section covers the essential requirements for successful plugin creation and GraphQL integration.

 - Node.js 16+ and npm/yarn
 - Basic understanding of GraphQL
 - Familiarity with the `@stackpress/idea-transformer` library
 - Understanding of `.idea` schema format

## 3. Plugin Structure

The plugin structure defines the core architecture and configuration interface for the GraphQL schema generator. This includes the main plugin function, configuration types, and the overall organization of the generated GraphQL schema definitions.

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface GraphQLConfig {
  output: string;
  includeQueries?: boolean;
  includeMutations?: boolean;
  includeSubscriptions?: boolean;
  customScalars?: Record<string, string>;
  generateInputTypes?: boolean;
}

export default async function generateGraphQLSchema(
  props: PluginProps<{ config: GraphQLConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}
```

## 4. Implementation

The implementation section covers the core plugin function and supporting utilities that handle GraphQL schema generation. This includes configuration validation, content generation, file writing, and error handling throughout the generation process.

### 4.1. Core Plugin Function

The core plugin function serves as the main entry point for GraphQL schema generation. It orchestrates the entire process from configuration validation through content generation to file output, ensuring proper error handling and logging throughout.


```typescript
export default async function generateGraphQLSchema(
  props: PluginProps<{ config: GraphQLConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    if (!config.output) {
      throw new Error('GraphQL plugin requires "output" configuration');
    }
    
    // Generate GraphQL schema
    let schemaContent = '';
    
    // Add custom scalars
    schemaContent += generateCustomScalars(config.customScalars || {});
    
    // Generate enums
    if (schema.enum) {
      schemaContent += generateEnums(schema.enum);
    }
    
    // Generate types
    if (schema.model) {
      schemaContent += generateTypes(schema.model);
      
      if (config.generateInputTypes) {
        schemaContent += generateInputTypes(schema.model);
      }
    }
    
    // Generate custom types
    if (schema.type) {
      schemaContent += generateCustomTypes(schema.type);
    }
    
    // Generate root types
    if (config.includeQueries) {
      schemaContent += generateQueries(schema.model || {});
    }
    
    if (config.includeMutations) {
      schemaContent += generateMutations(schema.model || {});
    }
    
    if (config.includeSubscriptions) {
      schemaContent += generateSubscriptions(schema.model || {});
    }
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, schemaContent, 'utf8');
    
    console.log(`✅ GraphQL schema generated: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ GraphQL schema generation failed:', error.message);
    throw error;
  }
}
```

### 4.2. Type Mapping Functions

Type mapping functions handle the conversion of `.idea` schema types to their GraphQL equivalents. These functions ensure proper type safety and handle complex scenarios like arrays, required fields, and custom scalar types.

```typescript
function mapSchemaTypeToGraphQL(schemaType: string, customScalars: Record<string, string> = {}): string {
  // Check for custom scalar mappings first
  if (customScalars[schemaType]) {
    return customScalars[schemaType];
  }
  
  // Standard type mappings
  const typeMap: Record<string, string> = {
    'String': 'String',
    'Number': 'Float',
    'Integer': 'Int',
    'Boolean': 'Boolean',
    'Date': 'DateTime',
    'JSON': 'JSON',
    'ID': 'ID'
  };
  
  return typeMap[schemaType] || schemaType;
}

function formatFieldType(column: any, customScalars: Record<string, string> = {}): string {
  let type = mapSchemaTypeToGraphQL(column.type, customScalars);
  
  // Handle arrays
  if (column.multiple) {
    type = `[${type}]`;
  }
  
  // Handle required fields
  if (column.required) {
    type += '!';
  }
  
  return type;
}
```

### 4.3. Schema Generation Functions

Schema generation functions create specific parts of the GraphQL schema including custom scalars, enums, types, input types, and root operation types. These functions handle proper GraphQL syntax construction and type relationships.

```typescript
function generateCustomScalars(customScalars: Record<string, string>): string {
  if (Object.keys(customScalars).length === 0) {
    return `# Custom Scalars
scalar DateTime
scalar JSON

`;
  }
  
  let content = '# Custom Scalars\n';
  content += 'scalar DateTime\n';
  content += 'scalar JSON\n';
  
  for (const [name, description] of Object.entries(customScalars)) {
    content += `scalar ${name}\n`;
  }
  
  return content + '\n';
}

function generateEnums(enums: Record<string, any>): string {
  let content = '# Enums\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    content += `enum ${enumName} {\n`;
    
    for (const [key, value] of Object.entries(enumDef)) {
      content += `  ${key}\n`;
    }
    
    content += '}\n\n';
  }
  
  return content;
}

function generateTypes(models: Record<string, any>): string {
  let content = '# Types\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += `type ${modelName} {\n`;
    
    for (const column of model.columns || []) {
      const fieldType = formatFieldType(column);
      content += `  ${column.name}: ${fieldType}\n`;
    }
    
    content += '}\n\n';
  }
  
  return content;
}

function generateInputTypes(models: Record<string, any>): string {
  let content = '# Input Types\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    // Create input type
    content += `input ${modelName}Input {\n`;
    
    for (const column of model.columns || []) {
      // Skip auto-generated fields like ID for input types
      if (column.attributes?.id) continue;
      
      let fieldType = formatFieldType(column);
      // Remove required constraint for input types (make them optional)
      fieldType = fieldType.replace('!', '');
      
      content += `  ${column.name}: ${fieldType}\n`;
    }
    
    content += '}\n\n';
    
    // Create update input type
    content += `input ${modelName}UpdateInput {\n`;
    
    for (const column of model.columns || []) {
      let fieldType = formatFieldType(column);
      // All fields are optional in update input
      fieldType = fieldType.replace('!', '');
      
      content += `  ${column.name}: ${fieldType}\n`;
    }
    
    content += '}\n\n';
  }
  
  return content;
}

function generateCustomTypes(types: Record<string, any>): string {
  let content = '# Custom Types\n';
  
  for (const [typeName, typeDef] of Object.entries(types)) {
    content += `type ${typeName} {\n`;
    
    for (const column of typeDef.columns || []) {
      const fieldType = formatFieldType(column);
      content += `  ${column.name}: ${fieldType}\n`;
    }
    
    content += '}\n\n';
  }
  
  return content;
}

function generateQueries(models: Record<string, any>): string {
  let content = '# Queries\ntype Query {\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    
    // Get single item
    content += `  ${lowerName}(id: ID!): ${modelName}\n`;
    
    // Get multiple items
    content += `  ${lowerName}s(limit: Int, offset: Int): [${modelName}]\n`;
  }
  
  content += '}\n\n';
  return content;
}

function generateMutations(models: Record<string, any>): string {
  let content = '# Mutations\ntype Mutation {\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    
    // Create
    content += `  create${modelName}(input: ${modelName}Input!): ${modelName}\n`;
    
    // Update
    content += `  update${modelName}(id: ID!, input: ${modelName}UpdateInput!): ${modelName}\n`;
    
    // Delete
    content += `  delete${modelName}(id: ID!): Boolean\n`;
  }
  
  content += '}\n\n';
  return content;
}

function generateSubscriptions(models: Record<string, any>): string {
  let content = '# Subscriptions\ntype Subscription {\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    
    // Subscribe to changes
    content += `  ${lowerName}Created: ${modelName}\n`;
    content += `  ${lowerName}Updated: ${modelName}\n`;
    content += `  ${lowerName}Deleted: ID\n`;
  }
  
  content += '}\n\n';
  return content;
}
```

## 5. Schema Configuration

Schema configuration demonstrates how to integrate the GraphQL schema generator into your `.idea` schema files. This section covers plugin configuration options and their effects on the generated GraphQL schema definitions.

Add the GraphQL plugin to your `.idea` schema file:

```idea
plugin "./plugins/graphql-schema.js" {
  output "./generated/schema.graphql"
  includeQueries true
  includeMutations true
  includeSubscriptions false
  generateInputTypes true
  customScalars {
    Email "String"
    URL "String"
    PhoneNumber "String"
  }
}
```

**Configuration Options**

Configuration options control how GraphQL schema definitions are generated, including operation types, input generation, and custom scalar handling. Understanding these options helps you customize the plugin to meet your specific GraphQL requirements.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | **Required** | Output file path for the GraphQL schema |
| `includeQueries` | `boolean` | `false` | Generate Query type with CRUD operations |
| `includeMutations` | `boolean` | `false` | Generate Mutation type with CRUD operations |
| `includeSubscriptions` | `boolean` | `false` | Generate Subscription type for real-time updates |
| `generateInputTypes` | `boolean` | `true` | Generate input types for mutations |
| `customScalars` | `object` | `{}` | Custom scalar type mappings |

## 6. Usage Examples

Usage examples demonstrate practical applications of the GraphQL schema generator with real-world scenarios. These examples show how to configure the plugin for different use cases and how the generated GraphQL schemas integrate into development workflows.

### 6.1. Basic Schema

A basic schema example shows the fundamental structure needed to generate GraphQL type definitions. This includes model definitions with proper attributes, enum declarations, and plugin configuration that produces comprehensive GraphQL schemas.


```idea
enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

model User {
  id String @id @default("nanoid()")
  email String @unique @required
  name String @required
  role UserRole @default("USER")
  active Boolean @default(true)
  createdAt Date @default("now()")
}

plugin "./plugins/graphql-schema.js" {
  output "./schema.graphql"
  includeQueries true
  includeMutations true
}
```

### 6.2. Generated Output

The generated output demonstrates the GraphQL schema produced by the plugin from the basic schema example. This shows how schema definitions are transformed into proper GraphQL type definitions with full type safety and operation support.

```graphql
# Custom Scalars
scalar DateTime
scalar JSON

# Enums
enum UserRole {
  ADMIN
  USER
  GUEST
}

# Types
type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  active: Boolean!
  createdAt: DateTime!
}

# Input Types
input UserInput {
  email: String
  name: String
  role: UserRole
  active: Boolean
}

input UserUpdateInput {
  email: String
  name: String
  role: UserRole
  active: Boolean
  createdAt: DateTime
}

# Queries
type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User]
}

# Mutations
type Mutation {
  createUser(input: UserInput!): User
  updateUser(id: ID!, input: UserUpdateInput!): User
  deleteUser(id: ID!): Boolean
}
```

## 7. Advanced Features

Advanced features extend the basic GraphQL schema generation with sophisticated type handling, relationship management, directive support, and custom scalar types. These features enable production-ready GraphQL schemas that handle complex requirements.

### 7.1. Custom Scalar Types

Custom scalar types allow you to define specialized data types that map to specific validation or formatting requirements. This feature enables the creation of domain-specific types that enhance type safety and API clarity.


```typescript
// In your plugin configuration
customScalars: {
  Email: "String",
  URL: "String", 
  PhoneNumber: "String",
  BigInt: "String"
}
```

### 7.2. Relationship Handling

Relationship handling manages references between different types and models in your schema. This ensures that type relationships are properly represented in the generated GraphQL schema with correct type references and nullability handling.

```typescript
function handleRelationships(column: any, models: Record<string, any>): string {
  // Check if the column type is another model
  if (models[column.type]) {
    let type = column.type;
    
    if (column.multiple) {
      type = `[${type}]`;
    }
    
    if (column.required) {
      type += '!';
    }
    
    return type;
  }
  
  return formatFieldType(column);
}
```

### 7.3. Directive Support

Directive support enables the addition of GraphQL directives to fields and types, providing metadata and behavior hints for GraphQL servers and tools. This feature enhances schema expressiveness and enables advanced GraphQL features.

```typescript
function generateDirectives(column: any): string {
  const directives: string[] = [];
  
  if (column.attributes?.unique) {
    directives.push('@unique');
  }
  
  if (column.attributes?.deprecated) {
    directives.push('@deprecated(reason: "Use alternative field")');
  }
  
  return directives.length > 0 ? ` ${directives.join(' ')}` : '';
}
```

## 8. Best Practices

Best practices ensure your generated GraphQL schemas are maintainable, performant, and follow GraphQL conventions. These guidelines cover type safety, error handling, configuration validation, and performance optimization.

### 8.1. Type Safety

Type safety is crucial for preventing runtime errors and ensuring reliable GraphQL schema generation. Always validate input data and use proper TypeScript types throughout the plugin implementation to ensure consistent output.


```typescript
interface GraphQLColumn {
  name: string;
  type: string;
  required: boolean;
  multiple: boolean;
  attributes?: Record<string, any>;
}

function validateColumn(column: any): column is GraphQLColumn {
  return (
    typeof column.name === 'string' &&
    typeof column.type === 'string' &&
    typeof column.required === 'boolean'
  );
}
```

### 8.2. Error Handling

Proper error handling ensures that schema generation failures provide clear, actionable feedback to developers. Implement comprehensive error handling patterns and meaningful error messages to improve the debugging experience.

```typescript
function generateTypes(models: Record<string, any>): string {
  try {
    let content = '# Types\n';
    
    for (const [modelName, model] of Object.entries(models)) {
      if (!model.columns || !Array.isArray(model.columns)) {
        console.warn(`⚠️  Model ${modelName} has no valid columns`);
        continue;
      }
      
      content += generateSingleType(modelName, model);
    }
    
    return content;
  } catch (error) {
    throw new Error(`Failed to generate GraphQL types: ${error.message}`);
  }
}
```

### 8.3. Configuration Validation

Configuration validation ensures that plugin settings are correct and complete before schema generation begins. This prevents runtime errors and provides early feedback about configuration issues.

```typescript
function validateConfig(config: any): asserts config is GraphQLConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('GraphQL plugin requires "output" configuration as string');
  }
  
  if (config.customScalars && typeof config.customScalars !== 'object') {
    throw new Error('customScalars must be an object');
  }
}
```

### 8.4. Performance Optimization

Performance optimization techniques help maintain reasonable generation times when working with large schemas. Implement caching strategies and efficient algorithms to ensure the plugin scales well with complex type hierarchies.

```typescript
// Cache type mappings
const typeCache = new Map<string, string>();

function getCachedType(schemaType: string, customScalars: Record<string, string>): string {
  const cacheKey = `${schemaType}:${JSON.stringify(customScalars)}`;
  
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey)!;
  }
  
  const mappedType = mapSchemaTypeToGraphQL(schemaType, customScalars);
  typeCache.set(cacheKey, mappedType);
  
  return mappedType;
}
```

## 9. Troubleshooting

This section addresses common issues encountered when generating GraphQL schemas and provides solutions for debugging and resolving problems. Understanding these troubleshooting techniques helps ensure reliable schema generation.

### 9.1. Common Issues

Common issues include invalid GraphQL identifiers, circular dependencies, and missing required fields. These problems typically arise from schema complexity or naming conflicts that can be resolved with proper validation and sanitization.

#### 9.1.1. Invalid GraphQL Names

Invalid GraphQL names occur when schema identifiers contain characters that are not valid in GraphQL. The plugin should validate and sanitize names to ensure they conform to GraphQL naming conventions.

   ```typescript
   function sanitizeGraphQLName(name: string): string {
     // GraphQL names must match /^[_A-Za-z][_0-9A-Za-z]*$/
     return name.replace(/[^_A-Za-z0-9]/g, '_').replace(/^[0-9]/, '_$&');
   }
   ```

#### 9.1.2. Circular Dependencies

Circular dependencies can cause infinite loops during generation or invalid GraphQL schemas. Detecting and handling these scenarios is essential for robust schema generation, especially with complex type relationships.

```typescript
   function detectCircularDependencies(models: Record<string, any>): string[] {
     const visited = new Set<string>();
     const recursionStack = new Set<string>();
     const cycles: string[] = [];
     
     // Implementation for cycle detection...
     
     return cycles;
   }
   ```

#### 9.1.3. Missing Required Fields

Missing required fields can result in invalid GraphQL types that fail validation. Ensure all models have proper field definitions and handle edge cases where schema definitions might be incomplete.

```typescript
   function validateRequiredFields(model: any): void {
     if (!model.columns || model.columns.length === 0) {
       throw new Error(`Model must have at least one column`);
     }
   }
   ```

### 9.2. Debugging Tips

Debugging tips help identify and resolve issues during GraphQL schema generation. These techniques provide visibility into the generation process and help diagnose problems with schema logic or output formatting.

#### 9.2.1. Enable Verbose Logging

Verbose logging provides detailed information about the schema generation process, helping identify where issues occur and what data is being processed at each step.

   ```typescript
   const DEBUG = process.env.DEBUG === 'true';
   
   function debugLog(message: string, data?: any) {
     if (DEBUG) {
       console.log(`[GraphQL Plugin] ${message}`, data || '');
     }
   }
   ```

#### 9.2.2. Validate Generated Schema

Validating the generated GraphQL schema ensures that the output is syntactically correct and will work with GraphQL servers and tools. This validation step catches generation errors before deployment.

```typescript
   import { buildSchema } from 'graphql';
   
   function validateGeneratedSchema(schemaContent: string): void {
     try {
       buildSchema(schemaContent);
       console.log('✅ Generated GraphQL schema is valid');
     } catch (error) {
       throw new Error(`Invalid GraphQL schema: ${error.message}`);
     }
   }
   ```

This tutorial provides a comprehensive foundation for creating GraphQL schema generators from `.idea` files. The generated schemas can be used with any GraphQL server implementation like Apollo Server, GraphQL Yoga, or others.
