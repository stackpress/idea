//modules
import { Translate, useLanguage } from 'r22n';

//data samples
//--------------------------------------------------------------------//

const iconData = [
  { 
    icon: 'fa-earth-asia fa-solid hover:animate-spin', 
    color: 'text-blue-400', 
    title: 'Multi‑Language Support' 
  },
  { 
    icon: 'fa-brands fa-react hover:animate-spin', 
    color: 'text-blue-400', 
    title: 'Framework Integration' 
  },
  { 
    icon: 'fa-solid fa-database hover:animate-bounce', 
    color: 'text-green-400', 
    title: 'Database Support' 
  },
  { 
    icon: 'fa-solid fa-book-open hover:animate-bounce', 
    color: 'text-purple-400', 
    title: 'Documentation & Tools' 
  }
];

//--------------------------------------------------------------------//

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
          {iconData.map((item) => (
            <div className="flex flex-col items-center p-8 rounded-lg">
              <span className={`mb-4 text-6xl ${item.color}`}>
                <i className={item.icon}></i>
              </span>
              <h3 className="font-bold text-center text-xl">
                {_(item.title)}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}