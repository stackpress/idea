import { useLanguage, Translate } from 'r22n';
import { H2, P, C, SS } from '../index.js';

export default function Overview() {
  const { _ } = useLanguage();

  return (
    <section id="overview">
      <H2>{_('Overview')}</H2>
      <P>
        <Translate>
          GraphQL is a query language and runtime for APIs that provides a 
          complete and understandable description of the data in your API. 
          This plugin transforms your <C>.idea</C> schema definitions into 
          comprehensive GraphQL type definitions that enable type-safe API 
          development with excellent tooling support.
        </Translate>
      </P>
      <P>
        <Translate>
          This plugin generates GraphQL type definitions from your 
          <C>.idea</C> schema, including:
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            <SS>Types</SS>: GraphQL object types from schema models
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            <SS>Inputs</SS>: GraphQL input types for mutations
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            <SS>Enums</SS>: GraphQL enum types from schema enums
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            <SS>Scalars</SS>: Custom scalar types when needed
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            <SS>Queries and Mutations</SS>: Basic CRUD operations
          </Translate>
        </li>
      </ul>
    </section>
  );
}