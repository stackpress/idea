# Validation Schema Generator Plugin Tutorial

This tutorial demonstrates how to create a plugin that generates Zod validation schemas from `.idea` schema files. The plugin will transform your schema models into type-safe validation schemas with comprehensive validation rules.

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

Zod is a TypeScript-first schema validation library that provides runtime type checking and validation. This plugin generates Zod schemas from your `.idea` schema, including:

- **Schema Validation**: Zod schemas for all models and types
- **Type Inference**: TypeScript types inferred from Zod schemas
- **Custom Validators**: Support for custom validation rules
- **Error Messages**: Customizable validation error messages
- **Nested Validation**: Support for nested objects and arrays

## 2. Prerequisites

- Node.js 16+ and npm/yarn
- TypeScript 4.0+
- Zod 3.0+
- Basic understanding of validation concepts
- Familiarity with the `@stackpress/idea-transformer` library
- Understanding of `.idea` schema format

## 3. Plugin Structure

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface ZodConfig {
  output: string;
  generateTypes?: boolean;
  includeEnums?: boolean;
  customValidators?: Record<string, string>;
  errorMessages?: Record<string, string>;
  strictMode?: boolean;
  exportStyle?: 'named' | 'default' | 'namespace';
}

export default async function generateZodSchemas(
  props: PluginProps<{ config: ZodConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}
```

## 4. Implementation

### 4.1. Core Plugin Function

```typescript
export default async function generateZodSchemas(
  props: PluginProps<{ config: ZodConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate Zod content
    let content = '';
    
    // Add file header and imports
    content += generateFileHeader();
    content += generateImports(config);
    
    // Generate enums if requested
    if (config.includeEnums && schema.enum) {
      content += generateEnumSchemas(schema.enum, config);
    }
    
    // Generate custom type schemas
    if (schema.type) {
      content += generateTypeSchemas(schema.type, config);
    }
    
    // Generate model schemas
    if (schema.model) {
      content += generateModelSchemas(schema.model, config);
    }
    
    // Generate utility schemas
    content += generateUtilitySchemas(schema, config);
    
    // Generate main export
    content += generateMainExport(schema, config);
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(`✅ Zod validation schemas generated: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Zod schema generation failed:', error.message);
    throw error;
  }
}
```

### 4.2. Generation Functions

```typescript
function generateFileHeader(): string {
  const timestamp = new Date().toISOString();
  return `/**
 * Generated Zod Validation Schemas
 * Generated at: ${timestamp}
 * 
 * This file is auto-generated. Do not edit manually.
 */

`;
}

function generateImports(config: ZodConfig): string {
  let imports = `import { z } from 'zod';\n\n`;
  
  if (config.generateTypes) {
    imports += `// Type inference helpers\ntype Infer<T> = z.infer<T>;\n\n`;
  }
  
  return imports;
}

function generateEnumSchemas(enums: Record<string, any>, config: ZodConfig): string {
  let content = '// Enum Schemas\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    const values = Object.values(enumDef);
    const zodValues = values.map(v => `"${v}"`).join(', ');
    
    content += `export const ${enumName}Schema = z.enum([${zodValues}]);\n`;
    
    if (config.generateTypes) {
      content += `export type ${enumName} = z.infer<typeof ${enumName}Schema>;\n`;
    }
    
    content += '\n';
  }
  
  return content + '\n';
}

function generateTypeSchemas(types: Record<string, any>, config: ZodConfig): string {
  let content = '// Type Schemas\n';
  
  for (const [typeName, typeDef] of Object.entries(types)) {
    content += `export const ${typeName}Schema = z.object({\n`;
    
    for (const column of typeDef.columns || []) {
      const fieldSchema = generateFieldSchema(column, config);
      content += `  ${column.name}: ${fieldSchema},\n`;
    }
    
    content += '})';
    
    // Add strict mode if enabled
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\n';
    
    if (config.generateTypes) {
      content += `export type ${typeName} = z.infer<typeof ${typeName}Schema>;\n`;
    }
    
    content += '\n';
  }
  
  return content;
}

function generateModelSchemas(models: Record<string, any>, config: ZodConfig): string {
  let content = '// Model Schemas\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += `export const ${modelName}Schema = z.object({\n`;
    
    for (const column of model.columns || []) {
      const fieldSchema = generateFieldSchema(column, config);
      content += `  ${column.name}: ${fieldSchema},\n`;
    }
    
    content += '})';
    
    // Add strict mode if enabled
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\n';
    
    if (config.generateTypes) {
      content += `export type ${modelName} = z.infer<typeof ${modelName}Schema>;\n`;
    }
    
    // Generate input schemas
    content += generateInputSchemas(modelName, model, config);
    
    content += '\n';
  }
  
  return content;
}

