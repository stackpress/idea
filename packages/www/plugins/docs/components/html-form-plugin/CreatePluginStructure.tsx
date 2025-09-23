import { useLanguage, Translate } from 'r22n';
import { H2, P, C } from '../index.js';
import Code from '../Code.js';

const pluginStructureExample = `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface HTMLFormConfig {
  output: string;
  title?: string;
  theme?: 'bootstrap' | 'tailwind' | 'custom';
  layout?: 'vertical' | 'horizontal' | 'inline';
  includeCSS?: boolean;
  includeJS?: boolean;
  submitUrl?: string;
  method?: 'GET' | 'POST';
}

export default async function htmlFormPlugin(
  props: PluginProps<{ config: HTMLFormConfig }>
) {
  const { config, schema, transformer, cwd } = props;

  // Validate configuration
  if (!config.output) {
    throw new Error('HTML Form Plugin requires "output" configuration');
  }

  // Set defaults
  const options = {
    title: config.title || 'Generated Form',
    theme: config.theme || 'bootstrap',
    layout: config.layout || 'vertical',
    includeCSS: config.includeCSS !== false,
    includeJS: config.includeJS !== false,
    submitUrl: config.submitUrl || '#',
    method: config.method || 'POST',
    ...config
  };

  // Generate HTML content
  const htmlContent = generateHTML(schema, options);

  // Write to output file
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, htmlContent, 'utf8');

  console.log(\`✅ HTML form generated: \${outputPath}\`);
}`;

export default function CreatePluginStructure() {
  const { _ } = useLanguage();
  
  return (
    <section id="create-the-plugin-structure">
      <H2>{_('4. Create the Plugin Structure')}</H2>
      <P>
        <Translate>
          The plugin structure provides the foundation for the HTML 
          form generator. This section covers the main plugin function, 
          configuration interface, and the basic workflow for 
          processing schemas and generating HTML output.
        </Translate>
      </P>
      <P>
        <Translate>
          Create a new file
        </Translate> <C>html-form-plugin.js</C>:
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {pluginStructureExample}
      </Code>
    </section>
  );
}