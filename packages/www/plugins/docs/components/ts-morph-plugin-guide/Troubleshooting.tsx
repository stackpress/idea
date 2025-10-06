//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, H3, P } from '../../../docs/components/index.js'
import Code from '../../../docs/components/Code.js'

//code examples
//----------------------------------------------------------------------

const examples = [
`function validateGeneratedCode(sourceFile: SourceFile): void {
  const diagnostics = sourceFile.getPreEmitDiagnostics();
  
  if (diagnostics.length > 0) {
    const errors = diagnostics.map(d => ({
      message: d.getMessageText(),
      line: d.getLineNumber(),
      file: d.getSourceFile()?.getFilePath()
    }));
    
    throw new Error(\`Generated TypeScript has errors: \${JSON.stringify(errors, null, 2)}\`);
  }
}`,

//----------------------------------------------------------------------

`function detectCircularReferences(schemas: Schema[]): string[] {
  const graph = new Map<string, Set<string>>();
  const cycles: string[] = [];
  
  // Build dependency graph
  for (const schema of schemas) {
    const deps = new Set<string>();
    
    for (const prop of Object.values(schema.properties)) {
      if (prop.type && schemas.some(s => s.name === prop.type)) {
        deps.add(prop.type);
      }
    }
    
    graph.set(schema.name, deps);
  }
  
  // Detect cycles using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function hasCycle(node: string): boolean {
    if (recursionStack.has(node)) {
      cycles.push(node);
      return true;
    }
    
    if (visited.has(node)) {
      return false;
    }
    
    visited.add(node);
    recursionStack.add(node);
    
    const deps = graph.get(node) || new Set();
    for (const dep of deps) {
      if (hasCycle(dep)) {
        return true;
      }
    }
    
    recursionStack.delete(node);
    return false;
  }
  
  for (const schema of schemas) {
    hasCycle(schema.name);
  }
  
  return cycles;
}`,

//----------------------------------------------------------------------

`class StreamingGenerator {
  async generateLargeSchema(schemas: Schema[]): Promise<void> {
    const batchSize = 10;
    
    for (let i = 0; i < schemas.length; i += batchSize) {
      const batch = schemas.slice(i, i + batchSize);
      
      // Process batch
      await this.processBatch(batch);
      
      // Clear memory
      if (global.gc) {
        global.gc();
      }
    }
  }
  
  private async processBatch(schemas: Schema[]): Promise<void> {
    // Process smaller batches to avoid memory issues
  }
}`,

//----------------------------------------------------------------------

`const DEBUG = process.env.DEBUG === 'true';

function debugLog(message: string, data?: any): void {
  if (DEBUG) {
    console.log(\`[DEBUG] \${message}\`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Usage
debugLog('Processing schema', schema);
debugLog('Generated interface', interfaceDeclaration.getText());`,

//----------------------------------------------------------------------

`async function saveIntermediateResults(
  sourceFile: SourceFile,
  step: string
): Promise<void> {
  if (process.env.SAVE_INTERMEDIATE === 'true') {
    const outputPath = \`debug-\${step}-\${Date.now()}.ts\`;
    await fs.writeFile(outputPath, sourceFile.getFullText());
    console.log(\`Saved intermediate result: \${outputPath}\`);
  }
}`,

//----------------------------------------------------------------------

`function validateStep(
  sourceFile: SourceFile,
  stepName: string
): void {
  try {
    const diagnostics = sourceFile.getPreEmitDiagnostics();
    if (diagnostics.length > 0) {
      throw new Error(\`Step \${stepName} produced invalid TypeScript\`);
    }
    console.log(\`✅ Step \${stepName} completed successfully\`);
  } catch (error) {
    console.error(\`❌ Step \${stepName} failed:\`, error.message);
    throw error;
  }
}`
];

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
            Troubleshooting guides help developers quickly identify and 
            resolve common issues encountered during plugin development. 
            This section covers validation, debugging techniques, and 
            solutions for typical problems.
          </Translate>
        </P>
      </section>

      {/* Common Issues Section Content */}
      <section> 
        <H2>{_('9.1. Common Issues')}</H2>
        <P>
          <Translate>
            Common issues in ts-morph plugin development typically involve 
            syntax validation, circular references, and memory management. 
            Understanding these patterns helps prevent and resolve problems 
            efficiently.
          </Translate>
        </P>

        <H3>{_('9.1.1. Invalid TypeScript Syntax')}</H3>
        <P>
          <Translate>
            Invalid TypeScript syntax can break the compilation process and 
            prevent your plugin from generating usable code. Implement 
            validation checks to catch syntax errors early in the generation 
            process.
          </Translate>
        </P>
        <Code copy language='typescript' className="bg-black text-white">
          {examples[0]}
        </Code>

        <H3>{_('9.1.2. Circular Type References')}</H3>
        <P>
          <Translate>
            Circular type references can cause infinite loops and compilation 
            errors. Detecting and handling these scenarios is crucial for 
            plugins that work with complex, interconnected data structures.
          </Translate>
        </P>
        <Code copy language='typescript' className="bg-black text-white">
          {examples[1]}
        </Code>

        <H3>{_('9.1.3. Memory Issues with Large Schemas')}</H3>
        <P>
          <Translate>
            Memory management becomes important when processing large schemas 
            or generating substantial amounts of code. Implement streaming 
            and batching strategies to handle large-scale generation 
            efficiently.
          </Translate>
        </P>
        <Code copy language='typescript' className="bg-black text-white">
          {examples[2]}
        </Code>
      </section>

      {/* Debugging Techniques Section Content */}
      <section>
        <H2>{_('9.2. Debugging Tips')}</H2>
        <P>
          <Translate>
            Effective debugging techniques help identify issues quickly and 
            understand the plugin's behavior during development. These tools 
            and strategies provide visibility into the generation process.
          </Translate>
        </P>

        <H3>{_('9.2.1. Enable Verbose Logging')}</H3>
        <P>
          <Translate>
            Verbose logging provides detailed information about the plugin's 
            execution flow, helping identify where issues occur and what data 
            is being processed at each step.
          </Translate>
        </P>
        <Code copy language='typescript' className="bg-black text-white">
          {examples[3]}
        </Code>

        <H3>{_('9.2.2. Save Intermediate Results')}</H3>
        <P>
          <Translate>
            Saving intermediate results allows you to inspect the code 
            generation process at different stages, making it easier to 
            identify where problems occur and verify that each step produces 
            the expected output.
          </Translate>
        </P>
        <Code copy language='typescript' className="bg-black text-white">
          {examples[4]}
        </Code>

        <H3>{_('9.2.3. Validate Each Step')}</H3>
        <P>
          <Translate>
            Step-by-step validation ensures that each phase of the generation 
            process produces valid TypeScript code, helping catch issues early 
            before they compound into larger problems.
          </Translate>
        </P>
        <Code copy language='typescript' className="bg-black text-white">
          {examples[5]}
        </Code>
      </section>
    </>
  )
}
