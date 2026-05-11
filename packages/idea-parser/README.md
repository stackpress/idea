# `@stackpress/idea-parser`

`@stackpress/idea-parser` parses `.idea` source into AST-like tokens and
schema objects.

Use it when you want to inspect or transform the format without running
plugins.

## Install

Idea requires Node.js 22 or newer.

```bash
npm install @stackpress/idea-parser
```

## Parse A Schema

```ts
import { parse, final } from '@stackpress/idea-parser';

const code = `
enum Role {
  ADMIN "ADMIN"
  USER "USER"
}

model User {
  id String @id
  role Role
}
`;

const schema = parse(code);
const normalized = final(code);
```

## `parse` Vs `final`

- `parse(code)` returns the compiled schema representation.
- `final(code)` returns the normalized final schema representation.

## Main Exports

- `parse`
- `final`
- `Compiler`
- `Lexer`
- `SchemaTree`
- tree classes and token types

## Learn More

- [Parser API Docs](https://github.com/stackpress/idea/blob/main/docs/api/parser/README.md)
- [Specification Reference](https://github.com/stackpress/idea/blob/main/docs/reference/specification.md)
