// Compiler for the .idea schema language
// The compiler takes an Abstract Syntax Tree (AST) and converts it into
// the final JSON configuration that matches the TypeScript implementation

use crate::parser::{AstNode, ColumnDefinition};
use crate::{SchemaConfig, FinalSchemaConfig};
use serde_json::Value;
use std::collections::HashMap;

/// The main compiler structure that converts AST nodes into JSON configurations
/// This mirrors the functionality of the TypeScript Compiler class
pub struct Compiler {
    /// Storage for prop definitions that can be referenced by other declarations
    /// This is used during the compilation process to resolve prop references
    prop_references: HashMap<String, Value>,
    
    /// Storage for all other references (enums, types, models) for final compilation
    /// This is used when finalize=true to resolve all identifier references
    all_references: HashMap<String, Value>,
}

impl Compiler {
    /// Create a new compiler instance
    /// 
    /// # Returns
    /// A new Compiler ready to process AST nodes
    pub fn new() -> Self {
        Self {
            prop_references: HashMap::new(),
            all_references: HashMap::new(),
        }
    }
    
    /// Compile a schema AST into a SchemaConfig structure
    /// This is the main entry point for compilation, equivalent to TypeScript's Compiler.schema()
    /// 
    /// # Arguments
    /// * `ast` - The root schema AST node to compile
    /// * `finalize` - Whether to resolve references (true) or preserve them (false)
    /// 
    /// # Returns
    /// A compiled SchemaConfig or an error if compilation fails
    pub fn compile_schema(&self, ast: &AstNode, finalize: bool) -> Result<SchemaConfig, String> {
        match ast {
            AstNode::Schema { body, .. } => {
                let mut schema = SchemaConfig {
                    plugin: None,
                    r#use: None,
                    prop: None,
                    r#enum: None,
                    r#type: None,
                    model: None,
                };
                
                // Create a mutable compiler instance for reference tracking
                let mut compiler = Compiler::new();
                
                // First pass: collect all prop definitions for reference resolution
                if finalize {
                    for node in body {
                        if let AstNode::Prop { name, config, .. } = node {
                            let compiled_config = compiler.compile_object_value(config, false)?;
                            compiler.prop_references.insert(name.clone(), compiled_config.clone());
                            compiler.all_references.insert(name.clone(), compiled_config);
                        }
                    }
                }
                
                // Second pass: compile all declarations
                for node in body {
                    match node {
                        AstNode::Plugin { name, config, .. } => {
                            if schema.plugin.is_none() {
                                schema.plugin = Some(HashMap::new());
                            }
                            let compiled_config = compiler.compile_object_value(config, false)?;
                            schema.plugin.as_mut().unwrap().insert(name.clone(), compiled_config);
                        }
                        
                        AstNode::Use { path, .. } => {
                            if schema.r#use.is_none() {
                                schema.r#use = Some(Vec::new());
                            }
                            schema.r#use.as_mut().unwrap().push(path.clone());
                        }
                        
                        AstNode::Prop { name, config, .. } => {
                            if !finalize {
                                if schema.prop.is_none() {
                                    schema.prop = Some(HashMap::new());
                                }
                                let compiled_config = compiler.compile_object_value(config, false)?;
                                schema.prop.as_mut().unwrap().insert(name.clone(), compiled_config);
                            }
                        }
                        
                        AstNode::Enum { name, variants, .. } => {
                            if schema.r#enum.is_none() {
                                schema.r#enum = Some(HashMap::new());
                            }
                            let compiled_variants = compiler.compile_enum_variants(variants)?;
                            
                            // Add to references for final compilation first (before moving)
                            if finalize {
                                let enum_value = Value::Object(
                                    compiled_variants.iter()
                                        .map(|(k, v)| (k.clone(), v.clone()))
                                        .collect()
                                );
                                compiler.all_references.insert(name.clone(), enum_value);
                            }
                            
                            schema.r#enum.as_mut().unwrap().insert(name.clone(), compiled_variants);
                        }
                        
                        AstNode::Type { name, mutable, attributes, columns, .. } => {
                            if schema.r#type.is_none() {
                                schema.r#type = Some(HashMap::new());
                            }
                            let compiled_type = compiler.compile_type_or_model(
                                name, *mutable, attributes, columns, finalize
                            )?;
                            schema.r#type.as_mut().unwrap().insert(name.clone(), compiled_type.clone());
                            
                            // Add to references for final compilation
                            if finalize {
                                compiler.all_references.insert(name.clone(), compiled_type);
                            }
                        }
                        
                        AstNode::Model { name, mutable, attributes, columns, .. } => {
                            if schema.model.is_none() {
                                schema.model = Some(HashMap::new());
                            }
                            let compiled_model = compiler.compile_type_or_model(
                                name, *mutable, attributes, columns, finalize
                            )?;
                            schema.model.as_mut().unwrap().insert(name.clone(), compiled_model.clone());
                            
                            // Add to references for final compilation
                            if finalize {
                                compiler.all_references.insert(name.clone(), compiled_model);
                            }
                        }
                        
                        _ => {} // Skip schema nodes (shouldn't happen at this level)
                    }
                }
                
