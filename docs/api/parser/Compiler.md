# Compiler

The Compiler class provides static methods for converting Abstract Syntax Tree (AST) tokens into structured JSON configurations. It serves as the bridge between parsed tokens and the final JSON output.

```typescript
import { Compiler } from '@stackpress/idea-parser';
```

## 1. Static Methods

The following methods can be accessed directly from the Compiler class.

### 1.1. Converting Array Tokens

The following example shows how to compile array tokens into actual arrays.

```typescript
import { Compiler } from '@stackpress/idea-parser';

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
console.log(result); // ['value1', 'value2', 'value3']
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `ArrayToken` | The array token to compile |
| `references` | `UseReferences` | Reference map for resolving identifiers (default: false) |

**Returns**

An array containing the compiled elements.

### 1.2. Converting Data Tokens

The following example shows how to compile various data tokens into their actual values.

```typescript
import { Compiler } from '@stackpress/idea-parser';

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
console.log(objectResult); // { name: 'John' }
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `DataToken` | The data token to compile (can be object, array, literal, or identifier) |
| `references` | `UseReferences` | Reference map for resolving identifiers (default: false) |

**Returns**

The compiled data value based on the token type.

### 1.3. Converting Enum Declarations

The following example shows how to compile enum declarations into JSON configurations.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Example enum token from parsing: enum Status { ACTIVE "Active" INACTIVE "Inactive" }
const enumToken = {
  kind: 'enum',
  declarations: [{
    id: { name: 'Status' },
    init: {
      properties: [
        { key: { name: 'ACTIVE' }, value: { type: 'Literal', value: 'Active' } },
        { key: { name: 'INACTIVE' }, value: { type: 'Literal', value: 'Inactive' } }
      ]
    }
  }]
};

const [name, config] = Compiler.enum(enumToken);
console.log(name); // 'Status'
console.log(config); // { ACTIVE: 'Active', INACTIVE: 'Inactive' }
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `DeclarationToken` | The enum declaration token to compile |

**Returns**

A tuple containing the enum name and its configuration object.

### 1.4. Converting Schema to Final JSON

The following example shows how to compile a schema token into a final JSON configuration.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// This method removes prop and use references for a clean final output
const finalSchema = Compiler.final(schemaToken);
console.log(finalSchema);
// Output will not contain 'prop' or 'use' sections
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `SchemaToken` | The schema token to compile into final form |

**Returns**

A `FinalSchemaConfig` object with references resolved and removed.

### 1.5. Converting Identifier Tokens

The following example shows how to resolve identifier tokens to their actual values.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// With references provided
const references = { MyProp: { type: 'text' } };
const result1 = Compiler.identifier({ name: 'MyProp' }, references);
console.log(result1); // { type: 'text' }

// Without references (returns template string)
const result2 = Compiler.identifier({ name: 'MyProp' }, false);
console.log(result2); // '${MyProp}'

// With empty references (throws error)
try {
  Compiler.identifier({ name: 'UnknownProp' }, {});
} catch (error) {
  console.log(error.message); // 'Unknown reference UnknownProp'
}
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `IdentifierToken` | The identifier token to resolve |
| `references` | `UseReferences` | Reference map for resolving the identifier |

**Returns**

The resolved value from references, a template string, or throws an error.

### 1.6. Converting Literal Tokens

The following example shows how to extract values from literal tokens.

