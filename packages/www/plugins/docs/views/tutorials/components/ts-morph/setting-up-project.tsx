import { H1, H2, P, C, SS } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const examples = [
  `mkdir ts-morph-plugin-tutorial
cd ts-morph-plugin-tutorial
npm init -y
npm install --save-dev typescript ts-morph @types/node`,
`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
`ts-morph-plugin-tutorial/
├── src/
│   ├── index.ts
│   ├── plugin.ts
│   └── types.ts
├── examples/
│   ├── input.json
│   └── output.ts
├── tests/
│   └── plugin.test.ts
├── package.json
└── tsconfig.json`
]
export default function SettingUpProject() {
  return (
    <section id="3-setting-up-the-project">
      <H1>3. Setting Up the Project</H1>
      <P>
        Setting up a proper project structure is crucial for maintainable plugin development. This section guides you through creating a well-organized TypeScript project with all necessary configurations and dependencies
      </P>
      <P>Let's create a new TypeScript project for our plugin:</P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[0]}
      </Code>

      <P>Create a basic <C>tsconfig.json:</C></P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[1]}
      </Code>

      <P>Create the project structure:</P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[2]}
      </Code>
    </section>
  )
}
