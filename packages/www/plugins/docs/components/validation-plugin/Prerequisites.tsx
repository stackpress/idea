import { useLanguage, Translate } from 'r22n';
import { H2, P, C } from '../index.js';

export default function Prerequisites() {
  const { _ } = useLanguage();

  return (
    <section id="prerequisites">
      <H2>{_('2. Prerequisites')}</H2>
      <P>
        <Translate>
          Before implementing the Zod validation schema generator plugin,
          ensure you have the necessary development environment and knowledge.
          This section covers the essential requirements for successful plugin
          creation and Zod integration.
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li>
          <Translate>Node.js 16+ and npm/yarn</Translate>
        </li>
        <li>
          <Translate>TypeScript 4.0+</Translate>
        </li>
        <li>
          <Translate>Zod 3.0+</Translate>
        </li>
        <li>
          <Translate>Basic understanding of validation concepts</Translate>
        </li>
        <li>
          <Translate>
            Familiarity with the <C>@stackpress/idea-transformer</C> library
          </Translate>
        </li>
        <li>
          <Translate>
            Understanding of <C>.idea</C> schema format
          </Translate>
        </li>
      </ul>
    </section>
  );
}