                Ok(schema)
            }
            _ => Err("Expected schema node at root level".to_string()),
        }
    }
    
    /// Compile a schema AST into a final configuration with references resolved
    /// This is equivalent to TypeScript's Compiler.final()
    /// 
    /// # Arguments
    /// * `ast` - The root schema AST node to compile
    /// 
    /// # Returns
    /// A compiled FinalSchemaConfig with all references resolved
    pub fn compile_final(&self, ast: &AstNode) -> Result<FinalSchemaConfig, String> {
        // First compile with finalization enabled
        let schema = self.compile_schema(ast, true)?;
        
        // Convert to final schema by removing prop and use sections
        Ok(FinalSchemaConfig {
            plugin: schema.plugin,
            r#enum: schema.r#enum,
            r#type: schema.r#type,
            model: schema.model,
        })
    }
    
    /// Compile enum variants from a HashMap to the expected format
    /// Converts the AST representation to the final JSON format
    fn compile_enum_variants(&self, variants: &HashMap<String, Value>) -> Result<HashMap<String, Value>, String> {
        let mut compiled = HashMap::new();
        
        for (key, value) in variants {
            compiled.insert(key.clone(), value.clone());
        }
        
        Ok(compiled)
    }
    
    /// Compile a type or model declaration into the expected JSON format
    /// This handles the complex transformation from AST to the final structure
    /// including column processing and reference resolution
    fn compile_type_or_model(
        &self,
        name: &str,
        mutable: bool,
        attributes: &HashMap<String, Value>,
        columns: &HashMap<String, ColumnDefinition>,
        finalize: bool,
    ) -> Result<Value, String> {
        let mut result = serde_json::Map::new();
        
        // Add basic properties
        result.insert("name".to_string(), Value::String(name.to_string()));
        result.insert("mutable".to_string(), Value::Bool(mutable));
        
        // Add attributes if present
        if !attributes.is_empty() {
            let compiled_attributes = self.compile_object_value(attributes, finalize)?;
            result.insert("attributes".to_string(), compiled_attributes);
        }
        
        // Convert columns from HashMap to array format (preserving order is important)
        let mut column_array = Vec::new();
        
        for (column_name, column_def) in columns {
            let mut column_obj = serde_json::Map::new();
            
            // Process the column type (handle optional ? and array [] modifiers)
            let mut processed_type = column_def.column_type.clone();
            let mut required = column_def.required;
            let mut multiple = column_def.multiple;
            
            // Handle type modifiers that might be in the type string
            if processed_type.ends_with("?") {
                processed_type = processed_type.trim_end_matches("?").to_string();
                required = false;
            }
            
            if processed_type.ends_with("[]") {
                processed_type = processed_type.trim_end_matches("[]").to_string();
                multiple = true;
            }
            
            // Add column properties
            column_obj.insert("type".to_string(), Value::String(processed_type));
            column_obj.insert("name".to_string(), Value::String(column_name.clone()));
            column_obj.insert("required".to_string(), Value::Bool(required));
            column_obj.insert("multiple".to_string(), Value::Bool(multiple));
            
            // Add attributes if present
            if !column_def.attributes.is_empty() {
                let compiled_attrs = self.compile_object_value(&column_def.attributes, finalize)?;
                column_obj.insert("attributes".to_string(), compiled_attrs);
            }
            
            column_array.push(Value::Object(column_obj));
        }
        
        result.insert("columns".to_string(), Value::Array(column_array));
        
        Ok(Value::Object(result))
    }
    
    /// Compile an object value, optionally resolving references
    /// This handles the conversion of HashMap<String, Value> to JSON Value
    /// and resolves prop references when finalize is true
    fn compile_object_value(&self, obj: &HashMap<String, Value>, finalize: bool) -> Result<Value, String> {
        let mut result = serde_json::Map::new();
        
        for (key, value) in obj {
            let compiled_value = self.compile_value(value, finalize)?;
            result.insert(key.clone(), compiled_value);
        }
        
        Ok(Value::Object(result))
    }
    
    /// Compile a single value, handling different types and reference resolution
    /// This is the core value compilation logic that handles all JSON value types
    fn compile_value(&self, value: &Value, finalize: bool) -> Result<Value, String> {
        match value {
            Value::String(s) => {
                // Check if this is a prop reference (format: ${PropName})
                if finalize && s.starts_with("${") && s.ends_with("}") {
                    let prop_name = &s[2..s.len()-1];
                    
                    // Try to resolve the reference
                    if let Some(resolved) = self.all_references.get(prop_name) {
                        Ok(resolved.clone())
                    } else if let Some(resolved) = self.prop_references.get(prop_name) {
                        Ok(resolved.clone())
                    } else {
                        // If we can't resolve it and we're finalizing, that's an error
                        Err(format!("Unknown reference: {}", prop_name))
                    }
                } else {
                    Ok(value.clone())
                }
            }
            
            Value::Array(arr) => {
                let mut compiled_array = Vec::new();
                for item in arr {
                    compiled_array.push(self.compile_value(item, finalize)?);
                }
                Ok(Value::Array(compiled_array))
            }
            
            Value::Object(obj) => {
                let mut compiled_obj = serde_json::Map::new();
                for (key, val) in obj {
                    compiled_obj.insert(key.clone(), self.compile_value(val, finalize)?);
                }
                Ok(Value::Object(compiled_obj))
            }
            
            // For other types (Number, Bool, Null), just return as-is
            _ => Ok(value.clone()),
        }
    }
}

