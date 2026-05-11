# `@stackpress/idea`

`@stackpress/idea` is the CLI package for the Idea toolchain.

It wraps `@stackpress/idea-transformer` so you can run plugin-driven
schema generation from the command line.

## Install

Idea requires Node.js 22 or newer.

```bash
npm i -D @stackpress/idea
```

## Example

Create `schema.idea`:

```ts
plugin "./schema-diagram.mjs" {
  output "./generated/schema.mmd"
}

model User {
  id String @id
  name String
  email String
}
```

Run:

```bash
npx idea transform --input schema.idea
```

## Learn More

- [Root README](https://github.com/stackpress/idea/blob/main/README.md)
- [Getting Started](https://github.com/stackpress/idea/blob/main/docs/getting-started.md)
- [CLI Reference](https://github.com/stackpress/idea/blob/main/docs/reference/cli.md)
