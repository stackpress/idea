//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'r22n';
//docs
import { H1, H2, P, Nav, SS } from '../components/index.js';
import Layout from '../components/Layout.js';
import Code from '../components/Code.js';

export function DocumentationHead(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const url = request.url?.pathname || '/docs';
  const title = _('What is .idea?');
  const description = _(
    'The .idea file format is a declarative schema definition language designed to simplify application development by providing a single source of truth for data structures, relationships, and code generation.'
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
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>What is .idea?</H1>

      <P>
        The .idea file format is a declarative schema definition language designed to simplify application development by providing a single source of truth for data structures, relationships, and code generation. It enables developers to define their application's data model once and generate multiple outputs including database schemas, TypeScript interfaces, API documentation, forms, and more.
      </P>

      <P>
        Think of it as the bridge between AI prompting and full-stack code generation - where a simple schema definition can automatically generate everything from database tables to React components, API endpoints to documentation sites.
      </P>

      <H2>Why Use .idea?</H2>
      <ul className="list-disc list-inside">
        <li className="px-w-50-0 py-2">Single Source of Truth</li>
        <li className="px-w-50-0 py-2">Type Safety Everywhere</li>
        <li className="px-w-50-0 py-2">Rapid Development</li>
        <li className="px-w-50-0 py-2">Perfect Consistency</li>
        <li className="px-w-50-0 py-2">Infinite Extensibility</li>
        <li className="px-w-50-0 py-2">AI-to-Code Bridge</li>
      </ul>
      <P>
        <SS>Single Source of Truth</SS><br />
        Define your data model once, use it everywhere. No more maintaining separate schemas for database, frontend, and API.
      </P>

      <P>
        <SS>Type Safety Everywhere</SS><br />
        Generate type-safe code across languages - TypeScript, Python, Rust, Go, and more. Catch errors at compile time.
      </P>

      <P>
        <SS>Rapid Development</SS><br />
        Generate boilerplate code, forms, and documentation in seconds. What used to take hours now happens instantly.
      </P>

      <H2>Who Should Use This?</H2>

      <P>
        <SS>Junior Developers</SS><br />
        Easy syntax, rapid prototyping, learn best practices through generated code.
      </P>

      <P>
        <SS>Senior Developers</SS><br />
        Powerful features, extensible plugins, maintain consistency across large codebases.
      </P>

      <P>
        <SS>CTOs & Technical Leaders</SS><br />
        Reduce development time by 60-80%, improve consistency, accelerate time-to-market.
      </P>

      <H2>The Plugin Ecosystem</H2>
      <P>
        The power of .idea comes from its plugin system. Generate code for any technology:
      </P>

      <P>
        <SS>Languages</SS><br />
        TypeScript, Python, Rust, Go, Java, C#, PHP, and more.
      </P>

      <P>
        <SS>Frameworks</SS><br />
        React, Vue, Angular, Next.js, Express, FastAPI, Django, and more.
      </P>

      <P>
        <SS>Databases</SS><br />
        PostgreSQL, MySQL, MongoDB, Neo4j, and more.
      </P>

      <H2>Real-World Example</H2>

      <P>
        Here's how a simple e-commerce schema becomes a full application:
      </P>

      <Code language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {`// schema.idea
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
}`}
      </Code>

      <P>
        From this single schema, generate:
      </P>
      <ul className="px-lh-30 px-px-20 px-w-767 flex flex-wrap rmd-block rmd-w-100-0">
        <li className="px-w-50-0">✅ TypeScript interfaces</li>
        <li className="px-w-50-0">✅ PostgreSQL schema</li>
        <li className="px-w-50-0">✅ React components</li>
        <li className="px-w-50-0">✅ API documentation</li>
        <li className="px-w-50-0">✅ Validation schemas</li>
        <li className="px-w-50-0">✅ Test data</li>
      </ul>

      <H2>AI-Powered Workflow</H2>

      <P>
        The perfect workflow for AI-driven development:
      </P>
      <ol className="px-lh-30 px-px-20 px-w-767 flex flex-wrap rmd-block rmd-w-100-0">
        <li className="px-w-100-0">1. Describe your app to an AI</li>
        <li className="px-w-100-0">2. Get a .idea schema</li>
        <li className="px-w-100-0">3. Configure plugins</li>
        <li className="px-w-100-0">4. Generate full-stack code</li>
        <li className="px-w-100-0">5. Iterate and improve</li>
      </ol>

      <P>
        Go from idea to working application in minutes, not days.
      </P>

      <Nav next={{ text: 'Getting Started', href: '/docs/getting-started' }} />
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