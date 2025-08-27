# Syntax Trees

The AST classes are responsible for parsing specific parts of schema code into Abstract Syntax Trees (ASTs). Each AST class handles a different type of declaration or construct in the schema language.

```typescript
import { 
  SchemaTree, 
  EnumTree, 
  ModelTree, 
  TypeTree, 
  PropTree, 
  PluginTree, 
  UseTree 
} from '@stackpress/idea-parser';
```

## SchemaTree

Parses complete schema files containing multiple declarations.

### Static Methods

#### Setting Up Schema Definitions

The following example shows how to configure a lexer for schema parsing.

```typescript
import { SchemaTree, Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
SchemaTree.definitions(lexer);

// Lexer now has definitions for all schema constructs:
// enum, prop, type, model, plugin, use keywords and structures
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `lexer` | `Lexer` | The lexer instance to configure |

**Returns**

The configured lexer instance.

#### Parsing Complete Schemas

The following example shows how to parse a complete schema file.

```typescript
import { SchemaTree } from '@stackpress/idea-parser';

const schemaCode = `
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
`;

const ast = SchemaTree.parse(schemaCode);
console.log(ast.type); // 'Program'
console.log(ast.kind); // 'schema'
console.log(ast.body.length); // 4 (plugin, enum, prop, model)
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The complete schema code to parse |

**Returns**

A SchemaToken representing the entire parsed schema.

### Methods

#### Parsing Schema Content

The following example shows how to parse schema content with custom starting position.

```typescript
import { SchemaTree } from '@stackpress/idea-parser';

const tree = new SchemaTree();
const schemaCode = 'enum Status { ACTIVE "Active" }';

const result = tree.parse(schemaCode, 0);
console.log(result.body[0].kind); // 'enum'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The schema code to parse |
| `start` | `number` | Starting position in the code (default: 0) |

**Returns**

A SchemaToken containing all parsed declarations.

## EnumTree

Parses enum declarations into AST tokens.

### Static Methods

#### Setting Up Enum Definitions

The following example shows how to configure a lexer for enum parsing.

```typescript
import { EnumTree, Lexer } from '@stackpress/idea-parser';

const lexer = new Lexer();
EnumTree.definitions(lexer);

// Adds 'EnumWord' token definition for 'enum' keyword
```

#### Parsing Enum Declarations

The following example shows how to parse enum declarations based on the test fixtures.

```typescript
import { EnumTree } from '@stackpress/idea-parser';

const enumCode = `enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}`;

const ast = EnumTree.parse(enumCode);
console.log(ast.kind); // 'enum'
console.log(ast.declarations[0].id.name); // 'Roles'
console.log(ast.declarations[0].init.properties.length); // 3
console.log(ast.declarations[0].init.properties[0].key.name); // 'ADMIN'
console.log(ast.declarations[0].init.properties[0].value.value); // 'Admin'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The enum declaration code to parse |
| `start` | `number` | Starting position in the code (default: 0) |

**Returns**

A DeclarationToken representing the parsed enum.

### Methods

#### Parsing Enum Structure

The following example shows how to parse the enum structure.

```typescript
const tree = new EnumTree();
tree._lexer.load('enum Status { ACTIVE "Active" INACTIVE "Inactive" }');

const enumToken = tree.enum();
console.log(enumToken.declarations[0].id.name); // 'Status'
console.log(enumToken.declarations[0].init.properties[0].key.name); // 'ACTIVE'
console.log(enumToken.declarations[0].init.properties[0].value.value); // 'Active'
```

**Returns**

A DeclarationToken representing the enum structure.

#### Parsing Enum Properties

The following example shows how individual enum properties are parsed.

```typescript
// Inside enum parsing, after opening brace
const property = tree.property();
console.log(property.key.name); // e.g., 'ADMIN'
console.log(property.value.value); // e.g., 'Admin'
```

**Returns**

A PropertyToken representing a single enum key-value pair.

## ModelTree

Parses model declarations (extends TypeTree for shared functionality).

### Static Methods

#### Parsing Model Declarations

The following example shows how to parse model declarations based on the test fixtures.

```typescript
import { ModelTree } from '@stackpress/idea-parser';

const modelCode = `model User @label("User" "Users") {
  id       String       @label("ID")         @id @default("nanoid(20)")
  username String       @label("Username")   @searchable @field.input(Text) @is.required
  password String       @label("Password")   @field.password @is.clt(80) @is.cgt(8) @is.required @list.hide @view.hide
  role     Roles        @label("Role")       @filterable @field.select @list.text(Uppercase) @view.text(Uppercase)
  address  Address?     @label("Address")    @list.hide
  age      Number       @label("Age")        @unsigned @filterable @sortable @field.number(Age) @is.gt(0) @is.lt(150)
  active   Boolean      @label("Active")     @default(true) @filterable @field.switch @list.yesno @view.yesno
  created  Date         @label("Created")    @default("now()") @filterable @sortable @list.date(Pretty)
}`;

const ast = ModelTree.parse(modelCode);
console.log(ast.kind); // 'model'
console.log(ast.mutable); // false (because of '!' modifier)
console.log(ast.declarations[0].id.name); // 'User'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The model declaration code to parse |
| `start` | `number` | Starting position in the code (default: 0) |

**Returns**

A DeclarationToken representing the parsed model.

### Methods

#### Parsing Model Structure

The following example shows how to parse the model structure.

```typescript
const tree = new ModelTree();
tree._lexer.load('model User { id String @id }');

