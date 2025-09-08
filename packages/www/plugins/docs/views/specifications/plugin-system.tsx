//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, H, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Plugin System');
  const description = _(
    'The plugin system enables extensible code generation from your schema definitions.'
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

const pluginDeclaration = [
  `plugin "./path/to/plugin.js" {
  output "./generated/output.ts"
  format "typescript"
  options {
    strict true
    comments true
  }
}`,
  `import type { PluginProps } from '@stackpress/idea-transformer/types';

export default async function myPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  // Process schema and generate output
  const content = generateFromSchema(schema);
  
  // Write to configured output path
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
}`
]

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Plugin System</H1>
      <P>The plugin system enables extensible code generation from your schema definitions.</P>

      <H2>Plugin Declaration</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {pluginDeclaration[0]}
      </Code>

      <H2>Common Plugin Types</H2>
      <Table className='text-left'>
        <Thead className="theme-bg-bg2 text-left">Plugin Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Purpose</Thead>
        <Thead className="theme-bg-bg2 text-left">Output</Thead>
        <Trow>
          <Tcol>TypeScript Generator</Tcol>
          <Tcol>Generate interfaces and types</Tcol>
          <Tcol><C>.ts</C> files</Tcol>
        </Trow>
        <Trow>
          <Tcol>Database Schema</Tcol>
          <Tcol>Generate SQL DDL</Tcol>
          <Tcol><C>.sql</C> files</Tcol>
        </Trow>
        <Trow>
          <Tcol>API Documentation</Tcol>
          <Tcol>Generate OpenAPI Specs</Tcol>
          <Tcol><C>.json/.yaml</C> files</Tcol>
        </Trow>
        <Trow>
          <Tcol>Form Generator</Tcol>
          <Tcol>Generate HTML Forms</Tcol>
          <Tcol><C>.html</C> files</Tcol>
        </Trow>
        <Trow>
          <Tcol>Validation Schema</Tcol>
          <Tcol>Generate Zod/Joi schemas</Tcol>
          <Tcol><C>.ts</C> files</Tcol>
        </Trow>
        <Trow>
          <Tcol>Mock Data</Tcol>
          <Tcol>Generate test fixtures</Tcol>
          <Tcol><C>.json</C> files</Tcol>
        </Trow>
      </Table>

      <H2>Plugin Development</H2>

      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {pluginDeclaration[1]}
      </Code>

      <Nav
        prev={{ text: 'Processing Flow', href: '/docs/specifications/processing-flow' }}
        next={{ text: 'Complete Examples', href: '/docs/specifications/complete-examples' }}
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