function generateFieldSchema(column: any, config: ZodConfig): string {
  let schema = mapTypeToZod(column.type, config);
  
  // Handle arrays
  if (column.multiple) {
    schema = `z.array(${schema})`;
  }
  
  // Handle optional fields
  if (!column.required) {
    schema += '.optional()';
  }
  
  // Add custom validations based on attributes
  if (column.attributes) {
    schema = addAttributeValidations(schema, column.attributes, config);
  }
  
  return schema;
}

function mapTypeToZod(schemaType: string, config: ZodConfig): string {
  // Check for custom validators first
  if (config.customValidators && config.customValidators[schemaType]) {
    return config.customValidators[schemaType];
  }
  
  const typeMap: Record<string, string> = {
    'String': 'z.string()',
    'Number': 'z.number()',
    'Integer': 'z.number().int()',
    'Boolean': 'z.boolean()',
    'Date': 'z.date()',
    'JSON': 'z.any()',
    'ID': 'z.string()'
  };
  
  return typeMap[schemaType] || `${schemaType}Schema`;
}

function addAttributeValidations(schema: string, attributes: any, config: ZodConfig): string {
  let validatedSchema = schema;
  
  // String validations
  if (attributes.min && schema.includes('z.string()')) {
    validatedSchema += `.min(${attributes.min})`;
  }
  
  if (attributes.max && schema.includes('z.string()')) {
    validatedSchema += `.max(${attributes.max})`;
  }
  
  if (attributes.email && schema.includes('z.string()')) {
    validatedSchema += '.email()';
  }
  
  if (attributes.url && schema.includes('z.string()')) {
    validatedSchema += '.url()';
  }
  
  if (attributes.uuid && schema.includes('z.string()')) {
    validatedSchema += '.uuid()';
  }
  
  if (attributes.regex && schema.includes('z.string()')) {
    validatedSchema += `.regex(/${attributes.regex}/)`;
  }
  
  // Number validations
  if (attributes.min && schema.includes('z.number()')) {
    validatedSchema += `.min(${attributes.min})`;
  }
  
  if (attributes.max && schema.includes('z.number()')) {
    validatedSchema += `.max(${attributes.max})`;
  }
  
  if (attributes.positive && schema.includes('z.number()')) {
    validatedSchema += '.positive()';
  }
  
  if (attributes.negative && schema.includes('z.number()')) {
    validatedSchema += '.negative()';
  }
  
  if (attributes.nonnegative && schema.includes('z.number()')) {
    validatedSchema += '.nonnegative()';
  }
  
  // Array validations
  if (attributes.minLength && schema.includes('z.array(')) {
    validatedSchema += `.min(${attributes.minLength})`;
  }
  
  if (attributes.maxLength && schema.includes('z.array(')) {
    validatedSchema += `.max(${attributes.maxLength})`;
  }
  
  if (attributes.nonempty && schema.includes('z.array(')) {
    validatedSchema += '.nonempty()';
  }
  
  // Custom error messages
  if (config.errorMessages) {
    const fieldName = extractFieldName(schema);
    if (fieldName && config.errorMessages[fieldName]) {
      validatedSchema += `.describe("${config.errorMessages[fieldName]}")`;
    }
  }
  
  return validatedSchema;
}

function extractFieldName(schema: string): string | null {
  // Extract field name from schema for error message lookup
  const match = schema.match(/(\w+)Schema/);
  return match ? match[1] : null;
}

