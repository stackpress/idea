//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, Code, H2 } from '../../../docs/components/index.js';

//code examples
//--------------------------------------------------------------------//

const customScalarTypesExample = 
`// In your plugin configuration
customScalars: {
  Email: "String",
  URL: "String", 
  PhoneNumber: "String",
  BigInt: "String"
}`;

//--------------------------------------------------------------------//

const relationshipHandlingExample = 
`function handleRelationships(column: any, models: Record<string, any>): string {
  // Check if the column type is another model
  if (models[column.type]) {
    let type = column.type;
    
    if (column.multiple) {
      type = \`[\${type}]\`;
    }
    
    if (column.required) {
      type += '!';
    }
    
    return type;
  }
  
  return formatFieldType(column);
}`

//--------------------------------------------------------------------//

const directiveSupportExample = 
`function generateDirectives(column: any): string {
  const directives: string[] = [];
  
  if (column.attributes?.unique) {
    directives.push('@unique');
  }
  
  if (column.attributes?.deprecated) {
    directives.push('@deprecated(reason: "Use alternative field")');
  }
  
  return directives.length > 0 ? \` \${directives.join(' ')}\` : '';
}`;

//--------------------------------------------------------------------//

export default function AdvancedFeatures() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Advanced Features Section Content */}
      <section id="advanced-features">
      <H1>{_('7. Advanced Features')}</H1>
      <P>
        <Translate>
          Advanced features extend the basic GraphQL schema generation 
          with sophisticated type handling, relationship management, 
          directive support, and custom scalar types. These features 
          enable production-ready GraphQL schemas that handle complex 
          requirements.
        </Translate>
      </P>

      <H2>{_('Custom Scalar Types')}</H2>
      <P>
        <Translate>
          Custom scalar types allow you to define specialized data 
          types that map to specific validation or formatting requirements. 
          This feature enables the creation of domain-specific types 
          that enhance type safety and API clarity.
        </Translate>
      </P>
      <Code lang="typescript">
        {customScalarTypesExample}
      </Code>

      <H2>{_('Relationship Handling')}</H2>
      <P>
        <Translate>
          Relationship handling manages references between different 
          types and models in your schema. This ensures that type 
          relationships are properly represented in the generated 
          GraphQL schema with correct type references and nullability 
          handling.
        </Translate>
      </P>
      <Code lang="typescript">
        {relationshipHandlingExample}
      </Code>

      <H2>{_('Directive Support')}</H2>
      <P>
        <Translate>
          Directive support enables the addition of GraphQL directives 
          to fields and types, providing metadata and behavior hints 
          for GraphQL servers and tools. This feature enhances schema 
          expressiveness and enables advanced GraphQL features.
        </Translate>
      </P>
      <Code lang="typescript">
        {directiveSupportExample}
      </Code>
      </section>
    </>
  );
}