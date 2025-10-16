//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const typeMappingFunction =
  `function mapSchemaTypeToMySQL(column: any): string {
  const { type, attributes = {} } = column;
  
  switch (type) {
    case 'String':
      // Check for specific string constraints
      if (attributes.id) {
        return 'VARCHAR(255)'; // Primary key strings
      }
      if (attributes.email || attributes.url) {
        return 'VARCHAR(255)';
      }
      if (attributes.text || attributes.textarea) {
        return 'TEXT';
      }
      if (attributes.maxLength) {
        return \`VARCHAR(\${attributes.maxLength})\`;
      }
      return 'VARCHAR(255)'; // Default string length
      
    case 'Number':
      if (attributes.unsigned) {
        if (attributes.max && attributes.max <= 255) {
          return 'TINYINT UNSIGNED';
        }
        if (attributes.max && attributes.max <= 65535) {
          return 'SMALLINT UNSIGNED';
        }
        if (attributes.max && attributes.max <= 16777215) {
          return 'MEDIUMINT UNSIGNED';
        }
        return 'INT UNSIGNED';
      }
      if (attributes.float || attributes.decimal) {
        const precision = attributes.precision || 10;
        const scale = attributes.scale || 2;
        return \`DECIMAL(\${precision},\${scale})\`;
      }
      return 'INT';
      
    case 'Boolean':
      return 'BOOLEAN';
      
    case 'Date':
      if (attributes.time) {
        return 'DATETIME';
      }
      if (attributes.timestamp) {
        return 'TIMESTAMP';
      }
      return 'DATE';
      
    case 'JSON':
      return 'JSON';
      
    default:
      // Check if it's an enum type
      if (schema.enum && schema.enum[type]) {
        const enumValues = Object.values(schema.enum[type])
          .map(value => \`'\${value}'\`)
          .join(', ');
        return \`ENUM(\${enumValues})\`;
      }
      
      // Check if it's a foreign key (another model)
      if (schema.model && schema.model[type]) {
        return 'VARCHAR(255)'; // Assuming string-based foreign keys
      }
      
      return 'VARCHAR(255)'; // Default fallback
  }
}`;

//--------------------------------------------------------------------//

export default function ImplementTypeMapping() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Implement Type Mapping */}
      <section id="implement-type-mapping">
        <H1>{_('5. Implement Type Mapping')}</H1>
        <P>
          <Translate>
            Create a function to map schema types to MySQL types. This
            function handles the conversion between idea schema types and
            their corresponding MySQL data types.
          </Translate>
        </P>
        <H2>{_('Type Mapping Function')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {typeMappingFunction}
        </Code>
      </section>
    </>
  );
}