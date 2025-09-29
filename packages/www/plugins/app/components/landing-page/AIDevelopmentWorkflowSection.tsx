//modules
import { Translate, useLanguage } from 'r22n';

export default function AIDevelopmentWorkflowSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* AI Development Workflow Section Content */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 
          rounded-full bg-yellow-100 border text-sm mb-4">
            <span className="text-yellow-600">
              <i className="fa-solid fa-robot"></i>
            </span>
            <span className="text-yellow-800">
              {_('AI‑Powered Development Workflow')}
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4">
            {_('Build faster with AI + .idea')}
          </h2>

          <p className="text-lg">
            <Translate>
              The .idea format is perfect for AI‑driven development.
            </Translate>
          </p>
        </div>

        <div className="space-y-6">
          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center 
          rounded-full bg-pink-100 text-pink-600">
                <i className="fa-solid fa-comment"></i>
              </span>
              <h3 className="font-bold text-lg">
                {_('Step 1')}
              </h3>
            </div>
            <p className="ml-11">
              <Translate>
                Describe your application to an AI assistant
              </Translate>
            </p>
          </div>

          <div className="theme-bg-bg1 rounded-lg  p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center 
          rounded-full bg-purple-100 text-purple-600">
                <i className="fa-solid fa-lightbulb"></i>
              </span>
              <h3 className="font-bold text-lg">
                {_('Step 2')}
              </h3>
            </div>
            <p className="ml-11">
              <Translate>
                Generate a .idea schema from the description
              </Translate>
            </p>
          </div>

          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center 
          rounded-full bg-yellow-100 text-yellow-600">
                🔌
              </span>
              <h3 className="font-bold text-lg">
                {_('Step 3')}
              </h3>
            </div>
            <p className="ml-11">
              <Translate>
                Configure plugins for your target technologies
              </Translate>
            </p>
          </div>

          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center 
          rounded-full bg-green-100 text-green-600">
                ⚡
              </span>
              <h3 className="font-bold text-lg">
                {_('Step 4')}
              </h3>
            </div>
            <p className="ml-11">
              <Translate>
                Execute the transformation to generate full‑stack code
              </Translate>
            </p>
          </div>

          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center 
              rounded-full bg-blue-100 text-blue-600">
                🔄
              </span>
              <h3 className="font-bold text-lg">
                {_('Step 5')}
              </h3>
            </div>
            <p className="ml-11">
              <Translate>
                Iterate by updating the schema and regenerating
              </Translate>
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-lg">
            <Translate>
              This workflow enables rapid prototyping and development — go
              from idea to working application in minutes rather than days.
            </Translate>
          </p>
        </div>
      </section>
    </>
  )
}


