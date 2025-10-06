//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C, Code } from '../../../docs/components/index.js';

//code examples
//----------------------------------------------------------------------

const typeNameValidation = 
`function validateTypeName(name: string): void {
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    throw new Error(\`Invalid TypeScript identifier: \${name}\`);
  }
}`

//----------------------------------------------------------------------

const circularReferenceDetection = 
`function detectCircularReferences(
  types: Record<string, any>
): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[] = [];
  
  function visit(typeName: string): void {
    if (recursionStack.has(typeName)) {
      cycles.push(typeName);
      return;
    }
    
    if (visited.has(typeName)) return;
    
    visited.add(typeName);
    recursionStack.add(typeName);
    
    // Check type dependencies...
    
    recursionStack.delete(typeName);
  }
  
  for (const typeName of Object.keys(types)) {
    visit(typeName);
  }
  
  return cycles;
}`

//----------------------------------------------------------------------

const dependencyValidation = 
`function validateTypeDependencies(
  schema: any
): void {
  const availableTypes = new Set([
    ...Object.keys(schema.model || {}),
    ...Object.keys(schema.type || {}),
    ...Object.keys(schema.enum || {})
  ]);
  
  // Validate all type references...
}`

//----------------------------------------------------------------------

const verboseLogging = 
`const VERBOSE = process.env.TS_PLUGIN_VERBOSE === 'true';

function verboseLog(message: string, data?: any) {
  if (VERBOSE) {
    console.log(\`[TypeScript Plugin] \${message}\`, data || '');
  }
}`

//----------------------------------------------------------------------

const typeScriptValidation = 
`import { transpile, ScriptTarget } from 'typescript';

function validateGeneratedTypeScript(content: string): void {
  try {
    transpile(content, {
      target: ScriptTarget.ES2020,
      strict: true
    });
    console.log('✅ Generated TypeScript is valid');
  } catch (error) {
    throw new Error(\`Invalid TypeScript: \${error.message}\`);
  }
}`

//----------------------------------------------------------------------

export default function Troubleshooting() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Troubleshooting Section Content */}
      <section id="troubleshooting">
        <H1>{_('9. Troubleshooting')}</H1>
        <P>
          <Translate>
            This section addresses common issues encountered when generating 
            TypeScript interfaces and provides solutions for debugging and 
            resolving problems. Understanding these troubleshooting techniques 
            helps ensure reliable interface generation.
          </Translate>
        </P>
      </section>

      {/* Common Issues Section Content */}
      <section>
        <H2>{_('Common Issues')}</H2>
        <P>
          <Translate>
            Common issues include invalid TypeScript identifiers, circular 
            type references, and missing dependencies. These problems 
            typically arise from schema complexity or configuration 
            mismatches that can be resolved with proper validation and 
            error handling.
          </Translate>
        </P>

        <section>
          <H2>{_('Invalid TypeScript Names')}</H2>
          <P>
            <Translate>
              Invalid TypeScript names occur when schema identifiers contain 
              characters that are not valid in TypeScript. The plugin should 
              validate and sanitize names to ensure they conform to 
              TypeScript identifier rules.
            </Translate>
          </P>
          <Code lang='typescript'>
            {typeNameValidation}
          </Code>
        </section>

        {/* Circular Type References Section Content */}
        <section>
          <H2>{_('Circular Type References')}</H2>
          <P>
            <Translate>
              Circular type references can cause infinite loops during 
              generation or compilation errors in the generated TypeScript 
              code. Detecting and handling these scenarios is essential for 
              robust type generation.
            </Translate>
          </P>
          <Code lang='typescript'>
            {circularReferenceDetection}
          </Code>
        </section>

        {/* Missing Type Dependencies Section Content */}
        <section>
          <H2>{_('Missing Type Dependencies')}</H2>
          <P>
            <Translate>
              Missing type dependencies occur when a type references another 
              type that doesn't exist in the schema. Validating type 
              dependencies ensures all references are resolvable and prevents 
              compilation errors.
            </Translate>
          </P>
          <Code lang='typescript'>
            {dependencyValidation}
          </Code>
        </section>
      </section>

      {/* Debugging Tips Section Content */}
      <section>
        <H2>{_('Debugging Tips')}</H2>
        <P>
          <Translate>
            Debugging tips help identify and resolve issues during TypeScript 
            interface generation. These techniques provide visibility into 
            the generation process and help diagnose problems with schema 
            processing or output generation.
          </Translate>
        </P>

        {/* Enable Verbose Output Section Content */}
        <section>
          <H2>{_('Enable Verbose Output')}</H2>
          <P>
            <Translate>
              Verbose output provides detailed logging during the generation 
              process, helping identify where issues occur and what data is 
              being processed at each step.
            </Translate>
          </P>
          <Code lang='typescript'>
            {verboseLogging}
          </Code>
        </section>

        {/* Validate Generated TypeScript Section Content */}
        <section>
          <H2>{_('Validate Generated TypeScript')}</H2>
          <P>
            <Translate>
              Validating generated TypeScript ensures that the output is 
              syntactically correct and will compile successfully. This 
              validation step catches generation errors before the code is 
              used in development.
            </Translate>
          </P>
          <Code lang='typescript'>
            {typeScriptValidation}
          </Code>
        </section>
      </section>

      {/* Conclusion Section Content */}
      <section>
        <P>
          <Translate>
            This tutorial provides a comprehensive foundation for creating 
            TypeScript interface generators from <C>.idea</C> files. The 
            generated types can be used throughout your TypeScript projects 
            for compile-time type checking and enhanced IDE support.
          </Translate>
        </P>
      </section>
    </>
  );
}