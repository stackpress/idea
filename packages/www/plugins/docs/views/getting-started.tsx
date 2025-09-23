//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useState } from 'react';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, P, C, Nav } from '../components/index.js';
import Code from '../components/Code.js';
import Layout from '../components/Layout.js';

const npmInstallCommand = 'npm i -D @stackpress/idea';

const yarnInstallCommand = 'yarn add --dev @stackpress/idea';

const schemaExample = `model User {
  id String @id @default("nanoid()")
  name String @required
  email String @unique @required
  created Date @default("now()")
}

plugin "./plugins/typescript-generator.js" {
  output "./generated/types.ts"
}`;

const generateCommand = 'npx idea transform --input schema.idea';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Getting Started');
  const description = _('describe');
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
  );
}

export function Body() {
  const [install, setInstall] = useState('npm');
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <header>
        <H1>{_('Getting Started')}</H1>
        <P>
          <Translate>
            The following is a guide to get you started with Idea.
          </Translate>
        </P>
      </header>

      <section>
        <H2>{_('Installation')}</H2>
        <div className="rounded-lg px-mx-10">
          <div className="theme-bg-bg3 flex items-center">
            <div
              className={`px-py-10 px-px-30 ${
                install === 'npm' ? 'theme-bg-bg1' : 'theme-bg-bg2'
              }`}
              onClick={() => setInstall('npm')}
            >
              <i className="px-fs-20 fab fa-fw fa-npm" />
            </div>
            <div
              className={`px-py-10 px-px-30 ${
                install === 'yarn' ? 'theme-bg-bg1' : 'theme-bg-bg2'
              }`}
              onClick={() => setInstall('yarn')}
            >
              <i className="px-fs-20 fab fa-fw fa-yarn" />
            </div>
          </div>
          <Code
            copy
            language="bash"
            className={`theme-bg-bg1 ${install === 'npm' ? '' : 'hidden'}`}
          >
            {npmInstallCommand}
          </Code>
          <Code
            copy
            language="bash"
            className={`theme-bg-bg1 ${install === 'yarn' ? '' : 'hidden'}`}
          >
            {yarnInstallCommand}
          </Code>
        </div>
      </section>

      <section>
        <H2>{_('Create your first schema')}</H2>
        <P>
          <Translate>
            Create a new file called <C>schema.idea</C>
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {schemaExample}
        </Code>
      </section>

      <section>
        <H2>{_('Generate Code')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {generateCommand}
        </Code>
      </section>

      <section>
        <H2>{_('Explore the Results')}</H2>
        <P>
          <Translate>
            Check the generated files in your output directories!
          </Translate>
        </P>
      </section>

      <footer>
        <Nav
          prev={{
            text: _('Introduction'),
            href: '/docs/introduction',
          }}
          next={{
            text: _('Specifications'),
            href: '/docs/specifications/syntax-overview',
          }}
        />
      </footer>
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