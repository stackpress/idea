import { useLanguage, Translate } from 'r22n';
import { H2, H3, P, Code } from '../index.js';

const typeSafetyInterface = 
`interface TypeScriptColumn {
  name: string;
  type: string;
  required: boolean;
  multiple: boolean;
  description?: string;
  attributes?: Record<string, any>;
}`;

const columnValidation = 
`function validateColumn(column: any): column is TypeScriptColumn {
  return (
    typeof column.name === 'string' &&
    typeof column.type === 'string' &&
    typeof column.required === 'boolean'
  );
}`;

const typeNameSanitization = 
`function sanitizeTypeName(name: string): string {
  // Ensure TypeScript-valid names
  return name
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&')
    .replace(/^_+|_+$/g, '');
}`;

const pascalCaseConversion = 
`function toPascalCase(str: string): string {
  return str
    .split(/[-_\\s]+/)
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}`;

const jsDocGeneration = 
`function generateJSDocComment(
  column: any, 
  includeAttributes: boolean = true
): string {
  const lines: string[] = [];
  
  if (column.description) {
    lines.push(column.description);
  }
  
  if (includeAttributes && column.attributes) {
    if (column.attributes.default) {
      lines.push(\`@default \${column.attributes.default}\`);
    }
    if (column.attributes.example) {
      lines.push(\`@example \${column.attributes.example}\`);
    }
  }
  
  if (lines.length === 0) return '';
  
  if (lines.length === 1) {
    return \`  /** \${lines[0]} */\\n\`;
  }
  
  return \`  /**\\n\${lines.map(line => 
    \`   * \${line}\`).join('\\n')}\\n   */\\n\`;
}`;

const typeCacheOptimization = 
`// Cache type mappings
const typeCache = new Map<string, string>();

function getCachedTypeMapping(
  schemaType: string, 
  strictNullChecks: boolean
): string {
  const cacheKey = \`\${schemaType}:\${strictNullChecks}\`;
  
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey)!;
  }
  
  const mappedType = mapSchemaTypeToTypeScript(
    schemaType, 
    strictNullChecks
  );
  typeCache.set(cacheKey, mappedType);
  
  return mappedType;
}`;

export default function BestPractices() {
  const { _ } = useLanguage();

  return (
    <main>
      <section id="best-practices">
        <H2>{_('Best Practices')}</H2>
        <P>
          <Translate>
            Best practices ensure your generated TypeScript interfaces are 
            maintainable, reliable, and follow industry standards. These 
            guidelines cover type safety, naming conventions, documentation 
            generation, and performance optimization.
          </Translate>
        </P>
      </section>

      <section>
        <H3>{_('Type Safety')}</H3>
        <P>
          <Translate>
            Type safety is crucial for preventing runtime errors and 
            improving developer experience. Always validate input data and 
            use proper TypeScript types throughout the plugin implementation 
            to ensure reliable code generation.
          </Translate>
        </P>
        <Code lang='typescript'>
          {typeSafetyInterface}
        </Code>
        <Code lang='typescript'>
          {columnValidation}
        </Code>
      </section>

      <section>
        <H3>{_('Naming Conventions')}</H3>
        <P>
          <Translate>
            Naming conventions ensure that generated TypeScript identifiers 
            are valid and follow established patterns. Proper naming improves 
            code readability and prevents conflicts with reserved keywords 
            or invalid characters.
          </Translate>
        </P>
        <Code lang='typescript'>
          {typeNameSanitization}
        </Code>
        <Code lang='typescript'>
          {pascalCaseConversion}
        </Code>
      </section>

      <section>
        <H3>{_('Documentation Generation')}</H3>
        <P>
          <Translate>
            Documentation generation creates comprehensive JSDoc comments that 
            provide context and examples for the generated types. This 
            improves the developer experience by providing inline 
            documentation in IDEs and code editors.
          </Translate>
        </P>
        <Code lang='typescript'>
          {jsDocGeneration}
        </Code>
      </section>

      <section>
        <H3>{_('Performance Optimization')}</H3>
        <P>
          <Translate>
            Performance optimization techniques help maintain reasonable 
            generation times when working with large schemas. Caching 
            strategies and efficient algorithms ensure the plugin scales 
            well with complex type hierarchies.
          </Translate>
        </P>
        <Code lang='typescript'>
          {typeCacheOptimization}
        </Code>
      </section>
    </main>
  );
}