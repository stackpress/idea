//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';

export default function Introduction() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Creating a MySQL Tables Plugin */}
      <section>
        <H1>{_('Creating a MySQL Tables Plugin')}</H1>
        <P>
          <Translate>
            This tutorial will guide you through creating a plugin that
            generates MySQL CREATE TABLE statements from a processed
            .idea schema.
          </Translate>
        </P>
      </section>
    </>
  );
}