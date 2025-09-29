//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H3, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

//code examples
//----------------------------------------------------------------------

const installationExample = `npm install @stackpress/idea-transformer`

//----------------------------------------------------------------------

const basicUsageExample =
  `import Transformer from '@stackpress/idea-transformer';

// Load and process a schema
const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();`

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Introduction');
  const description = _(
    'Get started with the idea-transformer library'
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
      {/* Overview Section Content */}
      <section>
        <H1>{_('Overview')}</H1>
        <P>
          <Translate>
            The idea-transformer library provides a complete solution for
            processing schema files and generating code through a flexible
            plugin system. This library serves as the core transformation
            engine that bridges schema definitions with code generation.
          </Translate>
        </P>

        <P>
          <Translate>
            The idea-transformer library provides a complete solution for:
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Features List Section Content */}
      <section>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <C>{_('Schema Processing:')}</C>
            <Translate>
              Load and parse .idea schema files with support for
              'imports and merging
            </Translate>
          </li>
          <li className="my-2">
            <C>{_('Plugin System:')}</C>
            <Translate>
              Execute transformation plugins that generate code,
              documentation, or other outputs
            </Translate>
          </li>
          <li className="my-2">
            <C>{_('CLI Integration:')}</C>
            <Translate>
              Command-line interface for processing schemas in
              build pipelines
            </Translate>
          </li>
          <li className="my-2">
            <C>{_('Type Safety:')}</C>
            <Translate>
              Full TypeScript support with comprehensive type
              definitions
            </Translate>
          </li>
        </ul>
      </section>

      {/* Quick Start Section Content */}
      <section>
        <H1>{_('Quick Start')}</H1>
        <P>
          <Translate>
            Get started with the idea-transformer library in just a few
            steps. This section shows you how to install the library and
            perform basic schema transformation operations.
          </Translate>
        </P>

        <H3>{_('Installation')}</H3>
        <Code copy language='bash' className='bg-black text-white'>
          {installationExample}
        </Code>

        <H3>{_('Basic Usage')}</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {basicUsageExample}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{ text: _('Parser'), href: '/docs/parser/installation' }}
        next={{
          text: _('API Reference'),
          href: '/docs/transformers/api-reference'
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
