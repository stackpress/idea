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

interface APIClientConfig {
  output: string;
  clientType: 'rest' | 'graphql' | 'both';
  httpLibrary?: 'fetch' | 'axios';
  baseUrl?: string;
  authentication?: {
    type: 'bearer' | 'apikey' | 'basic' | 'custom';
    headerName?: string;
  };
  generateTypes?: boolean;
  includeValidation?: boolean;
  errorHandling?: 'throw' | 'return' | 'callback';
}

export default async function generateAPIClient(
  props: PluginProps<{ config: APIClientConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}`,
  `export default async function generateAPIClient(
  props: PluginProps<{ config: APIClientConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate client content
    let content = '';
    
    // Add file header and imports
    content += generateFileHeader(config);
    content += generateImports(config);
    
    // Generate types if requested
    if (config.generateTypes) {
      content += generateTypes(schema, config);
    }
    
    // Generate base client class
    content += generateBaseClient(config);
    
    // Generate model-specific clients
    if (schema.model) {
      if (config.clientType === 'rest' || config.clientType === 'both') {
        content += generateRESTClients(schema.model, config);
      }
      
      if (config.clientType === 'graphql' || config.clientType === 'both') {
        content += generateGraphQLClients(schema.model, config);
      }
    }
    
    // Generate main client export
    content += generateMainClient(schema, config);
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(\`✅ API client generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ API client generation failed:', error.message);
    throw error;
  }
}`,
  `function generateFileHeader(config: APIClientConfig): string {
  const timestamp = new Date().toISOString();
  return \`/**
 * Generated API Client
 * Generated at: \${timestamp}
 * Client Type: \${config.clientType}
 * HTTP Library: \${config.httpLibrary || 'fetch'}
 * 
 * This file is auto-generated. Do not edit manually.
 */

\`;
}

function generateImports(config: APIClientConfig): string {
  let imports = '';
  
  if (config.httpLibrary === 'axios') {
    imports += \`import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';\\n\`;
  }
  
  if (config.clientType === 'graphql' || config.clientType === 'both') {
    imports += \`import { ApolloClient, InMemoryCache, gql, DocumentNode } from '@apollo/client';\\n\`;
  }
  
  imports += \`
// Base types
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> extends APIResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

\`;
  
  return imports;
}`,
  `function generateTypes(schema: any, config: APIClientConfig): string {
  let content = '// Generated Types\\n';
  
  // Generate enums
  if (schema.enum) {
    for (const [enumName, enumDef] of Object.entries(schema.enum)) {
      content += \`export enum \${enumName} {\\n\`;
      for (const [key, value] of Object.entries(enumDef)) {
        content += \`  \${key} = "\${value}",\\n\`;
      }
      content += '}\\n\\n';
    }
  }
  
  // Generate interfaces
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      content += \`export interface \${modelName} {\\n\`;
      for (const column of model.columns || []) {
        const optional = !column.required ? '?' : '';
        const type = mapTypeToTypeScript(column.type);
        content += \`  \${column.name}\${optional}: \${type};\\n\`;
      }
      content += '}\\n\\n';
      
      // Generate input types
      const autoFields = model.columns
        ?.filter((col: any) => col.attributes?.id || col.attributes?.default)
        .map((col: any) => \`'\${col.name}'\`)
        .join(' | ');
      
      if (autoFields) {
        content += \`export type Create\${modelName}Input = Omit<\${modelName}, \${autoFields}>;\\n\`;
      } else {
        content += \`export type Create\${modelName}Input = \${modelName};\\n\`;
      }
      
      content += \`export type Update\${modelName}Input = Partial<\${modelName}>;\\n\\n\`;
    }
  }
  
  return content;
}`,
  `function generateBaseClient(config: APIClientConfig): string {
  const authType = config.authentication?.type || 'bearer';
  const headerName = config.authentication?.headerName || 'Authorization';
  
  return \`
// Base Client Class
export class BaseAPIClient {
  private baseUrl: string;
  private authToken?: string;
  \${config.httpLibrary === 'axios' ? 'private axiosInstance: AxiosInstance;' : ''}

  constructor(baseUrl: string = '\${config.baseUrl || '/api'}') {
    this.baseUrl = baseUrl.replace(/\\/$/, '');
    \${config.httpLibrary === 'axios' ? generateAxiosSetup() : ''}
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private getAuthHeaders(): Record<string, string> {
    if (!this.authToken) return {};
    
    \${generateAuthHeaders(authType, headerName)}
  }

  \${config.httpLibrary === 'axios' ? generateAxiosMethods() : generateFetchMethods()}
}

\`;
}`,
  `function generateRESTClients(models: Record<string, any>, config: APIClientConfig): string {
  let content = '// REST API Clients\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    const pluralName = \`\${lowerName}s\`;
    
    content += \`
export class \${modelName}Client extends BaseAPIClient {
  // Get all \${pluralName}
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }, options?: RequestOptions): Promise<PaginatedResponse<\${modelName}>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sort) queryParams.set('sort', params.sort);
    
    const query = queryParams.toString();
    const url = \\\`/\${pluralName}\\\${query ? \\\`?\\\${query}\\\` : ''}\\\`;
    
    return this.get<\${modelName}[]>(url, options) as Promise<PaginatedResponse<\${modelName}>>;
  }

  // Get single \${lowerName} by ID
  async getById(id: string, options?: RequestOptions): Promise<APIResponse<\${modelName}>> {
    return this.get<\${modelName}>(\\\`/\${pluralName}/\\\${id}\\\`, options);
  }

  // Create new \${lowerName}
  async create(data: Create\${modelName}Input, options?: RequestOptions): Promise<APIResponse<\${modelName}>> {
    return this.post<\${modelName}>(\\\`/\${pluralName}\\\`, data, options);
  }

  // Update existing \${lowerName}
  async update(id: string, data: Update\${modelName}Input, options?: RequestOptions): Promise<APIResponse<\${modelName}>> {
    return this.put<\${modelName}>(\\\`/\${pluralName}/\\\${id}\\\`, data, options);
  }

  // Delete \${lowerName}
  async delete(id: string, options?: RequestOptions): Promise<APIResponse<boolean>> {
    return this.delete<boolean>(\\\`/\${pluralName}/\\\${id}\\\`, options);
  }
}
\`;
  }
  
  return content;
}`,
  `function generateGraphQLClients(models: Record<string, any>, config: APIClientConfig): string {
  let content = '// GraphQL API Clients\\n';
  
  content += \`
export class GraphQLClient extends BaseAPIClient {
  private apolloClient: ApolloClient<any>;

  constructor(baseUrl: string = '\${config.baseUrl || '/graphql'}') {
    super(baseUrl);
    this.apolloClient = new ApolloClient({
      uri: this.baseUrl,
      cache: new InMemoryCache(),
    });
  }

  private async executeQuery<T>(query: DocumentNode, variables?: any): Promise<APIResponse<T>> {
    try {
      const result = await this.apolloClient.query({
        query,
        variables,
      });
      return { success: true, data: result.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'GraphQL query failed',
      };
    }
  }

  private async executeMutation<T>(mutation: DocumentNode, variables?: any): Promise<APIResponse<T>> {
    try {
      const result = await this.apolloClient.mutate({
        mutation,
        variables,
      });
      return { success: true, data: result.data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'GraphQL mutation failed',
      };
    }
  }
\`;

  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    const pluralName = \`\${lowerName}s\`;
    
    content += \`
  // \${modelName} GraphQL operations
  async get\${pluralName}(variables?: { limit?: number; offset?: number }): Promise<APIResponse<\${modelName}[]>> {
    const query = gql\\\`
      query Get\${pluralName}($limit: Int, $offset: Int) {
        \${pluralName}(limit: $limit, offset: $offset) {
          \${generateGraphQLFields(model)}
        }
      }
    \\\`;
    return this.executeQuery<\${modelName}[]>(query, variables);
  }

  async get\${modelName}(id: string): Promise<APIResponse<\${modelName}>> {
    const query = gql\\\`
      query Get\${modelName}($id: ID!) {
        \${lowerName}(id: $id) {
          \${generateGraphQLFields(model)}
        }
      }
    \\\`;
    return this.executeQuery<\${modelName}>(query, { id });
  }

  async create\${modelName}(input: Create\${modelName}Input): Promise<APIResponse<\${modelName}>> {
    const mutation = gql\\\`
      mutation Create\${modelName}($input: \${modelName}Input!) {
        create\${modelName}(input: $input) {
          \${generateGraphQLFields(model)}
        }
      }
    \\\`;
    return this.executeMutation<\${modelName}>(mutation, { input });
  }

  async update\${modelName}(id: string, input: Update\${modelName}Input): Promise<APIResponse<\${modelName}>> {
    const mutation = gql\\\`
      mutation Update\${modelName}($id: ID!, $input: \${modelName}UpdateInput!) {
        update\${modelName}(id: $id, input: $input) {
          \${generateGraphQLFields(model)}
        }
      }
    \\\`;
    return this.executeMutation<\${modelName}>(mutation, { id, input });
  }

  async delete\${modelName}(id: string): Promise<APIResponse<boolean>> {
    const mutation = gql\\\`
      mutation Delete\${modelName}($id: ID!) {
        delete\${modelName}(id: $id)
      }
    \\\`;
    return this.executeMutation<boolean>(mutation, { id });
  }
\`;
  }
  
  content += '}\\n';
  return content;
}`,
  `plugin "./plugins/api-client.js" {
  output "./generated/api-client.ts"
  clientType "rest"
  httpLibrary "fetch"
  baseUrl "/api/v1"
  authentication {
    type "bearer"
    headerName "Authorization"
  }
  generateTypes true
  includeValidation false
  errorHandling "return"
}`,
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

model Post {
  id String @id @default("nanoid()")
  title String @required
  content String @required
  authorId String @required
  published Boolean @default(false)
  createdAt Date @default("now()")
}

plugin "./plugins/api-client.js" {
  output "./api-client.ts"
  clientType "rest"
  httpLibrary "fetch"
  baseUrl "/api/v1"
  generateTypes true
}`,
  `import APIClient from './api-client';

// Initialize client
const client = new APIClient('https://api.example.com');

// Set authentication token
client.setAuthToken('your-jwt-token');

// Use the client
async function example() {
  // Get all users with pagination
  const usersResponse = await client.user.getAll({
    page: 1,
    limit: 10,
    search: 'john'
  });
  
  if (usersResponse.success) {
    console.log('Users:', usersResponse.data);
    console.log('Total:', usersResponse.total);
  }
  
  // Get user by ID
  const userResponse = await client.user.getById('user-123');
  
  if (userResponse.success) {
    console.log('User:', userResponse.data);
  }
  
  // Create new user
  const newUserResponse = await client.user.create({
    email: 'john@example.com',
    name: 'John Doe',
    role: UserRole.USER
  });
  
  if (newUserResponse.success) {
    console.log('Created user:', newUserResponse.data);
  }
  
  // Update user
  const updateResponse = await client.user.update('user-123', {
    name: 'John Smith'
  });
  
  // Delete user
  const deleteResponse = await client.user.delete('user-123');
}`,
  `// Bearer token authentication
authentication: {
  type: "bearer",
  headerName: "Authorization"
}

// API key authentication
authentication: {
  type: "apikey",
  headerName: "X-API-Key"
}

// Basic authentication
authentication: {
  type: "basic",
  headerName: "Authorization"
}

// Custom authentication
authentication: {
  type: "custom",
  headerName: "X-Custom-Auth"
}`,
  `// Return errors in response (default)
errorHandling: "return"
const response = await client.user.getById('123');
if (!response.success) {
  console.error(response.error);
}

// Throw errors as exceptions
errorHandling: "throw"
try {
  const user = await client.user.getById('123');
} catch (error) {
  console.error(error.message);
}

// Use callback for error handling
errorHandling: "callback"
const response = await client.user.getById('123', {
  onError: (error) => console.error(error)
});`,
  `// Using AbortController for request cancellation
const controller = new AbortController();

const response = await client.user.getAll({}, {
  signal: controller.signal
});

// Cancel the request
controller.abort();`,
  `// Add custom headers to requests
const response = await client.user.getById('123', {
  headers: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US'
  }
});`,
  `// Always use generated types
interface UserWithPosts extends User {
  posts: Post[];
}

// Type-safe error handling
function handleUserResponse(response: APIResponse<User>) {
  if (response.success) {
    // TypeScript knows response.data is User
    console.log(response.data.email);
  } else {
    // TypeScript knows response.error exists
    console.error(response.error);
  }
}`,
  `// Centralized error handling
class APIErrorHandler {
  static handle(response: APIResponse<any>) {
    if (!response.success) {
      if (response.errors) {
        // Handle validation errors
        Object.entries(response.errors).forEach(([field, messages]) => {
          console.error(\`\${field}: \${messages.join(', ')}\`);
        });
      } else {
        // Handle general errors
        console.error(response.error);
      }
    }
  }
}

// Usage
const response = await client.user.create(userData);
APIErrorHandler.handle(response);`,
  `// Extend base client for custom behavior
class CustomAPIClient extends APIClient {
  constructor(baseUrl?: string) {
    super(baseUrl);
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Add request logging
    const originalRequest = this.request;
    this.request = async (method, url, data, options) => {
      console.log(\`\${method} \${url}\`, data);
      return originalRequest.call(this, method, url, data, options);
    };
  }
}`,
  `// Simple in-memory cache
class CachedAPIClient extends APIClient {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  async getCached<T>(key: string, fetcher: () => Promise<APIResponse<T>>): Promise<APIResponse<T>> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return { success: true, data: cached.data };
    }
    
    const response = await fetcher();
    
    if (response.success) {
      this.cache.set(key, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response;
  }
}`,
  `// Ensure your API server allows CORS
// Add appropriate headers in your API configuration

// For development, you might need to proxy requests
const client = new APIClient('/api/proxy');`,
  `// Check token format and expiration
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Refresh token automatically
client.setAuthToken(await refreshToken());`,
  `// Implement retry logic
async function withRetry<T>(
  operation: () => Promise<APIResponse<T>>,
  maxRetries: number = 3
): Promise<APIResponse<T>> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await operation();
      if (result.success) return result;
      
      if (i === maxRetries - 1) return result;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}`,
  `// Add to base client
private logRequest(method: string, url: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(\`API \${method} \${url}\`);
    if (data) console.log('Data:', data);
    console.groupEnd();
  }
}`,
  `// Validate response structure
function validateResponse<T>(response: any): response is APIResponse<T> {
  return (
    typeof response === 'object' &&
    typeof response.success === 'boolean' &&
    (response.success ? 'data' in response : 'error' in response)
  );
}`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('API Client Generator Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates REST and GraphQL API clients from .idea schema files'
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
      <H1>API Client Generator Plugin Tutorial</H1>
      <P>
        This tutorial demonstrates how to create a plugin that generates REST and GraphQL API clients from <C>.idea</C> schema files. The plugin will transform your schema models into type-safe API client libraries with full CRUD operations.
      </P>

      <section id="1-overview">
        <H2>1. Overview</H2>
        <P>
          API clients provide a convenient interface for interacting with backend services. This plugin generates type-safe API clients from your <C>.idea</C> schema, including:
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2"><SS>REST Clients</SS>: HTTP-based API clients with fetch/axios</li>
          <li className="my-2"><SS>GraphQL Clients</SS>: Apollo Client or custom GraphQL clients</li>
          <li className="my-2"><SS>Type Safety</SS>: Full TypeScript support with generated types</li>
          <li className="my-2"><SS>CRUD Operations</SS>: Create, Read, Update, Delete methods</li>
          <li className="my-2"><SS>Authentication</SS>: Built-in auth handling</li>
          <li className="my-2"><SS>Error Handling</SS>: Comprehensive error management</li>
        </ul>
      </section>

      <section id="2-prerequisites">
        <H2>2. Prerequisites</H2>
        <P>
          Before implementing the API client generator plugin, ensure you have the necessary development environment and dependencies. This section covers the essential requirements and setup needed to successfully create and use the plugin.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Node.js 16+ and npm/yarn</li>
          <li className="my-2">TypeScript 4.0+</li>
          <li className="my-2">Basic understanding of REST and GraphQL APIs</li>
          <li className="my-2">Familiarity with the <C>@stackpress/idea-transformer</C> library</li>
          <li className="my-2">Understanding of <C>.idea</C> schema format</li>
        </ul>
      </section>

      <section id="3-plugin-structure">
        <H2>3. Plugin Structure</H2>
        <P>
          The plugin structure defines the core architecture and configuration interface for the API client generator. This includes the main plugin function, configuration types, and the overall organization of the generated client code.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </section>

      <section id="4-implementation">
        <H2>4. Implementation</H2>
        <P>
          The implementation section covers the core plugin function and supporting utilities that handle API client generation. This includes configuration validation, content generation, file writing, and error handling throughout the generation process.
        </P>

        <H3>4.1. Core Plugin Function</H3>
        <P>
          The core plugin function serves as the main entry point for API client generation. It orchestrates the entire process from configuration validation through content generation to file output, ensuring proper error handling and logging throughout.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H3>4.2. Generation Functions</H3>
        <P>
          The generation functions handle the creation of specific parts of the API client code. These utility functions generate file headers, imports, type definitions, base client classes, and model-specific client methods, ensuring consistent code structure and proper TypeScript typing.
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
        <P>Add the API Client plugin to your <C>.idea</C> schema file:</P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <H3>Configuration Options</H3>

        <Table className="text-left">
          <Thead className='theme-bg-bg2'>Option</Thead>
          <Thead className='theme-bg-bg2'>Type</Thead>
          <Thead className='theme-bg-bg2'>Default</Thead>
          <Thead className='theme-bg-bg2'>Description</Thead>
          <Trow>
            <Tcol><C>output</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol><SS>Required</SS></Tcol>
            <Tcol>Output file path for the API client</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>clientType</C></Tcol>
            <Tcol><C>'rest'|'graphql'|'both'</C></Tcol>
            <Tcol><SS>Required</SS></Tcol>
            <Tcol>Type of client to generate</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>httpLibrary</C></Tcol>
            <Tcol><C>'fetch'|'axios'</C></Tcol>
            <Tcol><C>'fetch'</C></Tcol>
            <Tcol>HTTP library to use</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>baseUrl</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol><C>'/api'</C></Tcol>
            <Tcol>Base URL for API requests</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>authentication</C></Tcol>
            <Tcol><C>object</C></Tcol>
            <Tcol><C>undefined</C></Tcol>
            <Tcol>Authentication configuration</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>generateTypes</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>true</C></Tcol>
            <Tcol>Generate TypeScript types</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>includeValidation</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol><C>false</C></Tcol>
            <Tcol>Include request validation</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>errorHandling</C></Tcol>
            <Tcol><C>'throw'|'return'|'callback'</C></Tcol>
            <Tcol><C>'return'</C></Tcol>
            <Tcol>Error handling strategy</Tcol>
          </Trow>
        </Table>
      </section>

      <section id="6-usage-examples">
        <H2>6. Usage Examples</H2>
        <P>
          This section demonstrates practical usage of the API client generator plugin with real-world examples. The examples show how to configure the plugin in schema files and how to use the generated client code in applications.
        </P>

        <H3>6.1. Basic Schema</H3>
        <P>
          A basic schema example shows the fundamental structure needed to generate API clients. This includes model definitions with proper attributes, enum declarations, and plugin configuration that produces a functional REST API client.
        </P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[8]}
        </Code>

        <H3>6.2. Generated Client Usage</H3>
        <P>
          The generated client provides a type-safe interface for interacting with your API endpoints. This example demonstrates how to initialize the client, set authentication, and perform common CRUD operations with proper error handling and TypeScript support.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[9]}
        </Code>
      </section>

      <section id="7-advanced-features">
        <H2>7. Advanced Features</H2>
        <P>
          Advanced features extend the basic API client functionality with sophisticated authentication, error handling, request management, and customization options. These features enable production-ready API clients that can handle complex scenarios and enterprise requirements.
        </P>

        <H3>7.1. Authentication Strategies</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H3>7.2. Error Handling Strategies</H3>
        <P>
          Error handling strategies determine how the API client responds to and manages different types of errors. The plugin supports multiple approaches including returning errors in responses, throwing exceptions, and using callback functions for flexible error management.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <H3>7.3. Request Cancellation</H3>
        <P>
          Request cancellation allows you to abort ongoing API requests when they are no longer needed. This is essential for preventing unnecessary network traffic and improving application performance, especially in scenarios with user navigation or component unmounting.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <H3>7.4. Custom Headers</H3>
        <P>
          Custom headers enable you to add additional metadata to API requests for features like localization, custom authentication, tracking, or API versioning. The client supports both global and per-request header configuration.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[13]}
        </Code>
      </section>

      <section id="8-best-practices">
        <H2>8. Best Practices</H2>
        <P>
          Best practices ensure your API client implementation is maintainable, reliable, and follows industry standards. These guidelines cover type safety, error handling, performance optimization, and code organization for production-ready applications.
        </P>

        <H3>8.1. Type Safety</H3>
        <P>
          Type safety is crucial for preventing runtime errors and improving developer experience. Always use the generated TypeScript types and interfaces to ensure compile-time validation and better IDE support with autocomplete and error detection.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[14]}
        </Code>

        <H3>8.2. Error Handling</H3>
        <P>
          Proper error handling ensures your application can gracefully handle API failures, validation errors, and network issues. Implement centralized error handling patterns and provide meaningful feedback to users while logging appropriate details for debugging.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[15]}
        </Code>

        <H3>8.3. Request Interceptors</H3>
        <P>
          Request interceptors allow you to modify requests before they are sent or responses before they are processed. This is useful for adding logging, authentication tokens, request transformation, or implementing cross-cutting concerns like analytics.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H3>8.4. Caching Strategy</H3>
        <P>
          Implementing a caching strategy reduces unnecessary API calls and improves application performance. Consider caching frequently accessed data with appropriate expiration times and cache invalidation strategies for data consistency.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[17]}
        </Code>
      </section>

      <section id="9-troubleshooting">
        <H2>9. Troubleshooting</H2>
        <P>
          This section addresses common issues and debugging techniques when working with the generated API clients. Understanding these solutions helps resolve typical problems encountered during development and deployment.
        </P>

        <H3>9.1. Common Issues</H3>
        <P>
          Common issues include CORS errors, authentication failures, and network timeouts. These problems often arise from configuration mismatches, expired tokens, or network connectivity issues that can be resolved with proper debugging and configuration.
        </P>

        <P><strong>1. CORS Errors</strong></P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[18]}
        </Code>

        <P><strong>2. Authentication Failures</strong></P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[19]}
        </Code>

        <P><strong>3. Network Timeouts</strong></P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[20]}
        </Code>

        <H3>9.2. Debugging Tips</H3>
        <P>
          Debugging tips help identify and resolve issues during development and production. These techniques include request logging, response validation, and monitoring tools that provide visibility into API client behavior and performance.
        </P>

        <P><strong>1. Enable Request Logging</strong></P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[21]}
        </Code>

        <P><strong>2. Response Validation</strong></P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[22]}
        </Code>
      </section>

      <section id="conclusion">
        <P>
          This tutorial provides a comprehensive foundation for creating API clients from <C>.idea</C> files. The generated clients provide type-safe, feature-rich interfaces for interacting with REST and GraphQL APIs.
        </P>
      </section>

      <Nav
        prev={{ text: 'TypeScript Interface Plugin', href: '/docs/tutorials/typescript-interface-plugin' }}
        next={{ text: 'Validation Plugin', href: '/docs/tutorials/validation-plugin' }}
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
