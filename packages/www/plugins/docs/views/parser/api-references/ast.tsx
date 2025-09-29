//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, C, SS, Nav, P } from '../../../components/index.js';
import Code from '../../../components/Code.js';
import Layout from '../../../components/Layout.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
//----------------------------------------------------------------------

const examples = [
  `import { 
  SchemaTree, 
  EnumTree, 
  ModelTree, 
  TypeTree, 
  PropTree, 
  PluginTree, 
  UseTree 
} from '@stackpress/idea-parser';`,

  //----------------------------------------------------------------------

  `import { SchemaTree, Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
SchemaTree.definitions(lexer);

// Lexer now has definitions for all schema constructs:
// enum, prop, type, model, plugin, use keywords and structures`,

  //----------------------------------------------------------------------

  `import { SchemaTree } from '@stackpress/idea-parser';

const schemaCode = \`
plugin "./database" {
  provider "postgresql"
}

enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}

prop Text { type "text" }

model User {
  id String @id
  name String @field.input(Text)
  status Status
}
\`;

const ast = SchemaTree.parse(schemaCode);
console.log(ast.type); // 'Program'
console.log(ast.kind); // 'schema'
console.log(ast.body.length); // 4 (plugin, enum, prop, model)`,

  //----------------------------------------------------------------------

  `import { SchemaTree } from '@stackpress/idea-parser';

const tree = new SchemaTree();
const schemaCode = 'enum Status { ACTIVE "Active" }';

const result = tree.parse(schemaCode, 0);
console.log(result.body[0].kind); // 'enum'`,

  //----------------------------------------------------------------------

  `import { EnumTree, Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
EnumTree.definitions(lexer);

// Adds 'EnumWord' token definition for 'enum' keyword`,

  //----------------------------------------------------------------------

  `import { EnumTree } from '@stackpress/idea-parser';

const enumCode = \`enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}\`;

const ast = EnumTree.parse(enumCode);
console.log(ast.kind); // 'enum'
console.log(ast.declarations[0].id.name); // 'Roles'
console.log(ast.declarations[0].init.properties.length); // 3
console.log(ast.declarations[0].init.properties[0].key.name); // 'ADMIN'
console.log(ast.declarations[0].init.properties[0].value.value); // 'Admin'`,

  //----------------------------------------------------------------------

  `const tree = new EnumTree();
tree._lexer.load('enum Status { ACTIVE "Active" INACTIVE "Inactive" }');

const enumToken = tree.enum();
console.log(enumToken.declarations[0].id.name); // 'Status'
console.log(enumToken.declarations[0].init.properties[0].key.name); // 'ACTIVE'
console.log(enumToken.declarations[0].init.properties[0].value.value); // 'Active'`,

  //----------------------------------------------------------------------

  `// Inside enum parsing, after opening brace
const property = tree.property();
console.log(property.key.name); // e.g., 'ADMIN'
console.log(property.value.value); // e.g., 'Admin'`,

  //----------------------------------------------------------------------

  `import { ModelTree } from '@stackpress/idea-parser';

const modelCode = \`model User @label("User" "Users") {
  id       String       @label("ID")         @id @default("nanoid(20)")
  username String       @label("Username")   @searchable @field.input(Text) @is.required
  password String       @label("Password")   @field.password @is.clt(80) @is.cgt(8) @is.required @list.hide @view.hide
  role     Roles        @label("Role")       @filterable @field.select @list.text(Uppercase) @view.text(Uppercase)
  address  Address?     @label("Address")    @list.hide
  age      Number       @label("Age")        @unsigned @filterable @sortable @field.number(Age) @is.gt(0) @is.lt(150)
  active   Boolean      @label("Active")     @default(true) @filterable @field.switch @list.yesno @view.yesno
  created  Date         @label("Created")    @default("now()") @filterable @sortable @list.date(Pretty)
}\`;

const ast = ModelTree.parse(modelCode);
console.log(ast.kind); // 'model'
console.log(ast.mutable); // false (because of '!' modifier)
console.log(ast.declarations[0].id.name); // 'User'`,

  //----------------------------------------------------------------------

  `const tree = new ModelTree();
tree._lexer.load('model User { id String @id }');

const modelToken = tree.model();
console.log(modelToken.kind); // 'model'
console.log(modelToken.mutable); // false (immutable due to '!')`,

  //----------------------------------------------------------------------

  `import { TypeTree } from '@stackpress/idea-parser';

const typeCode = \`type Address @label("Address" "Addresses") {
  street String @field.input @is.required
  city String @field.input @is.required
  country String @field.select
  postal String @field.input
}\`;

const ast = TypeTree.parse(typeCode);
console.log(ast.kind); // 'type'
console.log(ast.mutable); // true (mutable by default)
console.log(ast.declarations[0].id.name); // 'Address'`,

  //----------------------------------------------------------------------

  `const tree = new TypeTree();
tree._lexer.load('type Address { street String city String }');

const typeToken = tree.type();
console.log(typeToken.kind); // 'type'
console.log(typeToken.mutable); // true (default for types)`,

  //----------------------------------------------------------------------

  `// Inside type parsing
const property = tree.property();
console.log(property.key.name); // e.g., 'street'
console.log(property.value); // Object containing type and attributes`,

  //----------------------------------------------------------------------

  `// For parsing generic type parameters
const parameter = tree.parameter();
console.log(parameter.key.name); // Parameter name
console.log(parameter.value); // Parameter type/constraint`,

  //----------------------------------------------------------------------

  `import { PropTree } from '@stackpress/idea-parser';

const propCode = \`prop EmailInput {
  type "email"
  format "email"
  placeholder "Enter your email"
  required true
}\`;

const ast = PropTree.parse(propCode);
console.log(ast.kind); // 'prop'
console.log(ast.declarations[0].id.name); // 'EmailInput'`,

  //----------------------------------------------------------------------

  `const tree = new PropTree();
tree._lexer.load('prop Text { type "text" format "lowercase" }');

const propToken = tree.prop();
console.log(propToken.kind); // 'prop'
console.log(propToken.declarations[0].id.name); // 'Text'`,

  //----------------------------------------------------------------------

  `import { PluginTree } from '@stackpress/idea-parser';

const pluginCode = \`plugin "./database-plugin" {
  provider "postgresql"
  url env("DATABASE_URL")
  previewFeatures ["fullTextSearch"]
}\`;

const ast = PluginTree.parse(pluginCode);
console.log(ast.kind); // 'plugin'
console.log(ast.declarations[0].id.name); // './database-plugin'`,

  //----------------------------------------------------------------------

  `const tree = new PluginTree();
tree._lexer.load('plugin "./custom" { provider "custom-provider" }');

const pluginToken = tree.plugin();
console.log(pluginToken.kind); // 'plugin'
console.log(pluginToken.declarations[0].id.name); // './custom'`,

  //----------------------------------------------------------------------

  `import { UseTree } from '@stackpress/idea-parser';

const useCode = 'use "./shared/types.idea"';

const ast = UseTree.parse(useCode);
console.log(ast.type); // 'ImportDeclaration'
console.log(ast.source.value); // './shared/types.idea'`,

  //----------------------------------------------------------------------

  `const tree = new UseTree();
tree._lexer.load('use "./another.idea"');

const useToken = tree.use();
console.log(useToken.type); // 'ImportDeclaration'
console.log(useToken.source.value); // './another.idea'`,

  //----------------------------------------------------------------------

  `import { EnumTree, ModelTree, TypeTree } from '@stackpress/idea-parser';

// Parse individual enum
const enumAST = EnumTree.parse(\`enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}\`);

// Parse individual model
const modelAST = ModelTree.parse(\`model User {
  id String @id
  username String @is.required
}\`);

// Parse individual type
const typeAST = TypeTree.parse(\`type Address {
  street String
  city String
}\`);`,

  //----------------------------------------------------------------------

  `import { EnumTree, Compiler } from '@stackpress/idea-parser';

// Parse and compile in one step
const enumAST = EnumTree.parse(\`enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}\`);
const [enumName, enumConfig] = Compiler.enum(enumAST);

console.log(enumName); // 'Status'
console.log(enumConfig); // { ACTIVE: 'Active', INACTIVE: 'Inactive' }`,

  //----------------------------------------------------------------------

  `import { AbstractTree, Lexer } from '@stackpress/idea-parser';
import type { DeclarationToken } from '@stackpress/idea-parser';

class CustomTree extends AbstractTree<DeclarationToken> {
  static definitions(lexer: Lexer) {
    super.definitions(lexer);
    // Add custom token definitions
    lexer.define('CustomKeyword', (code, index) => {
      // Custom token reader implementation
    });
    return lexer;
  }

  static parse(code: string, start = 0) {
    return new this().parse(code, start);
  }

  parse(code: string, start = 0): DeclarationToken {
    this._lexer.load(code, start);
    return this.customDeclaration();
  }

  customDeclaration(): DeclarationToken {
    // Custom parsing logic
    const keyword = this._lexer.expect('CustomKeyword');
    // ... more parsing logic
    
    return {
      type: 'VariableDeclaration',
      kind: 'custom',
      start: keyword.start,
      end: this._lexer.index,
      declarations: [/* ... */]
    };
  }
}`,

  //----------------------------------------------------------------------

  `import { SchemaTree, Exception } from '@stackpress/idea-parser';

try {
  // Invalid syntax - missing closing brace
  SchemaTree.parse('enum Status { ACTIVE "Active"');
} catch (error) {
  if (error instanceof Exception) {
    console.log('Parse error:', error.message);
    console.log('Position:', error.start, '-', error.end);
  }
}`,

  //----------------------------------------------------------------------

  `try {
  // Invalid - 'enum' keyword expected but found 'model'
  EnumTree.parse('model User { id String }');
} catch (error) {
  console.log('Expected enum but found model');
}`,

  //----------------------------------------------------------------------

  `import { EnumTree } from '@stackpress/idea-parser';

try {
  // Empty string will throw an error
  EnumTree.parse('');
} catch (error) {
  console.log('Error:', error.message); // 'Unexpected end of input'
}`,

  //----------------------------------------------------------------------

  `import { ModelTree } from '@stackpress/idea-parser';

try {
  // Invalid - model names must be capitalized
  ModelTree.parse('model user { id String }');
} catch (error) {
  console.log('Expected CapitalIdentifier but got something else');
}`,

  //----------------------------------------------------------------------

  `// This is what happens internally:
import { SchemaTree, Compiler } from '@stackpress/idea-parser';

export function parse(code: string) {
  const ast = SchemaTree.parse(code);  // Parse to AST
  return Compiler.schema(ast);         // Compile to JSON
}

export function final(code: string) {
  const ast = SchemaTree.parse(code);  // Parse to AST
  return Compiler.final(ast);          // Compile and clean up
}`,

  //----------------------------------------------------------------------

  `import { Lexer, SchemaTree } from '@stackpress/idea-parser';

// Create and configure lexer once
const lexer = new Lexer();
SchemaTree.definitions(lexer);

// Reuse for multiple parses
const tree = new SchemaTree(lexer);

const result1 = tree.parse(code1);
const result2 = tree.parse(code2);
const result3 = tree.parse(code3);`,

  //----------------------------------------------------------------------

  `// Inside tree parsing methods
const checkpoint = this._lexer.clone();

try {
  // Try to parse optional structure
  return this.parseOptionalStructure();
} catch (error) {
  // Restore lexer state and continue
  this._lexer = checkpoint;
  return this.parseAlternativeStructure();
}`,

  //----------------------------------------------------------------------

  `const enumCode = \`enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}\`;

const ast = EnumTree.parse(enumCode);
// Produces a complete AST with all three enum values`,

  //----------------------------------------------------------------------

  `const modelCode = \`model User @label("User" "Users") {
  id       String       @label("ID")         @id @default("nanoid(20)")
  username String       @label("Username")   @searchable @field.input(Text) @is.required
  password String       @label("Password")   @field.password @is.clt(80) @is.cgt(8) @is.required @list.hide @view.hide
  role     Roles        @label("Role")       @filterable @field.select @list.text(Uppercase) @view.text(Uppercase)
  address  Address?     @label("Address")    @list.hide
  age      Number       @label("Age")        @unsigned @filterable @sortable @field.number(Age) @is.gt(0) @is.lt(150)
  balance  Number[]     @label("Balance")    @filterable @sortable @field.number() @list.number() @view.number
  active   Boolean      @label("Active")     @default(true) @filterable @field.switch @list.yesno @view.yesno
  created  Date         @label("Created")    @default("now()") @filterable @sortable @list.date(Pretty)
  updated  Date         @label("Updated")    @default("updated()") @filterable @sortable @list.date(Pretty)
  company  Company?     @label("My Company") 
}\`;

const ast = ModelTree.parse(modelCode);
// Produces a complete model AST with all columns and attributes`
];

