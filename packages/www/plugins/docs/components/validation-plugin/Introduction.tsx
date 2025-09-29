//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../index.js';

export default function Introduction() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Creating a Validation Schema Generator Plugin */}
      <section id="introduction">
      <H1>{_('Validation Schema Generator Plugin Tutorial')}</H1>
      <P>
        <Translate>
          This tutorial demonstrates how to create a plugin that generates
          Zod validation schemas from <C>.idea</C> schema files. The plugin
          will transform your schema models into type-safe validation
          schemas with comprehensive validation rules.
        </Translate>
      </P>
      </section>
    </>
  );
}