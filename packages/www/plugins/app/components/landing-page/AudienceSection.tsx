//modules
import { Translate, useLanguage } from 'r22n';

export default function AudienceSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Audience Section Content */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {_('Who Should Use This?')}
        </h2>

        <div className="space-y-6 ">
          <div className="theme-bg-bg2 rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">
                <i className="fa-solid fa-graduation-cap text-blue"></i>
              </span>
              <h3 className="text-xl font-bold">
                {_('Junior Developers')}
              </h3>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Translate>
                  Easy-to-understand syntax with examples
                </Translate>
              </li>
              <li>
                <Translate>
                  Rapid prototyping without deep framework knowledge
                </Translate>
              </li>
            </ul>
          </div>

          <div className="theme-bg-bg2 rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">
                <i className="fa-solid fa-user-tie text-red-500"></i>
              </span>
              <h3 className="text-xl font-bold">
                {_('Senior Developers')}
              </h3>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Translate>
                  Powerful features for complex apps
                </Translate>
              </li>
              <li>
                <Translate>
                  Extensible plugin system
                </Translate>
              </li>
              <li>
                <Translate>
                  Cross-platform code generation
                </Translate>
              </li>
            </ul>
          </div>

          <div className="theme-bg-bg2 rounded-lg p-6 shadow-md">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">
                <i className="fa-solid fa-suitcase text-green-500"></i>
              </span>
              <h3 className="text-xl font-bold">
                {_('CTOs & Leaders')}
              </h3>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Translate>
                  Reduce dev time by 60–80%
                </Translate>
              </li>
              <li>
                <Translate>
                  Improve code consistency across teams
                </Translate>
              </li>
              <li>
                <Translate>
                  Lower maintenance costs
                </Translate>
              </li>
              <li>
                <Translate>
                  Accelerate time-to-market
                </Translate>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}