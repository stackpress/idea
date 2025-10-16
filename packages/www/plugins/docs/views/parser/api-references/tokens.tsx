//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
import clsx from 'clsx';
//local
import { H1, H2, C, SS, Nav, P } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const examples = [
  `import type { 
  SchemaToken, 
  DeclarationToken, 
  IdentifierToken,
  LiteralToken,
  ObjectToken,
  ArrayToken,
  PropertyToken,
  ImportToken
} from '@stackpress/idea-parser';`,

  //------------------------------------------------------------------//

  `const unknownToken: UnknownToken = {
  type: 'CustomType',
  start: 0,
  end: 10,
  value: 'some value',
  raw: 'raw text'
};`,

  //------------------------------------------------------------------//

  `const identifierToken: IdentifierToken = {
  type: 'Identifier',
  name: 'UserRole',
  start: 5,
  end: 13
};`,

  //------------------------------------------------------------------//

  `// From enum.json fixture
{
  "type": "Identifier",
  "start": 5,
  "end": 10,
  "name": "Roles"
}

// Property key identifier
{
  "type": "Identifier", 
  "start": 15,
  "end": 20,
  "name": "ADMIN"
}`,

  //------------------------------------------------------------------//

  `const stringLiteral: LiteralToken = {
  type: 'Literal',
  start: 21,
  end: 28,
  value: 'Admin',
  raw: '"Admin"'
};

const numberLiteral: LiteralToken = {
  type: 'Literal',
  start: 10,
  end: 12,
  value: 42,
  raw: '42'
};`,

  //------------------------------------------------------------------//

  `// From enum.json fixture
{
  "type": "Literal",
  "start": 21,
  "end": 28,
  "value": "Admin",
  "raw": "'Admin'"
}`,

  //------------------------------------------------------------------//

  `const objectToken: ObjectToken = {
  type: 'ObjectExpression',
  start: 0,
  end: 64,
  properties: [
    {
      type: 'Property',
      kind: 'init',
      start: 15,
      end: 28,
      method: false,
      shorthand: false,
      computed: false,
      key: { type: 'Identifier', name: 'ADMIN', start: 15, end: 20 },
      value: {
        type: 'Literal',
        value: 'Admin',
        start: 21,
        end: 28,
        raw: '"Admin"'
      }
    }
  ]
};`,

  //------------------------------------------------------------------//

  `const arrayToken: ArrayToken = {
  type: 'ArrayExpression',
  start: 0,
  end: 25,
  elements: [
    { type: 'Literal', value: 'item1', start: 2, end: 9, raw: '"item1"' },
    { type: 'Literal', value: 'item2', start: 11, end: 18, raw: '"item2"' }
  ]
};`,

  //------------------------------------------------------------------//

  `const propertyToken: PropertyToken = {
  type: 'Property',
  kind: 'init',
  start: 15,
  end: 28,
  method: false,
  shorthand: false,
  computed: false,
  key: {
    type: 'Identifier',
    name: 'ADMIN',
    start: 15,
    end: 20
  },
  value: {
    type: 'Literal',
    value: 'Admin',
    start: 21,
    end: 28,
    raw: '"Admin"'
  }
};`,

  //------------------------------------------------------------------//

  `const enumDeclaration: DeclarationToken = {
  type: 'VariableDeclaration',
  kind: 'enum',
  start: 0,
  end: 64,
  declarations: [{
    type: 'VariableDeclarator',
    start: 5,
    end: 64,
    id: {
      type: 'Identifier',
      name: 'Roles',
      start: 5,
      end: 10
    },
    init: {
      type: 'ObjectExpression',
      start: 0,
      end: 64,
      properties: [/* property tokens */]
    }
  }]
};`,

  //------------------------------------------------------------------//

  `const declaratorToken: DeclaratorToken = {
  type: 'VariableDeclarator',
  start: 5,
  end: 64,
  id: {
    type: 'Identifier',
    name: 'Roles',
    start: 5,
    end: 10
  },
  init: {
    type: 'ObjectExpression',
    start: 0,
    end: 64,
    properties: [/* property tokens */]
  }
};`,

  //------------------------------------------------------------------//

  `const importToken: ImportToken = {
  type: 'ImportDeclaration',
  start: 0,
  end: 25,
  specifiers: [],
  source: {
    type: 'Literal',
    value: './shared/types.idea',
    start: 4,
    end: 25,
    raw: '"./shared/types.idea"'
  }
};`,

  //------------------------------------------------------------------//

  `const schemaToken: SchemaToken = {
  type: 'Program',
  kind: 'schema',
  start: 0,
  end: 150,
  body: [
    // ImportTokens for use statements
    {
      type: 'ImportDeclaration',
      start: 0,
      end: 25,
      specifiers: [],
      source: { type: 'Literal', value: './types.idea', start: 4, end: 25, raw: '"./types.idea"' }
    },
    // DeclarationTokens for enums, props, types, models, plugins
    {
      type: 'VariableDeclaration',
      kind: 'enum',
      start: 27,
      end: 91,
      declarations: [/* declarator */]
    }
  ]
};`,

  //------------------------------------------------------------------//

  `type Token = DataToken | UnknownToken;`,

  //------------------------------------------------------------------//

  `type DataToken = IdentifierToken | LiteralToken | ObjectToken | ArrayToken;`,

  //------------------------------------------------------------------//

  `type Reader = (
  code: string, 
  start: number, 
  lexer: Parser
) => Token | undefined;`,

  //------------------------------------------------------------------//

  `type Definition = { 
  key: string, 
  reader: Reader 
};`,

  //------------------------------------------------------------------//

  `interface Parser {
  get dictionary(): Record<string, Definition>;
  get index(): number;
  clone(): Parser;
  define(key: string, reader: Reader, type?: string): void;
  expect<T = Token>(keys: string | string[]): T;
  get(key: string): Definition | undefined;
  load(code: string, index: number): this;
  match(code: string, start: number, keys?: string[]): Token | null;
  next(keys: string | string[]): boolean;
  optional<T = Token>(keys: string | string[]): T | undefined;
  read(): Token | undefined;
}`,

  //------------------------------------------------------------------//

  `type UseReferences = Record<string, any> | false;`,

  //------------------------------------------------------------------//

  `type Scalar = string | number | null | boolean;`,

  //------------------------------------------------------------------//

  `type Data = Scalar | Data[] | { [key: string]: Data };`,

  //------------------------------------------------------------------//

  `import { EnumTree } from '@stackpress/idea-parser';

const enumCode = \`enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}\`;

// Parse generates a DeclarationToken
const enumToken = EnumTree.parse(enumCode);
console.log(enumToken.kind); // 'enum'
console.log(enumToken.declarations[0].id.name); // 'Roles'`,

  //------------------------------------------------------------------//

  `import { Compiler } from '@stackpress/idea-parser';

// Convert DeclarationToken to configuration
const [enumName, enumConfig] = Compiler.enum(enumToken);
console.log(enumName); // 'Roles'
console.log(enumConfig); // { ADMIN: 'Admin', MANAGER: 'Manager', USER: 'User' }`,

  //------------------------------------------------------------------//

  `// ObjectToken processing
const objectToken: ObjectToken = {
  type: 'ObjectExpression',
  start: 0,
  end: 30,
  properties: [
    {
      type: 'Property',
      kind: 'init',
      start: 2,
      end: 15,
      method: false,
      shorthand: false,
      computed: false,
      key: { type: 'Identifier', name: 'type', start: 2, end: 6 },
      value: { type: 'Literal', value: 'text', start: 7, end: 13, raw: '"text"' }
    }
  ]
};

const compiled = Compiler.object(objectToken);
console.log(compiled); // { type: 'text' }`,

  //------------------------------------------------------------------//

  `import { Exception } from '@stackpress/idea-parser';

try {
  const invalidToken = { kind: 'invalid' } as DeclarationToken;
  Compiler.enum(invalidToken);
} catch (error) {
  if (error instanceof Exception) {
    console.log('Token error:', error.message); // 'Invalid Enum'
  }
}`,

  //------------------------------------------------------------------//

  `// Position information for error highlighting
const token: IdentifierToken = {
  type: 'Identifier',
  name: 'InvalidName',
  start: 10,
  end: 21
};

// Can be used to highlight errors in editors
const errorRange = { start: token.start, end: token.end };`
];

