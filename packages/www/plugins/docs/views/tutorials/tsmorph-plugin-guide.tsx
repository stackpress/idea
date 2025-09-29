//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'r22n';
//local
import { Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import {
  Introduction,
  Installation,
  SettingUpProject,
  UnderstandingTsMorphBasics,
  CreateFirstPlugin,
  AdvanceTsMorphPlugin,
  TestingYourPlugin,
  BestPractices,
  Troubleshooting,
  References
} from '../../components/ts-morph-plugin-guide/index.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('TSMorph Plugin Guide');
  const description = _(
    'A guide to creating powerful code generation plugins using TSMorph'
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
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase ">
        {_('On this page')}
      </h6>
      <nav className="px-m-14 px-lh-28 flex flex-col">
        <a
          href="#introduction"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('1. Introduction')}
        </a>
        <a
          href="#installation"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('2. Installation')}
        </a>
        <a
          href="#setting-up-the-project"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('3. Setting up the Project')}
        </a>
        <a
          href="#understanding-ts-morph-basics"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('4. Understanding ts-morph Basics')}
        </a>
        <a
          href="#creating-your-first-plugin"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('5. Creating Your First Plugin')}
        </a>
        <a
          href="#advanced-ts-morph-features"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('6. Advanced ts-morph Features')}
        </a>
        <a
          href="#testing-your-plugin"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('7. Testing Your Plugin')}
        </a>
        <a
          href="#best-practices"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('8. Best Practices')}
        </a>
        <a
          href="#troubleshooting"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('9. Troubleshooting')}
        </a>
        <a
          href="#references"
          className="text-blue-500 cursor-pointer 
          hover:text-blue-700"
        >
          {_('10. References')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      {/* Page Content Section */}
      <Introduction />

      {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <Installation />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <SettingUpProject />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <UnderstandingTsMorphBasics />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <CreateFirstPlugin />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <AdvanceTsMorphPlugin />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <TestingYourPlugin />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <BestPractices />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <Troubleshooting />

       {/* Horizontal Rule */}
      <hr className='mt-10'/>

      <References />

      {/* Page Navigation */}
      <Nav
        prev={{
          text: 'Available Tutorials',
          href: '/docs/plugin-development/available-tutorials'
        }}
        next={{
          text: 'MySQL Tables Plugin Tutorial',
          href: '/docs/tutorials/mysql-table-plugin'
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
