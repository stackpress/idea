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
  `import { 
  SchemaTree, 
  EnumTree, 
  ModelTree, 
  TypeTree, 
  PropTree, 
  PluginTree, 
  UseTree 
} from '@stackpress/idea-parser';`,
  `import { SchemaTree, Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
SchemaTree.definitions(lexer);

// Lexer now has definitions for all schema constructs:
// enum, prop, type, model, plugin, use keywords and structures`,
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
  `import { SchemaTree } from '@stackpress/idea-parser';

const tree = new SchemaTree();
const schemaCode = 'enum Status { ACTIVE "Active" }';

const result = tree.parse(schemaCode, 0);
console.log(result.body[0].kind); // 'enum'`,
  `import { EnumTree, Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
EnumTree.definitions(lexer);

// Adds 'EnumWord' token definition for 'enum' keyword`,
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
  `const tree = new EnumTree();
tree._lexer.load('enum Status { ACTIVE "Active" INACTIVE "Inactive" }');

const enumToken = tree.enum();
console.log(enumToken.declarations[0].id.name); // 'Status'
console.log(enumToken.declarations[0].init.properties[0].key.name); // 'ACTIVE'
console.log(enumToken.declarations[0].init.properties[0].value.value); // 'Active'`,
  `// Inside enum parsing, after opening brace
const property = tree.property();
console.log(property.key.name); // e.g., 'ADMIN'
console.log(property.value.value); // e.g., 'Admin'`,
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
  `const tree = new ModelTree();
tree._lexer.load('model User { id String @id }');

const modelToken = tree.model();
console.log(modelToken.kind); // 'model'
console.log(modelToken.mutable); // false (immutable due to '!')`,
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
  `const tree = new TypeTree();
tree._lexer.load('type Address { street String city String }');

const typeToken = tree.type();
console.log(typeToken.kind); // 'type'
console.log(typeToken.mutable); // true (default for types)`,
  `// Inside type parsing
const property = tree.property();
console.log(property.key.name); // e.g., 'street'
console.log(property.value); // Object containing type and attributes`,
  `// For parsing generic type parameters
const parameter = tree.parameter();
console.log(parameter.key.name); // Parameter name
console.log(parameter.value); // Parameter type/constraint`,
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
  `const tree = new PropTree();
tree._lexer.load('prop Text { type "text" format "lowercase" }');

const propToken = tree.prop();
console.log(propToken.kind); // 'prop'
console.log(propToken.declarations[0].id.name); // 'Text'`,
  `import { PluginTree } from '@stackpress/idea-parser';

const pluginCode = \`plugin "./database-plugin" {
  provider "postgresql"
  url env("DATABASE_URL")
  previewFeatures ["fullTextSearch"]
}\`;

const ast = PluginTree.parse(pluginCode);
console.log(ast.kind); // 'plugin'
console.log(ast.declarations[0].id.name); // './database-plugin'`,
  `const tree = new PluginTree();
tree._lexer.load('plugin "./custom" { provider "custom-provider" }');

const pluginToken = tree.plugin();
console.log(pluginToken.kind); // 'plugin'
console.log(pluginToken.declarations[0].id.name); // './custom'`,
  `import { UseTree } from '@stackpress/idea-parser';

const useCode = 'use "./shared/types.idea"';

const ast = UseTree.parse(useCode);
console.log(ast.type); // 'ImportDeclaration'
console.log(ast.source.value); // './shared/types.idea'`,
  `const tree = new UseTree();
tree._lexer.load('use "./another.idea"');

const useToken = tree.use();
console.log(useToken.type); // 'ImportDeclaration'
console.log(useToken.source.value); // './another.idea'`,
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
  `import { EnumTree, Compiler } from '@stackpress/idea-parser';

// Parse and compile in one step
const enumAST = EnumTree.parse(\`enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}\`);
const [enumName, enumConfig] = Compiler.enum(enumAST);

console.log(enumName); // 'Status'
console.log(enumConfig); // { ACTIVE: 'Active', INACTIVE: 'Inactive' }`,
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
  `try {
  // Invalid - 'enum' keyword expected but found 'model'
  EnumTree.parse('model User { id String }');
} catch (error) {
  console.log('Expected enum but found model');
}`,
  `import { EnumTree } from '@stackpress/idea-parser';

try {
  // Empty string will throw an error
  EnumTree.parse('');
} catch (error) {
  console.log('Error:', error.message); // 'Unexpected end of input'
}`,
  `import { ModelTree } from '@stackpress/idea-parser';

try {
  // Invalid - model names must be capitalized
  ModelTree.parse('model user { id String }');
} catch (error) {
  console.log('Expected CapitalIdentifier but got something else');
}`,
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
  `import { Lexer, SchemaTree } from '@stackpress/idea-parser';

// Create and configure lexer once
const lexer = new Lexer();
SchemaTree.definitions(lexer);

// Reuse for multiple parses
const tree = new SchemaTree(lexer);

const result1 = tree.parse(code1);
const result2 = tree.parse(code2);
const result3 = tree.parse(code3);`,
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
  `const enumCode = \`enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}\`;

const ast = EnumTree.parse(enumCode);
// Produces a complete AST with all three enum values`,
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

