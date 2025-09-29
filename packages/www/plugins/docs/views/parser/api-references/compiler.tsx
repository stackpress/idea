//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, H3, P, C, Nav } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
//----------------------------------------------------------------------

const basicImportExample =
  `import { Compiler } from '@stackpress/idea-parser';`

//----------------------------------------------------------------------

const arrayTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example array token from parsing ["value1", "value2", "value3"]
const arrayToken = {
  type: 'ArrayExpression',
  elements: [
    { type: 'Literal', value: 'value1' },
    { type: 'Literal', value: 'value2' },
    { type: 'Literal', value: 'value3' }
  ]
};

const result = Compiler.array(arrayToken);
console.log(result); // ['value1', 'value2', 'value3']`

//----------------------------------------------------------------------

const dataTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Compile different types of data tokens
const literalResult = Compiler.data({ type: 'Literal', value: 'hello' });
console.log(literalResult); // 'hello'

const objectResult = Compiler.data({
  type: 'ObjectExpression',
  properties: [
    {
      key: { name: 'name' },
      value: { type: 'Literal', value: 'John' }
    }
  ]
});
console.log(objectResult); // { name: 'John' }`

//----------------------------------------------------------------------

const enumTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example enum token from parsing: 
// enum Status { ACTIVE "Active" INACTIVE "Inactive" }
const enumToken = {
  kind: 'enum',
  declarations: [{
    id: { name: 'Status' },
    init: {
      properties: [
        { 
          key: { name: 'ACTIVE' }, 
          value: { type: 'Literal', value: 'Active' } 
        },
        { 
          key: { name: 'INACTIVE' }, 
          value: { type: 'Literal', value: 'Inactive' } 
        }
      ]
    }
  }]
};

const [name, config] = Compiler.enum(enumToken);
console.log(name); // 'Status'
console.log(config); // { ACTIVE: 'Active', INACTIVE: 'Inactive' }`

//----------------------------------------------------------------------

const finalSchemaExample =
  `import { Compiler } from '@stackpress/idea-parser';

// This method removes prop and use references for a clean final output
const finalSchema = Compiler.final(schemaToken);
console.log(finalSchema);
// Output will not contain 'prop' or 'use' sections`

//----------------------------------------------------------------------

const identifierTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// With references provided
const references = { MyProp: { type: 'text' } };
const result1 = Compiler.identifier({ name: 'MyProp' }, references);
console.log(result1); // { type: 'text' }

// Without references (returns template string)
const result2 = Compiler.identifier({ name: 'MyProp' }, false);
console.log(result2); // '\${MyProp}'

// With empty references (throws error)
try {
  Compiler.identifier({ name: 'UnknownProp' }, {});
} catch (error) {
  console.log(error.message); // 'Unknown reference UnknownProp'
}`

//----------------------------------------------------------------------

const literalTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

const stringLiteral = Compiler.literal({ type: 'Literal', value: 'hello' });
console.log(stringLiteral); // 'hello'

const numberLiteral = Compiler.literal({ type: 'Literal', value: 42 });
console.log(numberLiteral); // 42

const booleanLiteral = Compiler.literal({ type: 'Literal', value: true });
console.log(booleanLiteral); // true`

//----------------------------------------------------------------------

const modelTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example model token from parsing: 
// model User { id String @id name String }
const modelToken = {
  kind: 'model',
  mutable: false, // model User! would be true
  declarations: [{
    id: { name: 'User' },
    init: {
      properties: [
        {
          key: { name: 'columns' },
          value: {
            type: 'ObjectExpression',
            properties: [
              {
                key: { name: 'id' },
                value: {
                  type: 'ObjectExpression',
                  properties: [
                    { 
                      key: { name: 'type' }, 
                      value: { type: 'Literal', value: 'String' } 
                    },
                    { key: { name: 'attributes' }, value: { /* attributes */ } }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }]
};

const [name, config] = Compiler.model(modelToken);
console.log(name); // 'User'
console.log(config.mutable); // false
console.log(config.columns); // Array of column configurations`

//----------------------------------------------------------------------

const objectTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example object token from parsing { name "John" age 30 }
const objectToken = {
  type: 'ObjectExpression',
  properties: [
    { key: { name: 'name' }, value: { type: 'Literal', value: 'John' } },
    { key: { name: 'age' }, value: { type: 'Literal', value: 30 } }
  ]
};

const result = Compiler.object(objectToken);
console.log(result); // { name: 'John', age: 30 }`

//----------------------------------------------------------------------

const pluginTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example plugin token from parsing: 
// plugin "./database" { provider "postgresql" }
const pluginToken = {
  kind: 'plugin',
  declarations: [{
    id: { name: './database' },
    init: {
      properties: [
        { 
          key: { name: 'provider' }, 
          value: { type: 'Literal', value: 'postgresql' } 
        }
      ]
    }
  }]
};

const [name, config] = Compiler.plugin(pluginToken);
console.log(name); // './database'
console.log(config); // { provider: 'postgresql' }`

//----------------------------------------------------------------------

const propTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example prop token from parsing: 
// prop Text { type "text" format "lowercase" }
const propToken = {
  kind: 'prop',
  declarations: [{
    id: { name: 'Text' },
    init: {
      properties: [
        { key: { name: 'type' }, value: { type: 'Literal', value: 'text' } },
        { 
          key: { name: 'format' }, 
          value: { type: 'Literal', value: 'lowercase' } 
        }
      ]
    }
  }]
};

const [name, config] = Compiler.prop(propToken);
console.log(name); // 'Text'
console.log(config); // { type: 'text', format: 'lowercase' }`

//----------------------------------------------------------------------

const schemaDeclarationExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Compile a complete schema with all declaration types
const schemaConfig = Compiler.schema(schemaToken);
console.log(schemaConfig);
// Output contains: { enum: {...}, prop: {...}, type: {...}, model: {...}, plugin: {...}, use: [...] }

// Compile with finalization (resolves references)
const finalizedConfig = Compiler.schema(schemaToken, true);
console.log(finalizedConfig);
// References are resolved in the output`

//----------------------------------------------------------------------

const typeTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example type token from parsing: 
// type Address { street String city String }
const typeToken = {
  kind: 'type',
  mutable: true, // type Address (mutable) vs type Address! (immutable)
  declarations: [{
    id: { name: 'Address' },
    init: {
      properties: [
        {
          key: { name: 'columns' },
          value: {
            type: 'ObjectExpression',
            properties: [
              {
                key: { name: 'street' },
                value: {
                  type: 'ObjectExpression',
                  properties: [
                    { key: { name: 'type' }, value: { type: 'Literal', value: 'String' } }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }]
};

const [name, config] = Compiler.type(typeToken);
console.log(name); // 'Address'
console.log(config.mutable); // true
console.log(config.columns); // Array of column configurations`

//----------------------------------------------------------------------

const useTokenExample =
  `import { Compiler } from '@stackpress/idea-parser';

// Example use token from parsing: use "./another.idea"
const useToken = {
  type: 'ImportDeclaration',
  source: { type: 'Literal', value: './another.idea' }
};

const importPath = Compiler.use(useToken);
console.log(importPath); // './another.idea'`

//----------------------------------------------------------------------

const invalidTokenTypesExample =
  `// Throws: "Invalid data token type"
Compiler.data({ type: 'UnknownType' });

// Throws: "Invalid Enum"
Compiler.enum({ kind: 'notAnEnum' });

// Throws: "Invalid Plugin"
Compiler.plugin({ kind: 'notAPlugin' });

// Throws: "Invalid Prop"
Compiler.prop({ kind: 'notAProp' });

// Throws: "Invalid Schema"
Compiler.schema({ kind: 'notASchema' });

// Throws: "Invalid Type"
Compiler.type({ kind: 'notAType' });

// Throws: "Invalid Import"
Compiler.use({ type: 'NotAnImportDeclaration' });`

//----------------------------------------------------------------------

const missingPropertiesExample =
  `// Throws: "Expecting a columns property"
Compiler.model({
  kind: 'model',
  declarations: [{
    id: { name: 'User' },
    init: { properties: [] } // Missing columns
  }]
});`

//----------------------------------------------------------------------

const unknownReferencesExample =
  `// Throws: "Unknown reference MyProp"
Compiler.identifier({ name: 'MyProp' }, {});`

//----------------------------------------------------------------------

const duplicateDeclarationsExample =
  `// Throws: "Duplicate MyEnum" when compiling schema with duplicate names
Compiler.schema(schemaWithDuplicates);`

//----------------------------------------------------------------------

const typeModifiersExample =
  `Optional types: String? → { type: 'String', required: false }
Array types: String[] → { type: 'String', multiple: true }
Combined: String[]? → { type: 'String', required: false, multiple: true }`

//----------------------------------------------------------------------

const columnConfigurationExample =
  `// Input object format
{
  columns: {
    id: { type: 'String', attributes: { id: true } },
    name: { type: 'String', attributes: { required: true } }
  }
}

// Output array format
{
  columns: [
    { name: 'id', type: 'String', required: true, multiple: false, 
      attributes: { id: true } },
    { name: 'name', type: 'String', required: true, multiple: false, 
      attributes: { required: true } }
  ]
}`

//----------------------------------------------------------------------

const usageWithASTExample =
  `import { Compiler, EnumTree, ModelTree, SchemaTree } from '@stackpress/idea-parser';

// Parse and compile individual components
const enumAST = EnumTree.parse('enum Status { ACTIVE "Active" }');
const [enumName, enumConfig] = Compiler.enum(enumAST);

const modelAST = ModelTree.parse('model User { id String @id }');
const [modelName, modelConfig] = Compiler.model(modelAST);

// Parse and compile complete schema
const schemaAST = SchemaTree.parse(schemaCode);
const schemaConfig = Compiler.schema(schemaAST);`

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Compiler');
  const description = _(
    'Compiler class documentation for the Idea Parser library, ' +
    'including methods for compiling AST tokens into structured ' +
    'JSON configurations.'
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
      <link
        rel="stylesheet"
        type="text/css"
        href="/styles/global.css"
      />
      {styles.map((href, index) => (
        <link
          key={index}
          rel="stylesheet"
          type="text/css"
          href={href}
        />
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
        <div className="text-blue-300 cursor-pointer">
          {_('Compiler API Reference')}
        </div>
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
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/exception-handling"
        >
          {_('Exception Handling')}
        </a>
      </nav>


      {/* On This Page Navigation */}
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-50 px-pb-10 uppercase">
        {_('On This Page')}
      </h6>
      <nav className="px-fs-14 px-lh-28 flex flex-col">
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#compiler"
        >
          {_('A. Compiler')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#static-methods"
        >
          {_('1. Static Methods')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-array-tokens"
        >
          {_('1.1 Array Tokens')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-data-tokens"
        >
          {_('1.2 Data Tokens')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-enum-declarations"
        >
          {_('1.3 Enum Declarations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-final-schema"
        >
          {_('1.4 Schema to Final JSON')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-identifier-tokens"
        >
          {_('1.5 Identifier Tokens')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-literal-tokens"
        >
          {_('1.6 Literal Tokens')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-model-declarations"
        >
          {_('1.7 Model Declarations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-object-tokens"
        >
          {_('1.8 Object Tokens')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-plugin-declarations"
        >
          {_('1.9 Plugin Declarations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-prop-declarations"
        >
          {_('1.10 Prop Declarations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-schema-declarations"
        >
          {_('1.11 Schema Declarations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-type-declarations"
        >
          {_('1.12 Type Declarations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#converting-use-declarations"
        >
          {_('1.13 Use Declarations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#error-handling"
        >
          {_('B. Error Handling')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#type-processing"
        >
          {_('C. Type Processing')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/compiler#usage-with-ast"
        >
          {_('D. Usage with AST')}
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
      {/* Compiler Section Content */}
      <section id='compiler'>
        <H1>{_('Compiler')}</H1>
        <P>
          <Translate>
            The Compiler class provides static methods for converting
            Abstract Syntax Tree (AST) tokens into structured JSON
            configurations. It serves as the bridge between parsed tokens
            and the final JSON output.
          </Translate>
        </P>
        <Code copy language='javascript' className='bg-black text-white'>
          {basicImportExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Static Methods Section Content */}
      <section id='static-methods'>
        <H1>{_('1. Static Methods')}</H1>
        <P>
          <Translate>
            The following methods can be accessed directly from the
            Compiler class.
          </Translate>
        </P>

        {/* Converting Array Tokens Section Content */}
        <section id='converting-array-tokens'>
          <H2>{_('1.1 Converting Array Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to compile array tokens into
              actual arrays.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {arrayTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Trow className="theme-bg-bg2 text-left">
              <Thead>Parameter</Thead>
              <Thead>Type</Thead>
              <Thead>Description</Thead>
            </Trow>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>ArrayToken</C></Tcol>
              <Tcol>
                <Translate>
                  The array token to compile
                </Translate>
              </Tcol>
            </Trow>
            <Trow className='theme-bg-bg2'>
              <Tcol><C>references</C></Tcol>
              <Tcol><C>UseReferences</C></Tcol>
              <Tcol>
                <Translate>
                  Reference map for resolving identifiers (default: false)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              An array containing the compiled elements.
            </Translate>
          </P>
        </section>


        {/* Converting Data Tokens Section Content */}
        <section id='converting-data-tokens'>
          <H2>{_('1.2 Converting Data Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to compile various data tokens
              into their actual values.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {dataTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Trow className="theme-bg-bg2 text-left">
              <Thead>Parameter</Thead>
              <Thead>Type</Thead>
              <Thead>Description</Thead>
            </Trow>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>DataToken</C></Tcol>
              <Tcol>
                <Translate>
                  The data token to compile (can be object, array, literal,
                  or identifier)
                </Translate>
              </Tcol>
            </Trow>
            <Trow className='theme-bg-bg2'>
              <Tcol><C>references</C></Tcol>
              <Tcol><C>UseReferences</C></Tcol>
              <Tcol>
                <Translate>
                  Reference map for resolving identifiers (default: false)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              The compiled data value based on the token type.
            </Translate>
          </P>
        </section>

        {/* Converting Enum Declarations Section Content */}
        <section id='converting-enum-declarations'>
          <H2>{_('1.3 Converting Enum Declarations')}</H2>
          <P>
            <Translate>
              The following example shows how to compile enum declarations
              into JSON configurations.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {enumTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>DeclarationToken</C></Tcol>
              <Tcol>
                <Translate>
                  The enum declaration token to compile
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              A tuple containing the enum name and its configuration object.
            </Translate>
          </P>
        </section>

        {/* Converting Final Schema Section Content */}
        <section id='converting-final-schema'>
          <H2>{_('1.4 Converting Schema to Final JSON')}</H2>
          <P>
            <Translate>
              The following example shows how to compile a schema token
              into a final JSON configuration.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {finalSchemaExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>SchemaToken</C></Tcol>
              <Tcol>
                <Translate>
                  The schema token to compile into final form
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              A <C>FinalSchemaConfig</C> object with references resolved
              and removed.
            </Translate>
          </P>
        </section>

        {/* Converting Identifier Tokens Section Content */}
        <section id='converting-identifier-tokens'>
          <H2>{_('1.5 Converting Identifier Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to resolve identifier tokens
              to their actual values.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {identifierTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Trow className="theme-bg-bg2 text-left">
              <Thead>Parameter</Thead>
              <Thead>Type</Thead>
              <Thead>Description</Thead>
            </Trow>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>IdentifierToken</C></Tcol>
              <Tcol>
                <Translate>
                  The identifier token to resolve
                </Translate>
              </Tcol>
            </Trow>
            <Trow className='theme-bg-bg2'>
              <Tcol><C>references</C></Tcol>
              <Tcol><C>UseReferences</C></Tcol>
              <Tcol>
                <Translate>
                  Reference map for resolving the identifier
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              The resolved value from references, a template string,
              or throws an error.
            </Translate>
          </P>
        </section>

        {/* Converting Literal Tokens Section Content */}
        <section id='converting-literal-tokens'>
          <H2>{_('1.6 Converting Literal Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to extract values from
              literal tokens.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {literalTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>LiteralToken</C></Tcol>
              <Tcol>
                <Translate>
                  The literal token to extract value from
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              The literal value (string, number, boolean, etc.).
            </Translate>
          </P>
        </section>

        {/* Converting Model Declarations Section Content */}
        <section id='converting-model-declarations'>
          <H2>{_('1.7 Converting Model Declarations')}</H2>
          <P>
            <Translate>
              The following example shows how to compile model declarations
              into JSON configurations.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {modelTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Trow className="theme-bg-bg2 text-left">
              <Thead>Parameter</Thead>
              <Thead>Type</Thead>
              <Thead>Description</Thead>
            </Trow>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>DeclarationToken</C></Tcol>
              <Tcol>
                <Translate>
                  The model declaration token to compile
                </Translate>
              </Tcol>
            </Trow>
            <Trow className='theme-bg-bg2'>
              <Tcol><C>references</C></Tcol>
              <Tcol><C>UseReferences</C></Tcol>
              <Tcol>
                <Translate>
                  Reference map for resolving identifiers (default: false)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              A tuple containing the model name and its configuration object.
            </Translate>
          </P>
        </section>

        {/* Converting Object Tokens Section Content */}
        <section id='converting-object-tokens'>
          <H2>{_('1.8 Converting Object Tokens')}</H2>
          <P>
            <Translate>
              The following example shows how to compile object tokens
              into actual objects.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {objectTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>ObjectToken</C></Tcol>
              <Tcol>
                <Translate>
                  The object token to compile
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>references</C></Tcol>
              <Tcol><C>UseReferences</C></Tcol>
              <Tcol>
                <Translate>
                  Reference map for resolving identifiers (default: false)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              An object with compiled key-value pairs.
            </Translate>
          </P>
        </section>

        {/* Converting Plugin Declarations Section Content */}
        <section id='converting-plugin-declarations'>
          <H2>{_('1.9 Converting Plugin Declarations')}</H2>
          <P>
            <Translate>
              The following example shows how to compile plugin declarations
              into JSON configurations.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {pluginTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>DeclarationToken</C></Tcol>
              <Tcol>
                <Translate>
                  The plugin declaration token to compile
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              A tuple containing the plugin name and its configuration object.
            </Translate>
          </P>
        </section>

        {/* Converting Prop Declarations Section Content */}
        <section id='converting-prop-declarations'>
          <H2>{_('1.10 Converting Prop Declarations')}</H2>
          <P>
            <Translate>
              The following example shows how to compile prop declarations
              into JSON configurations.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {propTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>DeclarationToken</C></Tcol>
              <Tcol>
                <Translate>
                  The prop declaration token to compile
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>references</C></Tcol>
              <Tcol><C>UseReferences</C></Tcol>
              <Tcol>
                <Translate>
                  Reference map for resolving identifiers (default: false)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              A tuple containing the prop name and its configuration object.
            </Translate>
          </P>
        </section>

        {/* Converting Schema Declarations Section Content */}
        <section id='converting-schema-declarations'>
          <H2>{_('1.11 Converting Schema Declarations')}</H2>
          <P>
            <Translate>
              The following example shows how to compile complete schema
              tokens into JSON configurations.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {schemaDeclarationExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>SchemaToken</C></Tcol>
              <Tcol>
                <Translate>
                  The schema token to compile
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>finalize</C></Tcol>
              <Tcol><C>boolean</C></Tcol>
              <Tcol>
                <Translate>
                  Whether to resolve references (default: false)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              A <C>SchemaConfig</C> object containing all compiled declarations.
            </Translate>
          </P>
        </section>

        {/* Converting Type Declarations Section Content */}
        <section id='converting-type-declarations'>
          <H2>{_('1.12 Converting Type Declarations')}</H2>
          <P>
            <Translate>
              The following example shows how to compile type declarations
              into JSON configurations.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {typeTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>DeclarationToken</C></Tcol>
              <Tcol>
                <Translate>
                  The type declaration token to compile
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>references</C></Tcol>
              <Tcol><C>UseReferences</C></Tcol>
              <Tcol>
                <Translate>
                  Reference map for resolving identifiers (default: false)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              A tuple containing the type name and its configuration object.
            </Translate>
          </P>
        </section>

        {/* Converting Use Declarations Section Content */}
        <section id='converting-use-declarations'>
          <H2>{_('1.13 Converting Use Declarations')}</H2>
          <P>
            <Translate>
              The following example shows how to compile use (import)
              declarations.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {useTokenExample}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table className="text-left mt-5">
            <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
            <Thead className="theme-bg-bg2 text-left">Type</Thead>
            <Thead className="theme-bg-bg2 text-left">Description</Thead>
            <Trow>
              <Tcol><C>token</C></Tcol>
              <Tcol><C>ImportToken</C></Tcol>
              <Tcol>
                <Translate>
                  The import declaration token to compile
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <H2>{_('Returns')}</H2>
          <P>
            <Translate>
              The import path as a string.
            </Translate>
          </P>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Error Handling Section Content */}
      <section id='error-handling'>
        <H1>{_('Error Handling')}</H1>
        <P>
          <Translate>
            The Compiler class throws Exception errors for various
            invalid conditions:
          </Translate>
        </P>

        <H2>{_('Invalid Token Types')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {invalidTokenTypesExample}
        </Code>

        <H2>{_('Missing Required Properties')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {missingPropertiesExample}
        </Code>

        <H2>{_('Unknown References')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {unknownReferencesExample}
        </Code>

        <H2>{_('Duplicate Declarations')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {duplicateDeclarationsExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Type Processing Section Content */}
      <section id='type-processing'>
        <H1>{_('Type Processing')}</H1>
        <P>
          <Translate>
            The Compiler automatically processes type information for
            models and types:
          </Translate>
        </P>

        <H2>{_('Type Modifiers')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {typeModifiersExample}
        </Code>

        <H2>{_('Column Configuration')}</H2>
        <P>
          <Translate>
            Models and types are converted from object format to array
            format to preserve column order:
          </Translate>
        </P>
        <Code copy language='javascript' className='bg-black text-white'>
          {columnConfigurationExample}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Usage with AST Section Content */}
      <section id='usage-with-ast'>
        <H1>{_('Usage with AST')}</H1>
        <P>
          <Translate>
            The Compiler is typically used in conjunction with AST classes:
          </Translate>
        </P>
        <Code copy language='javascript' className='bg-black text-white'>
          {usageWithASTExample}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: 'Lexer',
          href: '/docs/parser/api-references/lexer'
        }}
        next={{
          text: 'Syntax Trees',
          href: '/docs/parser/api-references/ast'
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




