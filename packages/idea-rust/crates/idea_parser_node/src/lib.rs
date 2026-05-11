//! Thin Node binding for the shared Idea parser core.
//!
//! This crate does not contain parsing logic. Its only job is to expose the
//! shared Rust functions through Node-API and translate `IdeaError` into a
//! plain JavaScript error with the same fields the higher-level package can
//! rely on.

use napi::{Error, Result, Status};
use napi_derive::napi;
use serde_json::{Value, json};

fn map_error(error: idea_parser_core::IdeaError) -> Error {
    let payload = json!({
        "code": format!("{:?}", error.code),
        "message": error.message,
        "start": error.start,
        "end": error.end
    });

    Error::new(Status::GenericFailure, payload.to_string())
}

#[napi]
pub fn tokenize(source: String) -> Result<Value> {
    idea_parser_core::tokenize(&source)
        .and_then(|tokens| serde_json::to_value(tokens).map_err(|error| {
            idea_parser_core::IdeaError::new(
                idea_parser_core::ErrorCode::ValidationError,
                error.to_string(),
            )
        }))
        .map_err(map_error)
}

#[napi]
pub fn parse(source: String) -> Result<Value> {
    idea_parser_core::parse_ast(&source)
        .and_then(|schema| idea_parser_core::compile_schema(&schema, false))
        .and_then(|schema| serde_json::to_value(schema).map_err(|error| {
            idea_parser_core::IdeaError::new(
                idea_parser_core::ErrorCode::ValidationError,
                error.to_string(),
            )
        }))
        .map_err(map_error)
}

#[napi(js_name = "parseAst")]
pub fn parse_ast_binding(source: String) -> Result<Value> {
    idea_parser_core::parse_ast(&source)
        .and_then(|schema| serde_json::to_value(schema).map_err(|error| {
            idea_parser_core::IdeaError::new(
                idea_parser_core::ErrorCode::ValidationError,
                error.to_string(),
            )
        }))
        .map_err(map_error)
}

#[napi(js_name = "final")]
pub fn finalize_binding(source: String) -> Result<Value> {
    idea_parser_core::finalize(&source)
        .and_then(|schema| serde_json::to_value(schema).map_err(|error| {
            idea_parser_core::IdeaError::new(
                idea_parser_core::ErrorCode::ValidationError,
                error.to_string(),
            )
        }))
        .map_err(map_error)
}
