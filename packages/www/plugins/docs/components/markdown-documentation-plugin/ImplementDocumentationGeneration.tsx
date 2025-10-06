//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const documentationGenerationExample = 
`async function generateSingleFile(schema: any, options: any, transformer: any): Promise<void> {
  let content = generateHeader(options);
  
  // Generate table of contents
  if (options.includeIndex) {
    content += generateTableOfContents(schema, options);
  }
  
  // Generate sections
  for (const section of options.sections) {
    switch (section) {
      case 'models':
        if (schema.model) {
          content += generateModelsSection(schema.model, schema, options);
        }
        break;
      case 'types':
        if (schema.type) {
          content += generateTypesSection(schema.type, schema, options);
        }
        break;
      case 'enums':
        if (schema.enum) {
          content += generateEnumsSection(schema.enum, options);
        }
        break;
      case 'props':
        if (schema.prop) {
          content += generatePropsSection(schema.prop, options);
        }
        break;
    }
  }
  
  // Add footer
  content += generateFooter(options);
  
  // Write to file
  const outputPath = await transformer.loader.absolute(options.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, content, 'utf8');
}`

//----------------------------------------------------------------------

export default function ImplementDocumentationGeneration() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Implement Documentation Generation Section Content */}
      <section id="implement-generation">
      <H1>{_('5. Implement Documentation Generation')}</H1>
      <P>
        <Translate>
          Create functions to generate different sections of documentation:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {documentationGenerationExample}
      </Code>
      </section>
    </>
  )
}