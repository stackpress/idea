use std::collections::{BTreeMap, HashMap};

use serde::Serialize;
use serde_json::{Map, Value};

use crate::ast::{
    DataToken, DeclarationToken, IdentifierToken, ImportToken, ObjectToken, PropertyToken,
    SchemaToken, Statement,
};
use crate::error::{ErrorCode, IdeaError};
use crate::types::{AttributeValue, ColumnConfig, EnumConfig, ModelConfig, PluginConfig, PropConfig, TypeConfig};

#[derive(Debug, Clone, PartialEq, Serialize, Default)]
pub struct SchemaConfig {
    #[serde(skip_serializing_if = "Vec::is_empty", default)]
    pub r#use: Vec<String>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub plugin: BTreeMap<String, PluginConfig>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub prop: BTreeMap<String, PropConfig>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub r#enum: BTreeMap<String, EnumConfig>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub r#type: BTreeMap<String, TypeConfig>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub model: BTreeMap<String, ModelConfig>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Default)]
pub struct FinalSchema {
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub plugin: BTreeMap<String, PluginConfig>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub r#enum: BTreeMap<String, EnumConfig>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub r#type: BTreeMap<String, TypeConfig>,
    #[serde(skip_serializing_if = "BTreeMap::is_empty", default)]
    pub model: BTreeMap<String, ModelConfig>,
}

pub fn finalize(source: &str) -> Result<FinalSchema, IdeaError> {
    let ast = crate::parse_ast(source)?;
    let schema = compile_schema(&ast, true)?;
    Ok(FinalSchema {
        plugin: schema.plugin,
        r#enum: schema.r#enum,
        r#type: schema.r#type,
        model: schema.model,
    })
}

pub fn compile_schema(ast: &SchemaToken, finalize: bool) -> Result<SchemaConfig, IdeaError> {
    let mut schema = SchemaConfig::default();
    let mut references: HashMap<String, Value> = HashMap::new();

    for statement in &ast.body {
        if let Statement::Import(import) = statement {
            schema.r#use.push(compile_use(import)?);
        }
    }

    for statement in &ast.body {
        let declaration = match statement {
            Statement::Declaration(value) => value,
            Statement::Import(_) => continue,
        };

        match declaration.kind {
            "enum" => {
                let (key, value) = compile_enum(declaration)?;
                ensure_unique(&references, &key, declaration.start, declaration.end)?;
                references.insert(key.clone(), serde_json::to_value(&value).unwrap_or(Value::Null));
                schema.r#enum.insert(key, value);
            }
            "prop" => {
                let (key, value) = compile_prop(declaration, if finalize { Some(&references) } else { None })?;
                ensure_unique(&references, &key, declaration.start, declaration.end)?;
                references.insert(key.clone(), to_object_value(&value));
                schema.prop.insert(key, value);
            }
            "type" => {
                let (key, value) = compile_type_like(declaration, if finalize { Some(&references) } else { None })?;
                ensure_unique(&references, &key, declaration.start, declaration.end)?;
                references.insert(key.clone(), serde_json::to_value(&value).unwrap_or(Value::Null));
                schema.r#type.insert(key, value);
            }
            "model" => {
                let (key, value) = compile_type_like(declaration, if finalize { Some(&references) } else { None })?;
                ensure_unique(&references, &key, declaration.start, declaration.end)?;
                references.insert(key.clone(), serde_json::to_value(&value).unwrap_or(Value::Null));
                schema.model.insert(key, value);
            }
            "plugin" => {
                let (key, value) = compile_plugin(declaration)?;
                ensure_unique(&references, &key, declaration.start, declaration.end)?;
                references.insert(key.clone(), to_object_value(&value));
                schema.plugin.insert(key, value);
            }
            _ => {
                return Err(IdeaError::new(
                    ErrorCode::InvalidDeclaration,
                    format!("Invalid declaration {}", declaration.kind),
                )
                .with_span(declaration.start, declaration.end));
            }
        }
    }

    Ok(schema)
}

fn ensure_unique(
    references: &HashMap<String, Value>,
    key: &str,
    start: usize,
    end: usize,
) -> Result<(), IdeaError> {
    if references.contains_key(key) {
        return Err(IdeaError::new(ErrorCode::DuplicateName, format!("Duplicate {}", key))
            .with_span(start, end));
    }
    Ok(())
}

fn compile_data(token: &DataToken, references: Option<&HashMap<String, Value>>) -> Result<Value, IdeaError> {
    match token {
        DataToken::Object(value) => compile_object(value, references),
        DataToken::Array(value) => {
            let mut compiled = Vec::with_capacity(value.elements.len());
            for element in &value.elements {
                compiled.push(compile_data(element, references)?);
            }
            Ok(Value::Array(compiled))
        }
        DataToken::Literal(value) => Ok(value.value.clone()),
        DataToken::Identifier(value) => compile_identifier(value, references),
    }
}

fn compile_identifier(
    token: &IdentifierToken,
    references: Option<&HashMap<String, Value>>,
) -> Result<Value, IdeaError> {
    if let Some(references) = references {
        if let Some(value) = references.get(&token.name) {
            return Ok(value.clone());
        }

        return Err(IdeaError::new(
            ErrorCode::UnknownReference,
            format!("Unknown reference {}", token.name),
        )
        .with_span(token.start, token.end));
    }

    Ok(Value::String(format!("${{{}}}", token.name)))
}

fn compile_object(
    token: &ObjectToken,
    references: Option<&HashMap<String, Value>>,
) -> Result<Value, IdeaError> {
    let mut object = Map::new();
    for property in &token.properties {
        object.insert(property.key.name.clone(), compile_data(&property.value, references)?);
    }
    Ok(Value::Object(object))
}

fn compile_enum(token: &DeclarationToken) -> Result<(String, EnumConfig), IdeaError> {
    let declarator = first_declarator(token)?;
    let mut options = BTreeMap::new();
    for property in &declarator.init.properties {
        options.insert(property.key.name.clone(), literal_value(&property.value)?);
    }
    Ok((declarator.id.name.clone(), options))
}

fn compile_prop(
    token: &DeclarationToken,
    references: Option<&HashMap<String, Value>>,
) -> Result<(String, PropConfig), IdeaError> {
    let declarator = first_declarator(token)?;
    let mut config = BTreeMap::new();
    for property in &declarator.init.properties {
        config.insert(property.key.name.clone(), compile_data(&property.value, references)?);
    }
    Ok((declarator.id.name.clone(), config))
}

fn compile_plugin(token: &DeclarationToken) -> Result<(String, PluginConfig), IdeaError> {
    let declarator = first_declarator(token)?;
    let mut config = BTreeMap::new();
    for property in &declarator.init.properties {
        config.insert(property.key.name.clone(), compile_data(&property.value, None)?);
    }
    Ok((declarator.id.name.clone(), config))
}

fn compile_type_like(
    token: &DeclarationToken,
    references: Option<&HashMap<String, Value>>,
) -> Result<(String, TypeConfig), IdeaError> {
    let declarator = first_declarator(token)?;
    let mut attributes = BTreeMap::new();
    let mut columns_source: Option<&ObjectToken> = None;

    for property in &declarator.init.properties {
        match property.key.name.as_str() {
            "attributes" => {
                attributes = compile_attributes(expect_object(&property.value)?, references)?;
            }
            "columns" => {
                columns_source = Some(expect_object(&property.value)?);
            }
            _ => {}
        }
    }

    let columns_source = columns_source.ok_or_else(|| {
        IdeaError::new(ErrorCode::MissingProperty, "Expecting a columns property")
            .with_span(token.start, token.end)
    })?;

    let mut columns = Vec::with_capacity(columns_source.properties.len());
    for column in &columns_source.properties {
        columns.push(compile_column(column, references)?);
    }

    let name = declarator.id.name.clone();
    Ok((
        name.clone(),
        TypeConfig {
            name,
            mutable: token.mutable.unwrap_or(true),
            attributes,
            columns,
        },
    ))
}

fn compile_column(
    property: &PropertyToken,
    references: Option<&HashMap<String, Value>>,
) -> Result<ColumnConfig, IdeaError> {
    let source = expect_object(&property.value)?;
    let mut type_name = String::new();
    let mut attributes = BTreeMap::new();

    for inner in &source.properties {
        match inner.key.name.as_str() {
            "type" => {
                type_name = literal_string(&inner.value)?;
            }
            "attributes" => {
                attributes = compile_attributes(expect_object(&inner.value)?, references)?;
            }
            _ => {}
        }
    }

    let required = !type_name.ends_with('?');
    let normalized = type_name.trim_end_matches('?').to_string();
    let multiple = normalized.ends_with("[]");
    let normalized = normalized.trim_end_matches("[]").to_string();

    Ok(ColumnConfig {
        name: property.key.name.clone(),
        column_type: normalized,
        attributes,
        required,
        multiple,
    })
}

fn compile_attributes(
    object: &ObjectToken,
    references: Option<&HashMap<String, Value>>,
) -> Result<BTreeMap<String, AttributeValue>, IdeaError> {
    let mut attributes = BTreeMap::new();
    for property in &object.properties {
        let value = match &property.value {
            DataToken::Literal(literal) if literal.value == Value::Bool(true) => AttributeValue::Boolean(true),
            DataToken::Array(array) => {
                if array.elements.is_empty() {
                    attributes.insert(property.key.name.clone(), AttributeValue::Boolean(true));
                    continue;
                }

                let mut compiled = Vec::with_capacity(array.elements.len());
                for item in &array.elements {
                    compiled.push(compile_data(item, references)?);
                }
                AttributeValue::Array(compiled)
            }
            _ => {
                let compiled = compile_data(&property.value, references)?;
                AttributeValue::Array(vec![compiled])
            }
        };
        attributes.insert(property.key.name.clone(), value);
    }
    Ok(attributes)
}

fn compile_use(token: &ImportToken) -> Result<String, IdeaError> {
    if token.node_type != "ImportDeclaration" {
        return Err(IdeaError::new(ErrorCode::ValidationError, "Invalid Import")
            .with_span(token.start, token.end));
    }
    token.source.value.as_str().map(ToOwned::to_owned).ok_or_else(|| {
        IdeaError::new(ErrorCode::ValidationError, "Invalid Import")
            .with_span(token.source.start, token.source.end)
    })
}

fn first_declarator(token: &DeclarationToken) -> Result<&crate::ast::DeclaratorToken, IdeaError> {
    token.declarations.first().ok_or_else(|| {
        IdeaError::new(ErrorCode::ValidationError, "Missing declaration")
            .with_span(token.start, token.end)
    })
}

fn expect_object(token: &DataToken) -> Result<&ObjectToken, IdeaError> {
    if let DataToken::Object(value) = token {
        Ok(value)
    } else {
        Err(IdeaError::new(ErrorCode::ValidationError, "Expected object"))
    }
}

fn literal_value(token: &DataToken) -> Result<Value, IdeaError> {
    if let DataToken::Literal(literal) = token {
        Ok(literal.value.clone())
    } else {
        Err(IdeaError::new(ErrorCode::ValidationError, "Expected literal"))
    }
}

fn literal_string(token: &DataToken) -> Result<String, IdeaError> {
    let value = literal_value(token)?;
    value.as_str().map(ToOwned::to_owned).ok_or_else(|| {
        IdeaError::new(ErrorCode::ValidationError, "Expected string literal")
    })
}

fn to_object_value<T: Serialize>(value: &T) -> Value {
    serde_json::to_value(value).unwrap_or(Value::Null)
}
