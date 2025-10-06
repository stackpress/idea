//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';

export default function GenerateTypesEnumsProps() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Generate Types, Enums, and Props Section Content */}
      <section id="generate-types-enums-props">
      <H1>{_('7. Generate Types, Enums, and Props')}</H1>
      <P>
        <Translate>
          Similar to models, you can implement generation functions for
          types, enums, and props. Each follows the same pattern of
          creating markdown sections with tables and descriptions.
        </Translate>
      </P>
      <P>
        <Translate>
          Types define reusable data structures, enums define sets of
          named constants, and props define reusable property
          configurations for form fields and validation.
        </Translate>
      </P>
      </section>
    </>
  )
}