//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../../../docs/components/index.js';

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
            This tutorial guides you through building a plugin that creates
            Zod validation schemas from <C>.idea</C> schema files. With this
            plugin, your schema models become type-safe validation schemas
            with complete validation rules.
          </Translate>
        </P>
      </section>
    </>
  );
}