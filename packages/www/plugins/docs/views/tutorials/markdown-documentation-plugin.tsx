//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import {
  Introduction,
  Overview,
  Prerequisites,
  UnderstandingSchemaStructure,
  CreatePluginStructure,
  ImplementDocumentationGeneration,
  GenerateModelsDocumentation,
  GenerateTypesEnumsProps,
  UtilityFunctions,
  UsageInSchema,
  GeneratedOutput,
  ErrorHandlingAndBestPractices,
  AdvancedFeatures,
  Conclusion
} from '../../components/markdown-documentation-plugin/index.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Markdown Documentation Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates markdown documentation from schema definitions'
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
          href="#create-plugin"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('4. Create the Plugin Structure')}
        </a>
        <a
          href="#implement-generation"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('5. Implement Documentation Generation')}
        </a>
        <a
          href="#generate-models"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('6. Generate Models Documentation')}
        </a>
        <a
          href="#generate-types-enums-props"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('7. Generate Types, Enums, and Props')}
        </a>
        <a
          href="#utility-functions"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('8. Utility Functions')}
        </a>
        <a
          href="#usage-in-schema"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('9. Usage in Schema')}
        </a>
        <a
          href="#generated-output"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('10. Generated Output')}
        </a>
        <a
          href="#error-handling"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('11. Error Handling and Best Practices')}
        </a>
        <a
          href="#advanced-features"
          className="text-blue-500 cursor-pointer hover:text-blue-700"
        >
          {_('12. Advanced Features')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <Introduction />
      <Overview />
      <Prerequisites />
      <UnderstandingSchemaStructure />
      <CreatePluginStructure />
      <ImplementDocumentationGeneration />
      <GenerateModelsDocumentation />
      <GenerateTypesEnumsProps />
      <UtilityFunctions />
      <UsageInSchema />
      <GeneratedOutput />
      <ErrorHandlingAndBestPractices />
      <AdvancedFeatures />
      <Conclusion />


      <Nav
        prev={{
          text: 'HMTL Form Plugin',
          href: '/docs/tutorials/html-form-plugin'
        }}
        next={{
          text: 'GraphQL Schema Plugin',
          href: '/docs/tutorials/graphql-schema-plugin'
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
