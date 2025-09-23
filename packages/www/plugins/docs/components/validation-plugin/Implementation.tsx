import { useLanguage, Translate } from 'r22n';
import { H2, H3, P } from '../index.js';
import Code from '../Code.js';

const corePluginFunction = 
`export default async function generateZodSchemas(
  props: PluginProps<{ config: ZodConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate Zod content
    let content = '';
    
    // Add file header and imports
    content += generateFileHeader();
    content += generateImports(config);
    
    // Generate enums if requested
    if (config.includeEnums && schema.enum) {
      content += generateEnumSchemas(schema.enum, config);
    }
    
    // Generate custom type schemas
    if (schema.type) {
      content += generateTypeSchemas(schema.type, config);
    }
    
    // Generate model schemas
    if (schema.model) {
      content += generateModelSchemas(schema.model, config);
    }
    
    // Generate utility schemas
    content += generateUtilitySchemas(schema, config);
    
    // Generate main export
    content += generateMainExport(schema, config);
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(\`✅ Zod validation schemas generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ Zod schema generation failed:', error.message);
    throw error;
  }
}`;

const enumGeneration = `function generateEnumSchemas(enums: Record<string, any>, config: ZodConfig): string {
  let content = '// Enum Schemas\\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    const values = Object.values(enumDef);
    const zodValues = values.map(v => \`"\${v}"\`).join(', ');
    
    content += \`export const \${enumName}Schema = z.enum([\${zodValues}]);\\n\`;
    
    if (config.generateTypes) {
      content += \`export type \${enumName} = z.infer<typeof \${enumName}Schema>;\\n\`;
    }
    
    content += '\\n';
  }
  
  return content + '\\n';
}`;

const typeGeneration = `function generateTypeSchemas(types: Record<string, any>, config: ZodConfig): string {
  let content = '// Type Schemas\\n';
  
  for (const [typeName, typeDef] of Object.entries(types)) {
    content += \`export const \${typeName}Schema = z.object({\\n\`;
    
    for (const column of typeDef.columns || []) {
      const fieldSchema = generateFieldSchema(column, config);
      content += \`  \${column.name}: \${fieldSchema},\\n\`;
    }
    
    content += '})';
    
    // Add strict mode if enabled
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\\n';
    
    if (config.generateTypes) {
      content += \`export type \${typeName} = z.infer<typeof \${typeName}Schema>;\\n\`;
    }
    
    content += '\\n';
  }
  
  return content;
}`;

const modelGeneration = `function generateModelSchemas(models: Record<string, any>, config: ZodConfig): string {
  let content = '// Model Schemas\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += \`export const \${modelName}Schema = z.object({\\n\`;
    
    for (const column of model.columns || []) {
      const fieldSchema = generateFieldSchema(column, config);
      content += \`  \${column.name}: \${fieldSchema},\\n\`;
    }
    
    content += '})';
    
    // Add strict mode if enabled
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\\n';
    
    if (config.generateTypes) {
      content += \`export type \${modelName} = z.infer<typeof \${modelName}Schema>;\\n\`;
    }
    
    // Generate input schemas
    content += generateInputSchemas(modelName, model, config);
    
    content += '\\n';
  }
  
  return content;
}`;

const fieldMapping = `function generateFieldSchema(column: any, config: ZodConfig): string {
  let schema = mapTypeToZod(column.type, config);
  
  // Handle arrays
  if (column.multiple) {
    schema = \`z.array(\${schema})\`;
  }
  
  // Handle optional fields
  if (!column.required) {
    schema += '.optional()';
  }
  
  // Add custom validations based on attributes
  if (column.attributes) {
    schema = addAttributeValidations(schema, column.attributes, config);
  }
  
  return schema;
}

function mapTypeToZod(schemaType: string, config: ZodConfig): string {
  // Check for custom validators first
  if (config.customValidators && config.customValidators[schemaType]) {
    return config.customValidators[schemaType];
  }
  
  const typeMap: Record<string, string> = {
    'String': 'z.string()',
    'Number': 'z.number()',
    'Integer': 'z.number().int()',
    'Boolean': 'z.boolean()',
    'Date': 'z.date()',
    'JSON': 'z.any()',
    'ID': 'z.string()'
  };
  
  return typeMap[schemaType] || \`\${schemaType}Schema\`;
}`;

