# Idea Schema VS Code Extension

This package provides editor support for `.idea` files.

## Features

- syntax highlighting
- formatting support
- auto-completion
- jump to definition
- diagnostics from the language server

## Install

Install the published extension from the marketplace:

- [Idea Schema](https://marketplace.visualstudio.com/items?itemName=stackpress.idea-schema)

## Repository Layout

- [client](https://github.com/stackpress/idea/tree/main/language/client) contains the VS Code extension client.
- [server](https://github.com/stackpress/idea/tree/main/language/server) contains the language server.
- [config](https://github.com/stackpress/idea/tree/main/language/config) contains language and grammar configuration.

## Local Development

The extension is managed separately from the root Yarn workspace.

From `language/`:

```bash
npm install
npm run compile
npm run lint
npm test
```

Idea repository work requires Node.js 22 or newer.

## Learn More

- [Root README](https://github.com/stackpress/idea/blob/main/README.md)
- [Use the VS Code Extension](https://github.com/stackpress/idea/blob/main/specs/how-to/use-the-vscode-extension.md)
