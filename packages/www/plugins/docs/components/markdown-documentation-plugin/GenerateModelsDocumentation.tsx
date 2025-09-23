import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';
import Code from '../Code.js';

const modelsGenerationExample = 
`function generateModelsSection(models: any, schema: any, options: any): string {
  let content = '## Models\\n\\n';
  content += 'Models represent the main data structures in your application.\\n\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += generateModelDocumentation(modelName, model, schema, options);
  }
  
  return content;
}`;

export default function GenerateModelsDocumentation() {
  const { _ } = useLanguage();

  return (
    <section id="generate-models">
      <H2>{_('Generate Models Documentation')}</H2>
      <P>
        <Translate>
          Implement model documentation generation:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {modelsGenerationExample}
      </Code>
    </section>
  )
}