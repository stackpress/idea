//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, P, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

const errorHandlingExample = [
  `import { Exception } from '@stackpress/idea-parser';

try {
  const transformer = await Transformer.load('./schema.idea');
  await transformer.transform();
} catch (error) {
  if (error instanceof Exception) {
    console.error('Schema error:', error.message);
    console.error('Error code:', error.code);
  } else {
    console.error('Unexpected error:', error);
  }
}`
];


export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Error Handling');
  const description = _(
    'Comprehensive error handling for the idea-transformer library'
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
        <H1>{_('Error Handling')}</H1>
        <P>
          <Translate>
            The idea-transformer library provides comprehensive error
            handling to help you identify and resolve issues during schema
            processing. This section covers error types and handling
            strategies.
          </Translate>
        </P>

        <P>
          <Translate>
            The library provides comprehensive error handling with detailed
            error messages:
          </Translate>
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {errorHandlingExample[0]}
        </Code>
      </section>

      <footer>
        <Nav
          prev={{
            text: _('Examples'),
            href: '/docs/transformers/examples'
          }}
          next={{
            text: _('Best Practices'),
            href: '/docs/transformers/best-practices'
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