function generateInputSchemas(modelName: string, model: any, config: ZodConfig): string {
  let content = '';
  
  // Generate create input schema (omit auto-generated fields)
  const createFields = model.columns?.filter((col: any) => 
    !col.attributes?.id && !col.attributes?.default
  ) || [];
  
  if (createFields.length > 0) {
    content += `export const Create${modelName}Schema = z.object({\n`;
    
    for (const column of createFields) {
      const fieldSchema = generateFieldSchema(column, config);
      content += `  ${column.name}: ${fieldSchema},\n`;
    }
    
    content += '})';
    
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\n';
    
    if (config.generateTypes) {
      content += `export type Create${modelName}Input = z.infer<typeof Create${modelName}Schema>;\n`;
    }
  }
  
  // Generate update input schema (all fields optional)
  content += `export const Update${modelName}Schema = ${modelName}Schema.partial()`;
  
  if (config.strictMode) {
    content += '.strict()';
  }
  
  content += ';\n';
  
  if (config.generateTypes) {
    content += `export type Update${modelName}Input = z.infer<typeof Update${modelName}Schema>;\n`;
  }
  
  return content;
}

function generateUtilitySchemas(schema: any, config: ZodConfig): string {
  let content = '// Utility Schemas\n';
  
  // Generate pagination schema
  content += `export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

`;
  
  if (config.generateTypes) {
    content += `export type PaginationParams = z.infer<typeof PaginationSchema>;\n\n`;
  }
  
  // Generate API response schemas
  content += `export const APIResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema).optional(),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    error: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
  });

`;
  
  return content;
}

function generateMainExport(schema: any, config: ZodConfig): string {
  if (config.exportStyle === 'namespace') {
    return generateNamespaceExport(schema, config);
  }
  
  if (config.exportStyle === 'default') {
    return generateDefaultExport(schema, config);
  }
  
  // Named exports (default)
  return '// All schemas are exported as named exports above\n';
}

function generateNamespaceExport(schema: any, config: ZodConfig): string {
  let content = 'export namespace Schemas {\n';
  
  // Export enums
  if (config.includeEnums && schema.enum) {
    for (const enumName of Object.keys(schema.enum)) {
      content += `  export const ${enumName} = ${enumName}Schema;\n`;
    }
  }
  
  // Export types
  if (schema.type) {
    for (const typeName of Object.keys(schema.type)) {
      content += `  export const ${typeName} = ${typeName}Schema;\n`;
    }
  }
  
  // Export models
  if (schema.model) {
    for (const modelName of Object.keys(schema.model)) {
      content += `  export const ${modelName} = ${modelName}Schema;\n`;
      content += `  export const Create${modelName} = Create${modelName}Schema;\n`;
      content += `  export const Update${modelName} = Update${modelName}Schema;\n`;
    }
  }
  
  content += '}\n\n';
  return content;
}

function generateDefaultExport(schema: any, config: ZodConfig): string {
  let content = 'const schemas = {\n';
  
  // Add enums
  if (config.includeEnums && schema.enum) {
    for (const enumName of Object.keys(schema.enum)) {
      content += `  ${enumName}: ${enumName}Schema,\n`;
    }
  }
  
  // Add types
  if (schema.type) {
    for (const typeName of Object.keys(schema.type)) {
      content += `  ${typeName}: ${typeName}Schema,\n`;
    }
  }
  
  // Add models
  if (schema.model) {
    for (const modelName of Object.keys(schema.model)) {
      content += `  ${modelName}: ${modelName}Schema,\n`;
      content += `  Create${modelName}: Create${modelName}Schema,\n`;
      content += `  Update${modelName}: Update${modelName}Schema,\n`;
    }
  }
  
  content += `  Pagination: PaginationSchema,
  APIResponse: APIResponseSchema,
  PaginatedResponse: PaginatedResponseSchema,
};

export default schemas;
`;
  
  return content;
}

