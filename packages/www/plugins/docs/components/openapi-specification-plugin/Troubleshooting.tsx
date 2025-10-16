//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const circularReferencesExample =
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
}`;

//--------------------------------------------------------------------//

const validationErrorsExample =
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
}`;

//--------------------------------------------------------------------//

const dependenciesExample =
  `# Install required dependencies
npm install --save-dev yaml swagger-ui-dist

# For validation
npm install --save-dev swagger-parser

# For code generation
npm install --save-dev @openapitools/openapi-generator-cli`

//--------------------------------------------------------------------//

const performanceOptimizationExample =
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
}\n`;

//--------------------------------------------------------------------//

const debugModeExample =
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
    const spec = await generateOpenAPISpecification(schema, config);
    
    if (config.debug) {
      console.log('Generated schemas:', Object.keys(spec.components.schemas));
      console.log('Generated paths:', Object.keys(spec.paths));
    }
    
    // Validate before writing
    if (config.validation?.strict) {
      await validateOpenAPISpecification(spec);
    }
    
    // Optimize if needed
    const optimizedSpec = config.debug ? 
      await optimizeOpenAPISchema(spec) : spec;
    
    // Generate outputs
    const formats = config.formats || ['json'];
    const outputBase = config.output.replace(/\\.[^.]+$/, '');
    
    for (const format of formats) {
      await generateOpenAPIFormat(optimizedSpec, format, outputBase, transformer);
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
}\n`;

//--------------------------------------------------------------------//

export default function Troubleshooting() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Troubleshooting Section Content */}
      <section id="troubleshooting">
        <H1>{_('8. Troubleshooting')}</H1>
        <P>
          <Translate>
            This section addresses common issues encountered when
            generating OpenAPI specifications and provides solutions
            for debugging and resolving problems. Understanding these
            troubleshooting techniques helps ensure reliable
            specification generation.
          </Translate>
        </P>

        <H2>{_('8.1. Common Issues')}</H2>
        <P>
          <Translate>
            Common issues include schema reference errors, validation
            failures, and performance problems with large specifications.
            These problems typically arise from circular references,
            invalid configurations, or missing dependencies.
          </Translate>
        </P>

        <H2>{_('8.1.1. Schema Reference Errors')}</H2>
        <P>
          <Translate>
            Schema reference errors occur when the generator encounters
            circular dependencies or invalid references between schema
            components. These issues can break the specification
            generation process and require careful handling of schema
            relationships.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {circularReferencesExample}
        </Code>

        <H2>{_('8.1.2. Invalid OpenAPI Format')}</H2>
        <P>
          <Translate>
            Invalid OpenAPI format errors occur when the generated
            specification doesn't conform to OpenAPI standards. These
            validation failures can prevent the specification from
            working with OpenAPI tools and require comprehensive
            validation during generation.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {validationErrorsExample}
        </Code>

        <H2>{_('8.1.3. Missing Dependencies')}</H2>
        <P>
          <Translate>
            Missing dependencies can cause the plugin to fail during
            execution or limit available features. Ensuring all required
            packages are installed and properly configured is essential
            for reliable operation.
          </Translate>
        </P>
        <Code copy language="bash" className="bg-black text-white">
          {dependenciesExample}
        </Code>

        <H2>{_('8.1.4. Performance Issues')}</H2>
        <P>
          <Translate>
            Performance issues can occur when generating specifications
            for large schemas with many models and complex relationships.
            Optimization techniques help maintain reasonable generation
            times and manageable output file sizes.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {performanceOptimizationExample}
        </Code>

        <H2>{_('8.2. Debug Mode')}</H2>
        <P>
          <Translate>
            Debug mode provides detailed logging and diagnostic
            information during specification generation. This feature
            helps identify issues, understand the generation process,
            and optimize plugin configuration for better results.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {debugModeExample}
        </Code>
      </section>
    </>
  );
}