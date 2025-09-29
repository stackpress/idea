//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, H3, SS, Nav, P } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';

//code examples
//----------------------------------------------------------------------

const examples = [
  `import { Exception } from '@stackpress/idea-parser';`,

  //----------------------------------------------------------------------
  `import { parse, Exception } from '@stackpress/idea-parser';

try {
  const result = parse('invalid schema syntax');
} catch (error) {
  if (error instanceof Exception) {
    console.log('Parser error:', error.message);
    console.log('Error position:', error.start, '-', error.end);
    console.log('Stack trace:', error.stack);
  }
}`,

  //----------------------------------------------------------------------

  `import { EnumTree, Exception } from '@stackpress/idea-parser';

try {
  // Missing closing brace
  EnumTree.parse('enum Status { ACTIVE "Active"');
} catch (error) {
  if (error instanceof Exception) {
    console.log('Error message:', error.message);
    console.log('Error starts at character:', error.start);
    console.log('Error ends at character:', error.end);
    
    // Can be used for syntax highlighting in editors
    const errorRange = { start: error.start, end: error.end };
  }
}`,

  //----------------------------------------------------------------------

  `try {
  parse('enum Status { ACTIVE "Active"'); // Missing closing brace
} catch (error) {
  console.log(error.message); // "Unexpected end of input expecting }"
}`,

  //----------------------------------------------------------------------

  `try {
  parse('model user { id String }'); // Invalid - should be capitalized
} catch (error) {
  console.log(error.message); // "Expected CapitalIdentifier but got something else"
}`,

  //----------------------------------------------------------------------

  `try {
  parse('model User { name String @field.input(UnknownProp) }');
} catch (error) {
  console.log(error.message); // "Unknown reference UnknownProp"
}`,

  //----------------------------------------------------------------------

  `try {
  parse(\`
    enum Status { ACTIVE "Active" }
    enum Status { INACTIVE "Inactive" }
  \`);
} catch (error) {
  console.log(error.message); // "Duplicate Status"
}`,

  //----------------------------------------------------------------------

  `import { SchemaTree, EnumTree, ModelTree, Exception } from '@stackpress/idea-parser';

// Any parsing operation can throw Exception
try {
  const schema = SchemaTree.parse(schemaCode);
  const enumAST = EnumTree.parse(enumCode);
  const modelAST = ModelTree.parse(modelCode);
} catch (error) {
  if (error instanceof Exception) {
    // Handle parser-specific errors
    console.error('Parsing failed:', error.message);
  } else {
    // Handle other types of errors
    console.error('Unexpected error:', error);
  }
}`,

  //----------------------------------------------------------------------

  `import { parse, Exception } from '@stackpress/idea-parser';

function parseWithFallback(code: string, fallbackCode?: string) {
  try {
    return parse(code);
  } catch (error) {
    if (error instanceof Exception && fallbackCode) {
      console.warn('Primary parsing failed, trying fallback:', error.message);
      return parse(fallbackCode);
    }
    throw error; // Re-throw if no fallback or different error type
  }
}`,

  //----------------------------------------------------------------------

  `import { parse, Exception } from '@stackpress/idea-parser';

function validateSchema(code: string) {
  try {
    parse(code);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof Exception) {
      return {
        valid: false,
        errors: [{
          message: error.message,
          range: {
            start: error.start,
            end: error.end
          },
          severity: 'error'
        }]
      };
    }
    throw error;
  }
}`,

  //----------------------------------------------------------------------

  `try {
  parse(schemaCode);
} catch (error) {
  if (error instanceof Exception) {
    // Handle parser errors specifically
    handleParserError(error);
  } else {
    // Handle other errors (network, file system, etc.)
    handleGenericError(error);
  }
}`,

  //----------------------------------------------------------------------

  `function highlightError(code: string, error: Exception) {
  const lines = code.split('\\n');
  let currentPos = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const lineEnd = currentPos + lines[i].length;
    
    if (error.start >= currentPos && error.start <= lineEnd) {
      const lineStart = error.start - currentPos;
      const lineEnd = Math.min(error.end - currentPos, lines[i].length);
      
      console.log(\`Line \${i + 1}: \${lines[i]}\`);
      console.log(' '.repeat(lineStart + 8) + '^'.repeat(lineEnd - lineStart));
      break;
    }
    
    currentPos = lineEnd + 1; // +1 for newline
  }
}`,

  //----------------------------------------------------------------------

  `function parseWithContext(code: string, filename?: string) {
  try {
    return parse(code);
  } catch (error) {
    if (error instanceof Exception) {
      const context = filename ? \` in \${filename}\` : '';
      throw new Exception(
        \`Parse error\${context}: \${error.message}\`,
        error.code
      ).withPosition(error.start, error.end);
    }
    throw error;
  }
}`
];

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Exception');
  const description = _(
    'The Exception class extends the Exception class from ' +
    '@stackpress/lib to provide enhanced error handling specific ' +
    'to the idea parser library. It includes position information ' +
    'and better error reporting for parsing failures.'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export function Right() {
  //hooks
  const { _ } = useLanguage();

  return (
    <aside className="px-m-0 px-px-10 px-py-20 px-h-100-40 overflow-auto">
      {/* API Reference Navigation */}
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-0 px-pb-10 uppercase">
        {_('API Reference')}
      </h6>
      <nav className="px-fs-14 px-lh-28 flex flex-col">
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/lexer"
        >
          {_('Lexer API Reference')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler"
        >
          {_('Compiler API Reference')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast"
        >
          {_('AST Reference')}
        </a>

        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/tokens"
        >
          {_('Token Reference')}
        </a>
        <div className="text-blue-300 cursor-pointer">
          {_('Exception Handling')}
        </div>
      </nav>


      {/* On This Page Navigation */}
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-50 px-pb-10 uppercase">
        {_('On This Page')}
      </h6>
      <nav className="px-fs-14 px-lh-28 flex flex-col">
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling"
        >
          {_('A. Exception')}
        </a>

        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling#overview"
        >
          {_('B. Overview')}  
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling#usage-examples"
        >
          {_('C. Usage Examples')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling#integration-with-ast"
        >
          {_('D. Integration with AST')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling#error-recovery"
        >
          {_('E. Error Recovery')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling#language-server-integration"
        >
          {_('F. Language Server Integration')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling#inherited-features"
        >
          {_('G. Inherited Features')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling#best-practices"
        >
          {_('H. Best Practices')}
        </a>  
      </nav>
    </aside>
  );
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      {/* Exception Section Content */}
      <section id='exception'>
        <H1>{_('Exception')}</H1>
        <P>
          <Translate>
            The Exception class extends the Exception class from
            @stackpress/lib to provide enhanced error handling specific
            to the idea parser library. It includes position information
            and better error reporting for parsing failures.
          </Translate>
        </P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />
      
      {/* Overview Section Content */}
      <section id='overview'>
        <H1>{_('Overview')}</H1>
        <Translate>
          Exception is a specialized error class that extends the base
          Exception class with additional functionality for parser-specific
          error handling. It automatically includes position information
          when parsing fails, making it easier to identify and fix syntax
          errors in schema files.
        </Translate>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />
      
      {/* Usage Examples Section Content */}
      <section id='usage-examples'>
        <H1>{_('Usage Examples')}</H1>

        <H2>{_('Basic Error Handling')}</H2>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H2>{_('Position Information')}</H2>
        <Translate>
          Exception includes position information to help locate errors in
          the source code:
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>

        <H2>{_('Common Error Scenarios')}</H2>

        <SS>{_('Syntax Errors')}</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>

        <SS>{_('Invalid Token Types')}</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[4]}
        </Code>

        <SS>{_('Unknown References')}</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[5]}
        </Code>

        <SS>{_('Duplicate Declarations')}</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[6]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />
      
      {/* Integration with AST Section Content */}
      <section id='integration-with-ast'>
        <H1>{_('Integration with AST')}</H1>
        <Translate>
          All AST classes throw Exception when parsing fails:
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Error Recovery Section Content */}
      <section id='error-recovery'>
        <H1>{_('Error Recovery')}</H1>
        <Translate>
          While Exception indicates parsing failure, you can implement error
          recovery strategies:
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[8]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Language Server Integration Section Content */}
      <section id='language-server-integration'>
        <H1>{_('Language Server Integration')}</H1>
        <Translate>
          Exception's position information makes it ideal for language
          server implementations:
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[9]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Inherited Features Section Content */}
      <section id='inherited-features'>
        <H1>{_('Inherited Features')}</H1>
        <Translate>
          Since Exception extends the base Exception class from
          @stackpress/lib, it inherits all the enhanced error handling
          features:
        </Translate>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>{_('Template-based error messages')}</li>
          <li className='my-2'>{_('Enhanced stack trace parsing')}</li>
          <li className='my-2'>{_('Position information support')}</li>
          <li className='my-2'>{_('HTTP status code integration')}</li>
          <li className='my-2'>{_('Validation error aggregation')}</li>
        </ul>
        <Translate>
          For more details on the base Exception functionality, refer to the
          <a href="https://github.com/stackpress/lib#exception"
            className="text-blue-400 hover:text-blue-300 underline">
            {' '}@stackpress/lib Exception documentation
          </a>.
        </Translate>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Best Practices Section Content */}
      <section id='best-practices'>
        <H1>{_('Best Practices')}</H1>

        <H2>{_('Always Check Error Type')}</H2>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H2>{_('Use Position Information')}</H2>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <H2>{_('Provide Helpful Error Messages')}</H2>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Tokens'),
          href: '/docs/parser/pages/tokens'
        }}
      />
    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
      right={<Right />}
    >
      <Body />
    </Layout>
  );
}
