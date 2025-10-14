//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const configurationExample =
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
}`;

//-----------------------------------------------------------------

export default function ConfigurationOptions() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Configuration Options Section Content */}
      <section id="configuration-options">
      <H1>{_('3. Configuration Options')}</H1>
      <P>
        <Translate>
          Configuration options control how the OpenAPI specification
          is generated, including output formats, API metadata, server
          definitions, and security schemes. Proper configuration
          ensures the generated documentation meets your specific
          requirements and integrates with your development workflow.
        </Translate>
      </P>
      <Code copy language="idea" className="bg-black text-white">
        {configurationExample}
      </Code>
      </section>
    </>
  );
}