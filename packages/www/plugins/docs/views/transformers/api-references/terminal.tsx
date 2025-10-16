//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
import clsx from 'clsx';
//local
import { H1, H2, P, C, Nav } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const basicExample =
  `import Terminal from '@stackpress/idea-transformer/Terminal';

const terminal = await Terminal.load(['transform', '--input', './schema.idea']);
await terminal.run();`;

//--------------------------------------------------------------------//

const loadExample =
  `import Terminal from '@stackpress/idea-transformer/Terminal';

// Load with command-line arguments
const args = ['transform', '--input', './schema.idea'];
const terminal = await Terminal.load(args);

// Load with custom options
const terminal = await Terminal.load(args, {
  cwd: '/custom/working/directory',
  extname: '.schema',
  brand: '[MY-TOOL]'
});`;

//--------------------------------------------------------------------//

const runExample =
  `const terminal = await Terminal.load(['transform', '--input', './schema.idea']);
await terminal.run();`;

//--------------------------------------------------------------------//

const basicCommandExecutionExample =
  `import Terminal from '@stackpress/idea-transformer/Terminal';

// Process a schema file
const args = ['transform', '--input', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();`;

//--------------------------------------------------------------------//

const shortFlagExample =
  `// Using the short flag alias
const args = ['transform', '--i', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();`

//--------------------------------------------------------------------//

const customWorkingDirectoryExample =
  `// Set custom working directory
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: '/path/to/project'
});
await terminal.run();`;

//--------------------------------------------------------------------//

const customFileExtensionExample =
  `// Use custom file extension
const terminal = await Terminal.load(['transform', '--i', './schema.custom'], {
  extname: '.custom'
});
await terminal.run();`;

//--------------------------------------------------------------------//

const customBrandExample =
  `// Use custom terminal brand
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  brand: '[MY-SCHEMA-TOOL]'
});
await terminal.run();`;

//--------------------------------------------------------------------//

const directCommandLineExample =
  `## Basic usage
node cli.js transform --input ./schema.idea

## Using short flag
node cli.js transform --i ./schema.idea

## With custom working directory
cd /path/to/project && node cli.js transform --i ./schema.idea`;

//--------------------------------------------------------------------//

const cliScriptExample =
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

main();`;

//--------------------------------------------------------------------//

const packageJsonIntegrationExample =
  `{
  "name": "my-schema-tool",
  "bin": {
    "schema": "./cli.js"
  },
  "scripts": {
    "build": "schema transform --i ./schema.idea",
    "dev": "schema transform --i ./dev-schema.idea"
  }
}`;

//--------------------------------------------------------------------//

const defaultPathExample =
  `// Default file path construction
const defaultPath = \`\${terminal.cwd}/schema\${terminal.extname}\`;
// Example: "/current/directory/schema.idea"`

//--------------------------------------------------------------------//

const flagProcessingExample =
  `// These are equivalent:
['transform', '--input', './schema.idea']
['transform', '--i', './schema.idea']

// Uses default path: ./schema.idea
['transform']`;

//--------------------------------------------------------------------//

const missingSchemaFileExample =
  `try {
  const terminal = await Terminal.load(['transform', '--i', './nonexistent.idea']);
  await terminal.run();
} catch (error) {
  console.error('File not found:', error.message);
}`;

//--------------------------------------------------------------------//

const invalidCommandExample =
  `try {
  const terminal = await Terminal.load(['invalid-command']);
  await terminal.run();
} catch (error) {
  console.error('Unknown command:', error.message);
}`;

//--------------------------------------------------------------------//

const pluginErrorsExample =
  `// If plugins fail during transformation
try {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
} catch (error) {
  console.error('Transformation failed:', error.message);
}`;

//--------------------------------------------------------------------//

