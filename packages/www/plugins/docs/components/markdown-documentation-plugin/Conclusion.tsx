import { useLanguage, Translate } from 'r22n';
import { H2, P } from '../index.js';

export default function Conclusion() {
  const { _ } = useLanguage();

  return (
    <section id="conclusion">
      <H2>{_('Conclusion')}</H2>
      <P>
        <Translate>
          This Markdown Documentation Plugin demonstrates how to:
        </Translate>
      </P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">
          <Translate>
            Parse all schema elements (models, types, enums, props)
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Generate comprehensive, structured documentation
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Support multiple output formats (single file vs. multiple files)
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Include examples, cross-references, and detailed attribute 
            information
          </Translate>
        </li>
        <li className="my-2">
          <Translate>
            Provide flexible configuration options for different 
            documentation needs
          </Translate>
        </li>
      </ul>
      <P>
        <Translate>
          The plugin is highly customizable and can be extended to support
          additional features like custom templates, diagram generation,
          and integration with documentation platforms.
        </Translate>
      </P>
    </section>
  )
}