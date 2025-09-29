//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import Use from '../../components/specifications/schema-directives/Use.js';
import Plugin from '../../components/specifications/schema-directives/Plugin.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Schema Directives');
  const description = _(
    'Schema directives are special declarations that control how ' +
    'the schema is processed and what outputs are generated.'
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
        <link
          key={index}
          rel="stylesheet"
          type="text/css"
          href={href}
        />
      ))}
    </>
  )
}

export function Right() {
  const { _ } = useLanguage();
  return (
    <aside className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('On this page')}
      </h6>
      <nav className="px-fs-14 px-lh-28 flex flex-col">
        <a
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          href="#use"
        >
          {_('Use')}
        </a>
        <a
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          href="#plugin"
        >
          {_('Plugin')}
        </a>
      </nav>
    </aside>
  );
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      {/* Schema Directives Content */}
      <section>
        <H1>{_('Schema Directives')}</H1>
        <P>
          <Translate>
            Schema directives are special declarations that control how
            the schema is processed and what outputs are generated.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10 ' />

      {/* Use, Plugin Content */}
      <section>
        {/* Use Section */}
        <Use />

        {/* Horizontal Rule */}
        <hr className='mt-10 ' />

        {/* Plugin Section */}
        <Plugin />
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Schema Structure'),
          href: '/docs/specifications/schema-structure'
        }}
        next={{
          text: _('Processing Flow'),
          href: '/docs/specifications/processing-flow'
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
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}
