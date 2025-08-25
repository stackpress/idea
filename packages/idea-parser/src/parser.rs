// Parser for the .idea schema language
// The parser takes tokens from the lexer and builds an Abstract Syntax Tree (AST)
// that represents the structure and meaning of the schema code

use crate::lexer::{Lexer, Token, TokenType};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;

/// Represents different types of AST nodes that can appear in a schema
/// Each variant corresponds to a major language construct
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum AstNode {
    /// The root node representing the entire schema file
    Schema {
        body: Vec<AstNode>,
        start: usize,
        end: usize,
    },
    
    /// Plugin declaration: plugin "path" { config }
    Plugin {
        name: String,
        config: HashMap<String, Value>,
        start: usize,
        end: usize,
    },
    
    /// Use/import declaration: use "path"
    Use {
        path: String,
        start: usize,
        end: usize,
    },
    
    /// Prop declaration: prop Name { config }
    Prop {
        name: String,
        config: HashMap<String, Value>,
        start: usize,
        end: usize,
    },
    
    /// Enum declaration: enum Name { KEY "Value" }
    Enum {
        name: String,
        variants: HashMap<String, Value>,
        start: usize,
        end: usize,
    },
    
    /// Type declaration: type Name { columns }
    Type {
        name: String,
        mutable: bool,
        attributes: HashMap<String, Value>,
        columns: HashMap<String, ColumnDefinition>,
        start: usize,
        end: usize,
    },
    
    /// Model declaration: model Name { columns }
    Model {
        name: String,
        mutable: bool,
        attributes: HashMap<String, Value>,
        columns: HashMap<String, ColumnDefinition>,
        start: usize,
        end: usize,
    },
}

/// Represents a column definition within a type or model
/// Contains the column's data type, attributes, and metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ColumnDefinition {
    pub column_type: String,        // The data type (String, Number, etc.)
    pub required: bool,             // Whether the column is required (!optional)
    pub multiple: bool,             // Whether it's an array type ([])
    pub attributes: HashMap<String, Value>, // Attributes like @id, @default, etc.
}

/// Represents an attribute applied to a declaration or column
/// Attributes start with @ and can have parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attribute {
    pub name: String,               // The attribute name (e.g., "field.input")
    pub parameters: Vec<Value>,     // Parameters passed to the attribute
}

/// The main parser structure that processes tokens and builds the AST
/// It maintains state about the current position and provides error handling
pub struct SchemaParser<'a> {
    lexer: &'a mut Lexer<'a>,      // Reference to the lexer for getting tokens
    current_token: Token,           // The current token being processed
    previous_token: Token,          // The previous token (for error reporting)
}

impl<'a> SchemaParser<'a> {
    /// Create a new parser with the given lexer
    /// 
    /// # Arguments
    /// * `lexer` - A mutable reference to the lexer that will provide tokens
    /// 
    /// # Returns
    /// A new SchemaParser instance ready to parse the input
    pub fn new(lexer: &'a mut Lexer<'a>) -> Self {
        // Get the first token to initialize the parser state
        let first_token = lexer.next_token();
        
        Self {
            lexer,
            current_token: first_token.clone(),
            previous_token: first_token,
        }
    }
    
    /// Advance to the next token in the input stream
    /// This updates both current_token and previous_token
    fn advance(&mut self) {
        self.previous_token = self.current_token.clone();
        self.current_token = self.lexer.next_token();
    }
    
    /// Check if the current token matches the expected type
    /// If it matches, consume it and return true; otherwise return false
    fn match_token(&mut self, token_type: &TokenType) -> bool {
        if std::mem::discriminant(&self.current_token.token_type) == std::mem::discriminant(token_type) {
            self.advance();
            true
        } else {
            false
        }
    }
    
    /// Expect a specific token type and consume it
    /// If the token doesn't match, return an error with a helpful message
    fn expect_token(&mut self, expected: TokenType) -> Result<Token, String> {
        if std::mem::discriminant(&self.current_token.token_type) == std::mem::discriminant(&expected) {
            let token = self.current_token.clone();
            self.advance();
            Ok(token)
        } else {
            Err(format!(
                "Expected {:?}, but found {:?} at position {}",
                expected, self.current_token.token_type, self.current_token.start
            ))
        }
    }
    
    /// Check if we've reached the end of the input
    fn is_at_end(&self) -> bool {
        matches!(self.current_token.token_type, TokenType::Eof)
    }
    
