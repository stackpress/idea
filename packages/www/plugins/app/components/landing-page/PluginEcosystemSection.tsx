//modules
import { Translate, useLanguage } from 'r22n';

export default function PluginEcosystemSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Plugin Ecosystem Section Content */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {_('The Plugin Ecosystem')}
        </h2>

        <p className="text-lg mb-8 max-w-3xl mx-auto text-center">
          <Translate>
            The true power of <strong className='text-yellow-500'>.idea </strong>
            lies in its plugin system — a bridge from simple schema
            definitions to full‑stack applications.
          </Translate>
        </p>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {/* Multi-Language Support */}
          <div className="rounded-lg p-8 flex flex-col items-center">
            <span className="text-blue-400 text-6xl mb-4">
              <i className="fa-solid fa-earth-asia hover:animate-spin"></i>
            </span>
            <h3 className="font-bold text-xl text-center">
              {_('Multi‑Language Support')}
            </h3>
          </div>

          {/* Framework Integration */}
          <div className="rounded-lg p-8 flex flex-col items-center">
            <span className="text-blue-400 text-6xl mb-4">
              <i className="fa-brands fa-react hover:animate-spin"></i>
            </span>
            <h3 className="font-bold text-xl text-center">
              {_('Framework Integration')}
            </h3>
          </div>

          {/* Database Support */}
          <div className="rounded-lg p-8 flex flex-col items-center">
            <span className="text-green-400 text-6xl mb-4">
              <i className="fa-solid fa-database hover:animate-bounce"></i>
            </span>
            <h3 className="font-bold text-xl text-center">
              {_('Database Support')}
            </h3>
          </div>

          {/* Documentation & Tools */}
          <div className="rounded-lg p-8 flex flex-col items-center">
            <span className="text-purple-400 text-6xl mb-4">
              <i className="fa-solid fa-book-open hover:animate-bounce"></i>
            </span>
            <h3 className="font-bold text-xl text-center">
              {_('Documentation & Tools')}
            </h3>
          </div>
        </div>
      </section>
    </>
  )
}