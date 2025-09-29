//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../index.js';

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
          Before implementing the API client generator plugin, ensure you
          have the necessary development environment and dependencies. This
          section covers the essential requirements and setup needed to
          successfully create and use the plugin.
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li>
          <Translate>Node.js and npm/yarn package manager</Translate>
        </li>
        <li>
          <Translate>Basic understanding of TypeScript and API design</Translate>
        </li>
        <li>
          <Translate>Familiarity with REST and/or GraphQL concepts</Translate>
        </li>
        <li>
          <Translate>Knowledge of .idea schema structure</Translate>
        </li>
        <li>
          <Translate>Understanding of plugin development patterns</Translate>
        </li>
      </ul>
      </section>
    </>
  );
}