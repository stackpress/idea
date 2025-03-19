import type { PluginWithCLIProps, EnumConfig } from '@stackpress/idea';

import path from 'path';
import { Project, IndentationText } from 'ts-morph';

export default async function generate({ config, schema, cli }: PluginWithCLIProps) {
  // 1. Config
  //we need to know where to put this code...
  if (!config.output) {
    return cli.terminal.error('No output directory specified');
  }
  //code in typescript or javascript?
  const lang = config.lang || 'ts';
  // 2. Project
  //find the absolute path from the output config
  const destination = await cli.transformer.loader.absolute(config.output as string);
  //output directory from the destination
  const dirname = path.dirname(destination);
  //file name from the destination
  const filename = path.basename(destination);
  //start a ts-morph project
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../tsconfig.json'),
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