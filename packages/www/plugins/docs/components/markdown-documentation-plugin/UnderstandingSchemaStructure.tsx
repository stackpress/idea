//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const exampleProcessedSchema = 
`// Example processed schema
{
  model: {
    User: {
      mutable: false,
      columns: [
        {
          name: 'id',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            id: true,
            label: 'User ID',
            default: 'nanoid()',
            description: 'Unique identifier for the user'
          }
        },
        {
          name: 'email',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            unique: true,
            label: 'Email Address',
            field: { input: { type: 'email' } },
            description: 'User email address for authentication'
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
  },
  type: {
    Address: {
      mutable: true,
      columns: [
        {
          name: 'street',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            label: 'Street Address'
          }
        }
      ]
    }
  },
  prop: {
    Text: {
      type: 'text',
      placeholder: 'Enter text',
      maxLength: 255
    }
  }
}`

//----------------------------------------------------------------------

export default function UnderstandingSchemaStructure() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Understanding the Schema Structure Section Content */}
      <section id="understanding-schema">
      <H1>{_('3. Understanding the Schema Structure')}</H1>
      <P>
        <Translate>
          Before creating the plugin, let's understand what documentation
          we can generate from a schema:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {exampleProcessedSchema}
      </Code>
      </section>
    </>
  )
}