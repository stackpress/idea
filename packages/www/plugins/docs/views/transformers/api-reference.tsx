//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('API Reference');
  const description = _(
    'Detailed documentation for all components and interfaces in the ' +
    'idea-transformer library'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/icon.png" />

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
        {_('API Reference')}
      </h6>
      <nav className="px-fs-14 px-lh-28 flex flex-col">
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/transformers/api-references/transformer"
        >
          {_('Transformer')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/transformers/api-references/terminal"
        >
          {_('Terminal')}
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
      {/* API Refernce Section Content */}
      <section>
        <H1>{_('API Reference')}</H1>
        <P>
          <Translate>
            The API reference provides detailed documentation for all
            components and interfaces available in the idea-transformer
            library. This section covers the main classes and their methods
            for schema processing and plugin execution.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className="my-10" />

      {/* Core Components Content */}
      <section>
        <H1>{_('Core Components')}</H1>
        <P>
          <Translate>
            The core components form the foundation of the transformation
            system, providing the main classes and interfaces you'll use to
            process schemas and execute plugins.
          </Translate>
        </P>

        <Table className="text-left">
          <Trow className="theme-bg-bg1">
            <Thead>Component</Thead>
            <Thead>Description</Thead>
            <Thead>Documentation</Thead>
          </Trow>
          <Trow>
            <Tcol className="font-bold text-blue-500">
              Transformer
            </Tcol>
            <Tcol>
              <Translate>
                Main class for loading and transforming schema files
              </Translate>
            </Tcol>
            <Tcol>
              <a
                href="/docs/transformers/api-references/transformer"
                className="text-blue-500 underline"
              >
                {_('View Docs')}
              </a>
            </Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol className="font-bold text-blue-500">
              {_('Terminal')}
            </Tcol>
            <Tcol>
              Command-line interface for schema processing
            </Tcol>
            <Tcol>
              <a
                href="/docs/transformers/api-references/terminal"
                className="text-blue-500 underline"
              >
                {_('View Docs')}
              </a>
            </Tcol>
          </Trow>
        </Table>

        <H2>{_('Key Features')}</H2>
        <P>
          <Translate>
            The idea-transformer library offers several key features that make
            schema processing and code generation efficient and reliable. These
            features work together to provide a comprehensive transformation
            solution.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className="my-10" />

      {/* Schema Loading Section Content */}
      <section>
        <H1>{_('Schema Loading and Processing')}</H1>
        <P>
          <Translate>
            The transformer provides robust schema loading capabilities that
            handle complex schema structures and dependencies. This includes
            support for modular schemas and intelligent merging strategies.
          </Translate>
        </P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Support for both <C>.idea</C> and <C>.json</C> schema files
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Automatic dependency resolution with <C>use</C> directives
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Intelligent schema merging based on mutability rules
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Comprehensive error handling and validation
            </Translate>
          </li>
        </ul>
      </section>

       {/* Horizontal Rule */}
      <hr className="my-10" />

      {/* Plugin System Section Content */}
      <section>
        <H1>{_('Plugin System')}</H1>
        <P>
          <Translate>
            The plugin system enables extensible code generation through a
            type-safe and flexible architecture. Plugins can access the
            complete schema context and generate any type of output.
          </Translate>
        </P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Type-safe plugin development with <C>PluginProps</C> and
              <C>PluginWithCLIProps</C>
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Access to complete schema configuration and transformation
              context
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              CLI integration for interactive plugins
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Flexible plugin configuration system
            </Translate>
          </li>
        </ul>
      </section>

       {/* Horizontal Rule */}
      <hr className="my-10" />

      {/* Command-Line Interface Section Content */}
      <section>
        <H1>{_('Command-Line Interface')}</H1>
        <P>
          <Translate>
            The CLI provides convenient command-line access for integrating
            schema processing into build pipelines and development workflows.
            It supports various configuration options and batch processing
            capabilities.
          </Translate>
        </P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Simple CLI for processing schemas in build pipelines
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Configurable working directories and file extensions
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Integration with npm scripts and build tools
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support for batch processing multiple schemas
            </Translate>
          </li>
        </ul>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Introduction'),
          href: '/docs/transformers/introduction'
        }}
        next={{
          text: _('Architecture'),
          href: '/docs/transformers/architecture'
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
