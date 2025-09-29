//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, H3, P, SS, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Advanced Tutorials');
  const description = _(
    'Advanced plugin development topics for developers who need to '
    + 'create sophisticated code generation tools'
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
  //hooks
  const { _ } = useLanguage();

  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('Advanced Tutorials')}
      </h6>
      <nav className="px-m-14 px-lh-28 flex flex-col">
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/graphql-schema-plugin-tutorial"
        >
          {_('1. GraphQL Schema Plugin Tutorial')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/typescript-interface-plugin-tutorial"
        >
          {_('2. TypeScript Interface Plugin Tutorial')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/api-client-plugin-tutorial"
        >
          {_('3. API Client Plugin Tutorial')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/validation-plugin-tutorial"
        >
          {_('4. Validation Plugin Tutorial')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/test-data-plugin-tutorial"
        >
          {_('5. Test Data Plugin Tutorial')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/tutorials/openapi-specification-plugin-tutorial"
        >
          {_('6. OpenAPI Specification Plugin Tutorial')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      {/* Advanced Tutorials Section Content */}  
      <section>
        <H1>{_('Advanced Tutorials')}</H1>
        <P>
          <Translate>
            This section covers advanced plugin development topics for
            developers who need to create sophisticated code generation
            tools. These tutorials demonstrate complex patterns and
            integration techniques for building enterprise-grade plugins.
          </Translate>
        </P>
      </section>

      {/* API Development Plugins Section */}
      <section>
        <H2>{_('7.1. API Development Plugins')}</H2>

        <H3>{_('7.1.1. GraphQL Schema Plugin')}</H3>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/graphql-schema-plugin-tutorial"
              className="text-blue-500 underline"
            >
              GraphQL Schema Plugin
            </a> tutorial teaches you how to create a plugin that
            generates GraphQL type definitions and schemas from your
            schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Generate GraphQL type definitions from models and types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create queries, mutations, and subscriptions
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support for custom scalars and directives
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Handle relationships and nested types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate complete GraphQL schema files
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> GraphQL schema files with
            type definitions, queries, and mutations
          </Translate>
        </P>

        <H3>{_('7.1.2. TypeScript Interface Plugin')}</H3>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/typescript-interface-plugin-tutorial"
              className="text-blue-500 underline"
            >
              TypeScript Interface Plugin
            </a> tutorial demonstrates how to create a plugin that
            generates TypeScript interfaces and types from your schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Generate TypeScript interfaces from models and types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create enums and utility types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support for namespaces and modules
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Handle optional and array types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate comprehensive type definitions
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> TypeScript definition files
            with interfaces, types, and enums
          </Translate>
        </P>

        <H3>{_('7.1.3. API Client Plugin')}</H3>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/api-client-plugin-tutorial"
              className="text-blue-500 underline"
            >
              API Client Plugin
            </a> tutorial shows how to create a plugin that generates
            API client libraries from your schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Generate REST and GraphQL API clients
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support multiple authentication strategies
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create type-safe client methods
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Handle request/response transformations
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate both JavaScript and TypeScript clients
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> Complete API client
            libraries with methods and types
          </Translate>
        </P>
      </section>

      {/* Validation and Testing Plugins Section */}
      <section>
        <H2>{_('7.2. Validation and Testing Plugins')}</H2>
        <P>
          <Translate>
            Validation and testing plugins help ensure data quality and
            application reliability by generating validation schemas and
            test data. These plugins are essential for building robust
            applications that can handle edge cases and maintain data
            integrity across different environments.
          </Translate>
        </P>

        <H3>{_('7.2.1. Validation Plugin')}</H3>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/validation-plugin-tutorial"
              className="text-blue-500 underline"
            >
              Validation Plugin
            </a> tutorial teaches you how to create a plugin that
            generates Zod validation schemas from your schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Generate Zod schemas from models and types
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create custom validators and transformations
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Handle complex validation rules
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support for nested object validation
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate comprehensive validation suites
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> Zod validation schemas with
            custom validators
          </Translate>
        </P>

        <H3>{_('7.2.2. Test Data Plugin')}</H3>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/test-data-plugin-tutorial"
              className="text-blue-500 underline"
            >
              Test Data Plugin
            </a> tutorial demonstrates how to create a plugin that
            generates realistic test data and fixtures from your schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Generate realistic mock data using Faker.js
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create factory functions for dynamic data generation
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support for relationships and constraints
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate test fixtures and seed data
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Handle localization and custom generators
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> Test data files, factories,
            and fixtures in multiple formats
          </Translate>
        </P>
      </section>

      {/* Documentation and Specification Plugins Section */}
      <section>
        <H2>{_('7.3. Documentation and Specification Plugins')}</H2>
        <P>
          <Translate>
            The <a
              href="/docs/tutorials/openapi-specification-plugin-tutorial"
              className="text-blue-500 underline"
            >
              OpenAPI Specification Plugin
            </a> tutorial shows how to create a plugin that generates
            OpenAPI 3.0 specifications from your schema.
          </Translate>
        </P>

        <H3>{_("What you'll learn:")}</H3>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Generate OpenAPI 3.0 compliant specifications
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Create schemas and CRUD endpoints automatically
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Support multiple authentication schemes
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate multiple output formats (JSON, YAML, HTML)
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Include validation rules and examples
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            <SS>Generated Output:</SS> Complete OpenAPI
            specifications with interactive documentation
          </Translate>
        </P>
      </section>

      {/* Page Navigation */}
      <Nav  
        prev={{
          text: _('Available Tutorials'),
          href: '/docs/plugin-development/available-tutorials'
        }}
        next={{
          text: _('Getting Started'),
          href: '/docs/plugin-development/getting-started'
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
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}
