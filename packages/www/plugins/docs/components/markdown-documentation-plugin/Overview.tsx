import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';

export default function Overview() {
  const { _ } = useLanguage();

  return (
    <section id="overview">
      <H2>{_('Overview')}</H2>
      <P>
        <Translate>
          The Markdown Documentation Plugin will:
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            Parse schema models, types, enums, and props
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Generate structured markdown documentation
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Include examples and usage notes
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Create navigation and cross-references
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Support different documentation formats and styles
          </Translate>
        </li>
      </ul>
    </section>
  )
}