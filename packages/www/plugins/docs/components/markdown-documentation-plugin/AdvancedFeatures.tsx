//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';

export default function AdvancedFeatures() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Advanced Features Section Content */}
      <section id="advanced-features">
        <H1>{_('12. Advanced Features')}</H1>
        <P>
          <Translate>
            The plugin can be extended with additional features:
          </Translate>
        </P>
        <ul className="list-disc my-4 pl-6">
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
    </>
  )
}