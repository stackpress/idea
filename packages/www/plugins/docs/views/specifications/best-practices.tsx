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

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Best Practices');
  const description = _(
    'Best practices for using the .idea file format to generate various outputs like TypeScript interfaces, database schemas, API documentation, and more.'
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
]

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Best Practices</H1>
      <H2>1. Schema Organization</H2>
      <P>Use Descriptive Names</P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[0]}
      </Code>

      <P>Group Related Elements</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[1]}
      </Code>

      <P>Use Consistent Naming Conventions</P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[2]}
      </Code>

      <H2>2. Type Safety</H2>
      <P>Define Custom Types for Complex Data</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[3]}
      </Code>

      <P>Use Enums for Fixed Sets of Values</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[4]}
      </Code>

      <H2>3. Validation and Constraints</H2>
      <P>Use Appropriate Validation Attributes</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[5]}
      </Code>

      <P>Provide Meaningful Defaults</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[6]}
      </Code>

      <H2>4. Relationships</H2>
      <P>Use Clear Relationship Patterns</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[7]}
      </Code>

      <H2>5. Plugin Configuration</H2>
      <P>Organize Plugins by Purpose</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {bestPractices[8]}
      </Code>

      <Nav
        prev={{ text: 'Complete Examples', href: '/docs/specifications/complete-examples' }}
        next={{ text: 'Error Handling', href: '/docs/specifications/error-handling' }}
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