const modelToken = tree.model();
console.log(modelToken.kind); // 'model'
console.log(modelToken.mutable); // false (immutable due to '!')
```

**Returns**

A DeclarationToken representing the model structure.

## TypeTree

Parses type declarations.

### Static Methods

#### Parsing Type Declarations

The following example shows how to parse type declarations.

```typescript
import { TypeTree } from '@stackpress/idea-parser';

const typeCode = `type Address @label("Address" "Addresses") {
  street String @field.input @is.required
  city String @field.input @is.required
  country String @field.select
  postal String @field.input
}`;

const ast = TypeTree.parse(typeCode);
console.log(ast.kind); // 'type'
console.log(ast.mutable); // true (mutable by default)
console.log(ast.declarations[0].id.name); // 'Address'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The type declaration code to parse |
| `start` | `number` | Starting position in the code (default: 0) |

**Returns**

A DeclarationToken representing the parsed type.

### Methods

#### Parsing Type Structure

The following example shows how to parse the type structure.

```typescript
const tree = new TypeTree();
tree._lexer.load('type Address { street String city String }');

const typeToken = tree.type();
console.log(typeToken.kind); // 'type'
console.log(typeToken.mutable); // true (default for types)
```

**Returns**

A DeclarationToken representing the type structure.

#### Parsing Type Properties

The following example shows how type properties (columns) are parsed.

```typescript
// Inside type parsing
const property = tree.property();
console.log(property.key.name); // e.g., 'street'
console.log(property.value); // Object containing type and attributes
```

**Returns**

A PropertyToken representing a type column definition.

#### Parsing Type Parameters

The following example shows how type parameters are parsed.

```typescript
// For parsing generic type parameters
const parameter = tree.parameter();
console.log(parameter.key.name); // Parameter name
console.log(parameter.value); // Parameter type/constraint
```

**Returns**

A PropertyToken representing a type parameter.

## PropTree

Parses prop (property configuration) declarations.

### Static Methods

#### Parsing Prop Declarations

The following example shows how to parse prop declarations.

```typescript
import { PropTree } from '@stackpress/idea-parser';

const propCode = `prop EmailInput {
  type "email"
  format "email"
  placeholder "Enter your email"
  required true
}`;

const ast = PropTree.parse(propCode);
console.log(ast.kind); // 'prop'
console.log(ast.declarations[0].id.name); // 'EmailInput'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The prop declaration code to parse |
| `start` | `number` | Starting position in the code (default: 0) |

**Returns**

A DeclarationToken representing the parsed prop.

### Methods

#### Parsing Prop Structure

The following example shows how to parse the prop structure.

```typescript
const tree = new PropTree();
tree._lexer.load('prop Text { type "text" format "lowercase" }');

const propToken = tree.prop();
console.log(propToken.kind); // 'prop'
console.log(propToken.declarations[0].id.name); // 'Text'
```

**Returns**

A DeclarationToken representing the prop configuration.

## PluginTree

Parses plugin declarations.

### Static Methods

#### Parsing Plugin Declarations

The following example shows how to parse plugin declarations.

```typescript
import { PluginTree } from '@stackpress/idea-parser';

const pluginCode = `plugin "./database-plugin" {
  provider "postgresql"
  url env("DATABASE_URL")
  previewFeatures ["fullTextSearch"]
}`;

const ast = PluginTree.parse(pluginCode);
console.log(ast.kind); // 'plugin'
console.log(ast.declarations[0].id.name); // './database-plugin'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The plugin declaration code to parse |
| `start` | `number` | Starting position in the code (default: 0) |

**Returns**

A DeclarationToken representing the parsed plugin.

### Methods

#### Parsing Plugin Structure

The following example shows how to parse the plugin structure.

```typescript
const tree = new PluginTree();
tree._lexer.load('plugin "./custom" { provider "custom-provider" }');

const pluginToken = tree.plugin();
console.log(pluginToken.kind); // 'plugin'
console.log(pluginToken.declarations[0].id.name); // './custom'
```

**Returns**

A DeclarationToken representing the plugin configuration.

## UseTree

Parses use (import) declarations.

### Static Methods

#### Parsing Use Declarations

The following example shows how to parse use declarations.

