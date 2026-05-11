# CLI Reference

The CLI is provided by `@stackpress/idea`.

## Command

```bash
idea transform
```

## Input Selection

Default input:

```bash
idea transform
```

This resolves to `schema.idea` in the current working directory.

Explicit input:

```bash
idea transform --input ./schemas/admin.idea
```

Short flag:

```bash
idea transform -i ./schemas/admin.idea
```

## Behavior

`transform` will:

1. resolve the input file
2. load the schema
3. resolve `use` references
4. resolve plugin modules
5. execute each plugin

## Notes

- The CLI uses `.idea` as the default schema extension.
- Plugin execution happens through `@stackpress/idea-transformer`.
- If the schema has no `plugin` declarations, transform fails.
- Plugin module paths can be relative files or installed packages.

## Examples

```bash
npx idea transform
```

```bash
npx idea transform --input ./schema.idea
```

## Related Docs

- [Run a Schema](https://github.com/stackpress/idea/blob/main/docs/how-to/run-a-schema.md)
- [Plugin API Reference](https://github.com/stackpress/idea/blob/main/docs/reference/plugin-api.md)
