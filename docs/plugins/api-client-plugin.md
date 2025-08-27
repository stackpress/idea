# API Client Generator Plugin Tutorial

This tutorial demonstrates how to create a plugin that generates REST and GraphQL API clients from `.idea` schema files. The plugin will transform your schema models into type-safe API client libraries with full CRUD operations.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Plugin Structure](#plugin-structure)
4. [Implementation](#implementation)
5. [Schema Configuration](#schema-configuration)
6. [Usage Examples](#usage-examples)
7. [Advanced Features](#advanced-features)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

API clients provide a convenient interface for interacting with backend services. This plugin generates type-safe API clients from your `.idea` schema, including:

- **REST Clients**: HTTP-based API clients with fetch/axios
- **GraphQL Clients**: Apollo Client or custom GraphQL clients
- **Type Safety**: Full TypeScript support with generated types
- **CRUD Operations**: Create, Read, Update, Delete methods
- **Authentication**: Built-in auth handling
- **Error Handling**: Comprehensive error management

## Prerequisites

- Node.js 16+ and npm/yarn
- TypeScript 4.0+
- Basic understanding of REST and GraphQL APIs
- Familiarity with the `@stackpress/idea-transformer` library
- Understanding of `.idea` schema format

## Plugin Structure

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
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
}
```

## Implementation

### Core Plugin Function

```typescript
export default async function generateAPIClient(
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
    
    console.log(`✅ API client generated: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ API client generation failed:', error.message);
    throw error;
  }
}
```

### Generation Functions

```typescript
function generateFileHeader(config: APIClientConfig): string {
  const timestamp = new Date().toISOString();
  return `/**
 * Generated API Client
 * Generated at: ${timestamp}
 * Client Type: ${config.clientType}
 * HTTP Library: ${config.httpLibrary || 'fetch'}
 * 
 * This file is auto-generated. Do not edit manually.
 */

`;
}

function generateImports(config: APIClientConfig): string {
  let imports = '';
  
  if (config.httpLibrary === 'axios') {
    imports += `import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';\n`;
  }
  
  if (config.clientType === 'graphql' || config.clientType === 'both') {
    imports += `import { ApolloClient, InMemoryCache, gql, DocumentNode } from '@apollo/client';\n`;
  }
  
  imports += `
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

`;
  
  return imports;
}

function generateTypes(schema: any, config: APIClientConfig): string {
  let content = '// Generated Types\n';
  
  // Generate enums
  if (schema.enum) {
    for (const [enumName, enumDef] of Object.entries(schema.enum)) {
      content += `export enum ${enumName} {\n`;
      for (const [key, value] of Object.entries(enumDef)) {
        content += `  ${key} = "${value}",\n`;
      }
      content += '}\n\n';
    }
  }
  
  // Generate interfaces
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      content += `export interface ${modelName} {\n`;
      for (const column of model.columns || []) {
        const optional = !column.required ? '?' : '';
        const type = mapTypeToTypeScript(column.type);
        content += `  ${column.name}${optional}: ${type};\n`;
      }
      content += '}\n\n';
      
      // Generate input types
      const autoFields = model.columns
        ?.filter((col: any) => col.attributes?.id || col.attributes?.default)
        .map((col: any) => `'${col.name}'`)
        .join(' | ');
      
      if (autoFields) {
        content += `export type Create${modelName}Input = Omit<${modelName}, ${autoFields}>;\n`;
      } else {
        content += `export type Create${modelName}Input = ${modelName};\n`;
      }
      
      content += `export type Update${modelName}Input = Partial<${modelName}>;\n\n`;
    }
  }
  
  return content;
}

function generateBaseClient(config: APIClientConfig): string {
  const authType = config.authentication?.type || 'bearer';
  const headerName = config.authentication?.headerName || 'Authorization';
  
  return `
// Base Client Class
export class BaseAPIClient {
  private baseUrl: string;
  private authToken?: string;
  ${config.httpLibrary === 'axios' ? 'private axiosInstance: AxiosInstance;' : ''}

  constructor(baseUrl: string = '${config.baseUrl || '/api'}') {
    this.baseUrl = baseUrl.replace(/\\/$/, '');
    ${config.httpLibrary === 'axios' ? this.generateAxiosSetup() : ''}
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private getAuthHeaders(): Record<string, string> {
    if (!this.authToken) return {};
    
    ${this.generateAuthHeaders(authType, headerName)}
  }

  ${config.httpLibrary === 'axios' ? this.generateAxiosMethods() : this.generateFetchMethods()}
}

`;
}

function generateAxiosSetup(): string {
  return `
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
    
    // Request interceptor for auth
    this.axiosInstance.interceptors.request.use((config) => {
      const authHeaders = this.getAuthHeaders();
      config.headers = { ...config.headers, ...authHeaders };
      return config;
    });
    
    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        throw this.handleError(error);
      }
    );`;
}

function generateAuthHeaders(authType: string, headerName: string): string {
  switch (authType) {
    case 'bearer':
      return `return { '${headerName}': \`Bearer \${this.authToken}\` };`;
    case 'apikey':
      return `return { '${headerName}': this.authToken };`;
    case 'basic':
      return `return { '${headerName}': \`Basic \${btoa(this.authToken)}\` };`;
    default:
      return `return { '${headerName}': this.authToken };`;
  }
}

function generateAxiosMethods(): string {
  return `
  protected async get<T>(url: string, options?: RequestOptions): Promise<APIResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url, {
        headers: options?.headers,
        signal: options?.signal,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async post<T>(url: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, {
        headers: options?.headers,
        signal: options?.signal,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async put<T>(url: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, {
        headers: options?.headers,
        signal: options?.signal,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async delete<T>(url: string, options?: RequestOptions): Promise<APIResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(url, {
        headers: options?.headers,
        signal: options?.signal,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): APIResponse {
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || error.message,
        errors: error.response.data?.errors,
      };
    }
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }`;
}

function generateFetchMethods(): string {
  return `
  protected async get<T>(url: string, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  protected async post<T>(url: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.request<T>('POST', url, data, options);
  }

  protected async put<T>(url: string, data?: any, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.request<T>('PUT', url, data, options);
  }

  protected async delete<T>(url: string, options?: RequestOptions): Promise<APIResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<APIResponse<T>> {
    try {
      const authHeaders = this.getAuthHeaders();
      const headers = {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers,
      };

      const response = await fetch(\`\${this.baseUrl}\${url}\`, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: options?.signal,
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || 'Request failed',
          errors: responseData.errors,
        };
      }

      return { success: true, data: responseData };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }`;
}

function generateRESTClients(models: Record<string, any>, config: APIClientConfig): string {
  let content = '// REST API Clients\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    const pluralName = `${lowerName}s`;
    
    content += `
export class ${modelName}Client extends BaseAPIClient {
  // Get all ${pluralName}
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }, options?: RequestOptions): Promise<PaginatedResponse<${modelName}>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sort) queryParams.set('sort', params.sort);
    
    const query = queryParams.toString();
    const url = \`/${pluralName}\${query ? \`?\${query}\` : ''}\`;
    
    return this.get<${modelName}[]>(url, options) as Promise<PaginatedResponse<${modelName}>>;
  }

  // Get single ${lowerName} by ID
  async getById(id: string, options?: RequestOptions): Promise<APIResponse<${modelName}>> {
    return this.get<${modelName}>(\`/${pluralName}/\${id}\`, options);
  }

  // Create new ${lowerName}
  async create(data: Create${modelName}Input, options?: RequestOptions): Promise<APIResponse<${modelName}>> {
    return this.post<${modelName}>(\`/${pluralName}\`, data, options);
  }

  // Update existing ${lowerName}
  async update(id: string, data: Update${modelName}Input, options?: RequestOptions): Promise<APIResponse<${modelName}>> {
    return this.put<${modelName}>(\`/${pluralName}/\${id}\`, data, options);
  }

  // Delete ${lowerName}
  async delete(id: string, options?: RequestOptions): Promise<APIResponse<boolean>> {
    return this.delete<boolean>(\`/${pluralName}/\${id}\`, options);
  }
}
`;
  }
  
  return content;
}

function generateGraphQLClients(models: Record<string, any>, config: APIClientConfig): string {
  let content = '// GraphQL API Clients\n';
  
  content += `
export class GraphQLClient extends BaseAPIClient {
  private apolloClient: ApolloClient<any>;

  constructor(baseUrl: string = '${config.baseUrl || '/graphql'}') {
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
`;

  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    const pluralName = `${lowerName}s`;
    
    content += `
  // ${modelName} GraphQL operations
  async get${pluralName}(variables?: { limit?: number; offset?: number }): Promise<APIResponse<${modelName}[]>> {
    const query = gql\`
      query Get${pluralName}($limit: Int, $offset: Int) {
        ${pluralName}(limit: $limit, offset: $offset) {
          ${generateGraphQLFields(model)}
        }
      }
    \`;
    return this.executeQuery<${modelName}[]>(query, variables);
  }

  async get${modelName}(id: string): Promise<APIResponse<${modelName}>> {
    const query = gql\`
      query Get${modelName}($id: ID!) {
        ${lowerName}(id: $id) {
          ${generateGraphQLFields(model)}
        }
      }
    \`;
    return this.executeQuery<${modelName}>(query, { id });
  }

  async create${modelName}(input: Create${modelName}Input): Promise<APIResponse<${modelName}>> {
    const mutation = gql\`
      mutation Create${modelName}($input: ${modelName}Input!) {
        create${modelName}(input: $input) {
          ${generateGraphQLFields(model)}
        }
      }
    \`;
    return this.executeMutation<${modelName}>(mutation, { input });
  }

  async update${modelName}(id: string, input: Update${modelName}Input): Promise<APIResponse<${modelName}>> {
    const mutation = gql\`
      mutation Update${modelName}($id: ID!, $input: ${modelName}UpdateInput!) {
        update${modelName}(id: $id, input: $input) {
          ${generateGraphQLFields(model)}
        }
      }
    \`;
    return this.executeMutation<${modelName}>(mutation, { id, input });
  }

  async delete${modelName}(id: string): Promise<APIResponse<boolean>> {
    const mutation = gql\`
      mutation Delete${modelName}($id: ID!) {
        delete${modelName}(id: $id)
      }
    \`;
    return this.executeMutation<boolean>(mutation, { id });
  }
`;
  }
  
  content += '}\n';
  return content;
}

