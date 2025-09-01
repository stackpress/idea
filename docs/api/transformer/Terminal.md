# Terminal

## 1. Terminal

A command-line interface for processing schema files and executing transformations through terminal commands.

```typescript
import Terminal from '@stackpress/idea-transformer/Terminal';

const terminal = await Terminal.load(['transform', '--input', './schema.idea']);
await terminal.run();
```

### 1.1. Overview

The `Terminal` class (exported as `IdeaTerminal`) extends the base Terminal class from `@stackpress/lib` to provide command-line functionality for the idea-transformer library. It handles:

- Command-line argument parsing
- Schema file transformation via CLI commands
- Integration with the Transformer class for processing
- Configurable working directories and file extensions

### 1.2. Static Methods

The following methods can be accessed directly from the Terminal class.

#### 1.2.1. Loading a Terminal Instance

The following example shows how to create a new Terminal instance from command-line arguments.

```typescript
import Terminal from '@stackpress/idea-transformer/Terminal';

// Load with command-line arguments
const args = ['transform', '--input', './schema.idea'];
const terminal = await Terminal.load(args);

// Load with custom options
const terminal = await Terminal.load(args, {
  cwd: '/custom/working/directory',
  extname: '.schema',
  brand: '[MY-TOOL]'
});
```

**Parameters**

| Parameter | Type | Description |
|----------|------|-------------|
| `args` | `string[]` | Command-line arguments array |
| `options` | `TerminalOptions` | Optional configuration for terminal behavior |

**Returns**

A promise that resolves to a new Terminal instance configured with the specified arguments and options.

### 1.3. Properties

The following properties are available when instantiating a Terminal.

| Property | Type | Description |
|----------|------|-------------|
| `cwd` | `string` | Current working directory for file operations |
| `extname` | `string` | Default file extension for schema files (default: '.idea') |

### 1.4. Methods

The following methods are available when instantiating a Terminal.

#### 1.4.1. Running Terminal Commands

The Terminal automatically sets up event handlers for processing commands. The main command supported is `transform`.

```typescript
const terminal = await Terminal.load(['transform', '--input', './schema.idea']);
await terminal.run();
```

**Command Structure**

The terminal expects commands in the following format:
```bash
transform --input <schema-file> [--i <schema-file>]
```

**Flags**

| Flag | Alias | Description |
|------|-------|-------------|
| `--input` | `--i` | Path to the schema file to process |

## 2. Usage Examples

### 2.1. Basic Command Execution

```typescript
import Terminal from '@stackpress/idea-transformer/Terminal';

// Process a schema file
const args = ['transform', '--input', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();
```

### 2.2. Using Short Flag Syntax

```typescript
// Using the short flag alias
const args = ['transform', '--i', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();
```

### 2.3. Custom Working Directory

```typescript
// Set custom working directory
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: '/path/to/project'
});
await terminal.run();
```

### 2.4. Custom File Extension

```typescript
// Use custom file extension
const terminal = await Terminal.load(['transform', '--i', './schema.custom'], {
  extname: '.custom'
});
await terminal.run();
```

### 2.5. Custom Brand/Label

```typescript
// Use custom terminal brand
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  brand: '[MY-SCHEMA-TOOL]'
});
await terminal.run();
```

## 3. Command-Line Integration

### 3.1. Direct Command-Line Usage

```bash
## Basic usage
node cli.js transform --input ./schema.idea

## Using short flag
node cli.js transform --i ./schema.idea

## With custom working directory
cd /path/to/project && node cli.js transform --i ./schema.idea
```

### 3.2. CLI Script Example

```typescript
#!/usr/bin/env node
import Terminal from '@stackpress/idea-transformer/Terminal';

async function main() {
  try {
    const args = process.argv.slice(2);
    const terminal = await Terminal.load(args, {
      cwd: process.cwd(),
      brand: '[SCHEMA-CLI]'
    });
    await terminal.run();
  } catch (error) {
    console.error('CLI Error:', error.message);
    process.exit(1);
  }
}

main();
```

### 3.3. Package.json Integration

```json
{
  "name": "my-schema-tool",
  "bin": {
    "schema": "./cli.js"
  },
  "scripts": {
    "build": "schema transform --i ./schema.idea",
    "dev": "schema transform --i ./dev-schema.idea"
  }
}
```

## 4. Default Behavior

### 4.1. File Path Resolution

When no input file is specified, the terminal uses a default path:

```typescript
// Default file path construction
const defaultPath = `${terminal.cwd}/schema${terminal.extname}`;
// Example: "/current/directory/schema.idea"
```

### 4.2. Flag Processing

The terminal processes the following flags in order of preference:

1. `--input` (full flag name)
2. `--i` (short alias)
3. Default file path if no flags provided

```typescript
// These are equivalent:
['transform', '--input', './schema.idea']
['transform', '--i', './schema.idea']

// Uses default path: ./schema.idea
['transform']
```

## 5. Error Handling

### 5.1. Missing Schema File

```typescript
try {
  const terminal = await Terminal.load(['transform', '--i', './nonexistent.idea']);
  await terminal.run();
} catch (error) {
  console.error('File not found:', error.message);
}
```

### 5.2. Invalid Command

