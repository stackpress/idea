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
    const title = _('Best Practices');
    const description = _(
      'Best practices for maintainable, scalable, and reliable schema processing workflows'
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
        <H1>Best Practices</H1>
        <P>
          Following best practices ensures maintainable, scalable, and reliable schema processing workflows. These guidelines help you avoid common pitfalls and optimize your development experience.
        </P>

        <H2>Schema Organization</H2>
        <P>
          Organize your schemas for maintainability and clarity to support team collaboration and long-term project success. Proper organization makes schemas easier to understand and modify.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Use <C>use</C> directives to split large schemas into manageable files</li>
          <li className="my-2">Organize shared types and enums in separate files</li>
          <li className="my-2">Follow consistent naming conventions across schemas</li>
          <li className="my-2">Document complex relationships and business rules</li>
        </ul>

        <H2>Plugin Development</H2>
        <P>
          Follow these guidelines when developing plugins to ensure reliability, maintainability, and type safety. Good plugin development practices lead to more robust code generation.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Always validate plugin configuration</li>
          <li className="my-2">Use TypeScript for type safety</li>
          <li className="my-2">Handle errors gracefully with meaningful messages</li>
          <li className="my-2">Use the transformer's file loader for consistent path resolution</li>
        </ul>

        <H2>Build Integration</H2>
        <P>
          Integrate schema processing effectively into your workflow to maximize productivity and maintain consistency across environments. Proper build integration ensures reliable code generation.
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Add schema generation to your build process</li>
          <li className="my-2">Use watch mode during development</li>
          <li className="my-2">Version control generated files when appropriate</li>
          <li className="my-2">Document the generation process for team members</li>
        </ul>

        <Nav
          prev={{ text: 'Error Handling', href: '/docs/transformers/error-handling' }}
          next={{ text: 'Plugin Development', href: '/docs/plugin/introduction' }}
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
  