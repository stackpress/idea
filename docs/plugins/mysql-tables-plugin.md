# Tutorial: Creating a MySQL Tables Plugin

This tutorial will guide you through creating a plugin that generates MySQL `CREATE TABLE` statements from a processed `.idea` schema.

## Overview

The MySQL Tables Plugin will:
- Parse schema models and their columns
- Map schema types to MySQL data types
- Generate SQL `CREATE TABLE` statements
- Handle primary keys, foreign keys, and indexes
- Output SQL files that can be executed to create database tables

## Prerequisites

- Basic understanding of TypeScript/JavaScript
- Familiarity with MySQL and SQL syntax
- Understanding of the `idea-transformer` plugin system

## Step 1: Understanding the Schema Structure

Before creating the plugin, let's understand what a processed schema looks like:

```typescript
// Example processed schema
{
  model: {
    User: {
      mutable: false,
      columns: [
        {
          name: 'id',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            id: true,
            default: 'nanoid()'
          }
        },
        {
          name: 'email',
          type: 'String',
          required: true,
          multiple: false,
          attributes: {
            unique: true,
            field: { input: { type: 'email' } }
          }
        },
        {
          name: 'age',
          type: 'Number',
          required: false,
          multiple: false,
          attributes: {
            unsigned: true,
            min: 0,
            max: 150
          }
        }
      ]
    }
  },
  enum: {
    UserRole: {
      ADMIN: 'admin',
      USER: 'user'
    }
  }
}
```

## Step 2: Create the Plugin Structure

Create a new file `mysql-tables-plugin.js`:

```typescript
import type { PluginProps } from '@stackpress/idea-transformer/types';
import fs from 'fs/promises';
import path from 'path';

interface MySQLPluginConfig {
  output: string;
  database?: string;
  engine?: string;
  charset?: string;
  collation?: string;
}

export default async function mysqlTablesPlugin(
  props: PluginProps<{ config: MySQLPluginConfig }>
) {
  const { config, schema, transformer, cwd } = props;
  
  // Validate configuration
  if (!config.output) {
    throw new Error('MySQL Tables Plugin requires "output" configuration');
  }
  
  // Set defaults
  const options = {
    database: config.database || 'app_database',
    engine: config.engine || 'InnoDB',
    charset: config.charset || 'utf8mb4',
    collation: config.collation || 'utf8mb4_unicode_ci',
    ...config
  };
  
  // Generate SQL content
  const sqlContent = generateSQL(schema, options);
  
  // Write to output file
  const outputPath = await transformer.loader.absolute(config.output);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, sqlContent, 'utf8');
  
  console.log(`✅ MySQL tables generated: ${outputPath}`);
}
```

## Step 3: Implement Type Mapping

Create a function to map schema types to MySQL types:

```typescript
function mapSchemaTypeToMySQL(column: any): string {
  const { type, attributes = {} } = column;
  
  switch (type) {
    case 'String':
      // Check for specific string constraints
      if (attributes.id) {
        return 'VARCHAR(255)'; // Primary key strings
      }
      if (attributes.email || attributes.url) {
        return 'VARCHAR(255)';
      }
      if (attributes.text || attributes.textarea) {
        return 'TEXT';
      }
      if (attributes.maxLength) {
        return `VARCHAR(${attributes.maxLength})`;
      }
      return 'VARCHAR(255)'; // Default string length
      
    case 'Number':
      if (attributes.unsigned) {
        if (attributes.max && attributes.max <= 255) {
          return 'TINYINT UNSIGNED';
        }
        if (attributes.max && attributes.max <= 65535) {
          return 'SMALLINT UNSIGNED';
        }
        if (attributes.max && attributes.max <= 16777215) {
          return 'MEDIUMINT UNSIGNED';
        }
        return 'INT UNSIGNED';
      }
      if (attributes.float || attributes.decimal) {
        const precision = attributes.precision || 10;
        const scale = attributes.scale || 2;
        return `DECIMAL(${precision},${scale})`;
      }
      return 'INT';
      
    case 'Boolean':
      return 'BOOLEAN';
      
    case 'Date':
      if (attributes.time) {
        return 'DATETIME';
      }
      if (attributes.timestamp) {
        return 'TIMESTAMP';
      }
      return 'DATE';
      
    case 'JSON':
      return 'JSON';
      
    default:
      // Check if it's an enum type
      if (schema.enum && schema.enum[type]) {
        const enumValues = Object.values(schema.enum[type])
          .map(value => `'${value}'`)
          .join(', ');
        return `ENUM(${enumValues})`;
      }
      
      // Check if it's a foreign key (another model)
      if (schema.model && schema.model[type]) {
        return 'VARCHAR(255)'; // Assuming string-based foreign keys
      }
      
      return 'VARCHAR(255)'; // Default fallback
  }
}
```

