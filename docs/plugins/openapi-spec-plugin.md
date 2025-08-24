# OpenAPI Specification Generator Plugin Tutorial

This tutorial demonstrates how to create a plugin for `@stackpress/idea-transformer` that generates OpenAPI 3.0 specifications from `.idea` schema files. The plugin will create comprehensive API documentation with endpoints, schemas, and validation rules.

## Table of Contents

1. [Overview](#overview)
2. [Basic Implementation](#basic-implementation)
3. [Configuration Options](#configuration-options)
4. [Schema Processing](#schema-processing)
5. [Advanced Features](#advanced-features)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

OpenAPI (formerly Swagger) specifications provide a standard way to document REST APIs. This plugin will:

- Generate OpenAPI 3.0 compliant specifications
- Create schemas from idea models and types
- Generate CRUD endpoints for models
- Include validation rules and examples
- Support custom endpoints and operations
- Generate security schemes and authentication

### What You'll Learn

- Processing idea schemas for API documentation
- OpenAPI 3.0 specification structure
- Schema generation and validation
- Endpoint documentation patterns
- Security and authentication schemes

## Basic Implementation

Let's start with a basic OpenAPI specification generator:

### Plugin Structure

```typescript
// plugins/openapi-spec.ts
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface OpenAPIConfig {
  output: string;
  info?: {
    title?: string;
    version?: string;
    description?: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
    license?: {
      name?: string;
      url?: string;
    };
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  security?: {
    apiKey?: boolean;
    bearer?: boolean;
    oauth2?: boolean;
  };
  endpoints?: {
    crud?: boolean;
    custom?: Record<string, any>;
  };
}

export default async function generateOpenAPISpec(
  props: PluginProps<{ config: OpenAPIConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('OpenAPI plugin requires "output" configuration');
  }
  
  // Generate OpenAPI specification
  const spec = generateSpecification(schema, config);
  
  // Write to output file
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(spec, null, 2), 'utf8');
  
  console.log(`✅ Generated OpenAPI specification: ${outputPath}`);
}

function generateSpecification(schema: any, config: OpenAPIConfig) {
  const spec: any = {
    openapi: '3.0.3',
    info: {
      title: config.info?.title || 'API Documentation',
      version: config.info?.version || '1.0.0',
      description: config.info?.description || 'Generated API documentation',
      ...config.info?.contact && { contact: config.info.contact },
      ...config.info?.license && { license: config.info.license }
    },
    servers: config.servers || [
      { url: 'http://localhost:3000', description: 'Development server' }
    ],
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {}
    }
  };
  
  // Generate schemas from models and types
  if (schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      spec.components.schemas[name] = generateModelSchema(model);
    }
  }
  
  if (schema.type) {
    for (const [name, type] of Object.entries(schema.type)) {
      spec.components.schemas[name] = generateTypeSchema(type);
    }
  }
  
  if (schema.enum) {
    for (const [name, enumDef] of Object.entries(schema.enum)) {
      spec.components.schemas[name] = generateEnumSchema(enumDef);
    }
  }
  
  // Generate security schemes
  if (config.security) {
    generateSecuritySchemes(spec, config.security);
  }
  
  // Generate CRUD endpoints
  if (config.endpoints?.crud && schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      generateCRUDEndpoints(spec, name, model);
    }
  }
  
  // Add custom endpoints
  if (config.endpoints?.custom) {
    for (const [path, operation] of Object.entries(config.endpoints.custom)) {
      spec.paths[path] = operation;
    }
  }
  
  return spec;
}
```

### Schema Generation

```typescript
function generateModelSchema(model: any): any {
  const schema: any = {
    type: 'object',
    properties: {},
    required: []
  };
  
  if (model.columns) {
    for (const column of model.columns) {
      const property = generatePropertySchema(column);
      schema.properties[column.name] = property;
      
      if (column.required) {
        schema.required.push(column.name);
      }
    }
  }
  
  return schema;
}

function generateTypeSchema(type: any): any {
  const schema: any = {
    type: 'object',
    properties: {},
    required: []
  };
  
  if (type.columns) {
    for (const column of type.columns) {
      const property = generatePropertySchema(column);
      schema.properties[column.name] = property;
      
      if (column.required) {
        schema.required.push(column.name);
      }
    }
  }
  
  return schema;
}

function generateEnumSchema(enumDef: any): any {
  const values = Object.values(enumDef);
  return {
    type: 'string',
    enum: values,
    example: values[0]
  };
}

function generatePropertySchema(column: any): any {
  const property: any = {};
  
  // Map idea types to OpenAPI types
  switch (column.type) {
    case 'String':
      property.type = 'string';
      break;
    case 'Number':
      property.type = 'number';
      break;
    case 'Integer':
      property.type = 'integer';
      break;
    case 'Boolean':
      property.type = 'boolean';
      break;
    case 'Date':
      property.type = 'string';
      property.format = 'date-time';
      break;
    case 'JSON':
      property.type = 'object';
      break;
    default:
      // Reference to another schema
      property.$ref = `#/components/schemas/${column.type}`;
  }
  
  // Handle arrays
  if (column.multiple) {
    property = {
      type: 'array',
      items: property
    };
  }
  
  // Add validation from attributes
  if (column.attributes) {
    addValidationRules(property, column.attributes);
  }
  
  return property;
}

function addValidationRules(property: any, attributes: any): void {
  // String validations
  if (attributes.minLength) {
    property.minLength = attributes.minLength;
  }
  if (attributes.maxLength) {
    property.maxLength = attributes.maxLength;
  }
  if (attributes.pattern) {
    property.pattern = attributes.pattern;
  }
  
  // Number validations
  if (attributes.minimum) {
    property.minimum = attributes.minimum;
  }
  if (attributes.maximum) {
    property.maximum = attributes.maximum;
  }
  
  // Examples and descriptions
  if (attributes.example) {
    property.example = attributes.example;
  }
  if (attributes.description) {
    property.description = attributes.description;
  }
  
  // Format validations
  if (attributes.format) {
    property.format = attributes.format;
  }
}
```

## Configuration Options

### Schema Configuration

```typescript
// schema.idea
plugin "./plugins/openapi-spec.js" {
  output "./docs/api-spec.json"
  info {
    title "User Management API"
    version "2.0.0"
    description "Comprehensive user management system API"
    contact {
      name "API Support"
      email "support@example.com"
      url "https://example.com/support"
    }
    license {
      name "MIT"
      url "https://opensource.org/licenses/MIT"
    }
  }
  servers [
    {
      url "https://api.example.com/v2"
      description "Production server"
    }
    {
      url "https://staging-api.example.com/v2"
      description "Staging server"
    }
    {
      url "http://localhost:3000"
      description "Development server"
    }
  ]
  security {
    apiKey true
    bearer true
    oauth2 false
  }
  endpoints {
    crud true
    custom {
      "/auth/login" {
        post {
          summary "User login"
          requestBody {
            required true
            content {
              "application/json" {
                schema {
                  type "object"
                  properties {
                    email {
                      type "string"
                      format "email"
                    }
                    password {
                      type "string"
                      minLength 8
                    }
                  }
                  required ["email" "password"]
                }
              }
            }
          }
          responses {
            "200" {
              description "Login successful"
              content {
                "application/json" {
                  schema {
                    type "object"
                    properties {
                      token {
                        type "string"
                      }
                      user {
                        "$ref" "#/components/schemas/User"
                      }
                    }
                  }
                }
              }
            }
            "401" {
              description "Invalid credentials"
            }
          }
        }
      }
    }
  }
}
```

## Schema Processing

### Enhanced Schema Generation

```typescript
function generateSecuritySchemes(spec: any, security: any): void {
  if (security.apiKey) {
    spec.components.securitySchemes.ApiKeyAuth = {
      type: 'apiKey',
      in: 'header',
      name: 'X-API-Key'
    };
  }
  
  if (security.bearer) {
    spec.components.securitySchemes.BearerAuth = {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    };
  }
  
  if (security.oauth2) {
    spec.components.securitySchemes.OAuth2 = {
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://example.com/oauth/authorize',
          tokenUrl: 'https://example.com/oauth/token',
          scopes: {
            read: 'Read access',
            write: 'Write access',
            admin: 'Admin access'
          }
        }
      }
    };
  }
}

function generateCRUDEndpoints(spec: any, modelName: string, model: any): void {
  const resourcePath = `/${modelName.toLowerCase()}s`;
  const itemPath = `${resourcePath}/{id}`;
  
  // GET /resources - List all
  spec.paths[resourcePath] = {
    get: {
      summary: `List all ${modelName}s`,
      tags: [modelName],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number'
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Items per page'
        },
        {
          name: 'sort',
          in: 'query',
          schema: { type: 'string' },
          description: 'Sort field'
        },
        {
          name: 'order',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          description: 'Sort order'
        }
      ],
      responses: {
        '200': {
          description: `List of ${modelName}s`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: `#/components/schemas/${modelName}` }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      total: { type: 'integer' },
                      pages: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      security: [{ BearerAuth: [] }]
    },
    post: {
      summary: `Create a new ${modelName}`,
      tags: [modelName],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${modelName}` }
          }
        }
      },
      responses: {
        '201': {
          description: `${modelName} created successfully`,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${modelName}` }
            }
          }
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string' },
                  errors: {
                    type: 'object',
                    additionalProperties: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      security: [{ BearerAuth: [] }]
    }
  };
  
  // GET /resources/{id} - Get by ID
  spec.paths[itemPath] = {
    get: {
      summary: `Get ${modelName} by ID`,
      tags: [modelName],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: `${modelName} ID`
        }
      ],
      responses: {
        '200': {
          description: `${modelName} details`,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${modelName}` }
            }
          }
        },
        '404': {
          description: `${modelName} not found`
        }
      },
      security: [{ BearerAuth: [] }]
    },
    put: {
      summary: `Update ${modelName}`,
      tags: [modelName],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: `${modelName} ID`
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${modelName}` }
          }
        }
      },
      responses: {
        '200': {
          description: `${modelName} updated successfully`,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${modelName}` }
            }
          }
        },
        '404': {
          description: `${modelName} not found`
        }
      },
      security: [{ BearerAuth: [] }]
    },
    delete: {
      summary: `Delete ${modelName}`,
      tags: [modelName],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: `${modelName} ID`
        }
      ],
      responses: {
        '204': {
          description: `${modelName} deleted successfully`
        },
        '404': {
          description: `${modelName} not found`
        }
      },
      security: [{ BearerAuth: [] }]
    }
  };
}
```

## Advanced Features

### Multiple Output Formats

```typescript
interface AdvancedOpenAPIConfig extends OpenAPIConfig {
  formats?: ('json' | 'yaml' | 'html')[];
  validation?: {
    strict?: boolean;
    examples?: boolean;
  };
  documentation?: {
    includeExamples?: boolean;
    includeSchemas?: boolean;
    customTemplates?: string;
  };
}

export default async function generateAdvancedOpenAPISpec(
  props: PluginProps<{ config: AdvancedOpenAPIConfig }>
) {
  const { config, schema, transformer } = props;
  
  const spec = generateSpecification(schema, config);
  
  // Add validation and examples
  if (config.validation?.examples) {
    addExamples(spec, schema);
  }
  
  if (config.validation?.strict) {
    validateSpecification(spec);
  }
  
  // Generate multiple formats
  const formats = config.formats || ['json'];
  const outputBase = config.output.replace(/\.[^.]+$/, '');
  
  for (const format of formats) {
    await generateFormat(spec, format, outputBase, transformer);
  }
}

async function generateFormat(
  spec: any, 
  format: string, 
  outputBase: string, 
  transformer: any
): Promise<void> {
  let content: string;
  let extension: string;
  
  switch (format) {
    case 'json':
      content = JSON.stringify(spec, null, 2);
      extension = '.json';
      break;
    case 'yaml':
      const yaml = await import('yaml');
      content = yaml.stringify(spec);
      extension = '.yaml';
      break;
    case 'html':
      content = generateHTMLDocumentation(spec);
      extension = '.html';
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
  
  const outputPath = await transformer.loader.absolute(`${outputBase}${extension}`);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`✅ Generated ${format.toUpperCase()} specification: ${outputPath}`);
}

function addExamples(spec: any, schema: any): void {
  // Add examples to schemas
  for (const [name, schemaObj] of Object.entries(spec.components.schemas)) {
    if (schemaObj.type === 'object') {
      schemaObj.example = generateExample(schemaObj, schema);
    }
  }
  
  // Add examples to endpoints
  for (const [path, pathObj] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathObj)) {
      if (operation.requestBody?.content?.['application/json']?.schema) {
        const schema = operation.requestBody.content['application/json'].schema;
        if (!schema.example) {
          schema.example = generateExample(schema, schema);
        }
      }
    }
  }
}

function generateExample(schemaObj: any, fullSchema: any): any {
  if (schemaObj.$ref) {
    const refName = schemaObj.$ref.split('/').pop();
    return generateExample(fullSchema.components?.schemas?.[refName] || {}, fullSchema);
  }
  
  if (schemaObj.type === 'object') {
    const example: any = {};
    for (const [propName, propSchema] of Object.entries(schemaObj.properties || {})) {
      example[propName] = generatePropertyExample(propSchema);
    }
    return example;
  }
  
  if (schemaObj.type === 'array') {
    return [generateExample(schemaObj.items, fullSchema)];
  }
  
  return generatePropertyExample(schemaObj);
}

function generatePropertyExample(propSchema: any): any {
  if (propSchema.example !== undefined) {
    return propSchema.example;
  }
  
  if (propSchema.enum) {
    return propSchema.enum[0];
  }
  
  switch (propSchema.type) {
    case 'string':
      if (propSchema.format === 'email') return 'user@example.com';
      if (propSchema.format === 'date-time') return new Date().toISOString();
      if (propSchema.format === 'date') return new Date().toISOString().split('T')[0];
      return 'string';
    case 'number':
      return 42.5;
    case 'integer':
      return 42;
    case 'boolean':
      return true;
    case 'array':
      return [generatePropertyExample(propSchema.items)];
    case 'object':
      return {};
    default:
      return null;
  }
}

function validateSpecification(spec: any): void {
  // Basic validation
  if (!spec.openapi) {
    throw new Error('OpenAPI version is required');
  }
  
  if (!spec.info?.title) {
    throw new Error('API title is required');
  }
  
  if (!spec.info?.version) {
    throw new Error('API version is required');
  }
  
  // Validate paths
  for (const [path, pathObj] of Object.entries(spec.paths)) {
    if (!path.startsWith('/')) {
      throw new Error(`Path must start with '/': ${path}`);
    }
    
    for (const [method, operation] of Object.entries(pathObj)) {
      if (!operation.responses) {
        throw new Error(`Operation ${method.toUpperCase()} ${path} must have responses`);
      }
    }
  }
  
  console.log('✅ OpenAPI specification validation passed');
}

function generateHTMLDocumentation(spec: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${spec.info.title} - API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: window.location.origin + window.location.pathname.replace('.html', '.json'),
                spec: ${JSON.stringify(spec, null, 2)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>`;
}
```

## Usage Examples

### Basic Usage

```typescript
// schema.idea
enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

model User {
  id String @id @default("nanoid()")
  email String @unique @format("email")
  name String @minLength(2) @maxLength(100)
  role UserRole @default("USER")
  active Boolean @default(true)
  created Date @default("now()")
  updated Date @default("updated()")
}

plugin "./plugins/openapi-spec.js" {
  output "./docs/api-spec.json"
  info {
    title "User API"
    version "1.0.0"
    description "User management API"
  }
  endpoints {
    crud true
  }
  security {
    bearer true
  }
}
```

### Advanced Configuration

```typescript
// schema.idea
plugin "./plugins/openapi-spec.js" {
  output "./docs/api-spec"
  formats ["json" "yaml" "html"]
  info {
    title "E-commerce API"
    version "2.1.0"
    description "Comprehensive e-commerce platform API"
    contact {
      name "API Team"
      email "api@ecommerce.com"
      url "https://ecommerce.com/api-support"
    }
    license {
      name "Apache 2.0"
      url "https://www.apache.org/licenses/LICENSE-2.0.html"
    }
  }
  servers [
    {
      url "https://api.ecommerce.com/v2"
      description "Production server"
    }
    {
      url "https://staging-api.ecommerce.com/v2"
      description "Staging server"
    }
  ]
  security {
    apiKey true
    bearer true
    oauth2 true
  }
  endpoints {
    crud true
    custom {
      "/auth/login" {
        post {
          summary "Authenticate user"
          tags ["Authentication"]
          requestBody {
            required true
            content {
              "application/json" {
                schema {
                  type "object"
                  properties {
                    email { type "string" format "email" }
                    password { type "string" minLength 8 }
                    remember { type "boolean" default false }
                  }
                  required ["email" "password"]
                }
              }
            }
          }
          responses {
            "200" {
              description "Login successful"
              content {
                "application/json" {
                  schema {
                    type "object"
                    properties {
                      token { type "string" }
                      refreshToken { type "string" }
                      expiresIn { type "integer" }
                      user { "$ref" "#/components/schemas/User" }
                    }
                  }
                }
              }
            }
            "401" {
              description "Invalid credentials"
              content {
                "application/json" {
                  schema {
                    type "object"
                    properties {
                      error { type "string" }
                      code { type "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
      "/auth/refresh" {
        post {
          summary "Refresh access token"
          tags ["Authentication"]
          requestBody {
            required true
            content {
              "application/json" {
                schema {
                  type "object"
                  properties {
                    refreshToken { type "string" }
                  }
                  required ["refreshToken"]
                }
              }
            }
          }
          responses {
            "200" {
              description "Token refreshed"
              content {
                "application/json" {
                  schema {
                    type "object"
                    properties {
                      token { type "string" }
                      expiresIn { type "integer" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  validation {
    strict true
    examples true
  }
}
```

### CLI Integration

```bash
# Generate OpenAPI specification
npm run transform

# Serve documentation locally
npx swagger-ui-serve docs/api-spec.json

# Validate specification
npx swagger-codegen validate -i docs/api-spec.json

# Generate client SDKs
npx swagger-codegen generate -i docs/api-spec.json -l typescript-fetch -o ./sdk/typescript
npx swagger-codegen generate -i docs/api-spec.json -l python -o ./sdk/python
```

## Best Practices

### 1. Comprehensive Documentation

```typescript
// Always include detailed descriptions
function generateModelSchema(model: any): any {
  const schema: any = {
    type: 'object',
    description: model.description || `${model.name} entity`,
    properties: {},
    required: []
  };
  
  // Add property descriptions
  if (model.columns) {
    for (const column of model.columns) {
      const property = generatePropertySchema(column);
      
      // Add description from attributes or generate one
      if (column.attributes?.description) {
        property.description = column.attributes.description;
      } else {
        property.description = generatePropertyDescription(column);
      }
      
      schema.properties[column.name] = property;
    }
  }
  
  return schema;
}

function generatePropertyDescription(column: any): string {
  const descriptions: Record<string, string> = {
    id: 'Unique identifier',
    email: 'Email address',
    name: 'Full name',
    created: 'Creation timestamp',
    updated: 'Last update timestamp',
    active: 'Active status flag'
  };
  
  return descriptions[column.name] || `${column.name} field`;
}
```

### 2. Consistent Error Responses

```typescript
function generateErrorResponses(): any {
  return {
    '400': {
      description: 'Bad Request',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', description: 'Error message' },
              code: { type: 'string', description: 'Error code' },
              errors: {
                type: 'object',
                additionalProperties: { type: 'string' },
                description: 'Field-specific errors'
              }
            },
            required: ['error']
          }
        }
      }
    },
    '401': {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Authentication required' }
            }
          }
        }
      }
    },
    '403': {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Insufficient permissions' }
            }
          }
        }
      }
    },
    '404': {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Resource not found' }
            }
          }
        }
      }
    },
    '500': {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Internal server error' }
            }
          }
        }
      }
    }
  };
}
```

### 3. Security Best Practices

```typescript
function addSecurityToEndpoints(spec: any): void {
  // Add security requirements to all endpoints
  for (const [path, pathObj] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathObj)) {
      // Skip public endpoints
      if (isPublicEndpoint(path, method)) {
        continue;
      }
      
      // Add appropriate security scheme
      if (!operation.security) {
        operation.security = [{ BearerAuth: [] }];
      }
    }
  }
}

