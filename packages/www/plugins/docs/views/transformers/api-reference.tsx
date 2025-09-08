//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
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
    'Detailed documentation for all components and interfaces in the idea-transformer library'
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
  const { _ } = useLanguage();
  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('API Reference')}
      </h6>
      <nav className="px-fs-14 px-lh-32">
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/transformers/pages/transformer">
          {_('Transformer')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/transformers/pages/terminal">
          {_('Terminal')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>API Reference</H1>
      <P>
        The API reference provides detailed documentation for all components and interfaces available in the idea-transformer library. This section covers the main classes and their methods for schema processing and plugin execution.
      </P>

      <H2>Core Components</H2>
      <P>
        The core components form the foundation of the transformation system, providing the main classes and interfaces you'll use to process schemas and execute plugins.
      </P>

      <Table className="text-left">
        <Thead className="theme-bg-bg2">Component</Thead>
        <Thead className="theme-bg-bg2">Description</Thead>
        <Thead className="theme-bg-bg2">Documentation</Thead>
        <Trow>
          <Tcol className="font-bold text-blue-500">Transformer</Tcol>
          <Tcol>Main class for loading and transforming schema files</Tcol>
          <Tcol><a href="/docs/transformers/pages/transformer" className="text-blue-500 underline">View Docs</a></Tcol>
        </Trow>
        <Trow>
          <Tcol className="font-bold text-blue-500">Terminal</Tcol>
          <Tcol>Command-line interface for schema processing</Tcol>
          <Tcol><a href="/docs/transformers/pages/terminal" className="text-blue-500 underline">View Docs</a></Tcol>
        </Trow>
      </Table>

      <H2>Key Features</H2>
      <P>
        The idea-transformer library offers several key features that make schema processing and code generation efficient and reliable. These features work together to provide a comprehensive transformation solution.
      </P>

      <H2>Schema Loading and Processing</H2>
      <P>
        The transformer provides robust schema loading capabilities that handle complex schema structures and dependencies. This includes support for modular schemas and intelligent merging strategies.
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Support for both <C>.idea</C> and <C>.json</C> schema files</li>
        <li className="my-2">Automatic dependency resolution with <C>use</C> directives</li>
        <li className="my-2">Intelligent schema merging based on mutability rules</li>
        <li className="my-2">Comprehensive error handling and validation</li>
      </ul>

      <H2>Plugin System</H2>
      <P>
        The plugin system enables extensible code generation through a type-safe and flexible architecture. Plugins can access the complete schema context and generate any type of output.
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Type-safe plugin development with <C>PluginProps</C> and <C>PluginWithCLIProps</C></li>
        <li className="my-2">Access to complete schema configuration and transformation context</li>
        <li className="my-2">CLI integration for interactive plugins</li>
        <li className="my-2">Flexible plugin configuration system</li>
      </ul>

      <H2>Command-Line Interface</H2>
      <P>
        The CLI provides convenient command-line access for integrating schema processing into build pipelines and development workflows. It supports various configuration options and batch processing capabilities.
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Simple CLI for processing schemas in build pipelines</li>
        <li className="my-2">Configurable working directories and file extensions</li>
        <li className="my-2">Integration with npm scripts and build tools</li>
        <li className="my-2">Support for batch processing multiple schemas</li>
      </ul>

      <Nav
        prev={{ text: 'Introduction', href: '/docs/transformers/introduction' }}
        next={{ text: 'Architecture', href: '/docs/transformers/architecture' }}
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
