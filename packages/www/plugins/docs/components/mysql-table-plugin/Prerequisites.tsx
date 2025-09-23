import { useLanguage, Translate } from 'r22n';
import { H1, P } from '../index.js';

export default function Prerequisites() {
  const { _ } = useLanguage();
  
  return (
    <section id="prerequisites">
      <H1>{_('2. Prerequisites')}</H1>
      <P>
        <Translate>
          Before creating this plugin, you should have the following
          knowledge and tools:
        </Translate>
      </P>
      <ul className="px-ml-20 list-disc">
        <li>
          <Translate>
            Basic understanding of TypeScript/JavaScript
          </Translate>
        </li>
        <li>
          <Translate>
            Familiarity with MySQL and SQL syntax
          </Translate>
        </li>
        <li>
          <Translate>
            Understanding of the idea-transformer plugin system
          </Translate>
        </li>
      </ul>
    </section>
  );
}