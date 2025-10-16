//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const mainSQLGeneration =
  `function generateSQL(schema: any, options: any): string {
  let sql = '';
  
  // Add header comment
  sql += \`-- Generated MySQL Tables\\n\`;
  sql += \`-- Database: \${options.database}\\n\`;
  sql += \`-- Generated at: \${new Date().toISOString()}\\n\\n\`;
  
  // Create database if specified
  if (options.database) {
    sql += \`CREATE DATABASE IF NOT EXISTS \\\`\${options.database}\\\`;\\n\`;
    sql += \`USE \\\`\${options.database}\\\`;\\n\\n\`;
  }
  
  // Generate tables for each model
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      sql += generateTableSQL(modelName, model, options);
      sql += '\\n';
    }
  }
  
  return sql;
}`;

//--------------------------------------------------------------------//

const tableSQLGeneration =
  `function generateTableSQL(tableName: string, model: any, options: any): string {
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
      indexes.push(\`UNIQUE KEY \\\`uk_\${tableName}_\${column.name}\\\` (\\\`\${column.name}\\\`)\`);
    }
    if (columnDef.isIndex) {
      indexes.push(\`KEY \\\`idx_\${tableName}_\${column.name}\\\` (\\\`\${column.name}\\\`)\`);
    }
    if (columnDef.foreignKey) {
      foreignKeys.push(columnDef.foreignKey);
    }
  }
  
  // Build CREATE TABLE statement
  let sql = \`CREATE TABLE \\\`\${tableName}\\\` (\\n\`;
  
  // Add columns
  sql += columns.map(col => \`  \${col}\`).join(',\\n');
  
  // Add primary key
  if (primaryKey) {
    sql += \`,\\n  PRIMARY KEY (\\\`\${primaryKey}\\\`)\`;
  }
  
  // Add indexes
  if (indexes.length > 0) {
    sql += ',\\n  ' + indexes.join(',\\n  ');
  }
  
  // Add foreign keys
  if (foreignKeys.length > 0) {
    sql += ',\\n  ' + foreignKeys.join(',\\n  ');
  }
  
  sql += \`\\n) ENGINE=\${options.engine} DEFAULT CHARSET=\${options.charset} COLLATE=\${options.collation};\\n\`;
  
  return sql;
}`;

//--------------------------------------------------------------------//

const columnDefinitionGeneration =
  `function generateColumnDefinition(column: any, options: any): any {
  const { name, required, attributes = {} } = column;
  const mysqlType = mapSchemaTypeToMySQL(column);
  
  let definition = \`\\\`\${name}\\\` \${mysqlType}\`;
  
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
      definition += \` DEFAULT '\${defaultValue}'\`;
    } else {
      definition += \` DEFAULT \${defaultValue}\`;
    }
  }
  
  // Handle COMMENT
  if (attributes.label) {
    const comment = Array.isArray(attributes.label) 
      ? attributes.label[0] 
      : attributes.label;
    definition += \` COMMENT '\${comment.replace(/'/g, "''")}'\`;
  }
  
  return {
    definition,
    isPrimary: !!attributes.id,
    isUnique: !!attributes.unique,
    isIndex: !!attributes.index || !!attributes.searchable || !!attributes.filterable,
    foreignKey: generateForeignKey(column, options)
  };
}`;

//--------------------------------------------------------------------//

const foreignKeyGeneration =
  `function generateForeignKey(column: any, options: any): string | null {
  const { name, type, attributes = {} } = column;
  
  // Check if this column references another model
  if (schema.model && schema.model[type]) {
    const referencedTable = type;
    const referencedColumn = 'id'; // Assuming 'id' is the primary key
    
    return \`CONSTRAINT \\\`fk_\${name}\\\` FOREIGN KEY (\\\`\${name}\\\`) REFERENCES \\\`\${referencedTable}\\\` (\\\`\${referencedColumn}\\\`) ON DELETE \${attributes.onDelete || 'CASCADE'} ON UPDATE \${attributes.onUpdate || 'CASCADE'}\`;
  }
  
  return null;
}`;

//--------------------------------------------------------------------//

export default function GenerateSqlStatements() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Generate SQL Statements Section Content */}
      <section id="generate-sql-statements">
        <H1>{_('6. Generate SQL Statements')}</H1>
        <P>
          <Translate>
            Implement the main SQL generation function. This section
            contains the core logic for creating MySQL CREATE TABLE
            statements from the processed schema.
          </Translate>
        </P>

        <H2>{_('6.1. Main SQL Generation')}</H2>
        <Code
          copy
          language="typescript"
          className='bg-black text-white'
        >
          {mainSQLGeneration}
        </Code>

        <H2>{_('6.2. Table SQL Generation')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {tableSQLGeneration}
        </Code>

        <H2>{_('6.3. Column Definition Generation')}</H2>
        <Code
          copy
          language="typescript"
          className='bg-black text-white'
        >
          {columnDefinitionGeneration}
        </Code>

        <H2>{_('6.4. Foreign Key Generation')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white"
        >
          {foreignKeyGeneration}
        </Code>
      </section>
    </>
  );
}