function isPublicEndpoint(path: string, method: string): boolean {
  const publicEndpoints = [
    { path: '/auth/login', method: 'post' },
    { path: '/auth/register', method: 'post' },
    { path: '/health', method: 'get' }
  ];
  
  return publicEndpoints.some(endpoint => 
    endpoint.path === path && endpoint.method === method.toLowerCase()
  );
}
```

### 4. Validation and Testing

```typescript
function addValidationExamples(spec: any): void {
  // Add validation examples to request bodies
  for (const [path, pathObj] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathObj)) {
      if (operation.requestBody?.content?.['application/json']?.schema) {
        const schema = operation.requestBody.content['application/json'].schema;
        
        // Add valid example
        if (!schema.example) {
          schema.example = generateValidExample(schema);
        }
        
        // Add examples for validation errors
        if (!schema.examples) {
          schema.examples = {
            valid: {
              summary: 'Valid request',
              value: generateValidExample(schema)
            },
            invalid: {
              summary: 'Invalid request (validation errors)',
              value: generateInvalidExample(schema)
            }
          };
        }
      }
    }
  }
}

function generateValidExample(schema: any): any {
  // Generate a valid example based on schema
  if (schema.$ref) {
    return { id: '123', name: 'Example' };
  }
  
  const example: any = {};
  for (const [propName, propSchema] of Object.entries(schema.properties || {})) {
    example[propName] = generatePropertyExample(propSchema);
  }
  
  return example;
}

