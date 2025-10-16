//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const errorsExamples = [`
// ❌ Invalid - missing quotes around enum values
enum Status {
  ACTIVE Active
  INACTIVE Inactive
}

// ✅ Valid - proper enum syntax
enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}`,

  //------------------------------------------------------------------//

  `// ❌ Invalid - empty model
model User {
}

// ✅ Valid - model with columns
model User {
  id String @id
  name String @required
}`,

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

  `// ❌ Invalid - Boolean can't have @minLength
model User {
  active Boolean @minLength(5)
}

// ✅ Valid - appropriate attributes for type
model User {
  active Boolean @default(true)
  name String @minLength(2) @maxLength(50)
}`
];

//--------------------------------------------------------------------//

const errorPrevention = [`
import type { PluginProps, SchemaConfig } from '@stackpress/idea-transformer/types';

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

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

  `# Parse schema to check for errors
npm run idea:parse schema.idea

# Transform schema to validate plugins
npm run idea:transform schema.idea

# Generate output to verify results
npm run idea:generate`
];

//--------------------------------------------------------------------//

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Error Handling');
  const description = _(
    'Error handling is a crucial aspect of any application. The ' +
    '.idea file format provides a way to handle errors in a ' +
    'structured way.'
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
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      <H1>{_('Error Handling')}</H1>

      {/* Common Errors and Solutions Section */}
      <section>
        <H1>{_('Common Errors and Solutions')}</H1>

        <H2>{_('1. Invalid Schema Structure')}</H2>
        <P>
          <SS>{_('Error: ')}</SS>
          <C>{_('Invalid Schema')}</C>
        </P>

        <P>
          <SS>{_('Cause:')}</SS>
          <Translate>
            Syntax errors or malformed declarations
          </Translate>
        </P>

        <P><SS>{_('Solution:')}</SS></P>

        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorsExamples[0]}
        </Code>

        <H2>{_('2. Missing Required Properties')}</H2>
        <P>
          <SS>{_('Error:')}</SS>
          <C>{_('Expecting a columns property')}</C>
        </P>

        <P>
          <SS>{_('Cause:')}</SS>
          <Translate>
            Models and types must have column definitions
          </Translate>
        </P>

        <P><SS>{_('Solution:')}</SS></P>

        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorsExamples[1]}
        </Code>

        <H2>{_('3. Duplicate Declarations')}</H2>
        <P>
          <SS>{_('Error:')}</SS>
          <C>{_('Duplicate [name]')}</C>
        </P>

        <P>
          <SS>{_('Cause:')}</SS>
          <Translate>
            Models and types must have column definitions
          </Translate>
        </P>

        <P>
          <SS>{_('Solution:')}</SS>
          <Translate>
            Multiple declarations with the same name
          </Translate>
        </P>

        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorsExamples[2]}
        </Code>

        <H2>{_('4. Unknown References')}</H2>
        <P>
          <SS>{_('Error:')}</SS>
          <C>{_('Unknown reference [name]')}</C>
        </P>

        <P>
          <SS>{_('Cause:')}</SS>
          <Translate>
            Referencing undefined props, types, or enums
          </Translate>
        </P>

        <P><SS>{_('Solution:')}</SS></P>

        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorsExamples[3]}
        </Code>

        <H2>{_('5. Type Mismatches')}</H2>
        <P>
          <SS>{_('Error:')}</SS>
          <C>{_('Type mismatch')}</C>
        </P>

        <P>
          <SS>{_('Cause:')}</SS>
          <Translate>
            Using incompatible types or attributes
          </Translate>
        </P>

        <P><SS>{_('Solution:')}</SS></P>

        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorsExamples[4]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Error Prevention Section */}
      <section>
        <H1>{_('Error Prevention')}</H1>

        <H2>{_('1. Use TypeScript for Plugin Development')}</H2>

        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorPrevention[0]}
        </Code>

        <H2>{_('2. Validate Schema Before Processing')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorPrevention[1]}
        </Code>

        <H2>{_('3. Use Consistent Patterns')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorPrevention[2]}
        </Code>

        <H2>{_('4. Test Schema Changes')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {errorPrevention[3]}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Best Practices'),
          href: "/docs/specifications/best-practices"
        }}
        next={{
          text: _('Parser Installation'),
          href: "/docs/parser/installation"
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