//--------------------------------------------------------------------//

//styles
//--------------------------------------------------------------------//

const anchorStyles = clsx(
  'cursor-pointer',
  'hover:text-blue-700',
  'text-blue-500',
);

//--------------------------------------------------------------------//

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Tokens');
  const description = _(
    'Token types define the Abstract Syntax Tree (AST) structures ' +
    'used by the idea parser to represent parsed schema code. These ' +
    'types form the foundation of the parsing system, providing ' +
    'type-safe representations of schema elements.'
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
    <aside className="overflow-auto px-h-100-40 px-m-0 px-px-10 px-py-20">
      {/* API Reference Navigation*/}
      <h6 className="px-fs-14 px-mb-0 px-mt-0 px-pb-10 theme-muted uppercase">
        {_('API Reference')}
      </h6>
      <nav className="flex flex-col px-fs-14 px-lh-28">
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/lexer"
        >
          {_('Lexer API Reference')}
        </a>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/compiler"
        >
          {_('Compiler API Reference')}
        </a>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/ast"
        >
          {_('AST Reference')}
        </a>

        <div className="cursor-pointer text-blue-300">
          {_('Token Reference')}
        </div>
        <a
          className={anchorStyles}
          href="/docs/parser/api-references/exception-handling"
        >
          {_('Exception Handling')}
        </a>
      </nav>

      {/* On This Page Navigation */}
      <h6 className="px-fs-14 px-mb-0 px-mt-30 px-pb-10 theme-muted uppercase">
        {_('On this page')}
      </h6>
      <nav className="flex flex-col px-fs-14 px-lh-28">
        <a
          className={anchorStyles}
          href="#tokens"
        >
          {_('A. Tokens')}
        </a>
        <a
          className={anchorStyles}
          href="#core-token-types"
        >
          {_('1. Core Token Types')}
        </a>
        <a
          className={anchorStyles}
          href="#unknown-token"
        >
          {_('1.1 UnknownToken')}
        </a>
        <a
          className={anchorStyles}
          href="#identifier-token"
        >
          {_('1.2 IdentifierToken')}
        </a>
        <a
          className={anchorStyles}
          href="#literal-token"
        >
          {_('1.3 LiteralToken')}
        </a>
        <a
          className={anchorStyles}
          href="#object-token"
        >
          {_('1.4 ObjectToken')}
        </a>
        <a
          className={anchorStyles}
          href="#array-token"
        >
          {_('1.5 ArrayToken')}
        </a>
        <a
          className={anchorStyles}
          href="#property-token"
        >
          {_('1.6 PropertyToken')}
        </a>
        <a
          className={anchorStyles}
          href="#declaration-tokens"
        >
          {_('2. Declaration Tokens')}
        </a>
        <a
          className={anchorStyles}
          href="#declaration-token"
        >
          {_('2.1 DeclarationToken')}
        </a>
        <a
          className={anchorStyles}
          href="#declarator-token"
        >
          {_('2.2 DeclaratorToken')}
        </a>
        <a
          className={anchorStyles}
          href="#import-token"
        >
          {_('2.3 ImportToken')}
        </a>
        <a
          className={anchorStyles}
          href="#schema-token"
        >
          {_('2.4 SchemaToken')}
        </a>
        <a
          className={anchorStyles}
          href="#union-types"
        >
          {_('3. Union Types')}
        </a>
        <a
          className={anchorStyles}
          href="#token"
        >
          {_('3.1 Token')}
        </a>
        <a
          className={anchorStyles}
          href="#data-token"
        >
          {_('3.2 DataToken')}
        </a>
        <a
          className={anchorStyles}
          href="#parser-interface"
        >
          {_('4. Parser Interface')}
        </a>
        <a
          className={anchorStyles}
          href="#reader-function"
        >
          {_('4.1 Reader')}
        </a>
        <a
          className={anchorStyles}
          href="#token-definition"
        >
          {_('4.2 Definition')}
        </a>
        <a
          className={anchorStyles}
          href="#parser-interface"
        >
          {_('4.3 Parser')}
        </a>
        <a
          className={anchorStyles}
          href="#reference-types"
        >
          {_('5. Reference Types')}
        </a>
        <a
          className={anchorStyles}
          href="#use-references"
        >
          {_('5.1 UseReferences')}
        </a>
        <a
          className={anchorStyles}
          href="#scalar"
        >
          {_('5.2 Scalar')}
        </a>
        <a
          className={anchorStyles}
          href="#data"
        >
          {_('5.3 Data')}
        </a>
        <a
          className={anchorStyles}
          href="#usage-examples"
        >
          {_('6. Usage Examples')}
        </a>
        <a
          className={anchorStyles}
          href="#token-validation"
        >
          {_('7. Token Validation')}
        </a>
        <a
          className={anchorStyles}
          href="#integration-with-ast"
        >
          {_('8. Integration with AST')}
        </a>
      </nav>
    </aside>
  );
}


