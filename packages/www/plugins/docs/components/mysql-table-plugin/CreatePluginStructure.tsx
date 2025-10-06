//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const basicPluginStructure =
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface MySQLPluginConfig {
  output: string;
  database?: string;
  engine?: string;
  charset?: string;
  collation?: string;
}

export default async function mysqlTablesPlugin(
  props: PluginProps<{ config: MySQLPluginConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('MySQL Tables Plugin requires "output" configuration');
  }
  
  // Set defaults
  const options = {
    database: config.database || 'app_database',
    engine: config.engine || 'InnoDB',
    charset: config.charset || 'utf8mb4',
    collation: config.collation || 'utf8mb4_unicode_ci',
    ...config
  };
  
  // Generate SQL content
  const sqlContent = generateSQL(schema, options);
  
  // Write to output file
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, sqlContent, 'utf8');
  
  console.log(\`✅ MySQL tables generated: \${outputPath}\`);
}`

//----------------------------------------------------------------------

export default function CreatePluginStructure() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Create the Plugin Structure Section Content */}
      <section id="create-plugin-structure">
        <H1>{_('4. Create the Plugin Structure')}</H1>
        <P>
          <Translate>
            Create a new file mysql-tables-plugin.js. This will be the main
            entry point for our plugin that handles configuration validation
            and orchestrates the SQL generation process.
          </Translate>
        </P>
        <H2>{_('Basic Plugin Structure')}</H2>
        <Code
          copy
          language="typescript"
          className='bg-black text-white'
        >{basicPluginStructure}
        </Code>
      </section>
    </>
  );
}