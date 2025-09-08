//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, P, C, Nav, SS } from '../../components/index.js';
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
    'Best practices for using the parser library effectively'
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

const typeSafetyExamples = [
  `import type { SchemaConfig, ModelConfig } from '@stackpress/idea-parser';

const schema: SchemaConfig = parse(code);
`
];

const errorHandlingExamples = [
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
}`
];

const schemaStructureExamples = [
  `// Good: Proper model structure
model User {
  id String @id
  name String
}

// Bad: Missing required properties
model User {
  // Missing columns - will throw error
}`
];

const namingExamples = [
  `// Good
enum UserStatus { ACTIVE "Active" SUSPENDED "Suspended" }
prop EmailInput { type "email" format "email" }

// Less clear
enum Status { A "Active" S "Suspended" }
prop Input { type "email" }`
];

const errorSolutionsExamples = [
  `Error: "Invalid Schema"`,
  `Error: "Expecting a columns property"`,
  `Error: "Duplicate [name]"`,
  `Error: "Unknown reference [name]"`
];

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Best Practices</H1>
      <P>
        Follow these best practices to use the parser library effectively and avoid common pitfalls.
      </P>

      <H2>1. Use Type Safety</H2>
      <P>
        The library is built with TypeScript and provides comprehensive type definitions:
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {typeSafetyExamples[0]}
      </Code>

      <H2>2. Handle Errors Gracefully</H2>
      <P>
        Always wrap parsing operations in try-catch blocks:
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {errorHandlingExamples[0]}
      </Code>

      <H2>3. Choose the Right Function</H2>
      <li className='my-2'><C>Use parse()</C> when you need to preserve references for further processing</li>
      <li className='my-2'><C>Use final()</C> when you want a clean output for final consumption</li>

      <H2>4. Validate Schema Structure</H2>
      <P>
        Ensure your schema follows the expected structure:
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {schemaStructureExamples[0]}
      </Code>

      <H2>5. Use Meaningful Names</H2>
      <P>
        Choose descriptive names for your schema elements:
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {namingExamples[0]}
      </Code>

      <H2>Error Handling</H2>
      <P>
        Common errors and their solutions:
      </P>

      <H2>Invalid Schema Structure</H2>
      <Code copy language='
      javascript' className='bg-black text-white'>
        {errorSolutionsExamples[0]}
      </Code>
      <li className='my-2 list-none'><SS>Solution:</SS> Ensure your schema follows the correct syntax and structure.</li>

      <H2>Missing Required Properties</H2>
      <Code copy language='javascript' className='bg-black text-white'>
        {errorSolutionsExamples[1]}
      </Code>
      <li className='my-2 list-none'><SS>Solution:</SS> Models and types must have a columns definition.</li>

      <H2>Duplicate Declarations</H2>
      <Code copy language='javascript' className='bg-black text-white'>
        {errorSolutionsExamples[2]}
      </Code>
      <li className='my-2 list-none'><SS>Solution:</SS> Each declaration name must be unique within the schema.</li>

      <H2>Unknown References</H2>
      <Code copy language='javascript' className='bg-black text-white'>
        {errorSolutionsExamples[3]}
      </Code>
      <li className='my-2 list-none'><SS>Solution:</SS> Ensure all referenced props and types are defined before use.</li>

      <Nav
        prev={{ text: 'Examples', href: '/docs/parser/examples' }}
        next={{ text: 'Transformers', href: '/docs/parser/transformers' }}
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
