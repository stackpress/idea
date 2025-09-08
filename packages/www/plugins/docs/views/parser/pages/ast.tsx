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
    const title = _('Syntax Trees');
    const description = _(
      'The AST classes are responsible for parsing specific parts of schema code into Abstract Syntax Trees (ASTs). Each AST class handles a different type of declaration or construct in the schema language.'
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
]
  
  export function Body() {
    return (
      <main className="px-h-100-0 overflow-auto px-p-10">
        <H1>Syntax Trees</H1>
        <P>The AST classes are responsible for parsing specific parts of schema code into Abstract Syntax Trees (ASTs). Each AST class handles a different type of declaration or construct in the schema language.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[0]}
        </Code>

        <H2>SchemaTree</H2>
        <P>Parses complete schema files containing multiple declarations.</P>

        <H3>Static Methods</H3>

        <H3>Setting Up Schema Definitions</H3>
        <P>The following example shows how to configure a lexer for schema parsing.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[1]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>lexer</C></Tcol>
            <Tcol><C>Lexer</C></Tcol>
            <Tcol>The lexer instance to configure</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>The configured lexer instance.</li>

        <H3>Parsing Complete Schemas</H3>
        <P>The following example shows how to parse a complete schema file.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[2]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The complete schema code to parse</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A SchemaToken representing the entire parsed schema.</li>

        <H3>Methods</H3>

        <H3>Parsing Schema Content</H3>
        <P>The following example shows how to parse schema content with custom starting position.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[3]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The schema code to parse</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position in the code (default: 0)</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A SchemaToken containing all parsed declarations.</li>

        <H2>EnumTree</H2>
        <P>Parses enum declarations into AST tokens.</P>

        <H3>Static Methods</H3>

        <H3>Setting Up Enum Definitions</H3>
        <P>The following example shows how to configure a lexer for enum parsing.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[4]}
        </Code>

        <H3>Parsing Enum Declarations</H3>
        <P>The following example shows how to parse enum declarations based on the test fixtures.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[5]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The enum declaration code to parse</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position in the code (default: 0)</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the parsed enum.</li>

        <H3>Methods</H3>

        <H3>Parsing Enum Structure</H3>
        <P>The following example shows how to parse the enum structure.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[6]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the enum structure.</li>

        <H3>Parsing Enum Properties</H3>
        <P>The following example shows how individual enum properties are parsed.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[7]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A PropertyToken representing a single enum key-value pair.</li>

        <H2>ModelTree</H2>
        <P>Parses model declarations (extends TypeTree for shared functionality).</P>

        <H3>Static Methods</H3>

        <H3>Parsing Model Declarations</H3>
        <P>The following example shows how to parse model declarations based on the test fixtures.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[8]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The model declaration code to parse</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position in the code (default: 0)</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the parsed model.</li>

        <H3>Methods</H3>

        <H3>Parsing Model Structure</H3>
        <P>The following example shows how to parse the model structure.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[9]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the model structure.</li>

        <H2>TypeTree</H2>
        <P>Parses type declarations.</P>

        <H3>Static Methods</H3>

        <H3>Parsing Type Declarations</H3>
        <P>The following example shows how to parse type declarations.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[10]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The type declaration code to parse</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position in the code (default: 0)</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the parsed type.</li>

        <H3>Methods</H3>

        <H3>Parsing Type Structure</H3>
        <P>The following example shows how to parse the type structure.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[11]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the type structure.</li>

        <H3>Parsing Type Properties</H3>
        <P>The following example shows how type properties (columns) are parsed.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[12]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A PropertyToken representing a type column definition.</li>

        <H3>Parsing Type Parameters</H3>
        <P>The following example shows how type parameters are parsed.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[13]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A PropertyToken representing a type parameter.</li>

        <H2>PropTree</H2>
        <P>Parses prop (property configuration) declarations.</P>

        <H3>Static Methods</H3>

        <H3>Parsing Prop Declarations</H3>
        <P>The following example shows how to parse prop declarations.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[14]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The prop declaration code to parse</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position in the code (default: 0)</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the parsed prop.</li>

        <H3>Methods</H3>

        <H3>Parsing Prop Structure</H3>
        <P>The following example shows how to parse the prop structure.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[15]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the prop configuration.</li>

        <H2>PluginTree</H2>
        <P>Parses plugin declarations.</P>

        <H3>Static Methods</H3>

        <H3>Parsing Plugin Declarations</H3>
        <P>The following example shows how to parse plugin declarations.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[16]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The plugin declaration code to parse</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position in the code (default: 0)</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the parsed plugin.</li>

        <H3>Methods</H3>

        <H3>Parsing Plugin Structure</H3>
        <P>The following example shows how to parse the plugin structure.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[17]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>A DeclarationToken representing the plugin configuration.</li>

        <H2>UseTree</H2>
        <P>Parses use (import) declarations.</P>

        <H3>Static Methods</H3>

        <H3>Parsing Use Declarations</H3>
        <P>The following example shows how to parse use declarations.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[18]}
        </Code>

        <H2>Parameters</H2>
        <Table>
          <Thead className="theme-bg-bg2 text-left">Parameter</Thead>
          <Thead className="theme-bg-bg2 text-left">Type</Thead>
          <Thead className="theme-bg-bg2 text-left">Description</Thead>
          <Trow>
            <Tcol><C>code</C></Tcol>
            <Tcol><C>string</C></Tcol>
            <Tcol>The use declaration code to parse</Tcol>
          </Trow>
          <Trow>
            <Tcol><C>start</C></Tcol>
            <Tcol><C>number</C></Tcol>
            <Tcol>Starting position in the code (default: 0)</Tcol>
          </Trow>
        </Table>

        <SS>Returns</SS>
        <li className='my-2 list-none'>An ImportToken representing the parsed use statement.</li>

        <H3>Methods</H3>

        <H3>Parsing Use Structure</H3>
        <P>The following example shows how to parse the use structure.</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[19]}
        </Code>

        <SS>Returns</SS>
        <li className='my-2 list-none'>An ImportToken representing the import statement.</li>

        <H2>Usage Patterns</H2>

        <H3>Parsing Individual Components</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[20]}
        </Code>

        <H3>Using with Compiler</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[21]}
        </Code>

        <H3>Custom AST Classes</H3>
        <P>You can extend AbstractTree to create custom parsers:</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[22]}
        </Code>

        <H2>Error Handling</H2>
        <P>AST classes provide detailed error information when parsing fails:</P>

        <H3>Syntax Errors</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[23]}
        </Code>

        <H3>Unexpected Tokens</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[24]}
        </Code>

        <H3>Empty Input Handling</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[25]}
        </Code>

        <H3>Invalid Identifiers</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[26]}
        </Code>

        <H2>Integration with Main Functions</H2>
        <P>AST classes are used internally by the main parse and final functions:</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[27]}
        </Code>

        <H2>Performance Considerations</H2>

        <H3>Lexer Reuse</H3>
        <P>AST classes can share lexer instances for better performance:</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[28]}
        </Code>

        <H3>Cloning for Backtracking</H3>
        <P>AST classes use lexer cloning for safe parsing attempts:</P>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[29]}
        </Code>

        <H2>Test-Driven Examples</H2>
        <P>Based on the test fixtures, here are real-world examples:</P>

        <H3>Enum with Multiple Values</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[30]}
        </Code>

        <H3>Complex Model with Attributes</H3>
        <Code copy language='javascript' className='bg-black text-white'>
          {examples[31]}
        </Code>

        <P>This demonstrates the parser's ability to handle:</P>
        <ul className='my-2 list-disc pl-5'>
          <li>Model mutability (! modifier)</li>
          <li>Attributes (@label, @id, @default, etc.)</li>
          <li>Optional types (Address?, Company?)</li>
          <li>Array types (Number[])</li>
          <li>Complex attribute parameters (@field.input(Text), @is.clt(80))</li>
        </ul>

        <Nav
          prev={{ text: 'Compiler', href: '/docs/parser/pages/compiler' }}
          next={{ text: 'Tokens', href: '/docs/parser/pages/tokens' }}
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