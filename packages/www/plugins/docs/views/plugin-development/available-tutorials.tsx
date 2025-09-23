//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, H3, P, C, Nav, SS } from '../../components/index.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Available Tutorials');
  const description = _(
    'Comprehensive tutorials for creating specific types of plugins '
    + 'with step-by-step instructions and complete code examples'
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
      <nav className="px-fs-14 px-lh-28 flex flex-col">
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/tsmorph-plugin-guide"
        >
          {_('1. TSMorph Plugin Guide')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/mysql-tables-plugin-tutorial"
        >
          {_('2. MySQL Tables Plugin Tutorial')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/html-form-plugin-tutorial"
        >
          {_('3. HTML Form Plugin Tutorial')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/markdown-documentation-plugin-tutorial"
        >
          {_('4. Markdown Documentation Plugin Tutorial')}
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
      <section>
        <H1>{_('Available Tutorials')}</H1>
        <P>
          <Translate>
            This section provides links to comprehensive tutorials for
            creating specific types of plugins. Each tutorial includes
            step-by-step instructions, complete code examples, and
            explanations of key concepts for building production-ready
            plugins.
          </Translate>
        </P>
      </section>

      <section>
        <H2>{_('6.1. Meta Coding With TSMorph')}</H2>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/tsmorph-plugin-guide"
              className="text-blue-500 underline"
            >
              TSMorph Plugin Guide
            </a> demonstrates how to create powerful code generation
            plugins using <C>ts-morph</C>, a TypeScript library that
            provides an easier way to programmatically navigate and
            manipulate TypeScript and JavaScript code. This guide is
            essential for developers who need to generate complex
            TypeScript code with proper syntax and formatting.
          </Translate>
        </P>
      </section>

      <section>
        <H2>{_('6.2. Database Integration Plugins')}</H2>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/mysql-tables-plugin-tutorial"
              className="text-blue-500 underline"
            >
              MySQL Tables Plugin
            </a> tutorial teaches you how to create a plugin that
            generates MySQL <C>CREATE TABLE</C> statements from your
            schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Parse schema models and their columns
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Map schema types to MySQL data types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate SQL DDL statements with constraints
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Handle primary keys, foreign keys, and indexes
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Implement proper error handling and validation
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> SQL files that can be
            executed to create database tables
          </Translate>
        </P>
      </section>

      <section>
        <H2>{_('6.3. Frontend Development Plugins')}</H2>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/html-form-plugin-tutorial"
              className="text-blue-500 underline"
            >
              HTML Form Plugin
            </a> tutorial demonstrates how to create a plugin that
            generates responsive HTML forms from your schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Generate HTML form elements based on field types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support multiple CSS frameworks (Bootstrap, Tailwind,
              Custom)
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Include client-side validation and constraints
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Handle different form layouts and themes
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create accessible, responsive forms
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> Complete HTML files with
            forms, styling, and JavaScript validation
          </Translate>
        </P>
      </section>

      <section>
        <H2>{_('6.4. Documentation Generation Plugins')}</H2>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/markdown-documentation-plugin-tutorial"
              className="text-blue-500 underline"
            >
              Markdown Documentation Plugin
            </a> tutorial shows how to create a plugin that generates
            comprehensive markdown documentation from your schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Parse all schema elements (models, types, enums, props)
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate structured documentation with navigation
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Include examples and cross-references
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support multiple documentation formats and templates
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create both single-file and multi-file documentation
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <strong>Generated Output:</strong> Markdown documentation
            files with complete schema reference
          </Translate>
        </P>
      </section>

      <Nav
        prev={{
          text: _('Best Practices'),
          href: '/docs/plugin-development/best-practices'
        }}
        next={{
          text: _('Advanced Tutorials'),
          href: '/docs/plugin-development/advanced-tutorials'
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
