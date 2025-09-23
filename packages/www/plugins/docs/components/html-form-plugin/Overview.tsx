import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';

export default function Overview() {
  const { _ } = useLanguage();
  
  return (
    <section id="overview">
      <H2>{_('1. Overview')}</H2>
      <P>
        <Translate>
          This section provides an overview of what the HTML Form 
          Plugin accomplishes and its key features. The plugin 
          transforms schema definitions into fully functional HTML 
          forms with proper validation, styling, and accessibility 
          features.
        </Translate>
      </P>
      <P>
        <Translate>
          The HTML Form Plugin will:
        </Translate>
      </P>
      <ul className="px-ml-20 list-disc">
        <li>
          <Translate>
            Parse schema models and their columns
          </Translate>
        </li>
        <li>
          <Translate>
            Generate HTML form elements based on field types and 
            attributes
          </Translate>
        </li>
        <li>
          <Translate>
            Include validation attributes and constraints
          </Translate>
        </li>
        <li>
          <Translate>
            Create responsive, accessible forms with proper styling
          </Translate>
        </li>
        <li>
          <Translate>
            Support different form layouts and themes
          </Translate>
        </li>
      </ul>
    </section>
  );
}