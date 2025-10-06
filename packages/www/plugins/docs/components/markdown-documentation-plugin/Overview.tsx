//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P } from '../../../docs/components/index.js';

export default function Overview() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Overview Section Content */}
      <section id="overview">
      <H1>{_('1. Overview')}</H1>
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
    </>
  )
}