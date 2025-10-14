//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const modelsGenerationExample =
  `function generateModelsSection(models: any, schema: any, options: any): string {
  let content = '## Models\\n\\n';
  content += 'Models represent the main data structures in your application.\\n\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += generateModelDocumentation(modelName, model, schema, options);
  }
  
  return content;
}`;

//-----------------------------------------------------------------

export default function GenerateModelsDocumentation() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Generate Models Documentation Section Content */}
      <section id="generate-models">
        <H1>{_('6. Generate Models Documentation')}</H1>
        <P>
          <Translate>
            Implement model documentation generation:
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {modelsGenerationExample}
        </Code>
      </section>
    </>
  )
}