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
    const title = _('Tokens');
    const description = _(
      'Token types define the Abstract Syntax Tree (AST) structures used by the idea parser to represent parsed schema code. These types form the foundation of the parsing system, providing type-safe representations of schema elements.'
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
      value: { type: 'Literal', value: 'Admin', start: 21, end: 28, raw: '"Admin"' }
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
  
  export function Body() {
    return (
      <main className="px-h-100-0 overflow-auto px-p-10">
        <H1>Tokens</H1>
        <P>Token types define the Abstract Syntax Tree (AST) structures used by the idea parser to represent parsed schema code. These types form the foundation of the parsing system, providing type-safe representations of schema elements.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[0]}
        </Code>

        <H2>Core Token Types</H2>
        <P>The following types define the fundamental token structures used throughout the parsing system.</P>

        <H3>UnknownToken</H3>
        <P>Base token structure for unrecognized or generic tokens during parsing.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H2>Properties</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>Token type identifier</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting character position in source code</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>end</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Ending character position in source code</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>value</C></Tcol>
            <Tcol><C>any</C></Tcol>
            <Tcol>Parsed value of the token</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>raw</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>Raw text from source code</Tcol>
          </Trow>
        </Table>

        <SS>Usage</SS>
        <P>Used as a fallback for tokens that don't match specific patterns and as a base structure for other token types.</P>

        <H3>IdentifierToken</H3>
        <P>Represents identifiers such as variable names, type names, and property keys.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[2]}
        </Code>

        <H2>Properties</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'Identifier'</C></Tcol>
            <Tcol>Always 'Identifier' for identifier tokens</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>name</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The identifier name</Tcol>
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
        </Table>

        <SS>Usage</SS>
        <P>Used throughout the parser for:</P>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>Enum names: <C>enum UserRole</C></li>
          <li className='my-2'>Model names: <C>model User</C></li>
          <li className='my-2'>Property names: <C>name String</C></li>
          <li className='my-2'>Type references: <C>role UserRole</C></li>
        </ul>

        <SS>Examples from Tests</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[3]}
        </Code>

        <H3>LiteralToken</H3>
        <P>Represents literal values such as strings, numbers, booleans, and null.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[4]}
        </Code>

        <H2>Properties</H2>
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

        <SS>Usage</SS>
        <P>Used for all scalar values in schema definitions:</P>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>String literals: <C>"Admin"</C>, <C>"localhost"</C></li>
          <li className='my-2'>Number literals: <C>5432</C>, <C>3.14</C></li>
          <li className='my-2'>Boolean literals: <C>true</C>, <C>false</C></li>
          <li className='my-2'>Null literals: <C>null</C></li>
        </ul>

        <SS>Examples from Tests</SS>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[5]}
        </Code>

        <H2>ObjectToken</H2>
        <P>Represents object expressions containing key-value pairs.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[6]}
        </Code>

        <H2>Properties</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'ObjectExpression'</C></Tcol>
            <Tcol>Always 'ObjectExpression' for object tokens</Tcol>
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
            <Tcol><C>properties</C></Tcol>
            <Tcol><C>PropertyToken[]</C></Tcol>
            <Tcol>Array of property tokens</Tcol>
          </Trow>
        </Table>

        <SS>Usage</SS>
        <P>Used for:</P>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>Enum definitions: <C>&#123; ADMIN "Admin", USER "User" &#125;</C></li>
          <li className='my-2'>Model column definitions: <C>&#123; id String @id, name String &#125;</C></li>
          <li className='my-2'>Plugin configurations: <C>&#123; provider "postgresql", url env("DATABASE_URL") &#125;</C></li>
          <li className='my-2'>Attribute parameters: <C>@field.input(&#123; type "text" &#125;)</C></li>
        </ul>

        <SS>Examples from Tests</SS>
        <P>The enum fixture shows an ObjectToken containing three PropertyTokens for ADMIN, MANAGER, and USER enum values.</P>

        <H2>ArrayToken</H2>
        <P>Represents array expressions containing ordered elements.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <H2>Properties</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'ArrayExpression'</C></Tcol>
            <Tcol>Always 'ArrayExpression' for array tokens</Tcol>
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
            <Tcol><C>elements</C></Tcol>
            <Tcol><C>DataToken[]</C></Tcol>
            <Tcol>Array of data tokens</Tcol>
          </Trow>
        </Table>

        <SS>Usage</SS>
        <P>Used for:</P>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>Array type definitions: <C>String[]</C></li>
          <li className='my-2'>Plugin feature lists: <C>previewFeatures ["fullTextSearch", "metrics"]</C></li>
          <li className='my-2'>Attribute arrays: <C>@is.oneOf(["admin", "user", "guest"])</C></li>
        </ul>

        <H2>PropertyToken</H2>
        <P>Represents key-value pairs within object expressions.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[8]}
        </Code>

        <H2>Properties</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'Property'</C></Tcol>
            <Tcol>Always 'Property' for property tokens</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>kind</C></Tcol>
            <Tcol><C>'init'</C></Tcol>
            <Tcol>Always 'init' for initialization properties</Tcol>
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
            <Tcol><C>method</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol>Always false (not used for method properties)</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>shorthand</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol>Always false (not used for shorthand properties)</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>computed</C></Tcol>
            <Tcol><C>boolean</C></Tcol>
            <Tcol>Always false (not used for computed properties)</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>key</C></Tcol>
            <Tcol><C>IdentifierToken</C></Tcol>
            <Tcol>Property key identifier</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>value</C></Tcol>
            <Tcol><C>DataToken</C></Tcol>
            <Tcol>Property value (literal, object, array, or identifier)</Tcol>
          </Trow>
        </Table>

        <SS>Usage</SS>
        <P>Used within ObjectTokens for:</P>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'>Enum key-value pairs: <C>ADMIN "Admin"</C></li>
          <li className='my-2'>Model column definitions: <C>id String</C></li>
          <li className='my-2'>Plugin configuration options: <C>provider "postgresql"</C></li>
          <li className='my-2'>Attribute parameters: <C>type "text"</C></li>
        </ul>

        <SS>Examples from Tests</SS>
        <P>From the enum fixture, each enum value is represented as a PropertyToken with an IdentifierToken key and LiteralToken value.</P>

        <H2>Declaration Tokens</H2>
        <P>The following types represent top-level declarations in schema files.</P>

        <H2>DeclarationToken</H2>
        <P>Represents variable declarations for enums, props, types, models, and plugins.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <H2>Properties</H2>
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
            <Tcol>Declaration type: 'enum', 'prop', 'type', 'model', 'plugin'</Tcol>
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

        <SS>Usage</SS>
        <P>Used by all tree parsers (EnumTree, PropTree, TypeTree, ModelTree, PluginTree) to represent their respective declarations. The <C>kind</C> property determines how the Compiler processes the declaration.</P>

        <SS>Examples from Tests</SS>
        <P>The enum fixture shows a complete DeclarationToken with kind 'enum' containing the Roles enum definition.</P>

        <H2>DeclaratorToken</H2>
        <P>Represents the declarator part of a variable declaration, containing the identifier and initialization.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H2>Properties</H2>
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

        <SS>Usage</SS>
        <P>Used within DeclarationTokens to separate the declaration name from its body. The <C>id</C> contains the name (e.g., "Roles", "User") and <C>init</C> contains the definition object.</P>

        <H2>ImportToken</H2>
        <P>Represents use statements for importing other schema files.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <H2>Properties</H2>
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

        <SS>Usage</SS>
        <P>Used by UseTree to represent <C>use "./path/to/file.idea"</C> statements. The Compiler extracts the source path for dependency resolution.</P>

        <H2>SchemaToken</H2>
        <P>Represents the complete parsed schema file containing all declarations and imports.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <H2>Properties</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Property</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>type</C></Tcol>
            <Tcol><C>'Program'</C></Tcol>
            <Tcol>Always 'Program' for complete schemas</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>kind</C></Tcol>
            <Tcol><C>'schema'</C></Tcol>
            <Tcol>Always 'schema' for schema files</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting character position (usually 0)</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>end</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Ending character position</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>body</C></Tcol>
            <Tcol><C>(DeclarationToken|ImportToken)[]</C></Tcol>
            <Tcol>Array of all declarations and imports</Tcol>
          </Trow>
        </Table>

        <SS>Usage</SS>
        <P>Used by SchemaTree as the root token representing the entire parsed schema file. The Compiler processes the body array to generate the final schema configuration.</P>

        <H2>U Types</H2>
        <P>The following types provide flexible token handling for different contexts.</P>

        <H2>Token</H2>
        <P>Union type for all possible token types that can be returned by readers.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[13]}
        </Code>

        <SS>Usage</SS>
        <P>Used as the return type for lexer operations and reader functions. Allows handling both recognized data tokens and unknown tokens.</P>

        <H2>DataToken</H2>
        <P>Union type for tokens representing data values.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[14]}
        </Code>

        <SS>Usage</SS>
        <P>Used throughout the Compiler for processing data values. These tokens can be converted to actual JavaScript values using <C>Compiler.data()</C>.</P>

        <H2>Parser Interface</H2>
        <P>The following types define the parser interface and reader functions.</P>

        <H2>Reader</H2>
        <P>Function type for token readers that attempt to parse specific patterns.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[15]}
        </Code>

        <H2>Parameters</H2>
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

        <SS>Returns</SS>
        <P>Token object if pattern matches, undefined otherwise.</P>

        <SS>Usage</SS>
        <P>Used to define token recognition patterns in the definitions system. Each token type has a corresponding reader function.</P>

        <H2>Definition</H2>
        <P>Pairs a token key with its reader function for lexer registration.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H2>Properties</H2>
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
        <P>Used by the Lexer to register and manage token definitions. The key identifies the token type, and the reader attempts to parse it.</P>

        <H3>Parser</H3>
        <P>Interface defining the contract for parser implementations.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[17]}
        </Code>

        <SS>Usage</SS>
        <P>Implemented by the Lexer class to provide consistent parsing operations across all tree parsers.</P>

        <H2>Reference Types</H2>
        <P>The following types handle reference resolution and data processing.</P>

        <H3>UseReferences</H3>
        <P>Type for managing prop and type references during compilation.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[18]}
        </Code>

        <SS>Usage</SS>
        <P>Used by the Compiler to resolve identifier references:</P>
        <ul className='my-2 list-disc pl-5'>
          <li><C>false</C>: Return template strings like <C>$&#123;PropName&#125;</C></li>
          <li><C>Record&lt;string, any&gt;</C>: Resolve identifiers to actual values</li>
          <li>Empty object <C>&#123;&#125;</C>: Throw error for unknown references</li>
        </ul>

        <H3>Scalar</H3>
        <P>Union type for primitive values that can be stored in schema configurations.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[19]}
        </Code>

        <SS>Usage</SS>
        <P>Used in enum configurations and other places where only primitive values are allowed.</P>

        <H3>Data</H3>
        <P>Recursive type for nested data structures in schema configurations.</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[20]}
        </Code>

        <SS>Usage</SS>
        <P>Used throughout the system for representing complex nested data structures in plugin configurations, attributes, and other schema elements.</P>

        <H2>Usage Examples</H2>

        <H3>Parsing and Token Generation</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[21]}
        </Code>

        <H3>Token Processing with Compiler</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[22]}
        </Code>

        <H3>Working with Complex Tokens</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[23]}
        </Code>

        <H3>Error Handling with Tokens</H3>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[24]}
        </Code>

        <H2>Token Validation</H2>
        <P>Tokens include position information for error reporting and validation:</P>
        <Code copy language='typescript' className='bg-black text-white'>
          {examples[25]}
        </Code>

        <H2>Integration with AST</H2>
        <P>AST classes generate specific token types:</P>
        <ul className='my-2 list-disc pl-5'>
          <li className='my-2'><SS>EnumTree</SS>: Generates <C>DeclarationToken</C> with <C>kind: 'enum'</C></li>
          <li className='my-2'><SS>PropTree</SS>: Generates <C>DeclarationToken</C> with <C>kind: 'prop'</C></li>
          <li className='my-2'><SS>TypeTree</SS>: Generates <C>DeclarationToken</C> with <C>kind: 'type'</C></li>
          <li className='my-2'><SS>ModelTree</SS>: Generates <C>DeclarationToken</C> with <C>kind: 'model'</C></li>
          <li className='my-2'><SS>PluginTree</SS>: Generates <C>DeclarationToken</C> with <C>kind: 'plugin'</C></li>
          <li className='my-2'><SS>UseTree</SS>: Generates <C>ImportToken</C></li>
          <li className='my-2'><SS>SchemaTree</SS>: Generates <C>SchemaToken</C> containing all other tokens</li>
        </ul>

        <P>Each AST class uses the Lexer to generate appropriate tokens, which are then processed by the Compiler to produce the final JSON configuration.</P>

        <Nav
          prev={{ text: 'Syntax Trees', href: '/docs/parser/pages/ast' }}
          next={{ text: 'Exception Handling', href: '/docs/parser/pages/exception-handling' }}
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
