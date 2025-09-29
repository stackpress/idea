//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../index.js';

export default function Conclusion() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Conclusion Section Content */}
      <section id="conclusion">
        <H1>{_('10. Conclusion')}</H1>
        <P>
          <Translate>
            This tutorial provides a comprehensive foundation for creating 
            GraphQL schema generators from <C>.idea</C> files. The generated 
            schemas can be used with any GraphQL server implementation like 
            Apollo Server, GraphQL Yoga, or others.
          </Translate>
        </P>
      </section>
    </>
  );
}