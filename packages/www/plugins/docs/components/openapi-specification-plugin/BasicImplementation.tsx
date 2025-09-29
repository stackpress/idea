//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const basicPluginExample = 
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
}`

//----------------------------------------------------------------------

const schemaGenerationExample = 
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
}`

//----------------------------------------------------------------------

const modelSchemaExample = 
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
}`

//----------------------------------------------------------------------

const propertySchemaExample = 
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
}`

//----------------------------------------------------------------------

export default function BasicImplementation() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Basic Implementation Section Content */}
      <section id="basic-implementation">
      <H1>{_('2. Basic Implementation')}</H1>
      <P>
        <Translate>
          The basic implementation provides the foundation for generating
          OpenAPI specifications from
        </Translate> <C>.idea</C> <Translate>
          schema files. This section covers the core plugin structure,
          configuration interface, and essential generation functions
          needed to create functional API documentation.
        </Translate>
      </P>
      <P>
        <Translate>
          Let's start with a basic OpenAPI specification generator:
        </Translate>
      </P>

      <H2>{_('2.1. Plugin Structure')}</H2>
      <P>
        <Translate>
          The plugin structure defines the main entry point and
          configuration interface for the OpenAPI generator. This
          includes type definitions for configuration options, the
          primary plugin function, and the core specification
          generation logic.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {basicPluginExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white'>
        {schemaGenerationExample}
      </Code>

      <H2>{_('2.2. Schema Generation')}</H2>
      <P>
        <Translate>
          Schema generation transforms
        </Translate> <C>.idea</C> <Translate>
          model and type definitions into OpenAPI-compliant schema
          objects. This process includes mapping data types, handling
          validation rules, and creating proper JSON Schema structures
          that integrate with OpenAPI tooling.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {modelSchemaExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white'>
        {propertySchemaExample}
      </Code>
      </section>
    </>
  );
}