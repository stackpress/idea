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
//-----------------------------------------------------------------

const typeSafetyExample =
  `import type { SchemaConfig, ModelConfig } from '@stackpress/idea-parser';

const schema: SchemaConfig = parse(code);`;

//-----------------------------------------------------------------

const errorHandlingExample =
  `import { parse, Exception } from '@stackpress/idea-parser';

try {
  const result = parse(schemaCode);
  // Process result
} catch (error) {
  if (error instanceof Exception) {
    console.error('Schema parsing failed:', error.message);
    // Handle parsing error
  } else {
    console.error('Unexpected error:', error);
    // Handle other errors
  }
}`;

//-----------------------------------------------------------------

const schemaStructureExample =
  `// Good: Proper model structure
model User {
  id String @id
  name String
}

// Bad: Missing required properties
model User {
  // Missing columns - will throw error
}`;

//-----------------------------------------------------------------

const namingExample =
  `// Good
enum UserStatus { ACTIVE "Active" SUSPENDED "Suspended" }
prop EmailInput { type "email" format "email" }

// Less clear
enum Status { A "Active" S "Suspended" }
prop Input { type "email" }`;

//-----------------------------------------------------------------

const errorExamples = {
  invalidSchema: 'Error: "Invalid Schema"',
  missingColumns: 'Error: "Expecting a columns property"',
  duplicateName: 'Error: "Duplicate [name]"',
  unknownReference: 'Error: "Unknown reference [name]"'
};

//-----------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Best Practices');
  const description = _(
    'Best practices and guidelines for using the Idea Parser ' +
    'library effectively, including error handling, type safety, ' +
    'and common pitfalls to avoid.'
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
      <link
        rel="stylesheet"
        type="text/css"
        href="/styles/global.css"
      />
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
    <main className="overflow-auto px-h-100-0 px-p-10">
      <H1>{_('Best Practices')}</H1>
      <P>
        <Translate>
          Follow these best practices to use the parser library
          effectively and avoid common pitfalls.
        </Translate>
      </P>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Type Safety Section Content */}
      <section>
        <H2>{_('1. Use Type Safety')}</H2>
        <P>
          <Translate>
            The library is built with TypeScript and provides
            comprehensive type definitions
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {typeSafetyExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Error Handling Section Content */}
      <section>
        <H2>{_('2. Handle Errors Gracefully')}</H2>
        <P>
          <Translate>
            Always wrap parsing operations in try-catch blocks
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {errorHandlingExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Choose the Right Function Section Content */}
      <section>
        <H2>{_('3. Choose the Right Function')}</H2>
        <li className="my-2">
          <C>Use parse()</C>
          <Translate>
            when you need to preserve references for further processing
          </Translate>
        </li>
        <li className="my-2">
          <C>Use final()</C>
          <Translate>
            when you want a clean output for final consumption
          </Translate>
        </li>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Validate Schema Structure Section Content */}
      <section>
        <H2>{_('4. Validate Schema Structure')}</H2>
        <P>
          <Translate>
            Ensure your schema follows the expected structure:
          </Translate>
        </P>
        <Code copy language="idea" className="bg-black text-white">
          {schemaStructureExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Use Meaningful Names Section Content */}
      <section>
        <H2>{_('5. Use Meaningful Names')}</H2>
        <P>
          <Translate>
            Choose descriptive names for your schema elements:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {namingExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Error Examples Section Content */}
      <section>
        <H1>{_('Error Handling')}</H1>
        <P>
          <Translate>Common errors and their solutions:</Translate>
        </P>

        <H2>{_('Invalid Schema Structure')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {errorExamples.invalidSchema}
        </Code>
        <li className="my-2 list-none">
          <SS>Solution: </SS>
          <Translate>
            Ensure your schema follows the correct syntax and structure.
          </Translate>
        </li>

        <H2>{_('Missing Required Properties')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {errorExamples.missingColumns}
        </Code>
        <li className="my-2 list-none">
          <SS>Solution: </SS>
          <Translate>
            Models and types must have a columns definition.
          </Translate>
        </li>

        <H2>{_('Duplicate Declarations')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {errorExamples.duplicateName}
        </Code>
        <li className="my-2 list-none">
          <SS>Solution: </SS>
          <Translate>
            Each declaration name must be unique within the schema.
          </Translate>
        </li>

        <H2>{_('Unknown References')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black text-white"
        >
          {errorExamples.unknownReference}
        </Code>
        <li className="my-2 list-none">
          <SS>Solution: </SS>
          <Translate>
            Ensure all referenced props and types are defined before use.
          </Translate>
        </li>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Examples'),
          href: "/docs/parser/examples"
        }}
        next={{
          text: _('Transformers'),
          href: "/docs/transformers/introduction"
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
