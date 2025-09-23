import { useLanguage, Translate } from 'r22n';
import { H2, P, C } from '../index.js';

export default function Prerequisites() {
  const { _ } = useLanguage();

  return (
    <section id="prerequisites">
      <H2>{_('Prerequisites')}</H2>
      <P>
        <Translate>
          Before implementing the TypeScript interface generator plugin, 
          ensure you have the necessary development environment and 
          knowledge. This section covers the essential requirements for 
          successful plugin creation and TypeScript integration.
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
            TypeScript 4.0+ development experience
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
  );
}