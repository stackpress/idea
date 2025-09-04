# Terminal

A command-line interface for processing schema files and executing transformations through terminal commands. The Terminal class provides a comprehensive CLI interface for the idea-transformer library, enabling developers to process schema files and execute transformations from the command line.

```typescript
import Terminal from '@stackpress/idea-transformer/Terminal';

const terminal = await Terminal.load(['transform', '--input', './schema.idea']);
await terminal.run();
```

 1. [Overview](#1-overview)
 2. [Loading a Terminal Instance](#2-loading-a-terminal-instance)
 3. [Properties](#3-properties)
 4. [Running Terminal Commands](#4-running-terminal-commands)
 5. [Usage Examples](#5-usage-examples)
 6. [Command-Line Integration](#6-command-line-integration)
 7. [Default Behavior](#7-default-behavior)
 8. [Error Handling](#8-error-handling)
 9. [Advanced Usage](#9-advanced-usage)
 10. [Integration with Build Tools](#10-integration-with-build-tools)
 11. [Testing](#11-testing)
 12. [Best Practices](#12-best-practices)

## 1. Overview

The Terminal class provides a command-line interface for processing schema files and executing transformations. This section outlines the core capabilities and features of the Terminal class, which extends the base Terminal functionality to provide schema-specific command-line operations.

The `Terminal` class (exported as `IdeaTerminal`) extends the base Terminal class from `@stackpress/lib` to provide command-line functionality for the idea-transformer library. It handles:

- Command-line argument parsing
- Schema file transformation via CLI commands
- Integration with the Transformer class for processing
- Configurable working directories and file extensions

## 2. Loading a Terminal Instance

The load method creates a new Terminal instance from command-line arguments and optional configuration. This is the primary way to create a terminal instance for processing schema files from the command line.

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

## 3. Properties

The properties section describes the instance variables available on Terminal objects. These properties provide access to configuration details and runtime information needed for command-line operations.

**Properties**

The following properties are available when instantiating a Terminal.

| Property | Type | Description |
|----------|------|-------------|
| `cwd` | `string` | Current working directory for file operations |
| `extname` | `string` | Default file extension for schema files (default: '.idea') |

## 4. Running Terminal Commands

The run method executes the configured terminal command and processes the specified schema file. This method handles the complete workflow from command parsing to schema transformation execution.

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

## 5. Usage Examples

This section provides practical examples of how to use the Terminal class in various scenarios. These examples demonstrate common patterns and use cases for command-line schema processing.

### 5.1. Basic Command Execution

Basic command execution demonstrates the fundamental workflow for processing schema files through the Terminal interface. This example shows the simplest way to transform a schema file using command-line arguments.

```typescript
import Terminal from '@stackpress/idea-transformer/Terminal';

// Process a schema file
const args = ['transform', '--input', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();
```

### 5.2. Using Short Flag Syntax

Short flag syntax provides convenient aliases for common command-line options. This example shows how to use abbreviated flags to make command-line usage more efficient.

```typescript
// Using the short flag alias
const args = ['transform', '--i', './schema.idea'];
const terminal = await Terminal.load(args);
await terminal.run();
```

### 5.3. Custom Working Directory

Custom working directory configuration allows you to specify where the Terminal should operate. This is useful when processing schema files from different locations or when integrating with build systems.

```typescript
// Set custom working directory
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: '/path/to/project'
});
await terminal.run();
```

### 5.4. Custom File Extension

Custom file extension support enables the Terminal to work with schema files that use non-standard extensions. This flexibility allows integration with different naming conventions and file organization strategies.

```typescript
// Use custom file extension
const terminal = await Terminal.load(['transform', '--i', './schema.custom'], {
  extname: '.custom'
});
await terminal.run();
```

### 5.5. Custom Brand/Label

Custom brand configuration allows you to customize the Terminal's display name and branding. This is useful when building custom CLI tools based on the idea-transformer library.

```typescript
// Use custom terminal brand
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  brand: '[MY-SCHEMA-TOOL]'
});
await terminal.run();
```

## 6. Command-Line Integration

This section demonstrates how to integrate the Terminal class with actual command-line environments and build systems. These examples show practical applications for creating CLI tools and automating schema processing.

### 6.1. Direct Command-Line Usage

Direct command-line usage shows how to invoke the Terminal functionality from shell commands. This section provides examples of the actual command syntax and available options.

```bash
## Basic usage
node cli.js transform --input ./schema.idea

## Using short flag
node cli.js transform --i ./schema.idea

## With custom working directory
cd /path/to/project && node cli.js transform --i ./schema.idea
```

### 6.2. CLI Script Example

CLI script examples demonstrate how to create executable scripts that use the Terminal class. This pattern is useful for creating standalone CLI tools and integrating with package managers.

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

### 6.3. Package.json Integration

Package.json integration shows how to configure npm scripts and binary commands using the Terminal class. This enables seamless integration with Node.js project workflows and package distribution.

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

## 7. Default Behavior

This section explains the default behavior and conventions used by the Terminal class. Understanding these defaults helps developers predict how the Terminal will behave in different scenarios and configure it appropriately.

### 7.1. File Path Resolution

File path resolution describes how the Terminal determines which schema file to process when no explicit path is provided. This automatic resolution simplifies common use cases while maintaining flexibility.

When no input file is specified, the terminal uses a default path:

```typescript
// Default file path construction
const defaultPath = `${terminal.cwd}/schema${terminal.extname}`;
// Example: "/current/directory/schema.idea"
```

### 7.2. Flag Processing

Flag processing explains how the Terminal parses and prioritizes command-line flags. Understanding this order of precedence helps developers use the most appropriate flag syntax for their needs.

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

## 8. Error Handling

This section covers common error conditions that can occur when using the Terminal class. Understanding these error scenarios helps developers implement proper error handling and provide better user experiences.

### 8.1. Missing Schema File

Missing schema file errors occur when the specified schema file doesn't exist or isn't accessible. This section shows how these errors are reported and how to handle them appropriately in CLI applications.

```typescript
try {
  const terminal = await Terminal.load(['transform', '--i', './nonexistent.idea']);
  await terminal.run();
} catch (error) {
  console.error('File not found:', error.message);
}
```

### 8.2. Invalid Command

Invalid command errors occur when unsupported commands are passed to the Terminal. This section explains how the Terminal handles unknown commands and provides guidance for error recovery.

```typescript
try {
  const terminal = await Terminal.load(['invalid-command']);
  await terminal.run();
} catch (error) {
  console.error('Unknown command:', error.message);
}
```

### 8.3. Plugin Errors

Plugin errors can occur during the transformation process when plugins fail to execute properly. This section covers how to handle and debug plugin-related issues in CLI environments.

```typescript
// If plugins fail during transformation
try {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
} catch (error) {
  console.error('Transformation failed:', error.message);
}
```

## 9. Advanced Usage

This section covers advanced patterns and techniques for using the Terminal class in complex scenarios. These examples demonstrate sophisticated use cases and integration patterns for power users.

### 9.1. Custom Event Handlers

Custom event handlers allow you to extend the Terminal's functionality with additional commands and behaviors. This pattern enables building specialized CLI tools with custom functionality.

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

### 9.2. Programmatic CLI Building

Programmatic CLI building demonstrates how to construct command-line arguments dynamically in code. This approach is useful for building tools that generate CLI commands based on configuration or user input.

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

### 9.3. Batch Processing

Batch processing shows how to use the Terminal class to process multiple schema files in sequence. This pattern is essential for build systems and automation tools that need to handle multiple schemas.

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

### 9.4. Environment-Based Configuration

Environment-based configuration demonstrates how to use environment variables to configure Terminal behavior. This approach enables flexible deployment and configuration management across different environments.

```typescript
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.env.SCHEMA_CWD || process.cwd(),
  extname: process.env.SCHEMA_EXT || '.idea',
  brand: process.env.CLI_BRAND || '[IDEA]'
});

await terminal.run();
```

## 10. Integration with Build Tools

This section demonstrates how to integrate the Terminal class with popular build tools and development workflows. These examples show practical applications for automating schema processing in development and deployment pipelines.

### 10.1. Webpack Plugin

Webpack plugin integration shows how to incorporate schema transformation into Webpack build processes. This enables automatic schema processing as part of the application build pipeline.

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

### 10.2. Gulp Task

Gulp task integration demonstrates how to create Gulp tasks that use the Terminal class for schema processing. This pattern is useful for projects that use Gulp as their primary build tool.

```typescript
import gulp from 'gulp';
import Terminal from '@stackpress/idea-transformer/Terminal';

gulp.task('transform-schema', async () => {
  const terminal = await Terminal.load(['transform', '--i', './schema.idea']);
  await terminal.run();
});
```

### 10.3. NPM Scripts

NPM scripts integration shows how to configure package.json scripts that use the Terminal class. This approach enables easy schema processing through standard npm commands and supports development workflows.

```json
{
  "scripts": {
    "schema:build": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './schema.idea']))\"",
    "schema:dev": "node -e \"import('./cli.js').then(m => m.default(['transform', '--i', './dev-schema.idea']))\"",
    "schema:watch": "nodemon --watch schema.idea --exec \"npm run schema:build\""
  }
}
```

## 11. Testing

This section covers testing strategies and patterns for applications that use the Terminal class. These examples demonstrate how to write effective tests for CLI functionality and ensure reliable schema processing.

### 11.1. Unit Testing

Unit testing examples show how to test Terminal functionality in isolation. These tests verify that the Terminal class behaves correctly with different command-line arguments and configuration options.

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

### 11.2. Integration Testing

Integration testing demonstrates how to test the complete workflow from command-line input to generated output files. These tests ensure that the entire transformation pipeline works correctly in realistic scenarios.

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

## 12. Best Practices

This section outlines recommended approaches for using the Terminal class effectively. Following these practices helps ensure reliable, maintainable, and user-friendly CLI applications.

### 12.1. Error Handling

Error handling best practices ensure that CLI applications provide clear feedback when issues occur. This section demonstrates patterns for implementing robust error handling and user-friendly error messages.

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

### 12.2. Configuration Management

Configuration management best practices help maintain clean, reusable configuration patterns. This section provides guidance on organizing configuration options and providing sensible defaults.

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

### 12.3. Logging and Debugging

Logging and debugging practices help developers troubleshoot issues and understand Terminal behavior. This section demonstrates effective logging strategies and debugging techniques for CLI applications.

```typescript
// Add logging for better debugging
const terminal = await Terminal.load(['transform', '--i', './schema.idea'], {
  cwd: process.cwd()
});

console.log(`Working directory: ${terminal.cwd}`);
console.log(`File extension: ${terminal.extname}`);

await terminal.run();
```
