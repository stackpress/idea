//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
import clsx from 'clsx';
//local
import { H1, H2, P, C, Nav, SS } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const basicExample = 
  `import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();`;

//--------------------------------------------------------------------//

const loadExample = 
  `import Transformer from '@stackpress/idea-transformer';

// Load with default options
const transformer = await Transformer.load('./schema.idea');

// Load with custom options
const transformer = await Transformer.load('./schema.idea', {
  cwd: '/custom/working/directory',
  fs: customFileSystem
});`;

//--------------------------------------------------------------------//

const schemaExample = 
  `const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();

console.log(schema.model); // Access model definitions
console.log(schema.enum); // Access enum definitions
console.log(schema.type); // Access type definitions
console.log(schema.prop); // Access prop definitions
console.log(schema.plugin); // Access plugin configurations`;

//--------------------------------------------------------------------//

const transformExample = 
  `const transformer = await Transformer.load('./schema.idea');

// Transform with no additional context
await transformer.transform();

// Transform with additional context
await transformer.transform({
  outputDir: './generated',
  debug: true
});`;

//--------------------------------------------------------------------//

const pluginContextExample = 
  `{
  transformer: Transformer,  // The transformer instance
  config: PluginConfig,      // Plugin-specific configuration
  schema: SchemaConfig,      // Complete processed schema
  cwd: string,              // Current working directory
  ...extras                 // Any additional context passed to transform()
}`

//--------------------------------------------------------------------//

const basicSchemaLoadingExample = 
  `import Transformer from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();

// Access different parts of the schema
console.log('Models:', Object.keys(schema.model || {}));
console.log('Enums:', Object.keys(schema.enum || {}));
console.log('Types:', Object.keys(schema.type || {}));`;

//--------------------------------------------------------------------//

const multipleSchemaFilesExample = 
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
console.log(schema.enum?.UserRole); // Available from shared/enums.idea`;

//--------------------------------------------------------------------//

const pluginDevelopmentExample = 
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
});`;

//--------------------------------------------------------------------//

const errorHandlingExample = 
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
}`;

//--------------------------------------------------------------------//

const customFileSystemExample = 
  `import { NodeFS } from '@stackpress/lib';

// Using custom file system
const customFS = new NodeFS();
const transformer = await Transformer.load('./schema.idea', {
  fs: customFS,
  cwd: '/custom/working/directory'
});`;

//--------------------------------------------------------------------//

const fileNotFoundExample = 
  `// Throws: "Input file /path/to/nonexistent.idea does not exist"
const transformer = await Transformer.load('./nonexistent.idea');
await transformer.schema(); // Error thrown here`;

//--------------------------------------------------------------------//

const noPluginsExample = 
  `// If schema has no plugins defined
const transformer = await Transformer.load('./schema-without-plugins.idea');
await transformer.transform(); // Throws: "No plugins defined in schema file"`;

//--------------------------------------------------------------------//

const invalidPluginExample = 
  `// If plugin file doesn't export a function
const transformer = await Transformer.load('./schema.idea');
await transformer.transform(); // Plugin is silently skipped if not a function`;

//--------------------------------------------------------------------//

const schemaOrganizationExample = 
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
}`;

//--------------------------------------------------------------------//

const pluginDevelopmentBestPracticeExample = 
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
}`;

//--------------------------------------------------------------------//

const errorRecoveryExample = 
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
}`;

//--------------------------------------------------------------------//

const buildSystemIntegrationExample = 
  `// Integration with build tools
import Transformer from '@stackpress/idea-transformer';

