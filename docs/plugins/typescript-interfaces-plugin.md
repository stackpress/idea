# TypeScript Interface Generator Plugin Tutorial

This tutorial demonstrates how to create a plugin that generates TypeScript interfaces and types from `.idea` schema files. The plugin will transform your schema models, types, and enums into proper TypeScript definitions with full type safety.

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

TypeScript interfaces provide compile-time type checking and excellent IDE support. This plugin transforms your `.idea` schema definitions into comprehensive TypeScript type definitions that integrate seamlessly with your development workflow and provide robust type safety throughout your application.

This plugin generates TypeScript definitions from your `.idea` schema, including:

 - **Interfaces**: TypeScript interfaces from schema models
 - **Types**: Type aliases from schema types
 - **Enums**: TypeScript enums from schema enums
 - **Utility Types**: Helper types for common operations
 - **Namespace Support**: Organized type definitions

## 2. Prerequisites

Before implementing the TypeScript interface generator plugin, ensure you have the necessary development environment and knowledge. This section covers the essential requirements for successful plugin creation and TypeScript integration.

 - Node.js 16+ and npm/yarn
 - TypeScript 4.0+
 - Basic understanding of TypeScript
 - Familiarity with the `@stackpress/idea-transformer` library
 - Understanding of `.idea` schema format

## 3. Plugin Structure

The plugin structure defines the core architecture and configuration interface for the TypeScript interface generator. This includes the main plugin function, configuration types, and the overall organization of the generated TypeScript code.

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface TypeScriptConfig {
  output: string;
  namespace?: string;
  exportType?: 'named' | 'default' | 'namespace';
  generateUtilityTypes?: boolean;
  includeComments?: boolean;
  strictNullChecks?: boolean;
  generateEnums?: boolean;
  enumType?: 'enum' | 'union' | 'const';
}

