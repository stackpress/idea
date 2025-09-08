//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Layout from '../../components/Layout.js';
import Code from '../../components/Code.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
const examples = [
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
}`,
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface MarkdownDocsConfig {
  output: string;
  title?: string;
  format?: 'single' | 'multiple';
  includeIndex?: boolean;
  includeExamples?: boolean;
  includeAttributes?: boolean;
  sections?: string[];
  template?: 'default' | 'api' | 'guide';
}

export default async function markdownDocsPlugin(
  props: PluginProps<{ config: MarkdownDocsConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('Markdown Documentation Plugin requires "output" configuration');
  }
  
  // Set defaults
  const options = {
    title: config.title || 'Schema Documentation',
    format: config.format || 'single',
    includeIndex: config.includeIndex !== false,
    includeExamples: config.includeExamples !== false,
    includeAttributes: config.includeAttributes !== false,
    sections: config.sections || ['models', 'types', 'enums', 'props'],
    template: config.template || 'default',
    ...config
  };
  
  // Generate documentation
  if (options.format === 'single') {
    await generateSingleFile(schema, options, transformer);
  } else {
    await generateMultipleFiles(schema, options, transformer);
  }
  
  console.log(\`✅ Markdown documentation generated: \${options.output}\`);
}`,
  `async function generateSingleFile(schema: any, options: any, transformer: any): Promise<void> {
  let content = generateHeader(options);
  
  // Generate table of contents
  if (options.includeIndex) {
    content += generateTableOfContents(schema, options);
  }
  
  // Generate sections
  for (const section of options.sections) {
    switch (section) {
      case 'models':
        if (schema.model) {
          content += generateModelsSection(schema.model, schema, options);
        }
        break;
      case 'types':
        if (schema.type) {
          content += generateTypesSection(schema.type, schema, options);
        }
        break;
      case 'enums':
        if (schema.enum) {
          content += generateEnumsSection(schema.enum, options);
        }
        break;
      case 'props':
        if (schema.prop) {
          content += generatePropsSection(schema.prop, options);
        }
        break;
    }
  }
  
  // Add footer
  content += generateFooter(options);
  
  // Write to file
  const outputPath = await transformer.loader.absolute(options.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
}

async function generateMultipleFiles(schema: any, options: any, transformer: any): Promise<void> {
  const outputDir = path.dirname(await transformer.loader.absolute(options.output));
  await fs.mkdir(outputDir, { recursive: true });
  
  // Generate index file
  if (options.includeIndex) {
    const indexContent = generateIndexFile(schema, options);
    await fs.writeFile(path.join(outputDir, 'README.md'), indexContent, 'utf8');
  }
  
  // Generate individual files for each section
  for (const section of options.sections) {
    let content = '';
    let filename = '';
    
    switch (section) {
      case 'models':
        if (schema.model) {
          content = generateModelsFile(schema.model, schema, options);
          filename = 'models.md';
        }
        break;
      case 'types':
        if (schema.type) {
          content = generateTypesFile(schema.type, schema, options);
          filename = 'types.md';
        }
        break;
      case 'enums':
        if (schema.enum) {
          content = generateEnumsFile(schema.enum, options);
          filename = 'enums.md';
        }
        break;
      case 'props':
        if (schema.prop) {
          content = generatePropsFile(schema.prop, options);
          filename = 'props.md';
        }
        break;
    }
    
    if (content && filename) {
      await fs.writeFile(path.join(outputDir, filename), content, 'utf8');
    }
  }
}

function generateHeader(options: any): string {
  let header = \`# \${options.title}\\n\\n\`;
  
  switch (options.template) {
    case 'api':
      header += 'API Reference documentation for the schema definitions.\\n\\n';
      header += '## Overview\\n\\n';
      header += 'This document provides comprehensive API documentation for all schema elements including models, types, enums, and properties.\\n\\n';
      break;
    case 'guide':
      header += 'Developer guide for working with the schema definitions.\\n\\n';
      header += '## Getting Started\\n\\n';
      header += 'This guide will help you understand and work with the schema definitions in your application.\\n\\n';
      break;
    default:
      header += 'Comprehensive documentation for all schema definitions.\\n\\n';
      header += \`Generated on: \${new Date().toISOString()}\\n\\n\`;
  }
  
  return header;
}

function generateTableOfContents(schema: any, options: any): string {
  let toc = '## Table of Contents\\n\\n';
  
  for (const section of options.sections) {
    switch (section) {
      case 'models':
        if (schema.model && Object.keys(schema.model).length > 0) {
          toc += '- [Models](#models)\\n';
          for (const modelName of Object.keys(schema.model)) {
            toc += \`  - [\${modelName}](#\${modelName.toLowerCase()})\\n\`;
          }
        }
        break;
      case 'types':
        if (schema.type && Object.keys(schema.type).length > 0) {
          toc += '- [Types](#types)\\n';
          for (const typeName of Object.keys(schema.type)) {
            toc += \`  - [\${typeName}](#\${typeName.toLowerCase()})\\n\`;
          }
        }
        break;
      case 'enums':
        if (schema.enum && Object.keys(schema.enum).length > 0) {
          toc += '- [Enums](#enums)\\n';
          for (const enumName of Object.keys(schema.enum)) {
            toc += \`  - [\${enumName}](#\${enumName.toLowerCase()})\\n\`;
          }
        }
        break;
      case 'props':
        if (schema.prop && Object.keys(schema.prop).length > 0) {
          toc += '- [Props](#props)\\n';
          for (const propName of Object.keys(schema.prop)) {
            toc += \`  - [\${propName}](#\${propName.toLowerCase()})\\n\`;
          }
        }
        break;
    }
  }
  
  return toc + '\\n';
}`,
  `function generateModelsSection(models: any, schema: any, options: any): string {
  let content = '## Models\\n\\n';
  content += 'Models represent the main data structures in your application.\\n\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += generateModelDocumentation(modelName, model, schema, options);
  }
  
  return content;
}`,
  `function generateModelDocumentation(modelName: string, model: any, schema: any, options: any): string {
  let content = \`### \${modelName}\\n\\n\`;
  
  // Add description if available
  if (model.description) {
    content += \`\${model.description}\\n\\n\`;
  }
  
  // Add mutability information
  content += \`**Mutability:** \${model.mutable ? 'Mutable' : 'Immutable'}\\n\\n\`;
  
  // Generate columns table
  if (model.columns && model.columns.length > 0) {
    content += '#### Columns\\n\\n';
    content += '| Name | Type | Required | Multiple | Description |\\n';
    content += '|------|------|----------|----------|-------------|\\n';
    
    for (const column of model.columns) {
      const name = column.name;
      const type = formatType(column.type, column.multiple);
      const required = column.required ? '✓' : '✗';
      const multiple = column.multiple ? '✓' : '✗';
      const description = column.attributes?.description || column.attributes?.label || '-';
      
      content += \`| \${name} | \${type} | \${required} | \${multiple} | \${description} |\\n\`;
    }
    content += '\\n';
    
    // Generate detailed column information
    if (options.includeAttributes) {
      content += '#### Column Details\\n\\n';
      
      for (const column of model.columns) {
        content += generateColumnDocumentation(column, schema, options);
      }
    }
  }
  
  // Generate examples
  if (options.includeExamples) {
    content += generateModelExamples(modelName, model, schema, options);
  }
  
  return content;
}`,
  `function generateColumnDocumentation(column: any, schema: any, options: any): string {
  let content = \`##### \${column.name}\\n\\n\`;
  
  const attributes = column.attributes || {};
  
  // Basic information
  content += \`- **Type:** \${formatType(column.type, column.multiple)}\\n\`;
  content += \`- **Required:** \${column.required ? 'Yes' : 'No'}\\n\`;
  
  if (attributes.default !== undefined) {
    content += \`- **Default:** \\\`\${attributes.default}\\\`\\n\`;
  }
  
  if (attributes.description) {
    content += \`- **Description:** \${attributes.description}\\n\`;
  }
  
  // Validation rules
  const validation = attributes.is || {};
  if (Object.keys(validation).length > 0) {
    content += '- **Validation:**\\n';
    
    if (validation.minLength) {
      content += \`  - Minimum length: \${validation.minLength}\\n\`;
    }
    if (validation.maxLength) {
      content += \`  - Maximum length: \${validation.maxLength}\\n\`;
    }
    if (validation.min) {
      content += \`  - Minimum value: \${validation.min}\\n\`;
    }
    if (validation.max) {
      content += \`  - Maximum value: \${validation.max}\\n\`;
    }
    if (validation.pattern) {
      content += \`  - Pattern: \\\`\${validation.pattern}\\\`\\n\`;
    }
    if (validation.email) {
      content += '  - Must be a valid email address\\n';
    }
    if (validation.url) {
      content += '  - Must be a valid URL\\n';
    }
  }
  
  // Field configuration
  const field = attributes.field || {};
  if (Object.keys(field).length > 0) {
    content += '- **Field Configuration:**\\n';
    
    if (field.input) {
      content += \`  - Input type: \${field.input.type || 'text'}\\n\`;
      if (field.input.placeholder) {
        content += \`  - Placeholder: "\${field.input.placeholder}"\\n\`;
      }
    }
    if (field.select) {
      content += '  - Rendered as: Select dropdown\\n';
    }
    if (field.textarea) {
      content += '  - Rendered as: Textarea\\n';
    }
    if (field.checkbox) {
      content += '  - Rendered as: Checkbox\\n';
    }
  }
  
  // Database attributes
  if (attributes.id) {
    content += '- **Database:** Primary key\\n';
  }
  if (attributes.unique) {
    content += '- **Database:** Unique constraint\\n';
  }
  if (attributes.index) {
    content += '- **Database:** Indexed\\n';
  }
  
  content += '\\n';
  
  return content;
}`,
  `function generateModelExamples(modelName: string, model: any, schema: any, options: any): string {
  let content = '#### Examples\\n\\n';
  
  // Generate JSON example
  content += '##### JSON Structure\\n\\n';
  content += '\`\`\`json\\n';
  content += generateJSONExample(model, schema);
  content += '\\n\`\`\`\\n\\n';
  
  // Generate schema definition example
  content += '##### Schema Definition\\n\\n';
  content += '\`\`\`idea\\n';
  content += generateSchemaExample(modelName, model);
  content += '\\n\`\`\`\\n\\n';
  
  return content;
}`,
  `function generateJSONExample(model: any, schema: any): string {
  const example: any = {};
  
  for (const column of model.columns || []) {
    const value = generateExampleValue(column, schema);
    if (value !== undefined) {
      example[column.name] = value;
    }
  }
  
  return JSON.stringify(example, null, 2);
}`,
  `function generateExampleValue(column: any, schema: any): any {
  const { type, attributes = {} } = column;
  
  // Use default value if available
  if (attributes.default !== undefined) {
    return attributes.default;
  }
  
  // Generate example based on type
  switch (type) {
    case 'String':
      if (attributes.email) {
        return 'user@example.com';
      }
      if (attributes.url) {
        return 'https://example.com';
      }
      if (attributes.id) {
        return 'abc123def456';
      }
      return \`Example \${column.name}\`;
      
    case 'Number':
      if (attributes.min && attributes.max) {
        return Math.floor((attributes.min + attributes.max) / 2);
      }
      if (attributes.min) {
        return attributes.min + 10;
      }
      if (attributes.max) {
        return Math.floor(attributes.max / 2);
      }
      return 42;
      
    case 'Boolean':
      return true;
      
    case 'Date':
      return new Date().toISOString();
      
    default:
      // Check if it's an enum
      if (schema.enum && schema.enum[type]) {
        const enumValues = Object.keys(schema.enum[type]);
        return enumValues[0];
      }
      
      // Check if it's a type
      if (schema.type && schema.type[type]) {
        return generateJSONExample(schema.type[type], schema);
      }
      
      return null;
  }
}`,
  `function generateSchemaExample(modelName: string, model: any): string {
  let schema = \`model \${modelName}\`;
  
  if (!model.mutable) {
    schema += '!';
  }
  
  schema += ' {\\n';
  
  for (const column of model.columns || []) {
    schema += \`  \${column.name} \${formatType(column.type, column.multiple)}\`;
    
    // Add common attributes
    const attributes = column.attributes || {};
    if (attributes.id) {
      schema += ' @id';
    }
    if (attributes.unique) {
      schema += ' @unique';
    }
    if (attributes.default !== undefined) {
      schema += \` @default("\${attributes.default}")\`;
    }
    if (!column.required) {
      schema += ' @optional';
    }
    
    schema += '\\n';
  }
  
  schema += '}';
  
  return schema;
}`,
  `function generateTypesSection(types: any, schema: any, options: any): string {
  let content = '## Types\\n\\n';
  content += 'Types define reusable data structures that can be embedded in models.\\n\\n';
  
  for (const [typeName, type] of Object.entries(types)) {
    content += generateTypeDocumentation(typeName, type, schema, options);
  }
  
  return content;
}

function generateTypeDocumentation(typeName: string, type: any, schema: any, options: any): string {
  let content = \`### \${typeName}\\n\\n\`;
  
  // Add description if available
  if (type.description) {
    content += \`\${type.description}\\n\\n\`;
  }
  
  // Add mutability information
  content += \`**Mutability:** \${type.mutable ? 'Mutable' : 'Immutable'}\\n\\n\`;
  
  // Generate columns table (same as models)
  if (type.columns && type.columns.length > 0) {
    content += '#### Properties\\n\\n';
    content += '| Name | Type | Required | Multiple | Description |\\n';
    content += '|------|------|----------|----------|-------------|\\n';
    
    for (const column of type.columns) {
      const name = column.name;
      const columnType = formatType(column.type, column.multiple);
      const required = column.required ? '✓' : '✗';
      const multiple = column.multiple ? '✓' : '✗';
      const description = column.attributes?.description || column.attributes?.label || '-';
      
      content += \`| \${name} | \${columnType} | \${required} | \${multiple} | \${description} |\\n\`;
    }
    content += '\\n';
  }
  
  // Generate examples
  if (options.includeExamples) {
    content += '#### Example\\n\\n';
    content += '\`\`\`json\\n';
    content += generateJSONExample(type, schema);
    content += '\\n\`\`\`\\n\\n';
  }
  
  return content;
}`,
  `function generateEnumsSection(enums: any, options: any): string {
  let content = '## Enums\\n\\n';
  content += 'Enums define sets of named constants with associated values.\\n\\n';
  
  for (const [enumName, enumDef] of Object.entries(enums)) {
    content += generateEnumDocumentation(enumName, enumDef, options);
  }
  
  return content;
}

function generateEnumDocumentation(enumName: string, enumDef: any, options: any): string {
  let content = \`### \${enumName}\\n\\n\`;
  
  // Generate values table
  content += '#### Values\\n\\n';
  content += '| Key | Value | Description |\\n';
  content += '|-----|-------|-------------|\\n';
  
  for (const [key, value] of Object.entries(enumDef)) {
    content += \`| \${key} | \${value} | - |\\n\`;
  }
  content += '\\n';
  
  // Generate examples
  if (options.includeExamples) {
    content += '#### Example\\n\\n';
    content += '\`\`\`idea\\n';
    content += \`enum \${enumName} {\\n\`;
    for (const [key, value] of Object.entries(enumDef)) {
      content += \`  \${key} "\${value}"\\n\`;
    }
    content += '}\\n';
    content += '\`\`\`\\n\\n';
    
    content += '\`\`\`json\\n';
    content += \`// Using in a model\\n\`;
    content += \`{\\n\`;
    content += \`  "status": "\${Object.keys(enumDef)[0]}"\\n\`;
    content += \`}\\n\`;
    content += '\`\`\`\\n\\n';
  }
  
  return content;
}`,
  `function generatePropsSection(props: any, options: any): string {
  let content = '## Props\\n\\n';
  content += 'Props define reusable property configurations for form fields and validation.\\n\\n';
  
  for (const [propName, propDef] of Object.entries(props)) {
    content += generatePropDocumentation(propName, propDef, options);
  }
  
  return content;
}

function generatePropDocumentation(propName: string, propDef: any, options: any): string {
  let content = \`### \${propName}\\n\\n\`;
  
  // Generate properties table
  content += '#### Configuration\\n\\n';
  content += '| Property | Value | Description |\\n';
  content += '|----------|-------|-------------|\\n';
  
  for (const [key, value] of Object.entries(propDef)) {
    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
    content += \`| \${key} | \\\`\${valueStr}\\\` | - |\\n\`;
  }
  content += '\\n';
  
  // Generate examples
  if (options.includeExamples) {
    content += '#### Example\\n\\n';
    content += '\`\`\`idea\\n';
    content += \`prop \${propName} {\\n\`;
    for (const [key, value] of Object.entries(propDef)) {
      const valueStr = typeof value === 'string' ? \`"\${value}"\` : JSON.stringify(value);
      content += \`  \${key} \${valueStr}\\n\`;
    }
    content += '}\\n\\n';
    content += \`// Usage in a model\\n\`;
    content += \`model User {\\n\`;
    content += \`  name String @field.input(\${propName})\\n\`;
    content += \`}\\n\`;
    content += '\`\`\`\\n\\n';
  }
  
  return content;
}`,
  `function formatType(type: string, multiple: boolean = false): string {
  let formattedType = type;
  
  // Add array notation if multiple
  if (multiple) {
    formattedType += '[]';
  }
  
  // Add markdown formatting for built-in types
  const builtInTypes = ['String', 'Number', 'Boolean', 'Date', 'JSON'];
  if (builtInTypes.includes(type)) {
    formattedType = \`\\\`\${formattedType}\\\`\`;
  } else {
    // Link to other types/enums
    formattedType = \`[\${formattedType}](#\${type.toLowerCase()})\`;
  }
  
  return formattedType;
}`,
  `function generateFooter(options: any): string {
  let footer = '\\n---\\n\\n';
  footer += \`*Documentation generated on \${new Date().toLocaleString()}*\\n\`;
  
  if (options.template === 'api') {
    footer += '\\n## Support\\n\\n';
    footer += 'For questions or issues, please refer to the project documentation or contact the development team.\\n';
  }
  
  return footer;
}`,
  `function generateIndexFile(schema: any, options: any): string {
  let content = \`# \${options.title}\\n\\n\`;
  content += 'Welcome to the schema documentation. This documentation is organized into the following sections:\\n\\n';
  
  // Generate overview
  const stats = {
    models: schema.model ? Object.keys(schema.model).length : 0,
    types: schema.type ? Object.keys(schema.type).length : 0,
    enums: schema.enum ? Object.keys(schema.enum).length : 0,
    props: schema.prop ? Object.keys(schema.prop).length : 0
  };
  
  content += '## Overview\\n\\n';
  content += \`This schema contains:\\n\`;
  content += \`- **\${stats.models}** models\\n\`;
  content += \`- **\${stats.types}** types\\n\`;
  content += \`- **\${stats.enums}** enums\\n\`;
  content += \`- **\${stats.props}** props\\n\\n\`;
  
  // Generate navigation
  content += '## Documentation Sections\\n\\n';
  
  if (stats.models > 0) {
    content += '### [Models](./models.md)\\n\\n';
    content += 'Main data structures and entities:\\n';
    for (const modelName of Object.keys(schema.model || {})) {
      content += \`- [\${modelName}](./models.md#\${modelName.toLowerCase()})\\n\`;
    }
    content += '\\n';
  }
  
  if (stats.types > 0) {
    content += '### [Types](./types.md)\\n\\n';
    content += 'Reusable data structures:\\n';
    for (const typeName of Object.keys(schema.type || {})) {
      content += \`- [\${typeName}](./types.md#\${typeName.toLowerCase()})\\n\`;
    }
    content += '\\n';
  }
  
  if (stats.enums > 0) {
    content += '### [Enums](./enums.md)\\n\\n';
    content += 'Named constants and value sets:\\n';
    for (const enumName of Object.keys(schema.enum || {})) {
      content += \`- [\${enumName}](./enums.md#\${enumName.toLowerCase()})\\n\`;
    }
    content += '\\n';
  }
  
  if (stats.props > 0) {
    content += '### [Props](./props.md)\\n\\n';
    content += 'Reusable property configurations:\\n';
    for (const propName of Object.keys(schema.prop || {})) {
      content += \`- [\${propName}](./props.md#\${propName.toLowerCase()})\\n\`;
    }
    content += '\\n';
  }
  
  return content;
}

function generateModelsFile(models: any, schema: any, options: any): string {
  let content = generateHeader({ ...options, title: 'Models' });
  content += generateModelsSection(models, schema, options);
  return content;
}

function generateTypesFile(types: any, schema: any, options: any): string {
  let content = generateHeader({ ...options, title: 'Types' });
  content += generateTypesSection(types, schema, options);
  return content;
}

function generateEnumsFile(enums: any, options: any): string {
  let content = generateHeader({ ...options, title: 'Enums' });
  content += generateEnumsSection(enums, options);
  return content;
}

function generatePropsFile(props: any, options: any): string {
  let content = generateHeader({ ...options, title: 'Props' });
  content += generatePropsSection(props, options);
  return content;
}`,
  `// schema.idea
plugin "./plugins/markdown-docs-plugin.js" {
  output "./docs/schema.md"
  title "My Application Schema"
  format "single"
  includeIndex true
  includeExamples true
  includeAttributes true
  sections ["models", "types", "enums", "props"]
  template "api"
}

model User! {
  id String @id @default("nanoid()") @description("Unique identifier for the user")
  email String @unique @field.input(Email) @description("User email address for authentication")
  name String @field.input(Text) @description("Full name of the user")
  role UserRole @default("USER") @description("User's role in the system")
  profile Profile? @description("Optional user profile information")
  active Boolean @default(true) @description("Whether the user account is active")
  created Date @default("now()") @description("Account creation timestamp")
}

type Profile {
  bio String @field.textarea @description("User biography")
  avatar String @field.file @description("Profile picture URL")
  website String @field.input(URL) @description("Personal website URL")
}

enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
  GUEST "Guest User"
}

prop Email {
  type "email"
  placeholder "Enter your email address"
  validation {
    required true
    email true
  }
}`,
  `# My Application Schema

API Reference documentation for the schema definitions.

## Overview

This document provides comprehensive API documentation for all schema elements including models, types, enums, and properties.

Generated on: 2024-01-15T10:30:00.000Z

## Table of Contents

- [Models](#models)
  - [User](#user)
- [Types](#types)
  - [Profile](#profile)
- [Enums](#enums)
  - [UserRole](#userrole)
- [Props](#props)
  - [Email](#email)

## Models

Models represent the main data structures in your application.

### User

**Mutability:** Immutable

#### Columns

| Name | Type | Required | Multiple | Description |
|------|------|----------|----------|-------------|
| id | \`String\` | ✓ | ✗ | Unique identifier for the user |
| email | \`String\` | ✓ | ✗ | User email address for authentication |
| name | \`String\` | ✓ | ✗ | Full name of the user |
| role | [UserRole](#userrole) | ✓ | ✗ | User's role in the system |
| profile | [Profile](#profile) | ✗ | ✗ | Optional user profile information |
| active | \`Boolean\` | ✓ | ✗ | Whether the user account is active |
| created | \`Date\` | ✓ | ✗ | Account creation timestamp |

#### Column Details

##### id

- **Type:** \`String\`
- **Required:** Yes
- **Default:** \`nanoid()\`
- **Description:** Unique identifier for the user
- **Database:** Primary key

##### email

- **Type:** \`String\`
- **Required:** Yes
- **Description:** User email address for authentication
- **Validation:**
  - Must be a valid email address
- **Field Configuration:**
  - Input type: email
- **Database:** Unique constraint

##### name

- **Type:** \`String\`
- **Required:** Yes
- **Description:** Full name of the user
- **Field Configuration:**
  - Input type: text

##### role

- **Type:** [UserRole](#userrole)
- **Required:** Yes
- **Default:** \`USER\`
- **Description:** User's role in the system
- **Field Configuration:**
  - Rendered as: Select dropdown

##### profile

- **Type:** [Profile](#profile)
- **Required:** No
- **Description:** Optional user profile information

##### active

- **Type:** \`Boolean\`
- **Required:** Yes
- **Default:** \`true\`
- **Description:** Whether the user account is active
- **Field Configuration:**
  - Rendered as: Checkbox

##### created

- **Type:** \`Date\`
- **Required:** Yes
- **Default:** \`now()\`
- **Description:** Account creation timestamp

#### Examples

##### JSON Structure

\`\`\`json
{
  "id": "abc123def456",
  "email": "user@example.com",
  "name": "Example name",
  "role": "ADMIN",
  "profile": {
    "bio": "Example bio",
    "avatar": "Example avatar",
    "website": "https://example.com"
  },
  "active": true,
  "created": "2024-01-15T10:30:00.000Z"
}
\`\`\`

##### Schema Definition

\`\`\`idea
model User! {
  id String @id @default("nanoid()")
  email String @unique @default("USER")
  name String @optional
  role UserRole @optional
  profile Profile? @optional
  active Boolean @optional
  created Date @optional
}
\`\`\`

## Types

Types define reusable data structures that can be embedded in models.

### Profile

**Mutability:** Mutable

#### Properties

| Name | Type | Required | Multiple | Description |
|------|------|----------|----------|-------------|
| bio | \`String\` | ✓ | ✗ | User biography |
| avatar | \`String\` | ✓ | ✗ | Profile picture URL |
| website | \`String\` | ✓ | ✗ | Personal website URL |

#### Example

\`\`\`json
{
  "bio": "Example bio",
  "avatar": "Example avatar",
  "website": "https://example.com"
}
\`\`\`

## Enums

Enums define sets of named constants with associated values.

### UserRole

#### Values

| Key | Value | Description |
|-----|-------|-------------|
| ADMIN | Administrator | - |
| USER | Regular User | - |
| GUEST | Guest User | - |

#### Example

\`\`\`idea
enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
  GUEST "Guest User"
}
\`\`\`

\`\`\`json
// Using in a model
{
  "status": "ADMIN"
}
\`\`\`

## Props

Props define reusable property configurations for form fields and validation.

### Email

#### Configuration

| Property | Value | Description |
|----------|-------|-------------|
| type | \`"email"\` | - |
| placeholder | \`"Enter your email address"\` | - |
| validation | \`{"required":true,"email":true}\` | - |

#### Example

\`\`\`idea
prop Email {
  type "email"
  placeholder "Enter your email address"
  validation {"required":true,"email":true}
}

// Usage in a model
model User {
  name String @field.input(Email)
}
\`\`\`

---

*Documentation generated on 1/15/2024, 10:30:00 AM*

## Support

For questions or issues, please refer to the project documentation or contact the development team.`,
  `export default async function markdownDocsPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Validate schema has content
    const hasContent = (schema.model && Object.keys(schema.model).length > 0) ||
                      (schema.type && Object.keys(schema.type).length > 0) ||
                      (schema.enum && Object.keys(schema.enum).length > 0) ||
                      (schema.prop && Object.keys(schema.prop).length > 0);
    
    if (!hasContent) {
      console.warn('⚠️  No schema content found. Skipping documentation generation.');
      return;
    }
    
    // Generate documentation
    if (options.format === 'single') {
      await generateSingleFile(schema, options, transformer);
    } else {
      await generateMultipleFiles(schema, options, transformer);
    }
    
    console.log(\`✅ Markdown documentation generated: \${options.output}\`);
    
    // Report statistics
    const stats = {
      models: schema.model ? Object.keys(schema.model).length : 0,
      types: schema.type ? Object.keys(schema.type).length : 0,
      enums: schema.enum ? Object.keys(schema.enum).length : 0,
      props: schema.prop ? Object.keys(schema.prop).length : 0
    };
    
    console.log(\`📊 Generated documentation for:\`);
    console.log(\`  - \${stats.models} model(s)\`);
    console.log(\`  - \${stats.types} type(s)\`);
    console.log(\`  - \${stats.enums} enum(s)\`);
    console.log(\`  - \${stats.props} prop(s)\`);
    
  } catch (error) {
    console.error(\`❌ Markdown Documentation Plugin failed: \${error.message}\`);
    throw error;
  }
}`,
  `function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('Markdown Documentation Plugin requires "output" configuration');
  }
  
  if (config.format && !['single', 'multiple'].includes(config.format)) {
    throw new Error(\`Unsupported format: \${config.format}\`);
  }
  
  if (config.template && !['default', 'api', 'guide'].includes(config.template)) {
    throw new Error(\`Unsupported template: \${config.template}\`);
  }
  
  if (config.sections && !Array.isArray(config.sections)) {
    throw new Error('Sections must be an array');
  }
  
  const validSections = ['models', 'types', 'enums', 'props'];
  if (config.sections) {
    for (const section of config.sections) {
      if (!validSections.includes(section)) {
        throw new Error(\`Invalid section: \${section}. Valid sections are: \${validSections.join(', ')}\`);
      }
    }
  }
}`,
  `// Add support for custom templates
function loadCustomTemplate(templatePath: string): string {
  // Implementation for loading custom templates
  return '';
}

// Add support for cross-references
function generateCrossReferences(schema: any): Map<string, string[]> {
  const references = new Map<string, string[]>();
  
  // Find all type references in models
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      const refs: string[] = [];
      for (const column of model.columns || []) {
        if (schema.type && schema.type[column.type]) {
          refs.push(column.type);
        }
        if (schema.enum && schema.enum[column.type]) {
          refs.push(column.type);
        }
      }
      if (refs.length > 0) {
        references.set(modelName, refs);
      }
    }
  }
  
  return references;
}

// Add support for diagrams (Mermaid)
function generateMermaidDiagram(schema: any): string {
  let diagram = 'erDiagram\\n';
  
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      diagram += \`  \${modelName} {\\n\`;
      for (const column of model.columns || []) {
        const type = column.type.toLowerCase();
        const key = column.attributes?.id ? ' PK' : column.attributes?.unique ? ' UK' : '';
        diagram += \`    \${type} \${column.name}\${key}\\n\`;
      }
      diagram += '  }\\n';
    }
  }
  
  return diagram;
}`
];

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Markdown Documentation Plugin Tutorial');
  const description = _(
    'A comprehensive guide to creating a plugin that generates markdown documentation from schema definitions'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/idea-logo-icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/idea-logo-icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export function Right() {
  const { _ } = useLanguage();
  return (
    <menu className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('On this page')}
      </h6>
      <nav className="px-m-14 px-lh-32">
        <a href="#1-overview" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('1. Overview')}
        </a>
        <a href="#2-prerequisites" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('2. Prerequisites')}
        </a>
        <a href="#3-understanding-schema" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('3. Understanding the Schema Structure')}
        </a>
        <a href="#4-create-plugin" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('4. Create the Plugin Structure')}
        </a>
        <a href="#5-implement-generation" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('5. Implement Documentation Generation')}
        </a>
        <a href="#6-generate-models" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('6. Generate Models Documentation')}
        </a>
        <a href="#7-generate-types-enums-props" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('7. Generate Types, Enums, and Props')}
        </a>
        <a href="#8-utility-functions" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('8. Utility Functions')}
        </a>
        <a href="#9-usage-in-schema" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('9. Usage in Schema')}
        </a>
        <a href="#10-generated-output" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('10. Generated Output')}
        </a>
        <a href="#11-error-handling" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('11. Error Handling and Best Practices')}
        </a>
        <a href="#12-advanced-features" className="text-blue-500 block cursor-pointer underline hover:text-blue-700">
          {_('12. Advanced Features')}
        </a>
      </nav>
    </menu>
  );
}

