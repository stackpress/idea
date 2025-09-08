//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useState } from 'react';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, P, C, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Installation');
  const description = _(
    'A TypeScript library for parsing .idea schema files into Abstract Syntax Trees (AST) and converting them to readable JSON configurations. This library is designed to help developers work with schema definitions in a structured and type-safe manner.'
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

const examples = [
  `npm install @stackpress/idea-parser
  `,
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
const finalSchema = final(schemaCode);`
]

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Idea Parser</H1>
      <P>
        A TypeScript library for parsing .idea schema files into Abstract Syntax Trees (AST) and converting them to readable JSON configurations. This library is designed to help developers work with schema definitions in a structured and type-safe manner.
      </P>

      <H1>Installation</H1>
      <P>Install the package using npm:</P>
      <Code copy language='javascript' className='bg-black text-white px-mx-10 px-mb-20'>
        {examples[0]}
      </Code>

      <H1>Quick Start</H1>
      <P>The library provides two main functions for parsing schema files:</P>

      <H2>Basic Usage</H2>
      <Code copy language='javascript' className='bg-black text-white px-mx-10 px-mb-20'>
        {examples[1]}
      </Code>

      <li className='font-bold list-none text-xl mt-10'>Difference between <C>parse</C> and <C>final</C></li>
      <li className='my-2'><C>parse(code: string): </C> Converts schema code to JSON while preserving prop and use references</li>
      <li><C>final(code: string): </C> Like parse but removes prop and use references for a clean final output</li>

      <Nav
        prev={{ text: 'Specifications', href: '/docs/specifications/syntax-overview' }}
        next={{ text: 'Core Concepts', href: '/docs/parser/core-concepts' }}
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
