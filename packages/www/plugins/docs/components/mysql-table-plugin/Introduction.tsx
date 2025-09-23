import { useLanguage, Translate } from 'r22n';
import { H1, P } from '../index.js';

export default function Introduction() {
  const { _ } = useLanguage();
  
  return (
    <section>
      <H1>{_('Creating a MySQL Tables Plugin')}</H1>
      <P>
        <Translate>
          This tutorial will guide you through creating a plugin that
          generates MySQL CREATE TABLE statements from a processed .idea
          schema.
        </Translate>
      </P>
    </section>
  );
}