# Creating Plugins with ts-morph: A Comprehensive Guide

This guide demonstrates how to create powerful code generation plugins using `ts-morph`, a TypeScript library that provides an easier way to programmatically navigate and manipulate TypeScript and JavaScript code. We'll walk through creating a complete plugin that generates TypeScript interfaces from schema definitions.

 1. [Introduction](#1-introduction)
 2. [Prerequisites](#2-prerequisites)
 3. [Setting Up the Project](#3-setting-up-the-project)
 4. [Understanding ts-morph Basics](#4-understanding-ts-morph-basics)
 5. [Creating Your First Plugin](#5-creating-your-first-plugin)
 6. [Advanced ts-morph Features](#6-advanced-ts-morph-features)
 7. [Testing Your Plugin](#7-testing-your-plugin)
 8. [Best Practices](#8-best-practices)
 9. [Troubleshooting](#9-troubleshooting)
 10. [References](#10-references)

## 1. Introduction

`ts-morph` is a powerful TypeScript library that wraps the TypeScript Compiler API, making it much easier to work with TypeScript Abstract Syntax Trees (AST). This introduction covers the fundamental concepts and advantages of using `ts-morph` for plugin development.

Unlike string-based code generation, `ts-morph` provides:

 - **Type-safe code manipulation**: Work with actual TypeScript nodes instead of strings
 - **Automatic formatting**: Generated code is properly formatted and follows TypeScript conventions
 - **IntelliSense support**: Full IDE support when writing your plugins
 - **AST navigation**: Easy traversal and modification of code structures
 - **Validation**: Automatic syntax validation of generated code

**Why Use ts-morph for Plugins?**

Understanding the advantages of `ts-morph` over traditional code generation approaches helps you make informed decisions about plugin architecture. This comparison highlights the key benefits that make `ts-morph` an excellent choice for TypeScript code generation.

Traditional code generation often involves:

 - Concatenating strings to build code
 - Manual indentation and formatting
 - Error-prone syntax construction
 - Difficulty maintaining complex code structures

With `ts-morph`, you can:

 - Create TypeScript constructs programmatically
 - Leverage the compiler's knowledge for validation
 - Generate properly formatted, syntactically correct code
 - Easily modify existing code structures

## 2. Installation

Before starting with `ts-morph` plugin development, ensure you have the necessary tools and knowledge. This section outlines the essential requirements for successful plugin creation and provides installation guidance.

Before starting, ensure you have:

 - **Node.js 16+** and npm/yarn installed
 - **TypeScript 4.0+** knowledge
 - Basic understanding of Abstract Syntax Trees (AST)
 - Familiarity with TypeScript interfaces, classes, and modules

Installing `ts-morph` is straightforward and can be done using your preferred package manager. The library is available through npm, yarn, and even Deno for different development environments.

Install `ts-morph` in your project:

```bash
# Using npm
npm install --save-dev ts-morph

# Using yarn
yarn add --dev ts-morph

# Using Deno
deno add ts-morph@jsr:@ts-morph/ts-morph
```

## 3. Setting Up the Project

Setting up a proper project structure is crucial for maintainable plugin development. This section guides you through creating a well-organized TypeScript project with all necessary configurations and dependencies.

Let's create a new TypeScript project for our plugin:

```bash
mkdir ts-morph-plugin-tutorial
cd ts-morph-plugin-tutorial
npm init -y
npm install --save-dev typescript ts-morph @types/node
```

Create a basic `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Create the project structure:

```
ts-morph-plugin-tutorial/
├── src/
│   ├── index.ts
│   ├── plugin.ts
│   └── types.ts
├── examples/
│   ├── input.json
│   └── output.ts
├── tests/
│   └── plugin.test.ts
├── package.json
└── tsconfig.json
```

## 4. Understanding ts-morph Basics

Understanding the fundamental concepts of `ts-morph` is essential for effective plugin development. This section covers the core APIs, project management, source file manipulation, and code generation patterns that form the foundation of all `ts-morph` operations.

Before creating our plugin, let's understand the core concepts of `ts-morph`:

### 4.1. Project and Source Files

The Project class is the entry point for all `ts-morph` operations, providing methods to create, load, and manage TypeScript source files. Understanding how to work with projects and source files is fundamental to building effective code generation plugins.

```typescript
import { Project } from "ts-morph";

// Create a new project
const project = new Project({
  compilerOptions: {
    target: ScriptTarget.ES2020,
    module: ModuleKind.CommonJS,
  },
});

// Create a source file
const sourceFile = project.createSourceFile("example.ts", "");

// Add content to the file
sourceFile.addInterface({
  name: "User",
  properties: [
    { name: "id", type: "string" },
    { name: "name", type: "string" },
  ],
});

// Get the generated code
console.log(sourceFile.getFullText());
// Output:
// interface User {
//     id: string;
//     name: string;
// }
```

### 4.2. Adding Different Constructs

`ts-morph` provides comprehensive APIs for adding various TypeScript constructs including imports, classes, functions, types, and enums. This section demonstrates the most commonly used patterns for generating different types of TypeScript code.

```typescript
// Add imports
sourceFile.addImportDeclaration({
  moduleSpecifier: "react",
  namedImports: ["useState", "useEffect"],
});

// Add a class
sourceFile.addClass({
  name: "UserService",
  isExported: true,
  methods: [
    {
      name: "getUser",
      parameters: [{ name: "id", type: "string" }],
      returnType: "Promise<User>",
      statements: "return fetch(`/api/users/${id}`).then(r => r.json());",
    },
  ],
});

// Add a function
sourceFile.addFunction({
  name: "createUser",
  isExported: true,
  isAsync: true,
  parameters: [{ name: "userData", type: "Partial<User>" }],
  returnType: "Promise<User>",
  statements: [
    "const response = await fetch('/api/users', {",
    "  method: 'POST',",
    "  headers: { 'Content-Type': 'application/json' },",
    "  body: JSON.stringify(userData)",
    "});",
    "return response.json();",
  ],
});

// Add type aliases
sourceFile.addTypeAlias({
  name: "UserId",
  isExported: true,
  type: "string",
});

// Add enums
sourceFile.addEnum({
  name: "UserRole",
  isExported: true,
  members: [
    { name: "ADMIN", value: "admin" },
    { name: "USER", value: "user" },
    { name: "GUEST", value: "guest" },
  ],
});
```

### 4.3. Exporting a Class

Creating and exporting classes is a common requirement in TypeScript code generation. This example demonstrates the basic pattern for generating classes with methods, including proper export declarations and method implementations.

A simple example of how to create a new TypeScript file with a class and a method using `ts-morph` looks like the following:

```js
import { Project } from "ts-morph";

const project = new Project();

const source = project.createSourceFile("newFile.ts", null, { overwrite: true });

const myClass = source.addClass({
  name: "MyClass",
});

myClass.addMethod({
  name: "myMethod",
  isDefaultExport: true
  parameters: [{ name: "param1", type: "string" }],
  returnType: "void",
  statements: "console.log(param1);"
});

project.saveSync();
```

This code will create a new TypeScript file `newFile.ts` with the 
following content.

```js
export default class MyClass {
  myMethod(param1: string): void {
    console.log(param1);
  }
}
```

You can use `isExported` or `isDefaultExport` to `export` or 
`export default` respectively. Also `statements` can be a string or an 
array of strings (`string[]`),

### 4.4. Exporting a Function

Function generation at the source file level provides flexibility for creating utility functions, API endpoints, and standalone operations. This section shows how to create functions with various configurations including async operations, parameters, and return types.

Similar to adding a method to a class, you can use `addFunction` to add a function at the source file level. An example of how to use `addFunction` to add a function with arguments and a body looks like the following:

```js
import { Project } from "ts-morph";

const project = new Project();

const source = project.createSourceFile("newFile.ts", null, { overwrite: true });

source.addFunction({
  name: "myFunction",
  isExported: true,
  isAsync: true,
  parameters: [
    { name: "param1", type: "string" },
    { name: "param2", type: "number" }
  ],
  returnType: "void",
  statements: [
    "console.log(param1);",
    "console.log(param2);"
  ]
});

project.saveSync();
```

In the above example, `myFunction` takes two parameters, `param1` of 
type string and `param2` of type number. The function body contains 
two `console.log` statements.

After running the above code, the content of `newFile.ts` would look 
like the following.

```js
export async function myFunction(param1: string, param2: number): void {
  console.log(param1);
  console.log(param2);
}
```

### 4.5. Exporting a Const

Constant declarations are essential for defining configuration values, default settings, and immutable data structures. The `addVariableStatement` method provides flexible options for creating various types of variable declarations with proper export handling.

To export a constant in `ts-morph`, you can utilize the `addVariableStatement` method on a `SourceFile` object. This method allows you to add a variable declaration to the file, including the capability to export the declaration.

```js
import { VariableDeclarationKind } from 'ts-morph';

source.addVariableStatement({
  isExported: true,
  declarationKind: VariableDeclarationKind.Const,
  declarations: [{
    name: "foo",
    initializer: `'bar'`
  }]
});
```

The provided `ts-morph` script will generate the following code in the 
source file.

```js
export const foo = 'bar';
```

### 4.6. Exporting an Object

Export declarations provide a clean way to re-export multiple entities from other modules or to export collections of related functionality. This pattern is commonly used in index files and module aggregation scenarios.

To generate an export statement that directly exports multiple imported entities in a single line using `ts-morph`, you don't need to declare them as variables first. Instead, you can use the `addExportDeclaration` method directly after your imports. This approach is more straightforward and aligns with typical TypeScript import-export patterns.

```js
source.addExportDeclaration({
  namedExports: ['ComponentA', 'ComponentB', 'ComponentC']
});
```

### 4.7. Exporting Types

Type exports are crucial for creating reusable type definitions that can be consumed by other modules. `ts-morph` provides dedicated methods for creating both type aliases and interfaces with proper export configurations.

To export a single type, you can use the addTypeAlias or addInterface method *(depending on whether you are defining an alias or an interface)*, and set the isExported property to true. An example of exporting a type alias looks like the following:

```js
source.addTypeAlias({
  name: "ExampleType",
  isExported: true,
  type: "string | number"
});
```

This will generate a file with the following content.

```js
export type ExampleType = string | number;
```

To export multiple types at the same time, you can add multiple type 
declarations *(either type aliases or interfaces)* with the 
`isExported` property set to true for each. Alternatively, you can use 
the `addExportDeclaration` method to export previously declared types. 
An example of declaring and exporting multiple types looks like the 
following.

```js
source.addTypeAlias({
  name: "AnotherType",
  isExported: true,
  type: "boolean"
});

source.addInterface({
  name: "ExampleInterface",
  isExported: true,
  properties: [
    { name: "id", type: "number" },
    { name: "name", type: "string" }
  ]
});

// Optionally, use addExportDeclaration to export all at once
source.addExportDeclaration({
  namedExports: ["ExampleType", "AnotherType", "ExampleInterface"]
});
```

This will generate a file with the following content.

```js
export type ExampleType = string | number;
export type AnotherType = boolean;
export interface ExampleInterface {
  id: number;
  name: string;
}
```

### 4.8. Importing Values

Import declarations are essential for bringing external dependencies and modules into your generated code. The `addImportDeclaration` method provides comprehensive options for creating various types of import statements including named imports, default imports, and type imports.

To import a set of values from a module in `ts-morph`, you can use the `addImportDeclaration` method on a `SourceFile` object. This method allows you to add an import declaration to the code file you are working with. Here's how to use this method to import specific values from the `react` module:

```js
source.addImportDeclaration({
  moduleSpecifier: 'react',
  namedImports: [ 'useState', 'useEffect' ]
});
```

The provided `ts-morph` script will generate the following code in the 
source file.

```js
import { useState, useEffect } from 'react';
```

You can also import types like the following.

```js
source.addImportDeclaration({
  moduleSpecifier: 'next',
  namedImports: [ 
    'NextApiRequest as Request', 
    'NextApiResponse as as Response' 
  ]
});
```

The above code renders the following.

```js
import type { 
  NextApiRequest as Request, 
  NextApiResponse as Response
} from 'next';
```

### 4.9. Importing Defaults

Default imports are commonly used for importing the main export from a module, such as React components or utility libraries. The same `addImportDeclaration` method handles default imports with a slightly different configuration.

To import a default from a module in `ts-morph`, you can also use the `addImportDeclaration` method:

```js
source.addImportDeclaration({
  moduleSpecifier: 'react',
  defaultImport: 'React'
});
```

This would create the following code.

```js
import React from 'react';
```

### 4.10. Working with Existing Code

Working with existing code is a powerful feature of `ts-morph` that allows you to modify, extend, and refactor existing TypeScript files. This capability is essential for plugins that need to augment or update existing codebases rather than generating new files from scratch.

```typescript
// Load existing files
project.addSourceFilesAtPaths("src/**/*.ts");

// Get a specific file
const existingFile = project.getSourceFile("src/models/User.ts");

// Find and modify existing constructs
const userInterface = existingFile?.getInterface("User");
if (userInterface) {
  // Add a new property
  userInterface.addProperty({
    name: "email",
    type: "string",
    hasQuestionToken: true, // Makes it optional
  });
  
  // Add JSDoc comments
  userInterface.addJsDoc({
    description: "Represents a user in the system",
    tags: [
      { tagName: "example", text: "const user: User = { id: '1', name: 'John' };" },
    ],
  });
}
```

## 5. Creating Your First Plugin

Creating your first plugin with `ts-morph` involves understanding the complete workflow from schema processing to code generation. This comprehensive example demonstrates building a TypeScript interface generator that transforms JSON schemas into properly typed interfaces with full feature support.

Let's create a plugin that generates TypeScript interfaces from JSON schema definitions. This will demonstrate the core concepts of using `ts-morph` for code generation.

### 5.1. Define the Plugin Interface

Defining clear interfaces for your plugin ensures type safety and provides a solid foundation for implementation. This section establishes the data structures and configuration options that will guide the entire plugin development process.

First, let's define the types for our plugin:

```typescript
// src/types.ts
export interface SchemaProperty {
  type: string;
  required?: boolean;
  description?: string;
  default?: any;
  items?: SchemaProperty; // For arrays
  properties?: Record<string, SchemaProperty>; // For objects
}

export interface Schema {
  name: string;
  description?: string;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

export interface PluginConfig {
  input: string;
  output: string;
  namespace?: string;
  generateComments?: boolean;
  generateUtilityTypes?: boolean;
  exportType?: 'named' | 'default' | 'namespace';
}
```

### 5.2. Core Plugin Implementation

The core plugin implementation orchestrates the entire code generation process, from loading input schemas to generating and saving TypeScript files. This comprehensive class demonstrates best practices for plugin architecture and error handling.

```typescript
// src/plugin.ts
import { Project, SourceFile, InterfaceDeclaration } from "ts-morph";
import { Schema, SchemaProperty, PluginConfig } from "./types";
import fs from "fs/promises";
import path from "path";

export class TypeScriptInterfaceGenerator {
  private project: Project;
  private config: PluginConfig;

  constructor(config: PluginConfig) {
    this.config = config;
    this.project = new Project({
      compilerOptions: {
        target: 99, // Latest
        module: 1,  // CommonJS
        declaration: true,
        strict: true,
      },
    });
  }

  async generate(): Promise<void> {
    try {
      // Read input schema
      const schemas = await this.loadSchemas();
      
      // Create source file
      const sourceFile = this.project.createSourceFile(
        this.config.output,
        "",
        { overwrite: true }
      );

      // Generate file header
      this.addFileHeader(sourceFile);

      // Generate interfaces for each schema
      for (const schema of schemas) {
        this.generateInterface(sourceFile, schema);
      }

      // Generate utility types if requested
      if (this.config.generateUtilityTypes) {
        this.generateUtilityTypes(sourceFile, schemas);
      }

      // Wrap in namespace if specified
      if (this.config.namespace) {
        this.wrapInNamespace(sourceFile);
      }

      // Save the file
      await sourceFile.save();
      
      console.log(`✅ Generated TypeScript interfaces: ${this.config.output}`);
    } catch (error) {
      console.error("❌ Generation failed:", error);
      throw error;
    }
  }

  private async loadSchemas(): Promise<Schema[]> {
    const content = await fs.readFile(this.config.input, "utf-8");
    const data = JSON.parse(content);
    
    // Handle both single schema and array of schemas
    return Array.isArray(data) ? data : [data];
  }

  private addFileHeader(sourceFile: SourceFile): void {
    const timestamp = new Date().toISOString();
    sourceFile.insertText(0, `/**
 * Generated TypeScript interfaces
 * Generated at: ${timestamp}
 * Source: ${this.config.input}
 * 
 * This file is auto-generated. Do not edit manually.
 */

`);
  }

  private generateInterface(sourceFile: SourceFile, schema: Schema): void {
    const interfaceDeclaration = sourceFile.addInterface({
      name: schema.name,
      isExported: this.config.exportType !== 'namespace',
    });

    // Add JSDoc comment if enabled
    if (this.config.generateComments && schema.description) {
      interfaceDeclaration.addJsDoc({
        description: schema.description,
      });
    }

    // Add properties
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      this.addProperty(interfaceDeclaration, propName, propSchema, schema.required);
    }
  }

  private addProperty(
    interfaceDecl: InterfaceDeclaration,
    name: string,
    property: SchemaProperty,
    requiredFields?: string[]
  ): void {
    const isRequired = requiredFields?.includes(name) ?? property.required ?? false;
    const typeString = this.mapSchemaTypeToTypeScript(property);

    const propertySignature = interfaceDecl.addProperty({
      name,
      type: typeString,
      hasQuestionToken: !isRequired,
    });

    // Add JSDoc comment if enabled
    if (this.config.generateComments) {
      const jsdocParts: string[] = [];
      
      if (property.description) {
        jsdocParts.push(property.description);
      }
      
      if (property.default !== undefined) {
        jsdocParts.push(`@default ${JSON.stringify(property.default)}`);
      }

      if (jsdocParts.length > 0) {
        propertySignature.addJsDoc({
          description: jsdocParts.join('\n'),
        });
      }
    }
  }

  private mapSchemaTypeToTypeScript(property: SchemaProperty): string {
    switch (property.type) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        if (property.items) {
          const itemType = this.mapSchemaTypeToTypeScript(property.items);
          return `${itemType}[]`;
        }
        return 'any[]';
      case 'object':
        if (property.properties) {
          // Generate inline interface
          const props = Object.entries(property.properties)
            .map(([key, prop]) => {
              const type = this.mapSchemaTypeToTypeScript(prop);
              const optional = prop.required ? '' : '?';
              return `${key}${optional}: ${type}`;
            })
            .join('; ');
          return `{ ${props} }`;
        }
        return 'Record<string, any>';
      default:
        // Assume it's a reference to another interface
        return property.type;
    }
  }

  private generateUtilityTypes(sourceFile: SourceFile, schemas: Schema[]): void {
    sourceFile.addStatements("\n// Utility Types");

    for (const schema of schemas) {
      const interfaceName = schema.name;

      // Generate Create input type (omit auto-generated fields)
      sourceFile.addTypeAlias({
        name: `Create${interfaceName}Input`,
        isExported: this.config.exportType !== 'namespace',
        type: `Omit<${interfaceName}, 'id' | 'createdAt' | 'updatedAt'>`,
      });

      // Generate Update input type (all fields optional)
      sourceFile.addTypeAlias({
        name: `Update${interfaceName}Input`,
        isExported: this.config.exportType !== 'namespace',
        type: `Partial<${interfaceName}>`,
      });

      // Generate keys type
      sourceFile.addTypeAlias({
        name: `${interfaceName}Keys`,
        isExported: this.config.exportType !== 'namespace',
        type: `keyof ${interfaceName}`,
      });
    }

    // Generate union type of all models
    if (schemas.length > 1) {
      const allTypes = schemas.map(s => s.name).join(' | ');
      sourceFile.addTypeAlias({
        name: 'AnyModel',
        isExported: this.config.exportType !== 'namespace',
        type: allTypes,
      });
    }
  }

  private wrapInNamespace(sourceFile: SourceFile): void {
    const content = sourceFile.getFullText();
    sourceFile.removeText();
    
    // Extract header comments
    const headerMatch = content.match(/^(\/\*\*[\s\S]*?\*\/\s*)/);
    const header = headerMatch ? headerMatch[1] : '';
    const bodyContent = content.replace(header, '');

    // Add header back
    if (header) {
      sourceFile.insertText(0, header);
    }

    // Create namespace
    const namespace = sourceFile.addNamespace({
      name: this.config.namespace!,
      isExported: this.config.exportType === 'default' ? false : true,
    });

    // Add content to namespace
    namespace.addStatements(bodyContent.trim());

    // Add default export if specified
    if (this.config.exportType === 'default') {
      sourceFile.addExportAssignment({
        expression: this.config.namespace!,
        isExportEquals: false,
      });
    }
  }
}
```

### 5.3. Plugin Entry Point

The plugin entry point provides a clean API for consumers and handles CLI integration. This section shows how to create both programmatic and command-line interfaces for your plugin, making it accessible in different usage scenarios.

```typescript
// src/index.ts
import { TypeScriptInterfaceGenerator } from "./plugin";
import { PluginConfig } from "./types";

export async function generateTypeScriptInterfaces(config: PluginConfig): Promise<void> {
  const generator = new TypeScriptInterfaceGenerator(config);
  await generator.generate();
}

export * from "./types";
export { TypeScriptInterfaceGenerator };

// CLI usage
if (require.main === module) {
  const config: PluginConfig = {
    input: process.argv[2] || "examples/input.json",
    output: process.argv[3] || "examples/output.ts",
    generateComments: true,
    generateUtilityTypes: true,
    exportType: 'named',
  };

  generateTypeScriptInterfaces(config).catch(console.error);
}
```

### 5.4. Example Usage

Example usage demonstrates the plugin in action with realistic data structures. This comprehensive example shows how the plugin processes complex schemas with various property types, relationships, and validation rules.

Create an example schema file:

```json
// examples/input.json
[
  {
    "name": "User",
    "description": "Represents a user in the system",
    "properties": {
      "id": {
        "type": "string",
        "description": "Unique identifier for the user"
      },
      "email": {
        "type": "string",
        "description": "User's email address"
      },
      "name": {
        "type": "string",
        "description": "User's full name"
      },
      "age": {
        "type": "number",
        "description": "User's age in years"
      },
      "isActive": {
        "type": "boolean",
        "description": "Whether the user account is active",
        "default": true
      },
      "roles": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "User's assigned roles"
      },
      "profile": {
        "type": "object",
        "properties": {
          "bio": {
            "type": "string"
          },
          "avatar": {
            "type": "string"
          }
        },
        "description": "User's profile information"
      },
      "createdAt": {
        "type": "string",
        "description": "Account creation timestamp"
      }
    },
    "required": ["id", "email", "name"]
  },
  {
    "name": "Post",
    "description": "Represents a blog post",
    "properties": {
      "id": {
        "type": "string",
        "description": "Unique identifier for the post"
      },
      "title": {
        "type": "string",
        "description": "Post title"
      },
      "content": {
        "type": "string",
        "description": "Post content"
      },
      "authorId": {
        "type": "string",
        "description": "ID of the post author"
      },
      "tags": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Post tags"
      },
      "publishedAt": {
        "type": "string",
        "description": "Publication timestamp"
      }
    },
    "required": ["id", "title", "content", "authorId"]
  }
]
```

Run the plugin:

```bash
npx ts-node src/index.ts examples/input.json examples/output.ts
```

Generated output:

```typescript
// examples/output.ts
/**
 * Generated TypeScript interfaces
 * Generated at: 2024-01-15T10:30:00.000Z
 * Source: examples/input.json
 * 
 * This file is auto-generated. Do not edit manually.
 */

/**
 * Represents a user in the system
 */
export interface User {
    /**
     * Unique identifier for the user
     */
    id: string;
    /**
     * User's email address
     */
    email: string;
    /**
     * User's full name
     */
    name: string;
    /**
     * User's age in years
     */
    age?: number;
    /**
     * Whether the user account is active
     * @default true
     */
    isActive?: boolean;
    /**
     * User's assigned roles
     */
    roles?: string[];
    /**
     * User's profile information
     */
    profile?: { bio?: string; avatar?: string };
    /**
     * Account creation timestamp
     */
    createdAt?: string;
}

/**
 * Represents a blog post
 */
export interface Post {
    /**
     * Unique identifier for the post
     */
    id: string;
    /**
     * Post title
     */
    title: string;
    /**
     * Post content
     */
    content: string;
    /**
     * ID of the post author
     */
    authorId: string;
    /**
     * Post tags
     */
    tags?: string[];
    /**
     * Publication timestamp
     */
    publishedAt?: string;
}

// Utility Types
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUserInput = Partial<User>;

export type UserKeys = keyof User;

export type CreatePostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePostInput = Partial<Post>;

export type PostKeys = keyof Post;

export type AnyModel = User | Post;
```

## 6. Advanced ts-morph Features

Advanced `ts-morph` features enable sophisticated code generation scenarios including decorators, complex type systems, module declarations, and code manipulation. These features are essential for building production-ready plugins that handle enterprise-level requirements.

### 6.1. Working with Decorators

Decorators are essential for modern TypeScript applications, especially when working with frameworks like Angular, NestJS, or TypeORM. `ts-morph` provides comprehensive support for generating classes and methods with decorators.


```typescript
// Add a class with decorators
sourceFile.addClass({
  name: "UserController",
  isExported: true,
  decorators: [
    {
      name: "Controller",
      arguments: ["'users'"],
    },
  ],
  methods: [
    {
      name: "getUser",
      decorators: [
        {
          name: "Get",
          arguments: ["':id'"],
        },
      ],
      parameters: [
        {
          name: "id",
          type: "string",
          decorators: [
            {
              name: "Param",
              arguments: ["'id'"],
            },
          ],
        },
      ],
      returnType: "Promise<User>",
      statements: "return this.userService.findById(id);",
    },
  ],
});
```

### 6.2. Generating Complex Types

Complex type generation includes mapped types, conditional types, and template literal types that leverage TypeScript's advanced type system. These features enable the creation of sophisticated type-safe APIs and utility types.

```typescript
// Generate mapped types
sourceFile.addTypeAlias({
  name: "PartialUser",
  type: "{ [K in keyof User]?: User[K] }",
});

// Generate conditional types
sourceFile.addTypeAlias({
  name: "NonNullable",
  typeParameters: [{ name: "T" }],
  type: "T extends null | undefined ? never : T",
});

// Generate template literal types
sourceFile.addTypeAlias({
  name: "EventName",
  typeParameters: [{ name: "T", constraint: "string" }],
  type: "`on${Capitalize<T>}`",
});
```

### 6.3. Working with Modules

Module declarations and ambient modules are crucial for creating type definitions and extending existing libraries. This section covers both namespace-style modules and modern ES module patterns.

```typescript
// Add module declaration
sourceFile.addModule({
  name: "Express",
  declarationKind: ModuleDeclarationKind.Module,
  statements: [
    {
      kind: StructureKind.Interface,
      name: "Request",
      properties: [
        { name: "user", type: "User", hasQuestionToken: true },
      ],
    },
  ],
});

// Add ambient module
sourceFile.addModule({
  name: '"my-library"',
  declarationKind: ModuleDeclarationKind.Module,
  hasDeclareKeyword: true,
  statements: [
    "export function myFunction(): void;",
  ],
});
```

### 6.4. Manipulating Existing Code

Code manipulation capabilities allow plugins to modify existing TypeScript files, add new functionality, and refactor code structures. This is particularly useful for migration tools and code modernization plugins.

```typescript
// Find and modify existing interfaces
const existingInterface = sourceFile.getInterface("User");
if (existingInterface) {
  // Add new properties
  existingInterface.addProperty({
    name: "lastLoginAt",
    type: "Date",
    hasQuestionToken: true,
  });

  // Modify existing properties
  const emailProp = existingInterface.getProperty("email");
  if (emailProp) {
    emailProp.setType("string & { readonly brand: 'Email' }");
  }

  // Add extends clause
  existingInterface.addExtends("BaseEntity");
}

// Remove nodes
const deprecatedMethod = sourceFile.getFunction("oldFunction");
deprecatedMethod?.remove();
```

## 7. Testing Your Plugin

Comprehensive testing ensures your plugin works correctly across different scenarios and maintains reliability as it evolves. This section covers unit testing, integration testing, and validation strategies for `ts-morph` plugins.

Create comprehensive tests for your plugin:

```typescript
// tests/plugin.test.ts
import { TypeScriptInterfaceGenerator } from "../src/plugin";
import { PluginConfig, Schema } from "../src/types";
import { Project } from "ts-morph";
import fs from "fs/promises";
import path from "path";

describe("TypeScriptInterfaceGenerator", () => {
  const testOutputDir = path.join(__dirname, "output");
  
  beforeAll(async () => {
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rmdir(testOutputDir, { recursive: true });
  });

  test("should generate basic interface", async () => {
    const schema: Schema = {
      name: "TestUser",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["id", "name"],
    };

    const inputFile = path.join(testOutputDir, "test-input.json");
    const outputFile = path.join(testOutputDir, "test-output.ts");

    await fs.writeFile(inputFile, JSON.stringify(schema, null, 2));

    const config: PluginConfig = {
      input: inputFile,
      output: outputFile,
      generateComments: true,
    };

    const generator = new TypeScriptInterfaceGenerator(config);
    await generator.generate();

    // Verify the output
    const generatedContent = await fs.readFile(outputFile, "utf-8");
    
    expect(generatedContent).toContain("export interface TestUser");
    expect(generatedContent).toContain("id: string;");
    expect(generatedContent).toContain("name: string;");
    expect(generatedContent).toContain("age?: number;");
  });

  test("should generate utility types", async () => {
    const schema: Schema = {
      name: "Product",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        price: { type: "number" },
      },
      required: ["id", "name", "price"],
    };

    const inputFile = path.join(testOutputDir, "product-input.json");
    const outputFile = path.join(testOutputDir, "product-output.ts");

    await fs.writeFile(inputFile, JSON.stringify(schema, null, 2));

    const config: PluginConfig = {
      input: inputFile,
      output: outputFile,
      generateUtilityTypes: true,
    };

    const generator = new TypeScriptInterfaceGenerator(config);
    await generator.generate();

    const generatedContent = await fs.readFile(outputFile, "utf-8");
    
    expect(generatedContent).toContain("CreateProductInput");
    expect(generatedContent).toContain("UpdateProductInput");
    expect(generatedContent).toContain("ProductKeys");
  });

  test("should validate generated TypeScript", async () => {
    const schema: Schema = {
      name: "ValidatedInterface",
      properties: {
        id: { type: "string" },
        data: {
          type: "object",
          properties: {
            nested: { type: "boolean" },
          },
        },
      },
    };

    const inputFile = path.join(testOutputDir, "validated-input.json");
    const outputFile = path.join(testOutputDir, "validated-output.ts");

    await fs.writeFile(inputFile, JSON.stringify(schema, null, 2));

    const config: PluginConfig = {
      input: inputFile,
      output: outputFile,
    };

    const generator = new TypeScriptInterfaceGenerator(config);
    await generator.generate();

    // Validate the generated TypeScript compiles
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(outputFile);
    
    const diagnostics = sourceFile.getPreEmitDiagnostics();
    expect(diagnostics).toHaveLength(0);
  });
});
```

Run tests:

```bash
npm test
```

## 8. Best Practices

Following best practices ensures your plugins are maintainable, performant, and reliable in production environments. These guidelines cover type safety, error handling, performance optimization, and code organization strategies.

### 8.1. Type Safety

Type safety is fundamental to building reliable plugins that catch errors at compile time rather than runtime. Always use TypeScript interfaces and proper type validation throughout your plugin implementation.


Always use TypeScript interfaces for your plugin configuration and data structures:

```typescript
interface PluginOptions {
  readonly input: string;
  readonly output: string;
  readonly strict?: boolean;
}

function validateOptions(options: unknown): asserts options is PluginOptions {
  if (typeof options !== 'object' || options === null) {
    throw new Error('Options must be an object');
  }
  
  const opts = options as Record<string, unknown>;
  
  if (typeof opts.input !== 'string') {
    throw new Error('input must be a string');
  }
  
  if (typeof opts.output !== 'string') {
    throw new Error('output must be a string');
  }
}
```

### 8.2. Error Handling

Comprehensive error handling provides clear feedback to users and helps with debugging when things go wrong. Implement custom error types and meaningful error messages to improve the developer experience.

Implement comprehensive error handling:

```typescript
class PluginError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

async function safeGenerate(config: PluginConfig): Promise<void> {
  try {
    await generator.generate();
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new PluginError(
        'Invalid JSON in input file',
        'INVALID_JSON',
        { originalError: error.message }
      );
    }
    
    if (error.code === 'ENOENT') {
      throw new PluginError(
        'Input file not found',
        'FILE_NOT_FOUND',
        { path: config.input }
      );
    }
    
    throw error;
  }
}
```

### 8.3. Performance Optimization

Performance optimization becomes crucial when dealing with large schemas or generating substantial amounts of code. Implement caching strategies and batch processing to maintain reasonable execution times.

For large schemas, optimize performance:

```typescript
class OptimizedGenerator {
  private typeCache = new Map<string, string>();
  private interfaceCache = new Map<string, InterfaceDeclaration>();

  private getCachedType(property: SchemaProperty): string {
    const cacheKey = JSON.stringify(property);
    
    if (this.typeCache.has(cacheKey)) {
      return this.typeCache.get(cacheKey)!;
    }
    
    const type = this.mapSchemaTypeToTypeScript(property);
    this.typeCache.set(cacheKey, type);
    
    return type;
  }

  private batchAddProperties(
    interfaceDecl: InterfaceDeclaration,
    properties: Record<string, SchemaProperty>
  ): void {
    const propertyStructures = Object.entries(properties).map(([name, prop]) => ({
      name,
      type: this.getCachedType(prop),
      hasQuestionToken: !prop.required,
    }));

    interfaceDecl.addProperties(propertyStructures);
  }
}
```

### 8.4. Code Organization

Proper code organization makes your plugin easier to maintain, test, and extend. Separate concerns into focused classes and modules that each handle specific aspects of the generation process.

Structure your plugin code for maintainability:

```typescript
// generators/interface-generator.ts
export class InterfaceGenerator {
  generate(schema: Schema): InterfaceDeclaration {
    // Interface-specific logic
  }
}

// generators/type-generator.ts
export class TypeGenerator {
  generate(schema: Schema): TypeAliasDeclaration {
    // Type alias-specific logic
  }
}

// generators/enum-generator.ts
export class EnumGenerator {
  generate(schema: EnumSchema): EnumDeclaration {
    // Enum-specific logic
  }
}

// main-plugin.ts
export class MainPlugin {
  constructor(
    private interfaceGenerator: InterfaceGenerator,
    private typeGenerator: TypeGenerator,
    private enumGenerator: EnumGenerator
  ) {}

  async generate(config: PluginConfig): Promise<void> {
    // Orchestrate all generators
  }
}
```

### 8.5. Documentation Generation

Documentation generation ensures your generated code is self-documenting and provides valuable context for developers. Implement comprehensive JSDoc comment generation with examples and type information.

Add comprehensive JSDoc comments:

```typescript
function generateJSDocComment(
  property: SchemaProperty,
  includeExamples: boolean = true
): string {
  const parts: string[] = [];
  
  if (property.description) {
    parts.push(property.description);
  }
  
  if (property.default !== undefined) {
    parts.push(`@default ${JSON.stringify(property.default)}`);
  }
  
  if (includeExamples && property.example) {
    parts.push(`@example ${property.example}`);
  }
  
  if (property.deprecated) {
    parts.push(`@deprecated ${property.deprecated}`);
  }
  
  return parts.length > 0 ? parts.join('\n') : '';
}
```

## 9. Troubleshooting

Troubleshooting guides help developers quickly identify and resolve common issues encountered during plugin development. This section covers validation, debugging techniques, and solutions for typical problems.

### 9.1. Common Issues

Common issues in `ts-morph` plugin development typically involve syntax validation, circular references, and memory management. Understanding these patterns helps prevent and resolve problems efficiently.

#### 9.1.1. Invalid TypeScript Syntax

Invalid TypeScript syntax can break the compilation process and prevent your plugin from generating usable code. Implement validation checks to catch syntax errors early in the generation process.


```typescript
function validateGeneratedCode(sourceFile: SourceFile): void {
  const diagnostics = sourceFile.getPreEmitDiagnostics();
  
  if (diagnostics.length > 0) {
    const errors = diagnostics.map(d => ({
      message: d.getMessageText(),
      line: d.getLineNumber(),
      file: d.getSourceFile()?.getFilePath()
    }));
    
    throw new Error(`Generated TypeScript has errors: ${JSON.stringify(errors, null, 2)}`);
  }
}
```

#### 9.1.2. Circular Type References

Circular type references can cause infinite loops and compilation errors. Detecting and handling these scenarios is crucial for plugins that work with complex, interconnected data structures.

```typescript
function detectCircularReferences(schemas: Schema[]): string[] {
  const graph = new Map<string, Set<string>>();
  const cycles: string[] = [];
  
  // Build dependency graph
  for (const schema of schemas) {
    const deps = new Set<string>();
    
    for (const prop of Object.values(schema.properties)) {
      if (prop.type && schemas.some(s => s.name === prop.type)) {
        deps.add(prop.type);
      }
    }
    
    graph.set(schema.name, deps);
  }
  
  // Detect cycles using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function hasCycle(node: string): boolean {
    if (recursionStack.has(node)) {
      cycles.push(node);
      return true;
    }
    
    if (visited.has(node)) {
      return false;
    }
    
    visited.add(node);
    recursionStack.add(node);
    
    const deps = graph.get(node) || new Set();
    for (const dep of deps) {
      if (hasCycle(dep)) {
        return true;
      }
    }
    
    recursionStack.delete(node);
    return false;
  }
  
  for (const schema of schemas) {
    hasCycle(schema.name);
  }
  
  return cycles;
}
```

#### 9.1.3. Memory Issues with Large Schemas

Memory management becomes important when processing large schemas or generating substantial amounts of code. Implement streaming and batching strategies to handle large-scale generation efficiently.

```typescript
class StreamingGenerator {
  async generateLargeSchema(schemas: Schema[]): Promise<void> {
    const batchSize = 10;
    
    for (let i = 0; i < schemas.length; i += batchSize) {
      const batch = schemas.slice(i, i + batchSize);
      
      // Process batch
      await this.processBatch(batch);
      
      // Clear memory
      if (global.gc) {
        global.gc();
      }
    }
  }
  
  private async processBatch(schemas: Schema[]): Promise<void> {
    // Process smaller batches to avoid memory issues
  }
}
```

### 9.2. Debugging Tips

Effective debugging techniques help identify issues quickly and understand the plugin's behavior during development. These tools and strategies provide visibility into the generation process.

#### 9.2.1. Enable Verbose Logging

Verbose logging provides detailed information about the plugin's execution flow, helping identify where issues occur and what data is being processed at each step.


```typescript
const DEBUG = process.env.DEBUG === 'true';

function debugLog(message: string, data?: any): void {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Usage
debugLog('Processing schema', schema);
debugLog('Generated interface', interfaceDeclaration.getText());
```

#### 9.2.2. Save Intermediate Results

Saving intermediate results allows you to inspect the code generation process at different stages, making it easier to identify where problems occur and verify that each step produces the expected output.

```typescript
async function saveIntermediateResults(
  sourceFile: SourceFile,
  step: string
): Promise<void> {
  if (process.env.SAVE_INTERMEDIATE === 'true') {
    const outputPath = `debug-${step}-${Date.now()}.ts`;
    await fs.writeFile(outputPath, sourceFile.getFullText());
    console.log(`Saved intermediate result: ${outputPath}`);
  }
}
```

#### 9.2.3. Validate Each Step

Step-by-step validation ensures that each phase of the generation process produces valid TypeScript code, helping catch issues early before they compound into larger problems.

```typescript
function validateStep(
  sourceFile: SourceFile,
  stepName: string
): void {
  try {
    const diagnostics = sourceFile.getPreEmitDiagnostics();
    if (diagnostics.length > 0) {
      throw new Error(`Step ${stepName} produced invalid TypeScript`);
    }
    console.log(`✅ Step ${stepName} completed successfully`);
  } catch (error) {
    console.error(`❌ Step ${stepName} failed:`, error.message);
    throw error;
  }
}
```

## 10. References

This section provides comprehensive resources for continued learning and development with `ts-morph`. These references include official documentation, community resources, and related tools that enhance the plugin development experience.

### 10.1. Official Documentation

Official documentation provides authoritative information about `ts-morph` APIs, TypeScript compiler internals, and AST manipulation techniques.

 - **ts-morph Documentation**: [https://ts-morph.com/](https://ts-morph.com/)
 - **TypeScript Compiler API**: [https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
 - **TypeScript AST Viewer**: [https://ts-ast-viewer.com/](https://ts-ast-viewer.com/)

### 10.2. Useful Resources

Additional resources provide practical examples, community insights, and tools that complement the official documentation for comprehensive plugin development.

 - **ts-morph GitHub Repository**: [https://github.com/dsherret/ts-morph](https://github.com/dsherret/ts-morph)
 - **TypeScript Handbook**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
 - **AST Explorer**: [https://astexplorer.net/](https://astexplorer.net/)

### 10.3. Community Examples

Community examples showcase real-world usage patterns and provide inspiration for advanced plugin development techniques.

 - **ts-morph Examples**: [https://github.com/dsherret/ts-morph/tree/latest/packages/ts-morph/scripts](https://github.com/dsherret/ts-morph/tree/latest/packages/ts-morph/scripts)
 - **Code Generation Patterns**: [https://github.com/topics/code-generation](https://github.com/topics/code-generation)

**Related Tools**

 - **TypeScript ESLint**: For linting generated code
 - **Prettier**: For formatting generated code
 - **ts-node**: For running TypeScript directly
 - **Jest**: For testing your plugins

This comprehensive guide provides everything you need to create powerful code generation plugins using `ts-morph`. The library's type-safe approach to code manipulation makes it an excellent choice for building robust, maintainable code generators that produce high-quality TypeScript output.
