import { H1, H2, P, C, SS } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const examples = [
  `# Using npm
npm install --save-dev ts-morph

# Using yarn
yarn add --dev ts-morph

# Using Deno
deno add ts-morph@jsr:@ts-morph/ts-morph`
]

export default function installation() {
  return (
    <section id="2-prerequisites">
      <H1>2. Installation</H1>
      <P>
        Before starting with <C>ts-morph</C> plugin development, ensure you have the necessary tools and knowledge. This section outlines the essential requirements for successful plugin creation and provides installation guidance.
      </P>

      <P>Before starting, ensure you have:</P>

      <ul className="list-disc pl-6 my-4">
        <li className="my-2"><SS>Node.js 16+</SS> and npm/yarn installed</li>
        <li className="my-2"><SS>TypeScript 4.0+</SS> knowledge</li>
        <li className="my-2">Basic understanding of Abstract Syntax Trees (AST)</li>
        <li className="my-2">Familiarity with TypeScript interfaces, classes, and modules</li>
      </ul>

      <P>Installing <C>ts-morph</C> is straightforward and can be done using your preferred package manager. The library is available through npm, yarn, and even Deno for different development environments.</P>

      <P>Install <C>ts-morph</C> in your project:</P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[0]}
      </Code>
    </section>
  )
}
