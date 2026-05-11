# AGENTS.md

## Purpose

This repository contains the `@stackpress/idea` toolchain:

- `packages/idea-parser`: parses `.idea` schemas into AST/JSON output
- `packages/idea-transformer`: loads schemas and runs plugins
- `packages/idea`: top-level CLI package
- `example`: small workspace used to exercise the toolchain
- `language`: VS Code extension for `.idea` files

## Working Areas

Primary source lives in:

- `packages/*/src`
- `packages/idea-parser/tests`
- `packages/idea-transformer/tests`
- `language/client/src`
- `language/server/src`
- `docs/`

Generated build output lives in package `cjs/` and `esm/` directories.
Do not edit generated files by hand unless the task is explicitly about
build artifacts or release packaging.

## Tooling

Use Node.js `>=22`.

Before running install, build, lint, or test commands:

```bash
node -v
```

If the active version is below Node 22, try `nvm` first:

```bash
command -v nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 22
node -v
```

If Node 22+ still cannot be resolved, stop and ask the user for the
correct `nvm` location or required Node binary path.

Root dependencies are managed with `yarn`.

Common root commands:

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

The `language/` extension is not part of the root Yarn workspace. Manage
it from inside `language/`:

```bash
cd language && npm install
cd language && npm run compile
cd language && npm run lint
cd language && npm test
```

## Editing Guidance

- Prefer changes in `src/` and tests first, then rebuild only the
  affected package if needed.
- Keep parser and transformer changes covered by tests in their
  respective `tests/` directories.
- When changing package exports or CLI behavior, verify the relevant
  `package.json` entries still match emitted output.
- The root workspace includes `packages/*` and `example`; `language` is
  separate and does not share the root workspace `node_modules`.
- Do not run installs or validation on Node versions below 22.

## Documentation Guidance

Check existing docs before adding new conventions:

- `README.md`: landing page
- `docs/getting-started.md`: tutorial
- `docs/concepts/`: explanation
- `docs/how-to/`: task guides
- `docs/reference/`: lookup docs
- `docs/examples/`: longer example tutorials
- package-level `README.md` files: package-specific entry docs

When updating docs:

- keep the README lightweight
- put step-by-step workflow in `docs/getting-started.md`
- keep concept, how-to, and reference content separate
- prefer repo-backed examples over invented ecosystem claims

## Validation Expectations

- Parser changes: run `yarn test:parser`
- Transformer changes: run `yarn test:transformer`
- Cross-package runtime changes: run `yarn test` and targeted builds as
  needed
- Extension changes under `language`: ensure `npm install` has been run
  there, then run the relevant `compile`, `lint`, or `test` command

## Notes For Agents

- Use `rg` for code search.
- Keep changes scoped; most tasks should touch only one area.
