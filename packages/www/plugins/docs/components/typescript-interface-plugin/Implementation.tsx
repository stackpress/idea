import { useLanguage, Translate } from 'r22n';
import { H2, H3, P, C, Code } from '../index.js';

const corePluginFunctionExample =
  `export default async function generateTypeScriptInterfaces(
  props: PluginProps<{ config: TypeScriptConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate TypeScript content
    let content = '';
    
    // Add file header
    content += generateFileHeader();
    
    // Generate enums
    if (config.generateEnums !== false && schema.enum) {
      content += generateEnums(schema.enum, config);
    }
    
    // Generate custom types
    if (schema.type) {
      content += generateCustomTypes(schema.type, config);
    }
    
    // Generate interfaces from models
    if (schema.model) {
      content += generateInterfaces(schema.model, config);
    }
    
    // Generate utility types
    if (config.generateUtilityTypes) {
      content += generateUtilityTypes(schema, config);
    }
    
    // Wrap in namespace if specified
    if (config.namespace) {
      content = wrapInNamespace(content, config.namespace, 
        config.exportType);
    }
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(\`✅ TypeScript interfaces generated: \${outputPath}\`);
    
  } catch (error) {
    console.error(
      '❌ TypeScript interface generation failed:', 
      error.message
    );
    throw error;
  }
}`;

const typeMappingFunctionsExample =
  `function mapSchemaTypeToTypeScript(
  schemaType: string, 
  strictNullChecks: boolean = true
): string {
  const typeMap: Record<string, string> = {
    'String': 'string',
    'Number': 'number',
    'Integer': 'number',
    'Boolean': 'boolean',
    'Date': 'Date',
    'JSON': 'any',
    'ID': 'string'
  };
  
  const baseType = typeMap[schemaType] || schemaType;
  
  // Handle strict null checks
  if (!strictNullChecks && baseType !== 'any') {
    return \`\${baseType} | null | undefined\`;
  }
  
  return baseType;
}

function formatPropertyType(
  column: any, 
  config: TypeScriptConfig,
  availableTypes: Set<string> = new Set()
): string {
  let type = column.type;
  
  // Check if it's a reference to another type
  if (availableTypes.has(column.type)) {
    type = column.type;
  } else {
    type = mapSchemaTypeToTypeScript(column.type, config.strictNullChecks);
  }
  
  // Handle arrays
  if (column.multiple) {
    type = \`\${type}[]\`;
  }
  
  // Handle optional properties
  if (!column.required && config.strictNullChecks) {
    type = \`\${type} | null\`;
  }
  
  return type;
}`;

const generationFunctionsExample =
  `function generateFileHeader(): string {
  const timestamp = new Date().toISOString();
  return \`/**
 * Generated TypeScript interfaces
 * Generated at: \${timestamp}
 * 
 * This file is auto-generated. Do not edit manually.
 */

\`;
}

function generateEnums(
  enums: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Enums\\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    if (config.includeComments) {
      content += \`/**\\n * \${enumName} enumeration\\n */\\n\`;
    }
    
    switch (config.enumType) {
      case 'union':
        content += generateUnionEnum(enumName, enumDef);
        break;
      case 'const':
        content += generateConstEnum(enumName, enumDef);
        break;
      default:
        content += generateStandardEnum(enumName, enumDef);
    }
    
    content += '\\n';
  }
  
  return content + '\\n';
}

function generateStandardEnum(enumName: string, enumDef: any): string {
  let content = \`export enum \${enumName} {\\n\`;
  
  for (const [key, value] of Object.entries(enumDef)) {
    content += \`  \${key} = "\${value}",\\n\`;
  }
  
  content += '}';
  return content;
}

function generateInterfaces(
  models: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Model Interfaces\\n';
  const availableTypes = new Set([
    ...Object.keys(models),
    ...(config.namespace ? [] : Object.keys(models))
  ]);
  
  for (const [modelName, model] of Object.entries(models)) {
    if (config.includeComments) {
      content += \`/**\\n * \${modelName} model interface\\n\`;
      if (model.description) {
        content += \` * \${model.description}\\n\`;
      }
      content += \` */\\n\`;
    }
    
    content += \`export interface \${modelName} {\\n\`;
    
    for (const column of model.columns || []) {
      const propertyType = formatPropertyType(column, config, 
        availableTypes);
      const optional = !column.required ? '?' : '';
      
      if (config.includeComments) {
        let comment = '';
        if (column.description) {
          comment += column.description;
        }
        if (column.attributes?.default) {
          comment += comment ? 
            \` (default: \${column.attributes.default})\` : 
            \`Default: \${column.attributes.default}\`;
        }
        if (comment) {
          content += \`  /** \${comment} */\\n\`;
        }
      }
      
      content += \`  \${column.name}\${optional}: \${propertyType};\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  return content;
}`;

const validationFunctionsExample =
  `function validateConfig(config: any): asserts config is TypeScriptConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error(
      'TypeScript plugin requires "output" configuration as string'
    );
  }
  
  if (config.exportType && 
      !['named', 'default', 'namespace'].includes(config.exportType)) {
    throw new Error(
      'exportType must be one of: named, default, namespace'
    );
  }
  
  if (config.enumType && 
      !['enum', 'union', 'const'].includes(config.enumType)) {
    throw new Error('enumType must be one of: enum, union, const');
  }
}`;

export default function Implementation() {
  const { _ } = useLanguage();

  return (
    <section id="implementation">
      <H2>{_('Implementation')}</H2>
      <P>
        <Translate>
          The implementation section covers the core plugin function and
          supporting utilities that handle TypeScript interface generation.
          This includes configuration validation, content generation, file
          writing, and error handling throughout the generation process.
        </Translate>
      </P>

      <H3>{_('Core Plugin Function')}</H3>
      <P>
        <Translate>
          The core plugin function serves as the main entry point for
          TypeScript interface generation. It orchestrates the entire process
          from configuration validation through content generation to file
          output, ensuring proper error handling and logging throughout.
        </Translate>
      </P>
      <Code lang='typescript'>
        {corePluginFunctionExample}
      </Code>

      <H3>{_('Type Mapping Functions')}</H3>
      <P>
        <Translate>
          Type mapping functions handle the conversion of <C>.idea</C> schema
          types to their TypeScript equivalents. These functions ensure proper
          type safety and handle complex scenarios like nullable types, arrays,
          and custom type references.
        </Translate>
      </P>
      <Code lang='typescript'>
        {typeMappingFunctionsExample}
      </Code>

      <H3>{_('Generation Functions')}</H3>
      <P>
        <Translate>
          Generation functions create specific parts of the TypeScript output
          including enums, interfaces, and utility types. These functions
          handle formatting, documentation generation, and proper TypeScript
          syntax construction.
        </Translate>
      </P>
      <Code lang='typescript'>
        {generationFunctionsExample}
      </Code>

      <H3>{_('Validation Functions')}</H3>
      <P>
        <Translate>
          Validation functions ensure that the plugin configuration is correct
          and that the generated TypeScript code meets quality standards.
          These functions catch configuration errors early and prevent invalid
          output generation.
        </Translate>
      </P>
      <Code lang='typescript'>
        {validationFunctionsExample}
      </Code>
    </section>
  );
}