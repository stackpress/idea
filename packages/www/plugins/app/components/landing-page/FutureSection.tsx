import Button from 'frui/form/Button';
import { Translate, useLanguage } from 'r22n';

export default function FutureSection() {
  const { _ } = useLanguage();
  
  return (
    <footer className="py-16 ">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 
            rounded-full bg-green-800 text-green-200 text-sm mb-4">
            <span><i className="fa-solid fa-rocket"></i></span>
            <span>{_('The Future')}</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-yellow-400">{_('Declarative')}</span>. 
            {_(' Type‑Safe. Automated.')}
          </h2>
          
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            <Translate>
              Define intent once. Generate apps, APIs, and docs in seconds.
            </Translate>
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <a href="/docs/getting-started">
              <Button className="bg-yellow-500 hover:bg-yellow-600 
                px-6 py-3 rounded-lg font-bold">
                {_('Get Started')}
              </Button>
            </a>
            <a href="/docs/specifications/syntax-overview" 
              className="px-6 py-3 border border-gray-600 rounded-lg 
                bg-gray-800 hover:bg-gray-700 text-white transition">
              {_('Read the Spec')}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
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
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              {_('Resources')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/docs/specifications/syntax-overview" 
                  className="text-blue-400 hover:text-blue-300 underline">
                  <Translate>
                    Read the Spec
                  </Translate>
                </a>
              </li>
              <li>
                <a href="/docs/plugin-development/plugin-development-guide" 
                  className="text-blue-400 hover:text-blue-300 underline">
                  <Translate>
                    Plugin tutorials
                  </Translate>
                </a>
              </li>
              <li>
                <a href="/docs/getting-started" 
                  className="text-blue-400 hover:text-blue-300 underline">
                  <Translate>
                    Build something
                  </Translate>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              {_('Philosophy')}
            </h3>
            <blockquote className="text-sm  italic mb-2">
              <Translate>
                The fastest, safest line of code is the one you never write.
              </Translate>
            </blockquote>
            <div className="text-xs">
              {_('— Steve Jobs')}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center">
          <p className=" text-sm">
            <Translate>
              © 2025 .idea. Building the future of declarative development.
            </Translate>
          </p>
        </div>
      </div>
    </footer>
  )
}