export function Body() {

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Tutorial: Creating a Markdown Documentation Plugin</H1>
      <P>
        This tutorial will guide you through creating a plugin that generates comprehensive markdown documentation from a processed <C>.idea</C> schema.
      </P>

      <section id="1-overview">
        <H2>1. Overview</H2>
        <P>The Markdown Documentation Plugin will:</P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Parse schema models, types, enums, and props</li>
          <li className="my-2">Generate structured markdown documentation</li>
          <li className="my-2">Include examples and usage notes</li>
          <li className="my-2">Create navigation and cross-references</li>
          <li className="my-2">Support different documentation formats and styles</li>
        </ul>
      </section>

      <section id="2-prerequisites">
        <H2>2. Prerequisites</H2>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Basic understanding of TypeScript/JavaScript</li>
          <li className="my-2">Familiarity with Markdown syntax</li>
          <li className="my-2">Understanding of the <C>idea-transformer</C> plugin system</li>
        </ul>
      </section>

      <section id="3-understanding-schema">
        <H2>3. Understanding the Schema Structure</H2>
        <P>
          Before creating the plugin, let's understand what documentation we can generate from a schema:
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </section>

      <section id="4-create-plugin">
        <H2>4. Create the Plugin Structure</H2>
        <P>Create a new file <C>markdown-docs-plugin.js</C>:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>
      </section>

      <section id="5-implement-generation">
        <H2>5. Implement Documentation Generation</H2>
        <P>Create functions to generate different sections of documentation:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>
      </section>

      <section id="6-generate-models">
        <H2>6. Generate Models Documentation</H2>
        <P>Implement model documentation generation:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[4]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[5]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[6]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[8]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[9]}
        </Code>
      </section>

      <section id="7-generate-types-enums-props">
        <H2>7. Generate Types, Enums, and Props Documentation</H2>
        <P>Implement documentation for other schema elements:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[10]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>
      </section>

      <section id="8-utility-functions">
        <H2>8. Utility Functions</H2>
        <P>Implement helper functions for formatting and generation:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[13]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[14]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[15]}
        </Code>
      </section>

      <section id="9-usage-in-schema">
        <H2>9. Usage in Schema</H2>
        <P>To use this plugin in your schema file:</P>
        <Code copy language='idea' className='bg-black text-white'>
          {examples[16]}
        </Code>
      </section>

      <section id="10-generated-output">
        <H2>10. Generated Output</H2>
        <P>The plugin will generate markdown documentation like this:</P>
        <Code copy language='markdown' className='bg-black text-white'>
          {examples[17]}
        </Code>
      </section>

      <section id="11-error-handling">
        <H2>11. Error Handling and Best Practices</H2>
        <P>Add proper error handling and validation:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[18]}
        </Code>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[19]}
        </Code>
      </section>

      <section id="12-advanced-features">
        <H2>12. Advanced Features</H2>
        <P>Add support for advanced documentation features:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[20]}
        </Code>
      </section>

      <section id="conclusion">
        <H1>Conclusion</H1>
        <P>This Markdown Documentation Plugin demonstrates how to:</P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Parse all schema elements (models, types, enums, props)</li>
          <li className="my-2">Generate comprehensive, structured documentation</li>
          <li className="my-2">Support multiple output formats (single file vs. multiple files)</li>
          <li className="my-2">Include examples, cross-references, and detailed attribute information</li>
          <li className="my-2">Provide flexible configuration options for different documentation needs</li>
        </ul>
        <P>The plugin is highly customizable and can be extended to support:</P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">Custom templates and themes</li>
          <li className="my-2">Diagram generation (Mermaid, PlantUML)</li>
          <li className="my-2">Integration with documentation sites (GitBook, Docusaurus)</li>
          <li className="my-2">API documentation formats (OpenAPI, GraphQL)</li>
          <li className="my-2">Multi-language documentation generation</li>
        </ul>
      </section>

      <Nav
        prev={{ text: 'HMTL Form Plugin', href: '/docs/tutorials/html-form-plugin' }}
        next={{ text: 'GraphQL Schema Plugin', href: '/docs/tutorials/graphql-schema-plugin' }}
      />
    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}
