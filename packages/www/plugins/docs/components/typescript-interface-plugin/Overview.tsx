//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C, SS } from '../../../docs/components/index.js';

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
            TypeScript interfaces provide compile-time type checking
            and excellent IDE support. This plugin transforms your
            <C>.idea</C> schema definitions into comprehensive Type
            Script type definitions that integrate seamlessly with
            your development workflow and provide robust type safety
            throughout your application.
          </Translate>
        </P>
        <P>
          <Translate>
            This plugin generates TypeScript definitions from your
            <C>.idea</C> schema, including:
          </Translate>
        </P>
        <ul className="list-disc my-4 pl-6">
          <li className="my-2">
            <Translate>
              <SS>Interfaces</SS>: TypeScript interfaces from schema
              models
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Types</SS>: Custom types and type aliases
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Enums</SS>: TypeScript enums with multiple output
              formats
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Utility Types</SS>: Helper types for CRUD
              operations
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              <SS>Namespaces</SS>: Organized code with namespace
              support
            </Translate>
          </li>
        </ul>
      </section>
    </>
  );
}