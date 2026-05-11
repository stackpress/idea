# `@stackpress/idea-transformer`

`@stackpress/idea-transformer` loads `.idea` schemas and executes their
configured plugins.

Use it when you want programmatic access to the runtime behind the Idea
CLI.

## Install

Idea requires Node.js 22 or newer.

```bash
npm install @stackpress/idea-transformer
```

## Load A Schema

```ts
import { Transformer } from '@stackpress/idea-transformer';

const transformer = await Transformer.load('./schema.idea');
const schema = await transformer.schema();
await transformer.transform();
```

## Custom CLI

```ts
#!/usr/bin/env node
import { Terminal } from '@stackpress/idea-transformer';

const terminal = await Terminal.load(process.argv.slice(2));
await terminal.run();
```

## Plugin Contract

Plugins receive:

- `config`
- `schema`
- `transformer`
- `cwd`

When started through the CLI, plugins also receive `cli`.

## Learn More

- [Write a Plugin](https://github.com/stackpress/idea/blob/main/specs/how-to/write-a-plugin.md)
- [Plugin API Reference](https://github.com/stackpress/idea/blob/main/specs/reference/plugin-api.md)
- [Transformer API Docs](https://github.com/stackpress/idea/blob/main/specs/api/transformer/README.md)
