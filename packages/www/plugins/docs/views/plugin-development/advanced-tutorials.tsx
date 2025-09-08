//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Advanced Tutorials');
  const description = _(
    'Advanced plugin development topics for developers who need to create sophisticated code generation tools'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/idea-logo-icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/idea-logo-icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export function Right() {
  const { _ } = useLanguage();
  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('Advanced Tutorials')}
      </h6>
      <nav className="px-m-14 px-lh-32">
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/graphql-schema-plugin-tutorial">
          {_('GraphQL Schema Plugin Tutorial')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/typescript-interface-plugin-tutorial">
          {_('TypeScript Interface Plugin Tutorial')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/api-client-plugin-tutorial">
          {_('API Client Plugin Tutorial')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/validation-plugin-tutorial">
          {_('Validation Plugin Tutorial')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/test-data-plugin-tutorial">
          {_('Test Data Plugin Tutorial')}
        </a>
        <a className="text-blue-500 block cursor-pointer underline" href="/docs/tutorials/openapi-specification-plugin-tutorial">
          {_('OpenAPI Specification Plugin Tutorial')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Advanced Tutorials</H1>
      <P>
        This section covers advanced plugin development topics for developers who need to create sophisticated code generation tools. These tutorials demonstrate complex patterns and integration techniques for building enterprise-grade plugins.
      </P>

      <H2>7.1. API Development Plugins</H2>

      <H3>7.1.1. GraphQL Schema Plugin</H3>
      <P>
        The <a href="/docs/tutorials/graphql-schema-plugin-tutorial" className="text-blue-500 underline">GraphQL Schema Plugin</a> tutorial teaches you how to create a plugin that generates GraphQL type definitions and schemas from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Generate GraphQL type definitions from models and types</li>
        <li className="my-2">Create queries, mutations, and subscriptions</li>
        <li className="my-2">Support for custom scalars and directives</li>
        <li className="my-2">Handle relationships and nested types</li>
        <li className="my-2">Generate complete GraphQL schema files</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> GraphQL schema files with type definitions, queries, and mutations
      </P>

      <H3>7.1.2. TypeScript Interface Plugin</H3>
      <P>
        The <a href="/docs/tutorials/typescript-interface-plugin-tutorial" className="text-blue-500 underline">TypeScript Interface Plugin</a> tutorial demonstrates how to create a plugin that generates TypeScript interfaces and types from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Generate TypeScript interfaces from models and types</li>
        <li className="my-2">Create enums and utility types</li>
        <li className="my-2">Support for namespaces and modules</li>
        <li className="my-2">Handle optional and array types</li>
        <li className="my-2">Generate comprehensive type definitions</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> TypeScript definition files with interfaces, types, and enums
      </P>

      <H3>7.1.3. API Client Plugin</H3>
      <P>
        The <a href="/docs/tutorials/api-client-plugin-tutorial" className="text-blue-500 underline">API Client Plugin</a> tutorial shows how to create a plugin that generates API client libraries from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Generate REST and GraphQL API clients</li>
        <li className="my-2">Support multiple authentication strategies</li>
        <li className="my-2">Create type-safe client methods</li>
        <li className="my-2">Handle request/response transformations</li>
        <li className="my-2">Generate both JavaScript and TypeScript clients</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> Complete API client libraries with methods and types
      </P>

      <H2>7.2. Validation and Testing Plugins</H2>
      <P>
        Validation and testing plugins help ensure data quality and application reliability by generating validation schemas and test data. These plugins are essential for building robust applications that can handle edge cases and maintain data integrity across different environments.
      </P>

      <H3>7.2.1. Validation Plugin</H3>
      <P>
        The <a href="/docs/tutorials/validation-plugin-tutorial" className="text-blue-500 underline">Validation Plugin</a> tutorial teaches you how to create a plugin that generates Zod validation schemas from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Generate Zod schemas from models and types</li>
        <li className="my-2">Create custom validators and transformations</li>
        <li className="my-2">Handle complex validation rules</li>
        <li className="my-2">Support for nested object validation</li>
        <li className="my-2">Generate comprehensive validation suites</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> Zod validation schemas with custom validators
      </P>

      <H3>7.2.2. Test Data Plugin</H3>
      <P>
        The <a href="/docs/tutorials/test-data-plugin-tutorial" className="text-blue-500 underline">Test Data Plugin</a> tutorial demonstrates how to create a plugin that generates realistic test data and fixtures from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Generate realistic mock data using Faker.js</li>
        <li className="my-2">Create factory functions for dynamic data generation</li>
        <li className="my-2">Support for relationships and constraints</li>
        <li className="my-2">Generate test fixtures and seed data</li>
        <li className="my-2">Handle localization and custom generators</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> Test data files, factories, and fixtures in multiple formats
      </P>

      <H2>7.3. Documentation and Specification Plugins</H2>
      <P>
        The <a href="/docs/tutorials/openapi-specification-plugin-tutorial" className="text-blue-500 underline">OpenAPI Specification Plugin</a> tutorial shows how to create a plugin that generates OpenAPI 3.0 specifications from your schema.
      </P>

      <H3>What you'll learn:</H3>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Generate OpenAPI 3.0 compliant specifications</li>
        <li className="my-2">Create schemas and CRUD endpoints automatically</li>
        <li className="my-2">Support multiple authentication schemes</li>
        <li className="my-2">Generate multiple output formats (JSON, YAML, HTML)</li>
        <li className="my-2">Include validation rules and examples</li>
      </ul>

      <P>
        <strong>Generated Output:</strong> Complete OpenAPI specifications with interactive documentation
      </P>

      <Nav
        prev={{ text: 'Available Tutorials', href: '/docs/plugin-development/available-tutorials' }}
        next={{ text: 'Getting Started', href: '/docs/plugin-development/getting-started' }}
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
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}
  