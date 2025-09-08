//modules
import type {
    ServerConfigProps,
    ServerPageProps
  } from 'stackpress/view/client';
  import { useLanguage } from 'stackpress/view/client';
  //docs
  import { H1, H2, H3, P, C, SS, Nav } from '../../../components/index.js';
  import Code from '../../../components/Code.js';
  import Layout from '../../../components/Layout.js';
  import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
  
  export function Head(props: ServerPageProps<ServerConfigProps>) {
    //props
    const { request, styles = [] } = props;
    //hooks
    const { _ } = useLanguage();
    //variables
    const title = _('Exception');
    const description = _(
      'The Exception class extends the Exception class from @stackpress/lib to provide enhanced error handling specific to the idea parser library. It includes position information and better error reporting for parsing failures.'
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
  
const examples = [
  `import { Exception } from '@stackpress/idea-parser';`,
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
  `try {
  parse('enum Status { ACTIVE "Active"'); // Missing closing brace
} catch (error) {
  console.log(error.message); // "Unexpected end of input expecting }"
}`,
  `try {
  parse('model user { id String }'); // Invalid - should be capitalized
} catch (error) {
  console.log(error.message); // "Expected CapitalIdentifier but got something else"
}`,
  `try {
  parse('model User { name String @field.input(UnknownProp) }');
} catch (error) {
  console.log(error.message); // "Unknown reference UnknownProp"
}`,
  `try {
  parse(\`
    enum Status { ACTIVE "Active" }
    enum Status { INACTIVE "Inactive" }
  \`);
} catch (error) {
  console.log(error.message); // "Duplicate Status"
}`,
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
]
  
  export function Body() {
    return (
      <main className="px-h-100-0 overflow-auto px-p-10">
        <H1>Exception</H1>
        <P>The Exception class extends the Exception class from <C>@stackpress/lib</C> to provide enhanced error handling specific to the idea parser library. It includes position information and better error reporting for parsing failures.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>

        <H2>Overview</H2>
        <P>Exception is a specialized error class that extends the base Exception class with additional functionality for parser-specific error handling. It automatically includes position information when parsing fails, making it easier to identify and fix syntax errors in schema files.</P>

        <H2>Usage Examples</H2>

        <H3>Basic Error Handling</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H3>Position Information</H3>
        <P>Exception includes position information to help locate errors in the source code:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>

        <H3>Common Error Scenarios</H3>

        <SS>Syntax Errors</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>

        <SS>Invalid Token Types</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[4]}
        </Code>

        <SS>Unknown References</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[5]}
        </Code>

        <SS>Duplicate Declarations</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[6]}
        </Code>

        <H2>Integration with AST</H2>
        <P>All AST classes throw Exception when parsing fails:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <H2>Error Recovery</H2>
        <P>While Exception indicates parsing failure, you can implement error recovery strategies:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[8]}
        </Code>

        <H2>Language Server Integration</H2>
        <P>Exception's position information makes it ideal for language server implementations:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <H2>Inherited Features</H2>
        <P>Since Exception extends the base Exception class from <C>@stackpress/lib</C>, it inherits all the enhanced error handling features:</P>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>Template-based error messages</li>
          <li className='my-2'>Enhanced stack trace parsing</li>
          <li className='my-2'>Position information support</li>
          <li className='my-2'>HTTP status code integration</li>
          <li className='my-2'>Validation error aggregation</li>
        </ul>
        <P>For more details on the base Exception functionality, refer to the <a href="https://github.com/stackpress/lib#exception" className="text-blue-400 hover:text-blue-300 underline">@stackpress/lib Exception documentation</a>.</P>

        <H2>Best Practices</H2>

        <H3>Always Check Error Type</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H3>Use Position Information</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <H3>Provide Helpful Error Messages</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <Nav
          prev={{ text: 'Tokens', href: '/docs/parser/pages/tokens' }}
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
      >
        <Body />
      </Layout>
    );
  }
