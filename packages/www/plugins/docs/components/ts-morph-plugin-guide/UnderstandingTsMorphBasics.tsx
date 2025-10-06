//moudles
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

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

//----------------------------------------------------------------------

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

//----------------------------------------------------------------------

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

//----------------------------------------------------------------------

`export default class MyClass {
  myMethod(param1: string): void {
    console.log(param1);
  }
}`,

//----------------------------------------------------------------------

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

//----------------------------------------------------------------------

`export async function myFunction(param1: string, param2: number): void {
  console.log(param1);
  console.log(param2);
}`,

//----------------------------------------------------------------------

`import { VariableDeclarationKind } from 'ts-morph';

source.addVariableStatement({
  isExported: true,
  declarationKind: VariableDeclarationKind.Const,
  declarations: [{
    name: "foo",
    initializer: '\'bar\''
  }]
});`,

//----------------------------------------------------------------------

`export const foo = 'bar';`,

//----------------------------------------------------------------------

`source.addExportDeclaration({
  namedExports: ['ComponentA', 'ComponentB', 'ComponentC']
});`,

//----------------------------------------------------------------------

`source.addTypeAlias({
  name: "ExampleType",
  isExported: true,
  type: "string | number"
});`,

//----------------------------------------------------------------------

`export type ExampleType = string | number;`,

//----------------------------------------------------------------------

`source.addTypeAlias({
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
});`,

//----------------------------------------------------------------------

`export type ExampleType = string | number;
export type AnotherType = boolean;
export interface ExampleInterface {
  id: number;
  name: string;
}`,

//----------------------------------------------------------------------

`source.addImportDeclaration({
  moduleSpecifier: 'react',
  namedImports: [ 'useState', 'useEffect' ]
});`,

//----------------------------------------------------------------------

`import { useState, useEffect } from 'react';`,

//----------------------------------------------------------------------

`source.addImportDeclaration({
  moduleSpecifier: 'next',
  namedImports: [ 
    'NextApiRequest as Request', 
    'NextApiResponse as as Response' 
  ]
});`,

//----------------------------------------------------------------------

`import type { 
  NextApiRequest as Request, 
  NextApiResponse as Response
} from 'next';`,

//----------------------------------------------------------------------

`source.addImportDeclaration({
  moduleSpecifier: 'react',
  defaultImport: 'React'
});`,

//----------------------------------------------------------------------

`import React from 'react';`,

//----------------------------------------------------------------------

`// Load existing files
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
}`
];

//----------------------------------------------------------------------

