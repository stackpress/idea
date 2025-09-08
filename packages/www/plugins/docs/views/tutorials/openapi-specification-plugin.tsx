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
  `// plugins/openapi-spec.ts
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
  
  console.log(\`✅ Generated OpenAPI specification: \${outputPath}\`);
}`,
  `function generateSpecification(schema: any, config: OpenAPIConfig) {
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
}`,
  `function generateModelSchema(model: any): any {
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
}`,
  `function generatePropertySchema(column: any): any {
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
      property.$ref = \`#/components/schemas/\${column.type}\`;
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
}`,
  `// schema.idea
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
}`,
  `function generateSecuritySchemes(spec: any, security: any): void {
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
}`,
  `function generateCRUDEndpoints(spec: any, modelName: string, model: any): void {
  const resourcePath = \`/\${modelName.toLowerCase()}s\`;
  const itemPath = \`\${resourcePath}/{id}\`;
  
  // GET /resources - List all
  spec.paths[resourcePath] = {
    get: {
      summary: \`List all \${modelName}s\`,
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
          description: \`List of \${modelName}s\`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: \`#/components/schemas/\${modelName}\` }
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
      summary: \`Create a new \${modelName}\`,
      tags: [modelName],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: \`#/components/schemas/\${modelName}\` }
          }
        }
      },
      responses: {
        '201': {
          description: \`\${modelName} created successfully\`,
          content: {
            'application/json': {
              schema: { $ref: \`#/components/schemas/\${modelName}\` }
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
}`,
  `interface AdvancedOpenAPIConfig extends OpenAPIConfig {
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
  const outputBase = config.output.replace(/\\.[^.]+$/, '');
  
  for (const format of formats) {
    await generateFormat(spec, format, outputBase, transformer);
  }
}`,
  `async function generateFormat(
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
      throw new Error(\`Unsupported format: \${format}\`);
  }
  
  const outputPath = await transformer.loader.absolute(\`\${outputBase}\${extension}\`);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(\`✅ Generated \${format.toUpperCase()} specification: \${outputPath}\`);
}`,
  `// schema.idea
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
}`,
  `// schema.idea
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
}`,
  `# Generate OpenAPI specification
npm run transform

# Serve documentation locally
npx swagger-ui-serve docs/api-spec.json

# Validate specification
npx swagger-codegen validate -i docs/api-spec.json

# Generate client SDKs
npx swagger-codegen generate -i docs/api-spec.json -l typescript-fetch -o ./sdk/typescript
npx swagger-codegen generate -i docs/api-spec.json -l python -o ./sdk/python`,
  `// Always include detailed descriptions
function generateModelSchema(model: any): any {
  const schema: any = {
    type: 'object',
    description: model.description || \`\${model.name} entity\`,
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
  
  return descriptions[column.name] || \`\${column.name} field\`;
}`,
  `function generateErrorResponses(): any {
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
}`,
  `function addSecurityToEndpoints(spec: any): void {
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
}`,
  `function addValidationExamples(spec: any): void {
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
}`,
  `// Problem: Circular references in schemas
// Solution: Use allOf or oneOf patterns

function handleCircularReferences(spec: any): void {
  // Detect and resolve circular references
  const visited = new Set();
  
  function checkSchema(schema: any, path: string): void {
    if (visited.has(path)) {
      // Circular reference detected
      console.warn(\`Circular reference detected: \${path}\`);
      return;
    }
    
    visited.add(path);
    
    if (schema.$ref) {
      const refPath = schema.$ref.replace('#/components/schemas/', '');
      checkSchema(spec.components.schemas[refPath], refPath);
    }
    
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        checkSchema(propSchema, \`\${path}.\${propName}\`);
      }
    }
    
    visited.delete(path);
  }
  
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    checkSchema(schema, name);
  }
}`,
  `// Problem: Generated spec doesn't validate
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
        errors.push(\`Path must start with '/': \${path}\`);
      }
      
      for (const [method, operation] of Object.entries(pathObj)) {
        if (!operation.responses) {
          errors.push(\`Missing responses for \${method.toUpperCase()} \${path}\`);
        }
      }
    }
  }
  
  // Validate components
  if (spec.components?.schemas) {
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      if (!schema.type && !schema.$ref && !schema.allOf && !schema.oneOf) {
        errors.push(\`Schema \${name} missing type definition\`);
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(\`OpenAPI validation failed:\\n\${errors.join('\\n')}\`);
  }
  
  console.log('✅ OpenAPI specification validation passed');
}`,
  `# Install required dependencies
npm install --save-dev yaml swagger-ui-dist

# For validation
npm install --save-dev swagger-parser

# For code generation
npm install --save-dev @openapitools/openapi-generator-cli`,
  `// Problem: Large schemas cause performance issues
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
}`,
  `interface DebugOpenAPIConfig extends AdvancedOpenAPIConfig {
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
    const outputBase = config.output.replace(/\\.[^.]+$/, '');
    
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
}`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('OpenAPI Specification Generator Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates OpenAPI 3.0 specifications from .idea schema files'
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
        <a href="#2-basic-implementation" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('2. Basic Implementation')}
        </a>
        <a href="#3-configuration-options" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('3. Configuration Options')}
        </a>
        <a href="#4-schema-processing" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('4. Schema Processing')}
        </a>
        <a href="#5-advanced-features" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('5. Advanced Features')}
        </a>
        <a href="#6-usage-examples" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('6. Usage Examples')}
        </a>
        <a href="#7-best-practices" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('7. Best Practices')}
        </a>
        <a href="#8-troubleshooting" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('8. Troubleshooting')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>OpenAPI Specification Generator Plugin Tutorial</H1>
      <P>
        This tutorial demonstrates how to create a plugin for <C>@stackpress/idea-transformer</C> that generates OpenAPI 3.0 specifications from <C>.idea</C> schema files. The plugin will create comprehensive API documentation with endpoints, schemas, and validation rules.
      </P>

      <section id="1-overview">
        <H2>1. Overview</H2>
        <P>
          OpenAPI (formerly Swagger) specifications provide a standard way to document REST APIs. This plugin transforms your <C>.idea</C> schema definitions into comprehensive API documentation that follows industry standards and integrates seamlessly with existing API development workflows.
        </P>
        <P>This plugin will:</P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Generate OpenAPI 3.0 compliant specifications</li>
          <li className="my-2">Create schemas from idea models and types</li>
          <li className="my-2">Generate CRUD endpoints for models</li>
          <li className="my-2">Include validation rules and examples</li>
          <li className="my-2">Support custom endpoints and operations</li>
          <li className="my-2">Generate security schemes and authentication</li>
        </ul>

        <H3>What You'll Learn</H3>
        <P>
          This section outlines the key concepts and skills you'll acquire through this tutorial. Understanding these fundamentals will enable you to create robust API documentation that serves both developers and automated tooling.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Processing idea schemas for API documentation</li>
          <li className="my-2">OpenAPI 3.0 specification structure</li>
          <li className="my-2">Schema generation and validation</li>
          <li className="my-2">Endpoint documentation patterns</li>
          <li className="my-2">Security and authentication schemes</li>
        </ul>
      </section>

      <section id="2-basic-implementation">
        <H2>2. Basic Implementation</H2>
        <P>
          The basic implementation provides the foundation for generating OpenAPI specifications from <C>.idea</C> schema files. This section covers the core plugin structure, configuration interface, and essential generation functions needed to create functional API documentation.
        </P>
        <P>Let's start with a basic OpenAPI specification generator:</P>

        <H3>2.1. Plugin Structure</H3>
        <P>
          The plugin structure defines the main entry point and configuration interface for the OpenAPI generator. This includes type definitions for configuration options, the primary plugin function, and the core specification generation logic.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>

        <H3>2.2. Schema Generation</H3>
        <P>
          Schema generation transforms <C>.idea</C> model and type definitions into OpenAPI-compliant schema objects. This process includes mapping data types, handling validation rules, and creating proper JSON Schema structures that integrate with OpenAPI tooling.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>
      </section>

      <section id="3-configuration-options">
        <H2>3. Configuration Options</H2>
        <P>
          Configuration options control how the OpenAPI specification is generated, including output formats, API metadata, server definitions, and security schemes. Proper configuration ensures the generated documentation meets your specific requirements and integrates with your development workflow.
        </P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[4]}
        </Code>
      </section>

      <section id="4-schema-processing">
        <H2>4. Schema Processing</H2>
        <P>
          Schema processing handles the transformation of <C>.idea</C> definitions into OpenAPI components and endpoints. This includes generating security schemes, creating CRUD endpoints for models, and handling complex schema relationships and validations.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[5]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[6]}
        </Code>
      </section>

      <section id="5-advanced-features">
        <H2>5. Multiple Output Formats</H2>
        <P>
          Multiple output formats allow you to generate OpenAPI specifications in JSON, YAML, and HTML formats. This flexibility ensures compatibility with different tools and enables both machine-readable specifications and human-friendly documentation.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[8]}
        </Code>
      </section>

      <section id="6-usage-examples">
        <H2>6. Usage Examples</H2>
        <P>
          Usage examples demonstrate practical applications of the OpenAPI generator plugin with real-world scenarios. These examples show how to configure the plugin for different use cases and integrate the generated documentation into your development workflow.
        </P>

        <H3>6.1. Basic Usage</H3>
        <P>
          Basic usage examples show the fundamental configuration needed to generate OpenAPI specifications from simple <C>.idea</C> schemas. This includes model definitions, plugin configuration, and the resulting API documentation structure.
        </P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <H3>6.2. Advanced Configuration</H3>
        <P>
          Advanced configuration demonstrates comprehensive plugin setup with multiple output formats, detailed API metadata, custom endpoints, and security schemes. This example shows how to create production-ready API documentation with full feature coverage.
        </P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H3>6.3. CLI Integration</H3>
        <P>
          CLI integration shows how to incorporate the OpenAPI generator into your development workflow using command-line tools. This includes generating specifications, serving documentation locally, and integrating with API development tools.
        </P>
        <Code copy language='bash' className='bg-black text-white'>
          {examples[11]}
        </Code>
      </section>

      <section id="7-best-practices">
        <H2>7. Best Practices</H2>
        <P>
          Best practices ensure your generated OpenAPI specifications are comprehensive, maintainable, and follow industry standards. These guidelines cover documentation quality, error handling, security implementation, and validation strategies.
        </P>

        <H3>7.1. Comprehensive Documentation</H3>
        <P>
          Comprehensive documentation practices ensure your API specifications provide clear, detailed information for both human readers and automated tools. This includes proper descriptions, examples, and consistent formatting throughout the specification.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <H3>7.2. Consistent Error Responses</H3>
        <P>
          Consistent error responses provide standardized error handling across your API endpoints. This approach ensures predictable error formats that client applications can handle reliably, improving the overall developer experience.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[13]}
        </Code>

        <H3>7.3. Security Best Practices</H3>
        <P>
          Security best practices ensure your API documentation properly represents authentication and authorization requirements. This includes applying appropriate security schemes to endpoints and documenting access control patterns.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[14]}
        </Code>

        <H3>7.4. Validation and Testing</H3>
        <P>
          Validation and testing practices ensure your generated OpenAPI specifications are accurate and functional. This includes adding validation examples, testing request/response formats, and verifying specification compliance.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[15]}
        </Code>
      </section>

      <section id="8-troubleshooting">
        <H2>8. Troubleshooting</H2>
        <P>
          This section addresses common issues encountered when generating OpenAPI specifications and provides solutions for debugging and resolving problems. Understanding these troubleshooting techniques helps ensure reliable specification generation.
        </P>

        <H3>8.1. Common Issues</H3>
        <P>
          Common issues include schema reference errors, validation failures, and performance problems with large specifications. These problems typically arise from circular references, invalid configurations, or missing dependencies.
        </P>

        <H3>8.1.1. Schema Reference Errors</H3>
        <P>
          Schema reference errors occur when the generator encounters circular dependencies or invalid references between schema components. These issues can break the specification generation process and require careful handling of schema relationships.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H3>8.1.2. Invalid OpenAPI Format</H3>
        <P>
          Invalid OpenAPI format errors occur when the generated specification doesn't conform to OpenAPI standards. These validation failures can prevent the specification from working with OpenAPI tools and require comprehensive validation during generation.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[17]}
        </Code>

        <H3>8.1.3. Missing Dependencies</H3>
        <P>
          Missing dependencies can cause the plugin to fail during execution or limit available features. Ensuring all required packages are installed and properly configured is essential for reliable operation.
        </P>
        <Code copy language='bash' className='bg-black text-white'>
          {examples[18]}
        </Code>

        <H3>8.1.4. Performance Issues</H3>
        <P>
          Performance issues can occur when generating specifications for large schemas with many models and complex relationships. Optimization techniques help maintain reasonable generation times and manageable output file sizes.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[19]}
        </Code>

        <H3>8.2. Debug Mode</H3>
        <P>
          Debug mode provides detailed logging and diagnostic information during specification generation. This feature helps identify issues, understand the generation process, and optimize plugin configuration for better results.
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[20]}
        </Code>
      </section>

      <section id="conclusion">
        <H2>Conclusion</H2>
        <P>
          This OpenAPI Specification Generator plugin provides a comprehensive solution for generating API documentation from <C>.idea</C> schema files. Key features include:
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2"><SS>Complete OpenAPI 3.0 Support</SS>: Generates fully compliant specifications</li>
          <li className="my-2"><SS>Automatic CRUD Endpoints</SS>: Creates standard REST endpoints for models</li>
          <li className="my-2"><SS>Security Integration</SS>: Supports multiple authentication schemes</li>
          <li className="my-2"><SS>Multiple Output Formats</SS>: JSON, YAML, and HTML documentation</li>
          <li className="my-2"><SS>Validation and Examples</SS>: Includes request/response examples and validation</li>
          <li className="my-2"><SS>Extensible Configuration</SS>: Highly customizable for different use cases</li>
        </ul>

        <P>
          The plugin follows TypeScript best practices and provides comprehensive error handling, making it suitable for production use in API development workflows.
        </P>

        <H3>Next Steps</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2"><SS>Extend Schema Mapping</SS>: Add support for more complex schema relationships</li>
          <li className="my-2"><SS>Custom Templates</SS>: Implement custom documentation templates</li>
          <li className="my-2"><SS>Integration Testing</SS>: Add automated testing for generated specifications</li>
          <li className="my-2"><SS>Performance Optimization</SS>: Implement caching and incremental generation</li>
          <li className="my-2"><SS>Plugin Ecosystem</SS>: Create complementary plugins for API testing and client generation</li>
        </ul>

        <P>
          This tutorial provides a solid foundation for generating professional API documentation that can be used with tools like Swagger UI, Postman, and various code generators.
        </P>
      </section>

      <Nav
        prev={{ text: 'Test Data Plugin', href: '/docs/tutorials/test-data-plugin' }}
        next={{ text: 'MySQL Table Plugin', href: '/docs/tutorials/mysql-table-plugin' }}
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
