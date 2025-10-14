//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, Code } from '../../../docs/components/index.js';

//code examples
//----------------------------------------------------------------- 

const pluginStructureExample = 
`import type { PluginProps } from '@stackpress/idea-transformer/types';
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

//-----------------------------------------------------------------

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
          configuration interface for the GraphQL schema generator.
          This includes the main plugin function, configuration types, 
          and the overall organization of the generated GraphQL schema 
          definitions.
        </Translate>
      </P>
      <Code lang="typescript">
        {pluginStructureExample}
      </Code>
      </section>
    </>
  );
}