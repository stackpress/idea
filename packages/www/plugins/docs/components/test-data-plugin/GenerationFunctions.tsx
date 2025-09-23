import Code from '../Code.js';

const factoriesExample = `function generateFactories(schema: any, config: TestDataConfig): string {
  let content = '// Data Factories\\n';
  
  // Generate enum factories
  if (schema.enum) {
    for (const [enumName, enumDef] of Object.entries(schema.enum)) {
      content += generateEnumFactory(enumName, enumDef, config);
    }
  }
  
  // Generate model factories
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      content += generateModelFactory(modelName, model, config);
    }
  }
  
  return content + '\\n';
}

function generateEnumFactory(enumName: string, enumDef: any, config: TestDataConfig): string {
  const values = Object.values(enumDef);
  const valuesArray = values.map(v => \`"\${v}"\`).join(', ');
  
  return \`export function generate\${enumName}(): string {
  return faker.helpers.arrayElement([\${valuesArray}]);
}

\`;
}

function generateModelFactory(modelName: string, model: any, config: TestDataConfig): string {
  let content = \`export function generate\${modelName}(overrides: Partial<\${modelName}> = {}): \${modelName} {
  return {
\`;

  for (const column of model.columns || []) {
    const generator = generateFieldGenerator(column, config);
    content += \`    \${column.name}: \${generator},\\n\`;
  }
  
  content += \`    ...overrides,
  };
}

export function generate\${modelName}Array(count: number = \${config.count || 10}): \${modelName}[] {
  return Array.from({ length: count }, () => generate\${modelName}());
}

\`;
  
  return content;
}`;

const fieldGeneratorExample = `function generateFieldGenerator(column: any, config: TestDataConfig): string {
  // Check for custom generators first
  if (config.customGenerators && config.customGenerators[column.type]) {
    return config.customGenerators[column.type];
  }
  
  // Handle arrays
  if (column.multiple) {
    const baseGenerator = getBaseGenerator(column, config);
    const arraySize = column.attributes?.minLength || 1;
    const maxSize = column.attributes?.maxLength || 5;
    return \`faker.helpers.multiple(() => \${baseGenerator}, { count: { min: \${arraySize}, max: \${maxSize} } })\`;
  }
  
  return getBaseGenerator(column, config);
}

function getBaseGenerator(column: any, config: TestDataConfig): string {
  const { type, attributes = {} } = column;
  
  // Handle custom field types based on attributes
  if (attributes.email) {
    return 'faker.internet.email()';
  }
  
  if (attributes.url) {
    return 'faker.internet.url()';
  }
  
  if (attributes.uuid) {
    return 'faker.string.uuid()';
  }
  
  if (attributes.phone) {
    return 'faker.phone.number()';
  }
  
  if (attributes.color) {
    return 'faker.internet.color()';
  }
  
  // Handle based on field name patterns
  const fieldName = column.name.toLowerCase();
  
  if (fieldName.includes('email')) {
    return 'faker.internet.email()';
  }
  
  if (fieldName.includes('name')) {
    if (fieldName.includes('first')) return 'faker.person.firstName()';
    if (fieldName.includes('last')) return 'faker.person.lastName()';
    if (fieldName.includes('full')) return 'faker.person.fullName()';
    return 'faker.person.fullName()';
  }
  
  if (fieldName.includes('address')) {
    return 'faker.location.streetAddress()';
  }
  
  if (fieldName.includes('city')) {
    return 'faker.location.city()';
  }
  
  if (fieldName.includes('country')) {
    return 'faker.location.country()';
  }
  
  if (fieldName.includes('phone')) {
    return 'faker.phone.number()';
  }
  
  if (fieldName.includes('company')) {
    return 'faker.company.name()';
  }
  
  if (fieldName.includes('title')) {
    return 'faker.lorem.sentence()';
  }
  
  if (fieldName.includes('description') || fieldName.includes('content')) {
    return 'faker.lorem.paragraphs()';
  }
  
  if (fieldName.includes('image') || fieldName.includes('avatar')) {
    return 'faker.image.url()';
  }
  
  if (fieldName.includes('price') || fieldName.includes('amount')) {
    return 'faker.commerce.price()';
  }
  
  // Handle based on schema type
  switch (type) {
    case 'String':
      if (attributes.min && attributes.max) {
        return \`faker.lorem.words({ min: \${attributes.min}, max: \${attributes.max} })\`;
      }
      return 'faker.lorem.words()';
      
    case 'Number':
    case 'Integer':
      const min = attributes.min || 1;
      const max = attributes.max || 1000;
      return \`faker.number.int({ min: \${min}, max: \${max} })\`;
      
    case 'Boolean':
      return 'faker.datatype.boolean()';
      
    case 'Date':
      if (fieldName.includes('birth')) {
        return 'faker.date.birthdate()';
      }
      if (fieldName.includes('future')) {
        return 'faker.date.future()';
      }
      if (fieldName.includes('past')) {
        return 'faker.date.past()';
      }
      return 'faker.date.recent()';
      
    case 'JSON':
      return 'faker.datatype.json()';
      
    case 'ID':
      return 'faker.string.uuid()';
      
    default:
      // Check if it's an enum or custom type
      if (type.endsWith('Role') || type.endsWith('Status') || type.endsWith('Type')) {
        return \`generate\${type}()\`;
      }
      return 'faker.lorem.word()';
  }
}`;

