//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const securitySchemesExample = 
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
}`

//----------------------------------------------------------------------

const crudEndpointsExample = 
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
  
  // GET /resources/{id} - Get by ID
  spec.paths[itemPath] = {
    get: {
      summary: \`Get \${modelName} by ID\`,
      tags: [modelName],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: \`\${modelName} ID\`
        }
      ],
      responses: {
        '200': {
          description: \`\${modelName} details\`,
          content: {
            'application/json': {
              schema: { $ref: \`#/components/schemas/\${modelName}\` }
            }
          }
        },
        '404': {
          description: \`\${modelName} not found\`
        }
      },
      security: [{ BearerAuth: [] }]
    },
    put: {
      summary: \`Update \${modelName}\`,
      tags: [modelName],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: \`\${modelName} ID\`
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: \`#/components/schemas/\${modelName}\` }
          }
        }
      },
      responses: {
        '200': {
          description: \`\${modelName} updated successfully\`,
          content: {
            'application/json': {
              schema: { $ref: \`#/components/schemas/\${modelName}\` }
            }
          }
        },
        '404': {
          description: \`\${modelName} not found\`
        }
      },
      security: [{ BearerAuth: [] }]
    },
    delete: {
      summary: \`Delete \${modelName}\`,
      tags: [modelName],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: \`\${modelName} ID\`
        }
      ],
      responses: {
        '204': {
          description: \`\${modelName} deleted successfully\`
        },
        '404': {
          description: \`\${modelName} not found\`
        }
      },
      security: [{ BearerAuth: [] }]
    }
  };
}`

//----------------------------------------------------------------------

export default function SchemaProcessing() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Schema Processing Section Content */}
      <section id="schema-processing">
      <H1>{_('4. Schema Processing')}</H1>
      <P>
        <Translate>
          Schema processing handles the transformation of
        </Translate> <C>.idea</C> <Translate>
          definitions into OpenAPI components and endpoints. This
          includes generating security schemes, creating CRUD endpoints
          for models, and handling complex schema relationships and
          validations.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {securitySchemesExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white'>
        {crudEndpointsExample}
      </Code>
      </section>
    </>
  );
}