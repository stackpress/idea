import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';

export default function Conclusion() {
  const { _ } = useLanguage();
  
  return (
    <section id="conclusion">
      <H2>{_('Conclusion')}</H2>
      <P>
        <Translate>
          This tutorial provides a comprehensive foundation for creating 
          test data generation plugins that can handle complex schemas and 
          generate realistic, useful test data for development and testing 
          workflows.
        </Translate>
      </P>
    </section>
  );
}