    /// Parse the entire schema file
    /// This is the main entry point for parsing
    /// 
    /// # Returns
    /// An AstNode representing the entire schema, or an error if parsing fails
    pub fn parse_schema(&mut self) -> Result<AstNode, String> {
        let start = self.current_token.start;
        let mut body = Vec::new();
        
        // Parse all top-level declarations until we reach the end of file
        while !self.is_at_end() {
            match self.parse_declaration() {
                Ok(node) => body.push(node),
                Err(e) => return Err(e),
            }
        }
        
        let end = self.previous_token.end;
        
        Ok(AstNode::Schema { body, start, end })
    }
    
    /// Parse a top-level declaration (plugin, use, prop, enum, type, or model)
    /// This function dispatches to the appropriate parsing method based on the current token
    fn parse_declaration(&mut self) -> Result<AstNode, String> {
        match &self.current_token.token_type {
            TokenType::Plugin => self.parse_plugin(),
            TokenType::Use => self.parse_use(),
            TokenType::Prop => self.parse_prop(),
            TokenType::Enum => self.parse_enum(),
            TokenType::Type => self.parse_type(),
            TokenType::Model => self.parse_model(),
            _ => Err(format!(
                "Unexpected token {:?} at position {}. Expected a declaration keyword.",
                self.current_token.token_type, self.current_token.start
            )),
        }
    }
    
    /// Parse a plugin declaration: plugin "path" { config }
    /// Plugins define external tools and integrations
    fn parse_plugin(&mut self) -> Result<AstNode, String> {
        let start = self.current_token.start;
        
        // Consume the 'plugin' keyword
        self.expect_token(TokenType::Plugin)?;
        
        // Parse the plugin path (must be a string literal)
        let name = match &self.current_token.token_type {
            TokenType::String(path) => {
                let path = path.clone();
                self.advance();
                path
            }
            _ => return Err(format!(
                "Expected plugin path string at position {}", 
                self.current_token.start
            )),
        };
        
        // Parse the configuration object
        let config = self.parse_object()?;
        let end = self.previous_token.end;
        
        Ok(AstNode::Plugin {
            name,
            config,
            start,
            end,
        })
    }
    
    /// Parse a use declaration: use "path"
    /// Use statements import definitions from other schema files
    fn parse_use(&mut self) -> Result<AstNode, String> {
        let start = self.current_token.start;
        
        // Consume the 'use' keyword
        self.expect_token(TokenType::Use)?;
        
        // Parse the import path (must be a string literal)
        let path = match &self.current_token.token_type {
            TokenType::String(path) => {
                let path = path.clone();
                self.advance();
                path
            }
            _ => return Err(format!(
                "Expected import path string at position {}", 
                self.current_token.start
            )),
        };
        
        let end = self.previous_token.end;
        
        Ok(AstNode::Use { path, start, end })
    }
    
    /// Parse a prop declaration: prop Name { config }
    /// Props define reusable property configurations
    fn parse_prop(&mut self) -> Result<AstNode, String> {
        let start = self.current_token.start;
        
        // Consume the 'prop' keyword
        self.expect_token(TokenType::Prop)?;
        
        // Parse the prop name (must be an identifier)
        let name = match &self.current_token.token_type {
            TokenType::Identifier(name) => {
                let name = name.clone();
                self.advance();
                name
            }
            _ => return Err(format!(
                "Expected prop name at position {}", 
                self.current_token.start
            )),
        };
        
        // Parse the configuration object
        let config = self.parse_object()?;
        let end = self.previous_token.end;
        
        Ok(AstNode::Prop {
            name,
            config,
            start,
            end,
        })
    }
    
    /// Parse an enum declaration: enum Name { KEY "Value" }
    /// Enums define named constants with display values
    fn parse_enum(&mut self) -> Result<AstNode, String> {
        let start = self.current_token.start;
        
        // Consume the 'enum' keyword
        self.expect_token(TokenType::Enum)?;
        
        // Parse the enum name (must be an identifier)
        let name = match &self.current_token.token_type {
            TokenType::Identifier(name) => {
                let name = name.clone();
                self.advance();
                name
            }
            _ => return Err(format!(
                "Expected enum name at position {}", 
                self.current_token.start
            )),
        };
        
        // Parse the enum variants as key-value pairs
        self.expect_token(TokenType::LeftBrace)?;
        let mut variants = HashMap::new();
        
        while !self.match_token(&TokenType::RightBrace) {
            if self.is_at_end() {
                return Err("Unexpected end of file in enum declaration".to_string());
            }
            
            // Parse enum variant: KEY "Value"
            let key = match &self.current_token.token_type {
                TokenType::Identifier(key) => {
                    let key = key.clone();
                    self.advance();
                    key
                }
                _ => return Err(format!(
                    "Expected enum variant key at position {}", 
                    self.current_token.start
                )),
            };
            
            let value = self.parse_value()?;
            variants.insert(key, value);
        }
        
        let end = self.previous_token.end;
        
        Ok(AstNode::Enum {
            name,
            variants,
            start,
            end,
        })
    }
    
