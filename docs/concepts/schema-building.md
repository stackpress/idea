# Schema Building

This page explains the main building blocks you use when writing schemas.

## Start With `model`

Most schemas start with one or more models:

```ts
model User {
  id String @id
  email String @unique
  active Boolean @default(true)
}
```

A model is the usual place to describe application entities.

## Use `enum` For Fixed Values

```ts
enum Role {
  ADMIN "ADMIN"
  USER "USER"
}
```

Use enums when a field should come from a fixed set of values.

## Use `type` For Reusable Structures

```ts
type Address {
  street String
  city String
  country String
}
```

Types are useful for structured values that appear in more than one
place.

## Use `prop` For Reusable Metadata

```ts
prop EmailField {
  type "email"
  placeholder "name@example.com"
}
```

Props help you avoid repeating the same field metadata across models.

## Use `plugin` To Declare Outputs

```ts
plugin "./schema-diagram.mjs" {
  output "./generated/schema.mmd"
}
```

The plugin key is the module to load. The block is the config passed to
that plugin.

Plugin paths can also come from installed packages:

```ts
plugin "stackpress-schema/transform" {
  output "./generated/schema.json"
}
```

## Use `use` To Split Large Schemas

```ts
use "./base.idea"
use "./billing.idea"
```

This lets you organize common types and shared model fragments across
multiple files.

You can also import schema files from installed packages:

```ts
use "stackpress/stackpress.idea"
```

## Use Attributes To Attach Meaning

Fields can carry metadata through attributes:

```ts
email String @required @field.email @db.varchar(255)
```

Models and types can carry metadata too:

```ts
model User @icon("user") {}

type Address @label("Address") {
  street String
}
```

The parser keeps those attributes. Plugins decide what most of them
mean.

## Understand Merging

When a schema uses another schema, the transformer merges parts of the
loaded child schema into the parent:

- `prop` and `enum` are soft-merged by name
- `type` and `model` can also merge by name
- local `model` and `type` definitions can extend imported ones
- `!` marks a local `model` or `type` as a replacement boundary

This behavior matters when you split schemas across files. See
[Split Schemas with `use`](https://github.com/stackpress/idea/blob/main/docs/how-to/split-schemas-with-use.md)
for the practical workflow.

## A Small Example

```ts
use "./shared.idea"

enum Role {
  ADMIN "ADMIN"
  USER "USER"
}

type Address {
  street String
  city String
}

model User {
  id String @id
  role Role
  address Address
}
```

This file composes shared definitions, introduces one enum and one type,
and declares a model that uses both.
