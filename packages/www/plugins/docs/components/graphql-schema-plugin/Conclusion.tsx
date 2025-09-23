import { useLanguage, Translate } from 'r22n';
import { P, C, Nav } from '../index.js';

export default function Conclusion() {
  return (
    <>
      <section id="conclusion">
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