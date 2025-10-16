//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const examples = [
  `interface PluginOptions {
  readonly input: string;
  readonly output: string;
  readonly strict?: boolean;
}

function validateOptions(options: unknown): asserts options is PluginOptions {
  if (typeof options !== 'object' || options === null) {
    throw new Error('Options must be an object');
  }
  
  const opts = options as Record<string, unknown>;
  
  if (typeof opts.input !== 'string') {
    throw new Error('input must be a string');
  }
  
  if (typeof opts.output !== 'string') {
    throw new Error('output must be a string');
  }
}`,

  //------------------------------------------------------------------//

  `class PluginError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

async function safeGenerate(config: PluginConfig): Promise<void> {
  try {
    await generator.generate();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new PluginError(
        'Invalid JSON in input file',
        'INVALID_JSON',
        { originalError: error.message }
      );
    }
    
    if (error.code === 'ENOENT') {
      throw new PluginError(
        'Input file not found',
        'FILE_NOT_FOUND',
        { path: config.input }
      );
    }
    
    throw error;
  }
}`,

  //------------------------------------------------------------------//

  `class OptimizedGenerator {
  private typeCache = new Map<string, string>();
  private interfaceCache = new Map<string, InterfaceDeclaration>();

  private getCachedType(property: SchemaProperty): string {
    const cacheKey = JSON.stringify(property);
    
    if (this.typeCache.has(cacheKey)) {
      return this.typeCache.get(cacheKey)!;
    }
    
    const type = this.mapSchemaTypeToTypeScript(property);
    this.typeCache.set(cacheKey, type);
    
    return type;
  }

  private batchAddProperties(
    interfaceDecl: InterfaceDeclaration,
    properties: Record<string, SchemaProperty>
  ): void {
    const propertyStructures = Object.entries(properties).map(([name, prop]) => ({
      name,
      type: this.getCachedType(prop),
      hasQuestionToken: !prop.required,
    }));

    interfaceDecl.addProperties(propertyStructures);
  }
}`,

  //------------------------------------------------------------------//

  `// generators/interface-generator.ts
export class InterfaceGenerator {
  generate(schema: Schema): InterfaceDeclaration {
    // Interface-specific logic
  }
}

// generators/type-generator.ts
export class TypeGenerator {
  generate(schema: Schema): TypeAliasDeclaration {
    // Type alias-specific logic
  }
}

// generators/enum-generator.ts
export class EnumGenerator {
  generate(schema: EnumSchema): EnumDeclaration {
    // Enum-specific logic
  }
}

// main-plugin.ts
export class MainPlugin {
  constructor(
    private interfaceGenerator: InterfaceGenerator,
    private typeGenerator: TypeGenerator,
    private enumGenerator: EnumGenerator
  ) {}

  async generate(config: PluginConfig): Promise<void> {
    // Orchestrate all generators
  }
}`,

  //------------------------------------------------------------------//

  `function generateJSDocComment(
  property: SchemaProperty,
  includeExamples: boolean = true
): string {
  const parts: string[] = [];
  
  if (property.description) {
    parts.push(property.description);
  }
  
  if (property.default !== undefined) {
    parts.push(\`@default \${JSON.stringify(property.default)}\`);
  }
  
  if (includeExamples && property.example) {
    parts.push(\`@example \${property.example}\`);
  }
  
  if (property.deprecated) {
    parts.push(\`@deprecated \${property.deprecated}\`);
  }
  
  return parts.length > 0 ? parts.join('\\n') : '';
}`
];

//--------------------------------------------------------------------//

export default function BestPractices() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Best Practices Section Content */}
      <section id="best-practices">
        <H1>{_('8. Best Practices')}</H1>
        <P>
          <Translate>
            Following best practices ensures your plugins are maintainable,
            performant, and reliable in production environments. These
            guidelines cover type safety, error handling, performance
            optimization, and code organization strategies.
          </Translate>
        </P>

        <H2>{_('8.1. Type Safety')}</H2>
        <P>
          <Translate>
            Type safety is fundamental to building reliable plugins
            that catch errors at compile time rather than runtime.
            Always use TypeScript interfaces and proper type validation
            throughout your plugin implementation.
          </Translate>
        </P>
        <P>
          <Translate>
            Always use TypeScript interfaces for your plugin 
            configuration and data structures:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[0]}
        </Code>

        <H2>{_('8.2. Error Handling')}</H2>
        <P>
          <Translate>
            Comprehensive error handling provides clear feedback to
            users and helps with debugging when things go wrong.
            Implement custom error types and meaningful error 
            messages to improve the developer experience.
          </Translate>
        </P>
        <P>
          <Translate>
            Implement comprehensive error handling:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[1]}
        </Code>

        <H2>{_('8.3. Performance Optimization')}</H2>
        <P>
          <Translate>
            Performance optimization becomes crucial when dealing
            with large schemas or generating substantial amounts of
            code. Implement caching strategies and batch processing
            to maintain reasonable execution times.
          </Translate>
        </P>
        <P>
          <Translate>
            For large schemas, optimize performance:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[2]}
        </Code>

        <H2>{_('8.4. Code Organization')}</H2>
        <P>
          <Translate>
            Proper code organization makes your plugin easier to
            maintain, test, and extend. Separate concerns into focused
            classes and modules that each handle specific aspects of
            the generation process.
          </Translate>
        </P>
        <P>
          <Translate>
            Structure your plugin code for maintainability:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[3]}
        </Code>

        <H2>{_('8.5. Documentation Generation')}</H2>
        <P>
          <Translate>
            Documentation generation ensures your generated code is
            self-documenting and provides valuable context for developers.
            Implement comprehensive JSDoc comment generation with examples
            and type information.
          </Translate>
        </P>
        <P>
          <Translate>
            Add comprehensive JSDoc comments:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[4]}
        </Code>
      </section>
    </>
  )
}
