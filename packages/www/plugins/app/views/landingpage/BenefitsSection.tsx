export default function BenefitsSection() {
  const cards = [
    {
      title: 'Single Source of Truth',
      desc: 'One schema powers DB, types, APIs, docs, and forms.',
      icon: 'fa-bullseye',
      accent: 'from-emerald-500/20 to-teal-500/20',
      ring: 'ring-emerald-400/30',
      span: 'md:col-span-2',
      color: 'text-emerald-400'
    },
    {
      title: 'Type Safety Everywhere',
      desc: 'Consistent, type‑safe code across languages and frameworks.',
      icon: 'fa-shield-halved',
      accent: 'from-sky-500/20 to-indigo-500/20',
      ring: 'ring-sky-400/30',
      span: '',
      color: 'text-sky-400'
    },
    {
      title: 'Rapid Development',
      desc: 'Generate boilerplate, forms, and docs in seconds.',
      icon: 'fa-bolt',
      accent: 'from-violet-500/20 to-fuchsia-500/20',
      ring: 'ring-violet-400/30',
      span: '',
      color: 'text-violet-400'
    },
    {
      title: 'Perfect Consistency',
      desc: 'Update the schema once—everything stays in sync.',
      icon: 'fa-arrows-rotate',
      accent: 'from-amber-500/20 to-orange-500/20',
      ring: 'ring-amber-400/30',
      span: 'md:row-span-2',
      color: 'text-amber-400'
    },
    {
      title: 'Extensible by Plugins',
      desc: 'Target any framework or language with custom generators.',
      icon: 'fa-plug',
      accent: 'from-pink-500/20 to-rose-500/20',
      ring: 'ring-pink-400/30',
      span: '',
      color: 'text-pink-400'
    },
    {
      title: 'AI‑to‑Code Bridge',
      desc: 'Describe your model, generate production‑ready code.',
      icon: 'fa-robot',
      accent: 'from-teal-500/20 to-emerald-500/20',
      ring: 'ring-teal-400/30',
      span: '',
      color: 'text-teal-400'
    }
  ];

  return (
    <section className="theme-bg-bg0 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
      <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl font-bold">Key Benefits</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {cards.map((c, idx) => (
          <div key={idx} className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 bg-dark text-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full theme-bc-bd0 border theme-bg-bg1/80 ${c.color}`}>
                <i className={`fa-solid ${c.icon} `} />
              </span>
              <div>
                <div className="font-semibold">{c.title}</div>
                <p className="text-sm sm:text-base opacity-90">{c.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
