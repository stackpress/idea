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
//components
import {
  AdvancedFeatures,
  Conclusion,
  CreatePluginStructure,
  ErrorHandlingAndBestPractices,
  GenerateModelsDocumentation,
  GenerateTypesEnumsProps,
  GeneratedOutput,
  ImplementDocumentationGeneration,
  Introduction,
  Overview,
  Prerequisites,
  UnderstandingSchemaStructure,
  UsageInSchema,
  UtilityFunctions
} from '../../components/markdown-documentation-plugin/index.js';

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
          className={anchorStyles}
        >
          {_('1. Overview')}
        </a>
        <a
          href="#prerequisites"
          className={anchorStyles}
        >
          {_('2. Prerequisites')}
        </a>
        <a
          href="#understanding-schema"
          className={anchorStyles}
        >
          {_('3. Understanding the Schema Structure')}
        </a>
        <a
          href="#create-plugin"
          className={anchorStyles}
        >
          {_('4. Create the Plugin Structure')}
        </a>
        <a
          href="#implement-generation"
          className={anchorStyles}
        >
          {_('5. Implement Documentation Generation')}
        </a>
        <a
          href="#generate-models"
          className={anchorStyles}
        >
          {_('6. Generate Models Documentation')}
        </a>
        <a
          href="#generate-types-enums-props"
          className={anchorStyles}
        >
          {_('7. Generate Types, Enums, and Props')}
        </a>
        <a
          href="#utility-functions"
          className={anchorStyles}
        >
          {_('8. Utility Functions')}
        </a>
        <a
          href="#usage-in-schema"
          className={anchorStyles}
        >
          {_('9. Usage in Schema')}
        </a>
        <a
          href="#generated-output"
            className={anchorStyles}
        >
          {_('10. Generated Output')}
        </a>
        <a
          href="#error-handling"
          className={anchorStyles}
        >
          {_('11. Error Handling and Best Practices')}
        </a>
        <a
          href="#advanced-features"
          className={anchorStyles}
        >
          {_('12. Advanced Features')}
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
      {/* Page Section */}
      <Introduction />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <Overview />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <Prerequisites />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <UnderstandingSchemaStructure />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <CreatePluginStructure />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <ImplementDocumentationGeneration />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <GenerateModelsDocumentation />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <GenerateTypesEnumsProps />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <UtilityFunctions />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <UsageInSchema />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      <GeneratedOutput />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      {/* Horizontal Rule */}
      <ErrorHandlingAndBestPractices />

      {/* Horizontal Rule */}
      <hr className="mt-10"/>

      {/* Horizontal Rule */}
      <AdvancedFeatures />
      <hr className="mt-10"/>

      {/* Horizontal Rule */}
      <Conclusion />

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('HMTL Form Plugin'),
          href: "/docs/tutorials/html-form-plugin"
        }}
        next={{
          text: _('GraphQL Schema Plugin'),
          href: "/docs/tutorials/graphql-schema-plugin"
        }}
      />
    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  //props
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
