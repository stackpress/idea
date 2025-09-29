//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
//----------------------------------------------------------------------

const basicPluginExample =
  `import type { PluginWithCLIProps } from '@stackpress/idea';

export default function generate(props: PluginWithCLIProps) {}`

//----------------------------------------------------------------------

const basicPluginStructureExample =
`import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

export default async function myPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;
  
  // 1. Validate configuration
  if (!config.output) {
    throw new Error('Plugin requires "output" configuration');
  }
  
  // 2. Process schema
  const content = processSchema(schema);
  
  // 3. Resolve output path
  const outputPath = await transformer.loader.absolute(config.output);
  
  // 4. Write output
  await fs.writeFile(outputPath, content, 'utf8');
}

function processSchema(schema: SchemaConfig): string {
  // Implementation for processing schema
  return '// Generated content';
}`

//----------------------------------------------------------------------

const cliPluginExample =
`import type { PluginWithCLIProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';

export default async function cliPlugin(props: PluginWithCLIProps) {
  const { config, schema, transformer, cwd, cli } = props;
  
  // Access CLI properties
  const workingDir = cli.cwd;
  const fileExtension = cli.extname;
  
  // Use CLI for logging or user interaction
  console.log(\`Processing schema in: \${workingDir}\`);
  
  // Process based on CLI context
  if (config.interactive) {
    // Interactive mode logic
    console.log('Running in interactive mode...');
  }
  
  // Generate output
  const content = generateContent(schema, { workingDir, fileExtension });
  
  // Write to file
  const outputPath = path.resolve(workingDir, config.output);
  await fs.writeFile(outputPath, content, 'utf8');
  
  console.log(\`Generated: \${outputPath}\`);
}`

//----------------------------------------------------------------------

const customPluginPropsExample =
`import type { PluginProps } from '@stackpress/idea-transformer/types';

// Define custom props
interface CustomProps {
  timestamp: string;
  version: string;
  debug: boolean;
}

// Use custom props in plugin
export default async function customPlugin(props: PluginProps<CustomProps>) {
  const { config, schema, transformer, cwd, timestamp, version, debug } = props;
  
  if (debug) {
    console.log(\`Plugin executed at \${timestamp} for version \${version}\`);
  }
  
  // Plugin implementation
}

// Usage with transformer
const transformer = await Transformer.load('./schema.idea');
await transformer.transform({
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  debug: true
});`

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Plugin Development Guide');
  const description = _(
    'Comprehensive guide covering everything from basic plugin'
    + ' structure to advanced development patterns for the idea ecosystem'
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
    <main className="px-h-100-0 overflow-auto px-p-10">
      {/* Idea Plugins Section Content */}
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

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Plugin Development Guide Section Content */}
      <section>
        <H2>{_('1. Plugin Development Guide')}</H2>
        <P>
          <Translate>
            This section covers the fundamental concepts and structures
            needed to create effective plugins for the idea ecosystem.
            Plugins are JavaScript or TypeScript modules that process
            schema definitions and generate various outputs like code,
            documentation, or configuration files.
          </Translate>
        </P>

        <P>
          <Translate>
            Creating a plugin involves just exporting a function like the
            example below:
          </Translate>
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {basicPluginExample}
        </Code>
      </section>

      {/* Basic Plugin Structure Section */}
      <section>
        <H2>{_('1.1. Basic Plugin Structure')}</H2>
        <P>
          <Translate>
            The basic plugin structure provides the foundation for all
            idea plugins. This structure ensures consistency across
            plugins and provides access to essential functionality like
            schema processing, file operations, and configuration
            management.
          </Translate>
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {basicPluginStructureExample}
        </Code>

        <H3>{_('Properties')}</H3>
        <P>
          <Translate>
            The PluginProps contains the following properties.
          </Translate>
        </P>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Property</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>config</C></Tcol>
            <Tcol><C>PluginConfig</C></Tcol>
            <Tcol>
              <Translate>
                Plugin-specific configuration from the schema
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold"><C>schema</C></Tcol>
            <Tcol><C>SchemaConfig</C></Tcol>
            <Tcol>
              <Translate>
                Complete processed schema configuration
              </Translate>
            </Tcol>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>transformer</C></Tcol>
            <Tcol><C>Transformer&lt;&#123;&#125;&gt;</C></Tcol>
            <Tcol>
              <Translate>
                The transformer instance executing the plugin
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold"><C>cwd</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>
              <Translate>
                Current working directory for file operations
              </Translate>
            </Tcol>
          </Trow>
        </Table>
      </section>

      {/* CLI-Aware Plugin Structure */}
      <section>
        <H2>{_('1.2. CLI-Aware Plugin Structure')}</H2>
        <P>
          <Translate>
            CLI-aware plugins extend the basic plugin structure to
            include command-line interface capabilities. These plugins
            can interact with the terminal, access CLI-specific
            properties, and provide enhanced user experiences through
            interactive features and detailed logging.
          </Translate>
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {cliPluginExample}
        </Code>

        <H3>{_('Properties')}</H3>
        <P>
          <Translate>
            The PluginWithCLIProps contains the following properties.
          </Translate>
        </P>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Property</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>config</C></Tcol>
            <Tcol><C>PluginConfig</C></Tcol>
            <Tcol>
              <Translate>
                Plugin-specific configuration from the schema
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold"><C>schema</C></Tcol>
            <Tcol><C>SchemaConfig</C></Tcol>
            <Tcol>
              <Translate>
                Complete processed schema configuration
              </Translate>
            </Tcol>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>transformer</C></Tcol>
            <Tcol><C>Transformer&lt;&#123;&#125;&gt;</C></Tcol>
            <Tcol>
              <Translate>
                The transformer instance executing the plugin
              </Translate>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold"><C>cwd</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>
              <Translate>
                Current working directory for file operations
              </Translate>
            </Tcol>
          </Trow>
          <Trow>
            <Tcol className="font-bold"><C>cli</C></Tcol>
            <Tcol><C>Terminal</C></Tcol>
            <Tcol>
              <Translate>
                Terminal instance for CLI interactions
              </Translate>
            </Tcol>
          </Trow>
        </Table>
      </section>

      {/* Custom Plugin Props */}
      <section>
        <H2>{_('1.3. Custom Plugin Props')}</H2>
        <P>
          <Translate>
            Custom plugin props allow developers to extend the base
            plugin functionality with additional properties and
            configuration options. This feature enables plugins to
            receive custom data, maintain state, and implement
            specialized behaviors beyond the standard plugin interface.
          </Translate>
        </P>

        <P>
          <Translate>
            You can extend the base plugin props with custom properties:
          </Translate>
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {customPluginPropsExample}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Transformers'),
          href: '/docs/transformers/introduction'
        }}
        next={{
          text: _('Plugin Examples'),
          href: '/docs/plugin-development/plugin-examples'
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