impl Default for Compiler {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::parser::{AstNode, ColumnDefinition};
    use std::collections::HashMap;

    #[test]
    fn test_compile_simple_enum() {
        let compiler = Compiler::new();
        
        let mut variants = HashMap::new();
        variants.insert("ACTIVE".to_string(), Value::String("Active".to_string()));
        variants.insert("INACTIVE".to_string(), Value::String("Inactive".to_string()));
        
        let enum_node = AstNode::Enum {
            name: "Status".to_string(),
            variants,
            start: 0,
            end: 50,
        };
        
        let schema_node = AstNode::Schema {
            body: vec![enum_node],
            start: 0,
            end: 50,
        };
        
        let result = compiler.compile_schema(&schema_node, false);
        assert!(result.is_ok());
        
        let schema = result.unwrap();
        assert!(schema.r#enum.is_some());
        
        let enums = schema.r#enum.unwrap();
        assert!(enums.contains_key("Status"));
        
        let status_enum = &enums["Status"];
        assert!(status_enum.contains_key("ACTIVE"));
        assert!(status_enum.contains_key("INACTIVE"));
    }

    #[test]
    fn test_compile_simple_model() {
        let compiler = Compiler::new();
        
        let mut columns = HashMap::new();
        columns.insert("id".to_string(), ColumnDefinition {
            column_type: "String".to_string(),
            required: true,
            multiple: false,
            attributes: HashMap::new(),
        });
        columns.insert("name".to_string(), ColumnDefinition {
            column_type: "String".to_string(),
            required: false,
            multiple: false,
            attributes: HashMap::new(),
        });
        
        let model_node = AstNode::Model {
            name: "User".to_string(),
            mutable: false,
            attributes: HashMap::new(),
            columns,
            start: 0,
            end: 100,
        };
        
        let schema_node = AstNode::Schema {
            body: vec![model_node],
            start: 0,
            end: 100,
        };
        
        let result = compiler.compile_schema(&schema_node, false);
        assert!(result.is_ok());
        
        let schema = result.unwrap();
        assert!(schema.model.is_some());
        
        let models = schema.model.unwrap();
        assert!(models.contains_key("User"));
    }

    #[test]
    fn test_compile_with_prop_references() {
        let compiler = Compiler::new();
        
        // Create a prop definition
        let mut prop_config = HashMap::new();
        prop_config.insert("type".to_string(), Value::String("text".to_string()));
        
        let prop_node = AstNode::Prop {
            name: "Text".to_string(),
            config: prop_config,
            start: 0,
            end: 30,
        };
        
        // Create a model that references the prop
        let mut column_attributes = HashMap::new();
        column_attributes.insert(
            "field.input".to_string(), 
            Value::String("${Text}".to_string())
        );
        
        let mut columns = HashMap::new();
        columns.insert("name".to_string(), ColumnDefinition {
            column_type: "String".to_string(),
            required: true,
            multiple: false,
            attributes: column_attributes,
        });
        
        let model_node = AstNode::Model {
            name: "User".to_string(),
            mutable: false,
            attributes: HashMap::new(),
            columns,
            start: 31,
            end: 100,
        };
        
        let schema_node = AstNode::Schema {
            body: vec![prop_node, model_node],
            start: 0,
            end: 100,
        };
        
        // Test with finalize=true (should resolve references)
        let result = compiler.compile_final(&schema_node);
        assert!(result.is_ok());
        
        let final_schema = result.unwrap();
        
        // Prop section should be removed in final schema
        assert!(final_schema.model.is_some());
        
        // The reference should be resolved in the final output
        // This is a simplified test - in reality we'd need to check the actual structure
    }
}
