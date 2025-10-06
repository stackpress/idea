//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const schemaStructureExample =
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
            default: 'nanoid()'
          }
        },
        {
          name: 'email',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            unique: true,
            field: { input: { type: 'email' } }
          }
        },
        {
          name: 'age',
          type: 'Number',
          required: false,
          multiple: false,
          attributes: {
            unsigned: true,
            min: 0,
            max: 150
          }
        }
      ]
    }
  },
  enum: {
    UserRole: {
      ADMIN: 'admin',
      USER: 'user'
    }
  }
}`

//----------------------------------------------------------------------

export default function UnderstandingSchemaStructure() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Understanding Schema Structure Section Content */}
      <section id="understanding-schema">
        <H1>{_('3. Understanding the Schema Structure')}</H1>
        <P>
          <Translate>
            Before creating the plugin, let's understand what a processed
            schema looks like. The schema structure contains models, enums,
            and other configuration data that our plugin will process.
          </Translate>
        </P>
        <H2>{_('Example Schema Structure')}</H2>
        <Code
          copy
          language="typescript"
          className='bg-black text-white p-2'
        >
          {schemaStructureExample}
        </Code>
      </section>
    </>
  );
}