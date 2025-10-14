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

//code examples
//-----------------------------------------------------------------

const processingFlow = 
`Raw Schema Code → SchemaTree → Compiler → JSON Output`;

//-----------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Core Concepts');
  const description = _(
    'Learn the core concepts of the Idea Parser library including ' +
    'schema structure, processing flow, and key components.'
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
      <link
        rel="stylesheet"
        type="text/css"
        href="/styles/global.css"
      />
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
      <H1>{_('Core Concepts')}</H1>

      {/* Schema Structure Section Content */}
      <section>
        <H2>{_('Schema Structure')}</H2>
        <P>
          <Translate>
            A complete <C>.idea</C> schema file can contain multiple
            elements organized in a specific structure:
          </Translate>
        </P>

        <ol className="list-decimal list-inside">
          <li className="my-2">
            <C>Plugins:</C>{' '}
            <Translate>
              External integrations and configurations
            </Translate>
          </li>
          <li className="my-2">
            <C>Use statements:</C>{' '}
            <Translate>
              Import other schema files
            </Translate>
          </li>
          <li>
            <C>Props:</C>{' '}
            <Translate>
              Reusable property configurations
            </Translate>
          </li>
          <li className="my-2">
            <C>Enums:</C>{' '}
            <Translate>
              Enumerated value definitions
            </Translate>
          </li>
          <li className="my-2">
            <C>Types:</C>{' '}
            <Translate>
              Custom type definitions with columns
            </Translate>
          </li>
          <li className="my-2">
            <C>Models:</C>{' '}
            <Translate>
              Database model definitions
            </Translate>
          </li>
        </ol>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Processing Flow Section Content */}
      <section>
        <H2>{_('Processing Flow')}</H2>
        <P>
          <Translate>
            The library follows this processing flow:
          </Translate>
        </P>

        <Code
          copy
          language="text"
          className="bg-black text-white"
        >
          {processingFlow}
        </Code>

        <ol className="list-decimal list-inside">
          <li className="my-2">
            <SS>Raw Code:</SS>
            <Translate>
              Your <C>.idea</C> schema file content
            </Translate>
          </li>
          <li className="my-2">
            <SS>SchemaTree:</SS>
            <Translate>
              Parses the entire file into an 'Abstract Syntax Tree'
            </Translate>
          </li>
          <li className="my-2">
            <SS>Compiler:</SS>
            <Translate>
              Converts AST tokens into structured JSON
            </Translate>
          </li>
          <li className="my-2">
            <SS>JSON Output:</SS>
            <Translate>
              Final configuration object
            </Translate>
          </li>
        </ol>
      </section>


      <Nav
        prev={{
          text: _('Installation'),
          href: "/docs/parser/installation"
        }}
        next={{
          text: _('API Reference'),
          href: "/docs/parser/api-reference"
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
