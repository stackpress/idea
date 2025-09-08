import { H1, H2, P, C } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';
const examples = [
`// Add a class with decorators
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
});`,
`// Generate mapped types
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
  type: \`on\${Capitalize<T>}\`,
});`,
`// Add module declaration
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
});`,
`// Find and modify existing interfaces
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
deprecatedMethod?.remove();`
];
export default function AdvanceTsMorphPlugin() {


  return (
    <section id="6-advanced-ts-morph-features">
      <H1>6. Advanced ts-morph Features</H1>
      <P>
        Advanced ts-morph features enable sophisticated code generation scenarios including decorators, complex type systems, module declarations, and code manipulation. These features are essential for building production-ready plugins that handle enterprise-level requirements.
      </P>

      <H2>6.1. Working with Decorators</H2>
      <P>
        Decorators are essential for modern TypeScript applications, especially when working with frameworks like Angular, NestJS, or TypeORM. ts-morph provides comprehensive support for generating classes and methods with decorators.
      </P>
      <Code copy language='typescript' className="bg-black text-white">{examples[0]}</Code>

      <H2>6.2. Generating Complex Types</H2>
      <P>
        Complex type generation includes mapped types, conditional types, and template literal types that leverage TypeScript's advanced type system. These features enable the creation of sophisticated type-safe APIs and utility types.
      </P>
      <Code copy language='typescript' className="bg-black text-white">{examples[1]}</Code>

      <H2>6.3. Working with Modules</H2>
      <P>
        Module declarations and ambient modules are crucial for creating type definitions and extending existing libraries. This section covers both namespace-style modules and modern ES module patterns.
      </P>
      <Code copy language='typescript' className="bg-black text-white">{examples[2]}</Code>

      <H2>6.4. Manipulating Existing Code</H2>
      <P>
        Code manipulation capabilities allow plugins to modify existing TypeScript files, add new functionality, and refactor code structures. This is particularly useful for migration tools and code modernization plugins.
      </P>
      <Code copy language='typescript' className="bg-black text-white">{examples[3]}</Code>
    </section>
  )
}
