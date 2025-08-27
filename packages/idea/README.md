<div align="center">
  <h1>💡 Idea</h1>
  <a href="https://www.npmjs.com/package/@stackpress/idea"><img src="https://img.shields.io/npm/v/@stackpress/idea.svg?style=flat" /></a>
  <a href="https://github.com/stackpress/idea/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat" /></a>
  <a href="https://github.com/stackpress/idea/commits/main/"><img src="https://img.shields.io/github/last-commit/stackpress/idea" /></a>
  <a href="https://github.com/stackpress/idea/actions"><img src="https://img.shields.io/github/actions/workflow/status/stackpress/idea/test.yml" /></a>
  <a href="https://coveralls.io/github/stackpress/idea?branch=main"><img src="https://coveralls.io/repos/github/stackpress/idea/badge.svg?branch=main" /></a>
  <a href="https://github.com/stackpress/idea/blob/main/docs/contribute.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <br />
  <br />
  <a href="https://github.com/stackpress/idea/blob/main/docs/Specifications.md">Form an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/stackpress/idea/blob/main/docs/plugins/README.md">Transform an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://marketplace.visualstudio.com/items?itemName=stackpress.idea-schema">Code Extension</a>
  <br />
  <hr />
</div>

> A meta language to express and transform your ideas to reality. 

## What is .idea?

The `.idea` file format is a declarative schema definition language designed to simplify application development by providing a **single source of truth** for data structures, relationships, and code generation. It enables developers to define their application's data model once and generate multiple outputs including database schemas, TypeScript interfaces, API documentation, forms, and more.

Think of it as the bridge between **AI prompting and full-stack code generation** - where a simple schema definition can automatically generate everything from database tables to React components, API endpoints to documentation sites.

## Key Benefits

### 🎯 Single Source of Truth
Define your data model once, use it everywhere. No more maintaining separate schemas for your database, frontend types, API documentation, and validation rules. One `.idea` file generates them all.

### 🛡️ Type Safety Across Languages
Generate type-safe code across multiple languages and frameworks. From TypeScript interfaces to Python data classes, from GraphQL schemas to Rust structs - maintain consistency and catch errors at compile time.

### ⚡ Rapid Development
Automatically generate boilerplate code, forms, documentation, and more. What used to take hours or days of manual coding now happens in seconds with a single command.

### 🔄 Perfect Consistency
Ensure consistent data structures across your entire application stack. When you update your schema, all generated code updates automatically, eliminating sync issues between frontend and backend.

### 🔌 Infinite Extensibility
The plugin system allows custom code generation for any target technology. Create plugins for new frameworks, languages, or tools - the possibilities are limitless.

### 🤖 AI-to-Code Bridge
Perfect for AI-driven development workflows. Describe your data model to an AI, get a `.idea` schema, and instantly generate production-ready code across your entire stack.

## Who Should Use This?

### 👨‍💻 Junior Developers
- **Easy-to-understand syntax** with comprehensive examples
- **Rapid prototyping** without deep framework knowledge
- **Learn best practices** through generated code patterns
- **Focus on business logic** instead of boilerplate

### 👩‍💻 Senior Developers
- **Powerful features** for complex applications
- **Extensible plugin system** for custom requirements
- **Cross-platform code generation** for polyglot architectures
- **Maintain consistency** across large codebases

### 👔 CTOs & Technical Leaders
- **Reduce development time** by 60-80% for common tasks
- **Improve code consistency** across teams and projects
- **Lower maintenance costs** with synchronized schemas
- **Accelerate time-to-market** for new features
- **Enable rapid experimentation** and prototyping

## The Plugin Ecosystem

The true power of `.idea` lies in its **plugin system** - a bridge from simple schema definitions to full-stack applications.

### 🌐 Multi-Language Support

Plugins can generate code for **any programming language**:

- **TypeScript/JavaScript**: Interfaces, types, validation schemas
- **Python**: Data classes, Pydantic models, SQLAlchemy schemas
- **Rust**: Structs, enums, serialization code
- **Go**: Structs, JSON tags, validation
- **Java**: POJOs, JPA entities, validation annotations
- **C#**: Classes, Entity Framework models
- **PHP**: Classes, Eloquent models, validation rules
- **And many more...**

### 🛠️ Framework Integration

Generate framework-specific code:

- **React**: Components, forms, hooks, contexts
- **Vue**: Components, composables, stores
- **Angular**: Components, services, models
- **Svelte**: Components, stores, actions
- **Next.js**: API routes, pages, middleware
- **Express**: Routes, middleware, controllers
- **FastAPI**: Routes, models, documentation
- **Django**: Models, serializers, views

### 🗄️ Database Support

Generate schemas for any database:

- **SQL**: PostgreSQL, MySQL, SQLite, SQL Server
- **NoSQL**: MongoDB, DynamoDB, Firestore
- **Graph**: Neo4j, ArangoDB
- **Time-series**: InfluxDB, TimescaleDB
- **Search**: Elasticsearch, Solr

### 📚 Documentation & Tools

Automatically generate:

- **API Documentation**: OpenAPI/Swagger specs
- **Database Documentation**: Schema diagrams, table docs
- **Form Generators**: HTML forms with validation
- **Test Data**: Realistic mock data and fixtures
- **Migration Scripts**: Database migration files
- **Configuration Files**: Environment configs, CI/CD setups

## Real-World Example

Here's how a simple e-commerce schema transforms into a full application:

```typescript
// schema.idea
enum UserRole {
  ADMIN "Administrator"
  CUSTOMER "Customer"
  VENDOR "Vendor"
}

type Address {
  street String @required
  city String @required
  country String @default("US")
}

model User {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  name String @required @field.input(Text)
  role UserRole @default("CUSTOMER")
  address Address?
  orders Order[] @relation(Order.userId)
  created Date @default("now()")
}

model Product {
  id String @id @default("nanoid()")
  name String @required @field.input(Text)
  price Number @required @field.input(Currency)
  description String @field.textarea
  category String @field.select
  inStock Boolean @default(true)
}

model Order {
  id String @id @default("nanoid()")
  userId String @relation(User.id)
  user User @relation(User, userId)
  items OrderItem[] @relation(OrderItem.orderId)
  total Number @required
  status OrderStatus @default("PENDING")
  created Date @default("now()")
}

// Plugin configurations
plugin "./plugins/typescript-generator.js" {
  output "./src/types/schema.ts"
}

plugin "./plugins/database-generator.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

plugin "./plugins/react-forms.js" {
  output "./src/components/forms/"
  framework "react"
  styling "tailwind"
}

plugin "./plugins/api-generator.js" {
  output "./src/api/"
  framework "express"
  includeValidation true
}
```

**From this single schema, generate:**

- ✅ TypeScript interfaces and types
- ✅ PostgreSQL database schema
- ✅ React form components with Tailwind CSS
- ✅ Express.js API routes with validation
- ✅ OpenAPI documentation
- ✅ Test data and fixtures
- ✅ Database migration files
- ✅ Validation schemas (Zod, Joi, etc.)

## AI-Powered Development Workflow

The `.idea` format is perfect for AI-driven development:

1. **Describe** your application to an AI assistant
2. **Generate** a `.idea` schema from the description
3. **Configure** plugins for your target technologies
4. **Execute** the transformation to generate full-stack code
5. **Iterate** by updating the schema and regenerating

This workflow enables rapid prototyping and development, making it possible to go from idea to working application in minutes rather than days.

## Getting Started

### 1. Installation

```bash
$ npm i -D @stackpress/idea
```

### 2. Create Your First Schema

Create a `schema.idea` file:

```typescript
model User {
  id String @id @default("nanoid()")
  name String @required
  email String @unique @required
  created Date @default("now()")
}

plugin "./plugins/typescript-generator.js" {
  output "./generated/types.ts"
}
```

### 3. Generate Code

```bash
npx idea transform --input schema.idea
```

### 4. Explore the Results

Check the generated files in your output directories!

## Documentation Structure

This documentation is organized into several sections:

### 📋 [Specifications](https://github.com/stackpress/idea/blob/main/docs/Specifications.md)
Complete reference for the `.idea` file format syntax, data types, and schema structure.

### 🔧 [Parser Documentation](https://github.com/stackpress/idea/blob/main/docs/parser/)
Technical documentation for the parser library that processes `.idea` files.

### 🔄 [Transformer Documentation](https://github.com/stackpress/idea/blob/main/docs/transformer/)
Documentation for the transformer library that executes plugins and generates code.

### 🔌 [Plugin Development](https://github.com/stackpress/idea/blob/main/docs/plugins/)
Comprehensive guides for creating custom plugins, including tutorials for:
- Database schema generators
- Form generators
- API documentation generators
- TypeScript interface generators
- And many more...

## The Future of Development

The `.idea` file format represents a paradigm shift in how we build applications:

- **From Manual to Automated**: Stop writing boilerplate, start defining intent
- **From Fragmented to Unified**: One schema, infinite outputs
- **From Reactive to Proactive**: Catch errors before they happen
- **From Slow to Instant**: Generate entire application layers in seconds

### Endless Possibilities

With the plugin system, you can generate:

- **Mobile Apps**: React Native, Flutter, native iOS/Android
- **Desktop Apps**: Electron, Tauri, native applications
- **Microservices**: Docker configs, Kubernetes manifests
- **Infrastructure**: Terraform, CloudFormation, Pulumi
- **Documentation**: Websites, PDFs, interactive guides
- **Testing**: Unit tests, integration tests, load tests
- **Monitoring**: Dashboards, alerts, metrics
- **And anything else you can imagine...**

## Start Building Today

Ready to transform your development workflow? 

1. **Read the [Specifications](https://github.com/stackpress/idea/blob/main/docs/Specifications.md)** to understand the syntax
2. **Explore [Plugin Tutorials](https://github.com/stackpress/idea/blob/main/docs/plugins/)** to see what's possible
3. **Build Something Amazing** with the power of declarative development

The future of application development is declarative, type-safe, and automated. Welcome to the `.idea` revolution! 🚀

---

> The line of code that’s the fastest to write, that never breaks, that doesn’t need maintenance, is the line you never had to write. - Steve Jobs
