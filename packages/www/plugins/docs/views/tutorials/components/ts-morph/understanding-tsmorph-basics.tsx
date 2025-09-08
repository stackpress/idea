import { H1, H2, P, C } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const examples = [
  `import { Project } from "ts-morph";

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
// }`,
`// Add imports
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
      statements: "return fetch('/api/users/' + id).then(r => r.json());",
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
});`,
`import { Project } from "ts-morph";

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

project.saveSync();`,
`export default class MyClass {
  myMethod(param1: string): void {
    console.log(param1);
  }
}`,
`import { Project } from "ts-morph";

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

project.saveSync();`,
`export async function myFunction(param1: string, param2: number): void {
  console.log(param1);
  console.log(param2);
}`
];

export default function UnderstandingTsMorphBasics() {
  return (
    <section id="4-understanding-ts-morph-basics">
      <H1>4. Understanding ts-morph Basics</H1>
      <P>
        Understanding the fundamental concepts of <C>ts-morph</C> is essential for effective plugin development. This section covers the core APIs, project management, source file manipulation, and code generation patterns that form the foundation of all <C>ts-morph</C> operations.
      </P>

      <H2>4.1. Project and Source Files</H2>
      <P>
        The Project class is the entry point for all <C>ts-morph</C> operations, providing methods to create, load, and manage TypeScript source files. Understanding how to work with projects and source files is fundamental to building effective code generation plugins.
      </P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[0]}
      </Code>

      <H2>4.2. Adding Different Constructs</H2>
      <P>
        <C>ts-morph</C> provides comprehensive APIs for adding various TypeScript constructs including imports, classes, functions, types, and enums. This section demonstrates the most commonly used patterns for generating different types of TypeScript code.
      </P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[1]}
      </Code>

      <H2>4.3. Exporting a Class</H2>
      <P>
      Creating and exporting classes is a common requirement in TypeScript code generation. This example demonstrates the basic pattern for generating classes with methods, including proper export declarations and method implementations.
      </P>
      <P>A simple example of how to create a new TypeScript file with a class and a method using <C>ts-morph</C> looks like the following:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[2]}
      </Code>

      <P>This code will create a new TypeScript file <C>newFile.ts</C> with the following content:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[3]}
      </Code>
      <P>You can use <C>isExported</C> or <C>isDefaultExport</C> to <C>export</C> or <C>export default</C> respectively. Also <C>statements</C> can be a string or an array of strings (<C>string[]</C>).</P>

      <H2>4.4. Exporting a Function</H2>
      <P>
      Function generation at the source file level provides flexibility for creating utility functions, API endpoints, and standalone operations. This section shows how to create functions with various configurations including async operations, parameters, and return types.
      </P>
      <P>Similar to adding a method to a class, you can use <C>addFunction</C> to add a function at the source file level. An example of how to use <C>addFunction</C> to add a function with arguments and a body looks like the following:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[4]}
      </Code>
      <P>In the above example, <C>myFunction</C> takes two parameters, <C>param1</C> of type string and <C>param2</C> of type number. The function body contains two <C>console.log</C> statements.</P>
      <P>After running the above code, the content of <C>newFile.ts</C> would look like the following:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {examples[5]}
      </Code>

      <H2>4.5. Exporting a Const</H2>
      <P>Constant declarations are essential for defining configuration values, default settings, and immutable data structures. The <C>addVariableStatement</C> method provides flexible options for creating various types of variable declarations with proper export handling.</P>
      <P>To export a constant in <C>ts-morph</C>, you can utilize the <C>addVariableStatement</C> method on a <C>SourceFile</C> object. This method allows you to add a variable declaration to the file, including the capability to export the declaration.</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`import { VariableDeclarationKind } from 'ts-morph';

source.addVariableStatement({
  isExported: true,
  declarationKind: VariableDeclarationKind.Const,
  declarations: [{
    name: "foo",
    initializer: '\'bar\''
  }]
});`}
      </Code>
      <P>The provided <C>ts-morph</C> script will generate the following code in the source file.</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`export const foo = 'bar';`}
      </Code>

      <H2>4.6. Exporting an Object</H2>
      <P>Export declarations provide a clean way to re-export multiple entities from other modules or to export collections of related functionality. This pattern is commonly used in index files and module aggregation scenarios.</P>
      <P>To generate an export statement that directly exports multiple imported entities in a single line using <C>ts-morph</C>, you don't need to declare them as variables first. Instead, you can use the <C>addExportDeclaration</C> method directly after your imports. This approach is more straightforward and aligns with typical TypeScript import-export patterns.</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`source.addExportDeclaration({
  namedExports: ['ComponentA', 'ComponentB', 'ComponentC']
});`}
      </Code>

      <H2>4.7. Exporting Types</H2>
      <P>Type exports are crucial for creating reusable type definitions that can be consumed by other modules. <C>ts-morph</C> provides dedicated methods for creating both type aliases and interfaces with proper export configurations.</P>
      <P>To export a single type, you can use the <C>addTypeAlias</C> or <C>addInterface</C> method (depending on whether you are defining an alias or an interface), and set the <C>isExported</C> property to true. An example of exporting a type alias looks like the following:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`source.addTypeAlias({
  name: "ExampleType",
  isExported: true,
  type: "string | number"
});`}
      </Code>
      <P>This will generate a file with the following content:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`export type ExampleType = string | number;`}
      </Code>
      <P>To export multiple types at the same time, you can add multiple type declarations (either type aliases or interfaces) with the <C>isExported</C> property set to true for each. Alternatively, you can use the <C>addExportDeclaration</C> method to export previously declared types. An example of declaring and exporting multiple types looks like the following:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`source.addTypeAlias({
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
});`}
      </Code>
      <P>This will generate a file with the following content:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`export type ExampleType = string | number;
