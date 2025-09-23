//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, P, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Common Use Cases');
  const description = _(
    'Various use cases for code generation and schema processing with ' +
    'the idea-transformer library'
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
  //hooks
  const { _ } = useLanguage();
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>{_('Common Use Cases')}</H1>
      <P>
        <Translate>
          The idea-transformer library supports a wide variety of use cases
          for code generation and schema processing. These use cases
          demonstrate the flexibility and power of the transformation system.
        </Translate>
      </P>

      <H2>{_('Code Generation')}</H2>
      <P>
        <Translate>
          Generate various code artifacts from your schema definitions to
          maintain consistency across your application. This use case covers
          the most common code generation scenarios.
        </Translate>
      </P>
      <section>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            {_('Generate TypeScript interfaces from schema models')}
          </li>
          <li className="my-2">
            {_('Create enum definitions from schema enums')}
          </li>
          <li className="my-2">
            {_('Build API client libraries from schema definitions')}
          </li>
          <li className="my-2">
            {_('Generate database migration files')}
          </li>
        </ul>
      </section>

      <H2>{_('Documentation')}</H2>
      <P>
        <Translate>
          Create comprehensive documentation from your schemas to improve
          developer experience and API usability. This use case focuses on
          generating human-readable documentation.
        </Translate>
      </P>
      <section>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            {_('Create API documentation from schema')}
          </li>
          <li className="my-2">
            {_('Generate schema reference guides')}
          </li>
          <li className="my-2">
            {_('Build interactive schema explorers')}
          </li>
          <li className="my-2">
            {_('Create validation rule documentation')}
          </li>
        </ul>
      </section>

      <H2>{_('Validation')}</H2>
      <P>
        <Translate>
          Build validation systems from your schema definitions to ensure
          data integrity across your application. This use case covers
          various validation library integrations.
        </Translate>
      </P>
      <section>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            {_('Generate validation schemas (')}
            <C>{_('Joi')}</C>{_(', ')}
            <C>{_('Yup')}</C>{_(', ')}
            <C>{_('Zod')}</C>{_(')')}
          </li>
          <li className="my-2">
            {_('Create form validation rules')}
          </li>
          <li className="my-2">
            {_('Build API request/response validators')}
          </li>
          <li className="my-2">
            {_('Generate test fixtures and mock data')}
          </li>
        </ul>
      </section>

      <H2>{_('Build Integration')}</H2>
      <P>
        <Translate>
          Integrate schema processing into your build pipeline for automated
          code generation and consistent development workflows. This use case
          covers various build system integrations.
        </Translate>
      </P>
      <section>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            {_('Integrate with webpack, rollup, or other bundlers')}
          </li>
          <li className="my-2">
            {_('Add to npm scripts for automated generation')}
          </li>
          <li className="my-2">
            {_('Use in CI/CD pipelines for consistent builds')}
          </li>
          <li className="my-2">
            {_('Create watch mode for development workflows')}
          </li>
        </ul>
      </section>

      <footer>
        <Nav
          prev={{
            text: _('Usage Patterns'),
            href: '/docs/transformers/usage-patterns'
          }}
          next={{
            text: _('Examples'),
            href: '/docs/transformers/examples'
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