use std::collections::BTreeMap;

use serde::Serialize;
use serde_json::Value;

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(untagged)]
pub enum AttributeValue {
    Boolean(bool),
    Array(Vec<Value>),
}

pub type EnumConfig = BTreeMap<String, Value>;
pub type PluginConfig = BTreeMap<String, Value>;
pub type PropConfig = BTreeMap<String, Value>;

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct ColumnConfig {
    pub name: String,
    #[serde(rename = "type")]
    pub column_type: String,
    pub attributes: BTreeMap<String, AttributeValue>,
    pub required: bool,
    pub multiple: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct TypeConfig {
    pub name: String,
    pub mutable: bool,
    pub attributes: BTreeMap<String, AttributeValue>,
    pub columns: Vec<ColumnConfig>,
}

pub type ModelConfig = TypeConfig;