function generateInvalidExample(schema: any): any {
  // Generate an invalid example to show validation errors
  const example: any = {};
  for (const [propName, propSchema] of Object.entries(schema.properties || {})) {
    // Intentionally create invalid values
    if (propSchema.type === 'string' && propSchema.format === 'email') {
      example[propName] = 'invalid-email';
    } else if (propSchema.type === 'string' && propSchema.minLength) {
      example[propName] = 'x'; // Too short
    } else if (propSchema.type === 'number' && propSchema.minimum) {
      example[propName] = propSchema.minimum - 1; // Below minimum
    } else {
      example[propName] = null; // Invalid type
    }
  }
  
  return example;
}
```

## Troubleshooting

### Common Issues

#### 1. Schema Reference Errors

```typescript
// Problem: Circular references in schemas
// Solution: Use allOf or oneOf patterns

function handleCircularReferences(spec: any): void {
  // Detect and resolve circular references
  const visited = new Set();
  
  function checkSchema(schema: any, path: string): void {
    if (visited.has(path)) {
      // Circular reference detected
      console.warn(`Circular reference detected: ${path}`);
      return;
    }
    
    visited.add(path);
    
    if (schema.$ref) {
      const refPath = schema.$ref.replace('#/components/schemas/', '');
      checkSchema(spec.components.schemas[refPath], refPath);
    }
    
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        checkSchema(propSchema, `${path}.${propName}`);
      }
    }
    
    visited.delete(path);
  }
  
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    checkSchema(schema, name);
  }
}
```

#### 2. Invalid OpenAPI Format

```typescript
// Problem: Generated spec doesn't validate
// Solution: Add comprehensive validation

