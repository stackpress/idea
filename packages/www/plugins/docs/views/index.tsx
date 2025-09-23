//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, P, Nav } from '../components/index.js';
import Layout from '../components/Layout.js';
import Code from '../components/Code.js';

const schemaExample = `
// schema.idea
enum UserRole {
  ADMIN "Administrator"
  CUSTOMER "Customer"
}

model User {
  id String @id @default("nanoid()")
  email String @unique @required
  name String @required
  role UserRole @default("CUSTOMER")
  orders Order[] @relation(Order.userId)
}

model Product {
  id String @id @default("nanoid()")
  name String @required
  price Number @required
  inStock Boolean @default(true)
}

model Order {
  id String @id @default("nanoid()")
  userId String @relation(User.id)
  total Number @required
  status String @default("PENDING")
}

// Generate everything with plugins
plugin "./plugins/typescript-generator.js" {
  output "./src/types/schema.ts"
}

plugin "./plugins/database-generator.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

plugin "./plugins/react-forms.js" {
  output "./src/components/forms/"
  framework "react"
  styling "tailwind"
}

plugin "./plugins/api-generator.js" {
  output "./src/api/"
  framework "express"
  includeValidation true
}`

export function DocumentationHead(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const url = request.url?.pathname || '/docs';
  const title = _('What is .idea?');
  const description = _(
    'The .idea file format is a declarative schema definition language' +
    'designed to simplify application development by providing a single' +
    'source of truth for data structures, relationships, and code generation.'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:url" content={url} />
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

export function DocumentationBody() {
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>{_('What is .idea?')}</H1>

      <P>
        <Translate>
          The .idea file format is a declarative schema definition
          language designed to simplify application development by
          providing a single source of truth for data structures,
          relationships, and code generation. It enables developers
          to define their application's data model once and generate
          multiple outputs including database schemas, TypeScript
          interfaces, API documentation, forms, and more.
        </Translate>
      </P>

      <P>
        <Translate>
          Think of it as the bridge between AI prompting and full-
          stack code generation - where a simple schema definition can
          automatically generate everything from database tables to
          React components, API endpoints to documentation sites.
        </Translate>
      </P>

      <H1>{_('Why Use .idea?')}</H1>

      <ul>
        <li>
          <H2>{_('Single Source of Truth')}</H2>
          <Translate>
            Define your data model once, use it everywhere. No more
            maintaining separate schemas for database, frontend, and
            API.
          </Translate>
        </li>
        <li>
          <H2>Type Safety Everywhere</H2>
          <Translate>
            Generate type-safe code across languages - TypeScript,
            Python, Rust, Go, and more. Catch errors at compile time.
          </Translate>
        </li>
        <li>
          <H2>Rapid Development</H2>
          <Translate>
            Generate boilerplate code, forms, and documentation in
            seconds. What used to take hours now happens instantly.
          </Translate>
        </li>
      </ul>

      <H1>{_('Who Should Use This?')}</H1>

      <ul>
        <li>
          <H2>{_('Junior Developers')}</H2>
          <Translate>
            Easy syntax, rapid prototyping, learn best practices through
            generated code.
          </Translate>
        </li>
        <li>
          <H2>{_('Senior Developers')}</H2>
          <Translate>
            Powerful features, extensible plugins, maintain consistency
            across large codebases.
          </Translate>
        </li>
        <li>
          <H2>{_('CTOs & Technical Leaders')}</H2>
          <Translate>
            Reduce development time by 60-80%, improve consistency,
            accelerate time-to-market.
          </Translate>
        </li>
      </ul>

      <H1>{_('The Plugin Ecosystem')}</H1>

      <P>
        <Translate>
          The power of .idea comes from its plugin system. Generate code
          for any technology:
        </Translate>
      </P>

      <ul>
        <li>
          <H2>{_('Languages')}</H2>
          <Translate>
            TypeScript, Python, Rust, Go, Java, C#, PHP, and more.
          </Translate>
        </li>
        <li>
          <H2>{_('Frameworks')}</H2>
          <Translate>
            React, Vue, Angular, Next.js, Express, FastAPI, Django, and
            more.
          </Translate>
        </li>
        <li>
          <H2>{_('Databases')}</H2>
          <Translate>
            PostgreSQL, MySQL, MongoDB, Neo4j, and more.
          </Translate>
        </li>
      </ul>

      <H1>{_('Real-World Example')}</H1>

      <P>
        <Translate>
          Here's how a simple e-commerce schema becomes a full
          application:
        </Translate>
      </P>

      <Code language="javascript" className="bg-black text-white px-mb-20">
        {schemaExample}
      </Code>

      <P>
        <Translate>
          From this single schema, generate:
        </Translate>
      </P>

      <ul className="px-lh-30 px-px-20 px-w-767 flex flex-wrap rmd-block rmd-w-100-0">
        <li className="px-w-50-0">✅ {_('TypeScript interfaces')}</li>
        <li className="px-w-50-0">✅ {_('PostgreSQL schema')}</li>
        <li className="px-w-50-0">✅ {_('React components')}</li>
        <li className="px-w-50-0">✅ {_('API documentation')}</li>
        <li className="px-w-50-0">✅ {_('Validation schemas')}</li>
        <li className="px-w-50-0">✅ {_('Test data')}</li>
      </ul>

      <H2>{_('AI-Powered Workflow')}</H2>

      <P>
        <Translate>
          The perfect workflow for AI-driven development:
        </Translate>
      </P>
      <ol className="list-decimal px-lh-30 px-px-20 px-w-767 rmd-block rmd-w-100-0">
        <li className="px-w-100-0">{_('Describe your app to an AI')}</li>
        <li className="px-w-100-0">{_('Get a .idea schema')}</li>
        <li className="px-w-100-0">{_('Configure plugins')}</li>
        <li className="px-w-100-0">{_('Generate full-stack code')}</li>
        <li className="px-w-100-0">{_('Iterate and improve')}</li>
      </ol>

      <P>
        <Translate>
          Go from idea to working application in minutes, not days.
        </Translate>
      </P>

      <Nav next={{
        text: _('Getting Started'),
        href: '/docs/getting-started'
      }} />
    </main>
  );
}

export function DocumentationPage(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <DocumentationBody />
    </Layout>
  );
}

export const Head = DocumentationHead;
export default DocumentationPage;