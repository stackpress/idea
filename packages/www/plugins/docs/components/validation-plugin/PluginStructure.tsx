//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const pluginStructureExample =
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface ZodConfig {
  output: string;
  generateTypes?: boolean;
  includeEnums?: boolean;
  customValidators?: Record<string, string>;
  errorMessages?: Record<string, string>;
  strictMode?: boolean;
  exportStyle?: 'named' | 'default' | 'namespace';
}

export default async function generateZodSchemas(
  props: PluginProps<{ config: ZodConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}`;

//--------------------------------------------------------------------//

export default function PluginStructure() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Plugin Structure Section Content */}
      <section id="plugin-structure">
        <H1>{_('3. Plugin Structure')}</H1>
        <P>
          <Translate>
            The plugin structure defines the core architecture and
            configuration interface for the Zod validation schema
            generator. This includes the main plugin function,
            configuration types, and the overall organization of
            the generated validation code.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {pluginStructureExample}
        </Code>
      </section>
    </>
  );
}