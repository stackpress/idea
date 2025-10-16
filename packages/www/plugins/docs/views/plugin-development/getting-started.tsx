//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, H3, C, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const commonPluginStructureExample = 
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
  const outputPath = await transformer.loader.absolute(
    config.output
  );
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
  
  console.log(\`✅ Generated: \${outputPath}\`);
}`;

//--------------------------------------------------------------------//

const schemaStructureExample =
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
}`;

//--------------------------------------------------------------------//

const typeSafetyExample =
`import type { PluginProps } from '@stackpress/idea-transformer/types';

interface MyPluginConfig {
  output: string;
  format?: 'json' | 'yaml';
}

export default async function myPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  // TypeScript will enforce the config structure
}`;

//--------------------------------------------------------------------//

const configurationValidationExample =
  `function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('Plugin requires "output" configuration');
  }
  
  if (config.format && !['json', 'yaml'].includes(config.format)) {
    throw new Error(
      \`Unsupported format: \${config.format}\`
    );
  }
}`;

//--------------------------------------------------------------------//

const fileOperationsExample = 
`// ✅ Good - uses transformer's file loader
const outputPath = await transformer.loader.absolute(
  config.output
);

// ✅ Good - creates directories if needed
await fs.mkdir(path.dirname(outputPath), { recursive: true });

// ✅ Good - proper error handling
try {
  await fs.writeFile(outputPath, content, 'utf8');
} catch (error) {
  throw new Error(
    \`Failed to write file: \${error.message}\`
  );
}`;

//--------------------------------------------------------------------//

const errorHandlingExample = 
`export default async function myPlugin(props: PluginProps<{}>) {
  try {
    // Validate configuration
    validateConfig(props.config);
    
    // Check for required schema elements
    if (
      !props.schema.model || 
      Object.keys(props.schema.model).length === 0
    ) {
      console.warn(
        '⚠️  No models found in schema. Skipping generation.'
      );
      return;
    }
    
    // Process and generate
    // ...
    
    console.log('✅ Plugin completed successfully');
    
  } catch (error) {
    console.error(\`❌ Plugin failed: \${error.message}\`);
    throw error;
  }
}`;

//--------------------------------------------------------------------//

const schemaProcessingExample = 
  `// ✅ Good - checks for existence before processing
if (schema.model) {
  for (const [modelName, model] of Object.entries(
    schema.model
  )) {
    // Process model
  }
}

// ✅ Good - provides defaults for optional attributes
const attributes = column.attributes || {};
const label = attributes.label || column.name;
const description = attributes.description || '';`;

//--------------------------------------------------------------------//

const usageInSchemaFilesExample =
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
}`;

//--------------------------------------------------------------------//

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Getting Started');
  const description = _(
    'Essential information for developers who are new to plugin ' +
    'development with prerequisites, basic concepts, and step-by-step ' +
    'guidance'
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

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Getting Started Section Content */}
      <section>
        <H1>{_('Getting Started')}</H1>
        <Translate>
          This section provides essential information for developers who
          are new to plugin development. It covers prerequisites, basic
          concepts, and step-by-step guidance for creating your first
          plugin.
        </Translate>
      </section>

      {/* Prerequisites Section */}
      <section>
        <H2>{_('8.1. Prerequisites')}</H2>
        <Translate>
          Before starting plugin development, ensure you have the
          necessary knowledge and tools. These prerequisites will help
          you understand the examples and successfully implement your
          own plugins.
        </Translate>

        <Translate>
          Before starting these tutorials, make sure you have:
        </Translate>

        <ul className="list-disc my-4 pl-6">
          <li className="my-2">
            <Translate>
              Basic understanding of TypeScript/JavaScript
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Familiarity with the <C>idea-transformer</C> plugin system
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Understanding of the target technology
              (MySQL, HTML/CSS, Markdown)
            </Translate>
          </li>
        </ul>
      </section>

      {/* Plugin Development Basics Section */}
      <section>
        <H2>{_('8.2. Plugin Development Basics')}</H2>
        <Translate>
          Plugin development follows consistent patterns that make it
          easy to create new plugins once you understand the core
          concepts. This section outlines the fundamental steps and
          patterns used across all plugin types.
        </Translate>

        <Translate>
          All plugins in the <C>idea-transformer</C> system follow a
          similar pattern:
        </Translate>

        <ol className="list-decimal my-4 pl-6">
          <li className="my-2">
            <Translate>
              <SS>Import Types:</SS> Use the provided TypeScript
              types for type safety
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Define Configuration:</SS> Specify what
              configuration options your plugin accepts
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Validate Input:</SS> Check that required
              configuration is provided
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Process Schema:</SS> Parse the schema and
              extract relevant information
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Generate Output:</SS> Create the target files
              or content
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Handle Errors:</SS> Provide meaningful error
              messages and graceful failure
            </Translate>
          </li>
        </ol>
      </section>

      {/* Common Plugin Structure Section */}
      <section> 
        <H2>{_('8.3. Common Plugin Structure')}</H2>
        <Translate>
          The common plugin structure provides a template that can be
          adapted for any type of code generation. This structure
          ensures consistency across plugins and includes all essential
          components for robust plugin development.
        </Translate>

        <Code copy language="typescript" className="bg-black text-white">
          {commonPluginStructureExample}
        </Code>
      </section>

      {/* Schema Structure Section */}
      <section>
        <H2>{_('8.4. Schema Structure')}</H2>
        <Translate>
          Understanding the schema structure is crucial for plugin
          development. The processed schema provides a standardized
          format that plugins can rely on, regardless of the original
          <C>.idea</C> file structure.
        </Translate>

        <Translate>
          All plugins receive a processed schema with this structure:
        </Translate>

        <Code copy language="javascript" className="bg-black text-white">
          {schemaStructureExample}
        </Code>
      </section>

      {/* Implementation Guidelines Section */}
      <section>
        <H2>{_('8.5. Implementation Guidelines')}</H2>
        <Translate>
          These implementation guidelines help ensure that your plugins
          are reliable, maintainable, and follow established patterns.
          Following these guidelines will make your plugins easier to
          debug and extend.
        </Translate>

        <section>
          <H3>{_('8.5.1. Type Safety')}</H3>
          <Translate>
            Type safety prevents runtime errors and provides better
            development experiences through IDE support and compile-time
            error checking.
          </Translate>

          <Translate>
            Always use the provided TypeScript types:
          </Translate>

          <Code copy language="typescript" className="bg-black text-white">
            {typeSafetyExample}
          </Code>
        </section>

        <section>
          <H3>{_('8.5.2. Configuration Validation')}</H3>
          <Translate>
            Configuration validation ensures that plugins receive valid
            input and fail early with clear error messages when
            configuration is incorrect.
          </Translate>

          <Translate>
            Validate all required configuration upfront:
          </Translate>

          <Code copy language="typescript" className="bg-black text-white">
            {configurationValidationExample}
          </Code>
        </section>

        <section>
          <H3>{_('8.5.3. File Operations')}</H3>
          <Translate>
            File operations should follow consistent patterns for path
            resolution, directory creation, and error handling to ensure
            compatibility with the idea transformer system.
          </Translate>

          <Translate>
            Use the transformer's file loader for consistent path
            resolution:
          </Translate>

          <Code copy language="typescript" className="bg-black text-white">
            {fileOperationsExample}
          </Code>
        </section>

        <section>
          <H3>{_('8.5.4. Error Handling')}</H3>
          <Translate>
            Comprehensive error handling provides better user experiences
            and makes plugins more reliable in production environments.
          </Translate>

          <Translate>
            Provide meaningful error messages and handle edge cases:
          </Translate>

          <Code copy language="typescript" className="bg-black text-white">
            {errorHandlingExample}
          </Code>
        </section>

        <section>
          <H3>{_('8.5.5. Schema Processing')}</H3>
          <Translate>
            Schema processing should handle optional elements gracefully
            and provide meaningful defaults to ensure plugins work with
            various schema configurations.
          </Translate>

          <Translate>
            Handle optional schema elements gracefully:
          </Translate>

          <Code copy language="typescript" className="bg-black text-white">
            {schemaProcessingExample}
          </Code>
        </section>
      </section>

      {/* Usage in Schema Files Section */}
      <section>
        <H2>{_('8.6. Usage in Schema Files')}</H2>
        <Translate>
          This section demonstrates how to use plugins within
          <C>.idea</C> schema files, showing the declarative syntax
          for plugin configuration and how multiple plugins can work
          together to generate comprehensive outputs.
        </Translate>

        <Translate>
          To use any of these plugins in your schema file:
        </Translate>

        <Code copy language="idea" className="bg-black text-white">
          {usageInSchemaFilesExample}
        </Code>
      </section>

      {/* Next Steps Section */}
      <section>
        <H2>{_('8.7. Next Steps')}</H2>
        <Translate>
          After completing the getting started section, you'll be ready
          to dive into specific tutorials and start building your own
          plugins. These next steps will guide you toward becoming
          proficient in plugin development.
        </Translate>

        <ol className="list-decimal my-4 pl-6">
          <li className="my-2">
            <Translate>
              <SS>Choose a Tutorial:</SS> Start with the tutorial
              that matches your immediate needs
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Follow Along:</SS> Each tutorial provides
              step-by-step instructions with complete code examples
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Customize:</SS> Adapt the examples to your
              specific requirements
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Extend:</SS> Use the patterns learned to
              create your own custom plugins
            </Translate>
          </li>
        </ol>
      </section>

      {/* Additional Plugin Ideas Section */}
      <section>
        <H2>{_('8.8. Additional Plugin Ideas')}</H2>
        <Translate>
          Beyond the provided tutorials, there are many other types of
          plugins you can create using the patterns and techniques
          covered in this documentation:
        </Translate>

        <ul className="list-disc my-4 pl-6">
          <li className="my-2">
            <Translate>
              <SS>Database Migration Generator:</SS> Create
              migration files for various databases
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Form Validation Generator:</SS> Generate
              client-side validation rules
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Mock Server Generator:</SS> Create mock API
              servers for testing
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Documentation Site Generator:</SS> Build
              complete documentation websites
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Configuration File Generator:</SS> Generate
              app configuration files
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Seed Data Generator:</SS> Create database
              seed scripts
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>API Test Generator:</SS> Generate automated
              API test suites
            </Translate>
          </li>
        </ul>

        <Translate>
          Happy coding! 🚀
        </Translate>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Advanced Tutorials'),
          href: "/docs/plugin-development/advanced-tutorials"
        }}
        next={{
          text: _('Tutorial'),
          href: "/docs/tutorials/tsmorph-plugin-guide"
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
    >
      <Body />
    </Layout>
  );
}
