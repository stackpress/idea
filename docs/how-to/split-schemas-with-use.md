# Split Schemas With `use`

Use `use` when your schema grows beyond one file or when you want to
share common definitions.

## Basic Example

`shared.idea`

```ts
enum Role {
  ADMIN "ADMIN"
  USER "USER"
}

type Address {
  street String
  city String
}
```

`schema.idea`

```ts
use "./shared.idea"

model User {
  id String @id
  role Role
  address Address
}
```

When the transformer loads `schema.idea`, it also loads `shared.idea`
and merges its schema data into the current schema.

## Extend An Imported Model Or Type

You can import a definition and add more fields to it locally:

```ts
use "./User.idea"

model User {
  middleName String? @label("Middle Name")
}
```

This is a useful pattern when you want a base schema in one file and
project-specific additions in another.

## Replace An Imported Model Or Type

You can also mark a local definition with `!` to replace the imported
version instead of extending it:

```ts
use "./Article.idea"

model Article! {
  title String @field.input({ type "text" })
}
```

The same pattern applies to `type`.

## Import From Packages

`use` does not have to point only at relative files. It can also resolve
schema files from installed packages:

```ts
use "stackpress/stackpress.idea"
```

That makes shared schema packages possible in the same way shared code
packages are possible.

## What Merges

The transformer merges these sections by name:

- `prop`
- `enum`
- `type`
- `model`

`prop` and `enum` are soft-merged as objects.

`type` and `model` use merge logic that respects mutability. A mutable
parent type or model can absorb child columns instead of being fully
replaced.

## Practical Guidance

- keep shared enums and props in common files
- move large reusable structures into `type`
- use `use` for composition, not for hidden side effects
- keep plugin declarations in the schema that actually owns generation
- prefer package imports when a shared schema is reused across projects

## Troubleshooting

If a referenced file does not load:

- check the path
- check the current working directory
- verify the imported file parses on its own

If a merged model or type does not look right:

- check for duplicate names
- check whether the parent definition is intended to be mutable
- inspect the loaded schema in parser or transformer tests

## Related Docs

- [Schema Building](https://github.com/stackpress/idea/blob/main/docs/concepts/schema-building.md)
- [Plugin API Reference](https://github.com/stackpress/idea/blob/main/docs/reference/plugin-api.md)
