import { useLanguage, Translate } from 'r22n';
import { H2, H3, P, Code } from '../index.js';

const typeSafetyExample = `interface GraphQLColumn {
  name: string;
  type: string;
  required: boolean;
  multiple: boolean;
  attributes?: Record<string, any>;
}

function validateColumn(column: any): column is GraphQLColumn {
  return (
    typeof column.name === 'string' &&
    typeof column.type === 'string' &&
    typeof column.required === 'boolean'
  );
}`;

const errorHandlingExample = `function generateTypes(models: Record<string, any>): string {
  try {
    let content = '# Types\\n';
    
    for (const [modelName, model] of Object.entries(models)) {
      if (!model.columns || !Array.isArray(model.columns)) {
        console.warn(\`⚠️  Model \${modelName} has no valid columns\`);
        continue;
      }
      
      content += generateSingleType(modelName, model);
    }
    
    return content;
  } catch (error) {
    throw new Error(\`Failed to generate GraphQL types: \${error.message}\`);
  }
}`;

const configurationValidationExample = `function validateConfig(config: any): asserts config is GraphQLConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('GraphQL plugin requires "output" configuration as string');
  }
  
  if (config.customScalars && typeof config.customScalars !== 'object') {
    throw new Error('customScalars must be an object');
  }
}`;

const performanceOptimizationExample = `// Cache type mappings
const typeCache = new Map<string, string>();

function getCachedType(schemaType: string, customScalars: Record<string, string>): string {
  const cacheKey = \`\${schemaType}:\${JSON.stringify(customScalars)}\`;
  
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey)!;
  }
  
  const mappedType = mapSchemaTypeToGraphQL(schemaType, customScalars);
  typeCache.set(cacheKey, mappedType);
  
  return mappedType;
}`;

export default function BestPractices() {
  const { _ } = useLanguage();

  return (
    <section id="best-practices">
      <H2>{_('Best Practices')}</H2>
      <P>
        <Translate>
          Best practices ensure your generated GraphQL schemas are 
          maintainable, performant, and follow GraphQL conventions. These 
          guidelines cover type safety, error handling, configuration 
          validation, and performance optimization.
        </Translate>
      </P>

      <H3>{_('Type Safety')}</H3>
      <P>
        <Translate>
          Type safety is crucial for preventing runtime errors and ensuring 
          reliable GraphQL schema generation. Always validate input data and 
          use proper TypeScript types throughout the plugin implementation to 
          ensure consistent output.
        </Translate>
      </P>
      <Code lang='typescript'>
        {typeSafetyExample}
      </Code>

      <H3>{_('Error Handling')}</H3>
      <P>
        <Translate>
          Proper error handling ensures that schema generation failures 
          provide clear, actionable feedback to developers. Implement 
          comprehensive error handling patterns and meaningful error messages 
          to improve the debugging experience.
        </Translate>
      </P>
      <Code lang='typescript'>
        {errorHandlingExample}
      </Code>

      <H3>{_('Configuration Validation')}</H3>
      <P>
        <Translate>
          Configuration validation ensures that plugin settings are correct 
          and complete before schema generation begins. This prevents runtime 
          errors and provides early feedback about configuration issues.
        </Translate>
      </P>
      <Code lang='typescript'>
        {configurationValidationExample}
      </Code>

      <H3>{_('Performance Optimization')}</H3>
      <P>
        <Translate>
          Performance optimization techniques help maintain reasonable 
          generation times when working with large schemas. Implement caching 
          strategies and efficient algorithms to ensure the plugin scales well 
          with complex type hierarchies.
        </Translate>
      </P>
      <Code lang='typescript'>
        {performanceOptimizationExample}
      </Code>
    </section>
  );
}