const customEventHandlersExample =
  `import Terminal from '@stackpress/idea-transformer/Terminal';

const terminal = await Terminal.load(['transform', '--i', './schema.idea']);

// Add custom event handler
terminal.on('custom-command', async (event) => {
  console.log('Custom command executed');
  // Custom logic here
});

await terminal.run();`;

//--------------------------------------------------------------------//

const programmaticCLIExample =
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
await terminal.run();`;

//--------------------------------------------------------------------//

const batchProcessingExample =
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
await processAllSchemas('./schemas/**/*.idea');`;

//--------------------------------------------------------------------//

const environmentBasedConfigExample =
  `const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.env.SCHEMA_CWD || process.cwd(),
  extname: process.env.SCHEMA_EXT || '.idea',
  brand: process.env.CLI_BRAND || '[IDEA]'
});

await terminal.run();`;

//--------------------------------------------------------------------//


const webpackPluginExample =
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
}`;

//--------------------------------------------------------------------//

const gulpTaskExample =
  `import gulp from 'gulp';
import Terminal from '@stackpress/idea-transformer/Terminal';

gulp.task('transform-schema', async () => {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
});`;

//--------------------------------------------------------------------//

const npmScriptsExample =
  `{
  "scripts": {
    "schema:build": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './schema.idea']))\"",
    "schema:dev": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './dev-schema.idea']))\"",
    "schema:watch": "nodemon --watch schema.idea --exec \"npm run schema:build\""
  }
}`;

//--------------------------------------------------------------------//

const unitTestingExample =
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
});`;

//--------------------------------------------------------------------//

const integrationTestingExample =
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
});`;

//--------------------------------------------------------------------//

const errorHandlingBestPracticeExample =
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
}`;     

//--------------------------------------------------------------------//

const configurationManagementExample =
  `// Use configuration objects for reusable settings
const defaultConfig = {
  cwd: process.cwd(),
  extname: '.idea',
  brand: '[SCHEMA-TOOL]'
};

async function createTerminal(args: string[], config = defaultConfig) {
  return await Terminal.load(args, config);
}`;

//--------------------------------------------------------------------//