```typescript
import { Compiler } from '@stackpress/idea-parser';

const stringLiteral = Compiler.literal({ type: 'Literal', value: 'hello' });
console.log(stringLiteral); // 'hello'

const numberLiteral = Compiler.literal({ type: 'Literal', value: 42 });
console.log(numberLiteral); // 42

const booleanLiteral = Compiler.literal({ type: 'Literal', value: true });
console.log(booleanLiteral); // true
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `LiteralToken` | The literal token to extract value from |

**Returns**

The literal value (string, number, boolean, etc.).

### 1.7. Converting Model Declarations

The following example shows how to compile model declarations into JSON configurations.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Example model token from parsing: model User { id String @id name String }
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
                    { key: { name: 'type' }, value: { type: 'Literal', value: 'String' } },
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
console.log(config.columns); // Array of column configurations
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `DeclarationToken` | The model declaration token to compile |
| `references` | `UseReferences` | Reference map for resolving identifiers (default: false) |

**Returns**

A tuple containing the model name and its configuration object.

### 1.8. Converting Object Tokens

The following example shows how to compile object tokens into actual objects.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Example object token from parsing { name "John" age 30 }
const objectToken = {
  type: 'ObjectExpression',
  properties: [
    { key: { name: 'name' }, value: { type: 'Literal', value: 'John' } },
    { key: { name: 'age' }, value: { type: 'Literal', value: 30 } }
  ]
};

const result = Compiler.object(objectToken);
console.log(result); // { name: 'John', age: 30 }
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `ObjectToken` | The object token to compile |
| `references` | `UseReferences` | Reference map for resolving identifiers (default: false) |

**Returns**

An object with compiled key-value pairs.

### 1.9. Converting Plugin Declarations

The following example shows how to compile plugin declarations into JSON configurations.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Example plugin token from parsing: plugin "./database" { provider "postgresql" }
const pluginToken = {
  kind: 'plugin',
  declarations: [{
    id: { name: './database' },
    init: {
      properties: [
        { key: { name: 'provider' }, value: { type: 'Literal', value: 'postgresql' } }
      ]
    }
  }]
};

const [name, config] = Compiler.plugin(pluginToken);
console.log(name); // './database'
console.log(config); // { provider: 'postgresql' }
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `DeclarationToken` | The plugin declaration token to compile |

**Returns**

A tuple containing the plugin name and its configuration object.

### 1.10. Converting Prop Declarations

The following example shows how to compile prop declarations into JSON configurations.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Example prop token from parsing: prop Text { type "text" format "lowercase" }
const propToken = {
  kind: 'prop',
  declarations: [{
    id: { name: 'Text' },
    init: {
      properties: [
        { key: { name: 'type' }, value: { type: 'Literal', value: 'text' } },
        { key: { name: 'format' }, value: { type: 'Literal', value: 'lowercase' } }
      ]
    }
  }]
};

const [name, config] = Compiler.prop(propToken);
console.log(name); // 'Text'
console.log(config); // { type: 'text', format: 'lowercase' }
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `DeclarationToken` | The prop declaration token to compile |
| `references` | `UseReferences` | Reference map for resolving identifiers (default: false) |

**Returns**

A tuple containing the prop name and its configuration object.

### 1.11. Converting Schema Declarations

The following example shows how to compile complete schema tokens into JSON configurations.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Compile a complete schema with all declaration types
const schemaConfig = Compiler.schema(schemaToken);
console.log(schemaConfig);
// Output contains: { enum: {...}, prop: {...}, type: {...}, model: {...}, plugin: {...}, use: [...] }

// Compile with finalization (resolves references)
const finalizedConfig = Compiler.schema(schemaToken, true);
console.log(finalizedConfig);
// References are resolved in the output
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `SchemaToken` | The schema token to compile |
| `finalize` | `boolean` | Whether to resolve references (default: false) |

**Returns**

A `SchemaConfig` object containing all compiled declarations.

### 1.12. Converting Type Declarations

The following example shows how to compile type declarations into JSON configurations.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Example type token from parsing: type Address { street String city String }
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
console.log(config.columns); // Array of column configurations
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `DeclarationToken` | The type declaration token to compile |
| `references` | `UseReferences` | Reference map for resolving identifiers (default: false) |

**Returns**

A tuple containing the type name and its configuration object.

### 1.13. Converting Use Declarations

The following example shows how to compile use (import) declarations.

```typescript
import { Compiler } from '@stackpress/idea-parser';

// Example use token from parsing: use "./another.idea"
const useToken = {
  type: 'ImportDeclaration',
  source: { type: 'Literal', value: './another.idea' }
};

const importPath = Compiler.use(useToken);
console.log(importPath); // './another.idea'
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `token` | `ImportToken` | The import declaration token to compile |

**Returns**

The import path as a string.

## 2. Error Handling

The Compiler class throws `Exception` errors for various invalid conditions:

### 2.1. Invalid Token Types

```typescript
// Throws: "Invalid data token type"
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
Compiler.use({ type: 'NotAnImportDeclaration' });
```

### 2.2. Missing Required Properties

```typescript
// Throws: "Expecting a columns property"
Compiler.model({
  kind: 'model',
  declarations: [{
    id: { name: 'User' },
    init: { properties: [] } // Missing columns
  }]
});
```

### 2.3. Unknown References

```typescript
// Throws: "Unknown reference MyProp"
Compiler.identifier({ name: 'MyProp' }, {});
```

### 2.4. Duplicate Declarations

```typescript
// Throws: "Duplicate MyEnum" when compiling schema with duplicate names
Compiler.schema(schemaWithDuplicates);
```

## 3. Type Processing

The Compiler automatically processes type information for models and types:

### 3.1. Type Modifiers

- **Optional types**: `String?` → `{ type: 'String', required: false }`
- **Array types**: `String[]` → `{ type: 'String', multiple: true }`
- **Combined**: `String[]?` → `{ type: 'String', required: false, multiple: true }`

### 3.2. Column Configuration

Models and types are converted from object format to array format to preserve column order:

```typescript
// Input object format
{
  columns: {
    id: { type: 'String', attributes: { id: true } },
    name: { type: 'String', attributes: { required: true } }
  }
}

// Output array format
{
  columns: [
    { name: 'id', type: 'String', required: true, multiple: false, attributes: { id: true } },
    { name: 'name', type: 'String', required: true, multiple: false, attributes: { required: true } }
  ]
}
```

## 3.3. Usage with AST

The Compiler is typically used in conjunction with AST classes:

```typescript
import { Compiler, EnumTree, ModelTree, SchemaTree } from '@stackpress/idea-parser';

// Parse and compile individual components
const enumAST = EnumTree.parse('enum Status { ACTIVE "Active" }');
const [enumName, enumConfig] = Compiler.enum(enumAST);

const modelAST = ModelTree.parse('model User { id String @id }');
const [modelName, modelConfig] = Compiler.model(modelAST);

// Parse and compile complete schema
const schemaAST = SchemaTree.parse(schemaCode);
const schemaConfig = Compiler.schema(schemaAST);
```