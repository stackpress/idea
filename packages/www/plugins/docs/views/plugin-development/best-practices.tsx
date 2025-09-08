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
  const title = _('Best Practices');
  const description = _(
    'Essential best practices for plugin development covering type safety, configuration validation, file operations, and CLI integration'
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

const typeSafetyExample = [
  `// Always use proper typing for plugin props
import type { PluginProps, PluginWithCLIProps } from '@stackpress/idea-transformer/types';

// Define custom config types
interface MyPluginConfig {
  output: string;
  format: 'typescript' | 'javascript';
  strict?: boolean;
}

// Use typed props
export default async function typedPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  const { config } = props;
  
  // TypeScript will enforce config structure
  const output: string = config.output; // ✅ Type-safe
  const format: 'typescript' | 'javascript' = config.format; // ✅ Type-safe
  const strict: boolean = config.strict ?? false; // ✅ Type-safe with default
}`
];

const configurationValidationExample = [
  `function validateConfig(config: any): asserts config is MyPluginConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('Plugin requires "output" configuration as string');
  }
  
  if (!config.format || !['typescript', 'javascript'].includes(config.format)) {
    throw new Error('Plugin requires "format" to be "typescript" or "javascript"');
  }
}

export default async function validatedPlugin(props: PluginProps<{}>) {
  validateConfig(props.config);
  
  // Now config is properly typed
  const { output, format } = props.config;
}`
];

const fileOperationsExample = [
  `// Use transformer's file loader for consistent path resolution
export default async function filePlugin(props: PluginProps<{}>) {
  const { config, transformer } = props;
  
  // ✅ Use transformer.loader for path resolution
  const outputPath = await transformer.loader.absolute(config.output);
  
  // ✅ Create directories if needed
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  
  // ✅ Write file with proper error handling
  try {
    await fs.writeFile(outputPath, content, 'utf8');
  } catch (error) {
    throw new Error(\`Failed to write output file: \${error.message}\`);
  }
}`
];

const cliIntegrationExample = [
  `// Use CLI props when available
export default async function adaptivePlugin(props: PluginWithCLIProps) {
  const { cli, config } = props;
  
  // Adapt behavior based on CLI context
  const outputDir = config.outputDir || path.join(cli.cwd, 'generated');
  const verbose = config.verbose || false;
  
  if (verbose) {
    console.log(\`Generating files in: \${outputDir}\`);
    console.log(\`Working directory: \${cli.cwd}\`);
    console.log(\`File extension: \${cli.extname}\`);
  }
  
  // Use CLI working directory for relative paths
  const absoluteOutputDir = path.resolve(cli.cwd, outputDir);
  
  // Generate files...
}`
];

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Best Practices</H1>
      <P>
        This section outlines essential best practices for plugin development, covering type safety, configuration validation, file operations, and CLI integration. Following these practices ensures that plugins are reliable, maintainable, and provide excellent developer experiences.
      </P>

      <H2>5.1. Type Safety</H2>
      <P>
        Type safety is crucial for creating reliable plugins that catch errors at compile time rather than runtime. This section demonstrates how to use TypeScript effectively in plugin development, including proper typing for configuration objects and plugin properties.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {typeSafetyExample[0]}
      </Code>

      <H2>5.2. Configuration Validation</H2>
      <P>
        Configuration validation ensures that plugins receive valid configuration options and fail early with clear error messages when configuration is invalid. This approach prevents runtime errors and provides better debugging experiences for plugin users.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {configurationValidationExample[0]}
      </Code>

      <H2>5.3. File Operations</H2>
      <P>
        File operations in plugins should follow consistent patterns for path resolution, directory creation, and error handling. This section demonstrates best practices for working with files and directories in a way that's compatible with the idea transformer system.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {fileOperationsExample[0]}
      </Code>

      <H2>5.4. CLI Integration</H2>
      <P>
        CLI integration enables plugins to provide rich command-line experiences by adapting behavior based on the execution context. This section shows how to use CLI properties effectively and create plugins that work well in both programmatic and interactive environments.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {cliIntegrationExample[0]}
      </Code>

      <Nav
        prev={{ text: 'Error Handling', href: '/docs/plugin-development/error-handling' }}
        next={{ text: 'Available Tutorials', href: '/docs/plugin-development/available-tutorials' }}
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
