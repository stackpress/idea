//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const schemaExample =
  `// Example processed schema
{
  model: {
    User: {
      mutable: false,
      columns: [
        {
          name: 'name',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            field: { input: { type: 'text', placeholder: 'Enter your name' } },
            label: 'Full Name',
            is: { required: true, minLength: 2, maxLength: 50 }
          }
        },
        {
          name: 'email',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            field: { input: { type: 'email' } },
            label: 'Email Address',
            is: { required: true, email: true }
          }
        },
        {
          name: 'age',
          type: 'Number',
          required: false,
          multiple: false,
          attributes: {
            field: { number: { min: 18, max: 100 } },
            label: 'Age',
            is: { min: 18, max: 100 }
          }
        },
        {
          name: 'role',
          type: 'UserRole',
          required: true,
          multiple: false,
          attributes: {
            field: { select: true },
            label: 'User Role',
            default: 'USER'
          }
        }
      ]
    }
  },
  enum: {
    UserRole: {
      ADMIN: 'Administrator',
      USER: 'Regular User',
      GUEST: 'Guest User'
    }
  }
}`;

//--------------------------------------------------------------------//

export default function UnderstandingSchemaStructure() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <>
      {/* Understanding the Schema Structure Section Content */}
      <section id="understanding-the-schema-structure">
        <H1>{_('3. Understanding the Schema Structure')}</H1>
        <P>
          <Translate>
            Understanding how schema attributes map to form elements is
            crucial for creating effective form generation. This section
            explains the processed schema structure and how different
            field types and attributes translate into HTML form elements.
          </Translate>
        </P>
        <P>
          <Translate>
            Before creating the plugin, let's understand how schema
            attributes map to form elements:
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {schemaExample}
        </Code>
      </section>
    </>
  );
}