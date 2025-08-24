# Test Data Generator Plugin Tutorial

This tutorial demonstrates how to create a plugin that generates mock data and test fixtures from `.idea` schema files. The plugin will transform your schema models into realistic test data for development, testing, and prototyping.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Plugin Structure](#plugin-structure)
4. [Implementation](#implementation)
5. [Schema Configuration](#schema-configuration)
6. [Usage Examples](#usage-examples)
7. [Advanced Features](#advanced-features)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

Test data generation is crucial for development and testing workflows. This plugin generates realistic mock data from your `.idea` schema, including:

- **Mock Data**: Realistic test data based on schema types
- **Fixtures**: Predefined test datasets for consistent testing
- **Factories**: Data generation functions for dynamic testing
- **Relationships**: Proper handling of model relationships
- **Customization**: Custom data generators and constraints

## Prerequisites

- Node.js 16+ and npm/yarn
- TypeScript 4.0+
- Faker.js 8.0+ (for realistic data generation)
- Basic understanding of testing concepts
- Familiarity with the `@stackpress/idea-transformer` library
- Understanding of `.idea` schema format

## Plugin Structure

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface TestDataConfig {
  output: string;
  format: 'json' | 'typescript' | 'javascript';
  count?: number;
  seed?: number;
  locale?: string;
  generateFactories?: boolean;
  generateFixtures?: boolean;
  customGenerators?: Record<string, string>;
  relationships?: boolean;
}

export default async function generateTestData(
  props: PluginProps<{ config: TestDataConfig }>
) {
  const { config, schema, transformer } = props;
  
  // Implementation here...
}
```

## Implementation

### Core Plugin Function

```typescript
export default async function generateTestData(
  props: PluginProps<{ config: TestDataConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate test data content
    let content = '';
    
    // Add file header and imports
    content += generateFileHeader(config);
    content += generateImports(config);
    
    // Generate data factories if requested
    if (config.generateFactories) {
      content += generateFactories(schema, config);
    }
    
    // Generate mock data
    if (schema.model) {
      content += generateMockData(schema.model, config);
    }
    
    // Generate fixtures if requested
    if (config.generateFixtures) {
      content += generateFixtures(schema, config);
    }
    
    // Generate main export
    content += generateMainExport(schema, config);
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(`✅ Test data generated: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Test data generation failed:', error.message);
    throw error;
  }
}
```

### Generation Functions

```typescript
function generateFileHeader(config: TestDataConfig): string {
  const timestamp = new Date().toISOString();
  return `/**
 * Generated Test Data and Fixtures
 * Generated at: ${timestamp}
 * Format: ${config.format}
 * Count: ${config.count || 10}
 * Seed: ${config.seed || 'random'}
 * 
 * This file is auto-generated. Do not edit manually.
 */

`;
}

function generateImports(config: TestDataConfig): string {
  let imports = '';
  
  if (config.format === 'typescript' || config.format === 'javascript') {
    imports += `import { faker } from '@faker-js/faker';\n\n`;
    
    if (config.seed) {
      imports += `// Set seed for reproducible data\nfaker.seed(${config.seed});\n\n`;
    }
    
    if (config.locale && config.locale !== 'en') {
      imports += `// Set locale\nfaker.setLocale('${config.locale}');\n\n`;
    }
  }
  
  return imports;
}

function generateFactories(schema: any, config: TestDataConfig): string {
  let content = '// Data Factories\n';
  
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
  
  return content + '\n';
}

function generateEnumFactory(enumName: string, enumDef: any, config: TestDataConfig): string {
  const values = Object.values(enumDef);
  const valuesArray = values.map(v => `"${v}"`).join(', ');
  
  return `export function generate${enumName}(): string {
  return faker.helpers.arrayElement([${valuesArray}]);
}

`;
}

function generateModelFactory(modelName: string, model: any, config: TestDataConfig): string {
  let content = `export function generate${modelName}(overrides: Partial<${modelName}> = {}): ${modelName} {
  return {
`;

  for (const column of model.columns || []) {
    const generator = generateFieldGenerator(column, config);
    content += `    ${column.name}: ${generator},\n`;
  }
  
  content += `    ...overrides,
  };
}

export function generate${modelName}Array(count: number = ${config.count || 10}): ${modelName}[] {
  return Array.from({ length: count }, () => generate${modelName}());
}

`;
  
  return content;
}

function generateFieldGenerator(column: any, config: TestDataConfig): string {
  // Check for custom generators first
  if (config.customGenerators && config.customGenerators[column.type]) {
    return config.customGenerators[column.type];
  }
  
  // Handle arrays
  if (column.multiple) {
    const baseGenerator = getBaseGenerator(column, config);
    const arraySize = column.attributes?.minLength || 1;
    const maxSize = column.attributes?.maxLength || 5;
    return `faker.helpers.multiple(() => ${baseGenerator}, { count: { min: ${arraySize}, max: ${maxSize} } })`;
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
        return `faker.lorem.words({ min: ${attributes.min}, max: ${attributes.max} })`;
      }
      return 'faker.lorem.words()';
      
    case 'Number':
    case 'Integer':
      const min = attributes.min || 1;
      const max = attributes.max || 1000;
      return `faker.number.int({ min: ${min}, max: ${max} })`;
      
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
        return `generate${type}()`;
      }
      return 'faker.lorem.word()';
  }
}

function generateMockData(models: Record<string, any>, config: TestDataConfig): string {
  if (config.format === 'json') {
    return generateJSONMockData(models, config);
  }
  
  let content = '// Mock Data\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    content += `export const mock${modelName}Data = generate${modelName}Array(${config.count || 10});\n`;
  }
  
  return content + '\n';
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
      return `id_${Math.random().toString(36).substr(2, 9)}`;
      
    default:
      return 'mock_value';
  }
}

function generateFixtures(schema: any, config: TestDataConfig): string {
  let content = '// Test Fixtures\n';
  
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      content += generateModelFixtures(modelName, model, config);
    }
  }
  
  return content;
}

