import { H1, H2, P, SS, C } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const pluginExamples = [
  `plugin "path/to/plugin.js" {
  configKey "configValue"
  nestedConfig {
    option "value"
    flag true
  }
}`,
  `// TypeScript interface generation
plugin "./plugins/typescript-generator.js" {
  output "./src/types/schema.ts"
  namespace "Schema"
  exportType "named"
  includeComments true
  formatting {
    indent 2
    semicolons true
    trailingCommas true
  }
}

// Database schema generation
plugin "./plugins/database-generator.js" {
  output "./database/schema.sql"
  dialect "postgresql"
  includeIndexes true
  includeForeignKeys true
  tablePrefix "app_"
  options {
    dropExisting false
    addTimestamps true
    charset "utf8mb4"
  }
}

// API documentation generation
plugin "./plugins/openapi-generator.js" {
  output "./docs/api.yaml"
  version "1.0.0"
  title "My API Documentation"
  description "Comprehensive API documentation generated from schema"
  servers [
    {
      url "https://api.example.com/v1"
      description "Production server"
    }
    {
      url "https://staging-api.example.com/v1"
      description "Staging server"
    }
  ]
  security {
    type "bearer"
    scheme "JWT"
  }
}

// Form generation
plugin "./plugins/form-generator.js" {
  output "./src/components/forms/"
  framework "react"
  styling "tailwind"
  validation "zod"
  features {
    typescript true
    storybook true
    tests true
  }
  components {
    inputWrapper "FormField"
    submitButton "SubmitButton"
    errorMessage "ErrorText"
  }
}`,
  `plugin "./plugins/my-plugin.js" {
  // Output configuration
  output "./generated/output.ts"
  outputDir "./generated/"
  
  // Format and style options
  format "typescript" // or "javascript", "json", "yaml"
  style "camelCase"   // or "snake_case", "kebab-case"
  
  // Feature flags
  includeComments true
  generateTests false
  addValidation true
  
  // Framework-specific options
  framework "react"     // or "vue", "angular", "svelte"
  styling "tailwind"    // or "bootstrap", "material", "custom"
  
  // Advanced configuration
  templates {
    model "./templates/model.hbs"
    enum "./templates/enum.hbs"
  }
  
  // Custom options (plugin-specific)
  customOptions {
    apiVersion "v1"
    includeMetadata true
    compressionLevel 9
  }
}`,
  `// Generate TypeScript types
plugin "./plugins/typescript.js" {
  output "./src/types/index.ts"
}

// Generate database schema
plugin "./plugins/database.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

// Generate API documentation
plugin "./plugins/docs.js" {
  output "./docs/api.md"
  format "markdown"
}

// Generate form components
plugin "./plugins/forms.js" {
  output "./src/forms/"
  framework "react"
}

// Generate validation schemas
plugin "./plugins/validation.js" {
  output "./src/validation/index.ts"
  library "zod"
}`,
`// Example plugin structure
import type { PluginProps } from '@stackpress/idea-transformer/types';

interface MyPluginConfig {
  output: string;
  format?: 'typescript' | 'javascript';
  includeComments?: boolean;
}

export default async function myPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('Output path is required');
  }
  
  // Process schema
  const content = generateContent(schema, config);
  
  // Write output
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
  
  console.log(\`✅ Generated: \${outputPath}\`);
}`
]

export default function Plugin() {
  return (
    <section id="plugin">
      <H1>Plugin</H1>
      <P>
        The <C>plugin</C> directive configures code generation plugins that process your schema and generate various outputs like TypeScript interfaces, database schemas, API documentation, and more.
      </P>
      <H2>Syntax</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {pluginExamples[0]}
      </Code>

      <H2>Structure</H2>
      <ul className="px-lh-30 px-px-20">
        <li className="list-disc"><SS>Path:</SS> Relative or absolute path to the plugin file</li>
        <li className="list-disc"><SS>Configuration Block:</SS> Key-value pairs that configure the plugin behavior</li>
        <li className="list-disc"><SS>Nested Configuration:</SS> Support for complex configuration structures</li>
      </ul>

      <H2>Example</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {pluginExamples[1]}
      </Code>

      <H2>Plugin Configuration Options</H2>
      <P>
        Common configuration patterns across different plugin types:
      </P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {pluginExamples[2]}
      </Code>

      <H2>Multiple Plugins Execution</H2>
      <P>
        You can configure multiple plugins to generate different outputs from the same schema:
      </P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {pluginExamples[3]}
      </Code>

      <H2>Plugin Development</H2>
      <P>
        Plugins are JavaScript/TypeScript modules that export a default function:
      </P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {pluginExamples[4]}
      </Code>
    </section>
  )
}
