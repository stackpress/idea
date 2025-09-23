import { useLanguage, Translate } from 'r22n';
import { H1, P, C } from '../index.js';

export default function Introduction() {
  const { _ } = useLanguage();

  return (
    <section>
      <H1>{_('OpenAPI Specification Generator Plugin Tutorial')}</H1>
      <P>
        <Translate>
          This tutorial demonstrates how to create a plugin for
        </Translate>
         <C>@stackpress/idea-transformer</C> 
         <Translate>
          that generates OpenAPI 3.0 specifications from
        </Translate>
         <C>.idea</C> 
         <Translate>
          schema files. The plugin will create comprehensive API 
          documentation with endpoints, schemas, and validation rules.
        </Translate>
      </P>
    </section>
  );
}