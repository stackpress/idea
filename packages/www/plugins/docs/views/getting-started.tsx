//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useState } from 'react';
import { useLanguage, Translate } from 'r22n';
import clsx from 'clsx';
//local
import { H1, P, C, Nav } from '../components/index.js';
import Code from '../components/Code.js';
import Layout from '../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const npmInstallCommand = 'npm i -D @stackpress/idea';

//--------------------------------------------------------------------//

const yarnInstallCommand = 'yarn add --dev @stackpress/idea';

//--------------------------------------------------------------------//

const schemaExample = 
`model User {
  id String @id @default("nanoid()")
  name String @required
  email String @unique @required
  created Date @default("now()")
}

plugin "./plugins/typescript-generator.js" {
  output "./generated/types.ts"
}`;

//--------------------------------------------------------------------//

const generateCommand = 'npx idea transform --input schema.idea';

//styles
//--------------------------------------------------------------------//

const packageStyle = clsx(
  'bg-yellow-800',
  'text-white'
);

//--------------------------------------------------------------------//

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
  //hooks
  const [install, setInstall] = useState('npm');
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Getting Started Section Content */}
      <section>
        <H1>{_('Getting Started')}</H1>
        <P>
          <Translate>
            The following is a guide to get you started with Idea.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Installation  */}
      <section>
        <H1>{_('Installation')}</H1>
        <div className="px-mx-10 rounded-lg">
          <div className="flex items-center theme-bg-bg1">
            <div
              className={
                clsx(
                  'px-px-30',
                  'px-py-10',
                  install === 'npm' ? packageStyle : 'theme-bg-bg2'
                )
              }
              onClick={() => setInstall('npm')}
            >
              <i className="fab fa-fw fa-npm px-fs-20" />
            </div>
            <div
              className={
                clsx(
                  'px-px-30',
                  'px-py-10',
                  install === 'yarn' ? packageStyle : 'theme-bg-bg2'
                )
              }
              onClick={() => setInstall('yarn')}
            >
              <i className="fab fa-fw fa-yarn px-fs-20" />
            </div>
          </div>
          <Code
            copy
            language="bash"
            className={
              clsx(
                'bg-black',
                'text-white',
                install === 'npm' ? '' : 'hidden'
              )
            }
          >
            {npmInstallCommand}
          </Code>
          <Code
            copy
            language="bash"
            className={
              clsx(
                'bg-black',
                'text-white',
                install === 'yarn' ? '' : 'hidden'
              )
            }
          >
            {yarnInstallCommand}
          </Code>
        </div>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Create Schema Content */}
      <section>
        <H1>{_('Create your first schema')}</H1>
        <P>
          <Translate>
            Create a new file called <C>schema.idea</C>
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {schemaExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Generate Code Content */}
      <section>
        <H1>{_('Generate Code')}</H1>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {generateCommand}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Explore the Results Content */}
      <section>
        <H1>{_('Explore the Results')}</H1>
        <P>
          <Translate>
            Check the generated files in your output directories!
          </Translate>
        </P>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Introduction'),
          href: "/docs/introduction"
        }}
        next={{
          text: _('Specifications'),
          href: "/docs/specifications/syntax-overview"
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