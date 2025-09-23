//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, P, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

const schemaPluginDefinitionExample = [
  `// schema.idea
plugin "./plugins/my-plugin.js" {
  output "./generated/output.ts"
  format "typescript"
  options {
    strict true
    comments true
  }
}`
];

const pluginConfigurationAccessExample = [
  `export default async function myPlugin(props: PluginProps<{}>) {
  const { config } = props;
  
  // Access top-level config
  const output = config.output;
  const format = config.format;
  
  // Access nested options
  const options = config.options || {};
  const strict = options.strict || false;
  const comments = options.comments || false;
  
  // Use configuration in plugin logic
  if (strict) {
    // Enable strict mode
  }
  
  if (comments) {
    // Add comments to generated code
  }
}`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Plugin Configuration');
  const description = _(
    'Plugin configuration enables developers to customize plugin '
    + 'behavior through schema declarations'
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

export function Body() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <section>
        <H1>{_('Plugin Configuration')}</H1>
        <P>
          <Translate>
            Plugin configuration enables developers to customize plugin 
            behavior through schema declarations. This section covers 
            how to define configuration options in schema files, access 
            configuration within plugins, and implement flexible plugin 
            behavior based on user preferences.
          </Translate>
        </P>
      </section>

      <section>
        <H2>{_('3.1. Schema Plugin Definition')}</H2>
        <P>
          <Translate>
            Schema plugin definitions specify how plugins are declared 
            and configured within .idea schema files. This declarative 
            approach allows users to configure multiple plugins with 
            different settings while maintaining clean, readable schema 
            files.
          </Translate>
        </P>

        <Code copy language='idea' className='bg-black text-white'>
          {schemaPluginDefinitionExample[0]}
        </Code>
      </section>

      <section>
        <H2>{_('3.2. Plugin Configuration Access')}</H2>
        <P>
          <Translate>
            Plugin configuration access demonstrates how plugins can 
            read and utilize configuration options provided in schema 
            files. This section shows how to access both simple and 
            nested configuration values, provide defaults, and implement 
            conditional behavior based on configuration settings.
          </Translate>
        </P>

        <Code copy language='typescript' className='bg-black text-white'>
          {pluginConfigurationAccessExample[0]}
        </Code>
      </section>

      <Nav
        prev={{ 
          text: _('Plugin Examples'), 
          href: '/docs/plugin-development/plugin-examples' 
        }}
        next={{ 
          text: _('Error Handling'), 
          href: '/docs/plugin-development/error-handling' 
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
