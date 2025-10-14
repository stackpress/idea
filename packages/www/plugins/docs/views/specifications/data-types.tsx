//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
import clsx from 'clsx';
//local
import { H1, P, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
//data types components
import {
  Enums,
  Models,
  Props,
  Type
} from '../../components/specifications/data-types/index.js';

//styles
//-----------------------------------------------------------------

const anchorStyles = clsx(
  'cursor-pointer',
  'hover:text-blue-700',
  'text-blue-500'
);

//-----------------------------------------------------------------

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
  //hooks
  const { _ } = useLanguage();

  return (
    <aside className="overflow-auto px-h-100-40 px-m-0 px-px-10 px-py-20">
      <h6 className="px-fs-14 px-mb-0 px-mt-0 px-pb-10 theme-muted uppercase">
        {_('On this page')}
      </h6>
      <nav className="flex flex-col px-fs-14 px-lh-28">
        <a
          className={anchorStyles}
          href="#enums"
        >
          {_('Enums')}
        </a>
        <a
          className={anchorStyles}
          href="#props-1"
        >
          {_('Props')}
        </a>
        <a
          className={anchorStyles}
          href="#type"
        >
          {_('Type')}
        </a>
        <a
          className={anchorStyles}
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
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Data Types Content */}
      <section>
        <H1>{_('Data Types')}</H1>
        <P>
          <Translate>
            The .idea format supports four primary data types that 
            form the building blocks of your application schema.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Enums, Props, Type, Models Content */}
      <section>
        {/* Enums Section */}
        <Enums />

        {/* Horizontal Rule */}
        <hr className="mt-10" />

        {/* Props Section */}
        <Props />

        {/* Horizontal Rule */}
        <hr className="mt-10" />

        {/* Type Section */}
        <Type />

        {/* Horizontal Rule */}
        <hr className="mt-10" />

        {/* Models Section */}
        <Models />
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Syntax Overview'),
          href: "/docs/specifications/syntax-overview"
        }}
        next={{
          text: _('Schema Elements'),
          href: "/docs/specifications/schema-elements"
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
