import { H1, H2, H3, P, A } from '../../../../components/index.js'

export default function References() {
  return (
    <section id="10-references">
      <H1>10. References</H1>
      <P>
        This section provides comprehensive resources for continued learning and development with ts-morph. These references include official documentation, community resources, and related tools that enhance the plugin development experience.
      </P>

      <H2>10.1. Official Documentation</H2>
      <P>
        Official documentation provides authoritative information about ts-morph APIs, TypeScript compiler internals, and AST manipulation techniques.
      </P>
      <P>
        <A href="https://ts-morph.com/" blank>ts-morph Documentation</A>: https://ts-morph.com/
      </P>
      <P>
        <A href="https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API" blank>TypeScript Compiler API</A>: https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
      </P>
      <P>
        <A href="https://ts-ast-viewer.com/" blank>TypeScript AST Viewer</A>: https://ts-ast-viewer.com/
      </P>

      <H2>10.2. Useful Resources</H2>
      <P>
        Additional resources provide practical examples, community insights, and tools that complement the official documentation for comprehensive plugin development.
      </P>
      <P>
        <A href="https://github.com/dsherret/ts-morph" blank>ts-morph GitHub Repository</A>: https://github.com/dsherret/ts-morph
      </P>
      <P>
        <A href="https://www.typescriptlang.org/docs/" blank>TypeScript Handbook</A>: https://www.typescriptlang.org/docs/
      </P>
      <P>
        <A href="https://astexplorer.net/" blank>AST Explorer</A>: https://astexplorer.net/
      </P>

      <H2>10.3. Community Examples</H2>
      <P>
        Community examples showcase real-world usage patterns and provide inspiration for advanced plugin development techniques.
      </P>
      <P>
        <A href="https://github.com/dsherret/ts-morph/tree/latest/packages/ts-morph/scripts" blank>ts-morph Examples</A>: https://github.com/dsherret/ts-morph/tree/latest/packages/ts-morph/scripts
      </P>
      <P>
        <A href="https://github.com/topics/code-generation" blank>Code Generation Patterns</A>: https://github.com/topics/code-generation
      </P>

      <H3>Related Tools</H3>
      <P>
        <A href="https://typescript-eslint.io/" blank>TypeScript ESLint</A>: For linting generated code
      </P>
      <P>
        <A href="https://prettier.io/" blank>Prettier</A>: For formatting generated code
      </P>
      <P>
        <A href="https://typestrong.org/ts-node/" blank>ts-node</A>: For running TypeScript directly
      </P>
      <P>
        <A href="https://jestjs.io/" blank>Jest</A>: For testing your plugins
      </P>

      <P>
        This comprehensive guide provides everything you need to create powerful code generation plugins using ts-morph. The library's type-safe approach to code manipulation makes it an excellent choice for building robust, maintainable code generators that produce high-quality TypeScript output.
      </P>
    </section>
  )
}
