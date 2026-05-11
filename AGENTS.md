# AGENTS.md

## Purpose

This repository contains the `@stackpress/idea` toolchain:

- `packages/idea-parser`: parses `.idea` schemas into AST/JSON output.
- `packages/idea-transformer`: runs transformers/plugins against parsed schemas.
- `packages/idea`: top-level CLI package that wires parser + transformer together.
- `example`: small workspace used to exercise the toolchain.
- `language`: VS Code language extension for `.idea` files.

## Working Areas

Primary source files live under:

- `packages/*/src`
- `packages/idea-parser/tests`
- `packages/idea-transformer/tests`
- `language/client/src`
- `language/server/src`

Generated build output lives under package `cjs/` and `esm/` directories. Do not edit generated files by hand unless the task is explicitly about build artifacts or release packaging.

## Install And Tooling

Use Node.js `>=22` for work in this repository.

Before running install, build, lint, or test commands, check the active Node version:

```bash
node -v
```

If the active version is below Node 22, try `nvm` first. Prefer resolving `nvm` from the current shell environment, then from the standard user install location.

Example flow:

```bash
command -v nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 22
node -v
```

If Node 22+ still cannot be resolved, stop and ask the user for the correct `nvm` location or the project’s required Node binary path before continuing.

Root dependencies are managed with `yarn`.

Common commands from the repository root:

```bash
yarn build
yarn test
yarn test:parser
yarn test:transformer
yarn transform
```

Package-specific commands:

```bash
yarn --cwd packages/idea-parser build
yarn --cwd packages/idea-parser test
yarn --cwd packages/idea-transformer build
yarn --cwd packages/idea-transformer test
yarn --cwd packages/idea build
yarn --cwd example build
```

The `language/` extension is not part of the root Yarn workspace. Install its dependencies from inside `language/`, and expect it to maintain its own `node_modules`.

Language extension commands:

```bash
cd language && npm install
cd language && npm run compile
cd language && npm run lint
cd language && npm test
```

## Editing Guidance

- Prefer changes in `src/` and tests first, then rebuild only the affected package if needed.
- Keep parser and transformer changes covered by tests in their respective `tests/` directories.
- When changing package exports or CLI behavior, verify the corresponding `package.json` entries still line up with emitted output.
- The root workspace lists `packages/*` and `example`; `language` is managed separately and does not share the root workspace `node_modules`.
- Do not proceed with package installs or validation on Node versions below 22.

## Validation Expectations

- For parser changes, run `yarn test:parser`.
- For transformer changes, run `yarn test:transformer`.
- For cross-package runtime changes, run `yarn test` and any targeted build commands needed to confirm emitted `cjs/`/`esm/` output is still valid.
- For extension changes under `language`, make sure `npm install` has been run in `language/`, then run the relevant `compile`, `lint`, or `test` command there.

## Notes For Agents

- Use `rg` for code search.
- Keep changes scoped; this repo contains multiple related packages but most tasks should touch only one area.
- Check for existing docs in `README.md`, `docs/`, and package-level READMEs before adding new conventions.
