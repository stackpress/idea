//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const documentationBestPracticesExample =
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
}`;

const errorResponsesExample = `function generateErrorResponses(): any {
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
}`;

const securityBestPracticesExample = `function addSecurityToEndpoints(spec: any): void {
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
}`;

const validationExamplesExample = `function addValidationExamples(spec: any): void {
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
}`

//----------------------------------------------------------------------

export default function BestPractices() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Best Practices Section Content */}
      <section id="best-practices">
        <H1>{_('7. Best Practices')}</H1>
        <P>
          <Translate>
            Best practices ensure your generated OpenAPI specifications
            are comprehensive, maintainable, and follow industry
            standards. These guidelines cover documentation quality,
            error handling, security implementation, and validation
            strategies.
          </Translate>
        </P>

        <H2>{_('7.1. Comprehensive Documentation')}</H2>
        <P>
          <Translate>
            Comprehensive documentation practices ensure your API
            specifications provide clear, detailed information for both
            human readers and automated tools. This includes proper
            descriptions, examples, and consistent formatting throughout
            the specification.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {documentationBestPracticesExample}
        </Code>

        <H2>{_('7.2. Consistent Error Responses')}</H2>
        <P>
          <Translate>
            Consistent error responses provide standardized error
            handling across your API endpoints. This approach ensures
            predictable error formats that client applications can
            handle reliably, improving the overall developer experience.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {errorResponsesExample}
        </Code>

        <H2>{_('7.3. Security Best Practices')}</H2>
        <P>
          <Translate>
            Security best practices ensure your API documentation
            properly represents authentication and authorization
            requirements. This includes applying appropriate security
            schemes to endpoints and documenting access control patterns.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {securityBestPracticesExample}
        </Code>

        <H2>{_('7.4. Validation and Testing')}</H2>
        <P>
          <Translate>
            Validation and testing practices ensure your generated
            OpenAPI specifications are accurate and functional. This
            includes adding validation examples, testing request/response
            formats, and verifying specification compliance.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {validationExamplesExample}
        </Code>
      </section>
    </>
  );
}