const loggingAndDebuggingExample =
  `// Add logging for better debugging
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.cwd()
});

console.log(\`Working directory: \${terminal.cwd}\`);
console.log(\`File extension: \${terminal.extname}\`);

await terminal.run();`;

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
  const title = _('Terminal');
  const description = _(
    'A command-line interface for processing schema files and executing ' +
    'transformations through terminal commands'
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
        <a
          className={anchorStyles}
          href="/docs/transformers/api-references/transformer"
        >
          {_('Transformer')}
        </a>
        <div className="cursor-pointer text-blue-300">
          {_('Terminal')}
        </div>
      </nav>

      <h6 className="px-fs-14 px-mb-0 px-mt-30 px-pb-10 theme-muted uppercase">
        {_('On this page')}
      </h6>
      <nav className="flex flex-col px-lh-28 px-m-0">
        <a
          className={anchorStyles}
          href="#overview-1"
        >
          {_('1. Overview')}
        </a>
        <a
          className={anchorStyles}
          href="#loading-a-terminal-instance-2"
        >
          {_('2. Loading a Terminal Instance')}
        </a>
        <a
          className={anchorStyles}
          href="#properties-3"
        >
          {_('3. Properties')}
        </a>
        <a
          className={anchorStyles}
          href="#running-terminal-commands-4"
        >
          {_('4. Running Terminal Commands')}
        </a>
        <a
          className={anchorStyles}
          href="#usage-examples-5"
        >
          {_('5. Usage Examples')}
        </a>
        <a
          className={anchorStyles}
          href="#command-line-integration-6"
        >
          {_('6. Command-Line Integration')}
        </a>
        <a
          className={anchorStyles}
          href="#default-behavior-7"
        >
          {_('7. Default Behavior')}
        </a>
        <a
          className={anchorStyles}
          href="#error-handling-8"
        >
          {_('8. Error Handling')}
        </a>
        <a
          className={anchorStyles}
          href="#advanced-usage-9"
        >
          {_('9. Advanced Usage')}
        </a>
        <a
          className={anchorStyles}
          href="#integration-with-build-tools-10"
        >
          {_('10. Integration with Build Tools')}
        </a>
        <a
          className={anchorStyles}
          href="#testing-11"
        >
          {_('11. Testing')}
        </a>
        <a
          className={anchorStyles}
          href="#best-practices-12"
        >
          {_('12. Best Practices')}
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
      {/* Overview Section */}
      <section>
        <H1>{_('Terminal')}</H1>
        <P>
          <Translate>
            A command-line interface for processing schema files and
            executing transformations through terminal commands. The 
            Terminal class provides a comprehensive CLI interface for 
            the idea-transformer library, enabling developers to process 
            schema files and execute transformations from the command 
            line.
          </Translate>
        </P>

        <Code
          copy
          language="typescript"
          className="bg-black text-white">
          {basicExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Overview Section */}
      <section id="overview-1">
        <H1>{_('Overview')}</H1>
        <P>
          <Translate>
            The Terminal class provides a command-line interface for
            processing schema files and executing transformations. This
            section outlines the core capabilities and features of the
            Terminal class, which extends the base Terminal functionality
            to provide schema-specific command-line operations.
          </Translate>
        </P>

        <P>
          <Translate>
            The Terminal class (exported as Terminal) extends the base
            Terminal class from stackpress to provide command-line
            functionality for the idea-transformer library. It handles:
          </Translate>
        </P>

        <ul className="list-disc my-4 pl-6">
          <li className="my-2">{_('Command-line argument parsing')}</li>
          <li className="my-2">{_('Schema file resolution')}</li>
          <li className="my-2">{_('Transformation execution')}</li>
          <li className="my-2">{_('Error reporting and logging')}</li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Loading a Terminal Instance Section */}
      <section id="loading-a-terminal-instance-2">
        <H1>{_('Loading a Terminal Instance')}</H1>
        <P>
          <Translate>
            The load method creates a new Terminal instance from
            command-line arguments and optional configuration. This is
            the primary way to create a terminal instance for processing
            schema files from the command line.
          </Translate>
        </P>

        <P>
          <Translate>
            The following example shows how to create a new Terminal
            instance from command-line arguments.
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
            <Tcol className="font-bold"><C>args</C></Tcol>
            <Tcol><C>string[]</C></Tcol>
            <Tcol>
              <Translate>
                Command-line arguments array
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold"><C>options</C></Tcol>
            <Tcol><C>TerminalOptions</C></Tcol>
            <Tcol>
              <Translate>
                Optional configuration for terminal behavior
              </Translate>
            </Tcol>
          </Trow>
        </Table>

        <H2>{_('Returns')}</H2>
        <P>
          <Translate>
            A promise that resolves to a new Terminal instance
            configured with the specified arguments and options.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Properties Section */}
      <section id="properties-3">
        <H1>{_('Properties')}</H1>
        <P>
          <Translate>
            The properties section describes the instance variables
            available on Terminal objects. These properties provide
            access to configuration details and runtime information
            needed for command-line operations.
          </Translate>
        </P>

        <P>
          <Translate>
            The following properties are available when instantiating
            a Terminal.
          </Translate>
        </P>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Property</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>cwd</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>
              <Translate>
                Current working directory for file operations
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold"><C>extname</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>
              <Translate>
                Default file extension for schema files ' +
                '(default: \'.idea\')
              </Translate>
            </Tcol>
          </Trow>
        </Table>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Running Terminal Commands Section */}
      <section id="running-terminal-commands-4">
        <H1>{_('Running Terminal Commands')}</H1>
        <P>
          <Translate>
            The run method executes the configured terminal command and
            processes the specified schema file. This method handles the
            complete workflow from command parsing to schema
            transformation execution.
          </Translate>
        </P>

        <P>
          <Translate>
            The Terminal automatically sets up event handlers for
            processing commands. The main command supported is transform.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {runExample}
        </Code>

        <H2>{_('Command Structure')}</H2>
        <P>
          <Translate>
            The terminal expects commands in the following format:
          </Translate>
        </P>
        <Code copy language="bash" className="bg-black text-white">
          transform --input &lt;schema-file&gt; [--i &lt;schema-file&gt;]
        </Code>

        <H2>{_('Flags')}</H2>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Flag</Thead>
            <Thead>Alias</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>--input</C></Tcol>
            <Tcol><C>--i</C></Tcol>
            <Tcol>
              <Translate>
                Path to the schema file to process
              </Translate>
            </Tcol>
          </Trow>
        </Table>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Usage Examples Section */}
      <section id="usage-examples-5">
        <H1>{_('Usage Examples')}</H1>
        <P>
          <Translate>
            This section provides practical examples of how to use the
            Terminal class in various scenarios. These examples demonstrate
            common patterns and use cases for command-line schema processing.
          </Translate>
        </P>

        <H2>{_('Basic Command Execution')}</H2>
        <P>
          <Translate>
            Basic command execution demonstrates the fundamental workflow
            for processing schema files through the Terminal interface.
            This example shows the simplest way to transform a schema file
            using command-line arguments.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {basicCommandExecutionExample}
        </Code>

        <H2>{_('Using Short Flag Syntax')}</H2>
        <P>
          <Translate>
            Short flag syntax provides convenient aliases for common
            command-line options. This example shows how to use abbreviated
            flags to make command-line usage more efficient.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {shortFlagExample}
        </Code>

        <H2>{_('Custom Working Directory')}</H2>
        <P>
          <Translate>
            Custom working directory configuration allows you to specify
            where the Terminal should operate. This is useful when
            processing schema files from different locations or when
            integrating with build systems.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {customWorkingDirectoryExample}
        </Code>

        <H2>{_('Custom File Extension')}</H2>
        <P>
          <Translate>
            Custom file extension support enables the Terminal to work
            with schema files that use non-standard extensions. This
            flexibility allows integration with different naming
            conventions and file organization strategies.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {customFileExtensionExample}
        </Code>

        <H2>{_('Custom Brand/Label')}</H2>
        <P>
          <Translate>
            Custom brand configuration allows you to customize the
            Terminal's display name and branding. This is useful when
            building custom CLI tools based on the idea-transformer
            library.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {customBrandExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Command-Line Integration Section */}
      <section id="command-line-integration-6">
        <H1>{_('Command-Line Integration')}</H1>
        <P>
          <Translate>
            This section demonstrates how to integrate the Terminal class
            with actual command-line environments and build systems.
            These examples show practical applications for creating CLI
            tools and automating schema processing.
          </Translate>
        </P>

        <H2>{_('Direct Command-Line Usage')}</H2>
        <P>
          <Translate>
            Direct command-line usage shows how to invoke the Terminal
            functionality from shell commands. This section provides
            examples of the actual command syntax and available options.
          </Translate>
        </P>

        <Code copy language="bash" className="bg-black text-white">
          {directCommandLineExample}
        </Code>

        <H2>{_('CLI Script Example')}</H2>
        <P>
          <Translate>
            CLI script examples demonstrate how to create executable
            scripts that use the Terminal class. This pattern is useful
            for creating standalone CLI tools and integrating with package
            managers.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {cliScriptExample}
        </Code>

        <H2>{_('Package.json Integration')}</H2>
        <P>
          <Translate>
            Package.json integration shows how to configure npm scripts
            and binary commands using the Terminal class. This enables
            seamless integration with Node.js project workflows and package
            distribution.
          </Translate>
        </P>

        <Code copy language="json" className="bg-black text-white">
          {packageJsonIntegrationExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Default Behavior Section */}
      <section id="default-behavior-7">
        <H1>{_('Default Behavior')}</H1>
        <P>
          <Translate>
            This section explains the default behavior and conventions
            used by the Terminal class. Understanding these defaults helps
            developers predict how the Terminal will behave in different
            scenarios and configure it appropriately.
          </Translate>
        </P>

        <H2>{_('File Path Resolution')}</H2>
        <P>
          <Translate>
            File path resolution describes how the Terminal determines
            which schema file to process when no explicit path is provided.
            This automatic resolution simplifies common use cases while
            maintaining flexibility.
          </Translate>
        </P>

        <P>
          <Translate>
            When no input file is specified, the terminal uses a default
            path:
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {defaultPathExample}
        </Code>

        <H2>{_('Flag Processing')}</H2>
        <P>
          <Translate>
            Flag processing explains how the Terminal parses and
            prioritizes command-line flags. Understanding this order
            of precedence helps developers use the most appropriate
            flag syntax for their needs.
          </Translate>
        </P>

        <P>
          <Translate>
            The terminal processes the following flags in order of
            preference:
          </Translate>
        </P>

        <ol className="list-decimal my-4 pl-6">
          <li className="my-2">
            <Translate><C>--input</C> (full flag name)</Translate>
          </li>
          <li className="my-2">
            <Translate><C>--i</C> (short alias)</Translate>
          </li>
          <li className="my-2">
            <Translate>Default file path if no flags provided</Translate>
          </li>
        </ol>

        <Code copy language="typescript" className="bg-black text-white">
          {flagProcessingExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Error Handling Section */}
      <section id="error-handling-8">
        <H1>{_('Error Handling')}</H1>
        <P>
          <Translate>
            This section covers common error conditions that can occur
            when using the Terminal class. Understanding these error
            scenarios helps developers implement proper error handling
            and provide better user experiences.
          </Translate>
        </P>

        <H2>{_('Missing Schema File')}</H2>
        <P>
          <Translate>
            Missing schema file errors occur when the specified schema
            file doesn't exist or isn't accessible. This section shows
            how these errors are reported and how to handle them
            appropriately in CLI applications.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {missingSchemaFileExample}
        </Code>

        <H2>{_('Invalid Command')}</H2>
        <P>
          <Translate>
            Invalid command errors occur when unsupported commands are
            passed to the Terminal. This section explains how the
            Terminal handles unknown commands and provides guidance
            for error recovery.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {invalidCommandExample}
        </Code>

        <H2>{_('Plugin Errors')}</H2>
        <P>
          <Translate>
            Plugin errors can occur during the transformation process
            when plugins fail to execute properly. This section covers
            how to handle and debug plugin-related issues in CLI
            environments.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {pluginErrorsExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Advanced Usage Section */}
      <section id="advanced-usage-9">
        <H1>{_('Advanced Usage')}</H1>
        <P>
          <Translate>
            This section covers advanced patterns and techniques for
            using the Terminal class in complex scenarios. These
            examples demonstrate sophisticated use cases and integration
            patterns for power users.
          </Translate>
        </P>

        <H2>{_('Custom Event Handlers')}</H2>
        <P>
          <Translate>
            Custom event handlers allow you to extend the Terminal's
            functionality with additional commands and behaviors. This
            pattern enables building specialized CLI tools with custom
            functionality.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {customEventHandlersExample}
        </Code>

        <H2>{_('Programmatic CLI Building')}</H2>
        <P>
          <Translate>
            Programmatic CLI building demonstrates how to construct
            command-line arguments dynamically in code. This approach is
            useful for building tools that generate CLI commands based on
            configuration or user input.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {programmaticCLIExample}
        </Code>

        <H2>{_('Batch Processing')}</H2>
        <P>
          <Translate>
            Batch processing shows how to use the Terminal class to
            process multiple schema files in sequence. This pattern is
            essential for build systems and automation tools that need to
            handle multiple schemas.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {batchProcessingExample}
        </Code>

        <H2>{_('Environment-Based Configuration')}</H2>
        <P>
          <Translate>
            Environment-based configuration demonstrates how to use
            environment variables to configure Terminal behavior. This
            approach enables flexible deployment and configuration 
            management across different environments.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {environmentBasedConfigExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Integration with Build Tools Section */}
      <section id="integration-with-build-tools-10">
        <H1>{_('Integration with Build Tools')}</H1>
        <P>
          <Translate>
            This section demonstrates how to integrate the Terminal class
            with popular build tools and development workflows. These
            examples show practical applications for automating schema
            processing in development and deployment pipelines.
          </Translate>
        </P>

        <H2>{_('Webpack Plugin')}</H2>
        <P>
          <Translate>
            Webpack plugin integration shows how to incorporate schema
            transformation into Webpack build processes. This enables
            automatic schema processing as part of the application build
            pipeline.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {webpackPluginExample}
        </Code>

        <H2>{_('Gulp Task')}</H2>
        <P>
          <Translate>
            Gulp task integration demonstrates how to create Gulp 
            tasks that use the Terminal class for schema processing. 
            This pattern is useful for projects that use Gulp as their 
            primary build tool.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {gulpTaskExample}
        </Code>

        <H2>{_('NPM Scripts')}</H2>
        <P>
          <Translate>
            NPM scripts integration shows how to configure package.json
            scripts that use the Terminal class. This approach enables
            easy schema processing through standard npm commands and
            supports development workflows.
          </Translate>
        </P>

        <Code copy language="json" className="bg-black text-white">
          {npmScriptsExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Testing Section */}
      <section id="testing-11">
        <H1>{_('Testing')}</H1>
        <P>
          <Translate>
            This section covers testing strategies and patterns for
            applications that use the Terminal class. These examples
            demonstrate how to write effective tests for CLI functionality
            and ensure reliable schema processing.
          </Translate>
        </P>

        <H2>{_('Unit Testing')}</H2>
        <P>
          <Translate>
            Unit testing examples show how to test Terminal functionality
            in isolation. These tests verify that the Terminal class 
            behaves correctly with different command-line arguments 
            and configuration options.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {unitTestingExample}
        </Code>

        <H2>{_('Integration Testing')}</H2>
        <P>
          <Translate>
            Integration testing demonstrates how to test the complete
            workflow from command-line input to generated output files.
            These tests ensure that the entire transformation pipeline
            works correctly in realistic scenarios.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {integrationTestingExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Best Practices Section */}
      <section id="best-practices-12">
        <H1>{_('Best Practices')}</H1>
        <P>
          <Translate>
            This section outlines recommended approaches for using the
            Terminal class effectively. Following these practices helps
            ensure reliable, maintainable, and user-friendly CLI
            applications.
          </Translate>
        </P>

        <H2>{_('Error Handling')}</H2>
        <P>
          <Translate>
            Error handling best practices ensure that CLI applications
            provide clear feedback when issues occur. This section
            demonstrates patterns for implementing robust error handling
            and user-friendly error messages.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {errorHandlingBestPracticeExample}
        </Code>

        <H2>{_('Configuration Management')}</H2>
        <P>
          <Translate>
            Configuration management best practices help maintain clean,
            reusable configuration patterns. This section provides
            guidance on organizing configuration options and providing
            sensible defaults.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {configurationManagementExample}
        </Code>

        <H2>{_('Logging and Debugging')}</H2>
        <P>
          <Translate>
            Logging and debugging practices help developers troubleshoot
            issues and understand Terminal behavior. This section
            demonstrates effective logging strategies and debugging
            techniques for CLI applications.
          </Translate>
        </P>

        <Code copy language="typescript" className="bg-black text-white">
          {loggingAndDebuggingExample}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Transformer'),
          href: "/docs/transformers/pages/transformer"
        }}
        next={{
          text: _('API Reference'),
          href: "/docs/transformers/api-reference"
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
