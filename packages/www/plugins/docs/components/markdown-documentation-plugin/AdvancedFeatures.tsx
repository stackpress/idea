import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';

export default function AdvancedFeatures() {
  const { _ } = useLanguage();

  return (
    <section id="advanced-features">
      <H2>{_('Advanced Features')}</H2>
      <P>
        <Translate>
          The plugin can be extended with additional features:
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            Custom templates and themes
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Diagram generation (Mermaid, PlantUML)
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Integration with documentation sites (GitBook, Docusaurus)
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            API documentation formats (OpenAPI, GraphQL)
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Multi-language documentation generation
          </Translate>
        </li>
      </ul>
    </section>
  )
}