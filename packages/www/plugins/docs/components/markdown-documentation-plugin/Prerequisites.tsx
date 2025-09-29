//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, C } from '../index.js';

export default function Prerequisites() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Prerequisites Section Content */}
      <section id="prerequisites">
      <H1>{_('2. Prerequisites')}</H1>
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
    </>
  )
}