//! Shared parser implementation for the Idea schema language.
//!
//! The crate is intentionally split into three layers:
//! - `token`: debugging and editor-facing token output
//! - `ast`: the syntax tree that preserves declaration structure
//! - `finalize`: compilation into the final schema JSON shape
//!
//! Keeping those stages separate makes the parser easier to reason about and
//! gives the future Node/Python bindings a stable, data-oriented API.

pub mod ast;
pub mod error;
pub mod finalize;
pub mod parser;
pub mod token;
pub mod types;

pub use ast::SchemaToken;
pub use error::{ErrorCode, IdeaError};
pub use finalize::{compile_schema, finalize, FinalSchema, SchemaConfig};
pub use parser::parse as parse_ast;
pub use token::{tokenize, Token, TokenKind, TokenValue};
