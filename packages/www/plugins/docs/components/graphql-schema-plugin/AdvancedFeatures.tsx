import { useLanguage, Translate } from 'r22n';
import { H2, H3, P, Code } from '../index.js';

const customScalarTypesExample = `// In your plugin configuration
customScalars: {
  Email: "String",
  URL: "String", 
  PhoneNumber: "String",
  BigInt: "String"
}`;

const relationshipHandlingExample = `function handleRelationships(column: any, models: Record<string, any>): string {
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
}`;

const directiveSupportExample = `function generateDirectives(column: any): string {
  const directives: string[] = [];
  
  if (column.attributes?.unique) {
    directives.push('@unique');
  }
  
  if (column.attributes?.deprecated) {
    directives.push('@deprecated(reason: "Use alternative field")');
  }
  
  return directives.length > 0 ? \` \${directives.join(' ')}\` : '';
}`;

export default function AdvancedFeatures() {
  const { _ } = useLanguage();

  return (
    <section id="advanced-features">
      <H2>{_('Advanced Features')}</H2>
      <P>
        <Translate>
          Advanced features extend the basic GraphQL schema generation with 
          sophisticated type handling, relationship management, directive 
          support, and custom scalar types. These features enable 
          production-ready GraphQL schemas that handle complex requirements.
        </Translate>
      </P>

      <H3>{_('Custom Scalar Types')}</H3>
      <P>
        <Translate>
          Custom scalar types allow you to define specialized data types that 
          map to specific validation or formatting requirements. This feature 
          enables the creation of domain-specific types that enhance type 
          safety and API clarity.
        </Translate>
      </P>
      <Code lang='typescript'>
        {customScalarTypesExample}
      </Code>

      <H3>{_('Relationship Handling')}</H3>
      <P>
        <Translate>
          Relationship handling manages references between different types and 
          models in your schema. This ensures that type relationships are 
          properly represented in the generated GraphQL schema with correct 
          type references and nullability handling.
        </Translate>
      </P>
      <Code lang='typescript'>
        {relationshipHandlingExample}
      </Code>

      <H3>{_('Directive Support')}</H3>
      <P>
        <Translate>
          Directive support enables the addition of GraphQL directives to 
          fields and types, providing metadata and behavior hints for GraphQL 
          servers and tools. This feature enhances schema expressiveness and 
          enables advanced GraphQL features.
        </Translate>
      </P>
      <Code lang='typescript'>
        {directiveSupportExample}
      </Code>
    </section>
  );
}