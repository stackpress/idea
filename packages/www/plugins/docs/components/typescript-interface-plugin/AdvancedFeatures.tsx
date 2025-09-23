import { useLanguage, Translate } from 'r22n';
import { H2, H3, P, Code } from '../index.js';

const namespaceConfigurationExample = 
`// With namespace configuration
namespace: "MyApp"
exportType: "namespace"`;

const namespaceOutputExample = 
`// Generated output:
export namespace MyApp {
  export enum UserRole {
    ADMIN = "admin",
    USER = "user",
  }
  
  export interface User {
    id: string;
    name: string;
    role: UserRole;
  }
}`;

const standardEnumExample = 
`// Standard enum (default)
enumType: "enum"
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}`;

const unionTypeExample = 
`// Union type
enumType: "union"
export type UserRole = "admin" | "user";`;

const constAssertionExample = 
`// Const assertion
enumType: "const"
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];`;

const relationshipHandlingExample = 
`function handleRelationships(
  column: any, 
  config: TypeScriptConfig,
  availableTypes: Set<string>
): string {
  // Check if the column type is another model/type
  if (availableTypes.has(column.type)) {
    let type = column.type;
    
    if (column.multiple) {
      type = \`\${type}[]\`;
    }
    
    if (!column.required && config.strictNullChecks) {
      type = \`\${type} | null\`;
    }
    
    return type;
  }
  
  return formatPropertyType(column, config, availableTypes);
}`;

const genericTypeSupportExample = 
`function generateGenericTypes(
  models: Record<string, any>, 
  config: TypeScriptConfig
): string {
  let content = '// Generic Types\\n';
  
  // Generate paginated response type
  content += \`export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}\\n\\n\`;
  
  // Generate API response type
  content += \`export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}\\n\\n\`;
  
  return content;
}`;

export default function AdvancedFeatures() {
  const { _ } = useLanguage();

  return (
    <main>
      <section id="advanced-features">
        <H2>{_('Advanced Features')}</H2>
        <P>
          <Translate>
            Advanced features extend the basic TypeScript interface 
            generation with sophisticated organization, multiple enum types, 
            relationship handling, and generic type support. These features 
            enable production-ready TypeScript definitions that handle 
            complex scenarios.
          </Translate>
        </P>
      </section>

      <section>
        <H3>{_('Namespace Support')}</H3>
        <P>
          <Translate>
            Namespace support allows you to organize generated types within 
            TypeScript namespaces, preventing naming conflicts and providing 
            better code organization. This feature is particularly useful 
            for large projects with multiple schema files.
          </Translate>
        </P>
        <Code lang='typescript'>
          {namespaceConfigurationExample}
        </Code>
        <Code lang='typescript'>
          {namespaceOutputExample}
        </Code>
      </section>

      <section>
        <H3>{_('Different Enum Types')}</H3>
        <P>
          <Translate>
            Different enum types provide flexibility in how enumerations are 
            represented in TypeScript. The plugin supports standard enums, 
            union types, and const assertions, each with different runtime 
            characteristics and use cases.
          </Translate>
        </P>
        <Code lang='typescript'>
          {standardEnumExample}
        </Code>
        <Code lang='typescript'>
          {unionTypeExample}
        </Code>
        <Code lang='typescript'>
          {constAssertionExample}
        </Code>
      </section>

      <section>
        <H3>{_('Relationship Handling')}</H3>
        <P>
          <Translate>
            Relationship handling manages references between different types 
            and models in your schema. This ensures that type relationships 
            are properly represented in the generated TypeScript code with 
            correct type references and nullability handling.
          </Translate>
        </P>
        <Code lang='typescript'>
          {relationshipHandlingExample}
        </Code>
      </section>

      <section>
        <H3>{_('Generic Type Support')}</H3>
        <P>
          <Translate>
            Generic type support enables the generation of reusable type 
            definitions that work with multiple data types. This includes 
            common patterns like paginated responses and API response 
            wrappers that enhance type safety across your application.
          </Translate>
        </P>
        <Code lang='typescript'>
          {genericTypeSupportExample}
        </Code>
      </section>
    </main>
  );
}