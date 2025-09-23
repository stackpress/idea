//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, P, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Syntax Overview');
  const description = _(
    'The .idea file format uses a simplified syntax that eliminates ' +
    'the need for traditional separators like commas (&#44;) and ' +
    'colons (&#58;) found in JSON or JavaScript. The parser can ' +
    'logically determine separations, making the syntax cleaner ' +
    'and more readable.'
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

const examples = [
  `// JavaScript object
{ foo: "bar", bar: "foo" }

// JavaScript array
[ "foo", "bar" ]

// Nested structure
{
  user: {
    name: "John",
    age: 30,
    active: true
  },
  tags: ["admin", "user"]
}`,
  `// Object structure
{ foo "bar" bar "foo" }

// Array structure
[ "foo" "bar" ]

// Nested structure
{
  user {
    name "John"
    age 30
    active true
  }
  tags ["admin" "user"]
}`,
  `// Strings - always use double quotes
name "John Doe"
description "A comprehensive user management system"

// Numbers - no quotes needed
age 30
price 99.99
count -5

// Booleans - no quotes needed
active true
verified false

// Arrays - space-separated values
tags ["admin" "user" "moderator"]
numbers [1 2 3 4 5]
mixed ["text" 123 true]

// Objects - nested key-value pairs
profile {
  firstName "John"
  lastName "Doe"
  settings {
    theme "dark"
    notifications true
  }
}`,
  `// This is a single-line comment
model User {
  id String @id // Inline comment
  name String @required
  // Another comment
  email String @unique
}

/*
  Multi-line comments are also supported
  for longer explanations
*/`
]

export function Body() {
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <section>
        <H1>{_('Syntax Overview')}</H1>
        <P>
          <Translate>
            The .idea file format uses a simplified syntax that
            eliminates the need for traditional separators like commas
            (&#44;) and colons (&#58;) found in JSON or JavaScript.
            The parser can logically determine separations, making the
            syntax cleaner and more readable.
          </Translate>
        </P>
      </section>

      <section>
        <H2>{_('Key Syntax Rules')}</H2>
        <ul className="px-lh-30 px-px-20 list-disc">
          <li>
            <SS>{_('No Separators Required:')}</SS>
            <Translate>
              The parser intelligently determines where values begin
              and end
            </Translate>
          </li>
          <li>
            <SS>{_('Double Quotes Only:')}</SS>
            <Translate>
              All strings must use double quotes (") - single quotes
              are not supported
            </Translate>
          </li>
          <li>
            <SS>{_('Context Awareness:')}</SS>
            <Translate>
              The parser understands context and can differentiate
              between keys, values, and nested structures
            </Translate>
          </li>
        </ul>
      </section>

      <section>
        <H2>{_('Syntax Comparison')}</H2>
        <P><Translate>Traditional JavaScript/JSON:</Translate></P>
        <Code
          language="javascript"
          className="bg-black text-white px-mb-20"
        >
          {examples[0]}
        </Code>

        <P><Translate>Equivalent .idea syntax:</Translate></P>
        <Code
          language="javascript"
          className="bg-black text-white px-mb-20"
        >
          {examples[1]}
        </Code>
      </section>

      <section>
        <H2>{_('Data Types Representations')}</H2>
        <Code
          language="javascript"
          className="bg-black text-white px-mb-20 mt-5"
        >
          {examples[2]}
        </Code>
      </section>

      <section>
        <H2>{_('Comments')}</H2>
        <P>
          <Translate>
            Comments in .idea files use the standard // syntax:
          </Translate>
        </P>
        <Code
          language="javascript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[3]}
        </Code>
      </section>

      <footer>
        <Nav
          next={{
            text: _('Data Types'),
            href: '/docs/specifications/data-types'
          }}
          prev={{
            text: _('Getting Started'),
            href: '/docs/getting-started'
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
