export default function AudienceSection() {
  const items = [
    {
      title: 'Junior Developers',
      icon: 'fa-user-graduate text-yellow-300',
      points: [
        'Easy-to-understand syntax with examples',
        'Rapid prototyping without deep framework knowledge'
      ]
    },
    {
      title: 'Senior Developers',
      icon: 'fa-user-gear text-sky-300',
      points: [
        'Powerful features for complex apps',
        'Extensible plugin system',
        'Cross-platform code generation'
      ]
    },
    {
      title: 'CTOs & Leaders',
      icon: 'fa-briefcase text-emerald-300',
      points: [
        'Reduce dev time by 60–80%',
        'Improve code consistency across teams',
        'Lower maintenance costs',
        'Accelerate time-to-market'
      ]
    }
  ];

  return (
    <section className="theme-bg-bg0 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20">
      <h3 className="mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl font-bold">👥 Who Should Use This?</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px theme-bc-bd0 opacity-50" />
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {items.map((item, idx) => (
            <div key={idx} className="relative ml-10">
              <div className="absolute -left-10 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full theme-bc-bd0 border theme-bg-bg1/70 backdrop-blur-sm">
                <i className={`fa-solid ${item.icon}`} />
              </div>
              <div className="rounded-xl border theme-bc-bd0 theme-bg-bg1/40 bg-dark text-white backdrop-blur-sm p-4 sm:p-5">
                <div className="font-semibold mb-1">{item.title}</div>
                <ul className="text-sm sm:text-base opacity-90 space-y-1 pl-4 list-disc">
                  {item.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}