    /// Parse a type declaration: type Name { columns }
    /// Types define custom data structures with columns
    fn parse_type(&mut self) -> Result<AstNode, String> {
        let start = self.current_token.start;
        
        // Consume the 'type' keyword
        self.expect_token(TokenType::Type)?;
        
        // Parse the type name (must be an identifier)
        let name = match &self.current_token.token_type {
            TokenType::Identifier(name) => {
                let name = name.clone();
                self.advance();
                name
            }
            _ => return Err(format!(
                "Expected type name at position {}", 
                self.current_token.start
            )),
        };
        
        // Check for mutability modifier (! means non-mergeable/immutable)
        let mutable = !self.match_token(&TokenType::Exclamation);
        
        // Parse attributes (like @label("Type" "Types"))
        let attributes = self.parse_attributes()?;
        
        // Parse the type body with columns
        let columns = self.parse_columns()?;
        let end = self.previous_token.end;
        
        Ok(AstNode::Type {
            name,
            mutable,
            attributes,
            columns,
            start,
            end,
        })
    }
    
    /// Parse a model declaration: model Name { columns }
    /// Models define database entities and their relationships
    fn parse_model(&mut self) -> Result<AstNode, String> {
        let start = self.current_token.start;
        
        // Consume the 'model' keyword
        self.expect_token(TokenType::Model)?;
        
        // Parse the model name (must be an identifier)
        let name = match &self.current_token.token_type {
            TokenType::Identifier(name) => {
                let name = name.clone();
                self.advance();
                name
            }
            _ => return Err(format!(
                "Expected model name at position {}", 
                self.current_token.start
            )),
        };
        
        // Check for mutability modifier (! means non-mergeable/immutable)
        let mutable = !self.match_token(&TokenType::Exclamation);
        
        // Parse attributes (like @label("User" "Users"))
        let attributes = self.parse_attributes()?;
        
        // Parse the model body with columns
        let columns = self.parse_columns()?;
        let end = self.previous_token.end;
        
        Ok(AstNode::Model {
            name,
            mutable,
            attributes,
            columns,
            start,
            end,
        })
    }
    
    /// Parse attributes that can be applied to declarations
    /// Attributes start with @ and can have parameters: @label("Name")
    fn parse_attributes(&mut self) -> Result<HashMap<String, Value>, String> {
        let mut attributes = HashMap::new();
        
        // Parse all attributes that appear before the opening brace
        while self.match_token(&TokenType::At) {
            let attr = self.parse_attribute()?;
            attributes.insert(attr.name, Value::Array(attr.parameters));
        }
        
        Ok(attributes)
    }
    
    /// Parse a single attribute: @name or @name(params)
    fn parse_attribute(&mut self) -> Result<Attribute, String> {
        // Parse the attribute name (can include dots like @field.input)
        let mut name_parts = Vec::new();
        
        // First part must be an identifier
        match &self.current_token.token_type {
            TokenType::Identifier(part) => {
                name_parts.push(part.clone());
                self.advance();
            }
            _ => return Err(format!(
                "Expected attribute name at position {}", 
                self.current_token.start
            )),
        }
        
        // Handle dotted attribute names like @field.input
        while self.match_token(&TokenType::Dot) {
            match &self.current_token.token_type {
                TokenType::Identifier(part) => {
                    name_parts.push(part.clone());
                    self.advance();
                }
                _ => return Err(format!(
                    "Expected attribute name part after dot at position {}", 
                    self.current_token.start
                )),
            }
        }
        
        let name = name_parts.join(".");
        let mut parameters = Vec::new();
        
        // Parse optional parameters: @name(param1, param2)
        if self.match_token(&TokenType::LeftParen) {
            while !self.match_token(&TokenType::RightParen) {
                if self.is_at_end() {
                    return Err("Unexpected end of file in attribute parameters".to_string());
                }
                
                let param = self.parse_value()?;
                parameters.push(param);
            }
        }
        
        Ok(Attribute { name, parameters })
    }
    
