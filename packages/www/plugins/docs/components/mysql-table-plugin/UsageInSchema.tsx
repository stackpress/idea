//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const schemaUsageExample =
  `// schema.idea
plugin "./plugins/mysql-tables-plugin.js" {
  output "./database/tables.sql"
  database "my_app"
  engine "InnoDB"
  charset "utf8mb4"
  collation "utf8mb4_unicode_ci"
}

model User {
  id String @id @default("nanoid()")
  email String @unique @field.input(Email)
  name String @field.input(Text)
  age Number @unsigned @min(0) @max(150)
  role UserRole @default("USER")
  active Boolean @default(true)
  created Date @default("now()")
  updated Date @default("updated()")
}

enum UserRole {
  ADMIN "admin"
  USER "user"
}`;

//--------------------------------------------------------------------//

export default function UsageInSchema() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Usage In Schema Section Content */}
      <section id="usage-in-schema">
        <H1>{_('7. Usage in Schema')}</H1>
        <P>
          <Translate>
            To use this plugin in your schema file, add the plugin
            declaration with appropriate configuration options.
          </Translate>
        </P>
        <H2>{_('Schema Configuration')}</H2>
        <Code
          copy
          language="idea"
          className="bg-black text-white"
        >
          {schemaUsageExample}
        </Code>
      </section>
    </>
  );
}