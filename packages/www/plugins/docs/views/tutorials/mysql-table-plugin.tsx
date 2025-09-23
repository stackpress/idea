//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'r22n';
//docs
import { Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import {
  Introduction,
  Overview,
  Prerequisites,
  UnderstandingSchemaStructure,
  CreatePluginStructure,
  ImplementTypeMapping,
  GenerateSqlStatements,
  UsageInSchema,
  GeneratedOutput,
  BestPractices,
  Conclusion
} from '../../components/mysql-table-plugin/index.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('MySQL Tables Plugin');
  const description = _(
    'A guide to creating a plugin that generates MySQL tables from' +
    ' schema definitions'
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
  const { _ } = useLanguage();
  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('On this page')}
      </h6>
      <nav className="px-m-14 px-lh-28 flex flex-col">
        <a
          href="#overview"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('1. Overview')}
        </a>
        <a
          href="#prerequisites"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('2. Prerequisites')}
        </a>
        <a
          href="#understanding-schema"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('3. Understanding the Schema Structure')}
        </a>
        <a
          href="#create-plugin-structure"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('4. Create the Plugin Structure')}
        </a>
        <a
          href="#implement-type-mapping"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('5. Implement Type Mapping')}
        </a>
        <a
          href="#generate-sql-statements"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('6. Generate SQL Statements')}
        </a>
        <a
          href="#usage-in-schema"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('7. Usage in Schema')}
        </a>
        <a
          href="#generated-output"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('8. Generated Output')}
        </a>
        <a
          href="#best-practices"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('9. Error Handling and Best Practices')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <Introduction />
      <Overview />
      <Prerequisites />
      <UnderstandingSchemaStructure />
      <CreatePluginStructure />
      <ImplementTypeMapping />
      <GenerateSqlStatements />
      <UsageInSchema />
      <GeneratedOutput />
      <BestPractices />
      <Conclusion />

      <Nav
        prev={{
          text: _('Ts-morph Plugin Guide'),
          href: '/docs/tutorials/tsmorph-plugin-guide'
        }}
        next={{
          text: _('HTML Form Plugin'),
          href: '/docs/tutorials/html-form-plugin'
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