## Step 4: Generate SQL Statements

Implement the main SQL generation function:

```typescript
function generateSQL(schema: any, options: any): string {
  let sql = '';
  
  // Add header comment
  sql += `-- Generated MySQL Tables\n`;
  sql += `-- Database: ${options.database}\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n\n`;
  
  // Create database if specified
  if (options.database) {
    sql += `CREATE DATABASE IF NOT EXISTS \`${options.database}\`;\n`;
    sql += `USE \`${options.database}\`;\n\n`;
  }
  
  // Generate tables for each model
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      sql += generateTableSQL(modelName, model, options);
      sql += '\n';
    }
  }
  
  return sql;
}

function generateTableSQL(tableName: string, model: any, options: any): string {
  const columns: string[] = [];
  const indexes: string[] = [];
  const foreignKeys: string[] = [];
  let primaryKey = '';
  
  // Process each column
  for (const column of model.columns || []) {
    const columnDef = generateColumnDefinition(column, options);
    columns.push(columnDef.definition);
    
    // Handle constraints
    if (columnDef.isPrimary) {
      primaryKey = column.name;
    }
    if (columnDef.isUnique) {
      indexes.push(`UNIQUE KEY \`uk_${tableName}_${column.name}\` (\`${column.name}\`)`);
    }
    if (columnDef.isIndex) {
      indexes.push(`KEY \`idx_${tableName}_${column.name}\` (\`${column.name}\`)`);
    }
    if (columnDef.foreignKey) {
      foreignKeys.push(columnDef.foreignKey);
    }
  }
  
  // Build CREATE TABLE statement
  let sql = `CREATE TABLE \`${tableName}\` (\n`;
  
  // Add columns
  sql += columns.map(col => `  ${col}`).join(',\n');
  
  // Add primary key
  if (primaryKey) {
    sql += `,\n  PRIMARY KEY (\`${primaryKey}\`)`;
  }
  
  // Add indexes
  if (indexes.length > 0) {
    sql += ',\n  ' + indexes.join(',\n  ');
  }
  
  // Add foreign keys
  if (foreignKeys.length > 0) {
    sql += ',\n  ' + foreignKeys.join(',\n  ');
  }
  
  sql += `\n) ENGINE=${options.engine} DEFAULT CHARSET=${options.charset} COLLATE=${options.collation};\n`;
  
  return sql;
}

function generateColumnDefinition(column: any, options: any): any {
  const { name, required, attributes = {} } = column;
  const mysqlType = mapSchemaTypeToMySQL(column);
  
  let definition = `\`${name}\` ${mysqlType}`;
  
  // Handle NULL/NOT NULL
  if (required || attributes.id) {
    definition += ' NOT NULL';
  } else {
    definition += ' NULL';
  }
  
  // Handle AUTO_INCREMENT
  if (attributes.id && attributes.autoIncrement !== false) {
    if (mysqlType.includes('INT')) {
      definition += ' AUTO_INCREMENT';
    }
  }
  
  // Handle DEFAULT values
  if (attributes.default !== undefined) {
    const defaultValue = attributes.default;
    if (defaultValue === 'now()' || defaultValue === 'CURRENT_TIMESTAMP') {
      definition += ' DEFAULT CURRENT_TIMESTAMP';
    } else if (defaultValue === 'updated()') {
      definition += ' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
    } else if (typeof defaultValue === 'string') {
      definition += ` DEFAULT '${defaultValue}'`;
    } else {
      definition += ` DEFAULT ${defaultValue}`;
    }
  }
  
  // Handle COMMENT
  if (attributes.label) {
    const comment = Array.isArray(attributes.label) 
      ? attributes.label[0] 
      : attributes.label;
    definition += ` COMMENT '${comment.replace(/'/g, "''")}'`;
  }
  
  return {
    definition,
    isPrimary: !!attributes.id,
    isUnique: !!attributes.unique,
    isIndex: !!attributes.index || !!attributes.searchable || !!attributes.filterable,
    foreignKey: generateForeignKey(column, options)
  };
}

