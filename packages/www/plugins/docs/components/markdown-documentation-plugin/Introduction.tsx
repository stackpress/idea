import { useLanguage, Translate } from 'r22n';
import { H1, P, C } from '../index.js';

export default function Introduction() {
  const { _ } = useLanguage();

  return (
    <section>
      <H1>{_('Creating a Markdown Documentation Plugin')}</H1>
      <P>
        <Translate>
          This tutorial will guide you through creating a plugin that
          generates comprehensive markdown documentation from a processed
          <C>.idea</C> schema. You'll learn how to parse schema models,
          types, enums, and props to create structured documentation with
          examples and cross-references.
        </Translate>
      </P>
    </section>
  )
}