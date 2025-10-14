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
  BasicImplementation,
  BestPractices,
  ConfigurationOptions,
  Conclusion,
  Introduction,
  Overview,
  SchemaProcessing,
  Troubleshooting,
  UsageExamples
} from '../../components/openapi-specification-plugin/index.js';

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
  const title = _('OpenAPI Specification Generator Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates OpenAPI' +
    ' 3.0 specifications from .idea schema files'
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
          href="#basic-implementation"
          className={anchorStyles}>
          {_('2. Basic Implementation')}
        </a>
        <a
          href="#configuration-options"
          className={anchorStyles}>
          {_('3. Configuration Options')}
        </a>
        <a
          href="#schema-processing"
          className={anchorStyles}>
          {_('4. Schema Processing')}
        </a>
        <a
          href="#advanced-features"
          className={anchorStyles}>
          {_('5. Advanced Features')}
        </a>
        <a
          href="#usage-examples"
          className={anchorStyles}>
          {_('6. Usage Examples')}
        </a>
        <a
          href="#best-practices"
          className={anchorStyles}>
          {_('7. Best Practices')}
        </a>
        <a
          href="#troubleshooting"
          className={anchorStyles}>
          {_('8. Troubleshooting')}
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
      <Introduction />
      
      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <Overview />
      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <BasicImplementation />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <ConfigurationOptions />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <SchemaProcessing />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <AdvancedFeatures />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <UsageExamples />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <BestPractices />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <Troubleshooting />

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      <Conclusion />

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Test Data Plugin'),
          href: "/docs/tutorials/test-data-plugin"
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
