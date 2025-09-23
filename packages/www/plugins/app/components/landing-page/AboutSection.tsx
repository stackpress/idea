import { Translate, useLanguage } from 'r22n';

export default function AboutSection() {
  const { _ } = useLanguage();
  
  return (
    <main>
      <section className="theme-bg-bg1 max-w-4xl mx-auto px-4 py-20 rounded-lg">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="text-yellow-400">{_('.idea')}</span>
          </h1>
          <div className="mx-auto my-5 w-16 border-t border-yellow-300"></div>
          <p className="text-lg text-center max-w-xl mx-auto">
            <Translate>
              The .idea file format is a declarative schema definition 
              language designed to simplify application development by 
              providing a single source of truth for data structures, 
              relationships, and code generation.
            </Translate>
          </p>
        </div>
      </section>
    </main>
  )
}