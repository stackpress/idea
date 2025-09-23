import { useLanguage, Translate } from 'r22n';
import { H2, H3, P } from '../index.js';
import Code from '../Code.js';

const corePluginExample = `export default async function generateTestData(
  props: PluginProps<{ config: TestDataConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate test data content
    let content = '';
    
    // Add file header and imports
    content += generateFileHeader(config);
    content += generateImports(config);
    
    // Generate data factories if requested
    if (config.generateFactories) {
      content += generateFactories(schema, config);
    }
    
    // Generate mock data
    if (schema.model) {
      content += generateMockData(schema.model, config);
    }
    
    // Generate fixtures if requested
    if (config.generateFixtures) {
      content += generateFixtures(schema, config);
    }
    
    // Generate main export
    content += generateMainExport(schema, config);
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(\`✅ Test data generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ Test data generation failed:', error.message);
    throw error;
  }
}`;

const headerAndImportsExample = `function generateFileHeader(config: TestDataConfig): string {
  const timestamp = new Date().toISOString();
  return \`/**
 * Generated Test Data and Fixtures
 * Generated at: \${timestamp}
 * Format: \${config.format}
 * Count: \${config.count || 10}
 * Seed: \${config.seed || 'random'}
 * 
 * This file is auto-generated. Do not edit manually.
 */

\`;
}

function generateImports(config: TestDataConfig): string {
  let imports = '';
  
  if (config.format === 'typescript' || config.format === 'javascript') {
    imports += \`import { faker } from '@faker-js/faker';\\n\\n\`;
    
    if (config.seed) {
      imports += \`// Set seed for reproducible data\\nfaker.seed(\${config.seed});\\n\\n\`;
    }
    
    if (config.locale && config.locale !== 'en') {
      imports += \`// Set locale\\nfaker.setLocale('\${config.locale}');\\n\\n\`;
    }
  }
  
  return imports;
}`;

export default function CorePluginFunction() {
  const { _ } = useLanguage();
  
  return (
    <section id="implementation">
      <H2>{_('4. Implementation')}</H2>
      <P>
        <Translate>
          The implementation section covers the core plugin function and 
          supporting utilities that handle test data generation. This 
          includes the main plugin entry point, data generation functions, 
          and configuration validation.
        </Translate>
      </P>

      <H3>{_('4.1. Core Plugin Function')}</H3>
      <P>
        <Translate>
          The core plugin function serves as the main entry point for test 
          data generation. It orchestrates the entire process from 
          configuration validation to file output, handling different 
          formats and generation options.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {corePluginExample}
      </Code>

      <H3>{_('4.2. Generation Functions')}</H3>
      <P>
        <Translate>
          The generation functions provide the core logic for creating 
          different types of test data content. These utility functions 
          handle file headers, imports, data factories, and various data 
          generation patterns based on schema definitions.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {headerAndImportsExample}
      </Code>
    </section>
  );
}