export async function buildSchemas(inputDir, outputDir) {
  const schemaFiles = await glob(\`\${inputDir}/**/*.idea\`);
  
  for (const schemaFile of schemaFiles) {
    const transformer = await Transformer.load(schemaFile);
    await transformer.transform({ outputDir });
  }
}`;

//--------------------------------------------------------------------//

const testingExample = 
  `// Testing schema transformations
import { expect } from 'chai';

describe('Schema Transformation', () => {
  it('should process schema correctly', async () => {
    const transformer = await Transformer.load('./test-schema.idea');
    const schema = await transformer.schema();
    
    expect(schema.model).to.have.property('User');
    expect(schema.model.User.columns).to.have.length.greaterThan(0);
  });
});`;

//--------------------------------------------------------------------//

//styles
//--------------------------------------------------------------------//

const anchorStyles = clsx(
  'cursor-pointer',
  'hover:text-blue-700',
  'text-blue-500'
);

//--------------------------------------------------------------------//

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Transformer');
  const description = _(
    'A class for loading, processing, and transforming schema files ' +
    'with plugin support and schema merging capabilities'
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
  //hooks
  const { _ } = useLanguage();

  return (
    <menu className="overflow-auto px-h-100-40 px-m-0 px-px-10 px-py-20">
      <h6 className="px-fs-14 px-mb-0 px-mt-0 px-pb-10 theme-muted uppercase">
        {_('API Reference')}
      </h6>
      <nav className="flex flex-col px-lh-28 px-m-0">
        <div className="cursor-pointer text-blue-300">
          {_('Transformer')}
        </div>
        <a
          className={anchorStyles}
          href="/docs/transformers/api-references/terminal" 
        >
          {_('Terminal')}
        </a>
      </nav>

      <h6 className="px-fs-14 px-mb-0 px-mt-30 px-pb-10 theme-muted uppercase">
        {_('On this page')}
      </h6>
      <nav className="flex flex-col px-lh-26 px-m-0">
        <a
          className={anchorStyles}
          href="#overview-1"
        >
          {_('1. Overview')}
        </a>
        <a
          className={anchorStyles}
          href="#loading-a-transformer-2"
        >
          {_('2. Loading a Transformer')}
        </a>
        <a
          className={anchorStyles}
          href="#properties-3"
        >
          {_('3. Properties')}
        </a>
        <a
          className={anchorStyles}
          href="#methods-4"
        >
          {_('4. Methods')}
        </a>
        <a
          className={anchorStyles}
          href="#usage-examples-5"
        >
          {_('5. Usage Examples')}
        </a>
        <a
          className={anchorStyles}
          href="#error-scenarios-6"
        >
          {_('6. Error Scenarios')}
        </a>
        <a
          className={anchorStyles}
          href="#best-practices-7"
        >
          {_('7. Best Practices')}
        </a>
        <a
          className={anchorStyles}
          href="#integration-with-other-tools-8"
        >
          {_('8. Integration with Other Tools')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Transformer API Reference Section Content */}
      <section>
        <H1>{_('Transformer API Reference')}</H1>
        <P>
          <Translate>
            A class for loading, processing, and transforming schema 
            files with plugin support and schema merging capabilities. 
            The Transformer class serves as the core component of the
            idea-transformer library, providing comprehensive functionality
            for schema processing, plugin execution, and file management.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {basicExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Overview Section Content */}
      <section id="overview-1">
        <H1>{_('Overview')}</H1>
        <P>
          <Translate>
            The Transformer class provides a comprehensive solution for
            processing schema files and executing transformations. This
            section outlines the core capabilities and responsibilities of
            the Transformer class within the idea-transformer ecosystem.
          </Translate>
        </P>

        <P>
          <Translate>
            The Transformer class is the core component of the
            idea-transformer library. It handles:
          </Translate>
        </P>

        <ul className="list-disc my-4 pl-6">
          <li className="my-2">
            <Translate>
              Loading schema files (both <C>.idea</C> and <C>.json</C> 
              formats)
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Processing and merging schema configurations from
              multiple files
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Executing plugins defined in the schema
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Managing file dependencies and imports
            </Translate>
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Loading a Transformer Section Content */}
      <section id="loading-a-transformer-2">
        <H1>{_('Loading a Transformer')}</H1>
        <P>
          <Translate>
            The load method creates a new Transformer instance configured
            with the specified input file and options. This is the primary
            way to create a transformer and begin working with schema files.
          </Translate>
        </P>

        <P>
          <Translate>
            The following example shows how to create a new Transformer
            instance.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {loadExample}
        </Code>

        <H2>{_('Parameters')}</H2>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Parameter</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold">input</Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>
              <Translate>
                Path to the schema file to load
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold">options</Tcol>
            <Tcol><C>LoaderOptions</C></Tcol>
            <Tcol>
              <Translate>
                Optional configuration for the file loader
              </Translate>
            </Tcol>
          </Trow>
        </Table>

        <H2>{_('Returns')}</H2>
        <P>
          <Translate>
            A promise that resolves to a new Transformer instance 
            configured with the specified input file and options.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Properties Section Content */}
      <section id="properties-3">
        <H1>{_('Properties')}</H1>
        <P>
          <Translate>
            The properties section describes the instance variables
            available on Transformer objects. These properties provide
            access to the underlying file system operations and
            configuration details needed for schema processing.
          </Translate>
        </P>

        <P>
          <Translate>
            The following properties are available when instantiating
            a Transformer.
          </Translate>
        </P>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Property</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>loader</C></Tcol>
            <Tcol><C>FileLoader</C></Tcol>
            <Tcol>
              <Translate>
                File system loader for handling file operations
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold"><C>input</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>
              <Translate>
                Absolute path to the input schema file
              </Translate>
            </Tcol>
          </Trow>
        </Table>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Methods Section Content */}
      <section id="methods-4">
        <H1>{_('Methods')}</H1>
        <P>
          <Translate>
            The methods section covers the instance methods available
            on Transformer objects. These methods provide the core
            functionality for loading schema configurations, processing
            dependencies, and executing plugin transformations.
          </Translate>
        </P>

        <H2>{_('Loading Schema Configuration')}</H2>
        <P>
          <Translate>
            The schema method loads and processes the complete schema
            configuration, including all dependencies and imports. This
            method handles the complex process of merging multiple
            schema files and resolving all references.
          </Translate>
        </P>

        <P>
          <Translate>
            The following example shows how to load and process the
            schema configuration.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {schemaExample}
        </Code>

        <H2>{_('Returns')}</H2>
        <P>
          <Translate>
            A promise that resolves to a SchemaConfig object containing
            all processed schema definitions.
          </Translate>
        </P>

        <H2>{_('Features')}</H2>
        <ul className="list-disc my-4 pl-6">
          <li className="my-2">
            <Translate>
              <SS>File Format Support:</SS> Automatically detects and
              handles both <C>.idea</C> and <C>.json</C> schema files
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Dependency Resolution:</SS> Processes use directives
              to import and merge external schema files
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Schema Merging:</SS> Intelligently merges child schemas
              into parent schemas based on mutability rules
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Caching:</SS> Caches the processed schema to avoid
              redundant processing
            </Translate>
          </li>
        </ul>

        <H2>{_('Schema Merging Rules')}</H2>
        <P>
          <Translate>
            When processing use directives, the transformer applies
            these merging rules:
          </Translate>
        </P>

        <ol className="list-decimal my-4 pl-6">
          <li className="my-2">
            <SS><Translate>Props and Enums:</Translate></SS>
            <Translate>
              Simple merge where parent takes precedence
            </Translate>
          </li>
          <li className="my-2">
            <SS><Translate>Types and Models:</Translate></SS>
            <ul className="list-disc my-2 pl-6">
              <li>
                <Translate>
                  If parent doesn't exist or is immutable: child is added
                </Translate>
              </li>
              <li>
                <Translate>
                  If parent is mutable: attributes and columns are merged
                </Translate>
              </li>
              <li>
                <Translate>
                  Child columns are prepended to parent columns
                </Translate>
              </li>
              <li>
                <Translate>
                  Parent attributes take precedence over child attributes
                </Translate>
              </li>
            </ul>
          </li>
        </ol>

        <H2>{_('Transforming with Plugins')}</H2>
        <P>
          <Translate>
            The transform method executes all plugins defined in the
            schema configuration. This method coordinates the plugin
            execution process, providing each plugin with the necessary
            context and handling any errors that occur during
            transformation.
          </Translate>
        </P>

        <P>
          <Translate>
            The following example shows how to execute all plugins
            defined in the schema.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {transformExample}
        </Code>

        <H2>{_('Parameters')}</H2>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Parameter</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>extras</C></Tcol>
            <Tcol><C>T</C></Tcol>
            <Tcol>
              <Translate>
                Optional additional context to pass to plugins
              </Translate>
            </Tcol>
          </Trow>
        </Table>

        <H2>{_('Returns')}</H2>
        <P>
          <Translate>
            A promise that resolves when all plugins have been executed.
          </Translate>
        </P>

        <H2>{_('Plugin Execution Process')}</H2>
        <ol className="list-decimal my-4 pl-6">
          <li className="my-2">
            <Translate>
              <SS>Validation:</SS> Ensures plugins are defined in the
              schema
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Module Resolution:</SS> Resolves plugin file paths
              relative to the schema file
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Dynamic Import:</SS> Loads plugin modules dynamically
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Context Injection:</SS> Passes context including
              transformer, schema, config, and extras
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Execution:</SS> Calls each plugin function with the 
              injected context
            </Translate>
          </li>
        </ol>

        <H2>{_('Plugin Context')}</H2>
        <P>
          <Translate>
            Each plugin receives a context object with the following
            properties:
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {pluginContextExample[0]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Usage Examples Section Content */}
      <section id="usage-examples-5">
        <H1>{_('Usage Examples')}</H1>
        <P>
          <Translate>
            This section provides practical examples of how to use the
            Transformer class in various scenarios. These examples
            demonstrate common patterns and best practices for working
            with schema files, plugins, and transformations.
          </Translate>
        </P>

        <H2>{_('Basic Schema Loading')}</H2>
        <P>
          <Translate>
            Basic schema loading demonstrates the fundamental workflow
            for loading and accessing schema configurations. This
            example shows how to create a transformer instance and
            retrieve different parts of the processed schema.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {basicSchemaLoadingExample}
        </Code>

        <H1>{_('Working with Multiple Schema Files')}</H1>
        <P>
          <Translate>
            Working with multiple schema files shows how the Transformer
            handles complex schema hierarchies with imports and
            dependencies. This example demonstrates how the use
            directive enables modular schema organization.
          </Translate>
        </P>

        <Code copy language="idea" className="bg-black text-white">
          {multipleSchemaFilesExample}
        </Code>

        <H2>{_('Plugin Development and Execution')}</H2>
        <P>
          <Translate>
            Plugin development and execution demonstrates how to create
            and use plugins with the Transformer. This example shows
            both the schema configuration and plugin implementation,
            illustrating the complete plugin workflow.
          </Translate>
        </P>

        <Code copy language="idea" className="bg-black text-white">
          {pluginDevelopmentExample}
        </Code>

        <H2>{_('Error Handling')}</H2>
        <P>
          <Translate>
            Error handling examples show how to properly catch and
            handle different types of errors that can occur during
            schema processing and transformation. This includes both
            expected errors from the idea-parser and unexpected
            runtime errors.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {errorHandlingExample}
        </Code>

        <H2>{_('Custom File System')}</H2>
        <P>
          <Translate>
            Custom file system usage demonstrates how to configure the
            Transformer to work with different file system
            implementations. This is useful for testing, custom
            storage backends, or specialized deployment scenarios.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {customFileSystemExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Error Scenarios Section Content */}
      <section id="error-scenarios-6">
        <H1>{_('Error Scenarios')}</H1>
        <P>
          <Translate>
            This section covers common error conditions that can occur
            when using the Transformer class. Understanding these
            scenarios helps developers implement proper error handling
            and debugging strategies.
          </Translate>
        </P>

        <H2>{_('File Not Found')}</H2>
        <P>
          <Translate>
            File not found errors occur when the specified schema file
            doesn't exist or isn't accessible. This section shows how
            these errors are reported and how to handle them
            appropriately.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {fileNotFoundExample}
        </Code>

        <H2>{_('No Plugins Defined')}</H2>
        <P>
          <Translate>
            No plugins defined errors occur when attempting to execute
            transformations on schemas that don't have any plugin
            configurations. This section explains when this error
            occurs and how to handle it.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {noPluginsExample}
        </Code>

        <H2>{_('Invalid Plugin Module')}</H2>
        <P>
          <Translate>
            Invalid plugin module scenarios occur when plugin files
            exist but don't export the expected function interface.
            This section covers how the Transformer handles these
            situations and what developers should expect.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {invalidPluginExample}
        </Code>
      </section> 

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Best Practices Section Content */}
      <section id="best-practices-7">
        <H1>{_('Best Practices')}</H1>
        <P>
          <Translate>
            This section outlines recommended approaches for using the
            Transformer class effectively. Following these practices
            helps ensure reliable, maintainable, and efficient schema
            processing workflows.
          </Translate>
        </P>

        <H2>{_('Schema Organization')}</H2>
        <P>
          <Translate>
            Schema organization best practices help maintain clean,
            modular, and reusable schema files. This section provides
            guidance on structuring schema hierarchies and managing
            dependencies effectively.
          </Translate>
        </P>

        <Code copy language="idea" className="bg-black text-white">
          {schemaOrganizationExample}
        </Code>

        <H2>{_('Plugin Development')}</H2>
        <P>
          <Translate>
            Plugin development best practices ensure that plugins are
            robust, reliable, and integrate well with the Transformer
            ecosystem. This section covers validation, error handling,
            and proper use of the plugin context.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {pluginDevelopmentBestPracticeExample}
        </Code>

        <H2>{_('Error Recovery')}</H2>
        <P>
          <Translate>
            Error recovery strategies help build resilient applications
            that can handle schema processing failures gracefully.
            This section demonstrates patterns for implementing robust
            error handling and recovery mechanisms.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {errorRecoveryExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Integration with Other Tools Section Content */}
      <section id="integration-with-other-tools-8">
        <H1>{_('Integration with Other Tools')}</H1>
        <P>
          <Translate>
            This section demonstrates how to integrate the Transformer
            class with other development tools and workflows. These
            examples show practical applications in build systems,
            testing frameworks, and development environments.
          </Translate>
        </P>

        <H2>{_('Build Systems')}</H2>
        <P>
          <Translate>
            Build system integration shows how to incorporate schema
            transformation into automated build processes. This
            enables continuous generation of code, documentation,
            and other artifacts from schema definitions.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {buildSystemIntegrationExample}
        </Code>

        <H2>{_('Testing')}</H2>
        <P>
          <Translate>
            Testing integration demonstrates how to write tests for
            schema transformations and validate that schemas are
            processed correctly. This is essential for maintaining
            schema quality and catching regressions.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {testingExample}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('API Reference'),
          href: "/docs/transformers/api-reference"
        }}
        next={{
          text: _('Terminal'),
          href: "/docs/transformers/api-references/terminal"
        }}
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
