# The `.idea` File

An `.idea` file is a schema document made of declarations and nested
data values.

The format is intentionally permissive. It aims to be easy to write and
easy to extend rather than to behave like a rigid interface definition
language.

## The Core Rule

Idea separates structure from semantics.

The parser defines:

- what declarations exist
- how literals, arrays, and objects are parsed
- how files are composed with `use`

Plugins define:

- what many attributes mean
- what files are generated
- what conventions a given toolchain expects

## Minimal Syntax

The syntax avoids separators such as commas and colons in many places.
Context determines where values begin and end.

Example:

```ts
prop Email {
  type "email"
  required true
}
```

Strings use double quotes:

```ts
label "User"
```

Numbers, booleans, and null can appear directly:

```ts
min 0
enabled true
value null
```

Arrays are space-separated:

```ts
roles ["ADMIN" "USER"]
```

Objects are nested key-value pairs:

```ts
field {
  type "text"
  placeholder "Name"
}
```

Comments are supported:

```ts
// line comment
/*
  block comment
*/
```

## Main Declarations

### `use`

Loads another schema file and merges it into the current one.

It can point to a relative file:

```ts
use "./shared.idea"
```

It can also point to a schema shipped by an installed package:

```ts
use "stackpress/stackpress.idea"
```

### `plugin`

Declares a plugin module and its config block.

### `prop`

Defines reusable metadata that fields can reference.

### `enum`

Defines a named set of fixed values.

### `type`

Defines a reusable structured type.

### `model`

Defines a top-level entity-like shape.

## Attributes Are Metadata

A large part of the format is attribute-driven:

```ts
name String @required @field.text @db.varchar(255)
```

Attributes can also appear on `model` and `type` declarations:

```ts
model User @icon("user") {}

type Address @label("Address") {
  street String
}
```

The parser preserves these attributes, but it does not decide what
`@field.text` or `@db.varchar(255)` must do. Those meanings come from
plugins and conventions in your toolchain.

This is why the format can stay small while still supporting very
different outputs.

## Parser Guarantees Vs Plugin Semantics

### Parser Guarantees

- declaration names and nesting
- literal parsing
- object and array parsing
- schema composition through `use`
- merged schema data passed to plugins

### Plugin Semantics

- output file formats
- database-specific attributes
- UI-specific attributes
- validation-specific attributes
- framework-specific behavior
- package-specific plugin conventions

When documenting your own plugin ecosystem, keep those two layers
separate. It makes the format easier to understand and easier to evolve.

## Practical Advice

- Treat `.idea` as a schema transport format first.
- Document plugin conventions close to the plugin that uses them.
- Use small examples before large, ecosystem-heavy examples.
- Be explicit about which attributes are core conventions and which are
  project-specific.

## Next

- [Schema Building](https://github.com/stackpress/idea/blob/main/docs/concepts/schema-building.md)
- [Specification Reference](https://github.com/stackpress/idea/blob/main/docs/reference/specification.md)
