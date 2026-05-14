# AGENTS.md

## Scope

This repo contains the `@stackpress/idea` toolchain:

- `packages/idea-parser`: parses `.idea` files into AST/schema output
- `packages/idea-transformer`: loads schemas and runs plugins
- `packages/idea`: CLI package
- `example`: sample workspace
- `language`: VS Code extension

## Source Of Truth

Edit source, not generated output:

- runtime/package source: `packages/*/src`
- parser tests: `packages/idea-parser/tests`
- transformer tests: `packages/idea-transformer/tests`
- extension source: `language/client/src`, `language/server/src`
- docs source: `specs/`
- docs site templates: `scripts/templates/`

Generated output to avoid editing by hand:

- package builds: `packages/*/cjs`, `packages/*/esm`
- published docs site: `docs/`

The docs site is published at [stackpress.io/idea](https://www.stackpress.io/idea/).

## Tooling

Use Node.js `>=22` for work in this package.

Before running Node-based commands, verify that the selected `node` binary is version `22` or higher.

Use this lookup order:

1. Check whether `nvm` is installed.
2. If `nvm` is installed, try to locate the NVM versions directory and prefer a Node `22+` binary from there.
3. If the NVM directory cannot be located directly, try to use `nvm` itself to select or inspect a Node `22+` install.
4. If `nvm` cannot be used, look for `node` in common OS-specific install paths.
5. If common install paths do not contain Node `22+`, inspect environment variables such as `PATH`, `NVM_DIR`, and other Node-related environment variables.
6. If Node `22+` still cannot be found, stop and ask the user for the Node binary location before proceeding.

Do not assume that the default `node` on `PATH` satisfies this requirement.

Root dependencies use `yarn`.

Common commands:

```bash
yarn build
yarn test
yarn test:parser
yarn test:transformer
yarn transform
yarn build:docs
```

Package-specific:

```bash
yarn --cwd packages/idea-parser build
yarn --cwd packages/idea-parser test
yarn --cwd packages/idea-transformer build
yarn --cwd packages/idea-transformer test
yarn --cwd packages/idea build
yarn --cwd example build
```

The `language/` extension is not part of the root workspace:

```bash
cd language && npm install
cd language && npm run compile
cd language && npm run lint
cd language && npm test
```

## Docs Workflow

Docs authoring and publishing are separate:

- author Markdown in `specs/`
- edit page/layout styles in `scripts/templates/`
- regenerate the static site into `docs/` with `yarn build:docs`

Keep `README.md` lightweight. Put long-form docs in `specs/`.

## Validation

- parser changes: `yarn test:parser`
- transformer changes: `yarn test:transformer`
- cross-package runtime changes: `yarn test`
- docs generator/templates: `yarn build:docs`
- extension changes: run the relevant `language` compile/lint/test command

## Agent Notes

- Use `rg` for search.
- Keep changes scoped.
- Prefer changing one area end-to-end instead of mixing unrelated edits.
