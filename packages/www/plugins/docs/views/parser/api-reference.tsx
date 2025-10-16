//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
import clsx from 'clsx';
//local
import { H1, H2, P, C, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const parseExample = 
`import { parse } from '@stackpress/idea-parser';

const result = parse(\`
prop Text { type "text" }
model User {
  name String @field.input(Text)
}
\`);

console.log(result);
// Output includes prop references: { prop: { Text: { type: "text" } }, ... }`;

//--------------------------------------------------------------------//

const finalExample = 
`import { final } from '@stackpress/idea-parser';

const result = final(\`
prop Text { type "text" }
model User {
  name String @field.input(Text)
}
\`);

console.log(result);
// Output has resolved references: { model: { User: { ... } } }
// No 'prop' section in output`;

//--------------------------------------------------------------------//

const exceptionExample = 
`import { Exception } from '@stackpress/idea-parser';

try {
  const result = parse(invalidCode);
} catch (error) {
  if (error instanceof Exception) {
    console.log('Parsing error:', error.message);
  }
}`;

//--------------------------------------------------------------------//

//styles
//--------------------------------------------------------------------//

const anchorStyles = clsx(
  'cursor-pointer',
  'hover:text-blue-700',
  'text-blue-500'
);

//--------------------------------------------------------------------//

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('API Reference');
  const description = _(
    'Complete API reference for the Idea Parser library, ' +
    'including detailed documentation for all classes, ' +
    'methods, and interfaces.'
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

export function Right() {
  //hooks
  const { _ } = useLanguage();

  return (
    <aside className="overflow-auto px-h-100-40 px-m-0 px-px-10 px-py-20">
      <h6 className="px-fs-14 px-mb-0 px-mt-0 px-pb-10 theme-muted uppercase">
        {_('API Reference')}
      </h6>
      <nav className="flex flex-col px-fs-14 px-lh-28">
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/lexer"
        >
          {_('Lexer API Reference')}
        </a>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/compiler"
        >
          {_('Compiler API Reference')}
        </a>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/ast"
        >
          {_('AST Reference')}
        </a>

        <a
          className={anchorStyles}
          href="/docs/parser/api-references/tokens"
        >
          {_('Token Reference')}
        </a>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/exception-handling"
        >
          {_('Exception Handling')}
        </a>
      </nav>
    </aside>
  );
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      <H1>{_('API Reference')}</H1>

      {/* Main Function Section Content */}
      <section>
        <H2>{_('Main Functions')}</H2>
        <P>
          <C>parse(code: string)</C>
        </P>
        <Translate>
          Converts schema code into a JSON representation with
          references preserved.
        </Translate>
        <SS>{_('Parameters:')}:</SS>
        <li className="my-2">
          <C>code (string):</C> {_('The schema code to parse')}
        </li>

        <SS>{_('Returns:')}:</SS>
        <li className="my-2">
          <C>SchemaConfig:</C> {_('JSON object representing the ' +
            'parse schema')}
        </li>

        <P>{_('Example:')} </P>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {parseExample}
        </Code>

        <P>
          <C>final(code: string)</C>
        </P>

        <Translate>
          Converts schema code into a clean JSON representation with
          references resolved and removed.
        </Translate>

        <SS>{_('Parameters')}</SS>
        <li className="my-2">
          <C>code (string):</C> {_('The schema code to parse')}
        </li>

        <SS>{_('Returns:')}:</SS>
        <li className="my-2">
          <C>FinalSchemaConfig: </C> {_('Clean JSON object without ' +
            'prop/use references')}
        </li>

        <SS>{_('Example:')} </SS>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {finalExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Core Classes Section Content */}
      <section>
        <H2>{_('Core Classes')}</H2>
        <ul className="list-disc list-inside">
          <li>
            <a
              href="/docs/parser/api-references/compiler"
              className="text-blue-500 underline"
            >
              Compiler:
            </a> {_('Static methods for converting AST tokens to JSON')}
          </li>
          <li>
            <a
              href="/docs/parser/api-references/lexer"
              className="text-blue-500 underline"
            >
              Lexer:
            </a> {_('Tokenization and parsing utilities')}
          </li>
          <li>
            <a className="text-blue-500 underline">SchemaTree:</a>
            {_('Main parser for complete schema files')}
          </li>
          <li>
            <a
              href="/docs/parser/api-references/ast"
              className="text-blue-500 underline"
            >
              Syntax Trees:
            </a> {_('Individual parsers for different schema elements')}
          </li>
          <li>
            <a
              href="/docs/parser/api-references/tokens"
              className="text-blue-500 underline"
            >
              Tokens:
            </a> {_('AST token structures and type definitions')}
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Exception Handling Section Content */}
      <section>
        <H2>{_('Exception Handling')}</H2>
        <Translate>
          The library uses a custom Exception class that extends the
          standard Exception class for better error reporting.
        </Translate>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {exceptionExample}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Core Concepts'),
          href: "/docs/parser/core-concepts"
        }}
        next={{
          text: _('Examples'),
          href: "/docs/parser/examples"
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
