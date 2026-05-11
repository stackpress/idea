# Write A Plugin

A plugin is a module that the transformer loads and calls with the
schema plus the plugin's config block.

## Start With A Minimal Plugin

`schema.idea`

```ts
plugin "./simple-form.mjs" {
  output "./generated/user-form.html"
}

model User {
  name String
  email String
  active Boolean
}
```

`simple-form.mjs`

```js
import fs from 'node:fs/promises';
import path from 'node:path';

function inputType(column) {
  if (column.type === 'Boolean') {
    return 'checkbox';
  }

  if (column.name.toLowerCase().includes('email')) {
    return 'email';
  }

  return 'text';
}

function labelFor(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default async function simpleForm({ config, schema, transformer }) {
  const output = await transformer.loader.absolute(config.output);
  const model = schema.model?.User;

  if (!model) {
    throw new Error('Expected a User model in the schema');
  }

  const lines = [
    '<form>',
    '  <fieldset>',
    '    <legend>User</legend>'
  ];

  for (const column of model.columns || []) {
    const type = inputType(column);
    const label = labelFor(column.name);

    if (type === 'checkbox') {
      lines.push(`    <label><input type="checkbox" name="${column.name}" /> ${label}</label>`);
      continue;
    }

    lines.push(`    <label for="${column.name}">${label}</label>`);
    lines.push(`    <input id="${column.name}" name="${column.name}" type="${type}" />`);
  }

  lines.push('  </fieldset>');
  lines.push('</form>');

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${lines.join('\n').trim()}\n`, 'utf8');
}
```

## What A Plugin Receives

Every plugin receives an object with these core properties:

- `config`: the plugin block from the schema
- `schema`: the loaded and merged schema
- `transformer`: the active transformer instance
- `cwd`: the transformer's current working directory

When the CLI runs the transform, plugins also receive `cli`.

## Resolve Output Paths Through The Transformer

Prefer `transformer.loader.absolute(config.output)` over hard-coded path
logic. That keeps output resolution aligned with the loader used by the
transformer.

## Read The Schema Conservatively

Not every schema will define every section. Guard access like this:

```js
const model = schema.model?.User;

if (!model) {
  return;
}
```

## Run The Plugin

```bash
npx idea transform --input schema.idea
```

## Common Mistakes

### Assuming A Default Export Is Optional

The transformer loads the plugin module and only calls it if the loaded
value is a function. Export a callable function as the module default.

### Writing Paths Relative To The Wrong Directory

Use the transformer loader for plugin output paths.

### Depending On Fields That Do Not Exist In Every Schema

Guard access to optional sections like `schema.enum`, `schema.type`, and
`schema.model`.

## Next

- [Run a Schema](https://github.com/stackpress/idea/blob/main/specs/how-to/run-a-schema.md)
- [Plugin API Reference](https://github.com/stackpress/idea/blob/main/specs/reference/plugin-api.md)
- [Examples](https://github.com/stackpress/idea/blob/main/specs/examples/README.md)