export type AnotherType = boolean;
export interface ExampleInterface {
  id: number;
  name: string;
}`}
      </Code>

      <H2>4.8. Importing Values</H2>
      <P>Import declarations are essential for bringing external dependencies and modules into your generated code. The <C>addImportDeclaration</C> method provides comprehensive options for creating various types of import statements including named imports, default imports, and type imports.</P>
      <P>To import a set of values from a module in <C>ts-morph</C>, you can use the <C>addImportDeclaration</C> method on a <C>SourceFile</C> object. This method allows you to add an import declaration to the code file you are working with. Here's how to use this method to import specific values from the <C>react</C> module:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`source.addImportDeclaration({
  moduleSpecifier: 'react',
  namedImports: [ 'useState', 'useEffect' ]
});`}
      </Code>
      <P>The provided <C>ts-morph</C> script will generate the following code in the source file:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`import { useState, useEffect } from 'react';`}
      </Code>
      <P>You can also import types like the following:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`source.addImportDeclaration({
  moduleSpecifier: 'next',
  namedImports: [ 
    'NextApiRequest as Request', 
    'NextApiResponse as as Response' 
  ]
});`}
      </Code>
      <P>The above code renders the following:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`import type { 
  NextApiRequest as Request, 
  NextApiResponse as Response
} from 'next';`}
      </Code>

      <H2>4.9. Importing Defaults</H2>
      <P>Default imports are commonly used for importing the main export from a module, such as React components or utility libraries. The same <C>addImportDeclaration</C> method handles default imports with a slightly different configuration.</P>
      <P>To import a default from a module in <C>ts-morph</C>, you can also use the <C>addImportDeclaration</C> method:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`source.addImportDeclaration({
  moduleSpecifier: 'react',
  defaultImport: 'React'
});`}
      </Code>
      <P>This would create the following code:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`import React from 'react';`}
      </Code>

      <H2>4.10. Working with Existing Code</H2>
      <P>Working with existing code is a powerful feature of <C>ts-morph</C> that allows you to modify, extend, and refactor existing TypeScript files. This capability is essential for plugins that need to augment or update existing codebases rather than generating new files from scratch.</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {`// Load existing files
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
}`}
      </Code>

    </section>
  )
}