//----------------------------------------------------------------------

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Syntax Trees');
  const description = _(
    'The AST classes are responsible for parsing specific parts ' +
    'of schema code into Abstract Syntax Trees (ASTs). Each AST ' +
    'class handles a different type of declaration or construct ' +
    'in the schema language.'
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
      {/* API Reference Navigation*/}
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
        <div
          className="text-blue-300 cursor-pointer">
          {_('AST Reference')}
        </div>

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
      <h6 className="theme-muted px-fs-14 px-mb-0 px-mt-30 px-pb-10 uppercase">
        {_('On this page')}
      </h6>
      <nav className="px-fs-14 px-lh-28 flex flex-col">
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#syntax-trees"
        >
          {_('A. Syntax Trees')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#schema-tree"
        >
          {_('1. Schema Tree')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#enum-tree"
        >
          {_('2. Enum Tree')}
        </a>

        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#model-tree"
        >
          {_('3. Model Tree')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#type-tree"
        >
          {_('4. Type Tree')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#prop-tree"
        >
          {_('5. Prop Tree')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#plugin-tree"
        >
          {_('6. Plugin Tree')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#use-tree"
        >
          {_('7. Use Tree')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#usage-patterns"
        >
          {_('8. Usage Patterns')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#error-handling"
        >
          {_('9. Error Handling')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#integration-with-main-functions"
        >
          {_('10. Integration with Main Function')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#performance-considerations"
        >
          {_('11. Performance Considerations')}
        </a>
        <a
          className="text-blue-500 cursor-pointer hover:text-blue-700"
          href="/docs/parser/api-references/ast#test-driven-examples"
        >
          {_('12. Test Driven Examples')}
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
      {/* Syntax Trees Section Content */}
      <section id='syntax-trees'>
        <H1>{_('Syntax Trees')}</H1>
        <Translate>
          The AST classes are responsible for parsing specific parts
          of schema code into Abstract Syntax Trees (ASTs). Each AST
          class handles a different type of declaration or construct
          in the schema language.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[0]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* SchemaTree Section Content */}
      <section id='schema-tree'>
        <H1>{_('1. SchemaTree')}</H1>
        <P>
          <Translate>
            Parses complete schema files containing multiple declarations.
          </Translate>
        </P>

        {/* Static Methods Section Content */}
        <section id='static-methods'>
          <H2>{_('1.1 Static Methods')}</H2>

          <H2>{_('1.1.1 Setting Up Schema Definitions')}</H2>
          <P>
            <Translate>
              The following example shows how to configure a lexer for
              schema parsing.
            </Translate>
          </P>
          <Code copy language='javascript' className='bg-black text-white'>
            {examples[1]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Trow className='theme-bg-bg2 text-left'>
              <Thead>Parameter</Thead>
              <Thead>Type</Thead>
              <Thead>Description</Thead>
            </Trow>
            <Trow>
              <Tcol><C>lexer</C></Tcol>
              <Tcol><C>Lexer</C></Tcol>
              <Tcol>{_('The lexer instance to configure')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <ul className='my-2 list-disc pl-5'>
            <li>{_('The configured lexer instance.')}</li>
          </ul>
        </section>

        {/* Parsing Complete Schemas */}
        <section id='parsing-complete-schemas'>
          <H2>{_('1.1.2 Parsing Complete Schemas')}</H2>
          <Translate>
            The following example shows how to parse a complete schema file.
          </Translate>
          <Code copy language='javascript' className='bg-black text-white'>
            {examples[2]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Trow className="theme-bg-bg2 text-left">
              <Thead>Parameter</Thead>
              <Thead>Type</Thead>
              <Thead>Description</Thead>
            </Trow>
            <Trow>
              <Tcol><C>code</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>{_('The complete schema code to parse')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <ul className='my-2 list-disc pl-5'>
            <li>{_('A SchemaToken representing the entire parsed schema.')}</li>
          </ul>
        </section>

        {/* Methods Section Content */}
        <section id='methods'>
          <H2>{_('1.2 Methods')}</H2>

          <H2>{_('1.2.1 Parsing Schema Content')}</H2>
          <Translate>
            The following example shows how to parse schema content with
            custom starting position.
          </Translate>
          <Code copy language='javascript' className='bg-black text-white'>
            {examples[3]}
          </Code>

          <H2>{_('Parameters')}</H2>
          <Table>
            <Trow className="theme-bg-bg2 text-left">
              <Thead>Parameter</Thead>
              <Thead>Type</Thead>
              <Thead>Description</Thead>
            </Trow>
            <Trow>
              <Tcol><C>code</C></Tcol>
              <Tcol><C>string</C></Tcol>
              <Tcol>{_('The schema code to parse')}</Tcol>
            </Trow>
            <Trow>
              <Tcol><C>start</C></Tcol>
              <Tcol><C>number</C></Tcol>
              <Tcol>{_('Starting position in the code (default: 0)')}</Tcol>
            </Trow>
          </Table>

          <SS>{_('Returns')}</SS>
          <ul className='my-2 list-disc pl-5'>
            <li>{_('A SchemaToken containing all parsed declarations.')}</li>
          </ul>
        </section>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* EnumTree Section Content */}
      <section id='enum-tree'>
        <H1>{_('2. EnumTree')}</H1>
        <Translate>
          Parses enum declarations into AST tokens.
        </Translate>

        <H2>{_('2.1 Static Methods')}</H2>

        <H2>{_('2.1.1 Setting Up Enum Definitions')}</H2>
        <Translate>
          The following example shows how to configure a lexer for
          enum parsing.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[4]}
        </Code>

        <H2>{_('2.1.2 Parsing Enum Declarations')}</H2>
        <Translate>
          The following example shows how to parse enum declarations
          based on the test fixtures.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[5]}
        </Code>

        <H2>{_('Parameters')}</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>{_('The enum declaration code to parse')}</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>{_('Starting position in the code (default: 0)')}</Tcol>
          </Trow>
        </Table>

        <SS>{_('Returns')}</SS>
        <li className='my-2 list-none'>
          <Translate>
            A DeclarationToken representing the parsed enum.
          </Translate>
        </li>

        <H2>{_('2.2 Methods')}</H2>

        <H2>{_('2.2.1 Parsing Enum Structure')}</H2>
        <Translate>
          The following example shows how to parse the enum structure.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[6]}
        </Code>

        <SS>{_('Returns')}</SS>
        <li className='my-2 list-none'>
          <Translate>
            A DeclarationToken representing the enum structure.
          </Translate>
        </li>

        <H2>{_('2.2.2 Parsing Enum Properties')}</H2>
        <Translate>
          The following example shows how individual enum properties are parsed.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A PropertyToken representing a single enum key-value pair.
            </Translate>
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* ModelTree Section Content */}
      <section id='model-tree'>
        <H1>{_('3. ModelTree')}</H1>
        <Translate>
          Parses model declarations (extends TypeTree for shared functionality).
        </Translate>

        <H2>{_('3.1 Static Methods')}</H2>

        <H2>{_('3.1.1 Parsing Model Declarations')}</H2>
        <Translate>
          The following example shows how to parse model declarations
          based on the test fixtures.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[8]}
        </Code>

        <H2>{_('Parameters')}</H2>
        <Table>
          <Trow className="theme-bg-bg2 text-left">
            <Thead>Parameter</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>{_('The model declaration code to parse')}</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>{_('Starting position in the code (default: 0)')}</Tcol>
          </Trow>
        </Table>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A DeclarationToken representing the parsed model.
            </Translate>
          </li>
        </ul>

        <H2>{_('3.2 Methods')}</H2>

        <H2>{_('3.2.1 Parsing Model Structure')}</H2>
        <Translate>
          The following example shows how to parse the model structure.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A DeclarationToken representing the model structure.
            </Translate>
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* TypeTree Section */}
      <section id='type-tree'>
        <H1>{_('4. TypeTree')}</H1>
        <Translate>
          Parses type declarations.
        </Translate>

        <H2>{_('4.1 Static Methods')}</H2>

        <H2>{_('4.1.1 Parsing Type Declarations')}</H2>
        <Translate>
          The following example shows how to parse type declarations.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H2>{_('Parameters')}</H2>
        <Table>
          <Trow className="theme-bg-bg2 text-left">
            <Thead>Parameter</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>{_('The type declaration code to parse')}</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>{_('Starting position in the code (default: 0)')}</Tcol>
          </Trow>
        </Table>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A DeclarationToken representing the parsed type.
            </Translate>
          </li>
        </ul>

        <H2>{_('4.2 Methods')}</H2>

        <H2>{_('4.2.1 Parsing Type Structure')}</H2>
        <Translate>
          The following example shows how to parse the type structure.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <SS>{_('Returns')}</SS>
        <li className='my-2 list-none'>
          <Translate>
            A DeclarationToken representing the type structure.
          </Translate>
        </li>

        <H2>{_('4.2.2 Parsing Type Properties')}</H2>
        <Translate>
          The following example shows how type properties (columns) are parsed.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <SS>{_('Returns')}</SS>
        <li className='my-2 list-none'>
          <Translate>
            A PropertyToken representing a type column definition.
          </Translate>
        </li>

        <H2>{_('4.2.3 Parsing Type Parameters')}</H2>
        <Translate>
          The following example shows how type parameters are parsed.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[13]}
        </Code>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A ParameterToken representing a type parameter.
            </Translate>
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* PropTree Section */}
      <section id='prop-tree'>
        <H1>{_('5. PropTree')}</H1>
        <Translate>
          Parses prop (property configuration) declarations.
        </Translate>

        <H2>{_('5.1 Static Methods')}</H2>

        <H2>{_('5.1.1 Parsing Prop Declarations')}</H2>
        <Translate>
          The following example shows how to parse prop declarations.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[14]}
        </Code>

        <H2>{_('Parameters')}</H2>
        <Table>
          <Trow className="theme-bg-bg2 text-left">
            <Thead>Parameter</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>{_('The prop declaration code to parse')}</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>{_('Starting position in the code (default: 0)')}</Tcol>
          </Trow>
        </Table>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A DeclarationToken representing the parsed prop.
            </Translate>
          </li>
        </ul>

        <H2>{_('5.2 Methods')}</H2>

        <H2>{_('5.2.1 Parsing Prop Structure')}</H2>
        <Translate>
          The following example shows how to parse the prop structure.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[15]}
        </Code>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A DeclarationToken representing the prop configuration.
            </Translate>
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* PluginTree Section */}
      <section id='plugin-tree'>
        <H1>{_('6. PluginTree')}</H1>
        <Translate>
          Parses plugin declarations.
        </Translate>

        <H2>{_('6.1 Static Methods')}</H2>

        <H2>{_('6.1.1 Parsing Plugin Declarations')}</H2>
        <Translate>
          The following example shows how to parse plugin declarations.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H2>{_('Parameters')}</H2>
        <Table>
          <Trow className="theme-bg-bg2 text-left">
            <Thead>Parameter</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>{_('The plugin declaration code to parse')}</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>{_('Starting position in the code (default: 0)')}</Tcol>
          </Trow>
        </Table>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>{_('A DeclarationToken representing the parsed plugin.')}</li>
        </ul>

        <H2>{_('6.2 Methods')}</H2>

        <H2>{_('6.2.1 Parsing Plugin Structure')}</H2>
        <Translate>
          The following example shows how to parse the plugin structure.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[17]}
        </Code>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              A DeclarationToken representing the plugin configuration.
            </Translate>
          </li>
        </ul>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* UseTree Section Content */}
      <section id='use-tree'>
        <H1>{_('7. UseTree')}</H1>
        <Translate>
          Parses use (import) declarations.
        </Translate>

        <H2>{_('7.1 Static Methods')}</H2>

        <H2>{_('7.1.1Parsing Use Declarations')}</H2>
        <Translate>
          The following example shows how to parse use declarations.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[18]}
        </Code>

        <H2>{_('Parameters')}</H2>
        <Table>
          <Trow className="theme-bg-bg2 text-left">
            <Thead>Parameter</Thead>
            <Thead>Type</Thead>
            <Thead>Description</Thead>
          </Trow>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>{_('The use declaration code to parse')}</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>{_('Starting position in the code (default: 0)')}</Tcol>
          </Trow>
        </Table>

        <SS>{_('Returns')}</SS>
        <ul className='my-2 list-disc pl-5'>
          <li>{_('An ImportToken representing the parsed use statement.')}</li>
        </ul>

        <H2>{_('7.2 Methods')}</H2>

        <H2>{_('7.2.1 Parsing Use Structure')}</H2>
        <Translate>
          The following example shows how to parse the use structure.
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[19]}
        </Code>

        <SS>{_('Returns')}</SS>
        <P>
          <Translate>
            An ImportToken representing the import statement.
          </Translate>
        </P>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Usage Patterns Section Content */}
      <section id='usage-patterns'>
        <H1>{_('8. Usage Patterns')}</H1>

        <H2>{_('8.1 Parsing Individual Components')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[20]}
        </Code>

        <H2>{_('8.2 Using with Compiler')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[21]}
        </Code>

        <H2>{_('8.3 Custom AST Classes')}</H2>
        <P>
          <Translate>
            You can extend AbstractTree to create custom parsers:
          </Translate>
        </P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[22]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Error Handling Section Content */}
      <section id='error-handling'>
        <H1>{_('9. Error Handling')}</H1>
        <Translate>
          AST classes provide detailed error information when parsing fails:
        </Translate>

        <H2>{_('Syntax Errors')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[23]}
        </Code>

        <H2>{_('Unexpected Tokens')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[24]}
        </Code>

        <H2>{_('Empty Input Handling')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[25]}
        </Code>

        <H2>{_('Invalid Identifiers')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[26]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Integration with Main Functions Section Content */}
      <section id='integration-with-main-functions'>
        <H1>{_('10. Integration with Main Functions')}</H1>
        <Translate>
          AST classes are used internally by the main parse and final functions:
        </Translate>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[27]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Performance Considerations Section Content */}
      <section id='performance-considerations'>
        <H1>{_('11. Performance Considerations')}</H1>

        <H2>{_('11.1 Lexer Reuse')}</H2>
        <P>
          <Translate>
            AST classes can share lexer instances for better performance:
          </Translate>
        </P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[28]}
        </Code>

        <H2>{_('11.2 Cloning for Backtracking')}</H2>
        <P>
          <Translate>
            AST classes use lexer cloning for safe parsing attempts:
          </Translate>
        </P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[29]}
        </Code>
      </section>

      {/* Horizontal Rule */}
      <hr className='mt-10' />

      {/* Test-Driven Examples Section Content */}
      <section id='test-driven-examples'>
        <H1>{_('12. Test-Driven Examples')}</H1>
        <P>
          <Translate>
            Based on the test fixtures, here are real-world examples:
          </Translate>
        </P>

        <H2>{_('Enum with Multiple Values')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[30]}
        </Code>

        <H2>{_('Complex Model with Attributes')}</H2>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[31]}
        </Code>

        <P>
          <Translate>
            This demonstrates the parser's ability to handle:
          </Translate>
        </P>

        <ul className='my-2 list-disc pl-5'>
          <li>
            <Translate>
              Model mutability (! modifier)
            </Translate>
          </li>
          <li>
            <Translate>
              Attributes (@label, @id, @default, etc.)
            </Translate>
          </li>
          <li>
            <Translate>
              Optional types (Address?, Company?)
            </Translate>
          </li>
          <li>
            <Translate>
              Array types (Number[])
            </Translate>
          </li>
          <li>
            <Translate>
              Complex attribute parameters (@field.input(Text), @is.clt(80))
            </Translate>
          </li>
        </ul>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Compiler'),
          href: '/docs/parser/api-references/compiler'
        }}
        next={{
          text: _('Tokens'),
          href: '/docs/parser/api-references/tokens'
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