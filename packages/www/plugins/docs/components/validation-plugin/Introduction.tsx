import { useLanguage, Translate } from 'r22n';
import { H1, P, C } from '../index.js';

export default function Introduction() {
  const { _ } = useLanguage();

  return (
    <section>
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
  );
}