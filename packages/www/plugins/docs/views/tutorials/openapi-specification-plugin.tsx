//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'r22n';
//docs
import { Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
//components
import {
  Introduction,
  Overview,
  BasicImplementation,
  ConfigurationOptions,
  SchemaProcessing,
  AdvancedFeatures,
  UsageExamples,
  BestPractices,
  Troubleshooting,
  Conclusion
} from '../../components/openapi-specification-plugin/index.js';


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
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('On this page')}
      </h6>
      <nav className="px-m-14 px-lh-28 flex flex-col">
        <a 
        href="#overview" 
        className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('1. Overview')}
        </a>
        <a 
        href="#basic-implementation" 
        className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('2. Basic Implementation')}
        </a>
        <a 
        href="#configuration-options" 
        className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('3. Configuration Options')}
        </a>
        <a 
        href="#schema-processing" 
        className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('4. Schema Processing')}
        </a>
        <a 
        href="#advanced-features"
         className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('5. Advanced Features')}
        </a>
        <a 
        href="#usage-examples" 
        className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('6. Usage Examples')}
        </a>
        <a 
        href="#best-practices" 
        className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('7. Best Practices')}
        </a>
        <a 
        href="#troubleshooting" 
        className="text-blue-500 cursor-pointer hover:text-blue-700">
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
    <main className="px-h-100-0 overflow-auto px-p-10">
        <Introduction />
        <Overview />
        <BasicImplementation />
        <ConfigurationOptions />
        <SchemaProcessing />
        <AdvancedFeatures />
        <UsageExamples />
        <BestPractices />
        <Troubleshooting />
        <Conclusion />
     
      <Nav
        prev={{ 
          text: _('Test Data Plugin'), 
          href: '/docs/tutorials/test-data-plugin' 
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
