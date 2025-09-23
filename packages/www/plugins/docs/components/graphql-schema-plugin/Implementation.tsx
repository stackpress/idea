import { useLanguage, Translate } from 'r22n';
import { H2, H3, P, C, Code } from '../index.js';

const corePluginFunctionExample = `export default async function generateGraphQLSchema(
  props: PluginProps<{ config: GraphQLConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    if (!config.output) {
      throw new Error('GraphQL plugin requires "output" configuration');
    }
    
    // Generate GraphQL schema
    let schemaContent = '';
    
    // Add custom scalars
    schemaContent += generateCustomScalars(config.customScalars || {});
    
    // Generate enums
    if (schema.enum) {
      schemaContent += generateEnums(schema.enum);
    }
    
    // Generate types
    if (schema.model) {
      schemaContent += generateTypes(schema.model);
      
      if (config.generateInputTypes) {
        schemaContent += generateInputTypes(schema.model);
      }
    }
    
    // Generate custom types
    if (schema.type) {
      schemaContent += generateCustomTypes(schema.type);
    }
    
    // Generate root types
    if (config.includeQueries) {
      schemaContent += generateQueries(schema.model || {});
    }
    
    if (config.includeMutations) {
      schemaContent += generateMutations(schema.model || {});
    }
    
    if (config.includeSubscriptions) {
      schemaContent += generateSubscriptions(schema.model || {});
    }
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, schemaContent, 'utf8');
    
    console.log(\`✅ GraphQL schema generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ GraphQL schema generation failed:', error.message);
    throw error;
  }
}`;

const typeMappingFunctionsExample = `function mapSchemaTypeToGraphQL(schemaType: string, customScalars: Record<string, string> = {}): string {
  // Check for custom scalar mappings first
  if (customScalars[schemaType]) {
    return customScalars[schemaType];
  }
  
  // Standard type mappings
  const typeMap: Record<string, string> = {
    'String': 'String',
    'Number': 'Float',
    'Integer': 'Int',
    'Boolean': 'Boolean',
    'Date': 'DateTime',
    'JSON': 'JSON',
    'ID': 'ID'
  };
  
  return typeMap[schemaType] || schemaType;
}

function formatFieldType(column: any, customScalars: Record<string, string> = {}): string {
  let type = mapSchemaTypeToGraphQL(column.type, customScalars);
  
  // Handle arrays
  if (column.multiple) {
    type = \`[\${type}]\`;
  }
  
  // Handle required fields
  if (column.required) {
    type += '!';
  }
  
  return type;
}`;

const customScalarsExample = `function generateCustomScalars(customScalars: Record<string, string>): string {
  if (Object.keys(customScalars).length === 0) {
    return \`# Custom Scalars
scalar DateTime
scalar JSON

\`;
  }
  
  let content = '# Custom Scalars\\n';
  content += 'scalar DateTime\\n';
  content += 'scalar JSON\\n';
  
  for (const [name, description] of Object.entries(customScalars)) {
    content += \`scalar \${name}\\n\`;
  }
  
  return content + '\\n';
}`;

const enumsAndTypesExample = `function generateEnums(enums: Record<string, any>): string {
  let content = '# Enums\\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    content += \`enum \${enumName} {\\n\`;
    
    for (const [key, value] of Object.entries(enumDef)) {
      content += \`  \${key}\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}

function generateTypes(models: Record<string, any>): string {
  let content = '# Types\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += \`type \${modelName} {\\n\`;
    
    for (const column of model.columns || []) {
      const fieldType = formatFieldType(column);
      content += \`  \${column.name}: \${fieldType}\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}`;

const inputTypesAndQueriesExample = `function generateInputTypes(models: Record<string, any>): string {
  let content = '# Input Types\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    // Create input type
    content += \`input \${modelName}Input {\\n\`;
    
    for (const column of model.columns || []) {
      // Skip auto-generated fields like ID for input types
      if (column.attributes?.id) continue;
      
      let fieldType = formatFieldType(column);
      // Remove required constraint for input types (make them optional)
      fieldType = fieldType.replace('!', '');
      
      content += \`  \${column.name}: \${fieldType}\\n\`;
    }
    
    content += '}\\n\\n';
    
    // Create update input type
    content += \`input \${modelName}UpdateInput {\\n\`;
    
    for (const column of model.columns || []) {
      let fieldType = formatFieldType(column);
      // All fields are optional in update input
      fieldType = fieldType.replace('!', '');
      
      content += \`  \${column.name}: \${fieldType}\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}

function generateQueries(models: Record<string, any>): string {
  let content = '# Queries\\ntype Query {\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    
    // Get single item
    content += \`  \${lowerName}(id: ID!): \${modelName}\\n\`;
    
    // Get multiple items
    content += \`  \${lowerName}s(limit: Int, offset: Int): [\${modelName}]\\n\`;
  }
  
  content += '}\\n\\n';
  return content;
}`;

export default function Implementation() {
  const { _ } = useLanguage();

  return (
    <section id="implementation">
      <H2>{_('Implementation')}</H2>
      <P>
        <Translate>
          The implementation section covers the core plugin function and 
          supporting utilities that handle GraphQL schema generation. This 
          includes configuration validation, content generation, file writing, 
          and error handling throughout the generation process.
        </Translate>
      </P>

      <H3>{_('Core Plugin Function')}</H3>
      <P>
        <Translate>
          The core plugin function serves as the main entry point for GraphQL 
          schema generation. It orchestrates the entire process from 
          configuration validation through content generation to file output, 
          ensuring proper error handling and logging throughout.
        </Translate>
      </P>
      <Code lang='typescript'>
        {corePluginFunctionExample}
      </Code>

      <H3>{_('Type Mapping Functions')}</H3>
      <P>
        <Translate>
          Type mapping functions handle the conversion of <C>.idea</C> schema 
          types to their GraphQL equivalents. These functions ensure proper 
          type safety and handle complex scenarios like arrays, required 
          fields, and custom scalar types.
        </Translate>
      </P>
      <Code lang='typescript'>
        {typeMappingFunctionsExample}
      </Code>

      <H3>{_('Schema Generation Functions')}</H3>
      <P>
        <Translate>
          Schema generation functions create specific parts of the GraphQL 
          schema including custom scalars, enums, types, input types, and root 
          operation types. These functions handle proper GraphQL syntax 
          construction and type relationships.
        </Translate>
      </P>
      <Code lang='typescript'>
        {customScalarsExample}
      </Code>
      <Code lang='typescript'>
        {enumsAndTypesExample}
      </Code>
      <Code lang='typescript'>
        {inputTypesAndQueriesExample}
      </Code>
    </section>
  );
}