export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      {/* Tokens Section Content */}
      <section id="tokens">
        <H1>{_('Tokens')}</H1>
        <Translate>
          Token types define the Abstract Syntax Tree (AST) structures
          used by the idea parser to represent parsed schema code. 
          These types form the foundation of the parsing system, 
          providing type-safe representations of schema elements.
        </Translate>
        <Code copy language="typescript" className="bg-black text-white">
          {examples[0]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Core Token Types */}
      <section id="core-token-types">
        <H1>{_('1. Core Token Types')}</H1>
        <P>
          <Translate>
            The following types define the fundamental token
            structures used throughout the parsing system.
          </Translate>
        </P>

        {/* UnknownToken Section Content */}
        <section id="unknown-token">
          <H2>{_('1.1 UnknownToken')}</H2>
          <P>
            <Translate>
              Base token structure for unrecognized or generic
              tokens during parsing.
            </Translate>
          </P>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[1]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>
                <Translate>
                  Token type identifier
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position in source code
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position in source code
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>value</C></Tcol>
              <Tcol><C>any</C></Tcol>
              <Tcol>
                <Translate>
                  Parsed value of the token
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>raw</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>
                <Translate>
                  Raw text from source code
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used as a fallback for tokens that don't match specific
            patterns and as a base structure for other token types.
          </Translate>
        </section>

        {/* IdentifierToken Section Content */}
        <section id="identifier-token">
          <H2>{_('1.2 IdentifierToken')}</H2>
          <Translate>
            Represents identifiers such as variable names, type names,
            and property keys.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[2]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'Identifier'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'Identifier' for identifier tokens
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>name</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>
                <Translate>
                  The identifier name
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>Used throughout the parser for:</Translate>
          <ul className="list-disc my-2 pl-5">
            <li className="my-2">Enum names: <C>enum UserRole</C></li>
            <li className="my-2">Model names: <C>model User</C></li>
            <li className="my-2">Property names: <C>name String</C></li>
            <li className="my-2">Type references: <C>role UserRole</C></li>
          </ul>

          <SS>{_('Examples from Tests')}</SS>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[3]}
          </Code>
        </section>

        {/* LiteralToken Section Content */}
        <section id="literal-token">
          <H2>{_('1.3 LiteralToken')}</H2>
          <Translate>
            Represents literal values such as strings, numbers,
            booleans, and null.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[4]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'Literal'</C></Tcol>
              <Tcol>Always 'Literal' for literal tokens</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>Starting character position</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>Ending character position</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>value</C></Tcol>
              <Tcol><C>any</C></Tcol>
              <Tcol>The parsed literal value</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>raw</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>Raw text representation from source</Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used for all scalar values in schema definitions:
          </Translate>
          <ul className="list-disc my-2 pl-5">
            <li className="my-2">
              String literals: <C>"Admin"</C>, <C>"localhost"</C>
            </li>
            <li className="my-2">
              Number literals: <C>5432</C>, <C>3.14</C>
            </li>
            <li className="my-2">
              Boolean literals: <C>true</C>, <C>false</C>
            </li>
            <li className="my-2">
              Null literals: <C>null</C>
            </li>
          </ul>

          <SS>{_('Examples from Tests')}</SS>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[5]}
          </Code>
        </section>

        {/* ObjectToken Section Content */}
        <section id="object-token">
          <H2>{_('1.4 ObjectToken')}</H2>
          <Translate>
            Represents object expressions containing key-value
            pairs.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[6]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'ObjectExpression'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'ObjectExpression' for object tokens
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>properties</C></Tcol>
              <Tcol><C>PropertyToken[]</C></Tcol>
              <Tcol>
                <Translate>
                  Array of property tokens
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>Used for:</Translate>
          <ul className="list-disc my-2 pl-5">
            <li className="my-2">
              Enum definitions:
              <C>&#123; ADMIN "Admin", USER "User" &#125;</C>
            </li>
            <li className="my-2">
              Model column definitions:
              <C>&#123; id String @id, name String &#125;</C>
            </li>
            <li className="my-2">
              Plugin configurations:
              <C>&#123; provider "postgresql", url env("DATABASE_URL")
                &#125;</C>
            </li>
            <li className="my-2">
              Attribute parameters:
              <C>@field.input(&#123; type "text" &#125;)</C>
            </li>
          </ul>

          <SS>{_('Examples from Tests')}</SS>
          <Translate>
            The enum fixture shows an ObjectToken containing three
            PropertyTokens for ADMIN, MANAGER, and USER enum values.
          </Translate>
        </section>

        {/* ArrayToken Section Content */}
        <section id="array-token">
          <H2>{_('1.5 ArrayToken')}</H2>
          <Translate>
            Represents array expressions containing ordered elements.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[7]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'ArrayExpression'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'ArrayExpression' for array tokens
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>elements</C></Tcol>
              <Tcol><C>DataToken[]</C></Tcol>
              <Tcol>
                <Translate>
                  Array of data tokens
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>Used for:</Translate>
          <ul className="list-disc my-2 pl-5">
            <li className="my-2">
              Array type definitions:
              <C>String[]</C>
            </li>
            <li className="my-2">
              Plugin feature lists:
              <C>previewFeatures ["fullTextSearch", "metrics"]</C>
            </li>
            <li className="my-2">
              Attribute arrays:
              <C>@is.oneOf(["admin", "user", "guest"])</C>
            </li>
          </ul>
        </section>

        {/* PropertyToken Section Content */}
        <section id="property-token">
          <H2>{_('1.6 PropertyToken')}</H2>
          <Translate>
            Represents key-value pairs within object expressions.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[8]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'Property'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'Property' for property tokens
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>kind</C></Tcol>
              <Tcol><C>'init'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'init' for initialization properties
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>method</C></Tcol>
              <Tcol><C>boolean</C></Tcol>
              <Tcol>
                <Translate>
                  Always false (not used for method properties)
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>shorthand</C></Tcol>
              <Tcol><C>boolean</C></Tcol>
              <Tcol>
                <Translate>
                  Always false (not used for shorthand properties)
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>computed</C></Tcol>
              <Tcol><C>boolean</C></Tcol>
              <Tcol>
                <Translate>
                  Always false (not used for computed properties)
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>key</C></Tcol>
              <Tcol><C>IdentifierToken</C></Tcol>
              <Tcol>
                <Translate>
                  Property key identifier
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>value</C></Tcol>
              <Tcol><C>DataToken</C></Tcol>
              <Tcol>
                <Translate>
                  Property value (literal, object, array, or
                  identifier)
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>Used within ObjectTokens for:</Translate>
          <ul className="list-disc my-2 pl-5">
            <li className="my-2">
              Enum key-value pairs: <C>ADMIN "Admin"</C>
            </li>
            <li className="my-2">
              Model column definitions: <C>id String</C>
            </li>
            <li className="my-2">
              Plugin configuration options: <C>provider "postgresql"</C>
            </li>
            <li className="my-2">
              Attribute parameters: <C>type "text"</C>
            </li>
          </ul>

          <SS>{_('Examples from Tests')}</SS>
          <Translate>
            From the enum fixture, each enum value is represented
            as a PropertyToken with an IdentifierToken key and
            LiteralToken value.
          </Translate>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Declaration Tokens Section Content*/}
      <section id="declaration-tokens">
        <H1>{_('2. Declaration Tokens')}</H1>
        <Translate>
          The following types represent top-level declarations in
          schema files.
        </Translate>

        {/* DeclarationToken Section Content */}
        <section id="declaration-token">
          <H2>{_('2.1 DeclarationToken')}</H2>
          <Translate>
            Represents variable declarations for enums, props,
            types, models, and plugins.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[9]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'VariableDeclaration'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'VariableDeclaration' for declarations
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>kind</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>
                Declaration type: 'enum', 'prop', 'type', 'model',
                'plugin'
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>mutable</C></Tcol>
              <Tcol><C>boolean</C></Tcol>
              <Tcol>
                <Translate>
                  Optional mutability flag (for types and models)
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>declarations</C></Tcol>
              <Tcol><C>[DeclaratorToken]</C></Tcol>
              <Tcol>
                <Translate>
                  Array with single declarator token
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used by all tree parsers (EnumTree, PropTree, TypeTree,
            ModelTree, PluginTree) to represent their respective
            declarations. The <C>kind</C> property determines how
            the Compiler processes the declaration.
          </Translate>

          <SS>{_('Examples from Tests')}</SS>
          <Translate>
            The enum fixture shows a complete DeclarationToken with
            kind 'enum' containing the Roles enum definition.
          </Translate>
        </section>

        {/* DeclaratorToken Section Content */}
        <section id="declarator-token">
          <H2>{_('2.2 DeclaratorToken')}</H2>
          <Translate>
            Represents the declarator part of a variable declaration,
            containing the identifier and initialization.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[10]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'VariableDeclarator'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'VariableDeclarator' for declarators
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>id</C></Tcol>
              <Tcol><C>IdentifierToken</C></Tcol>
              <Tcol>
                <Translate>
                  Declaration identifier (name)
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>init</C></Tcol>
              <Tcol><C>ObjectToken</C></Tcol>
              <Tcol>
                <Translate>
                  Initialization object containing the declaration
                  body
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used within DeclarationTokens to separate the declaration
            name from its body. The <C>id</C> contains the name
            (e.g., "Roles", "User") and <C>init</C> contains the
            definition object.
          </Translate>
        </section>

        {/* ImportToken Section Content */}
        <section id="import-token">
          <H2>{_('2.3 ImportToken')}</H2>
          <Translate>
            Represents use statements for importing other schema files.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[11]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'ImportDeclaration'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'ImportDeclaration' for imports
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>specifiers</C></Tcol>
              <Tcol><C>[]</C></Tcol>
              <Tcol>
                <Translate>
                  Always empty array (not used for named imports)
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>source</C></Tcol>
              <Tcol><C>LiteralToken</C></Tcol>
              <Tcol>
                <Translate>
                  Source file path as literal token
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used by UseTree to represent <C>use "./path/to/file.idea"</C>
            statements. The Compiler extracts the source path for 
            dependency resolution.
          </Translate>
        </section>

        {/* SchemaToken Section Content */}
        <section id="schema-token">
          <H2>{_('2.4 SchemaToken')}</H2>
          <Translate>
            Represents the complete parsed schema file containing all
            declarations and imports.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[12]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>type</C></Tcol>
              <Tcol><C>'Program'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'Program' for complete schemas
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>kind</C></Tcol>
              <Tcol><C>'schema'</C></Tcol>
              <Tcol>
                <Translate>
                  Always 'schema' for schema files
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting character position (usually 0)
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>end</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Ending character position
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>body</C></Tcol>
              <Tcol><C>(DeclarationToken|ImportToken)[]</C></Tcol>
              <Tcol>
                <Translate>
                  Array of all declarations and imports
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Usage')}</SS>
          <P>
            <Translate>
              Used by SchemaTree as the root token representing the
              entire parsed schema file. The Compiler processes the
              body array to generate the final schema configuration.
            </Translate>
          </P>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Union Types Section Content */}
      <section id="union-types">
        <H1>{_('3. Union Types')}</H1>
        <Translate>
          The following types provide flexible token handling for
          different contexts.
        </Translate>

        {/* Token Section Content */}
        <section id="token">
          <H2>{_('3.1 Token')}</H2>
          <Translate>
            Union type for all possible token types that can be
            returned by readers.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[13]}
          </Code>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used as the return type for lexer operations and reader
            functions. Allows handling both recognized data tokens
            and unknown tokens.
          </Translate>
        </section>

        {/* Data Token Section */}
        <section id="data-token">
          <H2>{_('3.2 DataToken')}</H2>
          <Translate>
            Union type for tokens representing data values.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[14]}
          </Code>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used throughout the Compiler for processing data values.
            These tokens can be converted to actual JavaScript values
            using <C>Compiler.data()</C>.
          </Translate>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Parser Interface Section Content */}
      <section id="parser-interface">
        <H1>{_('4. Parser Interface')}</H1>
        <Translate>
          The following types define the parser interface and reader
          functions.
        </Translate>


        {/* Reader Function Section */}
        <section id="reader-function">
          <H2>{_('4.1 Reader')}</H2>
          <Translate>
            Function type for token readers that attempt to parse
            specific patterns.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[15]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Parameter</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>code</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>
                <Translate>
                  Source code being parsed
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>
                <Translate>
                  Starting position to attempt parsing
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>lexer</C></Tcol>
              <Tcol><C>Parser</C></Tcol>
              <Tcol>
                <Translate>
                  Parser instance for recursive parsing
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <Translate>
            Token object if pattern matches, undefined otherwise.
          </Translate>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used to define token recognition patterns in the definitions
            system. Each token type has a corresponding reader function.
          </Translate>
        </section>

        {/* Token Definition Section */}
        <section id="token-definition">
          <H2>{_('4.2 Definition')}</H2>
          <Translate>
            Pairs a token key with its reader function for lexer
            registration.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[16]}
          </Code>

          <H2>{_('Properties')}</H2>
          <Table>
            <Thead className="text-left theme-bg-bg2">Property</Thead>
            <Thead className="text-left theme-bg-bg2">Type</Thead>
            <Thead className="text-left theme-bg-bg2">Description</Thead>
            <Trow>
              <Tcol><C>key</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>
                <Translate>
                  Unique identifier for the token type
                </Translate>
              </Tcol>
            </Trow>
            <Trow>
              <Tcol><C>reader</C></Tcol>
              <Tcol><C>Reader</C></Tcol>
              <Tcol>
                <Translate>
                  Function that attempts to parse the token
                </Translate>
              </Tcol>
            </Trow>
          </Table>

          <SS>Usage</SS>
          <Translate>
            Used by the Lexer to register and manage token definitions.
            The key identifies the token type, and the reader attempts
            to parse it.
          </Translate>
        </section>

        {/* Parser Interface Section */}
        <section id="parser-interface">
          <H2>{_('4.3 Parser')}</H2>
          <Translate>
            Interface defining the contract for parser implementations.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[17]}
          </Code>

          <SS>Usage</SS>
          <Translate>
            Implemented by the Lexer class to provide consistent
            parsing operations across all tree parsers.
          </Translate>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Reference Types Section Content */}
      <section id="reference-types">
        <H1>{_('5. Reference Types')}</H1>
        <Translate>
          The following types handle reference resolution and data
          processing.
        </Translate>

        {/* UseReferences Section Content */}
        <section id="use-references">
          <H2>{_('5.1 UseReferences')}</H2>
          <Translate>
            Type for managing prop and type references during
            compilation.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[18]}
          </Code>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used by the Compiler to resolve identifier references:
          </Translate>
          <ul className="list-disc my-2 pl-5">
            <li>
              <C>false</C>: Return template strings like
              <C>$&#123;PropName&#125;</C>
            </li>
            <li>
              <C>Record&lt;string, any&gt;</C>: Resolve identifiers
              to actual values
            </li>
            <li>
              Empty object <C>&#123;&#125;</C>: Throw error for
              unknown references
            </li>
          </ul>
        </section>

        {/* Scalar Section Content */}
        <section id="scalar">
          <H2>{_('5.2 Scalar')}</H2>
          <Translate>
            Union type for primitive values that can be stored in
            schema configurations.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[19]}
          </Code>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used in enum configurations and other places where only
            primitive values are allowed.
          </Translate>
        </section>

        {/* Data Section Content */}
        <section id="data">
          <H2>{_('5.3 Data')}</H2>
          <Translate>
            Recursive type for nested data structures in schema
            configurations.
          </Translate>
          <Code
            copy
            language="typescript"
            className="bg-black text-white"
          >
            {examples[20]}
          </Code>

          <SS>{_('Usage')}</SS>
          <Translate>
            Used throughout the system for representing complex nested
            data structures in plugin configurations, attributes, and
            other schema elements.
          </Translate>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Usage Examples Section Content */}
      <section id="usage-examples">
        <H1>{_('6. Usage Examples')}</H1>

        <H2>{_('6.1 Parsing and Token Generation')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[21]}
        </Code>

        <H2>{_('6.2 Token Processing with Compiler')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[22]}
        </Code>

        <H2>{_('6.3 Working with Complex Tokens')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[23]}
        </Code>

        <H2>{_('6.4 Error Handling with Tokens')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[24]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Token Validation Section Content */}
      <section id="token-validation">
        <H1>{_('7. Token Validation')}</H1>
        <Translate>
          Tokens include position information for error reporting and
          validation:
        </Translate>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {examples[25]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className="mt-10" />

      {/* Integration With AST Section Content */}
      <section id="integration-with-ast">
        <H1>{_('8. Integration with AST')}</H1>
        <Translate>
          AST classes generate specific token types:
        </Translate>
        <ul className="list-disc my-2 pl-5">
          <li className="my-2">
            <SS>EnumTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'enum'</C>
          </li>
          <li className="my-2">
            <SS>PropTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'prop'</C>
          </li>
          <li className="my-2">
            <SS>TypeTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'type'</C>
          </li>
          <li className="my-2">
            <SS>ModelTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'model'</C>
          </li>
          <li className="my-2">
            <SS>PluginTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'plugin'</C>
          </li>
          <li className="my-2">
            <SS>UseTree</SS>:
            Generates <C>ImportToken</C>
          </li>
          <li className="my-2">
            <SS>SchemaTree</SS>:
            Generates <C>SchemaToken</C> containing all other tokens
          </li>
        </ul>

        <Translate>
          Each AST class uses the Lexer to generate appropriate tokens,
          which are then processed by the Compiler to produce the final
          JSON configuration.
        </Translate>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Syntax Trees'),
          href: "/docs/parser/api-references/ast"
        }}
        next={{
          text: _('Exception Handling'),
          href: "/docs/parser/api-references/exception-handling"
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
