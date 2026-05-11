<div align="center">
  <h1>💡 Idea</h1>
  <a href="https://www.npmjs.com/package/@stackpress/idea"><img src="https://img.shields.io/npm/v/@stackpress/idea.svg?style=flat" /></a>
  <a href="https://github.com/stackpress/idea/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat" /></a>
  <a href="https://github.com/stackpress/idea/commits/main/"><img src="https://img.shields.io/github/last-commit/stackpress/idea" /></a>
  <a href="https://github.com/stackpress/idea/actions"><img src="https://img.shields.io/github/actions/workflow/status/stackpress/idea/test.yml" /></a>
  <a href="https://coveralls.io/github/stackpress/idea?branch=main"><img src="https://coveralls.io/repos/github/stackpress/idea/badge.svg?branch=main" /></a>
  <a href="https://github.com/stackpress/idea/blob/main/docs/contribute.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <br />
  <br />
  <a href="https://github.com/stackpress/idea/blob/main/docs/getting-started.md">Form an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/stackpress/idea/blob/main/docs/examples/README.md">Transform an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://marketplace.visualstudio.com/items?itemName=stackpress.idea-schema">VSCode Extension</a>
  <br />
  <hr />
</div>

> A schema language to express and transform your ideas to reality. 

Idea is a schema file specification and a transformation toolchain. 
You describe models and metadata in a `.idea` file, then run plugins 
to generate code or other artifacts.

## Start Here

Use Idea when you want one schema file to drive more than one output.
Typical outputs include generated types, framework code, validation,
documentation, or project-specific artifacts produced by plugins.

Here is a small schema:

```text
model User {
  id String @id
  name String
  email String
}

model Post {
  id String @id
  title String
  authorId String
}
```

With a plugin, it can produce a schema diagram like this:

```mermaid
classDiagram
  class User {
    String id
    String name
    String email
  }

  class Post {
    String id
    String title
    String authorId
  }
}
```

Idea can turn a schema file into generated artifacts through plugins.

To build this example yourself, go to
[Getting Started](https://github.com/stackpress/idea/blob/main/docs/getting-started.md).

## Learn The Format

The format is intentionally permissive. The parser defines structure,
declarations, and data literals, while many field attributes are just
metadata interpreted by plugins.

Read these next:

- [Getting Started](https://github.com/stackpress/idea/blob/main/docs/getting-started.md)
- [Concepts Overview](https://github.com/stackpress/idea/blob/main/docs/concepts/overview.md)
- [The `.idea` File](https://github.com/stackpress/idea/blob/main/docs/concepts/the-idea-file.md)
- [Schema Building](https://github.com/stackpress/idea/blob/main/docs/concepts/schema-building.md)
- [Specification Reference](https://github.com/stackpress/idea/blob/main/docs/reference/specification.md)

## Common Tasks

- [Run a Schema](https://github.com/stackpress/idea/blob/main/docs/how-to/run-a-schema.md)
- [Split Schemas with `use`](https://github.com/stackpress/idea/blob/main/docs/how-to/split-schemas-with-use.md)
- [Write a Plugin](https://github.com/stackpress/idea/blob/main/docs/how-to/write-a-plugin.md)
- [Use the VS Code Extension](https://github.com/stackpress/idea/blob/main/docs/how-to/use-the-vscode-extension.md)

## Reference

- [CLI Reference](https://github.com/stackpress/idea/blob/main/docs/reference/cli.md)
- [Plugin API Reference](https://github.com/stackpress/idea/blob/main/docs/reference/plugin-api.md)
- [Parser API Docs](https://github.com/stackpress/idea/blob/main/docs/api/parser/README.md)
- [Transformer API Docs](https://github.com/stackpress/idea/blob/main/docs/api/transformer/README.md)
- [Examples](https://github.com/stackpress/idea/blob/main/docs/examples/README.md)

## Repository Map

- [packages/idea](https://github.com/stackpress/idea/blob/main/packages/idea/README.md) provides the CLI package.
- [packages/idea-parser](https://github.com/stackpress/idea/blob/main/packages/idea-parser/README.md) parses `.idea` files into AST and JSON-like schema output.
- [packages/idea-transformer](https://github.com/stackpress/idea/blob/main/packages/idea-transformer/README.md) loads schemas and runs plugins.
- [example](https://github.com/stackpress/idea/tree/main/example) contains a working sample schema and plugin.
- [language](https://github.com/stackpress/idea/tree/main/language) contains the VS Code extension.
