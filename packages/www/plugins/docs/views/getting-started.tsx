//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useState } from 'react';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, P, C, Nav } from '../components/index.js';
import Code from '../components/Code.js';
import Layout from '../components/Layout.js';

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
      <meta property="og:image" content="/icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/icon.png" />

      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export function Body() {
  const [install, setInstall] = useState('npm');
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Getting Started</H1>
      <P>
        The following is a guide to get you started with Idea.
      </P>

      <H2>Installation</H2>

      <div className="rounded-lg px-mx-10">
        <div className="theme-bg-bg3 flex items-center">
          <div
            className={`px-py-10 px-px-30 ${install === 'npm' ? 'theme-bg-bg1' : 'theme-bg-bg2'}`}
            onClick={() => setInstall('npm')}
          >
            <i className="px-fs-20 fab fa-fw fa-npm" />
          </div>
          <div
            className={`px-py-10 px-px-30 ${install === 'yarn' ? 'theme-bg-bg1' : 'theme-bg-bg2'}`}
            onClick={() => setInstall('yarn')}
          >
            <i className="px-fs-20 fab fa-fw fa-yarn" />
          </div>
        </div>
        <Code copy language="bash" className={`theme-bg-bg1 ${install === 'npm' ? '' : 'hidden'}`}>{
          ' npm i -D @stackpress/idea'
        }</Code>
        <Code copy language="bash" className={`theme-bg-bg1 ${install === 'yarn' ? '' : 'hidden'}`}>{
          'yarn add --dev @stackpress/idea'
        }</Code>
      </div>

      <H2>Create your first schema</H2>
      <P>Create a new file called <C>schema.idea</C></P>

      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {`model User {
  id String @id @default("nanoid()")
  name String @required
  email String @unique @required
  created Date @default("now()")
}

plugin "./plugins/typescript-generator.js" {
  output "./generated/types.ts"
}

`}
      </Code>

      <H2>Generate Code</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {`npx idea transform --input schema.idea
        `}
      </Code>

      <H2>Explore the Results</H2>
      <P>Check the generated files in your output directories!</P>

      <Nav
        prev={{ text: 'Introduction', href: '/docs/introduction' }}
        next={{ text: 'Specifications', href: '/docs/specifications/syntax-overview' }}
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
