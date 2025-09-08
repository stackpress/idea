//modules
import type {
    ServerConfigProps,
    ServerPageProps
  } from 'stackpress/view/client';
  import { useLanguage } from 'stackpress/view/client';
  //docs
  import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
  import Code from '../../components/Code.js';
  import Layout from '../../components/Layout.js';
  
  export function Head(props: ServerPageProps<ServerConfigProps>) {
    //props
    const { request, styles = [] } = props;
    //hooks
    const { _ } = useLanguage();
    //variables
    const title = _('Common Use Cases');
    const description = _(
      'Various use cases for code generation and schema processing with the idea-transformer library'
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
  
  export function Body() {
    return (
      <main className="px-h-100-0 overflow-auto px-p-10">
        <H1>Common Use Cases</H1>
        <P>
          The idea-transformer library supports a wide variety of use cases for code generation and schema processing. These use cases demonstrate the flexibility and power of the transformation system.
        </P>

        <H2>Code Generation</H2>
        <P>
          Generate various code artifacts from your schema definitions to maintain consistency across your application. This use case covers the most common code generation scenarios.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Generate TypeScript interfaces from schema models</li>
          <li className="my-2">Create enum definitions from schema enums</li>
          <li className="my-2">Build API client libraries from schema definitions</li>
          <li className="my-2">Generate database migration files</li>
        </ul>

        <H2>Documentation</H2>
        <P>
          Create comprehensive documentation from your schemas to improve developer experience and API usability. This use case focuses on generating human-readable documentation.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Create API documentation from schema</li>
          <li className="my-2">Generate schema reference guides</li>
          <li className="my-2">Build interactive schema explorers</li>
          <li className="my-2">Create validation rule documentation</li>
        </ul>

        <H2>Validation</H2>
        <P>
          Build validation systems from your schema definitions to ensure data integrity across your application. This use case covers various validation library integrations.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Generate validation schemas (<C>Joi</C>, <C>Yup</C>, <C>Zod</C>)</li>
          <li className="my-2">Create form validation rules</li>
          <li className="my-2">Build API request/response validators</li>
          <li className="my-2">Generate test fixtures and mock data</li>
        </ul>

        <H2>Build Integration</H2>
        <P>
          Integrate schema processing into your build pipeline for automated code generation and consistent development workflows. This use case covers various build system integrations.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Integrate with webpack, rollup, or other bundlers</li>
          <li className="my-2">Add to npm scripts for automated generation</li>
          <li className="my-2">Use in CI/CD pipelines for consistent builds</li>
          <li className="my-2">Create watch mode for development workflows</li>
        </ul>

        <Nav
          prev={{ text: 'Usage Patterns', href: '/docs/transformers/usage-patterns' }}
          next={{ text: 'Examples', href: '/docs/transformers/examples' }}
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
  