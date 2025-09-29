//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const examples = [
  `// src/types.ts
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
}`,

  //----------------------------------------------------------------------

  `// src/plugin.ts
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
      
      console.log(\`✅ Generated TypeScript interfaces: \${this.config.output}\`);
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
    sourceFile.insertText(0, \`
/**
 * Generated TypeScript interfaces
 * Generated at: \${timestamp}
 * Source: \${this.config.input}
 * 
 * This file is auto-generated. Do not edit manually.
 */
\`);
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
        jsdocParts.push(\`@default \${JSON.stringify(property.default)}\`);
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
          return \`\${itemType}[]\`;
        }
        return 'any[]';
      case 'object':
        if (property.properties) {
          // Generate inline interface
          const props = Object.entries(property.properties)
            .map(([key, prop]) => {
              const type = this.mapSchemaTypeToTypeScript(prop);
              const optional = prop.required ? '' : '?';
              return \`\${key}\${optional}: \${type}\`;
            })
            .join('; ');
          return \`{ \${props} }\`;
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
        name: \`Create\${interfaceName}Input\`,
        isExported: this.config.exportType !== 'namespace',
        type: \`Omit<\${interfaceName}, 'id' | 'createdAt' | 'updatedAt'>\`,
      });

      // Generate Update input type (all fields optional)
      sourceFile.addTypeAlias({
        name: \`Update\${interfaceName}Input\`,
        isExported: this.config.exportType !== 'namespace',
        type: \`Partial<\${interfaceName}>\`,
      });

      // Generate keys type
      sourceFile.addTypeAlias({
        name: \`\${interfaceName}Keys\`,
        isExported: this.config.exportType !== 'namespace',
        type: \`keyof \${interfaceName}\`,
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
}`,

  //----------------------------------------------------------------------

  `// src/index.ts
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
}`,

  //----------------------------------------------------------------------

  `// examples/input.json
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
]`,

  //----------------------------------------------------------------------

  `npx ts-node src/index.ts examples/input.json examples/output.ts`,

  //----------------------------------------------------------------------

  `// examples/output.ts
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

export type AnyModel = User | Post;`
];

//----------------------------------------------------------------------

export default function CreateFirstPlugin() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
    {/* Creating Your First Plugin Section Content */}
      <section id="creating-your-first-plugin">
        <H1>{_('5. Creating Your First Plugin')}</H1>
        <P>
          <Translate>
            Creating your first plugin with <C>ts-morph</C> involves
            understanding the complete workflow from schema processing 
            to code generation. This comprehensive example demonstrates 
            building a TypeScript interface generator that transforms 
            JSON schemas into properly typed interfaces with full feature 
            support.
          </Translate>
        </P>
        <P>
          <Translate>
            Let's create a plugin that generates TypeScript interfaces 
            from JSON schema definitions. This will demonstrate the core 
            concepts of using <C>ts-morph</C> for code generation.
          </Translate>
        </P>

        <H2>{_('5.1. Define the Plugin Interface')}</H2>
        <P>
          <Translate>
            Defining clear interfaces for your plugin ensures type safety 
            and provides a solid foundation for implementation. This 
            section establishes the data structures and configuration 
            options that will guide the entire plugin development process.
          </Translate>
        </P>
        <P>
          <Translate>
            First, let's define the types for our plugin:
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[0]}
        </Code>

        <H2>{_('5.2. Core Plugin Implementation')}</H2>
        <P>
          <Translate>
            The core plugin implementation orchestrates the entire code
            generation process, from loading input schemas to generating and
            saving TypeScript files. This comprehensive class demonstrates
            best practices for plugin architecture and error handling.
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[1]}
        </Code>

        <H2>{_('5.3. Plugin Entry Point')}</H2>
        <P>
          <Translate>
            The plugin entry point provides a clean API for consumers and
            handles CLI integration. This section shows how to create both
            programmatic and command-line interfaces for your plugin, making
            it accessible in different usage scenarios.
          </Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[2]}
        </Code>

        <H2>{_('5.4. Example Usage')}</H2>
        <P>
          <Translate>
            Example usage demonstrates the plugin in action with realistic
            data structures. This comprehensive example shows how the plugin
            processes complex schemas with various property types,
            relationships, and validation rules.
          </Translate>
        </P>
        <P>
          <Translate>
            Create an example schema file:
          </Translate>
        </P>
        <Code
          copy
          language="json"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[3]}
        </Code>
        <P>
          <Translate>
            Run the plugin:
          </Translate>
        </P>
        <Code
          copy
          language="bash"
          className="bg-black text-white px-mx-10 px-mb-20"
        >
          {examples[4]}
        </Code>
        <P>
          <Translate>
            Generated output:
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
    </>
  )
}
