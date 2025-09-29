//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

const schemaExample = [
  `// schema.idea
model User {
  id String @id
  name String @required
  email String @required @unique
  role UserRole
  profile Profile?
}

enum UserRole {
  ADMIN "admin"
  USER "user"
}

type Profile {
  bio String
  avatar String?
}

plugin "./generate-types.js" {
  output "./generated/types.ts"
}`
];

const pluginExample = [
  `// generate-types.js
export default async function generateTypes({ schema, config, transformer }) {
  let content = '';
  
  // Generate enums
  if (schema.enum) {
    for (const [name, enumDef] of Object.entries(schema.enum)) {
      content += \`export enum \${name} {\\n\`;
      for (const [key, value] of Object.entries(enumDef)) {
        content += \`  \${key} = "\${value}",\\n\`;
      }
      content += '}\\n\\n';
    }
  }
  
  // Generate interfaces
  if (schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      content += \`export interface \${name} {\\n\`;
      for (const column of model.columns) {
        const optional = column.required ? '' : '?';
        content += \`  \${column.name}\${optional}: \${mapType(column.type)};\\n\`;
      }
      content += '}\\n\\n';
    }
  }
  
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
}`
];

const cliExample = [
  `{
  "scripts": {
    "generate": "idea transform --input ./schema.idea",
    "build": "npm run generate && tsc",
    "dev": "npm run generate && npm run build -- --watch"
  }
}`
];


export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Examples');
  const description = _(
    'Practical examples of using the idea-transformer library for ' +
    'common code generation tasks'
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
  //hooks
  const { _ } = useLanguage();
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      {/* Examples Section Content */}
      <section>
        <H1>{_('Examples')}</H1>
        <P>
          <Translate>
            This section provides practical examples of using the
            idea-transformer library for common code generation tasks.
            These examples demonstrate real-world usage patterns and
            best practices.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* TypeScript Interface Generation Section Content */}
      <section>
        <H2>{_('TypeScript Interface Generation')}</H2>
        <P>
          <Translate>
            This example shows how to create a plugin that generates
            TypeScript interfaces from schema models. The example
            includes both the schema definition and the plugin implementation.
          </Translate>
        </P>
      </section>

       {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Schema Definition Section Content */}
      <section>
        <H2>{_('Schema Definition')}</H2>
        <Code copy language='idea' className='bg-black text-white'>
          {schemaExample[0]}
        </Code>

        <H2>{_('Plugin Implementation')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {pluginExample[0]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* CLI Integration Section Content */}
      <section>
        <H2>{_('CLI Integration')}</H2>
        <P>
          <Translate>
            This example demonstrates how to integrate the idea-transformer CLI
            into your npm scripts for automated code generation during the
            build process.
          </Translate>
        </P>
        <Code copy language='json' className='bg-black text-white'>
          {cliExample[0]}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Common Use Cases'),
          href: '/docs/transformers/common-use-cases'
        }}
        next={{
          text: _('Error Handling'),
          href: '/docs/transformers/error-handling'
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
