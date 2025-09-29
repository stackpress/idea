//modules
import { Translate, useLanguage } from 'r22n';

//benefit cards data
const benefitCards = [
  {
    title: 'Single Source of Truth',
    desc: 'One schema powers DB, types, APIs, docs, and forms.',
    icon: 'fa-bullseye',
    color: 'text-green-400'
  },
  {
    title: 'Type Safety Everywhere',
    desc: 'Consistent, type‑safe code across languages and frameworks.',
    icon: 'fa-shield-halved',
    color: 'text-blue-400'
  },
  {
    title: 'Rapid Development',
    desc: 'Generate boilerplate, forms, and docs in seconds.',
    icon: 'fa-bolt',
    color: 'text-purple-400'
  },
  {
    title: 'Perfect Consistency',
    desc: 'Update the schema once—everything stays in sync.',
    icon: 'fa-arrows-rotate',
    color: 'text-yellow-400'
  },
  {
    title: 'Extensible by Plugins',
    desc: 'Target any framework or language with custom generators.',
    icon: 'fa-plug',
    color: 'text-pink-400'
  },
  {
    title: 'AI‑to‑Code Bridge',
    desc: 'Describe your model, generate production‑ready code.',
    icon: 'fa-robot',
    color: 'text-teal-400'
  }
];

//----------------------------------------------------------------------

export default function BenefitsSection() {
  //hooks
  const { _ } = useLanguage();
  
  return (
    <>
      {/* Benefits Section Content */}
      <section className="theme-bg-bg0 max-w-7xl mx-auto px-4 py-20">
        <h3 className="mb-6 text-3xl font-bold">
          {_('Key Benefits')}
        </h3>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefitCards.map((card, index) => (
            <div 
              key={index} 
              className="rounded-lg theme-bg-bg1 p-5">
              <div className="flex items-start gap-3">
                <span className={`inline-flex h-9 w-9 items-center 
                  justify-center rounded-full theme-bg-bg1 ${card.color}`}>
                  <i className={`fa-solid ${card.icon} text-3xl mt-4`} />
                </span>
                <div>
                  <div className="font-bold mb-2">
                    {_(card.title)}
                  </div>
                  <p className="text-base opacity-90">
                    <Translate>
                      {card.desc}
                    </Translate>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
