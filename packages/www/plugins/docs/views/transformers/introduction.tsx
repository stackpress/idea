//modules
import type {
    ServerConfigProps,
    ServerPageProps
  } from 'stackpress/view/client';
  import { useLanguage } from 'stackpress/view/client';
  //docs
  import { H1, H2, H3, P, C, Nav, SS } from '../../components/index.js';
  import Code from '../../components/Code.js';
  import Layout from '../../components/Layout.js';
  
  export function Head(props: ServerPageProps<ServerConfigProps>) {
    //props
    const { request, styles = [] } = props;
    //hooks
    const { _ } = useLanguage();
    //variables
    const title = _('Quick Start');
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
  
  const installationExample = [
    `npm install @stackpress/idea-transformer`
  ];
  
  const basicUsageExample = [
    `import Transformer from '@stackpress/idea-transformer';

// Load and process a schema
const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();`
  ];
  
  export function Body() {
    return (
      <main className="px-h-100-0 overflow-auto px-p-10">
        <H1>Overview</H1>
        <P>
          The idea-transformer library provides a complete solution for processing schema files and generating code through a flexible plugin system. This library serves as the core transformation engine that bridges schema definitions with code generation.
        </P>
        
        <P>
          The idea-transformer library provides a complete solution for:
        </P>
        
        <ul className="list-disc pl-6 my-4">
          <li className="my-2"><C>Schema Processing:</C> Load and parse .idea schema files with support for imports and merging</li>
          <li className="my-2"><C>Plugin System:</C> Execute transformation plugins that generate code, documentation, or other outputs</li>
          <li className="my-2"><C>CLI Integration:</C> Command-line interface for processing schemas in build pipelines</li>
          <li className="my-2"><C>Type Safety:</C> Full TypeScript support with comprehensive type definitions</li>
        </ul>

        <H1>Quick Start</H1>
        <P>
          Get started with the idea-transformer library in just a few steps. This section shows you how to install the library and perform basic schema transformation operations.
        </P>

        <H3>Installation</H3>
        <Code copy language='bash' className='bg-black text-white'>
          {installationExample[0]}
        </Code>

        <H3>Basic Usage</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {basicUsageExample[0]}
        </Code>

        <Nav
          prev={{ text: 'Parser', href: '/docs/parser/installation' }}
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
      >
        <Body />
      </Layout>
    );
  }
  