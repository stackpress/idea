//module
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const enhancedErrorHandling =
  `export default async function mysqlTablesPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Validate schema has models
    if (!schema.model || Object.keys(schema.model).length === 0) {
      console.warn('⚠️  No models found in schema. Skipping MySQL table generation.');
      return;
    }
    
    // Generate SQL
    const sqlContent = generateSQL(schema, config);
    
    // Ensure output directory exists
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Write file
    await fs.writeFile(outputPath, sqlContent, 'utf8');
    
    console.log(\`✅ MySQL tables generated: \${outputPath}\`);
    console.log(\`📊 Generated \${Object.keys(schema.model).length} table(s)\`);
    
  } catch (error) {
    console.error(\`❌ MySQL Tables Plugin failed: \${error.message}\`);
    throw error;
  }
}`

//----------------------------------------------------------------------

const configValidation =
  `function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('MySQL Tables Plugin requires "output" configuration');
  }
  
  if (config.engine && !['InnoDB', 'MyISAM', 'Memory'].includes(config.engine)) {
    throw new Error(\`Unsupported MySQL engine: \${config.engine}\`);
  }
}`

//----------------------------------------------------------------------

export default function BestPractices() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Best Practices Section Content */}
      <section id="best-practices">
        <H1>{_('9. Error Handling and Best Practices')}</H1>
        <P>
          <Translate>
            Add proper error handling and validation to make your plugin
            robust and user-friendly.
          </Translate>
        </P>

        <H2>{_('9.1. Enhanced Error Handling')}</H2>
        <Code
          copy
          language="typescript"
          className='bg-black text-white'
        >{enhancedErrorHandling}
        </Code>

        <H2>{_('9.2. Configuration Validation')}</H2>
        <Code
          copy
          language="typescript"
          className='bg-black text-white'
        >
          {configValidation}
        </Code>
      </section>
    </>
  );
}