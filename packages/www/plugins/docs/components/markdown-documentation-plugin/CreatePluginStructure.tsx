import { useLanguage, Translate } from 'r22n';
import { H2, P, C } from '../index.js';
import Code from '../Code.js';

const pluginStructureExample = `import type { PluginProps } from '@stackpress/idea-transformer/types';
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
}`;

export default function CreatePluginStructure() {
  const { _ } = useLanguage();

  return (
    <section id="create-plugin">
      <H2>{_('Create the Plugin Structure')}</H2>
      <P>
        <Translate>
          Create a new file <C>markdown-docs-plugin.js</C>:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {pluginStructureExample}
      </Code>
    </section>
  )
}