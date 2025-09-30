//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'r22n';
//local
import { Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
//components
import {
  Introduction,
  Overview,
  Prerequisites,
  UnderstandingSchemaStructure,
  CreatePluginStructure,
  ImplementFormElementGeneration,
  ImplementFormLayoutAndStyling,
  GenerateCompleteHtmlDocument,
  UsageInSchema,
  GeneratedOutput,
  ErrorHandlingAndBestPractices
} from '../../components/html-form-plugin/index.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('HTML Form Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates HTML forms from processed .idea schema definitions'
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
      <nav className="px-m-0 px-lh-28 flex flex-col">
        <a
          href="#overview"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('1. Overview')}
        </a>
        <a
          href="#prerequisites"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('2. Prerequisites')}
        </a>
        <a
          href="#understanding-the-schema-structure"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('3. Understanding the Schema Structure')}
        </a>
        <a href="#create-the-plugin-structure"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('4. Create the Plugin Structure')}
        </a>
        <a
          href="#implement-form-element-generation"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('5. Implement Form Element Generation')}
        </a>
        <a
          href="#implement-form-layout-and-styling"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('6. Implement Form Layout and Styling')}
        </a>
        <a
          href="#generate-complete-html-document"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('7. Generate Complete HTML Document')}
        </a>
        <a
          href="#usage-in-schema"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('8. Usage in Schema')}
        </a>
        <a
          href="#generated-output"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('9. Generated Output')}
        </a>
        <a
          href="#error-handling-and-best-practices"
          className="text-blue-500 cursor-pointer hover:text-blue-700">
          {_('10. Error Handling and Best Practices')}
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
      {/* Page Section */}
      <Introduction />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <Overview />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <Prerequisites />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <UnderstandingSchemaStructure />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <CreatePluginStructure />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <ImplementFormElementGeneration />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <ImplementFormLayoutAndStyling />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <GenerateCompleteHtmlDocument />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>


      <UsageInSchema />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <GeneratedOutput />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <ErrorHandlingAndBestPractices />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('MySQL Table Plugin'),
          href: '/docs/tutorials/mysql-table-plugin'
        }}
        next={{
          text: _('Markdown Documentation Plugin'),
          href: '/docs/tutorials/markdown-documentation-plugin'
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
