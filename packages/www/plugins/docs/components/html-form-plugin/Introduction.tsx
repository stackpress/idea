import { useLanguage, Translate } from 'r22n';
import { H1, P, C } from '../index.js';

export default function Introduction() {
  const { _ } = useLanguage();

  return (
    <section>
      <H1>{_('Creating an HTML Form Plugin')}</H1>
      <P>
        <Translate>
          This tutorial will guide you through creating a plugin that
          generates HTML forms from a processed <C>.idea</C> schema.
          You'll learn how to parse schema models, generate appropriate
          form elements, handle validation, and create responsive forms
          with multiple CSS framework support.
        </Translate>
      </P>
    </section>
  )
}
