//modules
import Button from 'frui/form/Button';
import { Translate, useLanguage } from 'r22n';
import clsx from 'clsx';

//styles
//----------------------------------------------------------------------

const headlineBarStyle = clsx(
  'bg-green-800',
  'border',
  'gap-2',
  'inline-flex',
  'items-center',
  'mb-4',
  'px-3',
  'py-1',
  'rounded-full',
  'text-sm',
  'text-green-200'
);

const getStartedButtonStyle = clsx(
  'bg-yellow-500',
  'hover:bg-yellow-600',
  'px-6',
  'py-3',
  'rounded-lg',
  'font-bold',
  'hover:scale-105',
  'transition'
);

const readTheSpecButtonStyle = clsx(
  'px-6',
  'py-3',
  'border',
  'border-gray-600',
  'rounded-lg',
  'bg-gray-800',
  'hover:bg-gray-700',
  'text-white',
  'hover:scale-105',
  'transition'
);

//----------------------------------------------------------------------

export default function FutureSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Future Section Content */}
      <section className="py-16 ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className={headlineBarStyle}>
              <span><i className="fa-solid fa-rocket"></i></span>
              <span>{_('The Future')}</span>
            </div>

            <h2 className="text-4xl font-bold mb-4">
              <span className="text-yellow-400">{_('Declarative')}</span>.
              {_(' Type‑Safe. Automated.')}
            </h2>

            <p className="text-lg mb-6 max-w-3xl mx-auto">
              <Translate>
                Define intent once. Generate apps, APIs, and docs in 
                seconds.
              </Translate>
            </p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <a href="/docs/getting-started">
                <Button className={getStartedButtonStyle}>
                  {_('Get Started')}
                </Button>
              </a>
              <a href="/docs/specifications/syntax-overview"
                className={readTheSpecButtonStyle}>
                {_('Read the Spec')}
              </a>
            </div>
          </div>

          {/* Features, Benefits, Resources, Philosophy sections */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Features */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                {_('Features')}
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold">
                    {_('Automated')}
                  </h4>
                  <p className="text-sm">
                    <Translate>
                      Less boilerplate. More building.
                    </Translate>
                  </p>
                </div>
                <div>
                  <h4 className="font-bold">
                    {_('Unified')}
                  </h4>
                  <p className="text-sm">
                    <Translate>
                      One spec, many outputs.
                    </Translate>
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                {_('Benefits')}
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold">
                    {_('Proactive')}
                  </h4>
                  <p className="text-sm">
                    <Translate>
                      Types catch issues early.
                    </Translate>
                  </p>
                </div>
                <div>
                  <h4 className="font-bold">
                    {_('Instant')}
                  </h4>
                  <p className="text-sm">
                    <Translate>
                      Generate full layers fast.
                    </Translate>
                  </p>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                {_('Resources')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/docs/specifications/syntax-overview"
                    className="text-blue-500 hover:text-blue-600 underline">
                    <Translate>
                      Read the Spec
                    </Translate>
                  </a>
                </li>
                <li>
                  <a href="/docs/plugin-development/plugin-development-guide"
                    className="text-blue-500 hover:text-blue-600 underline">
                    <Translate>
                      Plugin tutorials
                    </Translate>
                  </a>
                </li>
                <li>
                  <a href="/docs/getting-started"
                    className="text-blue-500 hover:text-blue-600 underline">
                    <Translate>
                      Build something
                    </Translate>
                  </a>
                </li>
              </ul>
            </div>

            {/* Philosophy */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                {_('Philosophy')}
              </h3>
              <blockquote className="text-sm  italic mb-2">
                <Translate>
                  "The fastest, safest line of code is the one you never write."
                </Translate>
              </blockquote>
              <h6 className="text-xs">
                {_('— Steve Jobs')}
              </h6>
            </div>
          </section>

          {/* Copyright section */}
          <section className="border-t border-gray-700 pt-6 text-center">
            <p className=" text-sm">
              <Translate>
                © 2025 .idea. Building the future of declarative development.
              </Translate>
            </p>
          </section>
        </div>
      </section>
    </>
  )
}
