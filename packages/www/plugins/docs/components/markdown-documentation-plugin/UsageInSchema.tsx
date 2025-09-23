import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';
import Code from '../Code.js';

const schemaUsageExample = `// schema.idea
plugin "./plugins/markdown-docs-plugin.js" {
  output "./docs/schema.md"
  title "My Application Schema"
  format "single"
  includeIndex true
  includeExamples true
  includeAttributes true
  sections ["models", "types", "enums", "props"]
  template "api"
}

model User! {
  id String @id @default("nanoid()") @description("User ID")
  email String @unique @field.input(Email) @description("Email")
  name String @field.input(Text) @description("Full name")
  role UserRole @default("USER") @description("User's role")
  active Boolean @default(true) @description("Active status")
  created Date @default("now()") @description("Creation date")
}

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
  GUEST "Guest User"
}`;

export default function UsageInSchema() {
  const { _ } = useLanguage();

  return (
    <section id="usage-in-schema">
      <H2>{_('Usage in Schema')}</H2>
      <P>
        <Translate>
          To use this plugin in your schema file:
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {schemaUsageExample}
      </Code>
    </section>
  )
}