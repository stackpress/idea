//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

//processing flow diagram example
//----------------------------------------------------------------------

const processingFlowDiagram = `
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   .idea File    │───▶│     Parser      │───▶│   AST (JSON)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Validation    │    │   Transformer   │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │    Plugins      │
                                              │                 │
                                              └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │ Generated Code  │
                                              │                 │
                                              └─────────────────┘
`

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Processing Flow');
  const description = _(
    'The .idea file format follows a structured processing ' +
    'flow:'
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
        <link
          key={index}
          rel="stylesheet"
          type="text/css"
          href={href}
        />
      ))}
    </>
  )
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Processing Flow Content */}
      <section>
      <H1>{_('Processing Flow')}</H1>
      <P>
        <Translate>
        The <C>.idea</C> file format follows a structured
        processing flow:
        </Translate>
      </P>

      <Code
        copy
        language="text"
        className="bg-black px-mb-20 px-mx-10 text-white"
      >
        {processingFlowDiagram}
      </Code>

      <H2>{_('Processing Steps')}</H2>
      <ol className="list-decimal list-inside px-lh-30 px-px-20">
        <li>
        <SS>{_('Parsing:')}</SS>
        <Translate>
          Convert <C>.idea</C> syntax into Abstract Syntax Tree (AST)
        </Translate>
        </li>
        <li>
        <SS>{_('Validation:')}</SS>
        <Translate>
          Check for syntax errors, type consistency, and constraint
          violations
        </Translate>
        </li>
        <li>
        <SS>{_('Transformation:')}</SS>
        <Translate>
          Convert AST into structured JSON configuration
        </Translate>
        </li>
        <li>
        <SS>{_('Plugin Execution:')}</SS>
        <Translate>
          Run configured plugins to generate output files
        </Translate>
        </li>
        <li>
        <SS>{_('Code Generation:')}</SS>
        <Translate>
          Create TypeScript, SQL, documentation, forms, etc.
        </Translate>
        </li>
      </ol>
      </section>

      {/* Page Navigation */}
      <Nav
      prev={{
        text: _('Schema Directives'),
        href: "/docs/specifications/schema-directives"
      }}
      next={{
        text: _('Plugin System'),
        href: "/docs/specifications/plugin-system"
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
    >
      <Body />
    </Layout>
  );
}
