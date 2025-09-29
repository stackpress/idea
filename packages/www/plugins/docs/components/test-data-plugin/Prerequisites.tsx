//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../index.js';

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
          Before creating this plugin, you should have the following 
          knowledge and tools:
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>Node.js 16+ and npm/yarn</Translate>
        </li>
        <li className="my-2">
          <Translate>TypeScript 4.0+</Translate>
        </li>
        <li className="my-2">
          <Translate>Faker.js 8.0+ (for realistic data generation)</Translate>
        </li>
        <li className="my-2">
          <Translate>Basic understanding of testing concepts</Translate>
        </li>
        <li className="my-2">
          <Translate>Familiarity with the</Translate> <C>@stackpress/idea-transformer</C> <Translate>library</Translate>
        </li>
        <li className="my-2">
          <Translate>Understanding of</Translate> <C>.idea</C> <Translate>schema format</Translate>
        </li>
      </ul>
      </section>
    </>
  );
}