//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useState } from 'react';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, H, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Error Handling');
  const description = _(
    'Error handling is a crucial aspect of any application. The .idea file format provides a way to handle errors in a structured way.'
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

const errors = [
  `// ❌ Invalid - missing quotes around enum values
enum Status {
  ACTIVE Active
  INACTIVE Inactive
}

// ✅ Valid - proper enum syntax
enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}`,
  `// ❌ Invalid - empty model
model User {
}

// ✅ Valid - model with columns
model User {
  id String @id
  name String @required
}`,
  `// ❌ Invalid - duplicate model names
model User {
  id String @id
}

model User {  // Duplicate!
  name String
}

// ✅ Valid - unique names
model User {
  id String @id
}

model UserProfile {
  name String
}`,
  `// ❌ Invalid - EmailInput prop not defined
model User {
  email String @field.input(EmailInput)
}

// ✅ Valid - define prop first
prop EmailInput {
  type "email"
  validation { required true }
}

model User {
  email String @field.input(EmailInput)
}`,
  `// ❌ Invalid - Boolean can't have @minLength
model User {
  active Boolean @minLength(5)
}

// ✅ Valid - appropriate attributes for type
model User {
  active Boolean @default(true)
  name String @minLength(2) @maxLength(50)
}`

]

const errorPrevention = [
  `import type { PluginProps, SchemaConfig } from '@stackpress/idea-transformer/types';

export default async function myPlugin(props: PluginProps<{}>) {
  // TypeScript will catch type errors at compile time
  const { config, schema } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('Output path is required');
  }
  
  // Process schema safely
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      // Process each model
    }
  }
}`,
`// Always validate required fields
model User {
  id String @id @required
  email String @required @unique
  name String @required
}

// Use appropriate data types
model Product {
  price Number @min(0)        // Not String
  active Boolean              // Not Number
  created Date @default("now()") // Not String
}`,
`// Consistent ID patterns
model User {
  id String @id @default("nanoid()")
}

model Post {
  id String @id @default("nanoid()")
}

// Consistent timestamp patterns
model User {
  created Date @default("now()")
  updated Date @default("updated()")
}`,
`# Parse schema to check for errors
npm run idea:parse schema.idea

# Transform schema to validate plugins
npm run idea:transform schema.idea

# Generate output to verify results
npm run idea:generate`
]

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Error Handling</H1>
      <H1>Common Errors and Solutions</H1>
      <H2>1. Invalid Schema Structure</H2>
      <P><SS>Error:</SS><C> Invalid Schema</C></P>
      <P><SS>Cause:</SS> Syntax errors or malformed declarations</P>
      <P><SS>Solution:</SS></P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errors[0]}
      </Code>

      <H2>2. Missing Required Properties</H2>
      <P><SS>Error:</SS><C> Expecting a columns property</C></P>
      <P><SS>Cause:</SS> Models and types must have column definitions</P>
      <P><SS>Solution:</SS></P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errors[1]}
      </Code>

      <H2>3. Duplicate Declarations</H2>
      <P><SS>Error:</SS><C> Duplicate [name]</C></P>
      <P><SS>Cause:</SS> Models and types must have column definitions</P>
      <P><SS>Solution:</SS> Multiple declarations with the same name</P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errors[2]}
      </Code>


      <H2>4. Unknown References</H2>
      <P><SS>Error:</SS><C> Unknown reference [name]</C></P>
      <P><SS>Cause:</SS> Referencing undefined props, types, or enums</P>
      <P><SS>Solution:</SS></P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errors[3]}
      </Code>

      <H2>5. Type Mismatches</H2>
      <P><SS>Error:</SS><C> Type mismatch</C></P>
      <P><SS>Cause:</SS> Using incompatible types or attributes</P>
      <P><SS>Solution:</SS></P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errors[4]}
      </Code>

      <H1>Error Prevention</H1>
      <H2>1. Use TypeScript for Plugin Development</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errorPrevention[0]}
      </Code>

      <H2>2. Validate Schema Before Processing</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errorPrevention[1]}
      </Code>

      <H2>3. Use Consistent Patterns</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errorPrevention[2]}
      </Code>

      <H2>4. Test Schema Changes</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {errorPrevention[3]}
      </Code>
    
      <Nav
        prev={{ text: 'Best Practices', href: '/docs/specifications/best-practices' }}
        next={{ text: 'Parser Installation', href: '/docs/parser/installation' }}
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