const attributeValidations = `function addAttributeValidations(schema: string, attributes: any, config: ZodConfig): string {
  let validatedSchema = schema;
  
  // String validations
  if (attributes.min && schema.includes('z.string()')) {
    validatedSchema += \`.min(\${attributes.min})\`;
  }
  
  if (attributes.max && schema.includes('z.string()')) {
    validatedSchema += \`.max(\${attributes.max})\`;
  }
  
  if (attributes.email && schema.includes('z.string()')) {
    validatedSchema += '.email()';
  }
  
  if (attributes.url && schema.includes('z.string()')) {
    validatedSchema += '.url()';
  }
  
  if (attributes.uuid && schema.includes('z.string()')) {
    validatedSchema += '.uuid()';
  }
  
  if (attributes.regex && schema.includes('z.string()')) {
    validatedSchema += \`.regex(/\${attributes.regex}/)\`;
  }
  
  // Number validations
  if (attributes.min && schema.includes('z.number()')) {
    validatedSchema += \`.min(\${attributes.min})\`;
  }
  
  if (attributes.max && schema.includes('z.number()')) {
    validatedSchema += \`.max(\${attributes.max})\`;
  }
  
  if (attributes.positive && schema.includes('z.number()')) {
    validatedSchema += '.positive()';
  }
  
  if (attributes.negative && schema.includes('z.number()')) {
    validatedSchema += '.negative()';
  }
  
  if (attributes.nonnegative && schema.includes('z.number()')) {
    validatedSchema += '.nonnegative()';
  }
  
  // Array validations
  if (attributes.minLength && schema.includes('z.array(')) {
    validatedSchema += \`.min(\${attributes.minLength})\`;
  }
  
  if (attributes.maxLength && schema.includes('z.array(')) {
    validatedSchema += \`.max(\${attributes.maxLength})\`;
  }
  
  if (attributes.nonempty && schema.includes('z.array(')) {
    validatedSchema += '.nonempty()';
  }
  
  // Custom error messages
  if (config.errorMessages) {
    const fieldName = extractFieldName(schema);
    if (fieldName && config.errorMessages[fieldName]) {
      validatedSchema += \`.describe("\${config.errorMessages[fieldName]}")\`;
    }
  }
  
  return validatedSchema;
}

function extractFieldName(schema: string): string | null {
  // Extract field name from schema for error message lookup
  const match = schema.match(/(\\w+)Schema/);
  return match ? match[1] : null;
}`;

const inputSchemas = `function generateInputSchemas(modelName: string, model: any, config: ZodConfig): string {
  let content = '';
  
  // Generate create input schema (omit auto-generated fields)
  const createFields = model.columns?.filter((col: any) => 
    !col.attributes?.id && !col.attributes?.default
  ) || [];
  
  if (createFields.length > 0) {
    content += \`export const Create\${modelName}Schema = z.object({\\n\`;
    
    for (const column of createFields) {
      const fieldSchema = generateFieldSchema(column, config);
      content += \`  \${column.name}: \${fieldSchema},\\n\`;
    }
    
    content += '})';
    
    if (config.strictMode) {
      content += '.strict()';
    }
    
    content += ';\\n';
    
    if (config.generateTypes) {
      content += \`export type Create\${modelName}Input = z.infer<typeof Create\${modelName}Schema>;\\n\`;
    }
  }
  
  // Generate update input schema (all fields optional)
  content += \`export const Update\${modelName}Schema = \${modelName}Schema.partial()\`;
  
  if (config.strictMode) {
    content += '.strict()';
  }
  
  content += ';\\n';
  
  if (config.generateTypes) {
    content += \`export type Update\${modelName}Input = z.infer<typeof Update\${modelName}Schema>;\\n\`;
  }
  
  return content;
}`;

const utilitySchemas = `function generateUtilitySchemas(schema: any, config: ZodConfig): string {
  let content = '// Utility Schemas\\n';
  
  // Generate pagination schema
  content += \`export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

\`;
  
  if (config.generateTypes) {
    content += \`export type PaginationParams = z.infer<typeof PaginationSchema>;\\n\\n\`;
  }
  
  // Generate API response schemas
  content += \`export const APIResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema).optional(),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    error: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
  });

\`;
  
  return content;
}`;

