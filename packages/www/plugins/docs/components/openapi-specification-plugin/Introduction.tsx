//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../../../docs/components/index.js';

export default function Introduction() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Creating an OpenAPI Specification Generator Plugin */}
      <section id="introduction">
        <H1>{_('OpenAPI Specification Generator Plugin Tutorial')}</H1>
        <P>
          <Translate>
            This tutorial demonstrates how to create a plugin for
            <C>@stackpress/idea-transformer</C> that generates OpenAPI 
            3.0 specifications from <C>.idea</C> schema files. The 
            plugin will create comprehensive API documentation with 
            endpoints, schemas, and validation rules.
          </Translate>
        </P>
      </section>
    </>
  );
}