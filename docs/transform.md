# Transforming an Idea

The following will describe how to transform an idea to reality. 
As an example, we will create a `plugin` that will process all the 
`enums` in `my.schema` to a JavaScript or TypeScript file that can 
be included in the same project. 

> "Ideas are worthless without execution" - Many People

In a new project folder, install `@stackpress/idea` and `ts-morph` with the 
following command.

```bash
$ npm i @stackpress/idea ts-morph
```

> `ts-morph` provides an easier way to programmatically navigate and 
manipulate TypeScript and JavaScript code.

You don't have to use `ts-morph`, but in this example makes it easier 
to digest what's going on. Create a new idea file called `my.idea` with 
the following code.

```js
// my.idea
plugin "./make-enums" {
  ts true
  output "./enums.ts"
}
// sample enum
enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}
// sample enum
enum Sizes {
  SM "Small"
  MD "Medium"
  LG "Large"
}
```

Next, create a `tsconfig.json` file and enter the following 
configuration. This config will be consumed in `ts-morph` later.

```js
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "esModuleInterop": true,
    "lib": [ "es2021", "es7", "es6", "dom" ],
    "module": "commonjs",
    "noUnusedLocals": true,
    "outDir": "./dist/",
    "preserveConstEnums": true,
    "resolveJsonModule": true,
    "removeComments": true,
    "sourceMap": false,
    "strict": true,
    "target": "es6",
    "skipLibCheck": true
  },
  "include": [ "src/**/*.ts" ],
  "exclude": [ "dist", "docs", "node_modules", "test"]
}
```

Create a file called `make-enums.js` and paste in the following code. 
The exported function in this file will be called by `idea` when 
the transform command is called via `$ npx idea` and configured in your
idea file. 

```js
// make-enums.js
exports.default = function transform({ config, schema, cli }) {
  //your code ...
}
```

By default `idea` will pass the plugin configuration from the schema,
the parsed schema data and a cli interface to the `transform` function.
The following shows ways to consume the `config` and `cli`.

```js
// make-enums.js
exports.default = function transform({ config, schema, cli }) {
  // 1. Config
  //we need to know where to put this code...
  if (!config.output) {
    return cli.terminal.error('No output directory specified');
  }
  //code in typescript or javascript?
  const lang = config.lang || 'ts';
  //your code ...
}
```

The above example assumes there will be an `output` and `lang` setting 
in the `config` object. These correlate to the configuration provided 
in `my.idea`. The next thing to do is set up a `ts-morph` project like
below.

```js
// make-enums.js
const path = require('path');
const { Project, IndentationText } = require('ts-morph');
const { Loader } = require('@stackpress/idea');

exports.default = function transform({ config, schema, cli }) {
  // 1. Config
  // ... (see above example)
  // 2. Project
  //find the absolute path from the output config
  const destination = Loader.absolute(config.output);
  //output directory from the destination
  const dirname = path.dirname(destination);
  //file name from the destination
  const filename = path.basename(destination);
  //start a ts-morph project
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, './tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: dirname,
      // Generates corresponding '.d.ts' file.
      declaration: true, 
      // Generates a sourcemap for each corresponding '.d.ts' file.
      declarationMap: true, 
      // Generates corresponding '.map' file.
      sourceMap: true
    },
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });
  //create the directory if it does not exist
  const directory = project.createDirectory(dirname);
  //create a source file to manually populate later...
  const source = directory.createSourceFile(filename, '', { overwrite: true });

  //your code ...
}
```

After the `ts-morph` project is setup we can start processing the enums 
with the following code.

