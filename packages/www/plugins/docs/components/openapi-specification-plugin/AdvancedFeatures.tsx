//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const advancedConfigExample =
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
}`

//----------------------------------------------------------------------

const formatGenerationExample =
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
}`

//----------------------------------------------------------------------

const exampleGenerationExample =
  `function addExamples(spec: any, schema: any): void {
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
}`

//----------------------------------------------------------------------

const validationExample =
  `function validateSpecification(spec: any): void {
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
      throw new Error(\`Path must start with '/': \${path}\`);
    }
    
    for (const [method, operation] of Object.entries(pathObj)) {
      if (!operation.responses) {
        throw new Error(\`Operation \${method.toUpperCase()} \${path} must have responses\`);
      }
    }
  }
  
  console.log('✅ OpenAPI specification validation passed');
}`

//----------------------------------------------------------------------

const htmlGenerationExample =
`function generateHTMLDocumentation(spec: any): string {
  return \`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${spec.info.title} - API Documentation</title>
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
                spec: \${JSON.stringify(spec, null, 2)},
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
</html>\`;
}`

//----------------------------------------------------------------------

export default function AdvancedFeatures() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Advanced Features Section Content */}
      <section id="advanced-features">
        <H1>{_('5. Advanced Features')}</H1>

        <H2>{_('5.1. Multiple Output Formats')}</H2>
        <P>
          <Translate>
            Multiple output formats allow you to generate OpenAPI
            specifications in JSON, YAML, and HTML formats. This
            flexibility ensures compatibility with different tools and
            enables both machine-readable specifications and human-friendly
            documentation.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white mb-5'>
          {advancedConfigExample}
        </Code>
        <Code copy language='typescript' className='bg-black text-white mb-5'>
          {formatGenerationExample}
        </Code>
        <Code copy language='typescript' className='bg-black text-white mb-5'>
          {exampleGenerationExample}
        </Code>
        <Code copy language='typescript' className='bg-black text-white mb-5'>
          {validationExample}
        </Code>
        <Code copy language='typescript' className='bg-black text-white mb-5'>
          {htmlGenerationExample}
        </Code>
      </section>
    </>
  );
}