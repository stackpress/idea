//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const usageExample = `// schema.idea
plugin "./plugins/html-form-plugin.js" {
  output "./forms/user-form.html"
  title "User Registration Form"
  theme "bootstrap"
  layout "vertical"
  includeCSS true
  includeJS true
  submitUrl "/api/users"
  method "POST"
}

model User {
  name String @label("Full Name") @field.input(Text) @is.required @is.minLength(2) @is.maxLength(50)
  email String @label("Email Address") @field.input(Email) @is.required @is.email
  age Number @label("Age") @field.number @is.min(18) @is.max(100)
  role UserRole @label("User Role") @field.select @default("USER")
  bio String @label("Biography") @field.textarea @is.maxLength(500)
  active Boolean @label("Active Account") @field.checkbox @default(true)
  created Date @label("Registration Date") @field.date @default("now()")
}

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
  GUEST "Guest User"
}`

//----------------------------------------------------------------------

export default function UsageInSchema() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <>
      {/* Usage in Schema Section Content */}
      <section id="usage-in-schema">
      <H1>{_('8. Usage in Schema')}</H1>
      <P>
        <Translate>
          This section demonstrates how to configure and use the HTML 
          Form Plugin within your
        </Translate> <C>.idea</C> <Translate>
          schema files. You'll learn about the available configuration 
          options and how to set up your schema to generate the desired 
          form output.
        </Translate>
      </P>
      <P>
        <Translate>
          To use this plugin in your schema file:
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {usageExample}
      </Code>
      </section>
    </>
  );
}