//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'r22n';
import clsx from 'clsx';
//local
import { Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import {
  Conclusion,
  CorePluginFunction,
  GenerationFunctions,
  Overview,
  PluginStructure,
  Prerequisites,
  SchemaConfiguration
} from '../../components/test-data-plugin/index.js';

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
  const title = _('Test Data Generator Plugin Tutorial');
  const description = _(
    'A guide to creating a plugin that generates mock data from .idea files'
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

export function Right() {
  //hooks
  const { _ } = useLanguage();

  return (
    <menu className="overflow-auto px-h-100-40 px-m-0 px-px-10 px-py-20">
      <h6 className="px-fs-14 px-mb-0 px-mt-0 px-pb-10 theme-muted uppercase">
        {_('On this page')}
      </h6>
      <nav className="flex flex-col px-lh-28 px-m-0">
        <a
          href="#overview"
          className={anchorStyles}>
          {_('1. Overview')}
        </a>
        <a
          href="#prerequisites"
          className={anchorStyles}>
          {_('2. Prerequisites')}
        </a>
        <a
          href="#plugin-structure"
          className={anchorStyles}>
          {_('3. Plugin Structure')}
        </a>
        <a
          href="#implementation"
          className={anchorStyles}>
          {_('4. Implementation')}
        </a>
        <a
          href="#schema-configuration"
          className={anchorStyles}>
          {_('5. Schema Configuration')}
        </a>
        <a
          href="#conclusion"
          className={anchorStyles}>
          {_('6. Conclusion')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Page Contents Section */}
      <Overview />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <Prerequisites />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <PluginStructure />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <CorePluginFunction />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <GenerationFunctions />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <SchemaConfiguration />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <Conclusion />

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Validation Plugin'),
          href: "/docs/tutorials/validation-plugin"
        }}
        next={{
          text: _('OpenAPI Specification Plugin'),  
          href: "/docs/tutorials/openapi-specification-plugin"
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