function validateOpenAPISpec(spec: any): void {
  const errors: string[] = [];
  
  // Check required fields
  if (!spec.openapi) errors.push('Missing openapi version');
  if (!spec.info) errors.push('Missing info object');
  if (!spec.paths) errors.push('Missing paths object');
  
  // Validate info object
  if (spec.info) {
    if (!spec.info.title) errors.push('Missing info.title');
    if (!spec.info.version) errors.push('Missing info.version');
  }
  
  // Validate paths
  if (spec.paths) {
    for (const [path, pathObj] of Object.entries(spec.paths)) {
      if (!path.startsWith('/')) {
        errors.push(`Path must start with '/': ${path}`);
      }
      
      for (const [method, operation] of Object.entries(pathObj)) {
        if (!operation.responses) {
          errors.push(`Missing responses for ${method.toUpperCase()} ${path}`);
        }
      }
    }
  }
  
  // Validate components
  if (spec.components?.schemas) {
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      if (!schema.type && !schema.$ref && !schema.allOf && !schema.oneOf) {
        errors.push(`Schema ${name} missing type definition`);
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`OpenAPI validation failed:\n${errors.join('\n')}`);
  }
  
  console.log('✅ OpenAPI specification validation passed');
}
```

#### 3. Missing Dependencies

```bash
# Install required dependencies
npm install --save-dev yaml swagger-ui-dist

