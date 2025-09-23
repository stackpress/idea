//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, P, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

const bestPractices = [
  `// ✅ Good
enum UserAccountStatus {
  ACTIVE "Active Account"
  SUSPENDED "Temporarily Suspended"
  DEACTIVATED "Permanently Deactivated"
}

// ❌ Avoid
enum Status {
  A "Active"
  S "Suspended"
  D "Deactivated"
}`,
  `// User-related enums
enum UserRole { /* ... */ }
enum UserStatus { /* ... */ }

// User-related types
type UserProfile { /* ... */ }
type UserPreferences { /* ... */ }

// User-related models
model User { /* ... */ }
model UserSession { /* ... */ }`,
  `// Models: PascalCase
model UserAccount { /* ... */ }

// Enums: PascalCase
enum OrderStatus { /* ... */ }

// Props: PascalCase
prop EmailInput { /* ... */ }

// Columns: camelCase
model User {
  firstName String
  lastName String
  emailAddress String
}`,
  `type Money {
  amount Number @required @min(0)
  currency String @default("USD")
}

type Coordinates {
  latitude Number @required @min(-90) @max(90)
  longitude Number @required @min(-180) @max(180)
}

model Product {
  price Money @required
  location Coordinates?
}`,
  `// ✅ Good - type-safe and self-documenting
enum Priority {
  LOW "Low Priority"
  MEDIUM "Medium Priority"
  HIGH "High Priority"
  URGENT "Urgent"
}

model Task {
  priority Priority @default("MEDIUM")
}

// ❌ Avoid - error-prone and unclear
model Task {
  priority String @default("medium")
}`,
  `model User {
  email String @required @unique @pattern("^[^\s@]+@[^\s@]+\.[^\s@]+$")
  age Number @min(13) @max(120)
  username String @required @minLength(3) @maxLength(30) @pattern("^[a-zA-Z0-9_]+$")
  bio String @maxLength(500)
  tags String[] @maxItems(10)
}`,
  `model User {
  role UserRole @default("USER")
  active Boolean @default(true)
  emailVerified Boolean @default(false)
  created Date @default("now()")
  updated Date @default("updated()")
  preferences {
    theme String @default("light")
    language String @default("en")
    notifications Boolean @default(true)
  }
}`,
  `// One-to-many relationship
model User {
  id String @id
  posts Post[] @relation(Post.authorId)
}

model Post {
  id String @id
  authorId String @relation(User.id)
  author User @relation(User, authorId)
}

// Many-to-many relationship
model Post {
  id String @id
  tags Tag[] @relation(PostTag.postId)
}

model Tag {
  id String @id
  posts Post[] @relation(PostTag.tagId)
}

model PostTag {
  postId String @relation(Post.id)
  tagId String @relation(Tag.id)
}`,
  `// Type generation
plugin "./plugins/typescript-generator.js" {
  output "./src/types/schema.ts"
  namespace "Schema"
}

// Database schema
plugin "./plugins/database-generator.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

// API documentation
plugin "./plugins/openapi-generator.js" {
  output "./docs/api.yaml"
  version "1.0.0"
}

// Form generation
plugin "./plugins/form-generator.js" {
  output "./src/components/forms/"
  framework "react"
  styling "tailwind"
}`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Best Practices');
  const description = _(
    'Best practices for using the .idea file format to generate ' +
    'various outputs like TypeScript interfaces, database schemas, ' +
    'API documentation, and more.'
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
        <link
          key={index}
          rel="stylesheet"
          type="text/css"
          href={href}
        />
      ))}
    </>
  )
}

export function Body() {
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>{_('Best Practices')}</H1>

      <section>
        <H2>{_('1. Schema Organization')}</H2>
        <P><Translate>Use Descriptive Names</Translate></P>
        <Code
          copy
          language="javascript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[0]}
        </Code>

        <P><Translate>Group Related Elements</Translate></P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[1]}
        </Code>

        <P><Translate>Use Consistent Naming Conventions</Translate></P>
        <Code
          copy
          language="javascript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[2]}
        </Code>
      </section>

      <section>
        <H2>{_('2. Type Safety')}</H2>
        <P><Translate>Define Custom Types for Complex Data</Translate></P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[3]}
        </Code>

        <P><Translate>Use Enums for Fixed Sets of Values</Translate></P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[4]}
        </Code>
      </section>

      <section>
        <H2>{_('3. Validation and Constraints')}</H2>
        <P><Translate>Use Appropriate Validation Attributes</Translate></P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[5]}
        </Code>

        <P><Translate>Provide Meaningful Defaults</Translate></P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[6]}
        </Code>
      </section>

      <section>
        <H2>{_('4. Relationships')}</H2>
        <P><Translate>Use Clear Relationship Patterns</Translate></P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[7]}
        </Code>
      </section>

      <section>
        <H2>{_('5. Plugin Configuration')}</H2>
        <P><Translate>Organize Plugins by Purpose</Translate></P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {bestPractices[8]}
        </Code>
      </section>

      <footer>
        <Nav
          prev={{ 
            text: _('Complete Examples'), 
            href: '/docs/specifications/complete-examples' 
          }}
          next={{
            text: _('Error Handling'),
            href: '/docs/specifications/error-handling' 
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
