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
          Zod is a TypeScript-first schema validation library that provides
          runtime type checking and validation. This plugin transforms your
          <C>.idea</C> schema definitions into comprehensive Zod validation
          schemas that provide robust runtime validation with excellent
          TypeScript integration.
        </Translate>
      </P>
      <P>
        <Translate>
          This plugin generates Zod schemas from your <C>.idea</C> schema,
          including:
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li>
          <Translate>
            <SS>Schema Validation</SS>: Zod schemas for all models and types
          </Translate>
        </li>
        <li>
          <Translate>
            <SS>Type Inference</SS>: TypeScript types inferred from Zod schemas
          </Translate>
        </li>
        <li>
          <Translate>
            <SS>Custom Validators</SS>: Support for custom validation rules
          </Translate>
        </li>
        <li>
          <Translate>
            <SS>Error Messages</SS>: Customizable validation error messages
          </Translate>
        </li>
        <li>
          <Translate>
            <SS>Nested Validation</SS>: Support for nested objects and arrays
          </Translate>
        </li>
      </ul>
      </section>
    </>
  );
}