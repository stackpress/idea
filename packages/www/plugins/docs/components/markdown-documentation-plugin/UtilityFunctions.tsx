import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';
import Code from '../Code.js';

const utilityFunctionsExample = `function formatType(type: string, multiple: boolean = false): string {
  let formattedType = type;
  
  // Add array notation if multiple
  if (multiple) {
    formattedType += '[]';
  }
  
  // Add markdown formatting for built-in types
  const builtInTypes = ['String', 'Number', 'Boolean', 'Date', 'JSON'];
  if (builtInTypes.includes(type)) {
    formattedType = \`\\\`\${formattedType}\\\`\`;
  } else {
    // Link to other types/enums
    formattedType = \`[\${formattedType}](#\${type.toLowerCase()})\`;
  }
  
  return formattedType;
}`;

export default function UtilityFunctions() {
  const { _ } = useLanguage();

  return (
    <section id="utility-functions">
      <H2>{_('Utility Functions')}</H2>
      <P>
        <Translate>
          Create helper functions for formatting and processing:
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {utilityFunctionsExample}
      </Code>
    </section>
  )
}