```js
// make-enums.js
const path = require('path');
const { Project, IndentationText } = require('ts-morph');
const { Loader } = require('@stackpress/idea');

exports.default = function transform({ config, schema, cli }) {
  // 1. Config
  // ... (see above example)
  // 2. Project
  // ... (see above example)
  // 3. Enum
  //if there are enums...
  if (typeof schema.enum === 'object') {
    // Enums in schema object will look like this...
    // { 
    //   "plugin": { ... },
    //   "enum": {
    //     "Roles": {
    //       "ADMIN": "Admin",
    //       "MANAGER": "Manager",
    //       "USER": "User"
    //     }
    //   },
    //   "type": { ... },
    //   "model": { ... }
    // }
    //loop through enums
    for (const name in schema.enum) {
      //get all the possible enum members ("ADMIN", "MANAGER", "USER")
      const members = Object.keys(schema.enum[name]);
      //add enum using ts-morph
      source.addEnum({
        name: name,
        isExported: true,
        // { name: "ADMIN", value: "Admin" }
        members: members.map(key => ({ 
          name: key, 
          value: schema.enums[name][key]
        }))
      });
    }
  }

  //your code ...
}
```

The last thing to do is save the file with the following code.

```js
// make-enums.js
const path = require('path');
const { Project, IndentationText } = require('ts-morph');
const { Loader } = require('@stackpress/idea');

exports.default = function transform({ config, schema, cli }) {
  // 1. Config
  // ... (see above example)
  // 2. Project
  // ... (see above example)
  // 3. Enum
  // ... (see above example)
  // 4. Save
  source.formatText();
  //if you want ts, tsx files
  if (lang == 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
}
```

To run everything use the following command.

```bash
$ npx idea -i my.idea
```

This will create a new file in your project folder called `enums.ts`
with the following content.

```ts
// enums.ts
export enum Roles {
  ADMIN = "Admin"
  MANAGER = "Manager"
  USER = "User"
}

export enum Sizes {
  SM = "Small"
  MD = "Medium"
  LG = "Large"
}
```

The above example in TypeScript would look like the following.

```js
// make-enums.ts
import type { PluginWithCLIProps, EnumConfig } from '@stackpress/idea';

import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import { Loader } from '@stackpress/idea';

export default function generate({ config, schema, cli }: PluginWithCLIProps) {
  // 1. Config
  //we need to know where to put this code...
  if (!config.output) {
    return cli.terminal.error('No output directory specified');
  }
  //code in typescript or javascript?
  const lang = config.lang || 'ts';
  // 2. Project
  //find the absolute path from the output config
  const destination = Loader.absolute(config.output as string);
  //output directory from the destination
  const dirname = path.dirname(destination);
  //file name from the destination
  const filename = path.basename(destination);
  //start a ts-morph project
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, './tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: dirname,
      // Generates corresponding '.d.ts' file.
      declaration: true, 
      // Generates a sourcemap for each corresponding '.d.ts' file.
      declarationMap: true, 
      // Generates corresponding '.map' file.
      sourceMap: true, 
    },
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });
  //create the directory if it does not exist
  const directory = project.createDirectory(dirname);
  //create a source file to manually populate later...
  const source = directory.createSourceFile(filename, '', { overwrite: true });
  // 3. Enum
  //if there are enums...
  if (typeof schema.enum === 'object') {
    // Enums in schema object will look like this...
    // { 
    //   "plugin": { ... },
    //   "enum": {
    //     "Roles": {
    //       "ADMIN": "Admin",
    //       "MANAGER": "Manager",
    //       "USER": "User"
    //     }
    //   },
    //   "type": { ... },
    //   "model": { ... }
    // }
    //loop through enums
    for (const name in schema.enum) {
      //get enum
      const enums = schema.enum as Record<string, EnumConfig>;
      //get all the possible enum members ("ADMIN", "MANAGER", "USER")
      const members = Object.keys(enums[name]);
      //add enum using ts-morph
      source.addEnum({
        name: name,
        isExported: true,
        // { name: "ADMIN", value: "Admin" }
        members: members.map(key => ({ 
          name: key, 
          value: enums[name][key] as string
        }))
      });
    }
  }
  // 4. Save
  source.formatText();
  //if you want ts, tsx files
  if (lang == 'ts') {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
};
```

**Learn More:**

 - **Mapping** - Now that you understand what plugins do and how they related to ideas, 
you can learn more about the specific schema mappings [here](./mapping.md).
 - **TS-Morph** - Learn more about `ts-morph` [here](./tsmorph.md).