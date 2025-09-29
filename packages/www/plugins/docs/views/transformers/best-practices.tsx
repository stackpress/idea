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
  const title = _('Best Practices');
  const description = _(
    'Best practices for maintainable, scalable, and reliable schema ' +
    'processing workflows'
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
      {/* Best Practices Section Content */}
      <section>
        <H1>{_('Best Practices')}</H1>
        <P>
          <Translate>
            Following best practices ensures maintainable, scalable, and
            reliable schema processing workflows. These guidelines help you
            avoid common pitfalls and optimize your development experience.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Schema Organization Section Content */}
      <section>
        <H1>{_('Schema Organization')}</H1>
        <P>
          <Translate>
            Organize your schemas for maintainability and clarity to support
            team collaboration and long-term project success. Proper
            organization makes schemas easier to understand and modify.
          </Translate>
        </P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            {_('Use ')} <C>{_('use')}</C>
            {_(' directives to split large schemas into manageable files')}
          </li>
          <li className="my-2">
            {_('Organize shared types and enums in separate files')}
          </li>
          <li className="my-2">
            {_('Follow consistent naming conventions across schemas')}
          </li>
          <li className="my-2">
            {_('Document complex relationships and business rules')}
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Plugin Development Section Content */}
      <section>
        <H1>{_('Plugin Development')}</H1>
        <P>
          <Translate>
            Follow these guidelines when developing plugins to ensure
            reliability, maintainability, and type safety. Good plugin
            development practices lead to more robust code generation.
          </Translate>
        </P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            {_('Always validate plugin configuration')}
          </li>
          <li className="my-2">
            {_('Use TypeScript for type safety')}
          </li>
          <li className="my-2">
            {_('Handle errors gracefully with meaningful messages')}
          </li>
          <li className="my-2">
            {_('Use the transformer\'s file loader for consistent path ' +
              'resolution')}
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Build Integration Section Content */}
      <section>
        <H1>{_('Build Integration')}</H1>
        <P>
          <Translate>
            Integrate schema processing effectively into your workflow to
            maximize productivity and maintain consistency across environments.
            Proper build integration ensures reliable code generation.
          </Translate>
        </P>

        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            {_('Add schema generation to your build process')}
          </li>
          <li className="my-2">
            {_('Use watch mode during development')}
          </li>
          <li className="my-2">
            {_('Version control generated files when appropriate')}
          </li>
          <li className="my-2">
            {_('Document the generation process for team members')}
          </li>
        </ul>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Error Handling'),
          href: '/docs/transformers/error-handling'
        }}
        next={{
          text: _('Plugin Development'),
          href: '/docs/plugin-development/plugin-development-guide'
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