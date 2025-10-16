//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, P, C } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const examples = [
  `mkdir ts-morph-plugin-tutorial
cd ts-morph-plugin-tutorial
npm init -y
npm install --save-dev typescript ts-morph @types/node`,

  //------------------------------------------------------------------//

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

  //------------------------------------------------------------------//

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
];

//--------------------------------------------------------------------//

export default function SettingUpProject() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
    {/* Setting Up the Project Section Content */}
      <section id="setting-up-the-project">
        <H1>{_('3. Setting Up the Project')}</H1>
        <P>
          <Translate>
            Setting up a proper project structure is crucial for
            maintainable plugin development. This section guides you
            through creating a well-organized TypeScript project with 
            all necessary configurations and dependencies
          </Translate>
        </P>
        <P>
          <Translate>
            Let's create a new TypeScript project for our plugin:
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 px-mx-10 text-white"
        >
          {examples[0]}
        </Code>

        <P>
          <Translate>
            Create a basic <C>tsconfig.json:</C>
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 px-mx-10 text-white"
        >
          {examples[1]}
        </Code>

        <P>
          <Translate>
            Create the project structure:
          </Translate>
        </P>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 px-mx-10 text-white"
        >
          {examples[2]}
        </Code>
      </section>
    </>
  )
}
