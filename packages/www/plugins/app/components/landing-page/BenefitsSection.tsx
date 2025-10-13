//modules
import { Translate, useLanguage } from 'r22n';
import clsx from 'clsx';

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

export default function BenefitsSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Benefits Section Content */}
      <section className="max-w-7xl mx-auto px-4 py-20 theme-bg-bg0">
        <h3 className="font-bold mb-6 text-3xl">
          {_('Key Benefits')}
        </h3>

        {/* Benefit Cards Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {benefitCards.map((card, index) => (
            <div
              key={index}
              className="p-5 rounded-lg theme-bg-bg1"
            >
              <div className="flex gap-3 items-start">
                <span className={clsx([
                  'h-9',
                  'inline-flex',
                  'items-center',
                  'justify-center',
                  'rounded-full',
                  'theme-bg-bg1',
                  'w-9',
                  card.color
                ])}>
                  <i className={`fa-solid ${card.icon} mt-4 text-3xl`} />
                </span>
                <div>
                  <div className="font-bold mb-2">
                    {_(card.title)}
                  </div>
                  <p className="opacity-90 text-base">
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