const mockDataExample = `function generateMockData(models: Record<string, any>, config: TestDataConfig): string {
  if (config.format === 'json') {
    return generateJSONMockData(models, config);
  }
  
  let content = '// Mock Data\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += \`export const mock\${modelName}Data = generate\${modelName}Array(\${config.count || 10});\\n\`;
  }
  
  return content + '\\n';
}

function generateJSONMockData(models: Record<string, any>, config: TestDataConfig): string {
  let content = '';
  const mockData: Record<string, any[]> = {};
  
  for (const [modelName, model] of Object.entries(models)) {
    const data = [];
    for (let i = 0; i < (config.count || 10); i++) {
      const item: Record<string, any> = {};
      
      for (const column of model.columns || []) {
        item[column.name] = generateMockValue(column, config);
      }
      
      data.push(item);
    }
    
    mockData[modelName.toLowerCase()] = data;
  }
  
  return JSON.stringify(mockData, null, 2);
}

function generateMockValue(column: any, config: TestDataConfig): any {
  const { type, attributes = {} } = column;
  
  // Simple mock value generation for JSON format
  switch (type) {
    case 'String':
      if (attributes.email) return 'user@example.com';
      if (attributes.url) return 'https://example.com';
      if (column.name.toLowerCase().includes('name')) return 'John Doe';
      return 'Sample Text';
      
    case 'Number':
    case 'Integer':
      return Math.floor(Math.random() * 1000) + 1;
      
    case 'Boolean':
      return Math.random() > 0.5;
      
    case 'Date':
      return new Date().toISOString();
      
    case 'ID':
      return \`id_\${Math.random().toString(36).substr(2, 9)}\`;
      
    default:
      return 'mock_value';
  }
}`;

const fixturesExample = `function generateFixtures(schema: any, config: TestDataConfig): string {
  let content = '// Test Fixtures\\n';
  
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      content += generateModelFixtures(modelName, model, config);
    }
  }
  
  return content;
}

function generateModelFixtures(modelName: string, model: any, config: TestDataConfig): string {
  const lowerName = modelName.toLowerCase();
  
  return \`export const \${lowerName}Fixtures = {
  valid: generate\${modelName}({
    // Override with specific test values
  }),
  
  minimal: generate\${modelName}({
    // Minimal required fields only
    \${generateMinimalFields(model)}
  }),
  
  invalid: {
    // Invalid data for negative testing
    \${generateInvalidFields(model)}
  },
  
  edge: generate\${modelName}({
    // Edge case values
    \${generateEdgeCaseFields(model)}
  }),
};

\`;
}`;

