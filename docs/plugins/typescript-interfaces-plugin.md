# TypeScript Interface Generator Plugin Tutorial

This tutorial demonstrates how to create a plugin that generates TypeScript interfaces and types from `.idea` schema files. The plugin will transform your schema models, types, and enums into proper TypeScript definitions with full type safety.

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Plugin Structure](#plugin-structure)
4. [Implementation](#implementation)
5. [Schema Configuration](#schema-configuration)
6. [Usage Examples](#usage-examples)
7. [Advanced Features](#advanced-features)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## 1. Overview

TypeScript interfaces provide compile-time type checking and excellent IDE support. This plugin generates TypeScript definitions from your `.idea` schema, including:

- **Interfaces**: TypeScript interfaces from schema models
- **Types**: Type aliases from schema types
- **Enums**: TypeScript enums from schema enums
- **Utility Types**: Helper types for common operations
- **Namespace Support**: Organized type definitions

## 2. Prerequisites

- Node.js 16+ and npm/yarn
- TypeScript 4.0+
- Basic understanding of TypeScript
- Familiarity with the `@stackpress/idea-transformer` library
- Understanding of `.idea` schema format

## 3. Plugin Structure

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

### 4.1. Core Plugin Function

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

Add the TypeScript plugin to your `.idea` schema file:

```ts
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

### 5.1. Configuration Options

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

### 6.1. Basic Schema

```ts
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

### 7.1. Namespace Support

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

### 8.1. Type Safety

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

### 9.1. Common Issues

1. **Invalid TypeScript Names**
   ```typescript
   function validateTypeName(name: string): void {
     if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
       throw new Error(`Invalid TypeScript identifier: ${name}`);
     }
   }
   ```

2. **Circular Type References**
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

3. **Missing Type Dependencies**
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

1. **Enable Verbose Output**
   ```typescript
   const VERBOSE = process.env.TS_PLUGIN_VERBOSE === 'true';
   
   function verboseLog(message: string, data?: any) {
     if (VERBOSE) {
       console.log(`[TypeScript Plugin] ${message}`, data || '');
     }
   }
   ```

2. **Validate Generated TypeScript**
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
