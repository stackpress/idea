//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//locals
import { H1, H2, P, C, H, Nav, SS } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
//----------------------------------------------------------------------

const examples = [`
// Simple boolean attribute (sets value to true)
@filterable

// Function with single argument
@label("Name")

// Function with multiple arguments
@is.cgt(3 "Name should be more than 3 characters")

// Function with object argument
@view.image({ width 100 height 100 })

// Nested attribute names using periods
@field.input(Email)
@validation.required
@ui.component("CustomInput")`,

  //--------------------------------------------------------------------

  `// Boolean (implicit true)
@required
@unique
@filterable

// String values
@label("User Name")
@placeholder("Enter your name")
@description("This field is required")

// Number values
@min(0)
@max(100)
@precision(2)

// Object values
@validation({ required true minLength 3 })
@ui({ component "Input" placeholder "Enter text" })
@options({ multiple true searchable false })

// Array values
@tags(["admin" "user" "guest"])
@options(["small" "medium" "large"])
@toolbar(["bold" "italic" "underline"])

// Mixed arguments
@between(1 100 "Value must be between 1 and 100")
@pattern("^[a-zA-Z]+$" "Only letters allowed")`,

  //--------------------------------------------------------------------

  `// Model-level attributes
model User @table("users") @index(["email" "created"]) {
  // Column-level attributes
  id String @id @default("nanoid()")
  name String @required @minLength(2)
}

// Type-level attributes
type Address @serializable @cacheable(3600) {
  street String @required
  city String @required
}`,

  //--------------------------------------------------------------------

  `model User {
  name String          // Required string
  bio String?          // Optional string
  tags String[]        // Array of strings
  addresses Address[]  // Array of custom types
  metadata JSON?       // Optional JSON
}`,

  //--------------------------------------------------------------------

  `model User {
  profile {
    firstName String
    lastName String
    social {
      twitter String?
      github String?
    }
  }
  settings {
    theme String @default("light")
    notifications Boolean @default(true)
  }
}`
];

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Schema Elements');
  const description = _(
    'Schema elements are the building blocks of your application schema.'
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


export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      <H1>{_('Schema Elements')}</H1>

      {/* Attributes Content */}
      <section>
        <H2>{_('Attributes (@)')}</H2>
        <P>
          <Translate>
            Attributes provide metadata and configuration for columns,
            types, and models. They define validation rules, UI components,
            relationships, and behavior. Attributes can be attached to any
            schema element and are processed by plugins according to their
            specific needs.
          </Translate>
        </P>

        <H>
          <SS>{_('Note:')}</SS>
          <Translate>
            There are no reserved or pre-defined attributes in idea. You
            can define any arbitrary attributes in your schema. It\'s up
            to the plugins to recognize and process them.
          </Translate>
        </H>

        <H2>{_('Attribute Syntax')}</H2>
        <P>
          <Translate>
            Attributes always start with the at symbol (@) followed by
            letters, numbers, and periods. They can be expressed in several
            forms.
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 px-mx-10 text-white">
          {examples[0]}
        </Code>

        <H2>{_('Attribute Value Types')}</H2>
        <P>{_('Attributes can hold different types of values:')}</P>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 px-mx-10 text-white">
          {examples[1]}
        </Code>

        <H2>{_('Attribute Scope')}</H2>
        <P>
          <Translate>
            Attributes can be applied to different schema elements:
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20"
        >
          {examples[2]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Columns Content */}
      <section>
        <H2>{_('Columns')}</H2>
        <P>
          <Translate>
            Columns define the individual fields within models and types,
            specifying their data type, constraints, and behavior.
          </Translate>
        </P>

        <Table>
          <Thead className="text-left theme-bg-bg1">Types</Thead>
          <Thead className="text-left theme-bg-bg1">Description</Thead>
          <Thead className="text-left theme-bg-bg1">Example</Thead>
          <Trow>
            <Tcol
              noWrap
              className="text-left"
            >
              <C>String</C>
            </Tcol>
            <Tcol className="text-left">Text data</Tcol>
            <Tcol><C>name String</C></Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol
              noWrap
              className="text-left"
            >
              <C>Number</C>
            </Tcol>
            <Tcol className="text-left">Numeric data</Tcol>
            <Tcol><C>age Number</C></Tcol>
          </Trow>
          <Trow>
            <Tcol
              noWrap
              className="text-left"
            >
              <C>Boolean</C>
            </Tcol>
            <Tcol className="text-left">True or false values</Tcol>
            <Tcol><C>active Boolean</C></Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol
              noWrap
              className="text-left"
            >
              <C>Date</C>
            </Tcol>
            <Tcol className="text-left">Date/time values</Tcol>
            <Tcol><C>created Date</C></Tcol>
          </Trow>
          <Trow>
            <Tcol
              noWrap
              className="text-left"
            >
              <C>JSON</C>
            </Tcol>
            <Tcol className="text-left">JSON Objects</Tcol>
            <Tcol><C>metadata JSON</C></Tcol>
          </Trow>
          <Trow className="theme-bg-bg1">
            <Tcol
              noWrap
              className="text-left"
            >
              <C>CustomType</C>
            </Tcol>
            <Tcol className="text-left">User-defined types</Tcol>
            <Tcol><C>address Address</C></Tcol>
          </Trow>
          <Trow>
            <Tcol
              noWrap
              className="text-left"
            >
              <C>EnumType</C>
            </Tcol>
            <Tcol className="text-left">Enum values</Tcol>
            <Tcol><C>role UserRole</C></Tcol>
          </Trow>
        </Table>

        <H2>{_('Optional and Array Types')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20"
        >
          {examples[3]}
        </Code>

        <H2>{_('Nested Types')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20"
        >
          {examples[4]}
        </Code>
      </section>

      <Nav
        prev={{
          text: _('Data Types'),
          href: "/docs/specifications/data-types"
        }}
        next={{
          text: _('Schema Structure'),
          href: "/docs/specifications/schema-structure"
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
