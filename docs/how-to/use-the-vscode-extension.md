# Use The VS Code Extension

The extension adds editor support for `.idea` files.

## What It Provides

- syntax highlighting
- formatting support
- auto-completion
- jump to definition
- diagnostics from the language server

## Install

Install the published extension from the VS Code Marketplace:

- [Idea Schema](https://marketplace.visualstudio.com/items?itemName=stackpress.idea-schema)

## Development Setup In This Repository

The extension lives in [language](https://github.com/stackpress/idea/blob/main/language).
It is not part of the root Yarn workspace.

From `language/`:

```bash
npm install
npm run compile
npm run lint
npm test
```

Idea requires Node.js 22 or newer for repository work.

## What The Extension Expects

- files ending in `.idea`
- workspace-local schemas and imports
- plugin packages that can be resolved from the project layout

## Related Docs

- [language/README.md](https://github.com/stackpress/idea/blob/main/language/README.md)
- [Getting Started](https://github.com/stackpress/idea/blob/main/docs/getting-started.md)
