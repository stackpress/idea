use serde::Serialize;

use crate::error::{ErrorCode, IdeaError};

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum TokenKind {
    Word,
    String,
    Integer,
    Float,
    Boolean,
    Null,
    Symbol,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(untagged)]
pub enum TokenValue {
    String(String),
    Integer(i64),
    Float(f64),
    Boolean(bool),
    Null,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
pub struct Token {
    pub kind: TokenKind,
    pub start: usize,
    pub end: usize,
    pub lexeme: String,
    pub value: Option<TokenValue>,
}

/// Tokenization is intentionally lightweight.
///
/// The parser itself does not consume this token stream directly. Instead, this
/// function exists as a stable debugging surface for bindings and editor tools.
pub fn tokenize(source: &str) -> Result<Vec<Token>, IdeaError> {
    let mut tokens = Vec::new();
    let mut cursor = Cursor::new(source);

    while !cursor.is_eof() {
        cursor.skip_noncode()?;
        if cursor.is_eof() {
            break;
        }

        if let Some(token) = cursor.read_symbol() {
            tokens.push(token);
            continue;
        }

        if let Some(token) = cursor.read_string()? {
            tokens.push(token);
            continue;
        }

        if let Some(token) = cursor.read_number()? {
            tokens.push(token);
            continue;
        }

        if let Some(token) = cursor.read_word() {
            tokens.push(token);
            continue;
        }

        return Err(IdeaError::new(
            ErrorCode::UnexpectedToken,
            format!("Unexpected token {}", cursor.preview()),
        )
        .with_span(cursor.index, cursor.index + 1));
    }

    Ok(tokens)
}

struct Cursor<'a> {
    source: &'a str,
    index: usize,
}

impl<'a> Cursor<'a> {
    fn new(source: &'a str) -> Self {
        Self { source, index: 0 }
    }

    fn is_eof(&self) -> bool {
        self.index >= self.source.len()
    }

    fn current(&self) -> Option<char> {
        self.source[self.index..].chars().next()
    }

    fn advance_char(&mut self) -> Option<char> {
        let ch = self.current()?;
        self.index += ch.len_utf8();
        Some(ch)
    }

    fn starts_with(&self, value: &str) -> bool {
        self.source[self.index..].starts_with(value)
    }

    fn preview(&self) -> String {
        self.source[self.index..]
            .chars()
            .take(10)
            .collect::<String>()
            .replace(['\n', '\r'], " ")
            .trim()
            .to_string()
    }

    fn skip_noncode(&mut self) -> Result<(), IdeaError> {
        loop {
            let start = self.index;

            while matches!(self.current(), Some(ch) if ch.is_whitespace()) {
                self.advance_char();
            }

            if self.starts_with("//") {
                while let Some(ch) = self.advance_char() {
                    if ch == '\n' || ch == '\r' {
                        break;
                    }
                }
            } else if self.starts_with("/*") {
                self.index += 2;
                while !self.is_eof() && !self.starts_with("*/") {
                    self.advance_char();
                }
                if self.is_eof() {
                    return Err(IdeaError::new(
                        ErrorCode::UnexpectedEof,
                        "Unterminated block comment",
                    ));
                }
                self.index += 2;
            }

            if self.index == start {
                break;
            }
        }

        Ok(())
    }

    fn read_symbol(&mut self) -> Option<Token> {
        let ch = self.current()?;
        if !matches!(ch, '{' | '}' | '[' | ']' | '(' | ')' | '!' | '@') {
            return None;
        }

        let start = self.index;
        self.advance_char();
        Some(Token {
            kind: TokenKind::Symbol,
            start,
            end: self.index,
            lexeme: ch.to_string(),
            value: None,
        })
    }

    fn read_string(&mut self) -> Result<Option<Token>, IdeaError> {
        if self.current() != Some('"') {
            return Ok(None);
        }

        let start = self.index;
        self.advance_char();
        let mut value = String::new();

        while let Some(ch) = self.current() {
            if ch == '"' {
                self.advance_char();
                return Ok(Some(Token {
                    kind: TokenKind::String,
                    start,
                    end: self.index,
                    lexeme: self.source[start..self.index].to_string(),
                    value: Some(TokenValue::String(value)),
                }));
            }

            value.push(ch);
            self.advance_char();
        }

        Err(IdeaError::new(ErrorCode::UnexpectedEof, "Unterminated string literal")
            .with_span(start, self.source.len()))
    }

    fn read_number(&mut self) -> Result<Option<Token>, IdeaError> {
        let start = self.index;
        let mut peek = self.source[self.index..].chars();
        let first = match peek.next() {
            Some(value) => value,
            None => return Ok(None),
        };

        if !first.is_ascii_digit() && first != '-' {
            return Ok(None);
        }

        if first == '-' {
            self.advance_char();
            if !matches!(self.current(), Some(ch) if ch.is_ascii_digit()) {
                return Err(IdeaError::new(ErrorCode::InvalidLiteral, "Invalid number literal")
                    .with_span(start, self.index));
            }
        } else {
            self.advance_char();
        }

        while matches!(self.current(), Some(ch) if ch.is_ascii_digit()) {
            self.advance_char();
        }

        let mut is_float = false;
        if self.current() == Some('.') {
            is_float = true;
            self.advance_char();
            while matches!(self.current(), Some(ch) if ch.is_ascii_digit()) {
                self.advance_char();
            }
        }

        let lexeme = self.source[start..self.index].to_string();
        if is_float {
            let value = lexeme.parse::<f64>().map_err(|_| {
                IdeaError::new(ErrorCode::InvalidLiteral, "Invalid float literal")
                    .with_span(start, self.index)
            })?;
            Ok(Some(Token {
                kind: TokenKind::Float,
                start,
                end: self.index,
                lexeme,
                value: Some(TokenValue::Float(value)),
            }))
        } else {
            let value = lexeme.parse::<i64>().map_err(|_| {
                IdeaError::new(ErrorCode::InvalidLiteral, "Invalid integer literal")
                    .with_span(start, self.index)
            })?;
            Ok(Some(Token {
                kind: TokenKind::Integer,
                start,
                end: self.index,
                lexeme,
                value: Some(TokenValue::Integer(value)),
            }))
        }
    }

    fn read_word(&mut self) -> Option<Token> {
        let start = self.index;
        let first = self.current()?;
        if !(first.is_ascii_alphanumeric() || first == '_' || first == '.' || first == '?' || first == '/') {
            return None;
        }

        while matches!(self.current(), Some(ch)
            if ch.is_ascii_alphanumeric() || matches!(ch, '_' | '.' | '?' | '/' | '-'))
        {
            self.advance_char();
        }

        let lexeme = self.source[start..self.index].to_string();
        let (kind, value) = match lexeme.as_str() {
            "true" => (TokenKind::Boolean, Some(TokenValue::Boolean(true))),
            "false" => (TokenKind::Boolean, Some(TokenValue::Boolean(false))),
            "null" => (TokenKind::Null, Some(TokenValue::Null)),
            _ => (TokenKind::Word, None),
        };

        Some(Token {
            kind,
            start,
            end: self.index,
            lexeme,
            value,
        })
    }
}