export default async function generateTypeScriptInterfaces(
  props: PluginProps<{ config: TypeScriptConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}
```

## 4. Implementation

The implementation section covers the core plugin function and supporting utilities that handle TypeScript interface generation. This includes configuration validation, content generation, file writing, and error handling throughout the generation process.

### 4.1. Core Plugin Function

The core plugin function serves as the main entry point for TypeScript interface generation. It orchestrates the entire process from configuration validation through content generation to file output, ensuring proper error handling and logging throughout.


```typescript
export default async function generateTypeScriptInterfaces(
  props: PluginProps<{ config: TypeScriptConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate TypeScript content
    let content = '';
    
    // Add file header
    content += generateFileHeader();
    
    // Generate enums
    if (config.generateEnums !== false && schema.enum) {
      content += generateEnums(schema.enum, config);
    }
    
    // Generate custom types
    if (schema.type) {
      content += generateCustomTypes(schema.type, config);
    }
    
    // Generate interfaces from models
    if (schema.model) {
      content += generateInterfaces(schema.model, config);
    }
    
    // Generate utility types
    if (config.generateUtilityTypes) {
      content += generateUtilityTypes(schema, config);
    }
    
    // Wrap in namespace if specified
    if (config.namespace) {
      content = wrapInNamespace(content, config.namespace, config.exportType);
    }
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(`✅ TypeScript interfaces generated: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ TypeScript interface generation failed:', error.message);
    throw error;
  }
}
```

### 4.2. Type Mapping Functions

Type mapping functions handle the conversion of `.idea` schema types to their TypeScript equivalents. These functions ensure proper type safety and handle complex scenarios like nullable types, arrays, and custom type references.

```typescript
function mapSchemaTypeToTypeScript(
  schemaType: string, 
  strictNullChecks: boolean = true
): string {
  const typeMap: Record<string, string> = {
    'String': 'string',
    'Number': 'number',
    'Integer': 'number',
    'Boolean': 'boolean',
    'Date': 'Date',
    'JSON': 'any',
    'ID': 'string'
  };
  
  const baseType = typeMap[schemaType] || schemaType;
  
  // Handle strict null checks
  if (!strictNullChecks && baseType !== 'any') {
    return `${baseType} | null | undefined`;
  }
  
  return baseType;
}

function formatPropertyType(
  column: any, 
  config: TypeScriptConfig,
  availableTypes: Set<string> = new Set()
): string {
  let type = column.type;
  
  // Check if it's a reference to another type
  if (availableTypes.has(column.type)) {
    type = column.type;
  } else {
    type = mapSchemaTypeToTypeScript(column.type, config.strictNullChecks);
  }
  
  // Handle arrays
  if (column.multiple) {
    type = `${type}[]`;
  }
  
  // Handle optional properties
  if (!column.required && config.strictNullChecks) {
    type = `${type} | null`;
  }
  
  return type;
}
```

### 4.3. Generation Functions

Generation functions create specific parts of the TypeScript output including enums, interfaces, and utility types. These functions handle formatting, documentation generation, and proper TypeScript syntax construction.

```typescript
function generateFileHeader(): string {
  const timestamp = new Date().toISOString();
  return `/**
 * Generated TypeScript interfaces
 * Generated at: ${timestamp}
 * 
 * This file is auto-generated. Do not edit manually.
 */

`;
}

function generateEnums(
  enums: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Enums\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    if (config.includeComments) {
      content += `/**\n * ${enumName} enumeration\n */\n`;
    }
    
    switch (config.enumType) {
      case 'union':
        content += generateUnionEnum(enumName, enumDef);
        break;
      case 'const':
        content += generateConstEnum(enumName, enumDef);
        break;
      default:
        content += generateStandardEnum(enumName, enumDef);
    }
    
    content += '\n';
  }
  
  return content + '\n';
}

function generateStandardEnum(enumName: string, enumDef: any): string {
  let content = `export enum ${enumName} {\n`;
  
  for (const [key, value] of Object.entries(enumDef)) {
    content += `  ${key} = "${value}",\n`;
  }
  
  content += '}';
  return content;
}

function generateUnionEnum(enumName: string, enumDef: any): string {
  const values = Object.values(enumDef).map(v => `"${v}"`).join(' | ');
  return `export type ${enumName} = ${values};`;
}

function generateConstEnum(enumName: string, enumDef: any): string {
  let content = `export const ${enumName} = {\n`;
  
  for (const [key, value] of Object.entries(enumDef)) {
    content += `  ${key}: "${value}",\n`;
  }
  
  content += '} as const;\n\n';
  content += `export type ${enumName} = typeof ${enumName}[keyof typeof ${enumName}];`;
  
  return content;
}

function generateCustomTypes(
  types: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Custom Types\n';
  const availableTypes = new Set(Object.keys(types));
  
  for (const [typeName, typeDef] of Object.entries(types)) {
    if (config.includeComments) {
      content += `/**\n * ${typeName} type definition\n */\n`;
    }
    
    content += `export interface ${typeName} {\n`;
    
    for (const column of typeDef.columns || []) {
      const propertyType = formatPropertyType(column, config, availableTypes);
      const optional = !column.required ? '?' : '';
      
      if (config.includeComments && column.description) {
        content += `  /** ${column.description} */\n`;
      }
      
      content += `  ${column.name}${optional}: ${propertyType};\n`;
    }
    
    content += '}\n\n';
  }
  
  return content;
}

function generateInterfaces(
  models: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Model Interfaces\n';
  const availableTypes = new Set([
    ...Object.keys(models),
    ...(config.namespace ? [] : Object.keys(models))
  ]);
  
  for (const [modelName, model] of Object.entries(models)) {
    if (config.includeComments) {
      content += `/**\n * ${modelName} model interface\n`;
      if (model.description) {
        content += ` * ${model.description}\n`;
      }
      content += ` */\n`;
    }
    
    content += `export interface ${modelName} {\n`;
    
    for (const column of model.columns || []) {
      const propertyType = formatPropertyType(column, config, availableTypes);
      const optional = !column.required ? '?' : '';
      
      if (config.includeComments) {
        let comment = '';
        if (column.description) {
          comment += column.description;
        }
        if (column.attributes?.default) {
          comment += comment ? ` (default: ${column.attributes.default})` : `Default: ${column.attributes.default}`;
        }
        if (comment) {
          content += `  /** ${comment} */\n`;
        }
      }
      
      content += `  ${column.name}${optional}: ${propertyType};\n`;
    }
    
    content += '}\n\n';
  }
  
  return content;
}

function generateUtilityTypes(
  schema: any, 
  config: TypeScriptConfig
): string {
  let content = '// Utility Types\n';
  
  if (schema.model) {
    const modelNames = Object.keys(schema.model);
    
    // Generate create input types (omit auto-generated fields)
    for (const modelName of modelNames) {
      const model = schema.model[modelName];
      const autoFields = model.columns
        ?.filter((col: any) => col.attributes?.id || col.attributes?.default)
        .map((col: any) => `'${col.name}'`)
        .join(' | ');
      
      if (autoFields) {
        content += `export type Create${modelName}Input = Omit<${modelName}, ${autoFields}>;\n`;
      } else {
        content += `export type Create${modelName}Input = ${modelName};\n`;
      }
    }
    
    content += '\n';
    
    // Generate update input types (all fields optional)
    for (const modelName of modelNames) {
      content += `export type Update${modelName}Input = Partial<${modelName}>;\n`;
    }
    
    content += '\n';
    
    // Generate union types
    const allModels = modelNames.join(' | ');
    content += `export type AnyModel = ${allModels};\n\n`;
    
    // Generate key types
    for (const modelName of modelNames) {
      content += `export type ${modelName}Keys = keyof ${modelName};\n`;
    }
    
    content += '\n';
  }
  
  return content;
}

function wrapInNamespace(
  content: string, 
  namespace: string, 
  exportType?: string
): string {
  const exportKeyword = exportType === 'default' ? 'export default' : 'export';
  
  return `${exportKeyword} namespace ${namespace} {
${content.split('\n').map(line => line ? `  ${line}` : line).join('\n')}
}
`;
}
```

### 4.4. Validation Functions

Validation functions ensure that the plugin configuration is correct and that the generated TypeScript code meets quality standards. These functions catch configuration errors early and prevent invalid output generation.

```typescript
function validateConfig(config: any): asserts config is TypeScriptConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('TypeScript plugin requires "output" configuration as string');
  }
  
  if (config.exportType && !['named', 'default', 'namespace'].includes(config.exportType)) {
    throw new Error('exportType must be one of: named, default, namespace');
  }
  
  if (config.enumType && !['enum', 'union', 'const'].includes(config.enumType)) {
    throw new Error('enumType must be one of: enum, union, const');
  }
}
```

## 5. Schema Configuration

Schema configuration demonstrates how to integrate the TypeScript interface generator into your `.idea` schema files. This section covers plugin configuration options and their effects on the generated TypeScript output.

Add the TypeScript plugin to your `.idea` schema file:

```idea
plugin "./plugins/typescript-interfaces.js" {
  output "./generated/types.ts"
  namespace "MyApp"
  exportType "named"
  generateUtilityTypes true
  includeComments true
  strictNullChecks true
  generateEnums true
  enumType "enum"
}
```

**Configuration Options**

Configuration options control how TypeScript interfaces are generated, including output formatting, type handling, and feature enablement. Understanding these options helps you customize the plugin to meet your specific project requirements.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | **Required** | Output file path for TypeScript definitions |
| `namespace` | `string` | `undefined` | Wrap types in a namespace |
| `exportType` | `'named'\|'default'\|'namespace'` | `'named'` | Export style for types |
| `generateUtilityTypes` | `boolean` | `false` | Generate helper utility types |
| `includeComments` | `boolean` | `false` | Include JSDoc comments |
| `strictNullChecks` | `boolean` | `true` | Handle null/undefined types |
| `generateEnums` | `boolean` | `true` | Generate enum definitions |
| `enumType` | `'enum'\|'union'\|'const'` | `'enum'` | Enum generation style |

## 6. Usage Examples

Usage examples demonstrate practical applications of the TypeScript interface generator with real-world scenarios. These examples show how to configure the plugin for different use cases and how the generated TypeScript code integrates into development workflows.

### 6.1. Basic Schema

A basic schema example shows the fundamental structure needed to generate TypeScript interfaces. This includes model definitions with proper attributes, enum declarations, and plugin configuration that produces clean, type-safe TypeScript code.


```idea
enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

type Address {
  street String @required
  city String @required
  country String @required
  postal String
}

model User {
  id String @id @default("nanoid()")
  email String @unique @required
  name String @required
  role UserRole @default("USER")
  address Address?
  active Boolean @default(true)
  createdAt Date @default("now()")
}

plugin "./plugins/typescript-interfaces.js" {
  output "./types.ts"
  generateUtilityTypes true
  includeComments true
}
```

### 6.2. Generated Output

The generated output demonstrates the TypeScript code produced by the plugin from the basic schema example. This shows how schema definitions are transformed into proper TypeScript interfaces with full type safety and documentation.

```typescript
/**
 * Generated TypeScript interfaces
 * Generated at: 2024-01-15T10:30:00.000Z
 * 
 * This file is auto-generated. Do not edit manually.
 */

// Enums
/**
 * UserRole enumeration
 */
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

// Custom Types
/**
 * Address type definition
 */
export interface Address {
  street: string;
  city: string;
  country: string;
  postal?: string | null;
}

// Model Interfaces
/**
 * User model interface
 */
export interface User {
  /** Default: nanoid() */
  id: string;
  email: string;
  name: string;
  /** Default: USER */
  role: UserRole;
  address?: Address | null;
  /** Default: true */
  active: boolean;
  /** Default: now() */
  createdAt: Date;
}

// Utility Types
export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

export type UpdateUserInput = Partial<User>;

export type AnyModel = User;

export type UserKeys = keyof User;
```

## 7. Advanced Features

Advanced features extend the basic TypeScript interface generation with sophisticated organization, multiple enum types, relationship handling, and generic type support. These features enable production-ready TypeScript definitions that handle complex scenarios.

### 7.1. Namespace Support

Namespace support allows you to organize generated types within TypeScript namespaces, preventing naming conflicts and providing better code organization. This feature is particularly useful for large projects with multiple schema files.


```typescript
// With namespace configuration
namespace: "MyApp"
exportType: "namespace"

// Generated output:
export namespace MyApp {
  export enum UserRole {
    ADMIN = "admin",
    USER = "user",
  }
  
  export interface User {
    id: string;
    name: string;
    role: UserRole;
  }
}
```

### 7.2. Different Enum Types

Different enum types provide flexibility in how enumerations are represented in TypeScript. The plugin supports standard enums, union types, and const assertions, each with different runtime characteristics and use cases.

```typescript
// Standard enum (default)
enumType: "enum"
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

// Union type
enumType: "union"
export type UserRole = "admin" | "user";

// Const assertion
enumType: "const"
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];
```

### 7.3. Relationship Handling

Relationship handling manages references between different types and models in your schema. This ensures that type relationships are properly represented in the generated TypeScript code with correct type references and nullability handling.

```typescript
function handleRelationships(
  column: any, 
  config: TypeScriptConfig,
  availableTypes: Set<string>
): string {
  // Check if the column type is another model/type
  if (availableTypes.has(column.type)) {
    let type = column.type;
    
    if (column.multiple) {
      type = `${type}[]`;
    }
    
    if (!column.required && config.strictNullChecks) {
      type = `${type} | null`;
    }
    
    return type;
  }
  
  return formatPropertyType(column, config, availableTypes);
}
```

### 7.4. Generic Type Support

Generic type support enables the generation of reusable type definitions that work with multiple data types. This includes common patterns like paginated responses and API response wrappers that enhance type safety across your application.

```typescript
function generateGenericTypes(
  models: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Generic Types\n';
  
  // Generate paginated response type
  content += `export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}\n\n`;
  
  // Generate API response type
  content += `export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}\n\n`;
  
  return content;
}
```

## 8. Best Practices

Best practices ensure your generated TypeScript interfaces are maintainable, reliable, and follow industry standards. These guidelines cover type safety, naming conventions, documentation generation, and performance optimization.

### 8.1. Type Safety

Type safety is crucial for preventing runtime errors and improving developer experience. Always validate input data and use proper TypeScript types throughout the plugin implementation to ensure reliable code generation.


```typescript
interface TypeScriptColumn {
  name: string;
  type: string;
  required: boolean;
  multiple: boolean;
  description?: string;
  attributes?: Record<string, any>;
}

function validateColumn(column: any): column is TypeScriptColumn {
  return (
    typeof column.name === 'string' &&
    typeof column.type === 'string' &&
    typeof column.required === 'boolean'
  );
}
```

### 8.2. Naming Conventions

Naming conventions ensure that generated TypeScript identifiers are valid and follow established patterns. Proper naming improves code readability and prevents conflicts with reserved keywords or invalid characters.

```typescript
function sanitizeTypeName(name: string): string {
  // Ensure TypeScript-valid names
  return name
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&')
    .replace(/^_+|_+$/g, '');
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
```

### 8.3. Documentation Generation

Documentation generation creates comprehensive JSDoc comments that provide context and examples for the generated types. This improves the developer experience by providing inline documentation in IDEs and code editors.

```typescript
function generateJSDocComment(
  column: any, 
  includeAttributes: boolean = true
): string {
  const lines: string[] = [];
  
  if (column.description) {
    lines.push(column.description);
  }
  
  if (includeAttributes && column.attributes) {
    if (column.attributes.default) {
      lines.push(`@default ${column.attributes.default}`);
    }
    if (column.attributes.example) {
      lines.push(`@example ${column.attributes.example}`);
    }
  }
  
  if (lines.length === 0) return '';
  
  if (lines.length === 1) {
    return `  /** ${lines[0]} */\n`;
  }
  
  return `  /**\n${lines.map(line => `   * ${line}`).join('\n')}\n   */\n`;
}
```

### 8.4. Performance Optimization

Performance optimization techniques help maintain reasonable generation times when working with large schemas. Caching strategies and efficient algorithms ensure the plugin scales well with complex type hierarchies.

```typescript
// Cache type mappings
const typeCache = new Map<string, string>();

function getCachedTypeMapping(
  schemaType: string, 
  strictNullChecks: boolean
): string {
  const cacheKey = `${schemaType}:${strictNullChecks}`;
  
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey)!;
  }
  
  const mappedType = mapSchemaTypeToTypeScript(schemaType, strictNullChecks);
  typeCache.set(cacheKey, mappedType);
  
  return mappedType;
}
```

## 9. Troubleshooting

This section addresses common issues encountered when generating TypeScript interfaces and provides solutions for debugging and resolving problems. Understanding these troubleshooting techniques helps ensure reliable interface generation.

### 9.1. Common Issues

Common issues include invalid TypeScript identifiers, circular type references, and missing dependencies. These problems typically arise from schema complexity or configuration mismatches that can be resolved with proper validation and error handling.

#### 9.1.1. Invalid TypeScript Names

Invalid TypeScript names occur when schema identifiers contain characters that are not valid in TypeScript. The plugin should validate and sanitize names to ensure they conform to TypeScript identifier rules.

   ```typescript
   function validateTypeName(name: string): void {
     if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
       throw new Error(`Invalid TypeScript identifier: ${name}`);
     }
   }
   ```

#### 9.1.2. Circular Type References

Circular type references can cause infinite loops during generation or compilation errors in the generated TypeScript code. Detecting and handling these scenarios is essential for robust type generation.

```typescript
   function detectCircularReferences(
     types: Record<string, any>
   ): string[] {
     const visited = new Set<string>();
     const recursionStack = new Set<string>();
     const cycles: string[] = [];
     
     function visit(typeName: string): void {
       if (recursionStack.has(typeName)) {
         cycles.push(typeName);
         return;
       }
       
       if (visited.has(typeName)) return;
       
       visited.add(typeName);
       recursionStack.add(typeName);
       
       // Check type dependencies...
       
       recursionStack.delete(typeName);
     }
     
     for (const typeName of Object.keys(types)) {
       visit(typeName);
     }
     
     return cycles;
   }
   ```

#### 9.1.3. Missing Type Dependencies

Missing type dependencies occur when a type references another type that doesn't exist in the schema. Validating type dependencies ensures all references are resolvable and prevents compilation errors.

```typescript
   function validateTypeDependencies(
     schema: any
   ): void {
     const availableTypes = new Set([
       ...Object.keys(schema.model || {}),
       ...Object.keys(schema.type || {}),
       ...Object.keys(schema.enum || {})
     ]);
     
     // Validate all type references...
   }
   ```

### 9.2. Debugging Tips

Debugging tips help identify and resolve issues during TypeScript interface generation. These techniques provide visibility into the generation process and help diagnose problems with schema processing or output generation.

#### 9.2.1. Enable Verbose Output

Verbose output provides detailed logging during the generation process, helping identify where issues occur and what data is being processed at each step.

   ```typescript
   const VERBOSE = process.env.TS_PLUGIN_VERBOSE === 'true';
   
   function verboseLog(message: string, data?: any) {
     if (VERBOSE) {
       console.log(`[TypeScript Plugin] ${message}`, data || '');
     }
   }
   ```

#### 9.2.2. Validate Generated TypeScript

Validating generated TypeScript ensures that the output is syntactically correct and will compile successfully. This validation step catches generation errors before the code is used in development.

```typescript
   import { transpile, ScriptTarget } from 'typescript';
   
   function validateGeneratedTypeScript(content: string): void {
     try {
       transpile(content, {
         target: ScriptTarget.ES2020,
         strict: true
       });
       console.log('✅ Generated TypeScript is valid');
     } catch (error) {
       throw new Error(`Invalid TypeScript: ${error.message}`);
     }
   }
   ```

This tutorial provides a comprehensive foundation for creating TypeScript interface generators from `.idea` files. The generated types can be used throughout your TypeScript projects for compile-time type checking and enhanced IDE support.
