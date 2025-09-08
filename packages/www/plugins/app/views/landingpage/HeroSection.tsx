import Button from 'frui/form/Button';
import Code from 'frui/format/Code';
import { Bounce, toast } from 'react-toastify';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const code = [
    `$ npm i -D @stackpress/idea`,
    `model User {
  id String @id @default("nanoid()")
  name String @required
  email String @unique @required
  created Date @default("now()")
}

plugin "./plugins/typescript-generator.js" {
  output "./generated/types.ts"
}`,
    `npx idea transform --input schema.idea`
  ];

  const notify = () => toast.success('Copied to clipboard!', {
    position: "bottom-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

  return (
    <>
      {/* Hero Content */}
      <section className="relative z-10 theme-bg-bg0 container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 flex flex-col justify-center items-center text-center py-20 sm:py-28 md:py-36">
        <div className={`max-w-4xl w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* Light Bulb Icon */}
          <div className="relative mb-8">
            <div className="text-8xl sm:text-9xl md:text-[12rem] drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
              💡
            </div>
            {/* Static yellow glow effect behind bulb */}
            <div className="absolute -inset-8 rounded-full bg-yellow-400/20 dark:bg-yellow-400/30 blur-3xl animate-pulse scale-150" />
          </div>

          {/* Title */}
          <h1 className="mb-6 font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl theme-color-text">
            From <span className="text-yellow-500 dark:text-yellow-400">Idea</span> to Code
          </h1>

          {/* Subtitle */}
          <p className="text-balance text-lg sm:text-xl md:text-2xl theme-color-text-muted mb-6 max-w-3xl mx-auto">
            A meta language to express and transform your ideas to reality.
          </p>

          {/* Tagline */}
          <p className="text-sm sm:text-base text-yellow-600 dark:text-yellow-400 mb-10">
            💫 Generate TypeScript, GraphQL, REST APIs, and more from a single schema
          </p>

          {/* Simple Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/docs"
              className="px-8 py-4 rounded-xl  transition-all duration-300 w-full sm:w-auto
              text-lg font-semibold hover:scale-105 bg-yellow-500"
            >
              📖 Documentation
            </Button>
          </div>

          {/* Simple Feature Icons */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <div className="text-sm font-semibold theme-color-text">Fast</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🛡️</div>
              <div className="text-sm font-semibold theme-color-text">Safe</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔧</div>
              <div className="text-sm font-semibold theme-color-text">Flexible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Demo Section */}
      <section className="relative z-10  mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold theme-color-text mb-4">
            💡 Turn Your Ideas Into Reality
          </h2>
          <p className="text-lg theme-color-text-muted max-w-2xl mx-auto">
            Simple steps to transform your schema into production-ready code
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 - Install */}
          <div className="group p-6 rounded-xl theme-bg-bg0 border theme-border hover:scale-102 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl group-hover:animate-bounce">📦</div>
              <h3 className="text-xl font-semibold theme-color-text">1. Install the Package</h3>
            </div>
            <Code
              copy
              onCopy={notify}
              language="bash"
              className="text-base"
            >
              {code[0]}
            </Code>
          </div>

          {/* Step 2 - Schema */}
          <div className="group p-6 rounded-xl theme-bg-bg0 border theme-border hover:scale-102 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl group-hover:animate-bounce">✏️</div>
              <h3 className="text-xl font-semibold theme-color-text">2. Create Your Schema</h3>
            </div>
            <p className="text-sm theme-color-text-muted mb-4 text-left">Define your data models in a simple .idea file:</p>
            <Code
              copy
              onCopy={notify}
              language="idea"
              className="text-base"
            >
              {code[1]}
            </Code>
          </div>

          {/* Step 3 - Transform */}
          <div className="group p-6 rounded-xl theme-bg-bg0 border theme-border hover:scale-102 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl group-hover:animate-bounce">⚡</div>
              <h3 className="text-xl font-semibold theme-color-text">3. Generate Code</h3>
            </div>
            <p className="text-sm theme-color-text-muted mb-4 text-left">Run the transformer to generate your code:</p>
            <Code
              copy
              onCopy={notify}
              language="bash"
              className="text-base"
            >
              {code[2]}
            </Code>
          </div>

          {/* Step 4 - Results */}
          <div className="group p-6 rounded-xl theme-bg-bg0 border theme-border hover:scale-102 transition-all duration-300 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-4xl drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
                💡
              </div>
              <h3 className="text-xl font-semibold theme-color-text">4. Your Idea is Now Code!</h3>
            </div>
            <div className="text-left bg-yellow-50/50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm theme-color-text-muted mb-2 font-semibold">✨ Generated files include:</p>
              <ul className="text-sm theme-color-text-muted space-y-1">
                <li>• TypeScript interfaces & types</li>
                <li>• GraphQL schema definitions</li>
                <li>• REST API client libraries</li>
                <li>• Validation schemas (Zod)</li>
                <li>• Database migrations</li>
                <li>• API documentation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}