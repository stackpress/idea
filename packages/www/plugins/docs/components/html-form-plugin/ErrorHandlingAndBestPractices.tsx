import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';
import Code from '../Code.js';

const errorHandlingExample = `export default async function htmlFormPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;

  try {
    // Validate configuration
    validateConfig(config);

    // Validate schema has models
    if (!schema.model || Object.keys(schema.model).length === 0) {
      console.warn('⚠️  No models found in schema. Skipping HTML form generation.');
      return;
    }

    // Generate HTML
    const htmlContent = generateHTML(schema, config);

    // Ensure output directory exists
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write file
    await fs.writeFile(outputPath, htmlContent, 'utf8');

    console.log(\`✅ HTML form generated: \${outputPath}\`);
    console.log(\`📊 Generated forms for \${Object.keys(schema.model).length} model(s)\`);

  } catch (error) {
    console.error(\`❌ HTML Form Plugin failed: \${error.message}\`);
    throw error;
  }
}

function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('HTML Form Plugin requires "output" configuration');
  }

  if (config.theme && !['bootstrap', 'tailwind', 'custom'].includes(config.theme)) {
    throw new Error(\`Unsupported theme: \${config.theme}\`);
  }

  if (config.layout && !['vertical', 'horizontal', 'inline'].includes(config.layout)) {
    throw new Error(\`Unsupported layout: \${config.layout}\`);
  }

  if (config.method && !['GET', 'POST'].includes(config.method)) {
    throw new Error(\`Unsupported HTTP method: \${config.method}\`);
  }
}`;

export default function ErrorHandlingAndBestPractices() {
  const { _ } = useLanguage();
  
  return (
    <section id="error-handling-and-best-practices">
      <H2>{_('10. Error Handling and Best Practices')}</H2>
      <P>
        <Translate>
          Proper error handling and following best practices ensure 
          that your plugin is robust and reliable. This section covers 
          validation techniques, error reporting, and recommended 
          patterns for plugin development.
        </Translate>
      </P>
      <P>
        <Translate>
          Add proper error handling and validation:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {errorHandlingExample}
      </Code>
    </section>
  );
}