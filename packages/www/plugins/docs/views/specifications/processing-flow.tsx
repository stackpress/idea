//modules
import type {
    ServerConfigProps,
    ServerPageProps
  } from 'stackpress/view/client';
  import { useState } from 'react';
  import { useLanguage } from 'stackpress/view/client';
  //docs
  import { H1, H2, P, C, H, Nav, SS } from '../../components/index.js';
  import Code from '../../components/Code.js';
  import Layout from '../../components/Layout.js';
  
  
  export function Head(props: ServerPageProps<ServerConfigProps>) {
    //props
    const { request, styles = [] } = props;
    //hooks
    const { _ } = useLanguage();
    //variables
    const title = _('Processing Flow');
    const description = _(
      'The .idea file format follows a structured processing flow:'
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
        <H1>Processing Flow</H1>
        <P>The <C>.idea</C> file format follows a structured processing flow:</P>
        <Code copy language="text" className="bg-black text-white px-mx-10 px-mb-20">
          {`┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   .idea File    │───▶│     Parser      │───▶│   AST (JSON)   │
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
                                              └─────────────────┘`}
        </Code>

        <H2>Processing Steps</H2>
        <ol className="px-lh-30 px-px-20 list-decimal list-inside">
          <li><SS>Parsing:</SS> Convert <C>.idea</C> syntax into Abstract Syntax Tree (AST)</li>
          <li><SS>Validation:</SS> Check for syntax errors, type consistency, and constraint violations</li>
          <li><SS>Transformation:</SS> Convert AST into structured JSON configuration</li>
          <li><SS>Plugin Execution:</SS> Run configured plugins to generate output files</li>
          <li><SS>Code Generation:</SS> Create TypeScript, SQL, documentation, forms, etc.</li>
        </ol>

        <Nav
          prev={{ text: 'Schema Directives', href: '/docs/specifications/schema-directives' }}
          next={{ text: 'Plugin System', href: '/docs/specifications/plugin-system' }}
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
  