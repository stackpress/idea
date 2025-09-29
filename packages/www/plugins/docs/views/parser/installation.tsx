//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'stackpress/view/client';
//locals
import { H1, H2, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

//code examples
//----------------------------------------------------------------------

const installCommand = `npm install @stackpress/idea-parser`

//----------------------------------------------------------------------

const usageExample =
  `import { parse, final } from '@stackpress/idea-parser';

// Parse a schema file into JSON (includes references)
const schemaCode = \`
prop Text { type "text" }
enum Roles {
  ADMIN "Admin"
  USER "User"
}
model User {
  id String @id
  name String @field.input(Text)
  role Roles
}
\`;

// Parse with references intact
const parsedSchema = parse(schemaCode);

// Parse and clean up references (final version)
const finalSchema = final(schemaCode);
`

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Installation');
  const description = _(
    'A TypeScript library for parsing .idea schema files into ' +
    'Abstract Syntax Trees (AST) and converting them to readable ' +
    'JSON configurations. This library is designed to help ' +
    'developers work with schema definitions in a structured and ' +
    'type-safe manner.'
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
    <main className="px-h-100-0 overflow-auto px-p-10">
      {/* Idea Parser Section Content */}
      <section>
        <H1>{_('Idea Parser')}</H1>
        <Translate>
          A TypeScript library for parsing .idea schema files into
          Abstract Syntax Trees (AST) and converting them to readable
          JSON configurations. This library is designed to help
          developers work with schema definitions in a structured and
          type-safe manner.
        </Translate>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10 ' />

      {/* Installation Section Content */}
      <section>
        <H1>{_('Installation')}</H1>
        <P><Translate>Install the package using npm:</Translate></P>
        <Code
          copy
          language='javascript'
          className='bg-black text-white px-mb-20'
        >
          {installCommand}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10 ' />

      {/* Quick Start Section Content */}
      <section>
        <H1>{_('Quick Start')}</H1>
        <P>
          <Translate>
            The library provides two main functions for parsing schema
            files:
          </Translate>
        </P>

        <H2>{_('Basic Usage')}</H2>
        <Code
          copy
          language='javascript'
          className='bg-black text-white px-mb-20'
        >
          {usageExample}
        </Code>

        <ul>
          <li className='font-bold list-none text-xl mt-10'>
            <Translate>
              Difference between <C>parse</C> and <C>final</C>
            </Translate>
          </li>
          <li className='my-2'>
            <C>parse(code: string):</C>
            <Translate>
              Converts schema code to JSON while preserving prop and use
              references
            </Translate>
          </li>
          <li>
            <C>final(code: string):</C>
            <Translate>
              Like parse but removes prop and use references for a clean
              final output
            </Translate>
          </li>
        </ul>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Specifications'),
          href: '/docs/specifications/syntax-overview'
        }}
        next={{
          text: _('Core Concepts'),
          href: '/docs/parser/core-concepts'
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
