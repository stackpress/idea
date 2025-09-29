//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, SS, C } from '../index.js';

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
          Before starting this tutorial, ensure you have the necessary 
          knowledge and tools to successfully implement the HTML Form 
          Plugin. These prerequisites will help you understand the 
          concepts and follow along with the implementation.
        </Translate>
      </P>
      <ul className="px-ml-20 list-disc">
        <li>
          <Translate>
            Basic understanding of
          </Translate> <SS>TypeScript/JavaScript</SS>
        </li>
        <li>
          <Translate>
            Familiarity with HTML forms and CSS
          </Translate>
        </li>
        <li>
          <Translate>
            Understanding of the
          </Translate> <C>idea-transformer</C> <Translate>
            plugin system
          </Translate>
        </li>
      </ul>
      </section>
    </>
  );
}