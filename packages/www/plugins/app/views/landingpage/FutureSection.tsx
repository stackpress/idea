import Button from 'frui/form/Button';

export default function FutureSection() {
  return (
    <section className="theme-bg-bg1 mx-auto  px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-20 w-64 h-64 opacity-20"
      />
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full theme-bc-bd0 border theme-bg-bg1/40 backdrop-blur-sm text-xs sm:text-sm">
          <i className="fa-solid fa-rocket text-emerald-300"></i>
          <span className="opacity-90">The Future</span>
        </span>
        <h2 className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
          <span className="text-yellow-300">Declarative</span>. Type‑Safe. Automated.
        </h2>
        <p className="mx-auto max-w-3xl mt-3 sm:mt-4 text-base sm:text-lg opacity-90">
          Define intent once. Generate apps, APIs, and docs in seconds.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <a href="/docs/getting-started">
            <Button warning className='rounded px-5 py-2'>Get Started</Button>
          </a>
          <a href="/docs/specifications/syntax-overview" className="px-5 py-2 rounded-md theme-bc-bd0 border transition">
            Read the Spec
          </a>
        </div>
      </div>
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 p-4">
          <div className="font-semibold mb-1">Automated</div>
          <p className="text-sm opacity-85">Less boilerplate. More building.</p>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 p-4">
          <div className="font-semibold mb-1">Unified</div>
          <p className="text-sm opacity-85">One spec, many outputs.</p>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 p-4">
          <div className="font-semibold mb-1">Proactive</div>
          <p className="text-sm opacity-85">Types catch issues early.</p>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 p-4">
          <div className="font-semibold mb-1">Instant</div>
          <p className="text-sm opacity-85">Generate full layers fast.</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/50 p-5">
          <div className="mb-2 font-semibold">Endless Possibilities</div>
          <p className="text-sm opacity-85">Mobile, desktop, microservices, infra, docs, tests, monitoring.</p>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/50 p-5">
          <div className="mb-2 font-semibold">Start Today</div>
          <ul className="text-sm opacity-90 list-disc pl-5 space-y-1">
            <li><a className="underline text-blue-500 hover:text-blue-600" href="/docs/specifications/syntax-overview">Read the Spec</a></li>
            <li><a className="underline text-blue-500 hover:text-blue-600" href="/docs/plugin-development/plugin-development-guide">Plugin tutorials</a></li>
            <li><a className="underline text-blue-500 hover:text-blue-600" href="/docs/getting-started">Build something</a></li>
          </ul>
        </div>
        <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/50 p-5">
          <blockquote className="text-sm opacity-85 italic">
            The fastest, safest line of code is the one you never write.
          </blockquote>
          <div className="mt-2 text-xs opacity-70">— Steve Jobs</div>
        </div>
      </div>
    </section>
  )
}