function generateForeignKey(column: any, options: any): string | null {
  const { name, type, attributes = {} } = column;
  
  // Check if this column references another model
  if (schema.model && schema.model[type]) {
    const referencedTable = type;
    const referencedColumn = 'id'; // Assuming 'id' is the primary key
    
    return `CONSTRAINT \`fk_${name}\` FOREIGN KEY (\`${name}\`) REFERENCES \`${referencedTable}\` (\`${referencedColumn}\`) ON DELETE ${attributes.onDelete || 'CASCADE'} ON UPDATE ${attributes.onUpdate || 'CASCADE'}`;
  }
  
  return null;
}
```

## Step 5: Usage in Schema

To use this plugin in your schema file:

```idea
// schema.idea
plugin "./plugins/mysql-tables-plugin.js" {
  output "./database/tables.sql"
  database "my_app"
  engine "InnoDB"
  charset "utf8mb4"
  collation "utf8mb4_unicode_ci"
}

model User {
  id String @id @default("nanoid()")
  email String @unique @field.input(Email)
  name String @field.input(Text)
  age Number @unsigned @min(0) @max(150)
  role UserRole @default("USER")
  active Boolean @default(true)
  created Date @default("now()")
  updated Date @default("updated()")
}

enum UserRole {
  ADMIN "admin"
  USER "user"
}
```

## Step 6: Generated Output

The plugin will generate SQL like this:

```sql
-- Generated MySQL Tables
-- Database: my_app
-- Generated at: 2024-01-15T10:30:00.000Z

CREATE DATABASE IF NOT EXISTS `my_app`;
USE `my_app`;

CREATE TABLE `User` (
  `id` VARCHAR(255) NOT NULL COMMENT 'ID',
  `email` VARCHAR(255) NOT NULL COMMENT 'Email',
  `name` VARCHAR(255) NOT NULL COMMENT 'Name',
  `age` TINYINT UNSIGNED NULL COMMENT 'Age',
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user' COMMENT 'Role',
  `active` BOOLEAN NOT NULL DEFAULT true COMMENT 'Active',
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created',
  `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_User_email` (`email`),
  KEY `idx_User_age` (`age`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Step 7: Error Handling and Best Practices

Add proper error handling and validation:

```typescript
export default async function mysqlTablesPlugin(props: PluginProps<{}>) {
  const { config, schema, transformer, cwd } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Validate schema has models
    if (!schema.model || Object.keys(schema.model).length === 0) {
      console.warn('⚠️  No models found in schema. Skipping MySQL table generation.');
      return;
    }
    
    // Generate SQL
    const sqlContent = generateSQL(schema, config);
    
    // Ensure output directory exists
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Write file
    await fs.writeFile(outputPath, sqlContent, 'utf8');
    
    console.log(`✅ MySQL tables generated: ${outputPath}`);
    console.log(`📊 Generated ${Object.keys(schema.model).length} table(s)`);
    
  } catch (error) {
    console.error(`❌ MySQL Tables Plugin failed: ${error.message}`);
    throw error;
  }
}

function validateConfig(config: any): void {
  if (!config.output) {
    throw new Error('MySQL Tables Plugin requires "output" configuration');
  }
  
  if (config.engine && !['InnoDB', 'MyISAM', 'Memory'].includes(config.engine)) {
    throw new Error(`Unsupported MySQL engine: ${config.engine}`);
  }
}
```

## Conclusion

This MySQL Tables Plugin demonstrates how to:
- Parse schema models and columns
- Map schema types to database-specific types
- Generate SQL DDL statements
- Handle constraints, indexes, and foreign keys
- Provide proper error handling and validation

The plugin is flexible and can be extended to support additional MySQL features like partitioning, triggers, or stored procedures.
