# AGENTS

## Workspace Summary

- `packages/idea-rust`
  - Canonical parser implementation in Rust.
  - Node native binding crate lives under `crates/idea_parser_node`.
- `packages/idea-node`
  - Main Node package.
  - Owns the TypeScript API, transformer, terminal, CLI, and native loader boundary.
  - Supports both ESM and CJS build outputs.
- `packages/idea-node-*`
  - Platform-specific native binary packages for npm distribution.
  - These are publishable package directories, but they are intentionally not
    part of the active Yarn workspaces list because Yarn v1 will try to install
    incompatible targets on the local host.
- `language`
  - Intentionally not part of the Yarn workspace.

## idea-node Rules

- Public TypeScript source lives in `packages/idea-node/src`.
- The root native loader boundary lives outside `src`.
  - Keep `loader.cjs` tracked.
  - Keep `loader.d.cts` tracked.
- `Parser` should not own platform probing logic.
  - `Parser` wraps native calls and normalizes errors.
  - Native binary resolution belongs in the root loader.
- Prefer keeping the top-level API in `src/index.ts` aligned with:
  - `tokenize()`
  - `parse()`
  - `parseAst()`
  - `final()`
  - `Parser`
  - `Transformer`
  - `Terminal`

## Build Artifacts

- Do not commit generated root `napi` stubs.
- Ignore these generated files in `packages/idea-node`:
  - `index.js`
  - `index.d.ts`
  - `loader.js`
- The tracked root files should be:
  - `loader.cjs`
  - `loader.d.cts`
- Root `.node` binaries in `packages/idea-node` are treated as local build
  artifacts that get mirrored into the matching platform package.

## Coverage Notes

- JS coverage currently counts the root CommonJS loader if it is included in the test run.
- Rust coverage is generated separately with `cargo llvm-cov`.
- `loader.cjs` is intentionally excluded from JS coverage.

## Native Packaging

- `packages/idea-node` is the wrapper package that consumers install.
- Platform binaries are distributed through optional dependencies such as:
  - `idea-node-darwin-arm64`
  - `idea-node-linux-x64-gnu`
  - `idea-node-win32-x64-msvc`
- In repo development, `packages/idea-node/package.json` uses local `file:`
  optional dependencies so the loader fallback can be tested before publishing.
- Before publishing to npm, those `file:` optional dependencies should be
  rewritten to versioned package references.

## Native Build Flow

- Current host build:
  - `yarn --cwd packages/idea-node build`
  - This runs:
    - `build:native`
    - `sync:platform-package`
    - TypeScript builds for `cjs` and `esm`
    - package metadata generation for `cjs/package.json` and `esm/package.json`
- `build:native` uses:
  - `napi build --platform --cargo-cwd ../idea-rust/crates/idea_parser_node`
- `sync:platform-package` mirrors any locally built root binary from
  `packages/idea-node` into the matching `packages/idea-node-*` directory.

## Cross-Platform Binary Builds

- Building every OS package from one machine is not realistic for all targets.
- The practical model is one build job per target environment:
  - macOS arm64 builds `idea_node.darwin-arm64.node`
  - macOS x64 builds `idea_node.darwin-x64.node`
  - Linux x64 glibc builds `idea_node.linux-x64-gnu.node`
  - Linux x64 musl builds `idea_node.linux-x64-musl.node`
  - Windows x64 MSVC builds `idea_node.win32-x64-msvc.node`
  - and so on
- For each target job:
  - run `yarn --cwd packages/idea-node build`
  - collect the generated `.node` file
  - place or publish it in the matching `packages/idea-node-*` package
- The in-repo sync script only mirrors binaries that were actually built on the
  current machine; it does not cross-compile unsupported targets by itself.

## Style Notes

- TypeScript should follow the repo style guide shared in chat:
  - 2-space indentation
  - single quotes
  - semicolons
  - separate type imports from runtime imports
  - JSDoc for public members
  - comments explain why, not what
  - export ordering:
    - types
    - constants
    - functions
    - classes
    - default export last
