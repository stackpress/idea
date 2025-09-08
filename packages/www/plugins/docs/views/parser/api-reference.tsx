//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useState } from 'react';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, P, C, Nav, SS, A } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('API Reference');
  const description = _(
    'API Reference for the parser library'
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
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/parser/pages/lexer">
          {_('Lexer API Reference')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/parser/pages/compiler">
          {_('Compiler API Reference')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/parser/pages/ast">
          {_('AST Reference')}
        </a>

        <a className="text-blue-500 block cursor-pointer underline" href="/docs/parser/pages/tokens">
          {_('Token Reference')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/parser/pages/exception-handling">
          {_('Exception Handling')}
        </a>
      </nav>
    </menu>
  );
}

const exampleCode = [
  `import { parse } from '@stackpress/idea-parser';

const result = parse(\`
prop Text { type "text" }
model User {
  name String @field.input(Text)
}
\`);

console.log(result);
// Output includes prop references: { prop: { Text: { type: "text" } }, ... }`,
  `import { final } from '@stackpress/idea-parser';

const result = final(\`
prop Text { type "text" }
model User {
  name String @field.input(Text)
}
\`);

console.log(result);
// Output has resolved references: { model: { User: { ... } } }
// No 'prop' section in output`,
`import { Exception } from '@stackpress/idea-parser';

try {
  const result = parse(invalidCode);
} catch (error) {
  if (error instanceof Exception) {
    console.log('Parsing error:', error.message);
  }
}`
]

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>API Reference</H1>
      <H2>Main Functions</H2>
      <P><C>parse(code: string)</C></P>
      <P>Converts schema code into a JSON representation with references preserved.</P>
      <SS>Parameters:</SS>
      <li className='my-2'><C>code (string):</C> The schema code to parse</li>

      <SS>Returns:</SS>
      <li className='my-2'><C>SchemaConfig:</C> JSON object representing the parse schema</li>

      <P>Example: </P>
      <Code copy language='javascript' className='bg-black text-white'>
        {exampleCode[0]}
      </Code>

      <P><C>final(code: string)</C></P>
      <P>
        Converts schema code into a clean JSON representation with references resolved and removed.
      </P>

      <SS>Parameters</SS>
      <li className='my-2'><C>code (string):</C> The schema code to parse</li>

      <SS>Returns:</SS>
      <li className='my-2'><C>FinalSchemaConfig: </C> Clean JSON object without prop/use references</li>

      <SS>Example: </SS>
      <Code copy language='javascript' className='bg-black text-white'>
        {exampleCode[1]}
      </Code>

      <H2>Core Classes</H2>
      <ul className='list-disc list-inside'>
        <li><a href="/docs/parser/pages/compiler" className='text-blue-500 underline'>Compiler:</a> Static methods for converting AST tokens to JSON</li>
        <li><a href="/docs/parser/pages/lexer" className='text-blue-500 underline'>Lexer:</a> Tokenization and parsing utilities</li>
        <li><a className='text-blue-500 underline'>SchemaTree:</a> Main parser for complete schema files</li>
        <li><a href="/docs/parser/pages/ast" className='text-blue-500 underline'>Syntax Trees:</a> Individual parsers for different schema elements</li>
        <li><a href="/docs/parser/pages/tokens" className='text-blue-500 underline'>Tokens:</a> AST token structures and type definitions</li>
      </ul>

      <H2>Exception Handling</H2>
      <P>The library uses a custom <C>Exception</C> class that extends the standard Exception class for better error reporting.</P>
      <Code copy language='javascript' className='bg-black text-white'>
        {exampleCode[2]}
      </Code>

      <Nav
        prev={{ text: 'Core Concepts', href: '/docs/parser/core-concepts' }}
        next={{ text: 'Examples', href: '/docs/parser/examples' }}
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
