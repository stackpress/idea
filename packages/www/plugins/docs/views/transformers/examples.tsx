//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
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
    'Practical examples of using the idea-transformer library for common code generation tasks'
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
  '// generate-types.js\nexport default async function generateTypes({ schema, config, transformer }) {\n  let content = \'\';\n  \n  // Generate enums\n  if (schema.enum) {\n    for (const [name, enumDef] of Object.entries(schema.enum)) {\n      content += `export enum ${name} {\\n`;\n      for (const [key, value] of Object.entries(enumDef)) {\n        content += `  ${key} = "${value}",\\n`;\n      }\n      content += \'}\\n\\n\';\n    }\n  }\n  \n  // Generate interfaces\n  if (schema.model) {\n    for (const [name, model] of Object.entries(schema.model)) {\n      content += `export interface ${name} {\\n`;\n      for (const column of model.columns) {\n        const optional = column.required ? \'\' : \'?\';\n        content += `  ${column.name}${optional}: ${mapType(column.type)};\\n`;\n      }\n      content += \'}\\n\\n\';\n    }\n  }\n  \n  const outputPath = await transformer.loader.absolute(config.output);\n  await writeFile(outputPath, content);\n}'
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

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Examples</H1>
      <P>
        This section provides practical examples of using the idea-transformer library for common code generation tasks. These examples demonstrate real-world usage patterns and best practices.
      </P>

      <H2>TypeScript Interface Generation</H2>
      <P>
        This example shows how to create a plugin that generates TypeScript interfaces from schema models. The example includes both the schema definition and the plugin implementation.
      </P>

      <H3>Schema Definition</H3>
      <Code copy language='idea' className='bg-black text-white'>
        {schemaExample[0]}
      </Code>

      <H3>Plugin Implementation</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {pluginExample[0]}
      </Code>

      <H2>CLI Integration</H2>
      <P>
        This example demonstrates how to integrate the idea-transformer CLI into your npm scripts for automated code generation during the build process.
      </P>
      <Code copy language='json' className='bg-black text-white'>
        {cliExample[0]}
      </Code>

      <Nav
        prev={{ text: 'Common Use Cases', href: '/docs/transformers/common-use-cases' }}
        next={{ text: 'Error Handling', href: '/docs/transformers/error-handling' }}
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
