//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav, SS } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import Code from '../../components/Code.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
const examples = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
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
}`,
  `export default async function generateZodSchemas(
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
    
    console.log(\`✅ Zod validation schemas generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ Zod schema generation failed:', error.message);
    throw error;
  }
}`,
  `function generateFileHeader(): string {
  const timestamp = new Date().toISOString();
  return \`/**
 * Generated Zod Validation Schemas
 * Generated at: \${timestamp}
 * 
 * This file is auto-generated. Do not edit manually.
 */

\`;
}

function generateImports(config: ZodConfig): string {
  let imports = \`import { z } from 'zod';\\n\\n\`;
  
  if (config.generateTypes) {
    imports += \`// Type inference helpers\\ntype Infer<T> = z.infer<T>;\\n\\n\`;
  }
  
  return imports;
}`,
  `function generateEnumSchemas(enums: Record<string, any>, config: ZodConfig): string {
  let content = '// Enum Schemas\\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    const values = Object.values(enumDef);
    const zodValues = values.map(v => \`"\${v}"\`).join(', ');
    
    content += \`export const \${enumName}Schema = z.enum([\${zodValues}]);\\n\`;
    
    if (config.generateTypes) {
      content += \`export type \${enumName} = z.infer<typeof \${enumName}Schema>;\\n\`;
    }
    
    content += '\\n';
  }
  
  return content + '\\n';
}`,
  `function generateTypeSchemas(types: Record<string, any>, config: ZodConfig): string {
  let content = '// Type Schemas\\n';
  
  for (const [typeName, typeDef] of Object.entries(types)) {
    content += \`export const \${typeName}Schema = z.object({\\n\`;
    
    for (const column of typeDef.columns || []) {
      const fieldSchema = generateFieldSchema(column, config);
      content += \`  \${column.name}: \${fieldSchema},\\n\`;
    }
    
    content += '})';
    
    // Add strict mode if enabled
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\\n';
    
    if (config.generateTypes) {
      content += \`export type \${typeName} = z.infer<typeof \${typeName}Schema>;\\n\`;
    }
    
    content += '\\n';
  }
  
  return content;
}`,
  `function generateModelSchemas(models: Record<string, any>, config: ZodConfig): string {
  let content = '// Model Schemas\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += \`export const \${modelName}Schema = z.object({\\n\`;
    
    for (const column of model.columns || []) {
      const fieldSchema = generateFieldSchema(column, config);
      content += \`  \${column.name}: \${fieldSchema},\\n\`;
    }
    
    content += '})';
    
    // Add strict mode if enabled
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\\n';
    
    if (config.generateTypes) {
      content += \`export type \${modelName} = z.infer<typeof \${modelName}Schema>;\\n\`;
    }
    
    // Generate input schemas
    content += generateInputSchemas(modelName, model, config);
    
    content += '\\n';
  }
  
  return content;
}`,
  `function generateFieldSchema(column: any, config: ZodConfig): string {
  let schema = mapTypeToZod(column.type, config);
  
  // Handle arrays
  if (column.multiple) {
    schema = \`z.array(\${schema})\`;
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
  
  return typeMap[schemaType] || \`\${schemaType}Schema\`;
}`,
  `plugin "./plugins/zod-validation.js" {
  output "./generated/validation.ts"
  generateTypes true
  includeEnums true
  strictMode true
  exportStyle "named"
  customValidators {
    Email "z.string().email()"
    Password "z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)/)"
    PhoneNumber "z.string().regex(/^\\\\+?[1-9]\\\\d{1,14}$/)"
  }
  errorMessages {
    email "Please enter a valid email address"
    password "Password must be at least 8 characters with uppercase, lowercase, and number"
    required "This field is required"
  }
}`,
  `enum UserRole {
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
}`,
  `import { 
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

const validUser = validateCreateUser(userData);`,
  `import { CreateUserSchema } from './validation';

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
}`,
  `// In plugin configuration
customValidators: {
  Email: "z.string().email().transform(val => val.toLowerCase())",
  Password: "z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)/)",
  Slug: "z.string().regex(/^[a-z0-9-]+$/)",
  Color: "z.string().regex(/^#[0-9A-F]{6}$/i)",
  JSON: "z.string().transform(val => JSON.parse(val))"
}`,
  `// Generated schema with conditional validation
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
});`,
  `// Add transforms to generated schemas
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
        return schema + '.transform(val => val.toLowerCase().replace(/\\\\s+/g, "-"))';
    }
  }
  
  return schema;
}`,
  `// Generate async validation schemas
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
};`,
  `// Centralized validation error handling
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
}`,
  `// Compose schemas for reusability
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
});`,
  `// Generate type guards from schemas
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
}`,
  `// Middleware for API validation
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
});`,
  `// Handle circular references with lazy evaluation
const UserSchema: z.ZodSchema<User> = z.lazy(() => z.object({
  id: z.string(),
  posts: z.array(PostSchema),
}));

const PostSchema: z.ZodSchema<Post> = z.lazy(() => z.object({
  id: z.string(),
  author: UserSchema,
}));`,
  `// Use refinements for complex validation
const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /\\d/.test(password), {
    message: "Password must contain at least one number",
  });`,
  `// Use preprocess for expensive operations
const OptimizedSchema = z.preprocess(
  (data) => {
    // Expensive preprocessing
    return normalizeData(data);
  },
  z.object({
    // Schema definition
  })
);`,
  `// Test schemas with various inputs
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
});`,
  `// Customize error messages for better UX
const UserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  age: z.number().min(18, "You must be at least 18 years old"),
});`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Validation Schema Generator Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates Zod validation schemas from .idea schema files'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/idea-logo-icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/idea-logo-icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export function Right() {
  const { _ } = useLanguage();
  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('On this page')}
      </h6>
      <nav className="px-m-14 px-lh-32">
        <a href="#1-overview" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('1. Overview')}
        </a>
        <a href="#2-prerequisites" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('2. Prerequisites')}
        </a>
        <a href="#3-plugin-structure" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('3. Plugin Structure')}
        </a>
        <a href="#4-implementation" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('4. Implementation')}
        </a>
        <a href="#5-schema-configuration" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('5. Schema Configuration')}
        </a>
        <a href="#6-usage-examples" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('6. Usage Examples')}
        </a>
        <a href="#7-advanced-features" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('7. Advanced Features')}
        </a>
        <a href="#8-best-practices" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('8. Best Practices')}
        </a>
        <a href="#9-troubleshooting" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('9. Troubleshooting')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Validation Schema Generator Plugin Tutorial</H1>
      <P>
        This tutorial demonstrates how to create a plugin that generates Zod validation schemas from <C>.idea</C> schema files. The plugin will transform your schema models into type-safe validation schemas with comprehensive validation rules.
      </P>

      <section id="1-overview">
        <H2>1. Overview</H2>
        <P>
          Zod is a TypeScript-first schema validation library that provides runtime type checking and validation. This plugin transforms your <C>.idea</C> schema definitions into comprehensive Zod validation schemas that provide robust runtime validation with excellent TypeScript integration.
        </P>
        <P>This plugin generates Zod schemas from your <C>.idea</C> schema, including:</P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2"><SS>Schema Validation</SS>: Zod schemas for all models and types</li>
          <li className="my-2"><SS>Type Inference</SS>: TypeScript types inferred from Zod schemas</li>
          <li className="my-2"><SS>Custom Validators</SS>: Support for custom validation rules</li>
          <li className="my-2"><SS>Error Messages</SS>: Customizable validation error messages</li>
          <li className="my-2"><SS>Nested Validation</SS>: Support for nested objects and arrays</li>
        </ul>
      </section>

      <section id="2-prerequisites">
        <H2>2. Prerequisites</H2>
        <P>
          Before implementing the Zod validation schema generator plugin, ensure you have the necessary development environment and knowledge. This section covers the essential requirements for successful plugin creation and Zod integration.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Node.js 16+ and npm/yarn</li>
          <li className="my-2">TypeScript 4.0+</li>
          <li className="my-2">Zod 3.0+</li>
          <li className="my-2">Basic understanding of validation concepts</li>
          <li className="my-2">Familiarity with the <C>@stackpress/idea-transformer</C> library</li>
          <li className="my-2">Understanding of <C>.idea</C> schema format</li>
        </ul>
      </section>

      <section id="3-plugin-structure">
        <H2>3. Plugin Structure</H2>
        <P>
          The plugin structure defines the core architecture and configuration interface for the Zod validation schema generator. This includes the main plugin function, configuration types, and the overall organization of the generated validation code.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </section>

      <section id="4-implementation">
        <H2>4. Implementation</H2>
        <P>
          The implementation section covers the core plugin function and supporting utilities that handle Zod schema generation. This includes configuration validation, content generation, file writing, and error handling throughout the generation process.
        </P>

        <H3>4.1. Core Plugin Function</H3>
        <P>
          The core plugin function serves as the main entry point for Zod schema generation. It orchestrates the entire process from configuration validation through content generation to file output, ensuring proper error handling and logging throughout.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H3>4.2. Generation Functions</H3>
        <P>
          Generation functions create specific parts of the Zod validation output including enum schemas, type schemas, model schemas, and utility schemas. These functions handle proper Zod syntax construction and validation rule application.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[4]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[5]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[6]}
        </Code>
      </section>

      <section id="5-schema-configuration">
        <H2>5. Schema Configuration</H2>
        <P>
          Schema configuration demonstrates how to integrate the Zod validation generator into your <C>.idea</C> schema files. This section covers plugin configuration options and their effects on the generated validation schemas.
        </P>
        <P>Add the Zod validation plugin to your <C>.idea</C> schema file:</P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <H3>Configuration Options</H3>
        <P>
          Configuration options control how Zod validation schemas are generated, including output formatting, validation strictness, and feature enablement. Understanding these options helps you customize the plugin to meet your specific validation requirements.
        </P>

        <Table className="text-left">
          <Thead className='theme-bg-bg2'>Option</Thead>
          <Thead className='theme-bg-bg2'>Type</Thead>
          <Thead className='theme-bg-bg2'>Default</Thead>
          <Thead className='theme-bg-bg2'>Description</Thead>
          <Trow>
            <Tcol><C>output</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol><SS>Required</SS></Tcol>
            <Tcol>Output file path for validation schemas</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>generateTypes</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>true</C></Tcol>
            <Tcol>Generate TypeScript types from schemas</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>includeEnums</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>true</C></Tcol>
            <Tcol>Generate enum validation schemas</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>customValidators</C></Tcol>
            <Tcol><C>object</C></Tcol>
            <Tcol><C>{`{}`}</C></Tcol>
            <Tcol>Custom Zod validators for specific types</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>errorMessages</C></Tcol>
            <Tcol><C>object</C></Tcol>
            <Tcol><C>{`{}`}</C></Tcol>
            <Tcol>Custom error messages for validation</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>strictMode</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>false</C></Tcol>
            <Tcol>Use strict object validation</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>exportStyle</C></Tcol>
            <Tcol><C>'named'|'default'|'namespace'</C></Tcol>
            <Tcol><C>'named'</C></Tcol>
            <Tcol>Export style for schemas</Tcol>
          </Trow>
        </Table>
      </section>

      <section id="6-usage-examples">
        <H2>6. Usage Examples</H2>
        <P>
          Usage examples demonstrate practical applications of the Zod validation generator with real-world scenarios. These examples show how to configure the plugin for different use cases and how the generated validation schemas integrate into development workflows.
        </P>

        <H3>6.1. Basic Schema</H3>
        <P>
          A basic schema example shows the fundamental structure needed to generate Zod validation schemas. This includes model definitions with proper validation attributes and plugin configuration that produces comprehensive validation rules.
        </P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[8]}
        </Code>

        <H3>6.2. Generated Validation Usage</H3>
        <P>
          The generated validation usage demonstrates how to use the Zod schemas produced by the plugin in real applications. This shows practical patterns for data validation, error handling, and type safety in TypeScript applications.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <H3>6.3. Form Validation Example</H3>
        <P>
          Form validation examples show how to integrate the generated Zod schemas with frontend frameworks for user input validation. This demonstrates real-world usage patterns for form handling and user feedback.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[10]}
        </Code>
      </section>

      <section id="7-advanced-features">
        <H2>7. Advanced Features</H2>
        <P>
          Advanced features extend the basic Zod schema generation with sophisticated validation patterns, conditional logic, data transformation, and asynchronous validation. These features enable production-ready validation that handles complex business requirements.
        </P>

        <H3>7.1. Custom Validators</H3>
        <P>
          Custom validators allow you to define specialized validation logic for specific data types or business rules. This feature enables the creation of reusable validation patterns that can be applied across multiple schema definitions.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <H3>7.2. Conditional Validation</H3>
        <P>
          Conditional validation enables complex validation logic that depends on the values of other fields. This feature is essential for implementing business rules that require cross-field validation and context-dependent constraints.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <H3>7.3. Transform and Preprocess</H3>
        <P>
          Transform and preprocess capabilities allow you to modify data during validation, enabling data normalization, formatting, and cleanup. This feature ensures data consistency and proper formatting before validation.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[13]}
        </Code>

        <H3>7.4. Async Validation</H3>
        <P>
          Async validation enables validation rules that require external data sources or API calls, such as checking for unique values or validating against external services. This feature is crucial for comprehensive data validation in real applications.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[14]}
        </Code>
      </section>

      <section id="8-best-practices">
        <H2>8. Best Practices</H2>
        <P>
          Best practices ensure your generated Zod validation schemas are maintainable, performant, and provide excellent developer experience. These guidelines cover error handling, schema composition, type safety, and API integration patterns.
        </P>

        <H3>8.1. Error Handling</H3>
        <P>
          Proper error handling ensures that validation failures provide clear, actionable feedback to users and developers. Implement centralized error handling patterns and meaningful error messages to improve the overall user experience.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[15]}
        </Code>

        <H3>8.2. Schema Composition</H3>
        <P>
          Schema composition enables the creation of reusable validation components that can be combined to build complex validation schemas. This approach promotes code reuse and maintains consistency across your validation logic.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H3>8.3. Type Guards</H3>
        <P>
          Type guards provide runtime type checking that integrates seamlessly with TypeScript's type system. Generated type guards enable safe type narrowing and improve code reliability by ensuring data conforms to expected types.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[17]}
        </Code>

        <H3>8.4. API Integration</H3>
        <P>
          API integration patterns show how to use generated Zod schemas for request validation in web applications. This includes middleware creation, error response formatting, and type-safe request handling.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[18]}
        </Code>
      </section>

      <section id="9-troubleshooting">
        <H2>9. Troubleshooting</H2>
        <P>
          This section addresses common issues encountered when generating Zod validation schemas and provides solutions for debugging and resolving problems. Understanding these troubleshooting techniques helps ensure reliable validation schema generation.
        </P>

        <H3>9.1. Common Issues</H3>
        <P>
          Common issues include circular dependencies, complex validation rules, and performance problems with large schemas. These problems typically arise from schema complexity or validation requirements that need specialized handling.
        </P>

        <H3>9.1.1. Circular Dependencies</H3>
        <P>
          Circular dependencies occur when schemas reference each other in a way that creates infinite loops. Zod provides lazy evaluation to handle these scenarios while maintaining type safety and validation integrity.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[19]}
        </Code>

        <H3>9.1.2. Complex Validation Rules</H3>
        <P>
          Complex validation rules require sophisticated logic that goes beyond simple type checking. Use Zod's refinement capabilities to implement business rules and cross-field validation while maintaining clear error messages.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[20]}
        </Code>

        <H3>9.1.3. Performance Issues</H3>
        <P>
          Performance issues can arise when validation schemas are complex or when processing large amounts of data. Optimize validation performance using preprocessing, caching, and efficient schema design patterns.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[21]}
        </Code>

        <H3>9.2. Debugging Tips</H3>
        <P>
          Debugging tips help identify and resolve issues during Zod schema generation and usage. These techniques provide visibility into validation behavior and help diagnose problems with schema logic or performance.
        </P>

        <H3>9.2.1. Schema Testing</H3>
        <P>
          Schema testing ensures that your validation logic works correctly across different input scenarios. Comprehensive testing helps catch edge cases and ensures validation behaves as expected in production.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[22]}
        </Code>

        <H3>9.2.2. Error Message Customization</H3>
        <P>
          Error message customization improves user experience by providing clear, actionable feedback when validation fails. Well-crafted error messages help users understand what went wrong and how to fix it.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[23]}
        </Code>
      </section>

      <section id="conclusion">
        <P>
          This tutorial provides a comprehensive foundation for creating Zod validation schemas from <C>.idea</C> files. The generated schemas provide runtime type checking and validation with excellent TypeScript integration.
        </P>
      </section>

      <Nav
        prev={{ text: 'API Client Plugin', href: '/docs/tutorials/api-client-plugin' }}
        next={{ text: 'Test Data Plugin', href: '/docs/tutorials/test-data-plugin' }}
      />
    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}
