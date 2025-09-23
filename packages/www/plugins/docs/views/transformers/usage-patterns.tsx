//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, P, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

const basicTransformationExample = [
  `import Transformer from '@stackpress/idea-transformer';

// Load schema and execute plugins
const transformer = await Transformer.load('./schema.idea');
await transformer.transform();`
];

const cliUsageExample = [
  `# Process schema file
node cli.js transform --input ./schema.idea

# Using short flag
node cli.js transform --i ./schema.idea`
];

const pluginDevelopmentExample = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';

export default async function myPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;
  
  // Process schema and generate output
  const content = generateFromSchema(schema);
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
}`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Usage Patterns');
  const description = _(
    'Common usage patterns for integrating the idea-transformer library ' +
    'into different development workflows'
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

export function Body() {
  //hooks
  const { _ } = useLanguage();
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <section>
        <H1>{_('Usage Patterns')}</H1>
        <P>
          <Translate>
            This section demonstrates common usage patterns for the
            idea-transformer library. These patterns show how to integrate
            the transformer into different development workflows and use cases.
          </Translate>
        </P>
      </section>

      <section>
        <H2>{_('Basic Schema Transformation')}</H2>
        <P>
          <Translate>
            The most common usage pattern involves loading a schema file and
            executing all configured plugins. This pattern is suitable for
            most build processes and automated workflows.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {basicTransformationExample[0]}
        </Code>
      </section>

      <section>
        <H2>{_('CLI Usage')}</H2>
        <P>
          <Translate>
            The command-line interface provides a simple way to process
            schemas from build scripts or CI/CD pipelines. This pattern is
            ideal for integrating schema processing into existing build
            workflows.
          </Translate>
        </P>
        <Code copy language='bash' className='bg-black text-white'>
          {cliUsageExample[0]}
        </Code>
      </section>

      <section>
        <H2>{_('Plugin Development')}</H2>
        <P>
          <Translate>
            Creating custom plugins allows you to extend the transformer with
            domain-specific code generation. This pattern shows the basic
            structure for developing type-safe plugins.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {pluginDevelopmentExample[0]}
        </Code>

      </section>

      <footer>
        <Nav
          prev={{
            text: _('Architecture'),
            href: '/docs/transformers/architecture'
          }}
          next={{
            text: _('Common Use Cases'),
            href: '/docs/transformers/common-use-cases'
          }}
        />
      </footer>
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