// Main library entry point for the Idea Parser Rust implementation
// This module provides the core functionality to parse .idea schema files
// and compile them into JSON configurations that can be consumed by Node.js

use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

// Import our custom modules for lexical analysis, parsing, and compilation
mod lexer;
mod parser;
mod compiler;

use lexer::Lexer;
use parser::SchemaParser;
use compiler::Compiler;

/// Represents a complete schema configuration with all possible sections
/// This structure mirrors the TypeScript SchemaConfig interface and includes
/// optional sections for plugins, imports (use), props, enums, types, and models
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SchemaConfig {
    /// Plugin configurations - external tools and integrations
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plugin: Option<HashMap<String, Value>>,
    
    /// Import statements - references to other schema files
    /// Note: Using r#use because 'use' is a Rust keyword
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#use: Option<Vec<String>>,
    
    /// Prop definitions - reusable property configurations
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prop: Option<HashMap<String, Value>>,
    
    /// Enum definitions - named constants with display values
    /// Note: Using r#enum because 'enum' is a Rust keyword
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#enum: Option<HashMap<String, HashMap<String, Value>>>,
    
    /// Type definitions - custom data structures
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#type: Option<HashMap<String, Value>>,
    
    /// Model definitions - database entities and their relationships
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model: Option<HashMap<String, Value>>,
}

/// Represents the final schema configuration with references resolved
/// This is similar to SchemaConfig but excludes 'use' and 'prop' sections
/// since they are processed and their references are resolved inline
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FinalSchemaConfig {
    /// Plugin configurations remain unchanged in final output
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plugin: Option<HashMap<String, Value>>,
    
    /// Enum definitions with resolved references
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#enum: Option<HashMap<String, HashMap<String, Value>>>,
    
    /// Type definitions with prop references resolved inline
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#type: Option<HashMap<String, Value>>,
    
    /// Model definitions with prop references resolved inline
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model: Option<HashMap<String, Value>>,
}

/// Parse schema code into JSON configuration with references preserved
/// 
/// This function takes raw .idea schema code as input and returns a JSON string
/// containing the parsed schema with all references (props, use statements) intact.
/// This is equivalent to the TypeScript `parse()` function.
/// 
/// # Arguments
/// * `code` - The raw .idea schema code as a string
/// 
/// # Returns
/// * `Result<String>` - JSON string representation of the parsed schema, or an error
/// 
/// # Example
/// ```javascript
/// const result = parse(`
///   prop Text { type "text" }
///   model User { name String @field.input(Text) }
/// `);
/// // Returns JSON with prop references preserved
/// ```
#[napi]
pub fn parse(code: String) -> Result<String> {
    // Step 1: Create a lexer to tokenize the input code
    // The lexer breaks down the raw text into meaningful tokens
    let mut lexer = Lexer::new(&code);
    
    // Step 2: Create a parser that will build an Abstract Syntax Tree (AST)
    // The parser understands the grammar rules of the .idea language
    let mut parser = SchemaParser::new(&mut lexer);
    
    // Step 3: Parse the code into an AST
    match parser.parse_schema() {
        Ok(ast) => {
            // Step 4: Create a compiler to convert the AST into our target format
            let compiler = Compiler::new();
            
            // Step 5: Compile the AST into a SchemaConfig structure
            // The 'false' parameter means we preserve references (don't finalize)
            match compiler.compile_schema(&ast, false) {
                Ok(schema) => {
                    // Step 6: Serialize the schema to JSON string for Node.js consumption
                    match serde_json::to_string(&schema) {
                        Ok(json) => Ok(json),
                        Err(e) => Err(Error::new(
                            Status::GenericFailure,
                            format!("Failed to serialize schema: {}", e)
                        ))
                    }
                }
                Err(e) => Err(Error::new(
                    Status::GenericFailure,
                    format!("Compilation error: {}", e)
                ))
            }
        }
        Err(e) => Err(Error::new(
            Status::GenericFailure,
            format!("Parse error: {}", e)
        ))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::env;

    #[test]
    fn test_env_variable_parsing() {
        // Set a test environment variable
        env::set_var("TEST_DATABASE_URL", "postgresql://localhost:5432/test");
        
        let schema_code = r#"
plugin "./custom-plugin" {
  provider "custom-client-js"
  url env(TEST_DATABASE_URL)
  previewFeatures ["fullTextSearch"]
}
"#;
        
        let result = parse(schema_code.to_string());
        assert!(result.is_ok());
        
        let json = result.unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
        
        // Check if the environment variable was resolved
        let plugin = parsed.get("plugin").unwrap();
        let custom_plugin = plugin.get("./custom-plugin").unwrap();
        let url = custom_plugin.get("url").unwrap();
        
        assert_eq!(url.as_str().unwrap(), "postgresql://localhost:5432/test");
        
        // Clean up
        env::remove_var("TEST_DATABASE_URL");
    }
}

/// Parse schema code into final JSON configuration with references resolved and removed
/// 
/// This function is similar to `parse()` but performs additional processing:
/// 1. Resolves all prop references inline
/// 2. Removes the 'prop' and 'use' sections from the output
/// 3. Returns a clean, final configuration ready for consumption
/// 
/// This is equivalent to the TypeScript `final()` function.
/// 
/// # Arguments
/// * `code` - The raw .idea schema code as a string
/// 
/// # Returns
/// * `Result<String>` - JSON string representation of the final schema, or an error
/// 
/// # Example
/// ```javascript
/// const result = final(`
///   prop Text { type "text" }
///   model User { name String @field.input(Text) }
/// `);
/// // Returns JSON with prop references resolved and prop section removed
/// ```
#[napi(js_name = "final")]
pub fn final_schema(code: String) -> Result<String> {
    // Step 1: Create a lexer to tokenize the input code
    let mut lexer = Lexer::new(&code);
    
    // Step 2: Create a parser to build the AST
    let mut parser = SchemaParser::new(&mut lexer);
    
    // Step 3: Parse the code into an AST
    match parser.parse_schema() {
        Ok(ast) => {
            // Step 4: Create a compiler for final processing
            let compiler = Compiler::new();
            
            // Step 5: Compile the AST into a final configuration
            // This resolves all references and removes prop/use sections
            match compiler.compile_final(&ast) {
                Ok(schema) => {
                    // Step 6: Serialize the final schema to JSON
                    match serde_json::to_string(&schema) {
                        Ok(json) => Ok(json),
                        Err(e) => Err(Error::new(
                            Status::GenericFailure,
                            format!("Failed to serialize schema: {}", e)
                        ))
                    }
                }
                Err(e) => Err(Error::new(
                    Status::GenericFailure,
                    format!("Compilation error: {}", e)
                ))
            }
        }
        Err(e) => Err(Error::new(
            Status::GenericFailure,
            format!("Parse error: {}", e)
        ))
    }
}
