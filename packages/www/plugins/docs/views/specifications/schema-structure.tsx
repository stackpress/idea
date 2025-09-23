//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

const schemaExample = `// 1. Plugin declarations
plugin "./plugins/generate-types.js" {
  output "./generated/types.ts"
}

plugin "./plugins/generate-database.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

// 2. Use statements (imports)
use "./shared/common-types.idea"
use "./auth/user-types.idea"

// 3. Prop definitions
prop Email {
  type "email"
  validation { required true }
}

prop Text {
  type "text"
  validation { maxLength 255 }
}

// 4. Enum definitions
enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
}

// 5. Type definitions
type Address {
  street String @required
  city String @required
  country String @default("US")
}

// 6. Model definitions
model User! {
  id String @id @default("nanoid()")
  email String @unique @field.input(Email)
  name String @field.input(Text)
  role UserRole @default("USER")
  address Address?
  active Boolean @default(true)
  created Date @default("now()")
}`;

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Schema Structure');
  const description = _(
    'A complete .idea schema file can contain multiple elements ' +
    'organized in a specific structure.'
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
  const { _ } = useLanguage();
  
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <section>
        <H1>{_('Schema Structure')}</H1>
        <P>
          <Translate>
            A complete <C>.idea</C> schema file can contain multiple
            elements organized in a specific structure:
          </Translate>
        </P>
      </section>

      <section>
        <Code 
          copy 
          language="javascript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {schemaExample}
        </Code>
      </section>

      <footer>
        <Nav
          prev={{ 
            text: _('Schema Elements'), 
            href: '/docs/specifications/schema-elements' 
          }}
          next={{ 
            text: _('Schema Directives'), 
            href: '/docs/specifications/schema-directives' 
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
