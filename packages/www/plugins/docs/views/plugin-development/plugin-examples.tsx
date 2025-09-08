//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'stackpress/view/client';
//docs
import { H1, H2, H3, P, C, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Plugin Examples');
  const description = _(
    'Practical examples of common plugin implementations demonstrating real-world patterns and best practices'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/idea-logo-icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/idea-logo-icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

const typescriptInterfaceGeneratorExample = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface TypeGenConfig {
  output: string;
  namespace?: string;
  exportType?: 'named' | 'default';
}

export default async function generateInterfaces(
  props: PluginProps<{ config: TypeGenConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  let content = '';
  
  // Add namespace if specified
  if (config.namespace) {
    content += \`export namespace \${config.namespace} {\\n\`;
  }
  
  // Generate interfaces from models
  if (schema.model) {
    for (const [name, model] of Object.entries(schema.model)) {
      content += generateInterface(name, model);
    }
  }
  
  // Generate types from type definitions
  if (schema.type) {
    for (const [name, type] of Object.entries(schema.type)) {
      content += generateType(name, type);
    }
  }
  
  // Close namespace
  if (config.namespace) {
    content += '}\\n';
  }
  
  // Write to output file
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.writeFile(outputPath, content, 'utf8');
}

function generateInterface(name: string, model: any): string {
  let content = \`export interface \${name} {\\n\`;
  
  for (const column of model.columns || []) {
    const optional = column.required ? '' : '?';
    const type = mapToTypeScript(column.type);
    content += \`  \${column.name}\${optional}: \${type};\\n\`;
  }
  
  content += '}\\n\\n';
  return content;
}

function generateType(name: string, type: any): string {
  // Implementation for generating TypeScript types
  return \`export type \${name} = any; // TODO: Implement\\n\\n\`;
}

function mapToTypeScript(schemaType: string): string {
  const typeMap: Record<string, string> = {
    'String': 'string',
    'Number': 'number',
    'Boolean': 'boolean',
    'Date': 'Date',
    'JSON': 'any'
  };
  
  return typeMap[schemaType] || 'any';
}`
];

const enumGeneratorExample = [
  `import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';

export default async function generateEnums(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  if (!schema.enum) {
    console.log('No enums found in schema');
    return;
  }
  
  let content = '// Generated Enums\\n\\n';
  
  for (const [name, enumDef] of Object.entries(schema.enum)) {
    content += \`export enum \${name} {\\n\`;
    
    for (const [key, value] of Object.entries(enumDef)) {
      content += \`  \${key} = "\${value}",\\n\`;
    }
    
    content += '}\\n\\n';
  }
  
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.writeFile(outputPath, content, 'utf8');
  
  console.log(\`Generated enums: \${outputPath}\`);
}`
];

const cliInteractivePluginExample = [
  `import type { PluginWithCLIProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

export default async function interactiveGenerator(props: PluginWithCLIProps) {
  const { config, schema, transformer, cli } = props;
  
  // Use CLI for interactive prompts
  console.log(\`\\n🚀 Interactive Generator\`);
  console.log(\`Working Directory: \${cli.cwd}\`);
  console.log(\`Schema Extension: \${cli.extname}\`);
  
  // Process based on available schema elements
  const hasModels = schema.model && Object.keys(schema.model).length > 0;
  const hasEnums = schema.enum && Object.keys(schema.enum).length > 0;
  const hasTypes = schema.type && Object.keys(schema.type).length > 0;
  
  console.log(\`\\n📊 Schema Summary:\`);
  console.log(\`  Models: \${hasModels ? Object.keys(schema.model!).length : 0}\`);
  console.log(\`  Enums: \${hasEnums ? Object.keys(schema.enum!).length : 0}\`);
  console.log(\`  Types: \${hasTypes ? Object.keys(schema.type!).length : 0}\`);
  
  // Generate based on configuration
  const outputs: string[] = [];
  
  if (config.generateModels && hasModels) {
    const modelContent = generateModels(schema.model!);
    const modelPath = path.resolve(cli.cwd, 'generated/models.ts');
    await fs.mkdir(path.dirname(modelPath), { recursive: true });
    await fs.writeFile(modelPath, modelContent, 'utf8');
    outputs.push(modelPath);
  }
  
  if (config.generateEnums && hasEnums) {
    const enumContent = generateEnums(schema.enum!);
    const enumPath = path.resolve(cli.cwd, 'generated/enums.ts');
    await fs.mkdir(path.dirname(enumPath), { recursive: true });
    await fs.writeFile(enumPath, enumContent, 'utf8');
    outputs.push(enumPath);
  }
  
  // Report results
  console.log(\`\\n✅ Generated \${outputs.length} files:\`);
  outputs.forEach(file => console.log(\`  📄 \${file}\`));
}

function generateModels(models: Record<string, any>): string {
  // Implementation for generating models
  return '// Generated models\\n';
}

function generateEnums(enums: Record<string, any>): string {
  // Implementation for generating enums
  return '// Generated enums\\n';
}`
];

export function Body() {
  return (
    <main className="px-h-100-0 overflow-auto px-p-10">
      <H1>Plugin Examples</H1>
      <P>
        This section provides practical examples of common plugin implementations. These examples demonstrate real-world patterns and best practices for creating plugins that generate TypeScript interfaces, enums, and interactive CLI tools.
      </P>

      <H2>2.1. TypeScript Interface Generator</H2>
      <P>
        The TypeScript interface generator demonstrates how to create a plugin that processes schema models and types to generate TypeScript interface definitions. This example shows how to handle type mapping, optional properties, and namespace organization.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {typescriptInterfaceGeneratorExample[0]}
      </Code>

      <H2>2.2. Enum Generator</H2>
      <P>
        The enum generator plugin shows how to process schema enum definitions and convert them into TypeScript enum declarations. This example demonstrates simple schema processing and file generation patterns that can be adapted for other output formats.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {enumGeneratorExample[0]}
      </Code>

      <H2>2.3. CLI-Interactive Plugin</H2>
      <P>
        The CLI-interactive plugin demonstrates how to create plugins that provide rich command-line experiences. This example shows how to use the CLI properties for user interaction, progress reporting, and adaptive behavior based on the execution context.
      </P>

      <Code copy language='typescript' className='bg-black text-white'>
        {cliInteractivePluginExample[0]}
      </Code>

      <Nav
        prev={{ text: 'Plugin Development Guide', href: '/docs/plugin-development/plugin-development-guide' }}
        next={{ text: 'Plugin Configuration', href: '/docs/plugin-development/plugin-configuration' }}
      />
    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </Layout>
  );
}
  