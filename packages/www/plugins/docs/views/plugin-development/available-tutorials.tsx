//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Available Tutorials');
  const description = _(
    'Comprehensive tutorials for creating specific types of plugins with step-by-step instructions and complete code examples'
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
          {_('Available Tutorials')}
        </h6>
        <nav className="px-fs-14 px-lh-32">
          <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/tsmorph-plugin-guide">
            {_('TSMorph Plugin Guide')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/mysql-tables-plugin-tutorial">
            {_('MySQL Tables Plugin Tutorial')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/html-form-plugin-tutorial">
            {_('HTML Form Plugin Tutorial')}
          </a>
          <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/markdown-documentation-plugin-tutorial">
            {_('Markdown Documentation Plugin Tutorial')}
          </a>
        </nav>
      </menu>
    );
  }

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Available Tutorials</H1>
      <P>
        This section provides links to comprehensive tutorials for creating specific types of plugins. Each tutorial includes step-by-step instructions, complete code examples, and explanations of key concepts for building production-ready plugins.
      </P>

      <H2>6.1. Meta Coding With TSMorph</H2>
      <P>
        The <a href="/docs/tutorials/tsmorph-plugin-guide" className="text-blue-500 underline">TSMorph Plugin Guide</a> demonstrates how to create powerful code generation plugins using <C>ts-morph</C>, a TypeScript library that provides an easier way to programmatically navigate and manipulate TypeScript and JavaScript code. This guide is essential for developers who need to generate complex TypeScript code with proper syntax and formatting.
      </P>

      <H2>6.2. Database Integration Plugins</H2>
      <P>   
        The <a href="/docs/tutorials/mysql-tables-plugin-tutorial" className="text-blue-500 underline">MySQL Tables Plugin</a> tutorial teaches you how to create a plugin that generates MySQL <C>CREATE TABLE</C> statements from your schema.
      </P>

      <P>
        Learn how to create a plugin that generates MySQL <C>CREATE TABLE</C> statements from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Parse schema models and their columns</li>
        <li className="my-2">Map schema types to MySQL data types</li>
        <li className="my-2">Generate SQL DDL statements with constraints</li>
        <li className="my-2">Handle primary keys, foreign keys, and indexes</li>
        <li className="my-2">Implement proper error handling and validation</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> SQL files that can be executed to create database tables
      </P>

      <H2>6.3. Frontend Development Plugins</H2>
      <P>
        The <a href="/docs/tutorials/html-form-plugin-tutorial" className="text-blue-500 underline">HTML Form Plugin</a> tutorial demonstrates how to create a plugin that generates responsive HTML forms from your schema.
      </P>

      <P>
        Learn how to create a plugin that generates responsive HTML forms from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Generate HTML form elements based on field types</li>
        <li className="my-2">Support multiple CSS frameworks (Bootstrap, Tailwind, Custom)</li>
        <li className="my-2">Include client-side validation and constraints</li>
        <li className="my-2">Handle different form layouts and themes</li>
        <li className="my-2">Create accessible, responsive forms</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> Complete HTML files with forms, styling, and JavaScript validation
      </P>

      <H2>6.4. Documentation Generation Plugins</H2>
      <P>
        The <a href="/docs/tutorials/markdown-documentation-plugin-tutorial" className="text-blue-500 underline">Markdown Documentation Plugin</a> tutorial shows how to create a plugin that generates comprehensive markdown documentation from your schema.
      </P>

      <P>
        Learn how to create a plugin that generates comprehensive markdown documentation from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Parse all schema elements (models, types, enums, props)</li>
        <li className="my-2">Generate structured documentation with navigation</li>
        <li className="my-2">Include examples and cross-references</li>
        <li className="my-2">Support multiple documentation formats and templates</li>
        <li className="my-2">Create both single-file and multi-file documentation</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> Markdown documentation files with complete schema reference
      </P>

      <Nav
        prev={{ text: 'Best Practices', href: '/docs/plugin-development/best-practices' }}
        next={{ text: 'Advanced Tutorials', href: '/docs/plugin-development/advanced-tutorials' }}
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
