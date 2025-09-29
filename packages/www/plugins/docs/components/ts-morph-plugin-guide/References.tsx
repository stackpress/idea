//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, H3, P } from '../index.js'

export default function References() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
    {/* References Section Content */}
      <section id="references">
        <H1>{_('10. References')}</H1>
        <P>
          <Translate>
            This section provides comprehensive resources for continued
            learning and development with ts-morph. These references
            include official documentation, community resources, and
            related tools that enhance the plugin development experience.
          </Translate>
        </P>
      </section>

      {/* Official Documentation */}
      <section>
        <H2>{_('10.1. Official Documentation')}</H2>
        <P>
          <Translate>
            Official documentation provides authoritative information
            about ts-morph APIs, TypeScript compiler internals, and AST
            manipulation techniques.
          </Translate>
        </P>
        <P>
          <a
            href="https://ts-morph.com/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            ts-morph Documentation
          </a>:
          https://ts-morph.com/
        </P>
        <P>
          <a
            href="https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            TypeScript Compiler API
          </a>:
          https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
        </P>
        <P>
          <a
            href="https://ts-ast-viewer.com/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            TypeScript AST Viewer
          </a>:
          https://ts-ast-viewer.com/
        </P>
      </section>

      {/* Useful Resources */}
      <section>
        <H2>{_('10.2. Useful Resources')}</H2>
        <P>
          <Translate>
            Additional resources provide practical examples, community
            insights, and tools that complement the official documentation
            for comprehensive plugin development.
          </Translate>
        </P>
        <P>
          <a
            href="https://github.com/dsherret/ts-morph"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            ts-morph GitHub Repository
          </a>:
          https://github.com/dsherret/ts-morph
        </P>
        <P>
          <a
            href="https://www.typescriptlang.org/docs/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            TypeScript Handbook
          </a>:
          https://www.typescriptlang.org/docs/
        </P>
        <P>
          <a
            href="https://astexplorer.net/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >AST Explorer</a>:
          https://astexplorer.net/
        </P>
      </section>

      {/* Community Examples and Related Tools */}
      <section>
        <H2>{_('10.3. Community Examples')}</H2>
        <P>
          <Translate>
            Community examples showcase real-world usage patterns and
            provide inspiration for advanced plugin development techniques.
          </Translate>
        </P>
        <P>
          <a
            href="https://github.com/dsherret/ts-morph/tree/latest/packages/ts-morph/scripts"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            ts-morph Examples
          </a>:
          https://github.com/dsherret/ts-morph/tree/latest/packages/ts-morph/scripts
        </P>
        <P>
          <a
            href="https://github.com/topics/code-generation"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            Code Generation Patterns
          </a>:
          https://github.com/topics/code-generation
        </P>

        <H3>{_('Related Tools')}</H3>
        <P>
          <a
            href="https://typescript-eslint.io/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >
            TypeScript ESLint
          </a>:
          <Translate>
            For linting generated code
          </Translate>
        </P>
        <P>
          <a
            href="https://prettier.io/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >Prettier</a>:
          <Translate>
            For formatting generated code
          </Translate>
        </P>
        <P>
          <a
            href="https://typestrong.org/ts-node/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >ts-node</a>:
          <Translate>
            For running TypeScript directly
          </Translate>
        </P>
        <P>
          <a
            href="https://jestjs.io/"
            target='_blank'
            className='text-blue-500 hover:text-blue-700'
          >Jest</a>:
          <Translate>
            For testing your plugins
          </Translate>
        </P>

        <P>
          <Translate>
            This comprehensive guide provides everything you need to create
            powerful code generation plugins using ts-morph. The library's
            type-safe approach to code manipulation makes it an excellent
            choice for building robust, maintainable code generators that
            produce high-quality TypeScript output.
          </Translate>
        </P>
      </section>
    </>
  )
}
