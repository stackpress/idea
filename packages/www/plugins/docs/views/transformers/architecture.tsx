//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, P, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Architecture');
  const description = _(
    'The idea-transformer follows a clear architectural pattern that separates concerns between schema loading, processing, and output generation. This design enables flexible plugin development and maintainable code generation workflows.'
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
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">

      <H1>Architecture</H1>
      <P>
        The idea-transformer follows a clear architectural pattern that separates concerns between schema loading, processing, and output generation. This design enables flexible plugin development and maintainable code generation workflows.
      </P>
      <Code copy language='text' className='bg-black text-white'>
        {`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Schema File   │───▶│   Transformer  │───▶│    Plugins      │
│   (.idea/.json) │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Schema Config  │    │ Generated Files │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘`}
      </Code>

      <Nav
        prev={{ text: 'API Reference', href: '/docs/transformers/api-reference' }}
        next={{ text: 'Usage Patterns', href: '/docs/transformers/usage-patterns' }}
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
