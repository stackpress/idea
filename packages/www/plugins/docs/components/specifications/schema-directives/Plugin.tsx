//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, SS, C } from '../../../../docs/components/index.js';
import Code from '../../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const pluginExamples = [
  `plugin "path/to/plugin.js" {
  configKey "configValue"
  nestedConfig {
    option "value"
    flag true
  }
}`,

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

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
];

//--------------------------------------------------------------------//

export default function Plugin() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Plugin Section Content */}
      <section id="plugin">
        <H1>{_('Plugin')}</H1>
        <P>
          <Translate>
            The <C>plugin</C> directive configures code generation
            plugins that process your schema and generate various
            outputs like TypeScript interfaces, database schemas, API
            documentation, and more.
          </Translate>
        </P>

        {/* Syntax Section Content */}
        <section>
          <H2>{_('Syntax')}</H2>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {pluginExamples[0]}
          </Code>
        </section>

        {/* Structure Section Content */}
        <section>
          <H2>{_('Structure')}</H2>
          <ul className="px-lh-30 px-px-20">
            <li className="list-disc">
              <SS>{_('Path:')}</SS>{' '}
              <Translate>
                Relative or absolute path to the plugin file
              </Translate>
            </li>
            <li className="list-disc">
              <SS>{_('Configuration Block:')}</SS>{' '}
              <Translate>
                Key-value pairs that configure the plugin behavior
              </Translate>
            </li>
            <li className="list-disc">
              <SS>{_('Nested Configuration:')}</SS>{' '}
              <Translate>
                Support for complex configuration structures
              </Translate>
            </li>
          </ul>
        </section>

        {/* Example Section Content */}
        <section>
          <H2>{_('Example')}</H2>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {pluginExamples[1]}
          </Code>
        </section>

        {/* Plugin Configuration Options Section Content */}
        <section>
          <H2>{_('Plugin Configuration Options')}</H2>
          <P>
            <Translate>
              Common configuration patterns across different plugin types:
            </Translate>
          </P>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {pluginExamples[2]}
          </Code>
        </section>

        {/* Multiple Plugins Execution Section Content */}
        <section>
          <H2>{_('Multiple Plugins Execution')}</H2>
          <P>
            <Translate>
              You can configure multiple plugins to generate different
              outputs from the same schema:
            </Translate>
          </P>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {pluginExamples[3]}
          </Code>
        </section>

        {/* Plugin Development Section Content */}
        <section>
          <H2>{_('Plugin Development')}</H2>
          <P>
            <Translate>
              Plugins are JavaScript/TypeScript modules that export a
              default function:
            </Translate>
          </P>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {pluginExamples[4]}
          </Code>
        </section>
      </section>
    </>
  );
}
