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
}`,
  `export default async function generateTypeScriptInterfaces(
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
    
    console.log(\`✅ TypeScript interfaces generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ TypeScript interface generation failed:', error.message);
    throw error;
  }
}`,
  `function mapSchemaTypeToTypeScript(
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
    return \`\${baseType} | null | undefined\`;
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
    type = \`\${type}[]\`;
  }
  
  // Handle optional properties
  if (!column.required && config.strictNullChecks) {
    type = \`\${type} | null\`;
  }
  
  return type;
}`,
  `function generateFileHeader(): string {
  const timestamp = new Date().toISOString();
  return \`/**
 * Generated TypeScript interfaces
 * Generated at: \${timestamp}
 * 
 * This file is auto-generated. Do not edit manually.
 */

\`;
}

function generateEnums(
  enums: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Enums\\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    if (config.includeComments) {
      content += \`/**\\n * \${enumName} enumeration\\n */\\n\`;
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
    
    content += '\\n';
  }
  
  return content + '\\n';
}`,
  `function generateStandardEnum(enumName: string, enumDef: any): string {
  let content = \`export enum \${enumName} {\\n\`;
  
  for (const [key, value] of Object.entries(enumDef)) {
    content += \`  \${key} = "\${value}",\\n\`;
  }
  
  content += '}';
  return content;
}

function generateUnionEnum(enumName: string, enumDef: any): string {
  const values = Object.values(enumDef).map(v => \`"\${v}"\`).join(' | ');
  return \`export type \${enumName} = \${values};\`;
}

function generateConstEnum(enumName: string, enumDef: any): string {
  let content = \`export const \${enumName} = {\\n\`;
  
  for (const [key, value] of Object.entries(enumDef)) {
    content += \`  \${key}: "\${value}",\\n\`;
  }
  
  content += '} as const;\\n\\n';
  content += \`export type \${enumName} = typeof \${enumName}[keyof typeof \${enumName}];\`;
  
  return content;
}`,
  `function generateCustomTypes(
  types: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Custom Types\\n';
  const availableTypes = new Set(Object.keys(types));
  
  for (const [typeName, typeDef] of Object.entries(types)) {
    if (config.includeComments) {
      content += \`/**\\n * \${typeName} type definition\\n */\\n\`;
    }
    
    content += \`export interface \${typeName} {\\n\`;
    
    for (const column of typeDef.columns || []) {
      const propertyType = formatPropertyType(column, config, availableTypes);
      const optional = !column.required ? '?' : '';
      
      if (config.includeComments && column.description) {
        content += \`  /** \${column.description} */\\n\`;
      }
      
      content += \`  \${column.name}\${optional}: \${propertyType};\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}`,
  `function generateInterfaces(
  models: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Model Interfaces\\n';
  const availableTypes = new Set([
    ...Object.keys(models),
    ...(config.namespace ? [] : Object.keys(models))
  ]);
  
  for (const [modelName, model] of Object.entries(models)) {
    if (config.includeComments) {
      content += \`/**\\n * \${modelName} model interface\\n\`;
      if (model.description) {
        content += \` * \${model.description}\\n\`;
      }
      content += \` */\\n\`;
    }
    
    content += \`export interface \${modelName} {\\n\`;
    
    for (const column of model.columns || []) {
      const propertyType = formatPropertyType(column, config, availableTypes);
      const optional = !column.required ? '?' : '';
      
      if (config.includeComments) {
        let comment = '';
        if (column.description) {
          comment += column.description;
        }
        if (column.attributes?.default) {
          comment += comment ? \` (default: \${column.attributes.default})\` : \`Default: \${column.attributes.default}\`;
        }
        if (comment) {
          content += \`  /** \${comment} */\\n\`;
        }
      }
      
      content += \`  \${column.name}\${optional}: \${propertyType};\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}`,
  `function generateUtilityTypes(
  schema: any, 
  config: TypeScriptConfig
): string {
  let content = '// Utility Types\\n';
  
  if (schema.model) {
    const modelNames = Object.keys(schema.model);
    
    // Generate create input types (omit auto-generated fields)
    for (const modelName of modelNames) {
      const model = schema.model[modelName];
      const autoFields = model.columns
        ?.filter((col: any) => col.attributes?.id || col.attributes?.default)
        .map((col: any) => \`'\${col.name}'\`)
        .join(' | ');
      
      if (autoFields) {
        content += \`export type Create\${modelName}Input = Omit<\${modelName}, \${autoFields}>;\\n\`;
      } else {
        content += \`export type Create\${modelName}Input = \${modelName};\\n\`;
      }
    }
    
    content += '\\n';
    
    // Generate update input types (all fields optional)
    for (const modelName of modelNames) {
      content += \`export type Update\${modelName}Input = Partial<\${modelName}>;\\n\`;
    }
    
    content += '\\n';
    
    // Generate union types
    const allModels = modelNames.join(' | ');
    content += \`export type AnyModel = \${allModels};\\n\\n\`;
    
    // Generate key types
    for (const modelName of modelNames) {
      content += \`export type \${modelName}Keys = keyof \${modelName};\\n\`;
    }
    
    content += '\\n';
  }
  
  return content;
}

function wrapInNamespace(
  content: string, 
  namespace: string, 
  exportType?: string
): string {
  const exportKeyword = exportType === 'default' ? 'export default' : 'export';
  
  return \`\${exportKeyword} namespace \${namespace} {
\${content.split('\\n').map(line => line ? \`  \${line}\` : line).join('\\n')}
}
\`;
}`,
  `function validateConfig(config: any): asserts config is TypeScriptConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('TypeScript plugin requires "output" configuration as string');
  }
  
  if (config.exportType && !['named', 'default', 'namespace'].includes(config.exportType)) {
    throw new Error('exportType must be one of: named, default, namespace');
  }
  
  if (config.enumType && !['enum', 'union', 'const'].includes(config.enumType)) {
    throw new Error('enumType must be one of: enum, union, const');
  }
}`,
  `plugin "./plugins/typescript-interfaces.js" {
  output "./generated/types.ts"
  namespace "MyApp"
  exportType "named"
  generateUtilityTypes true
  includeComments true
  strictNullChecks true
  generateEnums true
  enumType "enum"
}`,
  `enum UserRole {
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
}`,
  `/**
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

export type UserKeys = keyof User;`,
  `// With namespace configuration
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
}`,
  `// Standard enum (default)
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
export type UserRole = typeof UserRole[keyof typeof UserRole];`,
  `function handleRelationships(
  column: any, 
  config: TypeScriptConfig,
  availableTypes: Set<string>
): string {
  // Check if the column type is another model/type
  if (availableTypes.has(column.type)) {
    let type = column.type;
    
    if (column.multiple) {
      type = \`\${type}[]\`;
    }
    
    if (!column.required && config.strictNullChecks) {
      type = \`\${type} | null\`;
    }
    
    return type;
  }
  
  return formatPropertyType(column, config, availableTypes);
}`,
  `function generateGenericTypes(
  models: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Generic Types\\n';
  
  // Generate paginated response type
  content += \`export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}\\n\\n\`;
  
  // Generate API response type
  content += \`export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}\\n\\n\`;
  
  return content;
}`,
  `interface TypeScriptColumn {
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
}`,
  `function sanitizeTypeName(name: string): string {
  // Ensure TypeScript-valid names
  return name
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&')
    .replace(/^_+|_+$/g, '');
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}`,
  `function generateJSDocComment(
  column: any, 
  includeAttributes: boolean = true
): string {
  const lines: string[] = [];
  
  if (column.description) {
    lines.push(column.description);
  }
  
  if (includeAttributes && column.attributes) {
    if (column.attributes.default) {
      lines.push(\`@default \${column.attributes.default}\`);
    }
    if (column.attributes.example) {
      lines.push(\`@example \${column.attributes.example}\`);
    }
  }
  
  if (lines.length === 0) return '';
  
  if (lines.length === 1) {
    return \`  /** \${lines[0]} */\\n\`;
  }
  
  return \`  /**\\n\${lines.map(line => \`   * \${line}\`).join('\\n')}\\n   */\\n\`;
}`,
  `// Cache type mappings
const typeCache = new Map<string, string>();

function getCachedTypeMapping(
  schemaType: string, 
  strictNullChecks: boolean
): string {
  const cacheKey = \`\${schemaType}:\${strictNullChecks}\`;
  
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey)!;
  }
  
  const mappedType = mapSchemaTypeToTypeScript(schemaType, strictNullChecks);
  typeCache.set(cacheKey, mappedType);
  
  return mappedType;
}`,
  `function validateTypeName(name: string): void {
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    throw new Error(\`Invalid TypeScript identifier: \${name}\`);
  }
}`,
  `function detectCircularReferences(
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
}`,
  `function validateTypeDependencies(
  schema: any
): void {
  const availableTypes = new Set([
    ...Object.keys(schema.model || {}),
    ...Object.keys(schema.type || {}),
    ...Object.keys(schema.enum || {})
  ]);
  
  // Validate all type references...
}`,
  `const VERBOSE = process.env.TS_PLUGIN_VERBOSE === 'true';

function verboseLog(message: string, data?: any) {
  if (VERBOSE) {
    console.log(\`[TypeScript Plugin] \${message}\`, data || '');
  }
}`,
  `import { transpile, ScriptTarget } from 'typescript';

function validateGeneratedTypeScript(content: string): void {
  try {
    transpile(content, {
      target: ScriptTarget.ES2020,
      strict: true
    });
    console.log('✅ Generated TypeScript is valid');
  } catch (error) {
    throw new Error(\`Invalid TypeScript: \${error.message}\`);
  }
}`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('TypeScript Interface Generator Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates TypeScript interfaces from .idea schema files'
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
      <H1>TypeScript Interface Generator Plugin Tutorial</H1>
      <P>
        This tutorial demonstrates how to create a plugin that generates TypeScript interfaces and types from <C>.idea</C> schema files. The plugin will transform your schema models, types, and enums into proper TypeScript definitions with full type safety.
      </P>

      <section id="1-overview">
        <H2>1. Overview</H2>
        <P>
          TypeScript interfaces provide compile-time type checking and excellent IDE support. This plugin transforms your <C>.idea</C> schema definitions into comprehensive TypeScript type definitions that integrate seamlessly with your development workflow and provide robust type safety throughout your application.
        </P>
        <P>This plugin generates TypeScript definitions from your <C>.idea</C> schema, including:</P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2"><SS>Interfaces</SS>: TypeScript interfaces from schema models</li>
          <li className="my-2"><SS>Types</SS>: Type aliases from schema types</li>
          <li className="my-2"><SS>Enums</SS>: TypeScript enums from schema enums</li>
          <li className="my-2"><SS>Utility Types</SS>: Helper types for common operations</li>
          <li className="my-2"><SS>Namespace Support</SS>: Organized type definitions</li>
        </ul>
      </section>

      <section id="2-prerequisites">
        <H2>2. Prerequisites</H2>
        <P>
          Before implementing the TypeScript interface generator plugin, ensure you have the necessary development environment and knowledge. This section covers the essential requirements for successful plugin creation and TypeScript integration.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Node.js 16+ and npm/yarn</li>
          <li className="my-2">TypeScript 4.0+</li>
          <li className="my-2">Basic understanding of TypeScript</li>
          <li className="my-2">Familiarity with the <C>@stackpress/idea-transformer</C> library</li>
          <li className="my-2">Understanding of <C>.idea</C> schema format</li>
        </ul>
      </section>

      <section id="3-plugin-structure">
        <H2>3. Plugin Structure</H2>
        <P>
          The plugin structure defines the core architecture and configuration interface for the TypeScript interface generator. This includes the main plugin function, configuration types, and the overall organization of the generated TypeScript code.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </section>

      <section id="4-implementation">
        <H2>4. Implementation</H2>
        <P>
          The implementation section covers the core plugin function and supporting utilities that handle TypeScript interface generation. This includes configuration validation, content generation, file writing, and error handling throughout the generation process.
        </P>

        <H3>4.1. Core Plugin Function</H3>
        <P>
          The core plugin function serves as the main entry point for TypeScript interface generation. It orchestrates the entire process from configuration validation through content generation to file output, ensuring proper error handling and logging throughout.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H3>4.2. Type Mapping Functions</H3>
        <P>
          Type mapping functions handle the conversion of <C>.idea</C> schema types to their TypeScript equivalents. These functions ensure proper type safety and handle complex scenarios like nullable types, arrays, and custom type references.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>

        <H3>4.3. Generation Functions</H3>
        <P>
          Generation functions create specific parts of the TypeScript output including enums, interfaces, and utility types. These functions handle formatting, documentation generation, and proper TypeScript syntax construction.
        </P>
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
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <H3>4.4. Validation Functions</H3>
        <P>
          Validation functions ensure that the plugin configuration is correct and that the generated TypeScript code meets quality standards. These functions catch configuration errors early and prevent invalid output generation.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[8]}
        </Code>
      </section>

      <section id="5-schema-configuration">
        <H2>5. Schema Configuration</H2>
        <P>
          Schema configuration demonstrates how to integrate the TypeScript interface generator into your <C>.idea</C> schema files. This section covers plugin configuration options and their effects on the generated TypeScript output.
        </P>
        <P>Add the TypeScript plugin to your <C>.idea</C> schema file:</P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <H3>Configuration Options</H3>
        <P>
          Configuration options control how TypeScript interfaces are generated, including output formatting, type handling, and feature enablement. Understanding these options helps you customize the plugin to meet your specific project requirements.
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
            <Tcol>Output file path for TypeScript definitions</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>namespace</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol><C>undefined</C></Tcol>
            <Tcol>Wrap types in a namespace</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>exportType</C></Tcol>
            <Tcol><C>'named'|'default'|'namespace'</C></Tcol>
            <Tcol><C>'named'</C></Tcol>
            <Tcol>Export style for types</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>generateUtilityTypes</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>false</C></Tcol>
            <Tcol>Generate helper utility types</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>includeComments</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>false</C></Tcol>
            <Tcol>Include JSDoc comments</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>strictNullChecks</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>true</C></Tcol>
            <Tcol>Handle null/undefined types</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>generateEnums</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>true</C></Tcol>
            <Tcol>Generate enum definitions</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>enumType</C></Tcol>
            <Tcol><C>'enum'|'union'|'const'</C></Tcol>
            <Tcol><C>'enum'</C></Tcol>
            <Tcol>Enum generation style</Tcol>
          </Trow>
        </Table>
      </section>

      <section id="6-usage-examples">
        <H2>6. Usage Examples</H2>
        <P>
          Usage examples demonstrate practical applications of the TypeScript interface generator with real-world scenarios. These examples show how to configure the plugin for different use cases and how the generated TypeScript code integrates into development workflows.
        </P>

        <H3>6.1. Basic Schema</H3>
        <P>
          A basic schema example shows the fundamental structure needed to generate TypeScript interfaces. This includes model definitions with proper attributes, enum declarations, and plugin configuration that produces clean, type-safe TypeScript code.
        </P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H3>6.2. Generated Output</H3>
        <P>
          The generated output demonstrates the TypeScript code produced by the plugin from the basic schema example. This shows how schema definitions are transformed into proper TypeScript interfaces with full type safety and documentation.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>
      </section>

      <section id="7-advanced-features">
        <H2>7. Advanced Features</H2>
        <P>
          Advanced features extend the basic TypeScript interface generation with sophisticated organization, multiple enum types, relationship handling, and generic type support. These features enable production-ready TypeScript definitions that handle complex scenarios.
        </P>

        <H3>7.1. Namespace Support</H3>
        <P>
          Namespace support allows you to organize generated types within TypeScript namespaces, preventing naming conflicts and providing better code organization. This feature is particularly useful for large projects with multiple schema files.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <H3>7.2. Different Enum Types</H3>
        <P>
          Different enum types provide flexibility in how enumerations are represented in TypeScript. The plugin supports standard enums, union types, and const assertions, each with different runtime characteristics and use cases.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[13]}
        </Code>

        <H3>7.3. Relationship Handling</H3>
        <P>
          Relationship handling manages references between different types and models in your schema. This ensures that type relationships are properly represented in the generated TypeScript code with correct type references and nullability handling.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[14]}
        </Code>

        <H3>7.4. Generic Type Support</H3>
        <P>
          Generic type support enables the generation of reusable type definitions that work with multiple data types. This includes common patterns like paginated responses and API response wrappers that enhance type safety across your application.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[15]}
        </Code>
      </section>

      <section id="8-best-practices">
        <H2>8. Best Practices</H2>
        <P>
          Best practices ensure your generated TypeScript interfaces are maintainable, reliable, and follow industry standards. These guidelines cover type safety, naming conventions, documentation generation, and performance optimization.
        </P>

        <H3>8.1. Type Safety</H3>
        <P>
          Type safety is crucial for preventing runtime errors and improving developer experience. Always validate input data and use proper TypeScript types throughout the plugin implementation to ensure reliable code generation.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H3>8.2. Naming Conventions</H3>
        <P>
          Naming conventions ensure that generated TypeScript identifiers are valid and follow established patterns. Proper naming improves code readability and prevents conflicts with reserved keywords or invalid characters.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[17]}
        </Code>

        <H3>8.3. Documentation Generation</H3>
        <P>
          Documentation generation creates comprehensive JSDoc comments that provide context and examples for the generated types. This improves the developer experience by providing inline documentation in IDEs and code editors.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[18]}
        </Code>

        <H3>8.4. Performance Optimization</H3>
        <P>
          Performance optimization techniques help maintain reasonable generation times when working with large schemas. Caching strategies and efficient algorithms ensure the plugin scales well with complex type hierarchies.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[19]}
        </Code>
      </section>

      <section id="9-troubleshooting">
        <H2>9. Troubleshooting</H2>
        <P>
          This section addresses common issues encountered when generating TypeScript interfaces and provides solutions for debugging and resolving problems. Understanding these troubleshooting techniques helps ensure reliable interface generation.
        </P>

        <H3>9.1. Common Issues</H3>
        <P>
          Common issues include invalid TypeScript identifiers, circular type references, and missing dependencies. These problems typically arise from schema complexity or configuration mismatches that can be resolved with proper validation and error handling.
        </P>

        <H3>9.1.1. Invalid TypeScript Names</H3>
        <P>
          Invalid TypeScript names occur when schema identifiers contain characters that are not valid in TypeScript. The plugin should validate and sanitize names to ensure they conform to TypeScript identifier rules.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[20]}
        </Code>

        <H3>9.1.2. Circular Type References</H3>
        <P>
          Circular type references can cause infinite loops during generation or compilation errors in the generated TypeScript code. Detecting and handling these scenarios is essential for robust type generation.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[21]}
        </Code>

        <H3>9.1.3. Missing Type Dependencies</H3>
        <P>
          Missing type dependencies occur when a type references another type that doesn't exist in the schema. Validating type dependencies ensures all references are resolvable and prevents compilation errors.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[22]}
        </Code>

        <H3>9.2. Debugging Tips</H3>
        <P>
          Debugging tips help identify and resolve issues during TypeScript interface generation. These techniques provide visibility into the generation process and help diagnose problems with schema processing or output generation.
        </P>

        <H3>9.2.1. Enable Verbose Output</H3>
        <P>
          Verbose output provides detailed logging during the generation process, helping identify where issues occur and what data is being processed at each step.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[23]}
        </Code>

        <H3>9.2.2. Validate Generated TypeScript</H3>
        <P>
          Validating generated TypeScript ensures that the output is syntactically correct and will compile successfully. This validation step catches generation errors before the code is used in development.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[24]}
        </Code>
      </section>

      <section id="conclusion">
        <P>
          This tutorial provides a comprehensive foundation for creating TypeScript interface generators from <C>.idea</C> files. The generated types can be used throughout your TypeScript projects for compile-time type checking and enhanced IDE support.
        </P>
      </section>


      <Nav
        prev={{ text: 'GraphQL Schema Plugin', href: '/docs/tutorials/graphql-schema-plugin' }}
        next={{ text: 'API Client Plugin', href: '/docs/tutorials/api-client-plugin' }}
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
