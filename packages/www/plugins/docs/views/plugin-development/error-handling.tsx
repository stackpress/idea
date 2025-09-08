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
  const title = _('Error Handling');
  const description = _(
    'Proper error handling is essential for creating robust plugins that provide clear feedback when issues occur'
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

const pluginErrorHandlingExample = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';

export default async function safePlugin(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate required configuration
    if (!config.output) {
      throw new Error('Missing required "output" configuration');
    }
    
    // Validate schema has required elements
    if (!schema.model || Object.keys(schema.model).length === 0) {
      throw new Error('Schema must contain at least one model');
    }
    
    // Process schema
    const content = await processSchema(schema);
    
    // Write output
    const outputPath = await transformer.loader.absolute(config.output);
    await writeOutput(outputPath, content);
    
    console.log(\`✅ Plugin completed successfully: \${outputPath}\`);
    
  } catch (error) {
    console.error(\`❌ Plugin failed:\`, error.message);
    throw error; // Re-throw to stop transformation
  }
}`
];

const gracefulErrorRecoveryExample = [
  `export default async function resilientPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  const warnings: string[] = [];
  
  try {
    // Attempt primary functionality
    await primaryGeneration(schema, config);
  } catch (error) {
    warnings.push(\`Primary generation failed: \${error.message}\`);
    
    // Fallback to basic generation
    try {
      await fallbackGeneration(schema, config);
      warnings.push('Used fallback generation');
    } catch (fallbackError) {
      throw new Error(\`Both primary and fallback generation failed: \${fallbackError.message}\`);
    }
  }
  
  // Report warnings
  if (warnings.length > 0) {
    console.warn('Plugin completed with warnings:');
    warnings.forEach(warning => console.warn(\`  ⚠️  \${warning}\`));
  }
}`
];

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Error Handling</H1>
      <P>
        Proper error handling is essential for creating robust plugins that provide clear feedback when issues occur. This section covers error handling strategies, validation patterns, and techniques for graceful failure recovery in plugin development.
      </P>

      <H2>4.1. Plugin Error Handling</H2>
      <P>
        Plugin error handling demonstrates how to implement comprehensive error checking and reporting in plugins. This approach ensures that plugins fail gracefully with meaningful error messages, helping users quickly identify and resolve configuration or schema issues.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {pluginErrorHandlingExample[0]}
      </Code>

      <H2>4.2. Graceful Error Recovery</H2>
      <P>
        Graceful error recovery shows how plugins can implement fallback mechanisms and continue operation even when primary functionality fails. This approach improves plugin reliability and provides better user experiences by attempting alternative approaches when errors occur.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {gracefulErrorRecoveryExample[0]}
      </Code>

      <Nav
        prev={{ text: 'Plugin Configuration', href: '/docs/plugin-development/plugin-configuration' }}
        next={{ text: 'Best Practices', href: '/docs/plugin-development/best-practices' }}
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