export function Body() {
  const { _ } = useLanguage();

  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <section>
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

      <H2>{_('SchemaTree')}</H2>
      <Translate>
        Parses complete schema files containing multiple declarations.
      </Translate>

      <H3>{_('Static Methods')}</H3>

      <H3>{_('Setting Up Schema Definitions')}</H3>
      <Translate>
        The following example shows how to configure a lexer for
        schema parsing.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[1]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
        <Trow>
          <Tcol><C>lexer</C></Tcol>
          <Tcol><C>Lexer</C></Tcol>
          <Tcol>{_('The lexer instance to configure')}</Tcol>
        </Trow>
      </Table>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>
        {_('The configured lexer instance.')}
      </li>

      <H3>{_('Parsing Complete Schemas')}</H3>
      <Translate>
        The following example shows how to parse a complete schema file.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[2]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">
          {_('Parameter')}
        </Thead>
        <Thead className="theme-bg-bg2 text-left">
          {_('Type')}
        </Thead>
        <Thead className="theme-bg-bg2 text-left">
          {_('Description')}
        </Thead>
        <Trow>
          <Tcol><C>code</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol>{_('The complete schema code to parse')}</Tcol>
        </Trow>
      </Table>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>
        {_('A SchemaToken representing the entire parsed schema.')}
      </li>

      <H3>{_('Methods')}</H3>

      <H3>{_('Parsing Schema Content')}</H3>
      <Translate>
        The following example shows how to parse schema content with
        custom starting position.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[3]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">{_('Parameter')}</Thead>
        <Thead className="theme-bg-bg2 text-left">{_('Type')}</Thead>
        <Thead className="theme-bg-bg2 text-left">{_('Description')}</Thead>
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
      <li className='my-2 list-none'>
        {_('A SchemaToken containing all parsed declarations.')}
      </li>

      <H2>{_('EnumTree')}</H2>
      <Translate>
        Parses enum declarations into AST tokens.
      </Translate>

      <H3>{_('Static Methods')}</H3>

      <H3>{_('Setting Up Enum Definitions')}</H3>
      <Translate>
        The following example shows how to configure a lexer for
        enum parsing.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[4]}
      </Code>

      <H3>{_('Parsing Enum Declarations')}</H3>
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

      <H3>{_('Methods')}</H3>

      <H3>{_('Parsing Enum Structure')}</H3>
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

      <H3>{_('Parsing Enum Properties')}</H3>
      <Translate>
        The following example shows how individual enum properties are parsed.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[7]}
      </Code>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>
        <Translate>
          A PropertyToken representing a single enum key-value pair.
        </Translate>
      </li>

      <H2>{_('ModelTree')}</H2>
      <Translate>
        Parses model declarations (extends TypeTree for shared functionality).
      </Translate>

      <H3>{_('Static Methods')}</H3>

      <H3>{_('Parsing Model Declarations')}</H3>
      <Translate>
        The following example shows how to parse model declarations
        based on the test fixtures.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[8]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
      <li className='my-2 list-none'>
        <Translate>
          A DeclarationToken representing the parsed model.
        </Translate>
      </li>

      <H3>{_('Methods')}</H3>

      <H3>{_('Parsing Model Structure')}</H3>
      <Translate>
        The following example shows how to parse the model structure.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[9]}
      </Code>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>
        <Translate>
          A DeclarationToken representing the model structure.
        </Translate>
      </li>

      <H2>{_('TypeTree')}</H2>
      <Translate>
        Parses type declarations.
      </Translate>

      <H3>{_('Static Methods')}</H3>

      <H3>{_('Parsing Type Declarations')}</H3>
      <Translate>
        The following example shows how to parse type declarations.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[10]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
      <li className='my-2 list-none'>
        <Translate>
          A DeclarationToken representing the parsed type.
        </Translate>
      </li>

      <H3>{_('Methods')}</H3>

      <H3>{_('Parsing Type Structure')}</H3>
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

      <H3>{_('Parsing Type Properties')}</H3>
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

      <H3>{_('Parsing Type Parameters')}</H3>
      <Translate>
        The following example shows how type parameters are parsed.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[13]}
      </Code>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>
        nslate

      </li>

      <H2>{_('PropTree')}</H2>
      <Translate>
        Parses prop (property configuration) declarations.
      </Translate>

      <H3>{_('Static Methods')}</H3>

      <H3>{_('Parsing Prop Declarations')}</H3>
      <Translate>
        The following example shows how to parse prop declarations.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[14]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
      <li className='my-2 list-none'>
        <Translate>
          A DeclarationToken representing the parsed prop.
        </Translate>
      </li>

      <H3>{_('Methods')}</H3>

      <H3>{_('Parsing Prop Structure')}</H3>
      <Translate>
        The following example shows how to parse the prop structure.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[15]}
      </Code>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>
        <Translate>
          A DeclarationToken representing the prop configuration.
        </Translate>
      </li>

      <H2>{_('PluginTree')}</H2>
      <Translate>
        Parses plugin declarations.
      </Translate>

      <H3>{_('Static Methods')}</H3>

      <H3>{_('Parsing Plugin Declarations')}</H3>
      <Translate>
        The following example shows how to parse plugin declarations.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[16]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
      <li className='my-2 list-none'>
        {_('A DeclarationToken representing the parsed plugin.')}
      </li>

      <H3>{_('Methods')}</H3>

      <H3>{_('Parsing Plugin Structure')}</H3>
      <Translate>
        The following example shows how to parse the plugin structure.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[17]}
      </Code>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>A DeclarationToken representing the plugin configuration.</li>

      <H2>{_('UseTree')}</H2>
      <Translate>
        Parses use (import) declarations.
      </Translate>

      <H3>{_('Static Methods')}</H3>

      <H3>{_('Parsing Use Declarations')}</H3>
      <Translate>
        The following example shows how to parse use declarations.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[18]}
      </Code>

      <H2>{_('Parameters')}</H2>
      <Table>
        <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
        <Thead className="theme-bg-bg2 text-left">Type</Thead>
        <Thead className="theme-bg-bg2 text-left">Description</Thead>
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
      <li className='my-2 list-none'>
        {_('An ImportToken representing the parsed use statement.')}
      </li>

      <H3>{_('Methods')}</H3>

      <H3>{_('Parsing Use Structure')}</H3>
      <Translate>
        The following example shows how to parse the use structure.
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[19]}
      </Code>

      <SS>{_('Returns')}</SS>
      <li className='my-2 list-none'>{_('An ImportToken representing the import statement.')}</li>

      <H2>{_('Usage Patterns')}</H2>

      <H3>{_('Parsing Individual Components')}</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[20]}
      </Code>

      <H3>{_('Using with Compiler')}</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[21]}
      </Code>

      <H3>{_('Custom AST Classes')}</H3>
      <Translate>
        You can extend AbstractTree to create custom parsers:
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[22]}
      </Code>

      <H2>{_('Error Handling')}</H2>
      <Translate>
        AST classes provide detailed error information when parsing fails:
      </Translate>      <H3>Syntax Errors</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[23]}
      </Code>

      <H3>{_('Unexpected Tokens')}</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[24]}
      </Code>

      <H3>{_('Empty Input Handling')}</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[25]}
      </Code>

      <H3>{_('Invalid Identifiers')}</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[26]}
      </Code>

      <H2>{_('Integration with Main Functions')}</H2>
      <Translate>
        AST classes are used internally by the main parse and final functions:
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[27]}
      </Code>

      <H2>{_('Performance Considerations')}</H2>

      <H3>{_('Lexer Reuse')}</H3>
      <Translate>
        AST classes can share lexer instances for better performance:
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[28]}
      </Code>

      <H3>{_('Cloning for Backtracking')}</H3>
      <Translate>
        AST classes use lexer cloning for safe parsing attempts:
      </Translate>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[29]}
      </Code>

      <H2>{_('Test-Driven Examples')}</H2>
      <Translate>
        Based on the test fixtures, here are real-world examples:
      </Translate>

      <H3>{_('Enum with Multiple Values')}</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[30]}
      </Code>

      <H3>{_('Complex Model with Attributes')}</H3>
      <Code copy language='javascript' className='bg-black text-white'>
        {examples[31]}
      </Code>

      <Translate>
        This demonstrates the parser's ability to handle:
      </Translate>
      <ul className='my-2 list-disc pl-5'>
        <li>Model mutability (! modifier)</li>
        <li>Attributes (@label, @id, @default, etc.)</li>
        <li>Optional types (Address?, Company?)</li>
        <li>Array types (Number[])</li>
        <li>Complex attribute parameters (@field.input(Text), @is.clt(80))</li>
      </ul>

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
    >
      <Body />
    </Layout>
  );
}