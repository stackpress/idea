//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C, SS } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const examples =
  `# Using npm
npm install --save-dev ts-morph

# Using yarn
yarn add --dev ts-morph

# Using Deno
deno add ts-morph@jsr:@ts-morph/ts-morph`;

//-----------------------------------------------------------------

export default function installation() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Installation Section Content */}
      <section id="installation">
        <H1>{_('2. Installation')}</H1>
        <P>
          <Translate>
            Before starting with <C>ts-morph</C> plugin development,
            ensure you have the necessary tools and knowledge. This
            section outlines the essential requirements for successful
            plugin creation and provides installation guidance.
          </Translate>
        </P>

        <P>
          <Translate>
            Before starting, ensure you have:
          </Translate>
        </P>

        <ul className="list-disc my-4 pl-6">
          <li className="my-2">
            <SS>{_('Node.js 16+')}</SS>
            <Translate>
              and npm/yarn installed
            </Translate>
          </li>
          <li className="my-2">
            <SS>{_('TypeScript 4.0+')}</SS>
            <Translate>
              knowledge
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Basic understanding of Abstract Syntax Trees (AST)
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Familiarity with TypeScript interfaces, classes, and
              modules
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            Installing <C>ts-morph</C> is straightforward and can be
            done using your preferred package manager. The library is
            available through npm, yarn, and even Deno for different
            development environments.
          </Translate>
        </P>

        <P>
          <Translate>
            Install <C>ts-morph</C> in your project:
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 px-mx-10 text-white"
        >
          {examples}
        </Code>
      </section>
    </>
  )
}
