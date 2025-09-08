//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useState } from 'react';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Examples');
  const description = _(
    'Examples of how to use the parser library'
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

const completeSchemaExample = [
  `import { final } from '@stackpress/idea-parser';

const schemaCode = \`
plugin "./database-plugin" {
  provider "postgresql"
  url env("DATABASE_URL")
}

prop Text { type "text" }
prop Email { type "email" format "email" }

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
  GUEST "Guest User"
}

type Address {
  street String @field.input(Text) @is.required
  city String @field.input(Text) @is.required
  country String @field.select
  postal String @field.input(Text)
}

model User! {
  id String @id @default("nanoid()")
  email String @field.input(Email) @is.required @is.unique
  name String @field.input(Text) @is.required
  role UserRole @default("USER")
  address Address?
  active Boolean @default(true)
  created Date @default("now()")
  updated Date @default("updated()")
}
\`;

const result = final(schemaCode);
console.log(JSON.stringify(result, null, 2));`,
`import { Compiler, EnumTree, ModelTree } from '@stackpress/idea-parser';

// Parse individual enum
const enumCode = \`enum Status { ACTIVE "Active" INACTIVE "Inactive" }\`;
const enumAST = EnumTree.parse(enumCode);
const [enumName, enumConfig] = Compiler.enum(enumAST);

// Parse individual model
const modelCode = \`model User { id String @id name String }\`;
const modelAST = ModelTree.parse(modelCode);
const [modelName, modelConfig] = Compiler.model(modelAST);`
]

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Examples</H1>
      <H2>Complete Schema Example</H2>
      <Code copy language='javascript' className='bg-black text-white'>
        {completeSchemaExample[0]}
      </Code>

      <H2>Working with Individual Components</H2>
      <Code copy language='javascript' className='bg-black text-white'>
        {completeSchemaExample[1]}
      </Code>

      <Nav
        prev={{ text: 'API Reference', href: '/docs/parser/api-reference' }}
        next={{ text: 'Best Practices', href: '/docs/parser/best-practices' }}
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
