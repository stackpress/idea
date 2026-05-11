# Specification Reference

This page describes the core `.idea` file format as implemented by the
parser in this repository.

It is a reference page, not a tutorial.

## Scope

This specification covers:

- declarations
- literals
- arrays and objects
- comments
- schema composition with `use`

It does not define the semantics of every possible attribute or plugin.

## Lexical Elements

### Strings

Strings use double quotes:

```ts
label "User"
```

### Numbers

Integers and floats are supported:

```ts
count 1
price 9.99
offset -1
```

### Booleans

```ts
enabled true
hidden false
```

### Null

```ts
value null
```

### Arrays

Arrays are space-separated:

```ts
roles ["ADMIN" "USER"]
```

### Objects

Objects contain nested key-value pairs:

```ts
options {
  width 20
  height 20
}
```

### Comments

Both line and block comments are supported:

```ts
// line comment
/*
  block comment
*/
```

## Declaration Forms

### `use`

```ts
use "./shared.idea"
```

Loads another schema file and merges it into the current schema.

Package-based imports are also valid:

```ts
use "stackpress/stackpress.idea"
```

### `plugin`

```ts
plugin "./schema-diagram.mjs" {
  output "./generated/schema.mmd"
}
```

The declaration key is the module path. The block is stored as the
plugin config object.

Plugin modules can also be resolved from installed packages:

```ts
plugin "stackpress-schema/transform" {
  output "./generated/schema.json"
}
```

### `prop`

```ts
prop EmailField {
  type "email"
  required true
}
```

### `enum`

```ts
enum Role {
  ADMIN "ADMIN"
  USER "USER"
}
```

### `type`

```ts
type Address {
  street String
  city String
}
```

### `model`

```ts
model User {
  id String @id
  email String @unique
}
```

## Attributes

Attributes attach metadata to declarations and fields:

```ts
email String @required @field.email @db.varchar(255)
```

Declaration-level attributes are also valid on `model` and `type`:

```ts
model User @icon("user") {}

type Address @label("Address") {
  street String
}
```

The parser preserves attributes and their values. The core format does
not assign fixed semantics to every attribute namespace.

## Schema Composition

When the transformer loads a schema with `use`, it loads child schemas
first and merges them into the parent schema.

The merge behavior includes:

- soft merge for `prop`
- soft merge for `enum`
- name-based merge for `type`
- name-based merge for `model`
- local definitions can extend imported `type` and `model` entries
- `!` marks a local `type` or `model` as an overwrite boundary

Mutable parent types and models can absorb child columns instead of
being replaced.

## Parser Guarantees

The parser guarantees:

- declaration structure
- supported literal parsing
- array and object parsing
- preservation of parsed schema metadata

## Non-Goals

This specification does not define:

- what every `@field.*` attribute means
- what every `@db.*` attribute means
- what files plugins generate
- framework-specific or database-specific output contracts

Those belong to plugin or project documentation.

## See Also

- [The `.idea` File](https://github.com/stackpress/idea/blob/main/specs/concepts/the-idea-file.md)
- [Schema Building](https://github.com/stackpress/idea/blob/main/specs/concepts/schema-building.md)
- [Parser API Docs](https://github.com/stackpress/idea/blob/main/specs/api/parser/README.md)
