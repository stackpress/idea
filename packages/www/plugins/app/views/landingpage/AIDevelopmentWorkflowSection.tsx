export default function AIDevelopmentWorkflowSection() {
  const steps = [
    {
      title: 'Describe your application to an AI assistant',
      icon: 'fa-comments',
      accent: 'from-pink-500/25 to-fuchsia-500/25',
      ring: 'ring-pink-400/40'
    },
    {
      title: 'Generate a .idea schema from the description',
      icon: 'fa-lightbulb',
      accent: 'from-violet-500/25 to-indigo-500/25',
      ring: 'ring-violet-400/40'
    },
    {
      title: 'Configure plugins for your target technologies',
      icon: 'fa-plug',
      accent: 'from-amber-500/25 to-orange-500/25',
      ring: 'ring-amber-400/40'
    },
    {
      title: 'Execute the transformation to generate full‑stack code',
      icon: 'fa-bolt',
      accent: 'from-emerald-500/25 to-teal-500/25',
      ring: 'ring-emerald-400/40'
    },
    {
      title: 'Iterate by updating the schema and regenerating',
      icon: 'fa-rotate',
      accent: 'from-sky-500/25 to-cyan-500/25',
      ring: 'ring-sky-400/40'
    }
  ];

  return (
    <section className="theme-bg-bg0 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
      <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full theme-bc-bd0 border theme-bg-bg1/40 backdrop-blur-sm text-xs sm:text-sm">
          <i className="fa-solid fa-robot text-teal-300"></i>
          <span className="opacity-90">AI‑Powered Development Workflow</span>
        </span>
        <h3 className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Build faster with AI + .idea</h3>
        <p className="text-base sm:text-lg opacity-90 mt-3">The <code className="font-mono text-yellow-300 font-bold">.idea</code> format is perfect for AI‑driven development.</p>
      </div>

      <div className="relative">
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px theme-bc-bd0 opacity-50 hidden sm:block" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div key={index} className={`group relative rounded-xl border theme-bc-bd0 theme-bg-bg1/40 bg-dark text-white p-4 sm:p-5 ring-1 ${step.ring}`}>
              <div className="absolute -top-3 left-4 sm:left-1/2 sm:-translate-x-1/2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full theme-bc-bd0 border theme-bg-bg1/80 backdrop-blur-sm">
                  <i className={`fa-solid ${step.icon} text-sm opacity-90`}></i>
                </span>
              </div>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
              <div className="relative">
                <div className="font-semibold mb-1">Step {index + 1}</div>
                <div className="text-sm sm:text-base opacity-95">{step.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl text-center mt-8 sm:mt-10">
        <div className="rounded-2xl border theme-bc-bd0 theme-bg-bg1/40 backdrop-blur-sm p-5 sm:p-7">
          <p className="text-base sm:text-lg opacity-95">
            This workflow enables rapid prototyping and development — go from idea to working application in minutes rather than days.
          </p>
        </div>
      </div>
    </section>
  )
}


