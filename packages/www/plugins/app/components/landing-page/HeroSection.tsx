//modules
import { Translate, useLanguage } from 'r22n';
import Button from 'frui/form/Button';
import clsx from 'clsx';
//local
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const installCommand = `npm i -D @stackpress/idea`

//--------------------------------------------------------------------//

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

//--------------------------------------------------------------------//

const transformCommand = `npx idea transform --input schema.idea`

//--------------------------------------------------------------------//

//styles
//--------------------------------------------------------------------//

const headlineStyle = clsx(
  'font-bold',
  'lg:text-8xl',
  'mb-6',
  'md:text-5xl',
  'sm:text-6xl',
  'text-5xl',
  'text-white',
  'theme-tx1',
  'xs:text-4xl'
);

const subheadlineStyle = clsx(
  'max-w-3xl',
  'mb-6',
  'mx-auto',
  'text-lg',
  'theme-tx1',
  'theme-color-text-muted'
);

const ctaButtonStyle = clsx(
  'bg-yellow-500',
  'font-bold',
  'hover:bg-yellow-600',
  'hover:scale-105',
  'px-8',
  'py-4',
  'rounded-lg',
  'text-lg',
  'transition'
);

//--------------------------------------------------------------------//

export default function HeroSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Hero Content */}
      <section
        id="vanta-bg"
        className="opacity-100 px-4 py-40 text-center"
      >
        <div>
          <div className="mb-8">
            <div className="animate-pulse flex justify-center transition">
              <img
                src="icon.png"
                alt="logo"
                className="h-50 w-50"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className={headlineStyle}>
            <Translate>
              From <span className="text-yellow-500">Idea</span> to Code
            </Translate>
          </h1>

          {/* Subheadline */}
          <p className={subheadlineStyle}>
            <Translate>
              A meta language to express and transform your ideas to
              reality.
            </Translate>
          </p>

          <p className="mb-10 text-white text-yellow-600">
            <Translate>
              Generate TypeScript, GraphQL, REST APIs, and more from a
              single schema
            </Translate>
          </p>

          {/* Call to Action Button */}
          <div className="flex justify-center mb-12">
            <Button
              href="/docs"
              className={ctaButtonStyle}
            >
              <i className="fa-solid fa-book-open mx-2"></i>
              {_('Documentation')}
            </Button>
          </div>

          <div className="gap-8 grid grid-cols-3 max-w-md mx-auto">
            <div className="text-center">
              <div className="mb-2 text-7xl">
                <i className="fa-solid fa-bolt theme-tx1"></i>
              </div>
              <div className="text-lg theme-tx1">
                {_('Fast')}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-7xl">
                <i className="fa-solid fa-shield theme-tx1"></i>
              </div>
              <div className="text-lg theme-tx1">
                {_('Safe')}
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-7xl">
                <i className="fa-solid fa-wrench theme-tx1"></i>
              </div>
              <div className="text-lg theme-tx1">
                {_('Flexible')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-bold mb-4 text-5xl theme-color-text">
            <Translate>
              Turn Your Ideas Into Reality
            </Translate>
          </h2>
          <p className="max-w-2xl mx-auto text-lg">
            <Translate>
              Simple steps to transform your schema into production-ready
              code
            </Translate>
          </p>
        </div>

        <div className="space-y-8">
          {/* Install the Package */}
          <div className="p-6 rounded-lg theme-bg-bg1">
            <div className="flex gap-3 items-center mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-cube text-yellow-500"></i>
              </div>
              <h3 className="font-bold text-xl">
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
            <div className="flex gap-3 items-center mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-pencil text-yellow-500"></i>
              </div>
              <h3 className="font-bold text-xl theme-color-text">
                {_('2. Create Your Schema')}
              </h3>
            </div>
            <p className="mb-4 text-left text-md theme-color-text-muted">
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
            <div className="flex gap-3 items-center mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-bolt text-yellow-500"></i>
              </div>
              <h3 className="font-bold text-xl theme-color-text">
                {_('3. Generate Code')}
              </h3>
            </div>
            <p className="mb-4 text-left text-md theme-color-text-muted">
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
          <div className="border border-gray-200/10 p-6 rounded-lg theme-bg-bg1">
            <div className="flex gap-3 items-center mb-4">
              <div className="text-3xl">
                <i className="fa-solid fa-lightbulb text-yellow-500"></i>
              </div>
              <h3 className="font-bold text-xl">
                {_('4. Your Idea is Now Code!')}
              </h3>
            </div>
            <div className="rounded-lg text-left">
              <p className="font-bold mb-2 text-md">
                <Translate>Generated files include:</Translate>
              </p>
              <ul className="list-disc list-inside space-y-1 text-md">
                <li>
                  <Translate>TypeScript interfaces & types</Translate>
                </li>
                <li>
                  <Translate>GraphQL schema definitions</Translate>
                </li>
                <li>
                  <Translate>REST API client libraries</Translate>
                </li>
                <li>
                  <Translate>Validation schemas (Zod)</Translate>
                </li>
                <li>
                  <Translate>Database migrations</Translate>
                </li>
                <li>
                  <Translate>API documentation</Translate>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}