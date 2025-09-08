//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Getting Started');
  const description = _(
    'Essential information for developers who are new to plugin development with prerequisites, basic concepts, and step-by-step guidance'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/idea-logo-icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/idea-logo-icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}


const commonPluginStructureExample = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface MyPluginConfig {
  output: string;
  // ... other configuration options
}

export default async function myPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  // 1. Validate configuration
  if (!config.output) {
    throw new Error('Plugin requires "output" configuration');
  }
  
  // 2. Process schema
  const content = processSchema(schema);
  
  // 3. Write output
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  console.log(\`✅ Generated: \${outputPath}\`);
}`
];

const schemaStructureExample = [
  `{
  model: {
    [modelName]: {
      mutable: boolean,
      columns: [
        {
          name: string,
          type: string,
          required: boolean,
          multiple: boolean,
          attributes: object
        }
      ]
    }
  },
  enum: {
    [enumName]: {
      [key]: value
    }
  },
  type: {
    [typeName]: {
      mutable: boolean,
      columns: [...]
    }
  },
  prop: {
    [propName]: {
      // Property configuration
    }
  }
}`
];

const typeSafetyExample = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';

interface MyPluginConfig {
  output: string;
  format?: 'json' | 'yaml';
}

export default async function myPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  // TypeScript will enforce the config structure
}`
];

const configurationValidationExample = [
  `function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('Plugin requires "output" configuration');
  }
  
  if (config.format && !['json', 'yaml'].includes(config.format)) {
    throw new Error(\`Unsupported format: \${config.format}\`);
  }
}`
];

const fileOperationsExample = [
  `// ✅ Good - uses transformer's file loader
const outputPath = await transformer.loader.absolute(config.output);

// ✅ Good - creates directories if needed
await fs.mkdir(path.dirname(outputPath), { recursive: true });

// ✅ Good - proper error handling
try {
  await fs.writeFile(outputPath, content, 'utf8');
} catch (error) {
  throw new Error(\`Failed to write file: \${error.message}\`);
}`
];

const errorHandlingExample = [
  `export default async function myPlugin(props: PluginProps<{}>) {
  try {
    // Validate configuration
    validateConfig(props.config);
    
    // Check for required schema elements
    if (!props.schema.model || Object.keys(props.schema.model).length === 0) {
      console.warn('⚠️  No models found in schema. Skipping generation.');
      return;
    }
    
    // Process and generate
    // ...
    
    console.log('✅ Plugin completed successfully');
    
  } catch (error) {
    console.error(\`❌ Plugin failed: \${error.message}\`);
    throw error;
  }
}`
];

const schemaProcessingExample = [
  `// ✅ Good - checks for existence before processing
if (schema.model) {
  for (const [modelName, model] of Object.entries(schema.model)) {
    // Process model
  }
}

// ✅ Good - provides defaults for optional attributes
const attributes = column.attributes || {};
const label = attributes.label || column.name;
const description = attributes.description || '';`
];

const usageInSchemaFilesExample = [
  `// schema.idea
plugin "./plugins/mysql-tables-plugin.js" {
  output "./database/tables.sql"
  database "my_app"
  engine "InnoDB"
}

plugin "./plugins/html-form-plugin.js" {
  output "./forms/user-form.html"
  title "User Registration"
  theme "bootstrap"
}

plugin "./plugins/markdown-docs-plugin.js" {
  output "./docs/schema.md"
  title "API Documentation"
  format "single"
  includeExamples true
}

model User {
  id String @id @default("nanoid()")
  email String @unique @field.input(Email)
  name String @field.input(Text)
  role UserRole @default("USER")
  active Boolean @default(true)
  created Date @default("now()")
}

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
}`
];

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Getting Started</H1>
      <P>
        This section provides essential information for developers who are new to plugin development. It covers prerequisites, basic concepts, and step-by-step guidance for creating your first plugin.
      </P>

      <H2>8.1. Prerequisites</H2>
      <P>
        Before starting plugin development, ensure you have the necessary knowledge and tools. These prerequisites will help you understand the examples and successfully implement your own plugins.
      </P>

      <P>
        Before starting these tutorials, make sure you have:
      </P>

      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Basic understanding of TypeScript/JavaScript</li>
        <li className="my-2">Familiarity with the <C>idea-transformer</C> plugin system</li>
        <li className="my-2">Understanding of the target technology (MySQL, HTML/CSS, Markdown)</li>
      </ul>

      <H2>8.2. Plugin Development Basics</H2>
      <P>
        Plugin development follows consistent patterns that make it easy to create new plugins once you understand the core concepts. This section outlines the fundamental steps and patterns used across all plugin types.
      </P>

      <P>
        All plugins in the <C>idea-transformer</C> system follow a similar pattern:
      </P>

      <ol className="list-decimal pl-6 my-4">
        <li className="my-2"><strong>Import Types:</strong> Use the provided TypeScript types for type safety</li>
        <li className="my-2"><strong>Define Configuration:</strong> Specify what configuration options your plugin accepts</li>
        <li className="my-2"><strong>Validate Input:</strong> Check that required configuration is provided</li>
        <li className="my-2"><strong>Process Schema:</strong> Parse the schema and extract relevant information</li>
        <li className="my-2"><strong>Generate Output:</strong> Create the target files or content</li>
        <li className="my-2"><strong>Handle Errors:</strong> Provide meaningful error messages and graceful failure</li>
      </ol>

      <H2>8.3. Common Plugin Structure</H2>
      <P>
        The common plugin structure provides a template that can be adapted for any type of code generation. This structure ensures consistency across plugins and includes all essential components for robust plugin development.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {commonPluginStructureExample[0]}
      </Code>

      <H2>8.4. Schema Structure</H2>
      <P>
        Understanding the schema structure is crucial for plugin development. The processed schema provides a standardized format that plugins can rely on, regardless of the original <C>.idea</C> file structure.
      </P>

      <P>
        All plugins receive a processed schema with this structure:
      </P>

      <Code copy language='javascript' className='bg-black text-white'>
        {schemaStructureExample[0]}
      </Code>

      <H2>8.5. Implementation Guidelines</H2>
      <P>
        These implementation guidelines help ensure that your plugins are reliable, maintainable, and follow established patterns. Following these guidelines will make your plugins easier to debug and extend.
      </P>

      <H3>8.5.1. Type Safety</H3>
      <P>
        Type safety prevents runtime errors and provides better development experiences through IDE support and compile-time error checking.
      </P>

      <P>
        Always use the provided TypeScript types:
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {typeSafetyExample[0]}
      </Code>

      <H3>8.5.2. Configuration Validation</H3>
      <P>
        Configuration validation ensures that plugins receive valid input and fail early with clear error messages when configuration is incorrect.
      </P>

      <P>
        Validate all required configuration upfront:
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {configurationValidationExample[0]}
      </Code>

      <H3>8.5.3. File Operations</H3>
      <P>
        File operations should follow consistent patterns for path resolution, directory creation, and error handling to ensure compatibility with the idea transformer system.
      </P>

      <P>
        Use the transformer's file loader for consistent path resolution:
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {fileOperationsExample[0]}
      </Code>

      <H3>8.5.4. Error Handling</H3>
      <P>
        Comprehensive error handling provides better user experiences and makes plugins more reliable in production environments.
      </P>

      <P>
        Provide meaningful error messages and handle edge cases:
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {errorHandlingExample[0]}
      </Code>

      <H3>8.5.5. Schema Processing</H3>
      <P>
        Schema processing should handle optional elements gracefully and provide meaningful defaults to ensure plugins work with various schema configurations.
      </P>

      <P>
        Handle optional schema elements gracefully:
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {schemaProcessingExample[0]}
      </Code>

      <H2>8.6. Usage in Schema Files</H2>
      <P>
        This section demonstrates how to use plugins within <C>.idea</C> schema files, showing the declarative syntax for plugin configuration and how multiple plugins can work together to generate comprehensive outputs.
      </P>

      <P>
        To use any of these plugins in your schema file:
      </P>

      <Code copy language='idea' className='bg-black text-white'>
        {usageInSchemaFilesExample[0]}
      </Code>

      <H2>8.7. Next Steps</H2>
      <P>
        After completing the getting started section, you'll be ready to dive into specific tutorials and start building your own plugins. These next steps will guide you toward becoming proficient in plugin development.
      </P>

      <ol className="list-decimal pl-6 my-4">
        <li className="my-2"><strong>Choose a Tutorial:</strong> Start with the tutorial that matches your immediate needs</li>
        <li className="my-2"><strong>Follow Along:</strong> Each tutorial provides step-by-step instructions with complete code examples</li>
        <li className="my-2"><strong>Customize:</strong> Adapt the examples to your specific requirements</li>
        <li className="my-2"><strong>Extend:</strong> Use the patterns learned to create your own custom plugins</li>
      </ol>

      <H2>8.8. Additional Plugin Ideas</H2>
      <P>
        Beyond the provided tutorials, there are many other types of plugins you can create using the patterns and techniques covered in this documentation:
      </P>

      <ul className="list-disc pl-6 my-4">
        <li className="my-2"><strong>Database Migration Generator:</strong> Create migration files for various databases</li>
        <li className="my-2"><strong>Form Validation Generator:</strong> Generate client-side validation rules</li>
        <li className="my-2"><strong>Mock Server Generator:</strong> Create mock API servers for testing</li>
        <li className="my-2"><strong>Documentation Site Generator:</strong> Build complete documentation websites</li>
        <li className="my-2"><strong>Configuration File Generator:</strong> Generate app configuration files</li>
        <li className="my-2"><strong>Seed Data Generator:</strong> Create database seed scripts</li>
        <li className="my-2"><strong>API Test Generator:</strong> Generate automated API test suites</li>
      </ul>

      <P>
        Happy coding! 🚀
      </P>

      <Nav
        prev={{ text: 'Advanced Tutorials', href: '/docs/plugin-development/advanced-tutorials' }}
        next={{ text: 'Plugin Development Guide', href: '/docs/plugin-development/plugin-development-guide' }}
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
    >
      <Body />
    </Layout>
  );
}