const exportFunctions = `function generateMainExport(schema: any, config: ZodConfig): string {
  if (config.exportStyle === 'namespace') {
    return generateNamespaceExport(schema, config);
  }
  
  if (config.exportStyle === 'default') {
    return generateDefaultExport(schema, config);
  }
  
  // Named exports (default)
  return '// All schemas are exported as named exports above\\n';
}

function generateNamespaceExport(schema: any, config: ZodConfig): string {
  let content = 'export namespace Schemas {\\n';
  
  // Export enums
  if (config.includeEnums && schema.enum) {
    for (const enumName of Object.keys(schema.enum)) {
      content += \`  export const \${enumName} = \${enumName}Schema;\\n\`;
    }
  }
  
  // Export types
  if (schema.type) {
    for (const typeName of Object.keys(schema.type)) {
      content += \`  export const \${typeName} = \${typeName}Schema;\\n\`;
    }
  }
  
  // Export models
  if (schema.model) {
    for (const modelName of Object.keys(schema.model)) {
      content += \`  export const \${modelName} = \${modelName}Schema;\\n\`;
      content += \`  export const Create\${modelName} = Create\${modelName}Schema;\\n\`;
      content += \`  export const Update\${modelName} = Update\${modelName}Schema;\\n\`;
    }
  }
  
  content += '}\\n\\n';
  return content;
}

function generateDefaultExport(schema: any, config: ZodConfig): string {
  let content = 'const schemas = {\\n';
  
  // Add enums
  if (config.includeEnums && schema.enum) {
    for (const enumName of Object.keys(schema.enum)) {
      content += \`  \${enumName}: \${enumName}Schema,\\n\`;
    }
  }
  
  // Add types
  if (schema.type) {
    for (const typeName of Object.keys(schema.type)) {
      content += \`  \${typeName}: \${typeName}Schema,\\n\`;
    }
  }
  
  // Add models
  if (schema.model) {
    for (const modelName of Object.keys(schema.model)) {
      content += \`  \${modelName}: \${modelName}Schema,\\n\`;
      content += \`  Create\${modelName}: Create\${modelName}Schema,\\n\`;
      content += \`  Update\${modelName}: Update\${modelName}Schema,\\n\`;
    }
  }
  
  content += \`  Pagination: PaginationSchema,
  APIResponse: APIResponseSchema,
  PaginatedResponse: PaginatedResponseSchema,
};

export default schemas;
\`;
  
  return content;
}`;

const configValidation = `function validateConfig(config: any): asserts config is ZodConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('Zod plugin requires "output" configuration as string');
  }
  
  if (config.exportStyle && !['named', 'default', 'namespace'].includes(config.exportStyle)) {
    throw new Error('exportStyle must be one of: named, default, namespace');
  }
}`;
 
export default function Implementation() {
  const { _ } = useLanguage();

  return (
    <section id="implementation">
      <H2>{_('4. Implementation')}</H2>
      <P>
        <Translate>
          The implementation section covers the core plugin function and
          supporting utilities that handle Zod schema generation. This
          includes configuration validation, content generation, file writing,
          and error handling throughout the generation process.
        </Translate>
      </P>

      <H3>{_('4.1. Core Plugin Function')}</H3>
      <P>
        <Translate>
          The core plugin function serves as the main entry point for Zod
          schema generation. It orchestrates the entire process from
          configuration validation through content generation to file output,
          ensuring proper error handling and logging throughout.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {corePluginFunction}
      </Code>

      <H3>{_('4.2. Generation Functions')}</H3>
      <P>
        <Translate>
          Generation functions create specific parts of the Zod validation
          output including enum schemas, type schemas, model schemas, and
          utility schemas. These functions handle proper Zod syntax
          construction and validation rule application.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {corePluginFunction}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {enumGeneration}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {typeGeneration}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {modelGeneration}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {fieldMapping}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {attributeValidations}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {inputSchemas}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {utilitySchemas}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {exportFunctions}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {configValidation}
      </Code>
    </section>
  );
}