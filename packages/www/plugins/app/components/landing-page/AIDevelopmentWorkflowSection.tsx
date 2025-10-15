//modules
import { Translate, useLanguage } from 'r22n';
import clsx from 'clsx';

//styles
//----------------------------------------------------------------------

const headlineBarStyle = clsx(
  'bg-yellow-100',
  'border',
  'gap-2',
  'inline-flex',
  'items-center',
  'mb-4',
  'px-3',
  'py-1',
  'rounded-full',
  'text-sm'
);

const stepOneStyle = clsx(
  'bg-pink-100',
  'flex',
  'h-8',
  'items-center',
  'justify-center',
  'rounded-full',
  'text-pink-600',
  'w-8'
);

const stepTwoStyle = clsx(
  'bg-purple-100',
  'flex',
  'h-8',
  'items-center',
  'justify-center',
  'rounded-full',
  'text-purple-600',
  'w-8'
);

const stepThreeStyle = clsx(
  'bg-yellow-100',
  'flex',
  'h-8',
  'items-center',
  'justify-center',
  'rounded-full',
  'text-yellow-600',
  'w-8'
);

const stepFourStyle = clsx(
  'bg-green-100',
  'flex',
  'h-8',
  'items-center',
  'justify-center',
  'rounded-full',
  'text-green-600',
  'w-8'
);

const stepFiveStyle = clsx(
  'bg-blue-100',
  'flex',
  'h-8',
  'items-center',
  'justify-center',
  'rounded-full',
  'text-blue-600',
  'w-8'
);  

//----------------------------------------------------------------------

export default function AIDevelopmentWorkflowSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* AI Development Workflow Section Content */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <div className={headlineBarStyle}>
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

        {/* AI Development Workflow Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className={stepOneStyle}>
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

          {/* Step 2 */}
          <div className="theme-bg-bg1 rounded-lg  p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className={stepTwoStyle}>
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

          {/* Step 3 */}
          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className={stepThreeStyle}>
                <i className="fa-solid fa-plug"></i>
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

          {/* Step 4 */}
          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className={stepFourStyle}>
                <i className="fa-solid fa-bolt"></i>
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

          {/* Step 5 */}
          <div className="theme-bg-bg1 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className={stepFiveStyle}>
                <i className="fa-solid fa-repeat"></i>
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

        {/* Text to describe the workflow */}
        <div className="text-center mt-10">
          <p className="text-lg">
            <Translate>
              This workflow enables rapid prototyping and development and
              goes from idea to working application in minutes rather than
              days.
            </Translate>
          </p>
        </div>
      </section>
    </>
  )
}