export default function UnderstandingTsMorphBasics() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
    {/* Understanding ts-morph Basics  Section Content*/}
      <section id="understanding-ts-morph-basics">
        <H1>{_('4. Understanding ts-morph Basics')}</H1>
        <P>
          <Translate>
            Understanding the fundamental concepts of <C>ts-morph</C> is
            essential for effective plugin development. This section covers
            the core APIs, project management, source file manipulation,
            and code generation patterns that form the foundation of all
            <C>ts-morph</C> operations.
          </Translate>
        </P>
      </section>

      {/* Project and Source Files Section Content */}
      <section>
        <H2>{_('4.1. Project and Source Files')}</H2>
        <P>
          <Translate>
            The Project class is the entry point for all <C>ts-morph</C>
            operations, providing methods to create, load, and manage
            TypeScript source files. Understanding how to work with projects
            and source files is fundamental to building effective code
            generation plugins.
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20">
          {examples[0]}
        </Code>
      </section>

      {/* Adding Different Constructs Section Content */}
      <section>
        <H2>{_('4.2. Adding Different Constructs')}</H2>
        <P>
          <Translate>
            <C>ts-morph</C> provides comprehensive APIs for adding various
            TypeScript constructs including imports, classes, functions, 
            types, and enums. This section demonstrates the most commonly 
            used patterns for generating different types of TypeScript code.
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[1]}
        </Code>
      </section>

      {/* Exporting a Class Section Content */}
      <section>
        <H2>{_('4.3. Exporting a Class')}</H2>
        <P>
          <Translate>
            Creating and exporting classes is a common requirement in 
            TypeScript code generation. This example demonstrates the basic 
            pattern for generating classes with methods, including proper 
            export declarations and method implementations.
          </Translate>
        </P>
        <P>
          <Translate>
            A simple example of how to create a new TypeScript file with a 
            class and a method using <C>ts-morph</C> looks like the 
            following:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[2]}
        </Code>

        <P>
          <Translate>
            This code will create a new TypeScript file <C>newFile.ts</C> 
            with the following content:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[3]}
        </Code>
        <P>
          <Translate>
            You can use <C>isExported</C> or <C>isDefaultExport</C> to
            <C>export</C> or <C>export default</C> respectively. Also
            <C>statements</C> can be a string or an array of strings
            (<C>string[]</C>).
          </Translate>
        </P>
      </section>

      {/* Exporting a Function Section Content */}
      <section>
        <H2>{_('4.4. Exporting a Function')}</H2>
        <P>
          <Translate>
            Function generation at the source file level provides flexibility
            for creating utility functions, API endpoints, and standalone
            operations. This section shows how to create functions with 
            various configurations including async operations, parameters, 
            and return types.
          </Translate>
        </P>
        <P>
          <Translate>
            Similar to adding a method to a class, you can use 
            <C>addFunction</C> to add a function at the source file level. 
            An example of how to use <C>addFunction</C> to add a function 
            with arguments and a body looks like the following:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[4]}
        </Code>
        <P>
          <Translate>
            In the above example, <C>myFunction</C> takes two parameters,
            <C>param1</C> of type string and <C>param2</C> of type number.
            The function body contains two <C>console.log</C> statements.
          </Translate>
        </P>
        <P>
          <Translate>
            After running the above code, the content of <C>newFile.ts</C>
            would look like the following:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[5]}
        </Code>
      </section>

      {/* Exporting a Const Section Content */}
      <section>
        <H2>{_('4.5. Exporting a Const')}</H2>
        <P>
          <Translate>
            Constant declarations are essential for defining configuration
            values, default settings, and immutable data structures. The
            <C>addVariableStatement</C> method provides flexible options for
            creating various types of variable declarations with proper export
            handling.
          </Translate>
        </P>
        <P>
          <Translate>
            To export a constant in <C>ts-morph</C>, you can utilize the
            <C>addVariableStatement</C> method on a <C>SourceFile</C> object.
            This method allows you to add a variable declaration to the file,
            including the capability to export the declaration.
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[6]}
        </Code>
        <P>
          <Translate>
            The provided <C>ts-morph</C> script will generate the following
            code in the source file.
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[7]}
        </Code>
      </section>

      {/* Exporting an Object Section Content */}
      <section>
        <H2>{_('4.6. Exporting an Object')}</H2>
        <P>
          <Translate>
            Export declarations provide a clean way to re-export multiple
            entities from other modules or to export collections of related
            functionality. This pattern is commonly used in index files and
            module aggregation scenarios.
          </Translate>
        </P>
        <P>
          <Translate>
            To generate an export statement that directly exports multiple
            imported entities in a single line using <C>ts-morph</C>, you
            don't need to declare them as variables first. Instead, you can
            use the <C>addExportDeclaration</C> method directly after your
            imports. This approach is more straightforward and aligns with
            typical TypeScript import-export patterns.
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[8]}
        </Code>
      </section>

      {/* Exporting Types Section Content */}
      <section>
        <H2>{_('4.7. Exporting Types')}</H2>
        <P>
          <Translate>
            Type exports are crucial for creating reusable type definitions 
            that can be consumed by other modules. <C>ts-morph</C> provides 
            dedicated methods for creating both type aliases and interfaces 
            with proper export configurations.
          </Translate>
        </P>
        <P>
          <Translate>
            To export a single type, you can use the <C>addTypeAlias</C> or 
            <C>addInterface</C> method (depending on whether you are defining 
            an alias or an interface), and set the <C>isExported</C> property 
            to true. An example of exporting a type alias looks like the 
            following:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[9]}
        </Code>
        <P>
          <Translate>
            This will generate a file with the following content:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[10]}
        </Code>
        <P>
          <Translate>
            To export multiple types at the same time, you can add multiple 
            type declarations (either type aliases or interfaces) with the 
            <C>isExported</C> property set to true for each. Alternatively, 
            you can use the <C>addExportDeclaration</C> method to export 
            previously declared types. An example of declaring and exporting 
            multiple types looks like the following:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[11]}
        </Code>
        <P>
          <Translate>
            This will generate a file with the following content:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[12]}
        </Code>
      </section>

      {/* Importing Values Section Content */}
      <section>
        <H2>{_('4.8. Importing Values')}</H2>
        <P>
          <Translate>
            Import declarations are essential for bringing external 
            dependencies and modules into your generated code. The 
            <C>addImportDeclaration</C> method provides comprehensive options 
            for creating various types of import statements including named 
            imports, default imports, and type imports.
          </Translate>
        </P>
        <P>
          <Translate>
            To import a set of values from a module in <C>ts-morph</C>, you 
            can use the <C>addImportDeclaration</C> method on a 
            <C>SourceFile</C> object. This method allows you to add an import 
            declaration to the code file you are working with. Here's how to 
            use this method to import specific values from the <C>react</C> 
            module:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[13]}
        </Code>
        <P>
          <Translate>
            The provided <C>ts-morph</C> script will generate the following 
            code in the source file:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[14]}
        </Code>
        <P>
          <Translate>
            You can also import types like the following:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[15]}
        </Code>
        <P>
          <Translate>
            The above code renders the following:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[16]}
        </Code>
      </section>

      {/* Importing Defaults Section Content */}
      <section>
        <H2>{_('4.9. Importing Defaults')}</H2>
        <P>
          <Translate>
            Default imports are commonly used for importing the main export 
            from a module, such as React components or utility libraries. The 
            same <C>addImportDeclaration</C> method handles default imports 
            with a slightly different configuration.
          </Translate>
        </P>
        <P>
          <Translate>
            To import a default from a module in <C>ts-morph</C>, you can 
            also use the <C>addImportDeclaration</C> method:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[17]}
        </Code>
        <P>
          <Translate>
            This would create the following code:
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[18]}
        </Code>
      </section>

      {/* Working with Existing Code Section Content */}
      <section>
        <H2>{_('4.10. Working with Existing Code')}</H2>
        <P>
          <Translate>
            Working with existing code is a powerful feature of 
            <C>ts-morph</C> that allows you to modify, extend, and refactor 
            existing TypeScript files. This capability is essential for 
            plugins that need to augment or update existing codebases rather 
            than generating new files from scratch.
          </Translate>
        </P>
        <Code 
          copy 
          language="typescript" 
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[19]}
        </Code>
      </section>
    </>
  )
}
