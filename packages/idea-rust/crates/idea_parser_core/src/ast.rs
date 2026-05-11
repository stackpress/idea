use serde::Serialize;

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct SchemaToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub kind: &'static str,
    pub start: usize,
    pub end: usize,
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(untagged)]
pub enum Statement {
    Declaration(DeclarationToken),
    Import(ImportToken),
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ImportToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub start: usize,
    pub end: usize,
    pub specifiers: Vec<()>,
    pub source: LiteralToken,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct DeclarationToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub kind: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mutable: Option<bool>,
    pub start: usize,
    pub end: usize,
    pub declarations: Vec<DeclaratorToken>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct DeclaratorToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub start: usize,
    pub end: usize,
    pub id: IdentifierToken,
    pub init: ObjectToken,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct IdentifierToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub start: usize,
    pub end: usize,
    pub name: String,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ObjectToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub start: usize,
    pub end: usize,
    pub properties: Vec<PropertyToken>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct PropertyToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub kind: &'static str,
    pub start: usize,
    pub end: usize,
    pub key: IdentifierToken,
    pub value: DataToken,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub method: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub shorthand: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub computed: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ArrayToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub start: usize,
    pub end: usize,
    pub elements: Vec<DataToken>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct LiteralToken {
    #[serde(rename = "type")]
    pub node_type: &'static str,
    pub start: usize,
    pub end: usize,
    pub value: serde_json::Value,
    pub raw: String,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(untagged)]
pub enum DataToken {
    Identifier(IdentifierToken),
    Literal(LiteralToken),
    Object(ObjectToken),
    Array(ArrayToken),
}

impl IdentifierToken {
    pub fn new(start: usize, end: usize, name: impl Into<String>) -> Self {
        Self {
            node_type: "Identifier",
            start,
            end,
            name: name.into(),
        }
    }
}

impl LiteralToken {
    pub fn new(start: usize, end: usize, value: serde_json::Value, raw: impl Into<String>) -> Self {
        Self {
            node_type: "Literal",
            start,
            end,
            value,
            raw: raw.into(),
        }
    }
}

impl PropertyToken {
    pub fn new(start: usize, end: usize, key: IdentifierToken, value: DataToken) -> Self {
        Self {
            node_type: "Property",
            kind: "init",
            start,
            end,
            key,
            value,
            method: Some(false),
            shorthand: Some(false),
            computed: Some(false),
        }
    }
}

impl ObjectToken {
    pub fn new(start: usize, end: usize, properties: Vec<PropertyToken>) -> Self {
        Self {
            node_type: "ObjectExpression",
            start,
            end,
            properties,
        }
    }
}

impl ArrayToken {
    pub fn new(start: usize, end: usize, elements: Vec<DataToken>) -> Self {
        Self {
            node_type: "ArrayExpression",
            start,
            end,
            elements,
        }
    }
}
