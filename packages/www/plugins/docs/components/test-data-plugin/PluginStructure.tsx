import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';
import Code from '../Code.js';

const pluginStructureExample = `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface TestDataConfig {
  output: string;
  format: 'json' | 'typescript' | 'javascript';
  count?: number;
  seed?: number;
  locale?: string;
  generateFactories?: boolean;
  generateFixtures?: boolean;
  customGenerators?: Record<string, string>;
  relationships?: boolean;
}

export default async function generateTestData(
  props: PluginProps<{ config: TestDataConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}`;

export default function PluginStructure() {
  const { _ } = useLanguage();
  
  return (
    <section id="plugin-structure">
      <H2>{_('3. Plugin Structure')}</H2>
      <P>
        <Translate>
          The following code shows how to generally layout the plugin so 
          you can focus on the implementation.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {pluginStructureExample}
      </Code>
    </section>
  );
}