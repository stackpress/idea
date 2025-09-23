import { useLanguage, Translate } from 'r22n';
import { H1, P, C } from '../index.js';

export default function Introduction() {
  const { _ } = useLanguage();
  
  return (
    <>
      <H1>{_('TypeScript Interface Generator Plugin Tutorial')}</H1>
      <P>
        <Translate>
          This tutorial demonstrates how to create a plugin that generates 
          TypeScript interfaces and types from <C>.idea</C> schema files. The 
          plugin will transform your schema models, types, and enums into 
          proper TypeScript definitions with full type safety.
        </Translate>
      </P>
    </>
  );
}