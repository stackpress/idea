# Plugin API Reference

This page summarizes the runtime contract a plugin can rely on.

## Minimal Shape

A plugin is a module whose default export is a function.

```js
export default async function myPlugin(props) {
  // ...
}
```

## Core Properties

Plugins receive these core properties:

- `config`: plugin config from the schema
- `schema`: loaded and merged schema object
- `transformer`: active `Transformer` instance
- `cwd`: current working directory used by the transformer

When the transform is started from the CLI, plugins also receive:

- `cli`: active terminal instance

## `config`

`config` is the object declared in the plugin block:

```ts
plugin "./my-plugin.mjs" {
  output "./generated/file.ts"
}
```

In the plugin:

```js
export default async function myPlugin({ config }) {
  console.log(config.output);
}
```

The plugin path itself can be relative or package-based:

```ts
plugin "stackpress-schema/transform" {
  output "./generated/schema.json"
}
```

## `schema`

`schema` is the parsed schema after composition through `use`.

Common sections include:

- `prop`
- `enum`
- `type`
- `model`
- `plugin`

Treat each section as optional unless your plugin enforces a stricter
contract.

## `transformer`

The transformer exposes the active loader and schema-loading workflow.

The most useful property in plugins is usually `transformer.loader`.

Example:

```js
const output = await transformer.loader.absolute(config.output);
```

## `cwd`

`cwd` is the current working directory associated with the transformer.

## `cli`

When the CLI runs a transform, the plugin also receives the terminal
instance as `cli`. That lets plugins inspect CLI context if they need to
do so.

## Recommended Pattern

```js
import fs from 'node:fs/promises';
import path from 'node:path';

export default async function myPlugin({ config, schema, transformer }) {
  const output = await transformer.loader.absolute(config.output);
  const content = JSON.stringify(schema, null, 2);

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${content}\n`, 'utf8');
}
```

## Related Docs

- [Write a Plugin](https://github.com/stackpress/idea/blob/main/specs/how-to/write-a-plugin.md)
- [Transformer API Docs](https://github.com/stackpress/idea/blob/main/specs/api/transformer/README.md)