    /// Parse columns within a type or model body
    /// Columns define the fields and their types: name Type @attributes
    fn parse_columns(&mut self) -> Result<HashMap<String, ColumnDefinition>, String> {
        self.expect_token(TokenType::LeftBrace)?;
        let mut columns = HashMap::new();
        
        while !self.match_token(&TokenType::RightBrace) {
            if self.is_at_end() {
                return Err("Unexpected end of file in column definitions".to_string());
            }
            
            // Parse column definition: name Type @attributes
            let column_name = match &self.current_token.token_type {
                TokenType::Identifier(name) => {
                    let name = name.clone();
                    self.advance();
                    name
                }
                _ => return Err(format!(
                    "Expected column name at position {}", 
                    self.current_token.start
                )),
            };
            
            // Parse the column type (can include modifiers like ? and [])
            let (column_type, required, multiple) = self.parse_column_type()?;
            
            // Parse column attributes
            let attributes = self.parse_attributes()?;
            
            let column_def = ColumnDefinition {
                column_type,
                required,
                multiple,
                attributes,
            };
            
            columns.insert(column_name, column_def);
        }
        
        Ok(columns)
    }
    
    /// Parse a column type with optional modifiers
    /// Examples: String, String?, String[], String[]?
    fn parse_column_type(&mut self) -> Result<(String, bool, bool), String> {
        // Parse the base type name
        let base_type = match &self.current_token.token_type {
            TokenType::Identifier(type_name) => {
                let type_name = type_name.clone();
                self.advance();
                type_name
            }
            _ => return Err(format!(
                "Expected type name at position {}", 
                self.current_token.start
            )),
        };
        
        // Check for array modifier []
        let multiple = self.match_token(&TokenType::LeftBracket) && {
            self.expect_token(TokenType::RightBracket)?;
            true
        };
        
        // Check for optional modifier ?
        let required = !self.match_token(&TokenType::Question);
        
        Ok((base_type, required, multiple))
    }
    
    /// Parse an object literal: { key value key value }
    /// Objects in .idea files don't use colons or commas
    fn parse_object(&mut self) -> Result<HashMap<String, Value>, String> {
        self.expect_token(TokenType::LeftBrace)?;
        let mut object = HashMap::new();
        
        while !self.match_token(&TokenType::RightBrace) {
            if self.is_at_end() {
                return Err("Unexpected end of file in object".to_string());
            }
            
            // Parse key (can be an identifier or keyword)
            let key = match &self.current_token.token_type {
                TokenType::Identifier(key) => {
                    let key = key.clone();
                    self.advance();
                    key
                }
                // Allow keywords as object keys
                TokenType::Plugin => {
                    self.advance();
                    "plugin".to_string()
                }
                TokenType::Use => {
                    self.advance();
                    "use".to_string()
                }
                TokenType::Prop => {
                    self.advance();
                    "prop".to_string()
                }
                TokenType::Enum => {
                    self.advance();
                    "enum".to_string()
                }
                TokenType::Type => {
                    self.advance();
                    "type".to_string()
                }
                TokenType::Model => {
                    self.advance();
                    "model".to_string()
                }
                _ => return Err(format!(
                    "Expected object key at position {}", 
                    self.current_token.start
                )),
            };
            
            // Parse value
            let value = self.parse_value()?;
            object.insert(key, value);
        }
        
        Ok(object)
    }
    
    /// Parse an array literal: [ value value value ]
    /// Arrays in .idea files don't use commas
    fn parse_array(&mut self) -> Result<Vec<Value>, String> {
        self.expect_token(TokenType::LeftBracket)?;
        let mut array = Vec::new();
        
        while !self.match_token(&TokenType::RightBracket) {
            if self.is_at_end() {
                return Err("Unexpected end of file in array".to_string());
            }
            
            let value = self.parse_value()?;
            array.push(value);
        }
        
        Ok(array)
    }
    
