//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import Introduction from './components/ts-morph/introduction.js';
import Installation from './components/ts-morph/installation.js';
import SettingUpProject from './components/ts-morph/setting-up-project.js';
import UnderstandingTsMorphBasics from './components/ts-morph/understanding-tsmorph-basics.js';
import CreateFirstPlugin from './components/ts-morph/create-first-plugin.js';
import AdvanceTsMorphPlugin from './components/ts-morph/advance-tsmorph-pluginn.js';
import TestingYourPlugin from './components/ts-morph/testing-your-plugin.js';
import BestPractices from './components/ts-morph/best-practices.js';
import Troubleshooting from './components/ts-morph/troubleshooting.js';
import References from './components/ts-morph/references.js';

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
  const { _ } = useLanguage();
  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase ">
        {_('On this page')}
      </h6>
      <nav className="px-m-14 px-lh-32">
       <a href="#1-introduction" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('1. Introduction')}
       </a>
       <a href="#2-prerequisites" className="text-blue-500 block cursor-pointer underline hover:text-blue-700 ">
        {_('2. Prerequisites')}
       </a>
       <a href="#3-setting-up-the-project" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('3. Setting up the Project')}
       </a>
       <a href="#4-understanding-ts-morph-basics" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('4. Understanding ts-morph Basics')}
       </a>
       <a href="#5-creating-your-first-plugin" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('5. Creating Your First Plugin')}
       </a>
       <a href="#6-advanced-ts-morph-features" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('6. Advanced ts-morph Features')}
       </a>
       <a href="#7-testing-your-plugin" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('7. Testing Your Plugin')}
       </a>
       <a href="#8-best-practices" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('8. Best Practices')}
       </a>
       <a href="#9-troubleshooting" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('9. Troubleshooting')}
       </a>
       <a href="#10-references" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
        {_('10. References')}
       </a>
      </nav>
    </menu>
  );
}

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Creating Plugins with ts-morph: A Comprehensive Guide</H1>
      <P>
        This guide demonstrates how to create powerful code generation plugins using ts-morph, a TypeScript library that provides an easier way to programmatically navigate and manipulate TypeScript and JavaScript code. We'll walk through creating a complete plugin that generates TypeScript interfaces from schema definitions.
      </P>

      <Introduction />
      <Installation />
      <SettingUpProject />
      <UnderstandingTsMorphBasics />
      <CreateFirstPlugin />
      <AdvanceTsMorphPlugin />
      <TestingYourPlugin />
      <BestPractices />
      <Troubleshooting />
      <References />
      <Nav
        prev={{ text: 'Available Tutorials', href: '/docs/plugin-development/available-tutorials' }}
        next={{ text: 'MySQL Tables Plugin Tutorial', href: '/docs/tutorials/mysql-table-plugin' }}
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