```typescript
import { UseTree } from '@stackpress/idea-parser';

const useCode = 'use "./shared/types.idea"';

const ast = UseTree.parse(useCode);
console.log(ast.type); // 'ImportDeclaration'
console.log(ast.source.value); // './shared/types.idea'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `code` | `string` | The use declaration code to parse |
| `start` | `number` | Starting position in the code (default: 0) |

**Returns**

An ImportToken representing the parsed use statement.

### Methods

#### Parsing Use Structure

The following example shows how to parse the use structure.

```typescript
const tree = new UseTree();
tree._lexer.load('use "./another.idea"');

const useToken = tree.use();
console.log(useToken.type); // 'ImportDeclaration'
console.log(useToken.source.value); // './another.idea'
```

**Returns**

An ImportToken representing the import statement.

## Usage Patterns

### Parsing Individual Components

```typescript
import { EnumTree, ModelTree, TypeTree } from '@stackpress/idea-parser';

// Parse individual enum
const enumAST = EnumTree.parse(`enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}`);

// Parse individual model
const modelAST = ModelTree.parse(`model User {
  id String @id
  username String @is.required
}`);

// Parse individual type
const typeAST = TypeTree.parse(`type Address {
  street String
  city String
}`);
```

### Using with Compiler

```typescript
import { EnumTree, Compiler } from '@stackpress/idea-parser';

// Parse and compile in one step
const enumAST = EnumTree.parse(`enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}`);
const [enumName, enumConfig] = Compiler.enum(enumAST);

console.log(enumName); // 'Status'
console.log(enumConfig); // { ACTIVE: 'Active', INACTIVE: 'Inactive' }
```

### Custom AST Classes

You can extend AbstractTree to create custom parsers:

```typescript
import { AbstractTree, Lexer } from '@stackpress/idea-parser';
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
}
```

## Error Handling

AST classes provide detailed error information when parsing fails:

### Syntax Errors

```typescript
import { SchemaTree, Exception } from '@stackpress/idea-parser';

try {
  // Invalid syntax - missing closing brace
  SchemaTree.parse('enum Status { ACTIVE "Active"');
} catch (error) {
  if (error instanceof Exception) {
    console.log('Parse error:', error.message);
    console.log('Position:', error.start, '-', error.end);
  }
}
```

### Unexpected Tokens

```typescript
try {
  // Invalid - 'enum' keyword expected but found 'model'
  EnumTree.parse('model User { id String }');
} catch (error) {
  console.log('Expected enum but found model');
}
```

### Empty Input Handling

```typescript
import { EnumTree } from '@stackpress/idea-parser';

try {
  // Empty string will throw an error
  EnumTree.parse('');
} catch (error) {
  console.log('Error:', error.message); // 'Unexpected end of input'
}
```

### Invalid Identifiers

```typescript
import { ModelTree } from '@stackpress/idea-parser';

try {
  // Invalid - model names must be capitalized
  ModelTree.parse('model user { id String }');
} catch (error) {
  console.log('Expected CapitalIdentifier but got something else');
}
```

## Integration with Main Functions

AST classes are used internally by the main `parse` and `final` functions:

```typescript
// This is what happens internally:
import { SchemaTree, Compiler } from '@stackpress/idea-parser';

export function parse(code: string) {
  const ast = SchemaTree.parse(code);  // Parse to AST
  return Compiler.schema(ast);         // Compile to JSON
}

export function final(code: string) {
  const ast = SchemaTree.parse(code);  // Parse to AST
  return Compiler.final(ast);          // Compile and clean up
}
```

## Performance Considerations

### Lexer Reuse

AST classes can share lexer instances for better performance:

```typescript
import { Lexer, SchemaTree } from '@stackpress/idea-parser';

// Create and configure lexer once
const lexer = new Lexer();
SchemaTree.definitions(lexer);

// Reuse for multiple parses
const tree = new SchemaTree(lexer);

const result1 = tree.parse(code1);
const result2 = tree.parse(code2);
const result3 = tree.parse(code3);
```

### Cloning for Backtracking

AST classes use lexer cloning for safe parsing attempts:

```typescript
// Inside tree parsing methods
const checkpoint = this._lexer.clone();

try {
  // Try to parse optional structure
  return this.parseOptionalStructure();
} catch (error) {
  // Restore lexer state and continue
  this._lexer = checkpoint;
  return this.parseAlternativeStructure();
}
```

## Test-Driven Examples

Based on the test fixtures, here are real-world examples:

### Enum with Multiple Values

```typescript
const enumCode = `enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}`;

const ast = EnumTree.parse(enumCode);
// Produces a complete AST with all three enum values
```

### Complex Model with Attributes

```typescript
const modelCode = `model User @label("User" "Users") {
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
}`;

const ast = ModelTree.parse(modelCode);
// Produces a complete model AST with all columns and attributes
```

This demonstrates the parser's ability to handle:
- Model mutability (`!` modifier)
- Attributes (`@label`, `@id`, `@default`, etc.)
- Optional types (`Address?`, `Company?`)
- Array types (`Number[]`)
- Complex attribute parameters (`@field.input(Text)`, `@is.clt(80)`)