function generateGraphQLFields(model: any): string {
  return model.columns?.map((col: any) => col.name).join('\n          ') || 'id';
}

function generateMainClient(schema: any, config: APIClientConfig): string {
  let content = '// Main API Client\n';
  
  content += `export class APIClient extends BaseAPIClient {\n`;
  
  if (schema.model) {
    for (const [modelName] of Object.entries(schema.model)) {
      const lowerName = modelName.toLowerCase();
      
      if (config.clientType === 'rest' || config.clientType === 'both') {
        content += `  public ${lowerName}: ${modelName}Client;\n`;
      }
    }
    
    if (config.clientType === 'graphql' || config.clientType === 'both') {
      content += `  public graphql: GraphQLClient;\n`;
    }
  }
  
  content += `
  constructor(baseUrl?: string) {
    super(baseUrl);
`;

  if (schema.model) {
    for (const [modelName] of Object.entries(schema.model)) {
      const lowerName = modelName.toLowerCase();
      
      if (config.clientType === 'rest' || config.clientType === 'both') {
        content += `    this.${lowerName} = new ${modelName}Client(baseUrl);\n`;
      }
    }
    
    if (config.clientType === 'graphql' || config.clientType === 'both') {
      content += `    this.graphql = new GraphQLClient(baseUrl);\n`;
    }
  }
  
  content += `  }

  // Set auth token for all clients
  setAuthToken(token: string): void {
    super.setAuthToken(token);
`;

  if (schema.model) {
    for (const [modelName] of Object.entries(schema.model)) {
      const lowerName = modelName.toLowerCase();
      
      if (config.clientType === 'rest' || config.clientType === 'both') {
        content += `    this.${lowerName}.setAuthToken(token);\n`;
      }
    }
    
    if (config.clientType === 'graphql' || config.clientType === 'both') {
      content += `    this.graphql.setAuthToken(token);\n`;
    }
  }
  
  content += `  }
}

// Default export
export default APIClient;
`;
  
  return content;
}

