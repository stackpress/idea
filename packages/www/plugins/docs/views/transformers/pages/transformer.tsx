//modules
import type {
    ServerConfigProps,
    ServerPageProps
  } from 'stackpress/view/client';
  import { useLanguage } from 'stackpress/view/client';
  //docs
  import { H1, H2, H3, H4, P, C, Nav, SS } from '../../../components/index.js';
  import Code from '../../../components/Code.js';
  import Layout from '../../../components/Layout.js';
  import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
  
  export function Head(props: ServerPageProps<ServerConfigProps>) {
    //props
    const { request, styles = [] } = props;
    //hooks
    const { _ } = useLanguage();
    //variables
    const title = _('Transformer');
    const description = _(
      'A class for loading, processing, and transforming schema files with plugin support and schema merging capabilities'
    );
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content="/images/icon.png" />
        <meta property="og:url" content={request.url.pathname} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:image" content="/images/icon.png" />
  
        <link rel="icon" type="image/x-icon" href="/icon.png" />
        <link rel="stylesheet" type="text/css" href="/styles/global.css" />
        {styles.map((href, index) => (
          <link key={index} rel="stylesheet" type="text/css" href={href} />
        ))}
      </>
    )
  }
  
  export function Right() {
    const { _ } = useLanguage();
    return (
      <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
        <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
          {_('Transformer')}
        </h6>
        <nav className="px-m-14 px-lh-32">
          <a className="text-blue-500 block cursor-pointer underline" href="#1-overview">
            {_('1. Overview')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="#2-loading-a-transformer">
            {_('2. Loading a Transformer')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="#3-properties">
            {_('3. Properties')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="#4-methods">
            {_('4. Methods')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="#5-usage-examples">
            {_('5. Usage Examples')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="#6-error-scenarios">
            {_('6. Error Scenarios')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="#7-best-practices">
            {_('7. Best Practices')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="#8-integration-with-other-tools">
            {_('8. Integration with Other Tools')}
          </a>
        </nav>
      </menu>
    );
  }
  
  const basicExample = [
    `import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();`
  ];
  
  const loadExample = [
    `import Transformer from '@stackpress/idea-transformer';

// Load with default options
const transformer = await Transformer.load('./schema.idea');

// Load with custom options
const transformer = await Transformer.load('./schema.idea', {
  cwd: '/custom/working/directory',
  fs: customFileSystem
});`
  ];
  
  const schemaExample = [
    `const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();

console.log(schema.model); // Access model definitions
console.log(schema.enum); // Access enum definitions
console.log(schema.type); // Access type definitions
console.log(schema.prop); // Access prop definitions
console.log(schema.plugin); // Access plugin configurations`
  ];
  
  const transformExample = [
    `const transformer = await Transformer.load('./schema.idea');

// Transform with no additional context
await transformer.transform();

// Transform with additional context
await transformer.transform({
  outputDir: './generated',
  debug: true
});`
  ];
  
  const pluginContextExample = [
    `{
  transformer: Transformer,  // The transformer instance
  config: PluginConfig,      // Plugin-specific configuration
  schema: SchemaConfig,      // Complete processed schema
  cwd: string,              // Current working directory
  ...extras                 // Any additional context passed to transform()
}`
  ];
  
  const basicSchemaLoadingExample = [
    `import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();

// Access different parts of the schema
console.log('Models:', Object.keys(schema.model || {}));
console.log('Enums:', Object.keys(schema.enum || {}));
console.log('Types:', Object.keys(schema.type || {}));`
  ];
  
  const multipleSchemaFilesExample = [
    `// main.idea
/*
use "./shared/types.idea"
use "./shared/enums.idea"

model User {
  id String @id
  profile Profile  // From shared/types.idea
  role UserRole    // From shared/enums.idea
}
*/

const transformer = await Transformer.load('./main.idea');
const schema = await transformer.schema();

// The schema now includes definitions from all imported files
console.log(schema.type?.Profile);  // Available from shared/types.idea
console.log(schema.enum?.UserRole); // Available from shared/enums.idea`
  ];
  
  const pluginDevelopmentExample = [
    `// schema.idea
/*
plugin "./plugins/generate-types.js" {
  output "./generated/types.ts"
  format "typescript"
}
*/

// plugins/generate-types.js
export default function generateTypes({ transformer, config, schema, cwd }) {
  const outputPath = config.output;
  const format = config.format;
  
  // Generate TypeScript types based on schema
  let content = '';
  
  if (schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      content += \`export interface \${name} {\n\`;
      for (const column of model.columns) {
        const optional = column.required ? '' : '?';
        content += \`  \${column.name}\${optional}: \${column.type};\n\`;
      }
      content += '}\n\n';
    }
  }
  
  // Write generated content to file
  await writeFile(path.resolve(cwd, outputPath), content);
}

// Execute the transformation
const transformer = await Transformer.load('./schema.idea');
await transformer.transform({
  timestamp: new Date().toISOString()
});`
  ];
  
  const errorHandlingExample = [
    `import { Exception } from '@stackpress/idea-parser';

try {
  const transformer = await Transformer.load('./schema.idea');
  const schema = await transformer.schema();
  await transformer.transform();
} catch (error) {
  if (error instanceof Exception) {
    console.error('Schema processing error:', error.message);
    console.error('Error code:', error.code);
  } else {
    console.error('Unexpected error:', error);
  }
}`
  ];
  
  const customFileSystemExample = [
    `import { NodeFS } from '@stackpress/lib';

// Using custom file system
const customFS = new NodeFS();
const transformer = await Transformer.load('./schema.idea', {
  fs: customFS,
  cwd: '/custom/working/directory'
});`
  ];
  
  const fileNotFoundExample = [
    `// Throws: "Input file /path/to/nonexistent.idea does not exist"
const transformer = await Transformer.load('./nonexistent.idea');
await transformer.schema(); // Error thrown here`
  ];
  
  const noPluginsExample = [
    `// If schema has no plugins defined
const transformer = await Transformer.load('./schema-without-plugins.idea');
await transformer.transform(); // Throws: "No plugins defined in schema file"`
  ];
  
  const invalidPluginExample = [
    `// If plugin file doesn't export a function
const transformer = await Transformer.load('./schema.idea');
await transformer.transform(); // Plugin is silently skipped if not a function`
  ];
  
  const schemaOrganizationExample = [
    `// Organize schemas hierarchically
// shared/base.idea - Common types and enums
// modules/user.idea - User-specific models
// main.idea - Main schema that imports others

use "./shared/base.idea"
use "./modules/user.idea"

// Additional models specific to this schema
model Application {
  id String @id
  users User[]
}`
  ];
  
  const pluginDevelopmentBestPracticeExample = [
    `// Always validate plugin configuration
export default async function myPlugin({ config, schema, transformer, cwd }) {
  // Validate required configuration
  if (!config.output) {
    throw new Error('Plugin requires output configuration');
  }
  
  // Use transformer's file loader for consistent path resolution
  const outputPath = await transformer.loader.absolute(config.output);
  
  // Process schema safely
  const models = schema.model || {};
  const enums = schema.enum || {};
  
  // Generate output...
}`
  ];
  
  const errorRecoveryExample = [
    `// Implement graceful error handling
async function processSchema(schemaPath) {
  try {
    const transformer = await Transformer.load(schemaPath);
    const schema = await transformer.schema();
    await transformer.transform();
    return { success: true, schema };
  } catch (error) {
    console.error(\`Failed to process \${schemaPath}:\`, error.message);
    return { success: false, error: error.message };
  }
}`
  ];
  
  const buildSystemIntegrationExample = [
    `// Integration with build tools
import Transformer from '@stackpress/idea-transformer';

export async function buildSchemas(inputDir, outputDir) {
  const schemaFiles = await glob(\`\${inputDir}/**/*.idea\`);
  
  for (const schemaFile of schemaFiles) {
    const transformer = await Transformer.load(schemaFile);
    await transformer.transform({ outputDir });
  }
}`
  ];
  
  const testingExample = [
    `// Testing schema transformations
import { expect } from 'chai';

describe('Schema Transformation', () => {
  it('should process schema correctly', async () => {
    const transformer = await Transformer.load('./test-schema.idea');
    const schema = await transformer.schema();
    
    expect(schema.model).to.have.property('User');
    expect(schema.model.User.columns).to.have.length.greaterThan(0);
  });
});`
  ];
  
  export function Body() {
    return (
      <main className="px-h-100-0 overflow-auto px-p-10">
        <H1>Transformer</H1>
        <P>
          A class for loading, processing, and transforming schema files with plugin support and schema merging capabilities. The Transformer class serves as the core component of the idea-transformer library, providing comprehensive functionality for schema processing, plugin execution, and file management.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {basicExample[0]}
        </Code>

        <div id="1-overview"></div>
        <H2>Overview</H2>
        <P>
          The Transformer class provides a comprehensive solution for processing schema files and executing transformations. This section outlines the core capabilities and responsibilities of the Transformer class within the idea-transformer ecosystem.
        </P>

        <P>
          The <C>Transformer</C> class is the core component of the idea-transformer library. It handles:
        </P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Loading schema files (both <C>.idea</C> and <C>.json</C> formats)</li>
          <li className="my-2">Processing and merging schema configurations from multiple files</li>
          <li className="my-2">Executing plugins defined in the schema</li>
          <li className="my-2">Managing file dependencies and imports</li>
        </ul>

        <div id="2-loading-a-transformer"></div>
        <H2>Loading a Transformer</H2>
        <P>
          The load method creates a new Transformer instance configured with the specified input file and options. This is the primary way to create a transformer and begin working with schema files.
        </P>

        <P>
          The following example shows how to create a new Transformer instance.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {loadExample[0]}
        </Code>

        <H2>Parameters</H2>

        <Table className="text-left">
          <Thead className="theme-bg-bg2">Parameter</Thead>
          <Thead className="theme-bg-bg2">Type</Thead>
          <Thead className="theme-bg-bg2">Description</Thead>
          <Trow>
            <Tcol className="font-bold"><C>input</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>Path to the schema file to load</Tcol>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>options</C></Tcol>
            <Tcol><C>FileLoaderOptions</C></Tcol>
            <Tcol>Optional configuration for file loading</Tcol>
          </Trow>
        </Table>

        <H2>Returns</H2>
        <P>
          A promise that resolves to a new Transformer instance configured with the specified input file and options.
        </P>

        <div id="3-properties"></div>
        <H2>Properties</H2>
        <P>
          The properties section describes the instance variables available on Transformer objects. These properties provide access to the underlying file system operations and configuration details needed for schema processing.
        </P>

        <H2>Properties</H2>
        <P>
          The following properties are available when instantiating a Transformer.
        </P>

        <Table className="text-left">
          <Thead className="theme-bg-bg2">Property</Thead>
          <Thead className="theme-bg-bg2">Type</Thead>
          <Thead className="theme-bg-bg2">Description</Thead>
          <Trow>
            <Tcol className="font-bold"><C>loader</C></Tcol>
            <Tcol><C>FileLoader</C></Tcol>
            <Tcol>File system loader for handling file operations</Tcol>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>input</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>Absolute path to the input schema file</Tcol>
          </Trow>
        </Table>

        <div id="4-methods"></div>
        <H2>Methods</H2>
        <P>
          The methods section covers the instance methods available on Transformer objects. These methods provide the core functionality for loading schema configurations, processing dependencies, and executing plugin transformations.
        </P>

        <H2>Loading Schema Configuration</H2>
        <P>
          The schema method loads and processes the complete schema configuration, including all dependencies and imports. This method handles the complex process of merging multiple schema files and resolving all references.
        </P>

        <P>
          The following example shows how to load and process the schema configuration.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {schemaExample[0]}
        </Code>

        <H2>Returns</H2>
        <P>
          A promise that resolves to a <C>SchemaConfig</C> object containing all processed schema definitions.
        </P>

        <H2>Features</H2>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2"><strong>File Format Support:</strong> Automatically detects and handles both <C>.idea</C> and <C>.json</C> schema files</li>
          <li className="my-2"><strong>Dependency Resolution:</strong> Processes <C>use</C> directives to import and merge external schema files</li>
          <li className="my-2"><strong>Schema Merging:</strong> Intelligently merges child schemas into parent schemas based on mutability rules</li>
          <li className="my-2"><strong>Caching:</strong> Caches the processed schema to avoid redundant processing</li>
        </ul>

        <H2>Schema Merging Rules</H2>
        <P>
          When processing <C>use</C> directives, the transformer applies these merging rules:
        </P>

        <ol className="list-decimal pl-6 my-4">
          <li className="my-2"><strong>Props and Enums:</strong> Simple merge where parent takes precedence</li>
          <li className="my-2"><strong>Types and Models:</strong>
            <ul className="list-disc pl-6 my-2">
              <li>If parent doesn't exist or is immutable: child is added</li>
              <li>If parent is mutable: attributes and columns are merged</li>
              <li>Child columns are prepended to parent columns</li>
              <li>Parent attributes take precedence over child attributes</li>
            </ul>
          </li>
        </ol>

        <H2>Transforming with Plugins</H2>
        <P>
          The transform method executes all plugins defined in the schema configuration. This method coordinates the plugin execution process, providing each plugin with the necessary context and handling any errors that occur during transformation.
        </P>

        <P>
          The following example shows how to execute all plugins defined in the schema.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {transformExample[0]}
        </Code>

        <H2>Parameters</H2>

        <Table className="text-left">
          <Thead className="theme-bg-bg2">Parameter</Thead>
          <Thead className="theme-bg-bg2">Type</Thead>
          <Thead className="theme-bg-bg2">Description</Thead>
          <Trow>
            <Tcol className="font-bold"><C>extras</C></Tcol>
            <Tcol><C>T</C></Tcol>
            <Tcol>Optional additional context to pass to plugins</Tcol>
          </Trow>
        </Table>

        <H2>Returns</H2>
        <P>
          A promise that resolves when all plugins have been executed.
        </P>

        <H2>Plugin Execution Process</H2>
        <ol className="list-decimal pl-6 my-4">
          <li className="my-2"><strong>Validation:</strong> Ensures plugins are defined in the schema</li>
          <li className="my-2"><strong>Module Resolution:</strong> Resolves plugin file paths relative to the schema file</li>
          <li className="my-2"><strong>Dynamic Import:</strong> Loads plugin modules dynamically</li>
          <li className="my-2"><strong>Context Injection:</strong> Passes context including transformer, schema, config, and extras</li>
          <li className="my-2"><strong>Execution:</strong> Calls each plugin function with the injected context</li>
        </ol>

        <H2>Plugin Context</H2>
        <P>
          Each plugin receives a context object with the following properties:
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {pluginContextExample[0]}
        </Code>

        <div id="5-usage-examples"></div>
        <H2>Usage Examples</H2>
        <P>
          This section provides practical examples of how to use the Transformer class in various scenarios. These examples demonstrate common patterns and best practices for working with schema files, plugins, and transformations.
        </P>

        <H2>Basic Schema Loading</H2>
        <P>
          Basic schema loading demonstrates the fundamental workflow for loading and accessing schema configurations. This example shows how to create a transformer instance and retrieve different parts of the processed schema.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {basicSchemaLoadingExample[0]}
        </Code>

        <H2>Working with Multiple Schema Files</H2>
        <P>
          Working with multiple schema files shows how the Transformer handles complex schema hierarchies with imports and dependencies. This example demonstrates how the use directive enables modular schema organization.
        </P>

        <Code copy language='idea' className='bg-black text-white'>
          {multipleSchemaFilesExample[0]}
        </Code>

        <H2>Plugin Development and Execution</H2>
        <P>
          Plugin development and execution demonstrates how to create and use plugins with the Transformer. This example shows both the schema configuration and plugin implementation, illustrating the complete plugin workflow.
        </P>

        <Code copy language='idea' className='bg-black text-white'>
          {pluginDevelopmentExample[0]}
        </Code>

        <H2>Error Handling</H2>
        <P>
          Error handling examples show how to properly catch and handle different types of errors that can occur during schema processing and transformation. This includes both expected errors from the idea-parser and unexpected runtime errors.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {errorHandlingExample[0]}
        </Code>

        <H2>Custom File System</H2>
        <P>
          Custom file system usage demonstrates how to configure the Transformer to work with different file system implementations. This is useful for testing, custom storage backends, or specialized deployment scenarios.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {customFileSystemExample[0]}
        </Code>

        <div id="6-error-scenarios"></div>
        <H2>Error Scenarios</H2>
        <P>
          This section covers common error conditions that can occur when using the Transformer class. Understanding these scenarios helps developers implement proper error handling and debugging strategies.
        </P>

        <H2>File Not Found</H2>
        <P>
          File not found errors occur when the specified schema file doesn't exist or isn't accessible. This section shows how these errors are reported and how to handle them appropriately.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {fileNotFoundExample[0]}
        </Code>

        <H2>No Plugins Defined</H2>
        <P>
          No plugins defined errors occur when attempting to execute transformations on schemas that don't have any plugin configurations. This section explains when this error occurs and how to handle it.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {noPluginsExample[0]}
        </Code>

        <H2>Invalid Plugin Module</H2>
        <P>
          Invalid plugin module scenarios occur when plugin files exist but don't export the expected function interface. This section covers how the Transformer handles these situations and what developers should expect.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {invalidPluginExample[0]}
        </Code>

        <div id="7-best-practices"></div>
        <H2>Best Practices</H2>
        <P>
          This section outlines recommended approaches for using the Transformer class effectively. Following these practices helps ensure reliable, maintainable, and efficient schema processing workflows.
        </P>

        <H2>Schema Organization</H2>
        <P>
          Schema organization best practices help maintain clean, modular, and reusable schema files. This section provides guidance on structuring schema hierarchies and managing dependencies effectively.
        </P>

        <Code copy language='idea' className='bg-black text-white'>
          {schemaOrganizationExample[0]}
        </Code>

        <H2>Plugin Development</H2>
        <P>
          Plugin development best practices ensure that plugins are robust, reliable, and integrate well with the Transformer ecosystem. This section covers validation, error handling, and proper use of the plugin context.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {pluginDevelopmentBestPracticeExample[0]}
        </Code>

        <H2>Error Recovery</H2>
        <P>
          Error recovery strategies help build resilient applications that can handle schema processing failures gracefully. This section demonstrates patterns for implementing robust error handling and recovery mechanisms.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {errorRecoveryExample[0]}
        </Code>

        <div id="8-integration-with-other-tools"></div>
        <H2>Integration with Other Tools</H2>
        <P>
          This section demonstrates how to integrate the Transformer class with other development tools and workflows. These examples show practical applications in build systems, testing frameworks, and development environments.
        </P>

        <H2>Build Systems</H2>
        <P>
          Build system integration shows how to incorporate schema transformation into automated build processes. This enables continuous generation of code, documentation, and other artifacts from schema definitions.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {buildSystemIntegrationExample[0]}
        </Code>

        <H2>Testing</H2>
        <P>
          Testing integration demonstrates how to write tests for schema transformations and validate that schemas are processed correctly. This is essential for maintaining schema quality and catching regressions.
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {testingExample[0]}
        </Code>

        <Nav
          prev={{ text: 'API Reference', href: '/docs/transformers/api-reference' }}
          next={{ text: 'Terminal', href: '/docs/transformers/pages/terminal' }}
        />
      </main>
    );
  }
  
  export default function Page(props: ServerPageProps<ServerConfigProps>) {
    const { data, session, request, response } = props;
    return (
      <Layout
        data={data}
        session={session}
        request={request}
        response={response}
        right={<Right />}
      >
        <Body />
      </Layout>
    );
  }
  