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
  const title = _('Terminal');
  const description = _(
    'A command-line interface for processing schema files and executing transformations through terminal commands'
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
        {_('Terminal')}
      </h6>
      <nav className="px-m-14 px-lh-32">
        <a className="text-blue-500 block cursor-pointer underline" href="#1-overview">
          {_('1. Overview')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#2-loading-a-terminal-instance">
          {_('2. Loading a Terminal Instance')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#3-properties">
          {_('3. Properties')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#4-running-terminal-commands">
          {_('4. Running Terminal Commands')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#5-usage-examples">
          {_('5. Usage Examples')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#6-command-line-integration">
          {_('6. Command-Line Integration')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#7-default-behavior">
          {_('7. Default Behavior')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#8-error-handling">
          {_('8. Error Handling')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#9-advanced-usage">
          {_('9. Advanced Usage')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#10-integration-with-build-tools">
          {_('10. Integration with Build Tools')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#11-testing">
          {_('11. Testing')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="#12-best-practices">
          {_('12. Best Practices')}
        </a>
      </nav>
    </menu>
  );
}

const basicExample = [
  `import Terminal from '@stackpress/idea-transformer/Terminal';

const terminal = await Terminal.load(['transform', '--input', './schema.idea']);
await terminal.run();`
];

const loadExample = [
  `import Terminal from '@stackpress/idea-transformer/Terminal';

// Load with command-line arguments
const args = ['transform', '--input', './schema.idea'];
const terminal = await Terminal.load(args);

// Load with custom options
const terminal = await Terminal.load(args, {
  cwd: '/custom/working/directory',
  extname: '.schema',
  brand: '[MY-TOOL]'
});`
];

const runExample = [
  `const terminal = await Terminal.load(['transform', '--input', './schema.idea']);
await terminal.run();`
];

const basicCommandExecutionExample = [
  `import Terminal from '@stackpress/idea-transformer/Terminal';

// Process a schema file
const args = ['transform', '--input', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();`
];

const shortFlagExample = [
  `// Using the short flag alias
const args = ['transform', '--i', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();`
];

const customWorkingDirectoryExample = [
  `// Set custom working directory
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: '/path/to/project'
});
await terminal.run();`
];

const customFileExtensionExample = [
  `// Use custom file extension
const terminal = await Terminal.load(['transform', '--i', './schema.custom'], {
  extname: '.custom'
});
await terminal.run();`
];

const customBrandExample = [
  `// Use custom terminal brand
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  brand: '[MY-SCHEMA-TOOL]'
});
await terminal.run();`
];

const directCommandLineExample = [
  `## Basic usage
node cli.js transform --input ./schema.idea

## Using short flag
node cli.js transform --i ./schema.idea

## With custom working directory
cd /path/to/project && node cli.js transform --i ./schema.idea`
];

const cliScriptExample = [
  `#!/usr/bin/env node
import Terminal from '@stackpress/idea-transformer/Terminal';

async function main() {
  try {
    const args = process.argv.slice(2);
    const terminal = await Terminal.load(args, {
      cwd: process.cwd(),
      brand: '[SCHEMA-CLI]'
    });
    await terminal.run();
  } catch (error) {
    console.error('CLI Error:', error.message);
    process.exit(1);
  }
}

main();`
];

const packageJsonIntegrationExample = [
  `{
  "name": "my-schema-tool",
  "bin": {
    "schema": "./cli.js"
  },
  "scripts": {
    "build": "schema transform --i ./schema.idea",
    "dev": "schema transform --i ./dev-schema.idea"
  }
}`
];

const defaultPathExample = [
  `// Default file path construction
const defaultPath = \`\${terminal.cwd}/schema\${terminal.extname}\`;
// Example: "/current/directory/schema.idea"`
];

const flagProcessingExample = [
  `// These are equivalent:
['transform', '--input', './schema.idea']
['transform', '--i', './schema.idea']

// Uses default path: ./schema.idea
['transform']`
];

const missingSchemaFileExample = [
  `try {
  const terminal = await Terminal.load(['transform', '--i', './nonexistent.idea']);
  await terminal.run();
} catch (error) {
  console.error('File not found:', error.message);
}`
];

const invalidCommandExample = [
  `try {
  const terminal = await Terminal.load(['invalid-command']);
  await terminal.run();
} catch (error) {
  console.error('Unknown command:', error.message);
}`
];

const pluginErrorsExample = [
  `// If plugins fail during transformation
try {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
} catch (error) {
  console.error('Transformation failed:', error.message);
}`
];

const customEventHandlersExample = [
  `import Terminal from '@stackpress/idea-transformer/Terminal';

const terminal = await Terminal.load(['transform', '--i', './schema.idea']);

// Add custom event handler
terminal.on('custom-command', async (event) => {
  console.log('Custom command executed');
  // Custom logic here
});

await terminal.run();`
];

const programmaticCLIExample = [
  `// Build CLI arguments programmatically
function buildCLIArgs(schemaFile: string, options: any = {}) {
  const args = ['transform'];
  
  if (schemaFile) {
    args.push('--input', schemaFile);
  }
  
  return args;
}

const args = buildCLIArgs('./my-schema.idea');
const terminal = await Terminal.load(args);
await terminal.run();`
];

const batchProcessingExample = [
  `import { glob } from 'glob';

async function processAllSchemas(pattern: string) {
  const schemaFiles = await glob(pattern);
  
  for (const schemaFile of schemaFiles) {
    console.log(\`Processing \${schemaFile}...\`);
    
    const terminal = await Terminal.load(['transform', '--i', schemaFile]);
    await terminal.run();
    
    console.log(\`Completed \${schemaFile}\`);
  }
}

// Process all .idea files in a directory
await processAllSchemas('./schemas/**/*.idea');`
];

const environmentBasedConfigExample = [
  `const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.env.SCHEMA_CWD || process.cwd(),
  extname: process.env.SCHEMA_EXT || '.idea',
  brand: process.env.CLI_BRAND || '[IDEA]'
});

await terminal.run();`
];

const webpackPluginExample = [
  `class SchemaTransformPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  
  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('SchemaTransformPlugin', async (params, callback) => {
      try {
        const terminal = await Terminal.load(['transform', '--i', this.options.schemaFile]);
        await terminal.run();
        callback();
      } catch (error) {
        callback(error);
      }
    });
  }
}`
];

const gulpTaskExample = [
  `import gulp from 'gulp';
import Terminal from '@stackpress/idea-transformer/Terminal';

gulp.task('transform-schema', async () => {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
});`
];

const npmScriptsExample = [
  `{
  "scripts": {
    "schema:build": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './schema.idea']))\"",
    "schema:dev": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './dev-schema.idea']))\"",
    "schema:watch": "nodemon --watch schema.idea --exec \"npm run schema:build\""
  }
}`
];

const unitTestingExample = [
  `import { expect } from 'chai';
import Terminal from '@stackpress/idea-transformer/Terminal';

describe('Terminal Tests', () => {
  it('should process schema file', async () => {
    const terminal = await Terminal.load(['transform', '--i', './test-schema.idea'], {
      cwd: './test-fixtures'
    });
    
    expect(terminal.cwd).to.include('test-fixtures');
    
    // Run the terminal command
    await terminal.run();
    
    // Verify output files were created
    // ... assertions here
  });
  
  it('should use default options', async () => {
    const terminal = await Terminal.load(['transform']);
    
    expect(terminal.extname).to.equal('.idea');
    expect(terminal.cwd).to.be.a('string');
  });
});`
];

const integrationTestingExample = [
  `import fs from 'fs';
import path from 'path';

describe('Terminal Integration', () => {
  it('should generate expected output files', async () => {
    const outputDir = './test-output';
    const schemaFile = './test-schema.idea';
    
    // Clean output directory
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    
    // Run transformation
    const terminal = await Terminal.load(['transform', '--i', schemaFile]);
    await terminal.run();
    
    // Verify expected files were created
    const expectedFiles = ['types.ts', 'enums.ts', 'models.ts'];
    for (const file of expectedFiles) {
      const filePath = path.join(outputDir, file);
      expect(fs.existsSync(filePath)).to.be.true;
    }
  });
});`
];

const errorHandlingBestPracticeExample = [
  `// Always wrap terminal execution in try-catch
async function safeTransform(schemaFile: string) {
  try {
    const terminal = await Terminal.load(['transform', '--i', schemaFile]);
    await terminal.run();
    console.log(\`✅ Successfully processed \${schemaFile}\`);
  } catch (error) {
    console.error(\`❌ Failed to process \${schemaFile}:\`, error.message);
    throw error;
  }
}`
];

const configurationManagementExample = [
  `// Use configuration objects for reusable settings
const defaultConfig = {
  cwd: process.cwd(),
  extname: '.idea',
  brand: '[SCHEMA-TOOL]'
};

async function createTerminal(args: string[], config = defaultConfig) {
  return await Terminal.load(args, config);
}`
];

const loggingAndDebuggingExample = [
  `// Add logging for better debugging
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.cwd()
});

console.log(\`Working directory: \${terminal.cwd}\`);
console.log(\`File extension: \${terminal.extname}\`);

await terminal.run();`
];

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Terminal</H1>
      <P>
        A command-line interface for processing schema files and executing transformations through terminal commands. The Terminal class provides a comprehensive CLI interface for the idea-transformer library, enabling developers to process schema files and execute transformations from the command line.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {basicExample[0]}
      </Code>


      <div id="1-overview"></div>
      <H2>Overview</H2>
      <P>
        The Terminal class provides a command-line interface for processing schema files and executing transformations. This section outlines the core capabilities and features of the Terminal class, which extends the base Terminal functionality to provide schema-specific command-line operations.
      </P>

      <P>
        The <C>Terminal</C> class (exported as <C>IdeaTerminal</C>) extends the base Terminal class from <C>@stackpress/lib</C> to provide command-line functionality for the idea-transformer library. It handles:
      </P>

      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Command-line argument parsing</li>
        <li className="my-2">Schema file transformation via CLI commands</li>
        <li className="my-2">Integration with the Transformer class for processing</li>
        <li className="my-2">Configurable working directories and file extensions</li>
      </ul>

      <div id="2-loading-a-terminal-instance"></div>
      <H2>Loading a Terminal Instance</H2>
      <P>
        The load method creates a new Terminal instance from command-line arguments and optional configuration. This is the primary way to create a terminal instance for processing schema files from the command line.
      </P>

      <P>
        The following example shows how to create a new Terminal instance from command-line arguments.
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
          <Tcol className="font-bold"><C>args</C></Tcol>
          <Tcol><C>string[]</C></Tcol>
          <Tcol>Command-line arguments array</Tcol>
        </Trow>
        <Trow>
          <Tcol className="font-bold"><C>options</C></Tcol>
          <Tcol><C>TerminalOptions</C></Tcol>
          <Tcol>Optional configuration for terminal behavior</Tcol>
        </Trow>
      </Table>

      <H2>Returns</H2>
      <P>
        A promise that resolves to a new Terminal instance configured with the specified arguments and options.
      </P>

      <div id="3-properties"></div> 
      <H2>Properties</H2>
      <P>
        The properties section describes the instance variables available on Terminal objects. These properties provide access to configuration details and runtime information needed for command-line operations.
      </P>

      <H2>Properties</H2>
      <P>
        The following properties are available when instantiating a Terminal.
      </P>

      <Table className="text-left">
        <Thead className="theme-bg-bg2">Property</Thead>
        <Thead className="theme-bg-bg2">Type</Thead>
        <Thead className="theme-bg-bg2">Description</Thead>
        <Trow>
          <Tcol className="font-bold"><C>cwd</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol>Current working directory for file operations</Tcol>
        </Trow>
        <Trow>
          <Tcol className="font-bold"><C>extname</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol>Default file extension for schema files (default: '.idea')</Tcol>
        </Trow>
      </Table>


      <div id="4-running-terminal-commands"></div>
      <H2>Running Terminal Commands</H2>
      <P>
        The run method executes the configured terminal command and processes the specified schema file. This method handles the complete workflow from command parsing to schema transformation execution.
      </P>

      <P>
        The Terminal automatically sets up event handlers for processing commands. The main command supported is <C>transform</C>.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {runExample[0]}
      </Code>

      <H2>Command Structure</H2>
      <P>
        The terminal expects commands in the following format:
      </P>
      <Code copy language='bash' className='bg-black text-white'>
        transform --input &lt;schema-file&gt; [--i &lt;schema-file&gt;]
      </Code>

      <H2>Flags</H2>

      <Table className="text-left">
        <Thead className="theme-bg-bg2">Flag</Thead>
        <Thead className="theme-bg-bg2">Alias</Thead>
        <Thead className="theme-bg-bg2">Description</Thead>
        <Trow>
          <Tcol className="font-bold"><C>--input</C></Tcol>
          <Tcol><C>--i</C></Tcol>
          <Tcol>Path to the schema file to process</Tcol>
        </Trow>
      </Table>

      <div id="5-usage-examples"></div>
      <H2>Usage Examples</H2>
      <P>
        This section provides practical examples of how to use the Terminal class in various scenarios. These examples demonstrate common patterns and use cases for command-line schema processing.
      </P>

      <H2>Basic Command Execution</H2>
      <P>
        Basic command execution demonstrates the fundamental workflow for processing schema files through the Terminal interface. This example shows the simplest way to transform a schema file using command-line arguments.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {basicCommandExecutionExample[0]}
      </Code>

      <H2>Using Short Flag Syntax</H2>
      <P>
        Short flag syntax provides convenient aliases for common command-line options. This example shows how to use abbreviated flags to make command-line usage more efficient.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {shortFlagExample[0]}
      </Code>

      <H2>Custom Working Directory</H2>
      <P>
        Custom working directory configuration allows you to specify where the Terminal should operate. This is useful when processing schema files from different locations or when integrating with build systems.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {customWorkingDirectoryExample[0]}
      </Code>

      <H2>Custom File Extension</H2>
      <P>
        Custom file extension support enables the Terminal to work with schema files that use non-standard extensions. This flexibility allows integration with different naming conventions and file organization strategies.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {customFileExtensionExample[0]}
      </Code>

      <H2>Custom Brand/Label</H2>
      <P>
        Custom brand configuration allows you to customize the Terminal's display name and branding. This is useful when building custom CLI tools based on the idea-transformer library.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {customBrandExample[0]}
      </Code>

      <div id="6-command-line-integration"></div>
      <H2>Command-Line Integration</H2>
      <P>
        This section demonstrates how to integrate the Terminal class with actual command-line environments and build systems. These examples show practical applications for creating CLI tools and automating schema processing.
      </P>

      <H2>Direct Command-Line Usage</H2>
      <P>
        Direct command-line usage shows how to invoke the Terminal functionality from shell commands. This section provides examples of the actual command syntax and available options.
      </P>

      <Code copy language='bash' className='bg-black text-white'>
        {directCommandLineExample[0]}
      </Code>

      <H2>CLI Script Example</H2>
      <P>
        CLI script examples demonstrate how to create executable scripts that use the Terminal class. This pattern is useful for creating standalone CLI tools and integrating with package managers.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {cliScriptExample[0]}
      </Code>

      <H2>Package.json Integration</H2>
      <P>
        Package.json integration shows how to configure npm scripts and binary commands using the Terminal class. This enables seamless integration with Node.js project workflows and package distribution.
      </P>

      <Code copy language='json' className='bg-black text-white'>
        {packageJsonIntegrationExample[0]}
      </Code>


      <div id="7-default-behavior"></div>
      <H2>Default Behavior</H2>
      <P>
        This section explains the default behavior and conventions used by the Terminal class. Understanding these defaults helps developers predict how the Terminal will behave in different scenarios and configure it appropriately.
      </P>

      <H2>File Path Resolution</H2>
      <P>
        File path resolution describes how the Terminal determines which schema file to process when no explicit path is provided. This automatic resolution simplifies common use cases while maintaining flexibility.
      </P>

      <P>
        When no input file is specified, the terminal uses a default path:
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {defaultPathExample[0]}
      </Code>

      <H2>Flag Processing</H2>
      <P>
        Flag processing explains how the Terminal parses and prioritizes command-line flags. Understanding this order of precedence helps developers use the most appropriate flag syntax for their needs.
      </P>

      <P>
        The terminal processes the following flags in order of preference:
      </P>

      <ol className="list-decimal pl-6 my-4">
        <li className="my-2"><C>--input</C> (full flag name)</li>
        <li className="my-2"><C>--i</C> (short alias)</li>
        <li className="my-2">Default file path if no flags provided</li>
      </ol>

      <Code copy language='typescript' className='bg-black text-white'>
        {flagProcessingExample[0]}
      </Code>

      <div id="8-error-handling"></div>
      <H2>Error Handling</H2>
      <P>
        This section covers common error conditions that can occur when using the Terminal class. Understanding these error scenarios helps developers implement proper error handling and provide better user experiences.
      </P>

      <H2>Missing Schema File</H2>
      <P>
        Missing schema file errors occur when the specified schema file doesn't exist or isn't accessible. This section shows how these errors are reported and how to handle them appropriately in CLI applications.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {missingSchemaFileExample[0]}
      </Code>

      <H2>Invalid Command</H2>
      <P>
        Invalid command errors occur when unsupported commands are passed to the Terminal. This section explains how the Terminal handles unknown commands and provides guidance for error recovery.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {invalidCommandExample[0]}
      </Code>

      <H2>Plugin Errors</H2>
      <P>
        Plugin errors can occur during the transformation process when plugins fail to execute properly. This section covers how to handle and debug plugin-related issues in CLI environments.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {pluginErrorsExample[0]}
      </Code>

      <div id="9-advanced-usage"></div>
      <H2>Advanced Usage</H2>
      <P>
        This section covers advanced patterns and techniques for using the Terminal class in complex scenarios. These examples demonstrate sophisticated use cases and integration patterns for power users.
      </P>

      <H2>Custom Event Handlers</H2>
      <P>
        Custom event handlers allow you to extend the Terminal's functionality with additional commands and behaviors. This pattern enables building specialized CLI tools with custom functionality.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {customEventHandlersExample[0]}
      </Code>

      <H2>Programmatic CLI Building</H2>
      <P>
        Programmatic CLI building demonstrates how to construct command-line arguments dynamically in code. This approach is useful for building tools that generate CLI commands based on configuration or user input.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {programmaticCLIExample[0]}
      </Code>

      <H2>Batch Processing</H2>
      <P>
        Batch processing shows how to use the Terminal class to process multiple schema files in sequence. This pattern is essential for build systems and automation tools that need to handle multiple schemas.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {batchProcessingExample[0]}
      </Code>

      <H2>Environment-Based Configuration</H2>
      <P>
        Environment-based configuration demonstrates how to use environment variables to configure Terminal behavior. This approach enables flexible deployment and configuration management across different environments.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {environmentBasedConfigExample[0]}
      </Code>

      <div id="10-integration-with-build-tools"></div>
      <H2>Integration with Build Tools</H2>
      <P>
        This section demonstrates how to integrate the Terminal class with popular build tools and development workflows. These examples show practical applications for automating schema processing in development and deployment pipelines.
      </P>

      <H2>Webpack Plugin</H2>
      <P>
        Webpack plugin integration shows how to incorporate schema transformation into Webpack build processes. This enables automatic schema processing as part of the application build pipeline.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {webpackPluginExample[0]}
      </Code>

      <H2>Gulp Task</H2>
      <P>
        Gulp task integration demonstrates how to create Gulp tasks that use the Terminal class for schema processing. This pattern is useful for projects that use Gulp as their primary build tool.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {gulpTaskExample[0]}
      </Code>

      <H2>NPM Scripts</H2>
      <P>
        NPM scripts integration shows how to configure package.json scripts that use the Terminal class. This approach enables easy schema processing through standard npm commands and supports development workflows.
      </P>

      <Code copy language='json' className='bg-black text-white'>
        {npmScriptsExample[0]}
      </Code>

      <div id="11-testing"></div>
      <H2>Testing</H2>
      <P>
        This section covers testing strategies and patterns for applications that use the Terminal class. These examples demonstrate how to write effective tests for CLI functionality and ensure reliable schema processing.
      </P>

      <H2>Unit Testing</H2>
      <P>
        Unit testing examples show how to test Terminal functionality in isolation. These tests verify that the Terminal class behaves correctly with different command-line arguments and configuration options.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {unitTestingExample[0]}
      </Code>

      <H2>Integration Testing</H2>
      <P>
        Integration testing demonstrates how to test the complete workflow from command-line input to generated output files. These tests ensure that the entire transformation pipeline works correctly in realistic scenarios.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {integrationTestingExample[0]}
      </Code>

      <div id="12-best-practices"></div>
      <H2>Best Practices</H2>
      <P>
        This section outlines recommended approaches for using the Terminal class effectively. Following these practices helps ensure reliable, maintainable, and user-friendly CLI applications.
      </P>

      <H2>Error Handling</H2>
      <P>
        Error handling best practices ensure that CLI applications provide clear feedback when issues occur. This section demonstrates patterns for implementing robust error handling and user-friendly error messages.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {errorHandlingBestPracticeExample[0]}
      </Code>

      <H2>Configuration Management</H2>
      <P>
        Configuration management best practices help maintain clean, reusable configuration patterns. This section provides guidance on organizing configuration options and providing sensible defaults.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {configurationManagementExample[0]}
      </Code>

      <H2>Logging and Debugging</H2>
      <P>
        Logging and debugging practices help developers troubleshoot issues and understand Terminal behavior. This section demonstrates effective logging strategies and debugging techniques for CLI applications.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {loggingAndDebuggingExample[0]}
      </Code>

      <Nav
        prev={{ text: 'Transformer', href: '/docs/transformers/pages/transformer' }}
        next={{ text: 'API Reference', href: '/docs/transformers/api-reference' }}
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
