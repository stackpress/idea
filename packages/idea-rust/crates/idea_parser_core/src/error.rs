use std::error::Error;
use std::fmt::{Display, Formatter};

use serde::Serialize;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub enum ErrorCode {
    UnexpectedToken,
    UnexpectedEof,
    InvalidDeclaration,
    InvalidLiteral,
    DuplicateName,
    UnknownReference,
    MissingProperty,
    ValidationError,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct IdeaError {
    pub code: ErrorCode,
    pub message: String,
    pub start: Option<usize>,
    pub end: Option<usize>,
}

impl IdeaError {
    pub fn new(code: ErrorCode, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
            start: None,
            end: None,
        }
    }

    pub fn with_span(mut self, start: usize, end: usize) -> Self {
        self.start = Some(start);
        self.end = Some(end);
        self
    }
}

impl Display for IdeaError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

impl Error for IdeaError {}
