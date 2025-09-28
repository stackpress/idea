//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//docs
import { H1, H2, H3, C, SS, Nav } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

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
  `const unknownToken: UnknownToken = {
  type: 'CustomType',
  start: 0,
  end: 10,
  value: 'some value',
  raw: 'raw text'
};`,
  `const identifierToken: IdentifierToken = {
  type: 'Identifier',
  name: 'UserRole',
  start: 5,
  end: 13
};`,
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
  `// From enum.json fixture
{
  "type": "Literal",
  "start": 21,
  "end": 28,
  "value": "Admin",
  "raw": "'Admin'"
}`,
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
  `const arrayToken: ArrayToken = {
  type: 'ArrayExpression',
  start: 0,
  end: 25,
  elements: [
    { type: 'Literal', value: 'item1', start: 2, end: 9, raw: '"item1"' },
    { type: 'Literal', value: 'item2', start: 11, end: 18, raw: '"item2"' }
  ]
};`,
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
  `type Token = DataToken | UnknownToken;`,
  `type DataToken = IdentifierToken | LiteralToken | ObjectToken | ArrayToken;`,
  `type Reader = (
  code: string, 
  start: number, 
  lexer: Parser
) => Token | undefined;`,
  `type Definition = { 
  key: string, 
  reader: Reader 
};`,
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
  `type UseReferences = Record<string, any> | false;`,
  `type Scalar = string | number | null | boolean;`,
  `type Data = Scalar | Data[] | { [key: string]: Data };`,
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
  `import { Compiler } from '@stackpress/idea-parser';

// Convert DeclarationToken to configuration
const [enumName, enumConfig] = Compiler.enum(enumToken);
console.log(enumName); // 'Roles'
console.log(enumConfig); // { ADMIN: 'Admin', MANAGER: 'Manager', USER: 'User' }`,
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
  `import { Exception } from '@stackpress/idea-parser';

try {
  const invalidToken = { kind: 'invalid' } as DeclarationToken;
  Compiler.enum(invalidToken);
} catch (error) {
  if (error instanceof Exception) {
    console.log('Token error:', error.message); // 'Invalid Enum'
  }
}`,
  `// Position information for error highlighting
const token: IdentifierToken = {
  type: 'Identifier',
  name: 'InvalidName',
  start: 10,
  end: 21
};

// Can be used to highlight errors in editors
const errorRange = { start: token.start, end: token.end };`
]

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