function generateModelFixtures(modelName: string, model: any, config: TestDataConfig): string {
  const lowerName = modelName.toLowerCase();
  
  return `export const ${lowerName}Fixtures = {
  valid: generate${modelName}({
    // Override with specific test values
  }),
  
  minimal: generate${modelName}({
    // Minimal required fields only
    ${generateMinimalFields(model)}
  }),
  
  invalid: {
    // Invalid data for negative testing
    ${generateInvalidFields(model)}
  },
  
  edge: generate${modelName}({
    // Edge case values
    ${generateEdgeCaseFields(model)}
  }),
};

`;
}

function generateMinimalFields(model: any): string {
  const requiredFields = model.columns?.filter((col: any) => 
    col.required && !col.attributes?.id && !col.attributes?.default
  ) || [];
  
  return requiredFields.map((col: any) => {
    const value = getMinimalValue(col);
    return `${col.name}: ${value}`;
  }).join(',\n    ');
}

function generateInvalidFields(model: any): string {
  const fields = model.columns?.slice(0, 3) || []; // First 3 fields for example
  
  return fields.map((col: any) => {
    const invalidValue = getInvalidValue(col);
    return `${col.name}: ${invalidValue}`;
  }).join(',\n    ');
}

function generateEdgeCaseFields(model: any): string {
  const fields = model.columns?.slice(0, 3) || []; // First 3 fields for example
  
  return fields.map((col: any) => {
    const edgeValue = getEdgeCaseValue(col);
    return `${col.name}: ${edgeValue}`;
  }).join(',\n    ');
}

function getMinimalValue(column: any): string {
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
        return `"${'a'.repeat(column.attributes.max)}"`;
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
}

