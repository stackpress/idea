import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';
import Code from '../Code.js';

const errorHandlingExample = `function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('Markdown Documentation Plugin requires "output" configuration');
  }
  
  if (config.format && !['single', 'multiple'].includes(config.format)) {
    throw new Error(\`Unsupported format: \${config.format}\`);
  }
  
  if (config.template && !['default', 'api', 'guide'].includes(config.template)) {
    throw new Error(\`Unsupported template: \${config.template}\`);
  }
}`;

export default function ErrorHandlingAndBestPractices() {
  const { _ } = useLanguage();

  return (
    <section id="error-handling">
      <H2>{_('Error Handling and Best Practices')}</H2>
      <P>
        <Translate>
          Add proper error handling and validation:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {errorHandlingExample}
      </Code>
      <P>
        <Translate>
          Always validate configuration parameters and provide meaningful
          error messages to help users troubleshoot issues.
        </Translate>
      </P>
    </section>
  )
}