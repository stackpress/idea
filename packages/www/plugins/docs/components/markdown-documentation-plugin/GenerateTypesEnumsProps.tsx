import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';

export default function GenerateTypesEnumsProps() {
  const { _ } = useLanguage();

  return (
    <section id="generate-types-enums-props">
      <H2>{_('Generate Types, Enums, and Props')}</H2>
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
  )
}