function validateConfig(config: any): asserts config is ZodConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('Zod plugin requires "output" configuration as string');
  }
  
  if (config.exportStyle && !['named', 'default', 'namespace'].includes(config.exportStyle)) {
    throw new Error('exportStyle must be one of: named, default, namespace');
  }
}
```

## 5. Schema Configuration

Add the Zod validation plugin to your `.idea` schema file:

```ts
plugin "./plugins/zod-validation.js" {
  output "./generated/validation.ts"
  generateTypes true
  includeEnums true
  strictMode true
  exportStyle "named"
  customValidators {
    Email "z.string().email()"
    Password "z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)"
    PhoneNumber "z.string().regex(/^\\+?[1-9]\\d{1,14}$/)"
  }
  errorMessages {
    email "Please enter a valid email address"
    password "Password must be at least 8 characters with uppercase, lowercase, and number"
    required "This field is required"
  }
}
```

### 5.1. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | **Required** | Output file path for validation schemas |
| `generateTypes` | `boolean` | `true` | Generate TypeScript types from schemas |
| `includeEnums` | `boolean` | `true` | Generate enum validation schemas |
| `customValidators` | `object` | `{}` | Custom Zod validators for specific types |
| `errorMessages` | `object` | `{}` | Custom error messages for validation |
| `strictMode` | `boolean` | `false` | Use strict object validation |
| `exportStyle` | `'named'\|'default'\|'namespace'` | `'named'` | Export style for schemas |

## 6. Usage Examples

### 6.1. Basic Schema

```ts
enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

model User {
  id String @id @default("nanoid()")
  email String @email @required
  name String @min(2) @max(50) @required
  age Number @min(18) @max(120)
  role UserRole @default("USER")
  active Boolean @default(true)
  createdAt Date @default("now()")
}

plugin "./plugins/zod-validation.js" {
  output "./validation.ts"
  generateTypes true
  strictMode true
}
```

### 6.2. Generated Validation Usage

```typescript
import { 
  UserSchema, 
  CreateUserSchema, 
  UpdateUserSchema,
  UserRole 
} from './validation';

// Validate complete user object
const validateUser = (data: unknown) => {
  try {
    const user = UserSchema.parse(data);
    console.log('Valid user:', user);
    return { success: true, data: user };
  } catch (error) {
    console.error('Validation failed:', error.errors);
    return { success: false, errors: error.errors };
  }
};

// Validate user creation data
const validateCreateUser = (data: unknown) => {
  const result = CreateUserSchema.safeParse(data);
  
  if (result.success) {
    console.log('Valid create data:', result.data);
    return result.data;
  } else {
    console.error('Validation errors:', result.error.errors);
    throw new Error('Invalid user data');
  }
};

// Validate user update data
const validateUpdateUser = (data: unknown) => {
  return UpdateUserSchema.parse(data);
};

// Example usage
const userData = {
  email: 'john@example.com',
  name: 'John Doe',
  age: 30,
  role: 'user' as UserRole
};

const validUser = validateCreateUser(userData);
```

### 6.3. Form Validation Example

```typescript
import { CreateUserSchema } from './validation';

// React form validation
function UserForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData);
    
    const result = CreateUserSchema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      
      setErrors(fieldErrors);
      return;
    }
    
    // Submit valid data
    submitUser(result.data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      {errors.email && <span>{errors.email}</span>}
      
      <input name="name" type="text" />
      {errors.name && <span>{errors.name}</span>}
      
      <input name="age" type="number" />
      {errors.age && <span>{errors.age}</span>}
      
      <button type="submit">Create User</button>
    </form>
  );
}
```

## 7. Advanced Features

### 7.1. Custom Validators

```typescript
// In plugin configuration
customValidators: {
  Email: "z.string().email().transform(val => val.toLowerCase())",
  Password: "z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)",
  Slug: "z.string().regex(/^[a-z0-9-]+$/)",
  Color: "z.string().regex(/^#[0-9A-F]{6}$/i)",
  JSON: "z.string().transform(val => JSON.parse(val))"
}
```

### 7.2. Conditional Validation

```typescript
// Generated schema with conditional validation
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  adminCode: z.string().optional(),
}).refine((data) => {
  // Admin users must have admin code
  if (data.role === 'admin' && !data.adminCode) {
    return false;
  }
  return true;
}, {
  message: "Admin users must provide an admin code",
  path: ["adminCode"],
});
```

### 7.3. Transform and Preprocess

```typescript
// Add transforms to generated schemas
function addTransforms(schema: string, column: any): string {
  if (column.attributes?.transform) {
    switch (column.attributes.transform) {
      case 'lowercase':
        return schema + '.transform(val => val.toLowerCase())';
      case 'uppercase':
        return schema + '.transform(val => val.toUpperCase())';
      case 'trim':
        return schema + '.transform(val => val.trim())';
      case 'slug':
        return schema + '.transform(val => val.toLowerCase().replace(/\\s+/g, "-"))';
    }
  }
  
  return schema;
}
```

### 7.4. Async Validation

```typescript
// Generate async validation schemas
export const UserSchemaAsync = UserSchema.extend({
  email: z.string().email().refine(async (email) => {
    // Check if email is unique
    const exists = await checkEmailExists(email);
    return !exists;
  }, {
    message: "Email already exists",
  }),
});

