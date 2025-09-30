//modules
import { Translate, useLanguage } from 'r22n';
import Button from 'frui/form/Button';
//local
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const installCommand = `npm i -D @stackpress/idea`

//----------------------------------------------------------------------

const schemaExample =
  `model User {
  id String @id @default("nanoid()")
  name String @required
  email String @unique @required
  created Date @default("now()")
}

plugin "./plugins/typescript-generator.js" {
  output "./generated/types.ts"
}`

//----------------------------------------------------------------------

const transformCommand = `npx idea transform --input schema.idea`;

//----------------------------------------------------------------------

export default function HeroSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Hero Content */}
      <section className="max-w-6xl mx-auto px-4 py-40 text-center">
        <div>
          <div className="mb-8">
            <div className="animate-pulse transition flex 
            justify-center ">
              <img src="icon.png" alt="logo" className="w-50 h-50" />
            </div>
          </div>

          <h1
            className="mb-6 lg:text-8xl font-bold sm:text-6xl md:text-5xl 
          xs:text-4xl text-5xl text-white"
          >
            <Translate>
              From <span className="text-yellow-500">Idea</span> to Code
            </Translate>
          </h1>

          <p className="text-lg theme-color-text-muted mb-6 max-w-3xl 
              mx-auto text-white">
            <Translate>
              A meta language to express and transform your ideas to
              reality.
            </Translate>
          </p>

          <p className="text-yellow-600 mb-10 text-white">
            <Translate>
              Generate TypeScript, GraphQL, REST APIs, and more from a
              single schema
            </Translate>
          </p>

          <div className="flex justify-center mb-12">
            <Button
              href="/docs"
              className="px-8 py-4 rounded-lg text-lg font-bold 
              bg-yellow-500 hover:bg-yellow-600 hover:scale-105
              transition"
            >
              <i className="fa-solid fa-book-open mx-2"></i>
              {_('Documentation')}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-7xl mb-2">
                <i className="fa-solid fa-bolt text-white"></i>
              </div>
              <div className="text-lg text-white">
                {_('Fast')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-7xl mb-2">
                <i className="fa-solid fa-shield text-white"></i>
              </div>
              <div className="text-lg text-white">
                {_('Safe')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-7xl mb-2">
                <i className="fa-solid fa-wrench text-white"></i>
              </div>
              <div className="text-lg text-white">
                {_('Flexible')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold theme-color-text mb-4">
            <Translate>
              Turn Your Ideas Into Reality
            </Translate>
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            <Translate>
              Simple steps to transform your schema into production-ready
              code
            </Translate>
          </p>
        </div>

        <div className="space-y-8">
          {/* Install the Package */}
          <div className="p-6 rounded-lg theme-bg-bg1">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-cube text-yellow-500"></i>
              </div>
              <h3 className="text-xl font-bold">
                {_('1. Install the Package')}
              </h3>
            </div>
            <Code
              copy
              language="bash"
              className="bg-dark-800 rounded-lg text-white">
              {installCommand}
            </Code>
          </div>

          {/* Create Your Schema */}
          <div className="p-6 rounded-lg theme-bg-bg1">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-pencil text-yellow-500"></i>
              </div>
              <h3 className="text-xl font-bold theme-color-text">
                {_('2. Create Your Schema')}
              </h3>
            </div>
            <p className="text-md theme-color-text-muted mb-4 text-left">
              <Translate>
                Define your data models in a simple .idea file:
              </Translate>
            </p>
            <Code
              copy
              language="idea"
              className="bg-dark-800 rounded-lg text-white"
            >
              {schemaExample}
            </Code>
          </div>

          {/* Generate Code */}
          <div className="p-6 rounded-lg theme-bg-bg1">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-bolt text-yellow-500"></i>
              </div>
              <h3 className="text-xl font-bold theme-color-text">
                {_('3. Generate Code')}
              </h3>
            </div>
            <p className="text-md theme-color-text-muted mb-4 text-left">
              <Translate>
                Run the transformer to generate your code:
              </Translate>
            </p>
            <Code
              copy
              language="bash"
              className="bg-dark-800 rounded-lg text-white"
            >
              {transformCommand}
            </Code>
          </div>

          {/* Your Idea is Now Code! */}
          <div className="p-6 rounded-lg theme-bg-bg1 border border-gray-200/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-lightbulb text-yellow-500"></i>
              </div>
              <h3 className="text-xl font-bold ">
                {_('4. Your Idea is Now Code!')}
              </h3>
            </div>
            <div className="text-left rounded-lg">
              <p className="text-md mb-2 font-bold">
                <Translate>Generated files include:</Translate>
              </p>
              <ul className="text-md space-y-1 list-disc list-inside">
                <li><Translate>TypeScript interfaces & types</Translate></li>
                <li><Translate>GraphQL schema definitions</Translate></li>
                <li><Translate>REST API client libraries</Translate></li>
                <li><Translate>Validation schemas (Zod)</Translate></li>
                <li><Translate>Database migrations</Translate></li>
                <li><Translate>API documentation</Translate></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}