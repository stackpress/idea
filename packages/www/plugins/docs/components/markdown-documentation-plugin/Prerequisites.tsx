import { useLanguage, Translate } from 'r22n';
import { H2, C } from '../index.js';

export default function Prerequisites() {
  const { _ } = useLanguage();

  return (
    <section id="prerequisites">
      <H2>{_('Prerequisites')}</H2>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            Basic understanding of TypeScript/JavaScript
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Familiarity with Markdown syntax
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Understanding of the <C>idea-transformer</C> plugin system
          </Translate>
        </li>
      </ul>
    </section>
  )
}