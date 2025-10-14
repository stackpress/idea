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
            Before implementing the Zod validation schema generator
            plugin, ensure you have the necessary development environment
            and knowledge. This section covers the essential requirements
            for successful plugin creation and Zod integration.
          </Translate>
        </P>
        <ul className="list-disc my-4 pl-6">
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
            <Translate>
              Basic understanding of validation concepts
            </Translate>
          </li>
          <li>
            <Translate>
              Familiarity with the <C>@stackpress/idea-transformer</C>
              library
            </Translate>
          </li>
          <li>
            <Translate>
              Understanding of <C>.idea</C> schema format
            </Translate>
          </li>
        </ul>
      </section>
    </>
  );
}