# For validation
npm install --save-dev swagger-parser

# For code generation
npm install --save-dev @openapitools/openapi-generator-cli
```

#### 4. Performance Issues

```typescript
// Problem: Large schemas cause performance issues
// Solution: Implement schema optimization

function optimizeSchema(spec: any): any {
  // Remove unused schemas
  const usedSchemas = new Set();
  
  // Find all schema references
  function findReferences(obj: any): void {
    if (typeof obj === 'object' && obj !== null) {
      if (obj.$ref && obj.$ref.startsWith('#/components/schemas/')) {
        const schemaName = obj.$ref.replace('#/components/schemas/', '');
        usedSchemas.add(schemaName);
      }
      
      for (const value of Object.values(obj)) {
        findReferences(value);
      }
    }
  }
  
  findReferences(spec.paths);
  
  // Remove unused schemas
  const optimizedSchemas: any = {};
  for (const schemaName of usedSchemas) {
    if (spec.components.schemas[schemaName]) {
      optimizedSchemas[schemaName] = spec.components.schemas[schemaName];
    }
  }
  
  return {
    ...spec,
    components: {
      ...spec.components,
      schemas: optimizedSchemas
    }
  };
}
```

### Debug Mode

```typescript
interface DebugOpenAPIConfig extends AdvancedOpenAPIConfig {
  debug?: boolean;
  logLevel?: 'info' | 'warn' | 'error';
}

