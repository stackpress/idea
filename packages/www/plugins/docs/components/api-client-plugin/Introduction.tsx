import { useLanguage, Translate } from 'r22n';
import { H1, P, C } from '../index.js';

export default function Introduction() {
  const { _ } = useLanguage();

  return (
    <section>
      <H1>{_('API Client Generator Plugin Tutorial')}</H1>
      <P>
        <Translate>
          This tutorial demonstrates how to create a plugin that generates
          REST and GraphQL API clients from <C>.idea</C> schema files. The
          plugin will transform your schema models into type-safe API client
          libraries with full CRUD operations.
        </Translate>
      </P>
    </section>
  );
}