export function Body() {
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <header>
        <H1>{_('Tokens')}</H1>
        <Translate>
          Token types define the Abstract Syntax Tree (AST) structures
          used by the idea parser to represent parsed schema code. These
          types form the foundation of the parsing system, providing type-
          safe representations of schema elements.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </header>

      <section>
        <H2>{_('Core Token Types')}</H2>
        <Translate>The following types define the fundamental token
          structures used throughout the parsing system.
        </Translate>

        <H3>{_('UnknownToken')}</H3>
        <Translate>
          Base token structure for unrecognized or generic tokens during
          parsing.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
          Used as a fallback for tokens that don't match specific patterns
          and as a base structure for other token types.
        </Translate>

        <H3>{_('IdentifierToken')}</H3>
        <Translate>
          Represents identifiers such as variable names, type names,
          and property keys.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>Enum names: <C>enum UserRole</C></li>
          <li className='my-2'>Model names: <C>model User</C></li>
          <li className='my-2'>Property names: <C>name String</C></li>
          <li className='my-2'>Type references: <C>role UserRole</C></li>
        </ul>

        <SS>{_('Examples from Tests')}</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>

        <H3>{_('LiteralToken')}</H3>
        <Translate>
          Represents literal values such as strings, numbers, booleans,
          and null.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[4]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>String literals: <C>"Admin"</C>, <C>"localhost"</C></li>
          <li className='my-2'>Number literals: <C>5432</C>, <C>3.14</C></li>
          <li className='my-2'>Boolean literals: <C>true</C>, <C>false</C></li>
          <li className='my-2'>Null literals: <C>null</C></li>
        </ul>

        <SS>{_('Examples from Tests')}</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[5]}
        </Code>
      </section>

      <section>
        <H2>{_('ObjectToken')}</H2>
        <Translate>
          Represents object expressions containing key-value pairs.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[6]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>
            Enum definitions:
            <C>&#123; ADMIN "Admin", USER "User" &#125;</C>
          </li>
          <li className='my-2'>
            Model column definitions:
            <C>&#123; id String @id, name String &#125;</C>
          </li>
          <li className='my-2'>
            Plugin configurations:
            <C>&#123; provider "postgresql", url env("DATABASE_URL") &#125;</C>
          </li>
          <li className='my-2'>
            Attribute parameters:
            <C>@field.input(&#123; type "text" &#125;)</C>
          </li>
        </ul>

        <SS>{_('Examples from Tests')}</SS>
        <Translate>
          The enum fixture shows an ObjectToken containing three PropertyTokens
          for ADMIN, MANAGER, and USER enum values.
        </Translate>
      </section>

      <section>
        <H2>{_('ArrayToken')}</H2>
        <Translate>
          Represents array expressions containing ordered elements.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>
            Array type definitions:
            <C>String[]</C>
          </li>
          <li className='my-2'>
            Plugin feature lists:
            <C>previewFeatures ["fullTextSearch", "metrics"]</C>
          </li>
          <li className='my-2'>
            Attribute arrays:
            <C>@is.oneOf(["admin", "user", "guest"])</C>
          </li>
        </ul>
      </section>

      <section>
        <H2>{_('PropertyToken')}</H2>
        <Translate>
          Represents key-value pairs within object expressions.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[8]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
                Property value (literal, object, array, or identifier)
              </Translate>
            </Tcol>
          </Trow>
        </Table>

        <SS>{_('Usage')}</SS>
        <Translate>Used within ObjectTokens for:</Translate>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>Enum key-value pairs: <C>ADMIN "Admin"</C></li>
          <li className='my-2'>Model column definitions: <C>id String</C></li>
          <li className='my-2'>
            Plugin configuration options: <C>provider "postgresql"</C>
          </li>
          <li className='my-2'>Attribute parameters: <C>type "text"</C></li>
        </ul>

        <SS>{_('Examples from Tests')}</SS>
        <Translate>
          From the enum fixture, each enum value is represented as a
          PropertyToken with an IdentifierToken key and LiteralToken value.
        </Translate>
      </section>

      <section>
        <H2>{_('Declaration Tokens')}</H2>
        <Translate>
          The following types represent top-level declarations in schema files.
        </Translate>

        <H2>{_('DeclarationToken')}</H2>
        <Translate>
          Represents variable declarations for enums, props, types, models,
          and plugins.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'VariableDeclaration'</C></Tcol>
            <Tcol>Always 'VariableDeclaration' for declarations</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>kind</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>
              Declaration type: 'enum', 'prop', 'type', 'model', 'plugin'
            </Tcol>
          </Trow>
          <Trow>
            <Tcol><C>mutable</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol>Optional mutability flag (for types and models)</Tcol>
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
            <Tcol><C>declarations</C></Tcol>
            <Tcol><C>[DeclaratorToken]</C></Tcol>
            <Tcol>Array with single declarator token</Tcol>
          </Trow>
        </Table>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used by all tree parsers (EnumTree, PropTree, TypeTree, ModelTree,
          PluginTree) to represent their respective declarations. The
          <C>kind</C> property determines how the Compiler processes the
          declaration.
        </Translate>

        <SS>{_('Examples from Tests')}</SS>
        <Translate>
          The enum fixture shows a complete DeclarationToken with kind 'enum'
          containing the Roles enum definition.
        </Translate>

        <H2>{_('DeclaratorToken')}</H2>
        <Translate>
          Represents the declarator part of a variable declaration,
          containing the identifier and initialization.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'VariableDeclarator'</C></Tcol>
            <Tcol>Always 'VariableDeclarator' for declarators</Tcol>
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
            <Tcol><C>id</C></Tcol>
            <Tcol><C>IdentifierToken</C></Tcol>
            <Tcol>Declaration identifier (name)</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>init</C></Tcol>
            <Tcol><C>ObjectToken</C></Tcol>
            <Tcol>Initialization object containing the declaration body</Tcol>
          </Trow>
        </Table>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used within DeclarationTokens to separate the declaration name
          from its body. The <C>id</C> contains the name (e.g., "Roles", "User")
          and <C>init</C> contains the definition object.
        </Translate>

        <H2>{_('ImportToken')}</H2>
        <Translate>
          Represents use statements for importing other schema files.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'ImportDeclaration'</C></Tcol>
            <Tcol>Always 'ImportDeclaration' for imports</Tcol>
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
            <Tcol><C>specifiers</C></Tcol>
            <Tcol><C>[]</C></Tcol>
            <Tcol>Always empty array (not used for named imports)</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>source</C></Tcol>
            <Tcol><C>LiteralToken</C></Tcol>
            <Tcol>Source file path as literal token</Tcol>
          </Trow>
        </Table>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used by UseTree to represent <C>use "./path/to/file.idea"</C>
          statements. The Compiler extracts the source path for dependency
          resolution.
        </Translate>

        <H2>{_('SchemaToken')}</H2>
        <Translate>
          Represents the complete parsed schema file containing all
          declarations and imports.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
        <Translate>
          Used by SchemaTree as the root token representing the entire parsed
          schema file. The Compiler processes the body array to generate the
          final schema configuration.
        </Translate>
      </section>

      <section>
        <H2>{_('U Types')}</H2>
        <Translate>
          The following types provide flexible token handling for different
          contexts.
        </Translate>

        <H2>{_('Token')}</H2>
        <Translate>
          Union type for all possible token types that can be returned by
          readers.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[13]}
        </Code>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used as the return type for lexer operations and reader functions.
          Allows handling both recognized data tokens and unknown tokens.
        </Translate>

        <H2>{_('DataToken')}</H2>
        <Translate>
          Union type for tokens representing data values.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[14]}
        </Code>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used throughout the Compiler for processing data values. These tokens
          can be converted to actual JavaScript values using
          <C>Compiler.data()</C>.
        </Translate>
      </section>

      <section>
        <H2>{_('Parser Interface')}</H2>
        <Translate>
          The following types define the parser interface and reader functions.
        </Translate>

        <H2>{_('Reader')}</H2>
        <Translate>
          Function type for token readers that attempt to parse specific
          patterns.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[15]}
        </Code>

        <H2>{_('Parameters')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>Source code being parsed</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position to attempt parsing</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>lexer</C></Tcol>
            <Tcol><C>Parser</C></Tcol>
            <Tcol>Parser instance for recursive parsing</Tcol>
          </Trow>
        </Table>

        <SS>{_('Returns')}</SS>
        <Translate>
          Token object if pattern matches, undefined otherwise.
        </Translate>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used to define token recognition patterns in the definitions system.
          Each token type has a corresponding reader function.
        </Translate>

        <H2>{_('Definition')}</H2>
        <Translate>
          Pairs a token key with its reader function for lexer registration.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H2>{_('Properties')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>key</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>Unique identifier for the token type</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>reader</C></Tcol>
            <Tcol><C>Reader</C></Tcol>
            <Tcol>Function that attempts to parse the token</Tcol>
          </Trow>
        </Table>

        <SS>Usage</SS>
        <Translate>
          Used by the Lexer to register and manage token definitions. The key
          identifies the token type, and the reader attempts to parse it.
        </Translate>

        <H3>{_('Parser')}</H3>
        <Translate>
          Interface defining the contract for parser implementations.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[17]}
        </Code>

        <SS>Usage</SS>
        <Translate>
          Implemented by the Lexer class to provide consistent parsing
          operations across all tree parsers.
        </Translate>
      </section>

      <section>
        <H2>{_('Reference Types')}</H2>
        <Translate>
          The following types handle reference resolution and data processing.
        </Translate>

        <H3>{_('UseReferences')}</H3>
        <Translate>
          Type for managing prop and type references during compilation.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[18]}
        </Code>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used by the Compiler to resolve identifier references:
        </Translate>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <C>false</C>: Return template strings like <C>$&#123;PropName&#125;</C>
          </li>
          <li>
            <C>Record&lt;string, any&gt;</C>: Resolve identifiers to actual values
          </li>
          <li>Empty object <C>&#123;&#125;</C>: Throw error for unknown references</li>
        </ul>

        <H3>{_('Scalar')}</H3>
        <Translate>
          Union type for primitive values that can be stored in schema
          configurations.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[19]}
        </Code>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used in enum configurations and other places where only primitive
          values are allowed.
        </Translate>

        <H3>{_('Data')}</H3>
        <Translate>
          Recursive type for nested data structures in schema configurations.
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[20]}
        </Code>

        <SS>{_('Usage')}</SS>
        <Translate>
          Used throughout the system for representing complex nested data
          structures in plugin configurations, attributes, and other schema
          elements.
        </Translate>
      </section>

      <section>
        <H2>{_('Usage Examples')}</H2>

        <H3>{_('Parsing and Token Generation')}</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[21]}
        </Code>

        <H3>{_('Token Processing with Compiler')}</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[22]}
        </Code>

        <H3>{_('Working with Complex Tokens')}</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[23]}
        </Code>

        <H3>{_('Error Handling with Tokens')}</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[24]}
        </Code>
      </section>

      <section>
        <H2>{_('Token Validation')}</H2>
        <Translate>
          Tokens include position information for error reporting and
          validation:
        </Translate>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[25]}
        </Code>
      </section>

      <section>
        <H2>{_('Integration with AST')}</H2>
        <Translate>
          AST classes generate specific token types:
        </Translate>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>
            <SS>EnumTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'enum'</C>
          </li>
          <li className='my-2'>
            <SS>PropTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'prop'</C>
          </li>
          <li className='my-2'>
            <SS>TypeTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'type'</C>
          </li>
          <li className='my-2'>
            <SS>ModelTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'model'</C>
          </li>
          <li className='my-2'>
            <SS>PluginTree</SS>:
            Generates <C>DeclarationToken</C> with <C>kind: 'plugin'</C>
          </li>
          <li className='my-2'>
            <SS>UseTree</SS>:
            Generates <C>ImportToken</C>
          </li>
          <li className='my-2'>
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

      <Nav
        prev={{
          text: _('Syntax Trees'),
          href: '/docs/parser/api-references/ast'
        }}
        next={{
          text: _('Exception Handling'),
          href: '/docs/parser/api-references/exception-handling'
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
    >
      <Body />
    </Layout>
  );
}