export default async function generateOpenAPISpecWithDebug(
  props: PluginProps<{ config: DebugOpenAPIConfig }>
) {
  const { config, schema, transformer } = props;
  
  if (config.debug) {
    console.log('🔍 Debug mode enabled');
    console.log('Schema models:', Object.keys(schema.model || {}));
    console.log('Schema types:', Object.keys(schema.type || {}));
    console.log('Schema enums:', Object.keys(schema.enum || {}));
  }
  
  try {
    const spec = generateSpecification(schema, config);
    
    if (config.debug) {
      console.log('Generated schemas:', Object.keys(spec.components.schemas));
      console.log('Generated paths:', Object.keys(spec.paths));
    }
    
    // Validate before writing
    if (config.validation?.strict) {
      validateOpenAPISpec(spec);
    }
    
    // Optimize if needed
    const optimizedSpec = config.debug ? optimizeSchema(spec) : spec;
    
    // Generate outputs
    const formats = config.formats || ['json'];
    const outputBase = config.output.replace(/\.[^.]+$/, '');
    
    for (const format of formats) {
      await generateFormat(optimizedSpec, format, outputBase, transformer);
    }
    
    if (config.debug) {
      console.log('✅ OpenAPI generation completed successfully');
    }
    
  } catch (error) {
    console.error('❌ OpenAPI generation failed:', error.message);
    if (config.debug) {
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}
```

## Conclusion

This OpenAPI Specification Generator plugin provides a comprehensive solution for generating API documentation from `.idea` schema files. Key features include:

- **Complete OpenAPI 3.0 Support**: Generates fully compliant specifications
- **Automatic CRUD Endpoints**: Creates standard REST endpoints for models
- **Security Integration**: Supports multiple authentication schemes
- **Multiple Output Formats**: JSON, YAML, and HTML documentation
- **Validation and Examples**: Includes request/response examples and validation
- **Extensible Configuration**: Highly customizable for different use cases

The plugin follows TypeScript best practices and provides comprehensive error handling, making it suitable for production use in API development workflows.

### Next Steps

1. **Extend Schema Mapping**: Add support for more complex schema relationships
2. **Custom Templates**: Implement custom documentation templates
3. **Integration Testing**: Add automated testing for generated specifications
4. **Performance Optimization**: Implement caching and incremental generation
5. **Plugin Ecosystem**: Create complementary plugins for API testing and client generation

This tutorial provides a solid foundation for generating professional API documentation that can be used with tools like Swagger UI, Postman, and various code generators.