// Usage
const validateUserAsync = async (data: unknown) => {
  try {
    const user = await UserSchemaAsync.parseAsync(data);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};
```

## 8. Best Practices

### 8.1. Error Handling

```typescript
// Centralized validation error handling
class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
  
  getFieldErrors(): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    
    this.errors.errors.forEach((error) => {
      const field = error.path.join('.');
      fieldErrors[field] = error.message;
    });
    
    return fieldErrors;
  }
}

// Usage
function validateWithErrorHandling<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  
  return result.data;
}
```

### 8.2. Schema Composition

```typescript
// Compose schemas for reusability
const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().min(1),
});

const PostSchema = BaseEntitySchema.extend({
  title: z.string().min(1),
  content: z.string(),
  authorId: z.string(),
});
```

### 8.3. Type Guards

```typescript
// Generate type guards from schemas
export const isUser = (data: unknown): data is User => {
  return UserSchema.safeParse(data).success;
};

export const isCreateUserInput = (data: unknown): data is CreateUserInput => {
  return CreateUserSchema.safeParse(data).success;
};

// Usage
function processUserData(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows data is User
    console.log(data.email);
  }
}
```

### 8.4. API Integration

```typescript
// Middleware for API validation
function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: result.error.errors.reduce((acc, err) => {
          const field = err.path.join('.');
          acc[field] = err.message;
          return acc;
        }, {} as Record<string, string>)
      });
    }
    
    req.body = result.data;
    next();
  };
}

// Usage
app.post('/users', validateBody(CreateUserSchema), (req, res) => {
  // req.body is now typed and validated
  const user = req.body; // Type: CreateUserInput
});
```

## 9. Troubleshooting

### 9.1. Common Issues

1. **Circular Dependencies**
   ```typescript
   // Handle circular references with lazy evaluation
   const UserSchema: z.ZodSchema<User> = z.lazy(() => z.object({
     id: z.string(),
     posts: z.array(PostSchema),
   }));
   
   const PostSchema: z.ZodSchema<Post> = z.lazy(() => z.object({
     id: z.string(),
     author: UserSchema,
   }));
   ```

2. **Complex Validation Rules**
   ```typescript
   // Use refinements for complex validation
   const PasswordSchema = z.string()
     .min(8, "Password must be at least 8 characters")
     .refine((password) => /[A-Z]/.test(password), {
       message: "Password must contain at least one uppercase letter",
     })
     .refine((password) => /[a-z]/.test(password), {
       message: "Password must contain at least one lowercase letter",
     })
     .refine((password) => /\d/.test(password), {
       message: "Password must contain at least one number",
     });
   ```

3. **Performance Issues**
   ```typescript
   // Use preprocess for expensive operations
   const OptimizedSchema = z.preprocess(
     (data) => {
       // Expensive preprocessing
       return normalizeData(data);
     },
     z.object({
       // Schema definition
     })
   );
   ```

### 9.2. Debugging Tips

1. **Schema Testing**
   ```typescript
   // Test schemas with various inputs
   describe('UserSchema', () => {
     it('should validate valid user data', () => {
       const validData = {
         email: 'test@example.com',
         name: 'Test User',
         age: 25
       };
       
       expect(() => UserSchema.parse(validData)).not.toThrow();
     });
     
     it('should reject invalid email', () => {
       const invalidData = {
         email: 'invalid-email',
         name: 'Test User',
         age: 25
       };
       
       expect(() => UserSchema.parse(invalidData)).toThrow();
     });
   });
   ```

2. **Error Message Customization**
   ```typescript
   // Customize error messages for better UX
   const UserSchema = z.object({
     email: z.string().email("Please enter a valid email address"),
     age: z.number().min(18, "You must be at least 18 years old"),
   });
   ```

This tutorial provides a comprehensive foundation for creating Zod validation schemas from `.idea` files. The generated schemas provide runtime type checking and validation with excellent TypeScript integration.
