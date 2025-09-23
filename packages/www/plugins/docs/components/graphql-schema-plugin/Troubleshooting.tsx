import { useLanguage, Translate } from 'r22n';
import { H2, H3, P, Code } from '../index.js';

const invalidGraphQLNamesExample = `function sanitizeGraphQLName(name: string): string {
  // GraphQL names must match /^[_A-Za-z][_0-9A-Za-z]*$/
  return name.replace(/[^_A-Za-z0-9]/g, '_').replace(/^[0-9]/, '_$&');
}`;

const circularDependenciesExample = `function detectCircularDependencies(models: Record<string, any>): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[] = [];
  
  // Implementation for cycle detection...
  
  return cycles;
}`;

const missingRequiredFieldsExample = `function validateRequiredFields(model: any): void {
  if (!model.columns || model.columns.length === 0) {
    throw new Error(\`Model must have at least one column\`);
  }
}`;

const verboseLoggingExample = `const DEBUG = process.env.DEBUG === 'true';

function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(\`[GraphQL Plugin] \${message}\`, data || '');
  }
}`;

const validateGeneratedSchemaExample = `import { buildSchema } from 'graphql';

function validateGeneratedSchema(schemaContent: string): void {
  try {
    buildSchema(schemaContent);
    console.log('✅ Generated GraphQL schema is valid');
  } catch (error) {
    throw new Error(\`Invalid GraphQL schema: \${error.message}\`);
  }
}`;

export default function Troubleshooting() {
  const { _ } = useLanguage();

  return (
    <section id="troubleshooting">
      <H2>{_('Troubleshooting')}</H2>
      <P>
        <Translate>
          This section addresses common issues encountered when generating 
          GraphQL schemas and provides solutions for debugging and resolving 
          problems. Understanding these troubleshooting techniques helps 
          ensure reliable schema generation.
        </Translate>
      </P>

      <H3>{_('Common Issues')}</H3>
      <P>
        <Translate>
          Common issues include invalid GraphQL identifiers, circular 
          dependencies, and missing required fields. These problems typically 
          arise from schema complexity or naming conflicts that can be 
          resolved with proper validation and sanitization.
        </Translate>
      </P>

      <H3>{_('Invalid GraphQL Names')}</H3>
      <P>
        <Translate>
          Invalid GraphQL names occur when schema identifiers contain 
          characters that are not valid in GraphQL. The plugin should validate 
          and sanitize names to ensure they conform to GraphQL naming 
          conventions.
        </Translate>
      </P>
      <Code lang='typescript'>
        {invalidGraphQLNamesExample}
      </Code>

      <H3>{_('Circular Dependencies')}</H3>
      <P>
        <Translate>
          Circular dependencies can cause infinite loops during generation or 
          invalid GraphQL schemas. Detecting and handling these scenarios is 
          essential for robust schema generation, especially with complex type 
          relationships.
        </Translate>
      </P>
      <Code lang='typescript'>
        {circularDependenciesExample}
      </Code>

      <H3>{_('Missing Required Fields')}</H3>
      <P>
        <Translate>
          Missing required fields can result in invalid GraphQL types that 
          fail validation. Ensure all models have proper field definitions 
          and handle edge cases where schema definitions might be incomplete.
        </Translate>
      </P>
      <Code lang='typescript'>
        {missingRequiredFieldsExample}
      </Code>

      <H3>{_('Debugging Tips')}</H3>
      <P>
        <Translate>
          Debugging tips help identify and resolve issues during GraphQL 
          schema generation. These techniques provide visibility into the 
          generation process and help diagnose problems with schema logic or 
          output formatting.
        </Translate>
      </P>

      <H3>{_('Enable Verbose Logging')}</H3>
      <P>
        <Translate>
          Verbose logging provides detailed information about the schema 
          generation process, helping identify where issues occur and what 
          data is being processed at each step.
        </Translate>
      </P>
      <Code lang='typescript'>
        {verboseLoggingExample}
      </Code>

      <H3>{_('Validate Generated Schema')}</H3>
      <P>
        <Translate>
          Validating the generated GraphQL schema ensures that the output is 
          syntactically correct and will work with GraphQL servers and tools. 
          This validation step catches generation errors before deployment.
        </Translate>
      </P>
      <Code lang='typescript'>
        {validateGeneratedSchemaExample}
      </Code>
    </section>
  );
}