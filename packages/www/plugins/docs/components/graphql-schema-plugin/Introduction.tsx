//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../../../docs/components/index.js';

export default function Introduction() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <>
      {/* GraphQL Schema Generator Plugin Tutorial */}
      <H1>{_('GraphQL Schema Generator Plugin Tutorial')}</H1>
      <P>
        <Translate>
          This tutorial demonstrates how to create a plugin that generates 
          GraphQL type definitions from <C>.idea</C> schema files. The plugin 
          will transform your schema models, types, and enums into proper 
          GraphQL schema definitions.
        </Translate>
      </P>
    </>
  );
}