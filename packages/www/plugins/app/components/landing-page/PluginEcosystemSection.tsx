//modules
import { Translate, useLanguage } from 'r22n';

export default function PluginEcosystemSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Plugin Ecosystem Section Content */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="font-bold mb-6 text-3xl text-center">
          {_('The Plugin Ecosystem')}
        </h2>

        <p className="mb-8 max-w-3xl mx-auto text-center text-lg">
          <Translate>
            The true power of <strong className='text-yellow-500'>.idea </strong>
            lies in its plugin system — a bridge from simple schema
            definitions to full‑stack applications.
          </Translate>
        </p>

        <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
          {/* Multi-Language Support */}
          <div className="flex flex-col items-center p-8 rounded-lg">
            <span className="mb-4 text-6xl text-blue-400">
              <i className="fa-earth-asia fa-solid hover:animate-spin"></i>
            </span>
            <h3 className="font-bold text-center text-xl">
              {_('Multi‑Language Support')}
            </h3>
          </div>

          {/* Framework Integration */}
          <div className="flex flex-col items-center p-8 rounded-lg">
            <span className="mb-4 text-6xl text-blue-400">
              <i className="fa-brands fa-react hover:animate-spin"></i>
            </span>
            <h3 className="font-bold text-center text-xl">
              {_('Framework Integration')}
            </h3>
          </div>

          {/* Database Support */}
          <div className="flex flex-col items-center p-8 rounded-lg">
            <span className="mb-4 text-6xl text-green-400">
              <i className="fa-database fa-solid hover:animate-bounce"></i>
            </span>
            <h3 className="font-bold text-center text-xl">
              {_('Database Support')}
            </h3>
          </div>

          {/* Documentation & Tools */}
          <div className="flex flex-col items-center p-8 rounded-lg">
            <span className="mb-4 text-6xl text-purple-400">
              <i className="fa-book-open fa-solid hover:animate-bounce"></i>
            </span>
            <h3 className="font-bold text-center text-xl">
              {_('Documentation & Tools')}
            </h3>
          </div>
        </div>
      </section>
    </>
  )
}