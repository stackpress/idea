//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../../../docs/components/index.js';

export default function Prerequisites() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Prerequisites Section Content */}
      <section id="prerequisites">
      <H1>{_('2. Prerequisites')}</H1>
      <P>
        <Translate>
          Before implementing the GraphQL schema generator plugin, ensure you 
          have the necessary development environment and knowledge. This 
          section covers the essential requirements for successful plugin 
          creation and GraphQL integration.
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            Node.js 16+ and npm/yarn
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Basic understanding of GraphQL
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Familiarity with the <C>@stackpress/idea-transformer</C> library
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Understanding of <C>.idea</C> schema format
          </Translate>
        </li>
      </ul>
      </section>
    </>
  );
}