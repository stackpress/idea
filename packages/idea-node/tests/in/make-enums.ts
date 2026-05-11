import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Exception from '@stackpress/lib/Exception';
import { IndentationText, Project } from 'ts-morph';

import type { EnumConfig, PluginProps } from '../../src/index.js';

/**
 * Generates enum source files from the final schema so transformer tests can
 * exercise a realistic plugin boundary.
 */
function generate({ config, schema, cwd }: PluginProps) {
  const dirnameForModule = path.dirname(fileURLToPath(import.meta.url));

  if (!config.output) {
    throw Exception.for('No output directory specified');
  }

  const lang = config.lang || 'ts';
  const destination = path.resolve(cwd, config.output as string);
  const dirname = path.dirname(destination);
  const filename = path.basename(destination);
  const project = new Project({
    tsConfigFilePath: path.resolve(dirnameForModule, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: dirname,
      declaration: true,
      declarationMap: true,
      sourceMap: true
    },
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });

  const directory = project.createDirectory(dirname);
  const source = directory.createSourceFile(filename, '', { overwrite: true });

  if (typeof schema.enum === 'object') {
    for (const name in schema.enum) {
      const enums = schema.enum as Record<string, EnumConfig>;
      const members = Object.keys(enums[name]);

      source.addEnum({
        name,
        isExported: true,
        members: members.map(key => ({
          name: key,
          value: enums[name][key] as string
        }))
      });
    }
  }

  source.formatText();

  if (lang === 'ts') {
    project.saveSync();
  } else {
    project.emit();
  }
}

export default generate;
