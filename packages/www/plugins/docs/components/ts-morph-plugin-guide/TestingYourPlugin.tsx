import { useLanguage, Translate } from 'r22n';
import { H1, P } from '../index.js'
import Code from '../Code.js'

const examples = [
`// tests/plugin.test.ts
import { TypeScriptInterfaceGenerator } from "../src/plugin";
import { PluginConfig, Schema } from "../src/types";
import { Project } from "ts-morph";
import fs from "fs/promises";
import path from "path";

describe("TypeScriptInterfaceGenerator", () => {
  const testOutputDir = path.join(__dirname, "output");
  
  beforeAll(async () => {
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rmdir(testOutputDir, { recursive: true });
  });

  test("should generate basic interface", async () => {
    const schema: Schema = {
      name: "TestUser",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        age: { type: "number" },
      },
      required: ["id", "name"],
    };

    const inputFile = path.join(testOutputDir, "test-input.json");
    const outputFile = path.join(testOutputDir, "test-output.ts");

    await fs.writeFile(inputFile, JSON.stringify(schema, null, 2));

    const config: PluginConfig = {
      input: inputFile,
      output: outputFile,
      generateComments: true,
    };

    const generator = new TypeScriptInterfaceGenerator(config);
    await generator.generate();

    // Verify the output
    const generatedContent = await fs.readFile(outputFile, "utf-8");
    
    expect(generatedContent).toContain("export interface TestUser");
    expect(generatedContent).toContain("id: string;");
    expect(generatedContent).toContain("name: string;");
    expect(generatedContent).toContain("age?: number;");
  });

  test("should generate utility types", async () => {
    const schema: Schema = {
      name: "Product",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        price: { type: "number" },
      },
      required: ["id", "name", "price"],
    };

    const inputFile = path.join(testOutputDir, "product-input.json");
    const outputFile = path.join(testOutputDir, "product-output.ts");

    await fs.writeFile(inputFile, JSON.stringify(schema, null, 2));

    const config: PluginConfig = {
      input: inputFile,
      output: outputFile,
      generateUtilityTypes: true,
    };

    const generator = new TypeScriptInterfaceGenerator(config);
    await generator.generate();

    const generatedContent = await fs.readFile(outputFile, "utf-8");
    
    expect(generatedContent).toContain("CreateProductInput");
    expect(generatedContent).toContain("UpdateProductInput");
    expect(generatedContent).toContain("ProductKeys");
  });

  test("should validate generated TypeScript", async () => {
    const schema: Schema = {
      name: "ValidatedInterface",
      properties: {
        id: { type: "string" },
        data: {
          type: "object",
          properties: {
            nested: { type: "boolean" },
          },
        },
      },
    };

    const inputFile = path.join(testOutputDir, "validated-input.json");
    const outputFile = path.join(testOutputDir, "validated-output.ts");

    await fs.writeFile(inputFile, JSON.stringify(schema, null, 2));

    const config: PluginConfig = {
      input: inputFile,
      output: outputFile,
    };

    const generator = new TypeScriptInterfaceGenerator(config);
    await generator.generate();

    // Validate the generated TypeScript compiles
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(outputFile);
    
    const diagnostics = sourceFile.getPreEmitDiagnostics();
    expect(diagnostics).toHaveLength(0);
  });
});`,
`npm test`
];

export default function TestingYourPlugin() {
  const { _ } = useLanguage();
  return (
    <section id="testing-your-plugin">
      <H1>{_('7. Testing Your Plugin')}</H1>
      <P>
        <Translate>
          Comprehensive testing ensures your plugin works correctly across 
          different scenarios and maintains reliability as it evolves. This 
          section covers unit testing, integration testing, and validation 
          strategies for ts-morph plugins.
        </Translate>
      </P>
      
      <P>
        <Translate>
          Create comprehensive tests for your plugin:
        </Translate>
      </P>
      <Code 
        copy 
        language='typescript' 
        className="bg-black text-white"
      >
        {examples[0]}
      </Code>
      
      <P>
        <Translate>
          Run tests:
        </Translate>
      </P>
      <Code 
        copy 
        language='bash' 
        className="bg-black text-white"
      >
        {examples[1]}
      </Code>
    </section>
  )
}