function mapTypeToTypeScript(schemaType: string): string {
  const typeMap: Record<string, string> = {
    'String': 'string',
    'Number': 'number',
    'Integer': 'number',
    'Boolean': 'boolean',
    'Date': 'Date',
    'JSON': 'any',
    'ID': 'string'
  };
  
  return typeMap[schemaType] || schemaType;
}

function validateConfig(config: any): asserts config is APIClientConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('API Client plugin requires "output" configuration as string');
  }
  
  if (!config.clientType || !['rest', 'graphql', 'both'].includes(config.clientType)) {
    throw new Error('clientType must be one of: rest, graphql, both');
  }
  
  if (config.httpLibrary && !['fetch', 'axios'].includes(config.httpLibrary)) {
    throw new Error('httpLibrary must be one of: fetch, axios');
  }
}
```

## Schema Configuration

Add the API Client plugin to your `.idea` schema file:

```ts
plugin "./plugins/api-client.js" {
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
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | **Required** | Output file path for the API client |
| `clientType` | `'rest'\|'graphql'\|'both'` | **Required** | Type of client to generate |
| `httpLibrary` | `'fetch'\|'axios'` | `'fetch'` | HTTP library to use |
| `baseUrl` | `string` | `'/api'` | Base URL for API requests |
| `authentication` | `object` | `undefined` | Authentication configuration |
| `generateTypes` | `boolean` | `true` | Generate TypeScript types |
| `includeValidation` | `boolean` | `false` | Include request validation |
| `errorHandling` | `'throw'\|'return'\|'callback'` | `'return'` | Error handling strategy |

## Usage Examples

### Basic Schema

```ts
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
}
```

### Generated Client Usage

```typescript
import APIClient from './api-client';

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
}
```

## Advanced Features

### Authentication Strategies

```typescript
// Bearer token authentication
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
}
```

### Error Handling Strategies

```typescript
// Return errors in response (default)
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
});
```

### Request Cancellation

```typescript
// Using AbortController for request cancellation
const controller = new AbortController();

const response = await client.user.getAll({}, {
  signal: controller.signal
});

// Cancel the request
controller.abort();
```

### Custom Headers

```typescript
// Add custom headers to requests
const response = await client.user.getById('123', {
  headers: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US'
  }
});
```

## Best Practices

### 1. Type Safety

```typescript
// Always use generated types
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
}
```

### 2. Error Handling

```typescript
// Centralized error handling
class APIErrorHandler {
  static handle(response: APIResponse<any>) {
    if (!response.success) {
      if (response.errors) {
        // Handle validation errors
        Object.entries(response.errors).forEach(([field, messages]) => {
          console.error(`${field}: ${messages.join(', ')}`);
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
APIErrorHandler.handle(response);
```

### 3. Request Interceptors

```typescript
// Extend base client for custom behavior
class CustomAPIClient extends APIClient {
  constructor(baseUrl?: string) {
    super(baseUrl);
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Add request logging
    const originalRequest = this.request;
    this.request = async (method, url, data, options) => {
      console.log(`${method} ${url}`, data);
      return originalRequest.call(this, method, url, data, options);
    };
  }
}
```

### 4. Caching Strategy

```typescript
// Simple in-memory cache
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
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   ```typescript
   // Ensure your API server allows CORS
   // Add appropriate headers in your API configuration
   
   // For development, you might need to proxy requests
   const client = new APIClient('/api/proxy');
   ```

2. **Authentication Failures**
   ```typescript
   // Check token format and expiration
   function isTokenValid(token: string): boolean {
     try {
       const payload = JSON.parse(atob(token.split('.')[1]));
       return payload.exp * 1000 > Date.now();
     } catch {
       return false;
     }
   }
   
   // Refresh token automatically
   client.setAuthToken(await refreshToken());
   ```

3. **Network Timeouts**
   ```typescript
   // Implement retry logic
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
   }
   ```

### Debugging Tips

1. **Enable Request Logging**
   ```typescript
   // Add to base client
   private logRequest(method: string, url: string, data?: any) {
     if (process.env.NODE_ENV === 'development') {
       console.group(`API ${method} ${url}`);
       if (data) console.log('Data:', data);
       console.groupEnd();
     }
   }
   ```

2. **Response Validation**
   ```typescript
   // Validate response structure
   function validateResponse<T>(response: any): response is APIResponse<T> {
     return (
       typeof response === 'object' &&
       typeof response.success === 'boolean' &&
       (response.success ? 'data' in response : 'error' in response)
     );
   }
   ```

This tutorial provides a comprehensive foundation for creating API clients from `.idea` files. The generated clients provide type-safe, feature-rich interfaces for interacting with REST and GraphQL APIs.
