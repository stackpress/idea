# Idea File Format Specification

A comprehensive guide to the `.idea` schema file format for defining application data structures, relationships, and code generation configurations.

## Table of Contents

- [Introduction](#introduction)
- [Syntax Overview](#syntax-overview)
- [Data Types](#data-types)
  - [Enum](#enum)
  - [Prop](#prop)
  - [Type](#type)
  - [Model](#model)
- [Schema Elements](#schema-elements)
- [Schema Structure](#schema-structure)
- [Schema Directives](#schema-directives)
  - [Use](#use)
  - [Plugin](#plugin)
- [Processing Flow](#processing-flow)
- [Plugin System](#plugin-system)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)
- [Error Handling](#error-handling)

## Introduction

The `.idea` file format is a declarative schema definition language designed to simplify application development by providing a single source of truth for data structures, relationships, and code generation. It enables developers to define their application's data model once and generate multiple outputs including database schemas, TypeScript interfaces, API documentation, forms, and more.

### Key Benefits

- **Single Source of Truth**: Define your data model once, use it everywhere
- **Type Safety**: Generate type-safe code across multiple languages and frameworks
- **Rapid Development**: Automatically generate boilerplate code, forms, and documentation
- **Consistency**: Ensure consistent data structures across your entire application
- **Extensibility**: Plugin system allows custom code generation for any target

### Who Should Use This

- **Junior Developers**: Easy-to-understand syntax with comprehensive examples
- **Senior Developers**: Powerful features for complex applications
- **CTOs/Technical Leaders**: Reduce development time and improve code consistency

## Syntax Overview

The `.idea` file format uses a simplified syntax that eliminates the need for traditional separators like commas (`,`) and colons (`:`) found in JSON or JavaScript. The parser can logically determine separations, making the syntax cleaner and more readable.

### Key Syntax Rules

1. **No Separators Required**: The parser intelligently determines where values begin and end
2. **Double Quotes Only**: All strings must use double quotes (`"`) - single quotes are not supported
3. **Logical Structure**: The parser understands context and can differentiate between keys, values, and nested structures

### Syntax Comparison

**Traditional JavaScript/JSON:**

```javascript
// JavaScript object
{ foo: "bar", bar: "foo" }

// JavaScript array
[ "foo", "bar" ]

// Nested structure
{
  user: {
    name: "John",
    age: 30,
    active: true
  },
  tags: ["admin", "user"]
}
```

**Equivalent .idea syntax:**

```ts
// Object structure
{ foo "bar" bar "foo" }

// Array structure
[ "foo" "bar" ]

// Nested structure
{
  user {
    name "John"
    age 30
    active true
  }
  tags ["admin" "user"]
}
```

### Data Type Representation

```ts
// Strings - always use double quotes
name "John Doe"
description "A comprehensive user management system"

// Numbers - no quotes needed
age 30
price 99.99
count -5

// Booleans - no quotes needed
active true
verified false

// Arrays - space-separated values
tags ["admin" "user" "moderator"]
numbers [1 2 3 4 5]
mixed ["text" 123 true]

// Objects - nested key-value pairs
profile {
  firstName "John"
  lastName "Doe"
  settings {
    theme "dark"
    notifications true
  }
}
```

### Comments

Comments in `.idea` files use the standard `//` syntax:

```ts
// This is a single-line comment
model User {
  id String @id // Inline comment
  name String @required
  // Another comment
  email String @unique
}

/*
  Multi-line comments are also supported
  for longer explanations
*/
```

## Data Types

The `.idea` format supports four primary data types that form the building blocks of your application schema.

### Enum

Enums define a set of named constants with associated values, perfect for representing fixed sets of options like user roles, status values, or categories.

#### Syntax

```ts
enum EnumName {
  KEY1 "Display Value 1"
  KEY2 "Display Value 2"
  KEY3 "Display Value 3"
}
```

#### Structure

- **EnumName**: The identifier used to reference this enum
- **KEY**: The constant name (typically uppercase)
- **"Display Value"**: Human-readable label for the constant

#### Example

```ts
enum UserRole {
  ADMIN "Administrator"
  MODERATOR "Moderator"
  USER "Regular User"
  GUEST "Guest User"
}

enum OrderStatus {
  PENDING "Pending Payment"
  PAID "Payment Confirmed"
  SHIPPED "Order Shipped"
  DELIVERED "Order Delivered"
  CANCELLED "Order Cancelled"
}

enum Priority {
  LOW "Low Priority"
  MEDIUM "Medium Priority"
  HIGH "High Priority"
  URGENT "Urgent"
}
```

#### Generated Output

When processed, enums generate language-specific constants:

**TypeScript:**

```typescript
export enum UserRole {
  ADMIN = "Administrator",
  MODERATOR = "Moderator",
  USER = "Regular User",
  GUEST = "Guest User"
}
```

**JSON:**

```typescript
{
  "enum": {
    "UserRole": {
      "ADMIN": "Administrator",
      "MODERATOR": "Moderator",
      "USER": "Regular User",
      "GUEST": "Guest User"
    }
  }
}
```

### Prop

Props are reusable property configurations that define common field behaviors, validation rules, and UI components. They promote consistency and reduce duplication across your schema.

#### Syntax

```ts
prop PropName {
  property "value"
  nested {
    property "value"
  }
}
```

#### Structure

- **PropName**: The identifier used to reference this prop
- **property**: Configuration key-value pairs
- **nested**: Grouped configuration options

#### Example

```ts
prop Email {
  type "email"
  format "email"
  validation {
    required true
    pattern "^[^\s@]+@[^\s@]+\.[^\s@]+$"
  }
  ui {
    component "EmailInput"
    placeholder "Enter your email address"
    icon "envelope"
  }
}

prop Password {
  type "password"
  validation {
    required true
    minLength 8
    pattern "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]"
  }
  ui {
    component "PasswordInput"
    placeholder "Enter a secure password"
    showStrength true
  }
}

prop Currency {
  type "number"
  format "currency"
  validation {
    min 0
    precision 2
  }
  ui {
    component "CurrencyInput"
    symbol "$"
    locale "en-US"
  }
}
```

#### Usage in Models

Props are referenced using the `@field` attribute:

```ts
model User {
  email String @field.input(Email)
  password String @field.input(Password)
}
```

### Type

Types define custom data structures with multiple columns, similar to objects or structs in programming languages. They're perfect for representing complex data that doesn't warrant a full model.

#### Syntax

```ts
type TypeName {
  columnName DataType @attribute1 @attribute2
  anotherColumn DataType @attribute
}
```

#### Structure

- **TypeName**: The identifier used to reference this type
- **columnName**: The field name within the type
- **DataType**: The data type (String, Number, Boolean, Date, etc.)
- **@attribute**: Optional attributes for validation, UI, or behavior

#### Example

```ts
type Address {
  street String @required @field.input(Text)
  city String @required @field.input(Text)
  state String @field.select
  postalCode String @field.input(Text)
  country String @default("US") @field.select
  coordinates {
    latitude Number @field.input(Number)
    longitude Number @field.input(Number)
  }
}

type ContactInfo {
  email String @required @field.input(Email)
  phone String @field.input(Phone)
  website String @field.input(URL)
  socialMedia {
    twitter String @field.input(Text)
    linkedin String @field.input(Text)
    github String @field.input(Text)
  }
}

type Money {
  amount Number @required @field.input(Currency)
  currency String @default("USD") @field.select
  exchangeRate Number @field.input(Number)
}
```

#### Usage in Models

Types are used as column data types:

```ts
model Company {
  name String @required
  address Address @required
  contact ContactInfo
  revenue Money
}
```

### Model

Models represent the core entities in your application, typically corresponding to database tables or API resources. They define the structure, relationships, and behavior of your data.

#### Syntax

```ts
model ModelName {
  columnName DataType @attribute1 @attribute2
  relationColumn RelatedModel @relation
}

model ModelName! {  // Mutable model
  // columns...
}
```

#### Structure

- **ModelName**: The identifier for this model
- **!**: Optional non-mergeable indicator (prevents automatic merging when using `use` directives)
- **columnName**: The field name
- **DataType**: Built-in types (String, Number, Boolean, Date) or custom types/enums
- **@attribute**: Attributes for validation, relationships, UI, etc.

#### Merging Behavior

By default, when importing schemas with `use` directives, models with the same name are automatically merged. The `!` suffix prevents this behavior:

```ts
// base-schema.idea
model User {
  id String @id
  name String @required
}

// extended-schema.idea
use "./base-schema.idea"

// This will merge with the imported User model
model User {
  email String @required
  created Date @default("now()")
}

// This will NOT merge - it completely replaces the imported User
model User! {
  id String @id
  username String @required
  password String @required
}
```

#### Example

```ts
model User! {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  username String @unique @required @field.input(Text)
  password String @required @field.input(Password)
  profile UserProfile?
  role UserRole @default("USER")
  active Boolean @default(true)
  lastLogin Date?
  created Date @default("now()")
  updated Date @default("updated()")
}

model UserProfile {
  id String @id @default("nanoid()")
  userId String @relation(User.id)
  firstName String @required @field.input(Text)
  lastName String @required @field.input(Text)
  bio String @field.textarea
  avatar String @field.upload
  address Address
  contact ContactInfo
  preferences {
    theme String @default("light")
    language String @default("en")
    notifications Boolean @default(true)
  }
}

model Post {
  id String @id @default("nanoid()")
  title String @required @field.input(Text)
  slug String @unique @generated
  content String @required @field.richtext
  excerpt String @field.textarea
  authorId String @relation(User.id)
  author User @relation(User, authorId)
  status PostStatus @default("DRAFT")
  tags String[] @field.tags
  publishedAt Date?
  created Date @default("now()")
  updated Date @default("updated()")
}

enum PostStatus {
  DRAFT "Draft"
  PUBLISHED "Published"
  ARCHIVED "Archived"
}
```

## Schema Elements

### Attributes (@)

Attributes provide metadata and configuration for columns, types, and models. They define validation rules, UI components, relationships, and behavior. Attributes can be attached to any schema element and are processed by plugins according to their specific needs.

> There are no reserved or pre-defined attributes in idea. You can define any arbitrary attributes in your schema. It's up to the plugins to recognize and process them.

#### Attribute Syntax

Attributes always start with the at symbol (`@`) followed by letters, numbers, and periods. They can be expressed in several forms:

```ts
// Simple boolean attribute (sets value to true)
@filterable

// Function with single argument
@label("Name")

// Function with multiple arguments
@is.cgt(3 "Name should be more than 3 characters")

// Function with object argument
@view.image({ width 100 height 100 })

// Nested attribute names using periods
@field.input(Email)
@validation.required
@ui.component("CustomInput")
```

#### Attribute Value Types

Attributes can hold different types of values:

```ts
// Boolean (implicit true)
@required
@unique
@filterable

// String values
@label("User Name")
@placeholder("Enter your name")
@description("This field is required")

// Number values
@min(0)
@max(100)
@precision(2)

// Object values
@validation({ required true minLength 3 })
@ui({ component "Input" placeholder "Enter text" })
@options({ multiple true searchable false })

// Array values
@tags(["admin" "user" "guest"])
@options(["small" "medium" "large"])
@toolbar(["bold" "italic" "underline"])

// Mixed arguments
@between(1 100 "Value must be between 1 and 100")
@pattern("^[a-zA-Z]+$" "Only letters allowed")
```

#### Attribute Scope

Attributes can be applied to different schema elements:

```ts
// Model-level attributes
model User @table("users") @index(["email" "created"]) {
  // Column-level attributes
  id String @id @default("nanoid()")
  name String @required @minLength(2)
}

// Type-level attributes
type Address @serializable @cacheable(3600) {
  street String @required
  city String @required
}
```

### Columns

Columns define the individual fields within models and types, specifying their data type, constraints, and behavior.

#### Data Types

| Type | Description | Example |
|------|-------------|---------|
| `String` | Text data | `name String` |
| `Number` | Numeric data | `age Number` |
| `Boolean` | True/false values | `active Boolean` |
| `Date` | Date/time values | `created Date` |
| `JSON` | JSON objects | `metadata JSON` |
| `CustomType` | User-defined types | `address Address` |
| `EnumType` | Enum values | `role UserRole` |

#### Optional and Array Types

```ts
model User {
  name String          // Required string
  bio String?          // Optional string
  tags String[]        // Array of strings
  addresses Address[]  // Array of custom types
  metadata JSON?       // Optional JSON
}
```

#### Nested Objects

```ts
model User {
  profile {
    firstName String
    lastName String
    social {
      twitter String?
      github String?
    }
  }
  settings {
    theme String @default("light")
    notifications Boolean @default(true)
  }
}
```

## Schema Structure

A complete `.idea` schema file can contain multiple elements organized in a specific structure:

```ts
// 1. Plugin declarations
plugin "./plugins/generate-types.js" {
  output "./generated/types.ts"
}

plugin "./plugins/generate-database.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

// 2. Use statements (imports)
use "./shared/common-types.idea"
use "./auth/user-types.idea"

// 3. Prop definitions
prop Email {
  type "email"
  validation { required true }
}

prop Text {
  type "text"
  validation { maxLength 255 }
}

// 4. Enum definitions
enum UserRole {
  ADMIN "Administrator"
  USER "Regular User"
}

// 5. Type definitions
type Address {
  street String @required
  city String @required
  country String @default("US")
}

// 6. Model definitions
model User! {
  id String @id @default("nanoid()")
  email String @unique @field.input(Email)
  name String @field.input(Text)
  role UserRole @default("USER")
  address Address?
  active Boolean @default(true)
  created Date @default("now()")
}
```

## Schema Directives

Schema directives are special declarations that control how the schema is processed and what outputs are generated.

### Use

The `use` directive imports definitions from other `.idea` files, enabling modular schema organization and reusability. When importing, data types with the same name are automatically merged unless the `!` (non-mergeable) indicator is used.

#### Syntax

```ts
use "package/to/schema.idea"
use "./relative/path/schema.idea"
use "../parent/directory/schema.idea"
```

#### Structure

- **Path**: Relative or absolute path to the `.idea` file to import
- **Automatic Merging**: Data types with matching names are merged by default
- **Merge Prevention**: Use `!` suffix to prevent merging

#### Example

**shared/common.idea:**

```ts
// Common types used across multiple schemas
type Address {
  street String @required
  city String @required
  country String @default("US")
}

enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}

prop Email {
  type "email"
  validation {
    required true
    format "email"
  }
}
```

**user/user-schema.idea:**

```ts
// Import common definitions
use "../shared/common.idea"

// Extend the Status enum (will merge with imported one)
enum Status {
  PENDING "Pending Approval"
  SUSPENDED "Temporarily Suspended"
}

// Use imported types and props
model User {
  id String @id @default("nanoid()")
  email String @field.input(Email)
  address Address
  status Status @default("PENDING")
}
```

**Result after merging:**

```ts
// The Status enum now contains all values
enum Status {
  ACTIVE "Active"           // From common.idea
  INACTIVE "Inactive"       // From common.idea
  PENDING "Pending Approval"    // From user-schema.idea
  SUSPENDED "Temporarily Suspended" // From user-schema.idea
}
```

#### Preventing Merging with `!`

When you want to prevent automatic merging and keep definitions separate, use the `!` suffix:

**base-schema.idea:**
```ts
enum UserRole {
  USER "Regular User"
  ADMIN "Administrator"
}
```

**extended-schema.idea:**

```ts
use "./base-schema.idea"

// This will NOT merge with the imported UserRole
// Instead, it will override it completely
enum UserRole! {
  GUEST "Guest User"
  MEMBER "Member"
  MODERATOR "Moderator"
  ADMIN "Administrator"
}
```

#### Use Cases

1. **Shared Types**: Define common types once and reuse across multiple schemas
2. **Modular Organization**: Split large schemas into manageable, focused files
3. **Team Collaboration**: Different teams can work on separate schema files
4. **Environment-Specific**: Override certain definitions for different environments

#### Best Practices

```ts
// ✅ Good - organize by domain
use "./shared/common-types.idea"
use "./auth/user-types.idea"
use "./commerce/product-types.idea"

// ✅ Good - clear file naming
use "./enums/status-enums.idea"
use "./types/address-types.idea"
use "./props/form-props.idea"

// ❌ Avoid - unclear imports
use "./stuff.idea"
use "./misc.idea"
```

### Plugin

The `plugin` directive configures code generation plugins that process your schema and generate various outputs like TypeScript interfaces, database schemas, API documentation, and more.

#### Syntax

```ts
plugin "path/to/plugin.js" {
  configKey "configValue"
  nestedConfig {
    option "value"
    flag true
  }
}
```

#### Structure

- **Path**: Relative or absolute path to the plugin file
- **Configuration Block**: Key-value pairs that configure the plugin behavior
- **Nested Configuration**: Support for complex configuration structures

#### Example

```ts
// TypeScript interface generation
plugin "./plugins/typescript-generator.js" {
  output "./src/types/schema.ts"
  namespace "Schema"
  exportType "named"
  includeComments true
  formatting {
    indent 2
    semicolons true
    trailingCommas true
  }
}

// Database schema generation
plugin "./plugins/database-generator.js" {
  output "./database/schema.sql"
  dialect "postgresql"
  includeIndexes true
  includeForeignKeys true
  tablePrefix "app_"
  options {
    dropExisting false
    addTimestamps true
    charset "utf8mb4"
  }
}

// API documentation generation
plugin "./plugins/openapi-generator.js" {
  output "./docs/api.yaml"
  version "1.0.0"
  title "My API Documentation"
  description "Comprehensive API documentation generated from schema"
  servers [
    {
      url "https://api.example.com/v1"
      description "Production server"
    }
    {
      url "https://staging-api.example.com/v1"
      description "Staging server"
    }
  ]
  security {
    type "bearer"
    scheme "JWT"
  }
}

// Form generation
plugin "./plugins/form-generator.js" {
  output "./src/components/forms/"
  framework "react"
  styling "tailwind"
  validation "zod"
  features {
    typescript true
    storybook true
    tests true
  }
  components {
    inputWrapper "FormField"
    submitButton "SubmitButton"
    errorMessage "ErrorText"
  }
}
```

#### Plugin Configuration Options

Common configuration patterns across different plugin types:

```ts
plugin "./plugins/my-plugin.js" {
  // Output configuration
  output "./generated/output.ts"
  outputDir "./generated/"
  
  // Format and style options
  format "typescript" // or "javascript", "json", "yaml"
  style "camelCase"   // or "snake_case", "kebab-case"
  
  // Feature flags
  includeComments true
  generateTests false
  addValidation true
  
  // Framework-specific options
  framework "react"     // or "vue", "angular", "svelte"
  styling "tailwind"    // or "bootstrap", "material", "custom"
  
  // Advanced configuration
  templates {
    model "./templates/model.hbs"
    enum "./templates/enum.hbs"
  }
  
  // Custom options (plugin-specific)
  customOptions {
    apiVersion "v1"
    includeMetadata true
    compressionLevel 9
  }
}
```

#### Multiple Plugin Execution

You can configure multiple plugins to generate different outputs from the same schema:

```ts
// Generate TypeScript types
plugin "./plugins/typescript.js" {
  output "./src/types/index.ts"
}

// Generate database schema
plugin "./plugins/database.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

// Generate API documentation
plugin "./plugins/docs.js" {
  output "./docs/api.md"
  format "markdown"
}

// Generate form components
plugin "./plugins/forms.js" {
  output "./src/forms/"
  framework "react"
}

// Generate validation schemas
plugin "./plugins/validation.js" {
  output "./src/validation/index.ts"
  library "zod"
}
```

#### Plugin Development

Plugins are JavaScript/TypeScript modules that export a default function:

```typescript
// Example plugin structure
import type { PluginProps } from '@stackpress/idea-transformer/types';

interface MyPluginConfig {
  output: string;
  format?: 'typescript' | 'javascript';
  includeComments?: boolean;
}

export default async function myPlugin(
  props: PluginProps<{ config: MyPluginConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('Output path is required');
  }
  
  // Process schema
  const content = generateContent(schema, config);
  
  // Write output
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
  
  console.log(`✅ Generated: ${outputPath}`);
}
```

## Processing Flow

The `.idea` file format follows a structured processing flow:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   .idea File    │───▶│     Parser      │───▶│   AST (JSON)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Validation    │    │   Transformer   │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │    Plugins      │
                                              │                 │
                                              └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │ Generated Code  │
                                              │                 │
                                              └─────────────────┘
```

### Processing Steps

1. **Parsing**: Convert `.idea` syntax into Abstract Syntax Tree (AST)
2. **Validation**: Check for syntax errors, type consistency, and constraint violations
3. **Transformation**: Convert AST into structured JSON configuration
4. **Plugin Execution**: Run configured plugins to generate output files
5. **Code Generation**: Create TypeScript, SQL, documentation, forms, etc.

## Plugin System

The plugin system enables extensible code generation from your schema definitions.

### Plugin Declaration

```ts
plugin "./path/to/plugin.js" {
  output "./generated/output.ts"
  format "typescript"
  options {
    strict true
    comments true
  }
}
```

### Common Plugin Types

| Plugin Type | Purpose | Output |
|-------------|---------|--------|
| **TypeScript Generator** | Generate interfaces and types | `.ts` files |
| **Database Schema** | Generate SQL DDL | `.sql` files |
| **API Documentation** | Generate OpenAPI specs | `.json/.yaml` files |
| **Form Generator** | Generate HTML forms | `.html` files |
| **Validation Schema** | Generate Zod/Joi schemas | `.ts` files |
| **Mock Data** | Generate test fixtures | `.json` files |

### Plugin Development

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';

export default async function myPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer } = props;
  
  // Process schema and generate output
  const content = generateFromSchema(schema);
  
  // Write to configured output path
  const outputPath = await transformer.loader.absolute(config.output);
  await writeFile(outputPath, content);
}
```

## Complete Examples

### E-commerce Application Schema

```ts
// E-commerce application schema
plugin "./plugins/generate-types.js" {
  output "./src/types/schema.ts"
}

plugin "./plugins/generate-database.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

plugin "./plugins/generate-api-docs.js" {
  output "./docs/api.yaml"
  format "openapi"
}

// Reusable props
prop Email {
  type "email"
  validation {
    required true
    format "email"
  }
  ui {
    placeholder "Enter email address"
    icon "envelope"
  }
}

prop Currency {
  type "number"
  format "currency"
  validation {
    min 0
    precision 2
  }
  ui {
    symbol "$"
    locale "en-US"
  }
}

prop Text {
  type "text"
  validation {
    maxLength 255
  }
}

// Enums
enum UserRole {
  ADMIN "Administrator"
  CUSTOMER "Customer"
  VENDOR "Vendor"
}

enum OrderStatus {
  PENDING "Pending"
  CONFIRMED "Confirmed"
  SHIPPED "Shipped"
  DELIVERED "Delivered"
  CANCELLED "Cancelled"
}

enum PaymentStatus {
  PENDING "Pending"
  COMPLETED "Completed"
  FAILED "Failed"
  REFUNDED "Refunded"
}

// Types
type Address {
  street String @required @field.input(Text)
  city String @required @field.input(Text)
  state String @required @field.select
  postalCode String @required @field.input(Text)
  country String @default("US") @field.select
}

type Money {
  amount Number @required @field.input(Currency)
  currency String @default("USD")
}

// Models
model User! {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  username String @unique @required @field.input(Text)
  firstName String @required @field.input(Text)
  lastName String @required @field.input(Text)
  role UserRole @default("CUSTOMER")
  addresses Address[] @relation(UserAddress.userId)
  orders Order[] @relation(Order.userId)
  active Boolean @default(true)
  emailVerified Boolean @default(false)
  created Date @default("now()")
  updated Date @default("updated()")
}

model Category {
  id String @id @default("nanoid()")
  name String @unique @required @field.input(Text)
  slug String @unique @generated
  description String @field.textarea
  parentId String? @relation(Category.id)
  parent Category? @relation(Category, parentId)
  children Category[] @relation(Category.parentId)
  products Product[] @relation(Product.categoryId)
  active Boolean @default(true)
  created Date @default("now()")
}

model Product! {
  id String @id @default("nanoid()")
  name String @required @field.input(Text)
  slug String @unique @generated
  description String @field.richtext
  shortDescription String @field.textarea
  sku String @unique @required @field.input(Text)
  price Money @required
  comparePrice Money?
  cost Money?
  categoryId String @relation(Category.id)
  category Category @relation(Category, categoryId)
  images String[] @field.upload
  inventory {
    quantity Number @default(0)
    trackQuantity Boolean @default(true)
    allowBackorder Boolean @default(false)
  }
  seo {
    title String @field.input(Text)
    description String @field.textarea
    keywords String[] @field.tags
  }
  active Boolean @default(true)
  featured Boolean @default(false)
  created Date @default("now()")
  updated Date @default("updated()")
}

model Order {
  id String @id @default("nanoid()")
  orderNumber String @unique @generated
  userId String @relation(User.id)
  user User @relation(User, userId)
  items OrderItem[] @relation(OrderItem.orderId)
  status OrderStatus @default("PENDING")
  paymentStatus PaymentStatus @default("PENDING")
  shippingAddress Address @required
  billingAddress Address @required
  subtotal Money @required
  tax Money @required
  shipping Money @required
  total Money @required
  notes String? @field.textarea
  created Date @default("now()")
  updated Date @default("updated()")
}

model OrderItem {
  id String @id @default("nanoid()")
  orderId String @relation(Order.id)
  order Order @relation(Order, orderId)
  productId String @relation(Product.id)
  product Product @relation(Product, productId)
  quantity Number @required @min(1)
  price Money @required
  total Money @required
}
```

### Blog Application Schema

```ts
// Blog application schema
plugin "./plugins/generate-types.js" {
  output "./src/types/blog.ts"
}

plugin "./plugins/generate-forms.js" {
  output "./src/components/forms/"
  framework "react"
}

// Props
prop RichText {
  type "richtext"
  validation {
    required true
    minLength 100
  }
  ui {
    toolbar ["bold", "italic", "link", "image"]
    placeholder "Write your content here..."
  }
}

prop Slug {
  type "text"
  validation {
    pattern "^[a-z0-9-]+$"
    maxLength 100
  }
  ui {
    placeholder "url-friendly-slug"
  }
}

// Enums
enum PostStatus {
  DRAFT "Draft"
  PUBLISHED "Published"
  ARCHIVED "Archived"
}

enum CommentStatus {
  PENDING "Pending Moderation"
  APPROVED "Approved"
  REJECTED "Rejected"
}

// Models
model Author! {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  name String @required @field.input(Text)
  bio String @field.textarea
  avatar String @field.upload
  social {
    twitter String? @field.input(Text)
    github String? @field.input(Text)
    website String? @field.input(URL)
  }
  posts Post[] @relation(Post.authorId)
  active Boolean @default(true)
  created Date @default("now()")
}

model Category {
  id String @id @default("nanoid()")
  name String @unique @required @field.input(Text)
  slug String @unique @field.input(Slug)
  description String @field.textarea
  color String @field.color
  posts Post[] @relation(PostCategory.categoryId)
  created Date @default("now()")
}

model Tag {
  id String @id @default("nanoid()")
  name String @unique @required @field.input(Text)
  slug String @unique @field.input(Slug)
  posts Post[] @relation(PostTag.tagId)
  created Date @default("now()")
}

model Post! {
  id String @id @default("nanoid()")
  title String @required @field.input(Text)
  slug String @unique @field.input(Slug)
  excerpt String @field.textarea
  content String @required @field.input(RichText)
  featuredImage String @field.upload
  authorId String @relation(Author.id)
  author Author @relation(Author, authorId)
  categories Category[] @relation(PostCategory.postId)
  tags Tag[] @relation(PostTag.postId)
  status PostStatus @default("DRAFT")
  publishedAt Date? @field.datetime
  seo {
    title String @field.input(Text)
    description String @field.textarea
    keywords String[] @field.tags
  }
  stats {
    views Number @default(0)
    likes Number @default(0)
    shares Number @default(0)
  }
  comments Comment[] @relation(Comment.postId)
  created Date @default("now()")
  updated Date @default("updated()")
}

model Comment {
  id String @id @default("nanoid()")
  postId String @relation(Post.id)
  post Post @relation(Post, postId)
  authorName String @required @field.input(Text)
  authorEmail String @required @field.input(Email)
  content String @required @field.textarea
  status CommentStatus @default("PENDING")
  parentId String? @relation(Comment.id)
  parent Comment? @relation(Comment, parentId)
  replies Comment[] @relation(Comment.parentId)
  created Date @default("now()")
}
```

## Best Practices

### 1. Schema Organization

**Use Descriptive Names**
```ts
// ✅ Good
enum UserAccountStatus {
  ACTIVE "Active Account"
  SUSPENDED "Temporarily Suspended"
  DEACTIVATED "Permanently Deactivated"
}

// ❌ Avoid
enum Status {
  A "Active"
  S "Suspended"
  D "Deactivated"
}
```

**Group Related Elements**
```ts
// User-related enums
enum UserRole { /* ... */ }
enum UserStatus { /* ... */ }

// User-related types
type UserProfile { /* ... */ }
type UserPreferences { /* ... */ }

// User-related models
model User { /* ... */ }
model UserSession { /* ... */ }
```

**Use Consistent Naming Conventions**
```ts
// Models: PascalCase
model UserAccount { /* ... */ }

// Enums: PascalCase
enum OrderStatus { /* ... */ }

// Props: PascalCase
prop EmailInput { /* ... */ }

// Columns: camelCase
model User {
  firstName String
  lastName String
  emailAddress String
}
```

### 2. Type Safety

**Define Custom Types for Complex Data**

```ts
type Money {
  amount Number @required @min(0)
  currency String @default("USD")
}

type Coordinates {
  latitude Number @required @min(-90) @max(90)
  longitude Number @required @min(-180) @max(180)
}

model Product {
  price Money @required
  location Coordinates?
}
```

**Use Enums for Fixed Sets of Values**

```ts
// ✅ Good - type-safe and self-documenting
enum Priority {
  LOW "Low Priority"
  MEDIUM "Medium Priority"
  HIGH "High Priority"
  URGENT "Urgent"
}

model Task {
  priority Priority @default("MEDIUM")
}

// ❌ Avoid - error-prone and unclear
model Task {
  priority String @default("medium")
}
```

### 3. Validation and Constraints

**Use Appropriate Validation Attributes**

```ts
model User {
  email String @required @unique @pattern("^[^\s@]+@[^\s@]+\.[^\s@]+$")
  age Number @min(13) @max(120)
  username String @required @minLength(3) @maxLength(30) @pattern("^[a-zA-Z0-9_]+$")
  bio String @maxLength(500)
  tags String[] @maxItems(10)
}
```

**Provide Meaningful Defaults**

```ts
model User {
  role UserRole @default("USER")
  active Boolean @default(true)
  emailVerified Boolean @default(false)
  created Date @default("now()")
  updated Date @default("updated()")
  preferences {
    theme String @default("light")
    language String @default("en")
    notifications Boolean @default(true)
  }
}
```

### 4. Relationships

**Use Clear Relationship Patterns**

```ts
// One-to-many relationship
model User {
  id String @id
  posts Post[] @relation(Post.authorId)
}

model Post {
  id String @id
  authorId String @relation(User.id)
  author User @relation(User, authorId)
}

// Many-to-many relationship
model Post {
  id String @id
  tags Tag[] @relation(PostTag.postId)
}

model Tag {
  id String @id
  posts Post[] @relation(PostTag.tagId)
}

model PostTag {
  postId String @relation(Post.id)
  tagId String @relation(Tag.id)
}
```

### 5. Plugin Configuration

**Organize Plugins by Purpose**

```ts
// Type generation
plugin "./plugins/typescript-generator.js" {
  output "./src/types/schema.ts"
  namespace "Schema"
}

// Database schema
plugin "./plugins/database-generator.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

// API documentation
plugin "./plugins/openapi-generator.js" {
  output "./docs/api.yaml"
  version "1.0.0"
}

// Form generation
plugin "./plugins/form-generator.js" {
  output "./src/components/forms/"
  framework "react"
  styling "tailwind"
}
```

## Error Handling

### Common Errors and Solutions

#### 1. Invalid Schema Structure

**Error:** `Invalid Schema`

**Cause:** Syntax errors or malformed declarations

**Solution:**

```ts
// ❌ Invalid - missing quotes around enum values
enum Status {
  ACTIVE Active
  INACTIVE Inactive
}

// ✅ Valid - proper enum syntax
enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}
```

#### 2. Missing Required Properties

**Error:** `Expecting a columns property`

**Cause:** Models and types must have column definitions

**Solution:**

```ts
// ❌ Invalid - empty model
model User {
}

// ✅ Valid - model with columns
model User {
  id String @id
  name String @required
}
```

#### 3. Duplicate Declarations

**Error:** `Duplicate [name]`

**Cause:** Multiple declarations with the same name

**Solution:**

```ts
// ❌ Invalid - duplicate model names
model User {
  id String @id
}

model User {  // Duplicate!
  name String
}

// ✅ Valid - unique names
model User {
  id String @id
}

model UserProfile {
  name String
}
```

#### 4. Unknown References

**Error:** `Unknown reference [name]`

**Cause:** Referencing undefined props, types, or enums

**Solution:**

```ts
// ❌ Invalid - EmailInput prop not defined
model User {
  email String @field.input(EmailInput)
}

// ✅ Valid - define prop first
prop EmailInput {
  type "email"
  validation { required true }
}

model User {
  email String @field.input(EmailInput)
}
```

#### 5. Type Mismatches

**Error:** `Type mismatch`

**Cause:** Using incompatible types or attributes

**Solution:**

```ts
// ❌ Invalid - Boolean can't have @minLength
model User {
  active Boolean @minLength(5)
}

// ✅ Valid - appropriate attributes for type
model User {
  active Boolean @default(true)
  name String @minLength(2) @maxLength(50)
}
```

### Error Prevention

**1. Use TypeScript for Plugin Development**

```typescript
import type { PluginProps, SchemaConfig } from '@stackpress/idea-transformer/types';

export default async function myPlugin(props: PluginProps<{}>) {
  // TypeScript will catch type errors at compile time
  const { config, schema } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('Output path is required');
  }
  
  // Process schema safely
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      // Process each model
    }
  }
}
```

**2. Validate Schema Before Processing**

```ts
// Always validate required fields
model User {
  id String @id @required
  email String @required @unique
  name String @required
}

// Use appropriate data types
model Product {
  price Number @min(0)        // Not String
  active Boolean              // Not Number
  created Date @default("now()") // Not String
}
```

**3. Use Consistent Patterns**

```ts
// Consistent ID patterns
model User {
  id String @id @default("nanoid()")
}

model Post {
  id String @id @default("nanoid()")
}

// Consistent timestamp patterns
model User {
  created Date @default("now()")
  updated Date @default("updated()")
}
```

**4. Test Schema Changes**

```bash
# Parse schema to check for errors
npm run idea:parse schema.idea

# Transform schema to validate plugins
npm run idea:transform schema.idea

# Generate output to verify results
npm run idea:generate
```

## Conclusion

The `.idea` file format provides a powerful, declarative approach to defining application schemas that can generate multiple outputs from a single source of truth. By following the patterns and best practices outlined in this specification, development teams can:

### Key Advantages

- **Reduce Development Time**: Generate boilerplate code, forms, documentation, and database schemas automatically
- **Improve Consistency**: Ensure data structures remain consistent across frontend, backend, and database layers
- **Enhance Type Safety**: Generate type-safe code for TypeScript, preventing runtime errors
- **Simplify Maintenance**: Update schema once and regenerate all dependent code
- **Enable Rapid Prototyping**: Quickly iterate on data models and see changes across the entire application

### Getting Started

1. **Define Your Schema**: Start with a simple `.idea` file containing your core models
2. **Add Plugins**: Configure plugins to generate the outputs you need (TypeScript, SQL, forms, etc.)
3. **Iterate and Refine**: Add validation rules, relationships, and UI configurations as needed
4. **Integrate with Build Process**: Add schema generation to your CI/CD pipeline

### Next Steps

- **Explore Plugin Ecosystem**: Discover available plugins for your technology stack
- **Create Custom Plugins**: Develop plugins for specific requirements not covered by existing ones
- **Join the Community**: Contribute to the `.idea` ecosystem and share your experiences

### Support and Resources

- **Documentation**: Comprehensive guides for parser, transformer, and plugin development
- **Examples**: Real-world schema examples for common application types
- **Community**: Active community of developers using and contributing to the `.idea` ecosystem

The `.idea` file format represents a significant step forward in application development efficiency, providing the tools needed to build robust, type-safe applications with minimal boilerplate code. Whether you're a junior developer learning the ropes, a senior developer optimizing workflows, or a technical leader evaluating new tools, the `.idea` format offers clear benefits for modern application development.

Start small, think big, and let the `.idea` format transform how you build applications.
