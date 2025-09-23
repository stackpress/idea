- MUST ensure all lines of code and MUST NOT exceed 80 characters in length.
- MUST use semantic HTML5 tags <section> where applicable to improve structure and readability.{
  **example**
  <main>
    <H1>{_('Idea Plugins')}</H1>
    <P>
      <Translate>
        The following documentation explains how to develop plugins
        for .idea files. This comprehensive guide covers everything
        from basic plugin structure to advanced development patterns,
        providing developers with the knowledge needed to create
        powerful code generation plugins for the idea ecosystem.
      </Translate>
    </P>
  </main>

  **expected output:**
   <main>
    <section>
      <H1>{_('Idea Plugins')}</H1>
      <P>
        <Translate>
          The following documentation explains how to develop plugins
          for .idea files. This comprehensive guide covers everything
          from basic plugin structure to advanced development patterns,
          providing developers with the knowledge needed to create
          powerful code generation plugins for the idea ecosystem.
        </Translate>
      </P>
    </section>

    <section>
      ...existing code
    </section>
  </main>


}
- **MUST** ensure all user-facing text is wrapped in the Translate component or _() function for proper localization.
- **MUST** use Translate component if the text is in long paragraph and **MUST** use _{('')} if the text is one line or short
- **MUST** use Translate Component to paragraph
- **MUST** keep constants, such as examples or reusable data, outside of the function to improve performance and readability. Make it sepearted and have each name every example
**example**: 
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
`const DEBUG = process.env.DEBUG === 'true';

function debugLog(message: string, data?: any): void {
  if (DEBUG) {
    console.log(\`[DEBUG] \${message}\`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Usage
debugLog('Processing schema', schema);
debugLog('Generated interface', interfaceDeclaration.getText());`,
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

**Expected Output**
const uniqueName = [
  `example code`
]

const anotherName = [
  `example code`
]

- MUST NOT modify the existing logic, functionality, or structure unless it violates the rules above.
- MUST maintain the current formatting and indentation style.
- MUST make sure every line of code checked
- MUST use the translation _('') to H1, H2, H3 and MUST use the <Translate/> component to P, <li>, <Tcol> tags 
- MUST chnage the import of useLanguage, Translate to r22n instead of stackpress/view/client
- MUST remove the _('') in the THead tags and remove class and wrap iut inside Trow {
  example:

  <Thead className="theme-bg-bg2">{_('Property')}</Thead>
  <Thead className="theme-bg-bg2">{_('Property')}</Thead>
  <Thead className="theme-bg-bg2">{_('Property')}</Thead>

  expected output:
  <Trow className="theme-bg-bg1">
    <Thead>Property</Thead>
    <Thead>Property</Thead>
    <Thead>Property</Thead>
  </Trow>
}

- MUST change the <strong> tag to <SS>