//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const basicUsageExample = 
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
}`

//----------------------------------------------------------------------

const advancedUsageExample = 
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
}`

//----------------------------------------------------------------------

const cliIntegrationExample = 
`# Generate OpenAPI specification
npm run transform

# Serve documentation locally
npx swagger-ui-serve docs/api-spec.json

# Validate specification
npx swagger-codegen validate -i docs/api-spec.json

# Generate client SDKs
npx swagger-codegen generate -i docs/api-spec.json -l typescript-fetch -o ./sdk/typescript
npx swagger-codegen generate -i docs/api-spec.json -l python -o ./sdk/python`

//----------------------------------------------------------------------

export default function UsageExamples() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Usage Examples Section Content */}
      <section id="usage-examples">
      <H1>{_('6. Usage Examples')}</H1>
      <P>
        <Translate>
          Usage examples demonstrate practical applications of the
          OpenAPI generator plugin with real-world scenarios. These
          examples show how to configure the plugin for different
          use cases and integrate the generated documentation into
          your development workflow.
        </Translate>
      </P>

      <H2>{_('6.1. Basic Usage')}</H2>
      <P>
        <Translate>
          Basic usage examples show the fundamental configuration
          needed to generate OpenAPI specifications from simple
        </Translate> <C>.idea</C> <Translate>
          schemas. This includes model definitions, plugin
          configuration, and the resulting API documentation structure.
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {basicUsageExample}
      </Code>

      <H2>{_('6.2. Advanced Configuration')}</H2>
      <P>
        <Translate>
          Advanced configuration demonstrates comprehensive plugin
          setup with multiple output formats, detailed API metadata,
          custom endpoints, and security schemes. This example shows
          how to create production-ready API documentation with full
          feature coverage.
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {advancedUsageExample}
      </Code>

      <H2>{_('6.3. CLI Integration')}</H2>
      <P>
        <Translate>
          CLI integration shows how to incorporate the OpenAPI
          generator into your development workflow using command-line
          tools. This includes generating specifications, serving
          documentation locally, and integrating with API development
          tools.
        </Translate>
      </P>
      <Code copy language='bash' className='bg-black text-white'>
        {cliIntegrationExample}
      </Code>
      </section>
    </>
  );
}