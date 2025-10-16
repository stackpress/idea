//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const utilityFunctionsExample =
  `function formatType(type: string, multiple: boolean = false): string {
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

//--------------------------------------------------------------------//

export default function UtilityFunctions() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Utility Functions Section Content */}
      <section id="utility-functions">
        <H1>{_('8. Utility Functions')}</H1>
        <P>
          <Translate>
            Create helper functions for formatting and processing:
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {utilityFunctionsExample}
        </Code>
      </section>
    </>
  )
}