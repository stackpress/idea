import { useLanguage, Translate } from 'r22n';
import { H2, P, Code } from '../index.js';

const pluginStructureExample = `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface GraphQLConfig {
  output: string;
  includeQueries?: boolean;
  includeMutations?: boolean;
  includeSubscriptions?: boolean;
  customScalars?: Record<string, string>;
  generateInputTypes?: boolean;
}

export default async function generateGraphQLSchema(
  props: PluginProps<{ config: GraphQLConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}`;

export default function PluginStructure() {
  const { _ } = useLanguage();

  return (
    <section id="plugin-structure">
      <H2>{_('Plugin Structure')}</H2>
      <P>
        <Translate>
          The plugin structure defines the core architecture and configuration 
          interface for the GraphQL schema generator. This includes the main 
          plugin function, configuration types, and the overall organization 
          of the generated GraphQL schema definitions.
        </Translate>
      </P>
      <Code lang='typescript'>
        {pluginStructureExample}
      </Code>
    </section>
  );
}