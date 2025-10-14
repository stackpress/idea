//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';

export default function Overview() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Overview Section Content */}
      <section id="overview">
      <H1>{_('1. Overview')}</H1>
      <P>
        <Translate>
          API clients provide a convenient interface for interacting with
          backend services. This plugin generates type-safe API clients
          from your schema, including:
        </Translate>
      </P>
      <ul className="list-disc my-4 pl-6">
        <li>
          <Translate>Type-safe REST and GraphQL client generation</Translate>
        </li>
        <li>
          <Translate>Full CRUD operations for all models</Translate>
        </li>
        <li>
          <Translate>Configurable authentication strategies</Translate>
        </li>
        <li>
          <Translate>Error handling and validation</Translate>
        </li>
        <li>
          <Translate>Support for multiple HTTP libraries</Translate>
        </li>
        <li>
          <Translate>Request cancellation and custom headers</Translate>
        </li>
      </ul>
      </section>
    </>
  );
}