const fixtureUtilsExample = `function generateMinimalFields(model: any): string {
  const requiredFields = model.columns?.filter((col: any) => 
    col.required && !col.attributes?.id && !col.attributes?.default
  ) || [];
  
  return requiredFields.map((col: any) => {
    const value = getMinimalValue(col);
    return \`\${col.name}: \${value}\`;
  }).join(',\\n    ');
}

function generateInvalidFields(model: any): string {
  const fields = model.columns?.slice(0, 3) || []; // First 3 fields for example
  
  return fields.map((col: any) => {
    const invalidValue = getInvalidValue(col);
    return \`\${col.name}: \${invalidValue}\`;
  }).join(',\\n    ');
}

function generateEdgeCaseFields(model: any): string {
  const fields = model.columns?.slice(0, 3) || []; // First 3 fields for example
  
  return fields.map((col: any) => {
    const edgeValue = getEdgeCaseValue(col);
    return \`\${col.name}: \${edgeValue}\`;
  }).join(',\\n    ');
}`;

const valueGeneratorsExample = `function getMinimalValue(column: any): string {
  switch (column.type) {
    case 'String':
      return '"a"';
    case 'Number':
    case 'Integer':
      return column.attributes?.min || '1';
    case 'Boolean':
      return 'true';
    case 'Date':
      return 'new Date()';
    default:
      return '""';
  }
}

function getInvalidValue(column: any): string {
  switch (column.type) {
    case 'String':
      if (column.attributes?.email) return '"invalid-email"';
      if (column.attributes?.min) return '""'; // Too short
      return 'null';
    case 'Number':
    case 'Integer':
      return '"not-a-number"';
    case 'Boolean':
      return '"not-boolean"';
    case 'Date':
      return '"invalid-date"';
    default:
      return 'null';
  }
}

function getEdgeCaseValue(column: any): string {
  switch (column.type) {
    case 'String':
      if (column.attributes?.max) {
        return \`"\${'a'.repeat(column.attributes.max)}"\`;
      }
      return '"very long string that might cause issues with processing or display"';
    case 'Number':
    case 'Integer':
      return column.attributes?.max || '999999';
    case 'Boolean':
      return 'false';
    case 'Date':
      return 'new Date("1900-01-01")';
    default:
      return '""';
  }
}`;

const mainExportExample = `function generateMainExport(schema: any, config: TestDataConfig): string {
  if (config.format === 'json') {
    return ''; // JSON format doesn't need exports
  }
  
  let content = '// Main Export\\nexport const testData = {\\n';
  
  // Export factories
  if (config.generateFactories && schema.model) {
    content += '  factories: {\\n';
    for (const modelName of Object.keys(schema.model)) {
      content += \`    \${modelName}: generate\${modelName},\\n\`;
      content += \`    \${modelName}Array: generate\${modelName}Array,\\n\`;
    }
    content += '  },\\n';
  }
  
  // Export mock data
  if (schema.model) {
    content += '  mockData: {\\n';
    for (const modelName of Object.keys(schema.model)) {
      content += \`    \${modelName.toLowerCase()}: mock\${modelName}Data,\\n\`;
    }
    content += '  },\\n';
  }
  
  // Export fixtures
  if (config.generateFixtures && schema.model) {
    content += '  fixtures: {\\n';
    for (const modelName of Object.keys(schema.model)) {
      content += \`    \${modelName.toLowerCase()}: \${modelName.toLowerCase()}Fixtures,\\n\`;
    }
    content += '  },\\n';
  }
  
  content += '};\\n\\nexport default testData;\\n';
  
  return content;
}

function validateConfig(config: any): asserts config is TestDataConfig {
  if (!config.output || typeof config.output !== 'string') {
    throw new Error('Test Data plugin requires "output" configuration as string');
  }
  
  if (!config.format || !['json', 'typescript', 'javascript'].includes(config.format)) {
    throw new Error('format must be one of: json, typescript, javascript');
  }
  
  if (config.count && (typeof config.count !== 'number' || config.count < 1)) {
    throw new Error('count must be a positive number');
  }
}`;

export default function GenerationFunctions() {
  return (
    <section id="generation-functions">
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {factoriesExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5'>
        {fieldGeneratorExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5' >
        {mockDataExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5' >
        {fixturesExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5' >
        {fixtureUtilsExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5' >
        {valueGeneratorsExample}
      </Code>
      <Code copy language='typescript' className='bg-black text-white mb-5' >
        {mainExportExample}
      </Code>
    </section>
  );
}