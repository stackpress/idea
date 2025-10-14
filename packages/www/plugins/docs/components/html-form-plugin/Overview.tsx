//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';

export default function Overview() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <>
      {/* Overview Section Content */}
      <section id="overview">
        <H1>{_('1. Overview')}</H1>
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
        <ul className="list-disc px-ml-20">
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
    </>
  );
}