//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import Code from '../../components/Code.js';
import {Table, Thead, Trow, Tcol} from 'frui/element/Table';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('MySQL Tables Plugin');
  const description = _(
    'A guide to creating a plugin that generates MySQL tables from schema definitions'
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
        <a href="#1-introduction" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('1. Introduction')}
        </a>
        <a href="#2-prerequisites" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('2. Understanding the Schema Structure')}
        </a>
        <a href="#3-setting-up-the-project" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('3. Create the Plugin Structure')}
        </a>
        <a href="#4-understanding-ts-morph-basics" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('4. Implement Type Mapping')}
        </a>
        <a href="#5-creating-your-first-plugin" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('5. Generate SQL Statements')}
        </a>
        <a href="#6-advanced-ts-morph-features" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('6. Usage in Schema')}
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

const pluginStructureExample = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
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
}`
]

const corePluginFunctionExample = [
  `export default async function generateGraphQLSchema(
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
    
    console.log(\`✅ GraphQL schema generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ GraphQL schema generation failed:', error.message);
    throw error;
  }
}`,
  `function mapSchemaTypeToGraphQL(schemaType: string, customScalars: Record<string, string> = {}): string {
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
    type = \`[$\{type}\]\`;
  }
  
  // Handle required fields
  if (column.required) {
    type += '!';
  }
  
  return type;
}`,
  `function generateCustomScalars(customScalars: Record<string, string>): string {
  if (Object.keys(customScalars).length === 0) {
    return \`# Custom Scalars
scalar DateTime
scalar JSON

\`;
  }
  
  let content = '# Custom Scalars\\n';
  content += 'scalar DateTime\\n';
  content += 'scalar JSON\\n';
  
  for (const [name, description] of Object.entries(customScalars)) {
    content += \`scalar $\{name}\\n\`;
  }
  
  return content + '\\n';
}

function generateEnums(enums: Record<string, any>): string {
  let content = '# Enums\\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    content += \`enum $\{enumName} {\\n\`;
    
    for (const [key, value] of Object.entries(enumDef)) {
      content += \`  $\{key}\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}

function generateTypes(models: Record<string, any>): string {
  let content = '# Types\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += \`type $\{modelName} {\\n\`;
    
    for (const column of model.columns || []) {
      const fieldType = formatFieldType(column);
      content += \`  $\{column.name}: $\{fieldType}\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}

function generateInputTypes(models: Record<string, any>): string {
  let content = '# Input Types\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    // Create input type
    content += \`input $\{modelName}Input {\\n\`;
    
    for (const column of model.columns || []) {
      // Skip auto-generated fields like ID for input types
      if (column.attributes?.id) continue;
      
      let fieldType = formatFieldType(column);
      // Remove required constraint for input types (make them optional)
      fieldType = fieldType.replace('!', '');
      
      content += \`  $\{column.name}: $\{fieldType}\n\`;
    }
    
    content += '}\\n\\n';
    
    // Create update input type
    content += \`input $\{modelName}UpdateInput {\n\`;
    
    for (const column of model.columns || []) {
      let fieldType = formatFieldType(column);
      // All fields are optional in update input
      fieldType = fieldType.replace('!', '');
      
      content += \`  $\{column.name}: $\{fieldType}\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}

function generateCustomTypes(types: Record<string, any>): string {
  let content = '# Custom Types\\n';
  
  for (const [typeName, typeDef] of Object.entries(types)) {
    content += \`type $\{typeName} {\\n\`;
    
    for (const column of typeDef.columns || []) {
      const fieldType = formatFieldType(column);
      content += \`  $\{column.name}: $\{fieldType}\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}

function generateQueries(models: Record<string, any>): string {
  let content = '# Queries\\ntype Query {\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    
    // Get single item
    content += \`  $\{lowerName}(id: ID!): $\{modelName}\\n\`;
    
    // Get multiple items
    content += \`  $\{lowerName}s(limit: Int, offset: Int): [$\{modelName}]\\n\`;
  }
  
  content += '}\\n\\n';
  return content;
}

function generateMutations(models: Record<string, any>): string {
  let content = '# Mutations\\ntype Mutation {\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    
    // Create
    content += \`  create$\{modelName}(input: $\{modelName}Input!): $\{modelName}\\n\`;
    
    // Update
    content += \`  update$\{modelName}(id: ID!, input: $\{modelName}UpdateInput!): $\{modelName}\\n\`;
    
    // Delete
    content += \`  delete$\{modelName}(id: ID!): Boolean\\n\`;
  }
  
  content += '}\\n\\n';
  return content;
}

function generateSubscriptions(models: Record<string, any>): string {
  let content = '# Subscriptions\\ntype Subscription {\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    
    // Subscribe to changes
    content += \`  $\{lowerName}Created: $\{modelName}\\n\`;
    content += \`  $\{lowerName}Updated: $\{modelName}\\n\`;
    content += \`  $\{lowerName}Deleted: ID\\n\`;
  }
  
  content += '}\\n\\n';
  return content;
}`
]

const schemaConfigurationExample = [
  `plugin "./plugins/graphql-schema.js" {
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
}`
]

const basicSchemaExample = [
  `enum UserRole {
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
}`,
`# Custom Scalars
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
}`
]

const advancedFeaturesExample = [
  `// In your plugin configuration
customScalars: {
  Email: "String",
  URL: "String", 
  PhoneNumber: "String",
  BigInt: "String"
}`,
  `function handleRelationships(column: any, models: Record<string, any>): string {
  // Check if the column type is another model
  if (models[column.type]) {
    let type = column.type;
    
    if (column.multiple) {
      type = \`[\${type}]\`;
    }
    
    if (column.required) {
      type += '!';
    }
    
    return type;
  }
  
  return formatFieldType(column);
}`,
  `function generateDirectives(column: any): string {
  const directives: string[] = [];
  
  if (column.attributes?.unique) {
    directives.push('@unique');
  }
  
  if (column.attributes?.deprecated) {
    directives.push('@deprecated(reason: "Use alternative field")');
  }
  
  return directives.length > 0 ? \` \${directives.join(' ')}\` : '';
}`
]

const bestPracticesExample = [
  `interface GraphQLColumn {
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
}`,
  `function generateTypes(models: Record<string, any>): string {
  try {
    let content = '# Types\\n';
    
    for (const [modelName, model] of Object.entries(models)) {
      if (!model.columns || !Array.isArray(model.columns)) {
        console.warn(\`⚠️  Model \${modelName} has no valid columns\`);
        continue;
      }
      
      content += generateSingleType(modelName, model);
    }
    
    return content;
  } catch (error) {
    throw new Error(\`Failed to generate GraphQL types: \${error.message}\`);
  }
}`,
  `function validateConfig(config: any): asserts config is GraphQLConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('GraphQL plugin requires "output" configuration as string');
  }
  
  if (config.customScalars && typeof config.customScalars !== 'object') {
    throw new Error('customScalars must be an object');
  }
}`,
  `// Cache type mappings
const typeCache = new Map<string, string>();

function getCachedType(schemaType: string, customScalars: Record<string, string>): string {
  const cacheKey = \`\${schemaType}:\${JSON.stringify(customScalars)}\`;
  
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey)!;
  }
  
  const mappedType = mapSchemaTypeToGraphQL(schemaType, customScalars);
  typeCache.set(cacheKey, mappedType);
  
  return mappedType;
}`
]

const troubleshootingExample = [
  `function sanitizeGraphQLName(name: string): string {
  // GraphQL names must match /^[_A-Za-z][_0-9A-Za-z]*$/
  return name.replace(/[^_A-Za-z0-9]/g, '_').replace(/^[0-9]/, '_$&');
}`,
  `function detectCircularDependencies(models: Record<string, any>): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[] = [];
  
  // Implementation for cycle detection...
  
  return cycles;
}`,
  `function validateRequiredFields(model: any): void {
  if (!model.columns || model.columns.length === 0) {
    throw new Error(\`Model must have at least one column\`);
  }
}`,
  `const DEBUG = process.env.DEBUG === 'true';

function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(\`[GraphQL Plugin] \${message}\`, data || '');
  }
}`,
  `import { buildSchema } from 'graphql';

function validateGeneratedSchema(schemaContent: string): void {
  try {
    buildSchema(schemaContent);
    console.log('✅ Generated GraphQL schema is valid');
  } catch (error) {
    throw new Error(\`Invalid GraphQL schema: \${error.message}\`);
  }
}`
]

export function Body() {

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>GraphQL Schema Generator Plugin Tutorial</H1>
      <P>
        This tutorial demonstrates how to create a plugin that generates GraphQL type definitions from .idea schema files. The plugin will transform your schema models, types, and enums into proper GraphQL schema definitions.
      </P>

      <section id="1-introduction">
        <H2>1. Overview</H2>
        <P>
          GraphQL is a query language and runtime for APIs that provides a complete and understandable description of the data in your API. This plugin transforms your <C>.idea</C> schema definitions into comprehensive GraphQL type definitions that enable type-safe API development with excellent tooling support.
        </P>
        <P>This plugin generates GraphQL type definitions from your <C>.idea</C> schema, including:</P>
      </section>

      <section id="2-prerequisites">
        <H2>2. Prerequisites</H2>
        <P> Before implementing the GraphQL schema generator plugin, ensure you have the necessary development environment and knowledge. This section covers the essential requirements for successful plugin creation and GraphQL integration.</P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Node.js 16+ and npm/yarn</li>
          <li className="my-2">Basic understanding of GraphQL</li>
          <li className="my-2">Familiarity with the <C>@stackpress/idea-transformer</C> library</li>
          <li className="my-2">Understanding of <C>.idea</C> schema format</li>
        </ul>
      </section>

      <section id="3-setting-up-the-project">
        <H2>3. Plugin Structure</H2>
        <P>
          The plugin structure defines the core architecture and configuration interface for the GraphQL schema generator. This includes the main plugin function, configuration types, and the overall organization of the generated GraphQL schema definitions.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {pluginStructureExample[0]}
        </Code>
      </section>

      <section id="4-understanding-ts-morph-basics">
        <H2>4. Implementation</H2>
        <P>
          The implementation section covers the core plugin function and supporting utilities that handle GraphQL schema generation. This includes configuration validation, content generation, file writing, and error handling throughout the generation process.
        </P>

        <H3>4.1. Core Plugin Function</H3>
        <P>
          The core plugin function serves as the main entry point for GraphQL schema generation. It orchestrates the entire process from configuration validation through content generation to file output, ensuring proper error handling and logging throughout.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {corePluginFunctionExample[0]}
        </Code>

        <H3>4.2. Type Mapping Functions</H3>
        <P>
          Type mapping functions handle the conversion of <C>.idea</C> schema types to their GraphQL equivalents. These functions ensure proper type safety and handle complex scenarios like arrays, required fields, and custom scalar types.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {corePluginFunctionExample[1]}
        </Code>

        <H3>4.3. Schema Generation Functions</H3>
        <P>Schema generation functions create specific parts of the GraphQL schema including custom scalars, enums, types, input types, and root operation types. These functions handle proper GraphQL syntax construction and type relationships.</P>

        <Code copy language='typescript' className='bg-black text-white'>
          {corePluginFunctionExample[2]}
        </Code>
      </section>

      <section id="5-creating-your-first-plugin">
        <H2>5. Schema Configuration</H2>
        <P>
          Schema configuration demonstrates how to integrate the GraphQL schema generator into your <C>.idea</C> schema files. This section covers plugin configuration options and their effects on the generated GraphQL schema definitions.
        </P>

        <P>Add the GraphQL plugin to your <C>.idea</C> schema file:</P>

        <Code copy language='idea' className='bg-black text-white'>
          {schemaConfigurationExample[0]}
        </Code>

        <H2>Configuration Options</H2>
        <P>Configuration options control how GraphQL schema definitions are generated, including operation types, input generation, and custom scalar handling. Understanding these options helps you customize the plugin to meet your specific GraphQL requirements.</P>

        <Table className="text-left">
          <Thead className="theme-bg-bg2 text-left">Option</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Default</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>output</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>Required</Tcol>
            <Tcol>Output file path for the GraphQL schema</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>includeQueries</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>false</C></Tcol>  
            <Tcol>Generate Query type with CRUD operations</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>includeMutations</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>false</C></Tcol>
            <Tcol>Generate Mutation type with CRUD operations</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>includeSubscriptions</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>false</C></Tcol>
            <Tcol>Generate Subscription type for real-time updates</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>generateInputTypes</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>true</C></Tcol>
            <Tcol>Generate input types for mutations</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>customScalars</C></Tcol>
            <Tcol><C>object</C></Tcol>
            <Tcol><C>&#123;&#125;</C></Tcol>
            <Tcol>Custom scalar type mappings.</Tcol>
          </Trow>
        </Table>
      </section>

      <section id="6-advanced-ts-morph-features">
      <H1>Usage Examples</H1>
      <P>
        Usage examples demonstrate practical applications of the GraphQL schema generator with real-world scenarios. These examples show how to configure the plugin for different use cases and how the generated GraphQL schemas integrate into development workflows.
      </P>

      <H2>6.1. Basic Schema</H2>
      <P>
        A basic schema example shows the fundamental structure needed to generate GraphQL type definitions. This includes model definitions with proper attributes, enum declarations, and plugin configuration that produces comprehensive GraphQL schemas.
      </P>

      <Code copy language='idea' className='bg-black text-white'>
        {basicSchemaExample[0]}
      </Code>

      <H2>6.2. Generated Output</H2>
      <P>
      The generated output demonstrates the GraphQL schema produced by the plugin from the basic schema example. This shows how schema definitions are transformed into proper GraphQL type definitions with full type safety and operation support.
      </P>

      <Code copy language='graphql' className='bg-black text-white'>
        {basicSchemaExample[1]}
      </Code>
     
      </section>

      <section id="7-advanced-features">
        <H2>7. Advanced Features</H2>
        <P>
          Advanced features extend the basic GraphQL schema generation with sophisticated type handling, relationship management, directive support, and custom scalar types. These features enable production-ready GraphQL schemas that handle complex requirements.
        </P>

        <H3>7.1. Custom Scalar Types</H3>
        <P>
          Custom scalar types allow you to define specialized data types that map to specific validation or formatting requirements. This feature enables the creation of domain-specific types that enhance type safety and API clarity.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {advancedFeaturesExample[0]}
        </Code>

        <H3>7.2. Relationship Handling</H3>
        <P>
          Relationship handling manages references between different types and models in your schema. This ensures that type relationships are properly represented in the generated GraphQL schema with correct type references and nullability handling.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {advancedFeaturesExample[1]}
        </Code>

        <H3>7.3. Directive Support</H3>
        <P>
          Directive support enables the addition of GraphQL directives to fields and types, providing metadata and behavior hints for GraphQL servers and tools. This feature enhances schema expressiveness and enables advanced GraphQL features.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {advancedFeaturesExample[2]}
        </Code>
      </section>

      <section id="8-best-practices">
        <H2>8. Best Practices</H2>
        <P>
          Best practices ensure your generated GraphQL schemas are maintainable, performant, and follow GraphQL conventions. These guidelines cover type safety, error handling, configuration validation, and performance optimization.
        </P>

        <H3>8.1. Type Safety</H3>
        <P>
          Type safety is crucial for preventing runtime errors and ensuring reliable GraphQL schema generation. Always validate input data and use proper TypeScript types throughout the plugin implementation to ensure consistent output.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {bestPracticesExample[0]}
        </Code>

        <H3>8.2. Error Handling</H3>
        <P>
          Proper error handling ensures that schema generation failures provide clear, actionable feedback to developers. Implement comprehensive error handling patterns and meaningful error messages to improve the debugging experience.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {bestPracticesExample[1]}
        </Code>

        <H3>8.3. Configuration Validation</H3>
        <P>
          Configuration validation ensures that plugin settings are correct and complete before schema generation begins. This prevents runtime errors and provides early feedback about configuration issues.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {bestPracticesExample[2]}
        </Code>

        <H3>8.4. Performance Optimization</H3>
        <P>
          Performance optimization techniques help maintain reasonable generation times when working with large schemas. Implement caching strategies and efficient algorithms to ensure the plugin scales well with complex type hierarchies.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {bestPracticesExample[3]}
        </Code>
      </section>

      <section id="9-troubleshooting">
        <H2>9. Troubleshooting</H2>
        <P>
          This section addresses common issues encountered when generating GraphQL schemas and provides solutions for debugging and resolving problems. Understanding these troubleshooting techniques helps ensure reliable schema generation.
        </P>

        <H3>9.1. Common Issues</H3>
        <P>
          Common issues include invalid GraphQL identifiers, circular dependencies, and missing required fields. These problems typically arise from schema complexity or naming conflicts that can be resolved with proper validation and sanitization.
        </P>

        <H3>9.1.1. Invalid GraphQL Names</H3>
        <P>
          Invalid GraphQL names occur when schema identifiers contain characters that are not valid in GraphQL. The plugin should validate and sanitize names to ensure they conform to GraphQL naming conventions.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {troubleshootingExample[0]}
        </Code>

        <H3>9.1.2. Circular Dependencies</H3>
        <P>
          Circular dependencies can cause infinite loops during generation or invalid GraphQL schemas. Detecting and handling these scenarios is essential for robust schema generation, especially with complex type relationships.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {troubleshootingExample[1]}
        </Code>

        <H3>9.1.3. Missing Required Fields</H3>
        <P>
          Missing required fields can result in invalid GraphQL types that fail validation. Ensure all models have proper field definitions and handle edge cases where schema definitions might be incomplete.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {troubleshootingExample[2]}
        </Code>

        <H3>9.2. Debugging Tips</H3>
        <P>
          Debugging tips help identify and resolve issues during GraphQL schema generation. These techniques provide visibility into the generation process and help diagnose problems with schema logic or output formatting.
        </P>

        <H3>9.2.1. Enable Verbose Logging</H3>
        <P>
          Verbose logging provides detailed information about the schema generation process, helping identify where issues occur and what data is being processed at each step.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {troubleshootingExample[3]}
        </Code>

        <H3>9.2.2. Validate Generated Schema</H3>
        <P>
          Validating the generated GraphQL schema ensures that the output is syntactically correct and will work with GraphQL servers and tools. This validation step catches generation errors before deployment.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {troubleshootingExample[4]}
        </Code>

        <P>
          This tutorial provides a comprehensive foundation for creating GraphQL schema generators from .idea files. The generated schemas can be used with any GraphQL server implementation like Apollo Server, GraphQL Yoga, or others.
        </P>
      </section>
      


      <Nav
        prev={{ text: 'TS Morph Plugin Guide', href: '/docs/tutorials/tsmorph-plugin-guide' }}
        next={{ text: 'HTML Form Plugin Tutorial', href: '/docs/tutorials/html-form-plugin' }}
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
