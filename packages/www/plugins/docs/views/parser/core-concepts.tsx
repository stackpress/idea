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
  const title = _('Getting Started');
  const description = _(
    'describe'
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

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Core Concepts</H1>
      <H2>Schema Structure</H2>
      <P>An <C>.idea</C> schema file can contain several types of declarations:</P>

      <ol className='list-decimal list-inside'>
        <li className='my-2'><C>Plugins:</C> External integrations and configurations
        </li>
        <li className='my-2'><C>Use statements:</C> Import other schema files</li>
        <li><C>Props:</C> Reusable property configurations</li>
        <li className='my-2'><C>Enums:</C> Enumerated value definitions</li>
        <li className='my-2'><C>Types:</C> Custom type definitions with columns</li>
        <li className='my-2'><C>Models:</C> Database model definitions</li>
      </ol>

      <H2>Processing FLow</H2>
      <P>The library follows this processing flow:</P>

      <Code copy language='text' className='bg-black text-white '>
        {`Raw Schema Code → SchemaTree → Compiler → JSON Output
        `}
      </Code>

      <ol className='list-decimal list-inside'>
        <li className='my-2'><SS>Raw Code:</SS> Your <C>.idea</C> schema file content</li>
        <li className='my-2'><SS>SchemaTree:</SS> Parses the entire file into an Abstract Syntax Tree</li>
        <li className='my-2'><SS>Compiler:</SS> Converts AST tokens into structured JSON</li>
        <li className='my-2'><SS>JSON Output:</SS> Final configuration object</li>
      </ol>

      <Nav
        prev={{ text: 'Installation', href: '/docs/parser/installation' }}
        next={{ text: 'API Reference', href: '/docs/parser/api-reference' }}
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
