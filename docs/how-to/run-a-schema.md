# Run A Schema

This guide shows the normal CLI workflow.

## Use The Default File Name

If your schema file is named `schema.idea`, run:

```bash
npx idea transform
```

The CLI defaults to `schema.idea` in the current working directory.

## Use A Specific File

If your schema file has a different name or location, pass `--input`:

```bash
npx idea transform --input ./schemas/admin.idea
```

The short flag also works:

```bash
npx idea transform -i ./schemas/admin.idea
```

## What The CLI Does

Running `transform` will:

1. resolve the input path
2. parse the schema file
3. resolve any `use` references
4. resolve each plugin module
5. call each plugin with the loaded schema

## Common Failures

### Input File Does Not Exist

Make sure the path passed to `--input` exists.

### No Plugins Defined

`transform` expects at least one `plugin` declaration in the schema.

### Plugin Module Cannot Be Resolved

Make sure the plugin path is valid relative to the current working
directory and that the file extension can be resolved.

The transformer will try common JavaScript and TypeScript extensions
when loading plugin modules.

## Related Docs

- [Getting Started](https://github.com/stackpress/idea/blob/main/docs/getting-started.md)
- [CLI Reference](https://github.com/stackpress/idea/blob/main/docs/reference/cli.md)
- [Write a Plugin](https://github.com/stackpress/idea/blob/main/docs/how-to/write-a-plugin.md)