```typescript
try {
  const terminal = await Terminal.load(['invalid-command']);
  await terminal.run();
} catch (error) {
  console.error('Unknown command:', error.message);
}
```

### 5.3. Plugin Errors

```typescript
// If plugins fail during transformation
try {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
} catch (error) {
  console.error('Transformation failed:', error.message);
}
```

## 6. Advanced Usage

### 6.1. Custom Event Handlers

```typescript
import Terminal from '@stackpress/idea-transformer/Terminal';

const terminal = await Terminal.load(['transform', '--i', './schema.idea']);

// Add custom event handler
terminal.on('custom-command', async (event) => {
  console.log('Custom command executed');
  // Custom logic here
});

await terminal.run();
```

### 6.2. Programmatic CLI Building

```typescript
// Build CLI arguments programmatically
function buildCLIArgs(schemaFile: string, options: any = {}) {
  const args = ['transform'];
  
  if (schemaFile) {
    args.push('--input', schemaFile);
  }
  
  return args;
}

const args = buildCLIArgs('./my-schema.idea');
const terminal = await Terminal.load(args);
await terminal.run();
```

### 6.3. Batch Processing

```typescript
import { glob } from 'glob';

async function processAllSchemas(pattern: string) {
  const schemaFiles = await glob(pattern);
  
  for (const schemaFile of schemaFiles) {
    console.log(`Processing ${schemaFile}...`);
    
    const terminal = await Terminal.load(['transform', '--i', schemaFile]);
    await terminal.run();
    
    console.log(`Completed ${schemaFile}`);
  }
}

// Process all .idea files in a directory
await processAllSchemas('./schemas/**/*.idea');
```

### 6.4. Environment-Based Configuration

```typescript
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.env.SCHEMA_CWD || process.cwd(),
  extname: process.env.SCHEMA_EXT || '.idea',
  brand: process.env.CLI_BRAND || '[IDEA]'
});

await terminal.run();
```

## 7. Integration with Build Tools

### 7.1. Webpack Plugin

```typescript
class SchemaTransformPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  
  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('SchemaTransformPlugin', async (params, callback) => {
      try {
        const terminal = await Terminal.load(['transform', '--i', this.options.schemaFile]);
        await terminal.run();
        callback();
      } catch (error) {
        callback(error);
      }
    });
  }
}
```

### 7.2. Gulp Task

```typescript
import gulp from 'gulp';
import Terminal from '@stackpress/idea-transformer/Terminal';

gulp.task('transform-schema', async () => {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
});
```

### 7.3. NPM Scripts

```json
{
  "scripts": {
    "schema:build": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './schema.idea']))\"",
    "schema:dev": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './dev-schema.idea']))\"",
    "schema:watch": "nodemon --watch schema.idea --exec \"npm run schema:build\""
  }
}
```

## 8. Testing

### 8.1. Unit Testing

```typescript
import { expect } from 'chai';
import Terminal from '@stackpress/idea-transformer/Terminal';

describe('Terminal Tests', () => {
  it('should process schema file', async () => {
    const terminal = await Terminal.load(['transform', '--i', './test-schema.idea'], {
      cwd: './test-fixtures'
    });
    
    expect(terminal.cwd).to.include('test-fixtures');
    
    // Run the terminal command
    await terminal.run();
    
    // Verify output files were created
    // ... assertions here
  });
  
  it('should use default options', async () => {
    const terminal = await Terminal.load(['transform']);
    
    expect(terminal.extname).to.equal('.idea');
    expect(terminal.cwd).to.be.a('string');
  });
});
```

### 8.2. Integration Testing

```typescript
import fs from 'fs';
import path from 'path';

describe('Terminal Integration', () => {
  it('should generate expected output files', async () => {
    const outputDir = './test-output';
    const schemaFile = './test-schema.idea';
    
    // Clean output directory
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    
    // Run transformation
    const terminal = await Terminal.load(['transform', '--i', schemaFile]);
    await terminal.run();
    
    // Verify expected files were created
    const expectedFiles = ['types.ts', 'enums.ts', 'models.ts'];
    for (const file of expectedFiles) {
      const filePath = path.join(outputDir, file);
      expect(fs.existsSync(filePath)).to.be.true;
    }
  });
});
```

## 9. Best Practices

### 9.1. Error Handling

```typescript
// Always wrap terminal execution in try-catch
async function safeTransform(schemaFile: string) {
  try {
    const terminal = await Terminal.load(['transform', '--i', schemaFile]);
    await terminal.run();
    console.log(`✅ Successfully processed ${schemaFile}`);
  } catch (error) {
    console.error(`❌ Failed to process ${schemaFile}:`, error.message);
    throw error;
  }
}
```

### 9.2. Configuration Management

```typescript
// Use configuration objects for reusable settings
const defaultConfig = {
  cwd: process.cwd(),
  extname: '.idea',
  brand: '[SCHEMA-TOOL]'
};

async function createTerminal(args: string[], config = defaultConfig) {
  return await Terminal.load(args, config);
}
```

### 9.3. Logging and Debugging

```typescript
// Add logging for better debugging
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.cwd()
});

console.log(`Working directory: ${terminal.cwd}`);
console.log(`File extension: ${terminal.extname}`);

await terminal.run();
```
