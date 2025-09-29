//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import Models from '../../components/specifications/data-types/Models.js';
import Type from '../../components/specifications/data-types/Type.js';
import Props from '../../components/specifications/data-types/Props.js';
import Enums from '../../components/specifications/data-types/Enums.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Data Types');
  const description = _(
    'The .idea format supports four primary data types that form ' +
    'the building blocks of your application schema.'
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

      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
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
          href="#enums"
        >
          {_('Enums')}
        </a>
        <a
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          href="#props-1"
        >
          {_('Props')}
        </a>
        <a
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          href="#type"
        >
          {_('Type')}
        </a>
        <a
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          href="#models"
        >
          {_('Models')}
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
      {/* Data Types Content */}
      <section>
        <H1>{_('Data Types')}</H1>
        <P>
          <Translate>
            The .idea format supports four primary data types that form
            the building blocks of your application schema.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10 ' />

      {/* Enums, Props, Type, Models Content */}
      <section>
        {/* Enums Section */}
        <Enums />

        {/* Horizontal Rule */}
        <hr className='mt-10 ' />

        {/* Props Section */}
        <Props />

        {/* Horizontal Rule */}
        <hr className='mt-10 ' />

        {/* Type Section */}
        <Type />

        {/* Horizontal Rule */}
        <hr className='mt-10 ' />

        {/* Models Section */}
        <Models />
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Syntax Overview'),
          href: '/docs/specifications/syntax-overview'
        }}
        next={{
          text: _('Schema Elements'),
          href: '/docs/specifications/schema-elements'
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
