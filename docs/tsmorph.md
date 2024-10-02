# TS-MORPH

Besides idea parsing ideas to objects for generators, there aren't a 
lot of tools for generating code aside from string code in an array for 
each line of code. 

`ts-morph` provides an easier way to programmatically navigate and 
manipulate TypeScript and JavaScript code. It's great for manipulating 
existing TypeScript code, but it also provides functionality for 
creating new TypeScript code dynamically. With `ts-morph`, you can 
create a new TypeScript source file and then programmatically add 
imports, classes, interfaces, functions, variables, and more. You can 
visit [https://ts-morph.com/](https://ts-morph.com/) for the official 
documentation.

> Idea has no official relation to `ts-morph`.

The official documentation however is not complete and leaves out 
some of the common use cases. In that regard, we will try to document
these cases. 

## Statement Code

It's common practice to paste code in statements like this. `ts-morph`
will try to format the tabbing. You can also use a prettifier after 
it is done generating.

```js
source.addFunction({
  isExported: true,
  name: 'CreateHead',
  statements: `
    //hooks
    const { _ } = useLanguage();
    //render
    return (
      <HTMLHead>
        <title>{_('Create ${model.singular}')}</title>
      </HTMLHead>
    );`
});
```

## Exporting a Class

A simple example of how to create a new TypeScript file 
with a class and a method using `ts-morph` looks like the following

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

## Exporting a Function

Similar to adding a method to a class, you can use `addFunction` to add 
a function at the source file level. An example of how to use 
`addFunction` to add a function with arguments and a body looks like 
the following.

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

## Exporting a Const

To export a constant in `ts-morph`, you can utilize the 
`addVariableStatement` method on a `SourceFile` object. This method 
allows you to add a variable declaration to the file, including the 
capability to export the declaration. 

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

## Exporting an Object

To generate an export statement that directly exports multiple imported 
entities in a single line using `ts-morph`, you don't need to declare 
them as variables first. Instead, you can use the `addExportDeclaration` 
method directly after your imports. This approach is more 
straightforward and aligns with typical TypeScript 
import-export patterns.

```js
source.addExportDeclaration({
  namedExports: ['ComponentA', 'ComponentB', 'ComponentC']
});
```

## Exporting Types

To export a single type, you can use the addTypeAlias or addInterface 
method *(depending on whether you are defining an alias or an interface)*, 
and set the isExported property to true. An example of exporting a type 
alias looks like the following.

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

## Importing Values

To import a set of values from a module in `ts-morph`, you can use the 
`addImportDeclaration` method on a `SourceFile` object. This method 
allows you to add an import declaration to the code file you are 
working with. Here's how to use this method to import specific values 
from the `react` module.

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

## Importing Defaults

To import a a default from a module in `ts-morph`, you can also use 
the `addImportDeclaration` method.

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