    /// Parse a value (string, number, boolean, null, object, array, identifier, or env function)
    /// This is used for parsing configuration values, attribute parameters, etc.
    fn parse_value(&mut self) -> Result<Value, String> {
        match &self.current_token.token_type {
            TokenType::String(s) => {
                let value = Value::String(s.clone());
                self.advance();
                Ok(value)
            }
            TokenType::Number(n) => {
                let value = Value::Number(serde_json::Number::from_f64(*n).unwrap());
                self.advance();
                Ok(value)
            }
            TokenType::Boolean(b) => {
                let value = Value::Bool(*b);
                self.advance();
                Ok(value)
            }
            TokenType::Null => {
                self.advance();
                Ok(Value::Null)
            }
            TokenType::LeftBrace => {
                let obj = self.parse_object()?;
                Ok(Value::Object(obj.into_iter().collect()))
            }
            TokenType::LeftBracket => {
                let arr = self.parse_array()?;
                Ok(Value::Array(arr))
            }
            TokenType::Identifier(name) => {
                // Check if this is an env() function call
                if name == "env" && matches!(self.current_token.token_type, TokenType::Identifier(_)) {
                    self.advance(); // consume 'env'
                    
                    // Expect opening parenthesis
                    self.expect_token(TokenType::LeftParen)?;
                    
                    // Parse the environment variable name (should be an identifier)
                    let env_var_name = match &self.current_token.token_type {
                        TokenType::Identifier(var_name) => {
                            let var_name = var_name.clone();
                            self.advance();
                            var_name
                        }
                        _ => return Err(format!(
                            "Expected environment variable name at position {}", 
                            self.current_token.start
                        )),
                    };
                    
                    // Expect closing parenthesis
                    self.expect_token(TokenType::RightParen)?;
                    
                    // Get the environment variable value
                    let env_value = std::env::var(&env_var_name).unwrap_or_default();
                    
                    Ok(Value::String(env_value))
                } else {
                    // Regular identifier - represents references to props or other definitions
                    let value = Value::String(format!("${{{}}}", name));
                    self.advance();
                    Ok(value)
                }
            }
            _ => Err(format!(
                "Unexpected token {:?} at position {}. Expected a value.",
                self.current_token.token_type, self.current_token.start
            )),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::lexer::Lexer;

    #[test]
    fn test_parse_simple_enum() {
        let code = r#"enum Status { ACTIVE "Active" INACTIVE "Inactive" }"#;
        let mut lexer = Lexer::new(code);
        let mut parser = SchemaParser::new(&mut lexer);
        
        let result = parser.parse_enum();
        assert!(result.is_ok());
        
        if let Ok(AstNode::Enum { name, variants, .. }) = result {
            assert_eq!(name, "Status");
            assert_eq!(variants.len(), 2);
            assert!(variants.contains_key("ACTIVE"));
            assert!(variants.contains_key("INACTIVE"));
        } else {
            panic!("Expected enum node");
        }
    }

    #[test]
    fn test_parse_simple_model() {
        let code = r#"model User { id String name String? }"#;
        let mut lexer = Lexer::new(code);
        let mut parser = SchemaParser::new(&mut lexer);
        
        let result = parser.parse_model();
        assert!(result.is_ok());
        
        if let Ok(AstNode::Model { name, columns, .. }) = result {
            assert_eq!(name, "User");
            assert_eq!(columns.len(), 2);
            assert!(columns.contains_key("id"));
            assert!(columns.contains_key("name"));
            
            // Check that 'id' is required and 'name' is optional
            assert!(columns["id"].required);
            assert!(!columns["name"].required);
        } else {
            panic!("Expected model node");
        }
    }

    #[test]
    fn test_parse_use_statement() {
        let code = r#"use "./another.idea""#;
        let mut lexer = Lexer::new(code);
        let mut parser = SchemaParser::new(&mut lexer);
        
        let result = parser.parse_use();
        assert!(result.is_ok());
        
        if let Ok(AstNode::Use { path, .. }) = result {
            assert_eq!(path, "./another.idea");
        } else {
            panic!("Expected use node");
        }
    }

    #[test]
    fn test_parse_env_function() {
        // Set a test environment variable
        std::env::set_var("TEST_VAR", "test_value");
        
        let code = r#"plugin "test" { url env(TEST_VAR) }"#;
        let mut lexer = Lexer::new(code);
        let mut parser = SchemaParser::new(&mut lexer);
        
        let result = parser.parse_plugin();
        assert!(result.is_ok());
        
        if let Ok(AstNode::Plugin { config, .. }) = result {
            if let Some(url_value) = config.get("url") {
                if let Value::String(url) = url_value {
                    assert_eq!(url, "test_value");
                } else {
                    panic!("Expected string value for url");
                }
            } else {
                panic!("Expected url key in config");
            }
        } else {
            panic!("Expected plugin node");
        }
        
        // Clean up
        std::env::remove_var("TEST_VAR");
    }
}