function generateMainExport(schema: any, config: TestDataConfig): string {
  if (config.format === 'json') {
    return ''; // JSON format doesn't need exports
  }
  
  let content = '// Main Export\nexport const testData = {\n';
  
  // Export factories
  if (config.generateFactories && schema.model) {
    content += '  factories: {\n';
    for (const modelName of Object.keys(schema.model)) {
      content += `    ${modelName}: generate${modelName},\n`;
      content += `    ${modelName}Array: generate${modelName}Array,\n`;
    }
    content += '  },\n';
  }
  
  // Export mock data
  if (schema.model) {
    content += '  mockData: {\n';
    for (const modelName of Object.keys(schema.model)) {
      content += `    ${modelName.toLowerCase()}: mock${modelName}Data,\n`;
    }
    content += '  },\n';
  }
  
  // Export fixtures
  if (config.generateFixtures && schema.model) {
    content += '  fixtures: {\n';
    for (const modelName of Object.keys(schema.model)) {
      content += `    ${modelName.toLowerCase()}: ${modelName.toLowerCase()}Fixtures,\n`;
    }
    content += '  },\n';
  }
  
  content += '};\n\nexport default testData;\n';
  
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
}
```

## Schema Configuration

Add the Test Data plugin to your `.idea` schema file:

```idea
plugin "./plugins/test-data.js" {
  output "./generated/test-data.ts"
  format "typescript"
  count 20
  seed 12345
  locale "en"
  generateFactories true
  generateFixtures true
  relationships true
  customGenerators {
    Email "faker.internet.email()"
    Password "faker.internet.password()"
    Slug "faker.lorem.slug()"
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `output` | `string` | **Required** | Output file path for test data |
| `format` | `'json'\|'typescript'\|'javascript'` | **Required** | Output format |
| `count` | `number` | `10` | Number of records to generate per model |
| `seed` | `number` | `undefined` | Seed for reproducible data generation |
| `locale` | `string` | `'en'` | Locale for faker.js data generation |
| `generateFactories` | `boolean` | `true` | Generate data factory functions |
| `generateFixtures` | `boolean` | `true` | Generate test fixtures |
| `customGenerators` | `object` | `{}` | Custom data generators for specific types |
| `relationships` | `boolean` | `false` | Handle model relationships |

## Usage Examples

### Basic Schema

```idea
enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

model User {
  id String @id @default("nanoid()")
  email String @email @required
  name String @min(2) @max(50) @required
  age Number @min(18) @max(120)
  role UserRole @default("USER")
  active Boolean @default(true)
  createdAt Date @default("now()")
}

model Post {
  id String @id @default("nanoid()")
  title String @required
  content String @required
  authorId String @required
  published Boolean @default(false)
  createdAt Date @default("now()")
}

plugin "./plugins/test-data.js" {
  output "./test-data.ts"
  format "typescript"
  count 15
  generateFactories true
  generateFixtures true
}
```

### Generated Test Data Usage

```typescript
import { 
  generateUser, 
  generateUserArray,
  mockUserData,
  userFixtures,
  testData 
} from './test-data';

// Using factories
const singleUser = generateUser();
const multipleUsers = generateUserArray(5);

// Using factories with overrides
const adminUser = generateUser({
  role: 'admin',
  email: 'admin@example.com'
});

// Using mock data
console.log('Mock users:', mockUserData);

// Using fixtures for testing
describe('User Service', () => {
  it('should create a valid user', () => {
    const result = userService.create(userFixtures.valid);
    expect(result).toBeDefined();
  });
  
  it('should handle minimal user data', () => {
    const result = userService.create(userFixtures.minimal);
    expect(result).toBeDefined();
  });
  
  it('should reject invalid user data', () => {
    expect(() => {
      userService.create(userFixtures.invalid);
    }).toThrow();
  });
  
  it('should handle edge cases', () => {
    const result = userService.create(userFixtures.edge);
    expect(result).toBeDefined();
  });
});
```

### Database Seeding

```typescript
import { testData } from './test-data';

// Seed database with test data
async function seedDatabase() {
  // Clear existing data
  await db.user.deleteMany();
  await db.post.deleteMany();
  
  // Insert mock data
  await db.user.createMany({
    data: testData.mockData.user
  });
  
  await db.post.createMany({
    data: testData.mockData.post
  });
  
  console.log('Database seeded with test data');
}

// Run seeding
seedDatabase().catch(console.error);
```

### API Testing

```typescript
import { userFixtures, generateUser } from './test-data';

describe('User API', () => {
  it('POST /users should create user with valid data', async () => {
    const response = await request(app)
      .post('/users')
      .send(userFixtures.valid)
      .expect(201);
    
    expect(response.body.email).toBe(userFixtures.valid.email);
  });
  
  it('POST /users should reject invalid data', async () => {
    await request(app)
      .post('/users')
      .send(userFixtures.invalid)
      .expect(400);
  });
  
  it('should handle bulk user creation', async () => {
    const users = Array.from({ length: 10 }, () => generateUser());
    
    const response = await request(app)
      .post('/users/bulk')
      .send({ users })
      .expect(201);
    
    expect(response.body.created).toBe(10);
  });
});
```

## Advanced Features

### Relationship Handling

```typescript
// Generate related data
function generateUserWithPosts(postCount: number = 3) {
  const user = generateUser();
  const posts = Array.from({ length: postCount }, () => 
    generatePost({ authorId: user.id })
  );
  
  return { user, posts };
}

// Generate normalized data
function generateNormalizedData() {
  const users = generateUserArray(5);
  const posts = users.flatMap(user => 
    generatePostArray(3).map(post => ({ ...post, authorId: user.id }))
  );
  
  return { users, posts };
}
```

### Custom Data Patterns

```typescript
// Generate data following specific patterns
function generateRealisticUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const username = faker.internet.userName({ firstName, lastName });
  
  return generateUser({
    name: `${firstName} ${lastName}`,
    email,
    username,
  });
}

// Generate time-series data
function generateTimeSeriesData(days: number = 30) {
  const data = [];
  const startDate = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    
    data.push(generateMetric({
      date,
      value: faker.number.int({ min: 100, max: 1000 }),
    }));
  }
  
  return data.reverse();
}
```

### Performance Testing Data

```typescript
// Generate large datasets for performance testing
function generateLargeDataset(size: number = 10000) {
  console.log(`Generating ${size} records...`);
  
  const batchSize = 1000;
  const batches = Math.ceil(size / batchSize);
  const data = [];
  
  for (let i = 0; i < batches; i++) {
    const batchData = generateUserArray(
      Math.min(batchSize, size - i * batchSize)
    );
    data.push(...batchData);
    
    if (i % 10 === 0) {
      console.log(`Generated ${i * batchSize} records...`);
    }
  }
  
  return data;
}
```

### Localized Data

```typescript
// Generate localized test data
function generateLocalizedUser(locale: string = 'en') {
  faker.setLocale(locale);
  
  return generateUser({
    name: faker.person.fullName(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    phone: faker.phone.number(),
  });
}

// Generate multi-locale dataset
function generateMultiLocaleData() {
  const locales = ['en', 'es', 'fr', 'de', 'ja'];
  const data = [];
  
  for (const locale of locales) {
    const users = Array.from({ length: 5 }, () => 
      generateLocalizedUser(locale)
    );
    data.push(...users);
  }
  
  return data;
}
```

## Best Practices

### 1. Consistent Data Generation

```typescript
// Use seeds for reproducible tests
faker.seed(12345);

// Create consistent test scenarios
const testScenarios = {
  newUser: () => generateUser({ createdAt: new Date() }),
  activeUser: () => generateUser({ active: true, lastLogin: new Date() }),
  inactiveUser: () => generateUser({ active: false, lastLogin: null }),
  adminUser: () => generateUser({ role: 'admin', permissions: ['all'] }),
};
```

### 2. Data Validation

```typescript
// Validate generated data
function validateGeneratedUser(user: User): boolean {
  return (
    user.email.includes('@') &&
    user.name.length >= 2 &&
    user.age >= 18 &&
    ['admin', 'user', 'guest'].includes(user.role)
  );
}

// Test data generators
describe('Data Generators', () => {
  it('should generate valid users', () => {
    const users = generateUserArray(100);
    users.forEach(user => {
      expect(validateGeneratedUser(user)).toBe(true);
    });
  });
});
```

### 3. Memory Management

```typescript
// Generate data in chunks for large datasets
function* generateUserChunks(totalCount: number, chunkSize: number = 1000) {
  for (let i = 0; i < totalCount; i += chunkSize) {
    const count = Math.min(chunkSize, totalCount - i);
    yield generateUserArray(count);
  }
}

// Usage
for (const chunk of generateUserChunks(100000, 1000)) {
  await processChunk(chunk);
}
```

### 4. Test Environment Setup

```typescript
// Setup test environment with fresh data
beforeEach(async () => {
  // Clear database
  await clearDatabase();
  
  // Seed with fresh test data
  const users = generateUserArray(10);
  await seedUsers(users);
  
  // Reset faker seed for consistent tests
  faker.seed(12345);
});
```

## Troubleshooting

### Common Issues

1. **Memory Issues with Large Datasets**
   ```typescript
   // Use streaming for large datasets
   function* streamTestData(count: number) {
     for (let i = 0; i < count; i++) {
       yield generateUser();
     }
   }
   
   // Process in batches
   const batchSize = 1000;
   for (let i = 0; i < totalCount; i += batchSize) {
     const batch = Array.from(
       { length: Math.min(batchSize, totalCount - i) },
       () => generateUser()
     );
     await processBatch(batch);
   }
   ```

2. **Inconsistent Test Results**
   ```typescript
   // Always use seeds for reproducible tests
   beforeAll(() => {
     faker.seed(12345);
   });
   
   // Reset state between tests
   beforeEach(() => {
     faker.seed(12345);
   });
   ```

3. **Unrealistic Data**
   ```typescript
   // Create realistic data patterns
   function generateRealisticEmail(name: string): string {
     const domain = faker.helpers.arrayElement([
       'gmail.com', 'yahoo.com', 'hotmail.com', 'company.com'
     ]);
     const username = name.toLowerCase().replace(/\s+/g, '.');
     return `${username}@${domain}`;
   }
   ```

### Debugging Tips

1. **Validate Generated Data**
   ```typescript
   // Add validation to generators
   function generateValidatedUser(): User {
     const user = generateUser();
     
     if (!validateUser(user)) {
       console.warn('Generated invalid user:', user);
       return generateValidatedUser(); // Retry
     }
     
     return user;
   }
   ```

2. **Log Generation Statistics**
   ```typescript
   // Track generation statistics
   const stats = {
     generated: 0,
     invalid: 0,
     retries: 0
   };
   
   function generateUserWithStats(): User {
     stats.generated++;
     const user = generateUser();
     
     if (!validateUser(user)) {
       stats.invalid++;
       stats.retries++;
       return generateUserWithStats();
     }
     
     return user;
   }
   ```

This tutorial provides a comprehensive foundation for creating test data generation plugins that can handle complex schemas and generate realistic, useful test data for development and testing workflows.

## Conclusion

The Test Data Generator plugin demonstrates how to create sophisticated data generation tools that can:

- **Generate Realistic Data**: Use Faker.js to create believable test data
- **Support Multiple Formats**: Output JSON, TypeScript, or JavaScript files
- **Handle Relationships**: Manage complex data relationships and constraints
- **Provide Flexibility**: Support custom generators and localization
- **Enable Testing**: Generate fixtures for comprehensive test coverage

### Key Benefits

1. **Consistent Testing**: Reproducible test data using seeds
2. **Realistic Data**: Faker.js integration for believable mock data
3. **Multiple Use Cases**: Support for unit tests, integration tests, and database seeding
4. **Performance Testing**: Generate large datasets for load testing
5. **Localization**: Support for multiple locales and languages

### Next Steps

1. **Extend Generators**: Add more sophisticated data generation patterns
2. **Add Relationships**: Implement complex relationship handling
3. **Performance Optimization**: Optimize for large dataset generation
4. **Custom Providers**: Create domain-specific data providers
5. **Integration**: Connect with testing frameworks and CI/CD pipelines

This plugin provides the foundation for building comprehensive test data generation systems that can significantly improve development and testing workflows by providing realistic, consistent, and customizable test data.
