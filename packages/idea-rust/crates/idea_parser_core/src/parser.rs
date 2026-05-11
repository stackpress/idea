use serde_json::Value;

use crate::ast::{
    ArrayToken, DataToken, DeclarationToken, DeclaratorToken, IdentifierToken, ImportToken,
    LiteralToken, ObjectToken, PropertyToken, SchemaToken, Statement,
};
use crate::error::{ErrorCode, IdeaError};

pub fn parse(source: &str) -> Result<SchemaToken, IdeaError> {
    let mut parser = Parser::new(source);
    let start = parser.index;
    let mut body = Vec::new();

    parser.skip_noncode()?;
    while !parser.is_eof() {
        body.push(parser.parse_statement()?);
        parser.skip_noncode()?;
    }

    Ok(SchemaToken {
        node_type: "Program",
        kind: "schema",
        start,
        end: parser.index,
        body,
    })
}

struct Parser<'a> {
    source: &'a str,
    index: usize,
}

impl<'a> Parser<'a> {
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

    fn parse_statement(&mut self) -> Result<Statement, IdeaError> {
        let word = self.peek_word().ok_or_else(|| {
            IdeaError::new(ErrorCode::UnexpectedToken, "Expected declaration")
                .with_span(self.index, self.index + 1)
        })?;

        match word.as_str() {
            "plugin" => Ok(Statement::Declaration(self.parse_plugin()?)),
            "use" => Ok(Statement::Import(self.parse_use()?)),
            "prop" => Ok(Statement::Declaration(self.parse_prop()?)),
            "enum" => Ok(Statement::Declaration(self.parse_enum()?)),
            "type" => Ok(Statement::Declaration(self.parse_type_like("type")?)),
            "model" => Ok(Statement::Declaration(self.parse_type_like("model")?)),
            _ => Err(IdeaError::new(
                ErrorCode::UnexpectedToken,
                format!("Unexpected token {}", word),
            )
            .with_span(self.index, self.index + word.len())),
        }
    }

    fn parse_use(&mut self) -> Result<ImportToken, IdeaError> {
        let start = self.index;
        self.expect_keyword("use")?;
        self.expect_whitespace()?;
        let source = self.parse_string_literal()?;
        Ok(ImportToken {
            node_type: "ImportDeclaration",
            start,
            end: self.index,
            specifiers: vec![],
            source,
        })
    }

    fn parse_plugin(&mut self) -> Result<DeclarationToken, IdeaError> {
        let start = self.index;
        self.expect_keyword("plugin")?;
        self.expect_whitespace()?;
        let id_literal = self.parse_string_literal()?;
        self.expect_whitespace()?;
        let init = self.parse_object_literal()?;
        let id = IdentifierToken::new(id_literal.start, id_literal.end, id_literal.value.as_str().unwrap_or_default());

        Ok(self.declaration("plugin", None, start, self.index, id, init))
    }

    fn parse_prop(&mut self) -> Result<DeclarationToken, IdeaError> {
        let start = self.index;
        self.expect_keyword("prop")?;
        self.expect_whitespace()?;
        let id = self.parse_capital_identifier()?;
        self.expect_whitespace()?;
        let init = self.parse_object_literal()?;
        Ok(self.declaration("prop", None, start, init.end, id, init))
    }

    fn parse_enum(&mut self) -> Result<DeclarationToken, IdeaError> {
        let start = self.index;
        self.expect_keyword("enum")?;
        self.expect_whitespace()?;
        let id = self.parse_capital_identifier()?;
        self.expect_whitespace()?;
        self.expect_char('{')?;
        self.skip_noncode()?;

        let mut properties = Vec::new();
        while !self.check_char('}') {
            let key = self.parse_upper_identifier()?;
            self.expect_whitespace()?;
            let value = self.parse_scalar_literal()?;
            let end = value.end;
            properties.push(PropertyToken::new(key.start, end, key, DataToken::Literal(value)));
            self.expect_whitespace()?;
            self.skip_noncode()?;
        }
        self.expect_char('}')?;

        Ok(self.declaration("enum", None, start, self.index, id, ObjectToken::new(start, self.index, properties)))
    }

    fn parse_type_like(&mut self, kind: &'static str) -> Result<DeclarationToken, IdeaError> {
        let start = self.index;
        self.expect_keyword(kind)?;
        self.expect_whitespace()?;
        let id = self.parse_capital_identifier()?;
        let mutable = !self.consume_char('!');
        self.expect_whitespace()?;

        let attributes = self.parse_attribute_properties()?;
        self.skip_noncode()?;
        self.expect_char('{')?;
        self.skip_noncode()?;

        let mut columns = Vec::new();
        while !self.check_char('}') {
            columns.push(self.parse_column_property()?);
        }
        self.expect_char('}')?;

        let init = ObjectToken::new(
            start,
            self.index,
            vec![
                PropertyToken::new(
                    start,
                    self.index,
                    IdentifierToken::new(start, start + 10, "attributes"),
                    DataToken::Object(ObjectToken::new(start, self.index, attributes)),
                ),
                PropertyToken::new(
                    start,
                    self.index,
                    IdentifierToken::new(start, start + 7, "columns"),
                    DataToken::Object(ObjectToken::new(start, self.index, columns)),
                ),
            ],
        );

        Ok(self.declaration(kind, Some(mutable), start, self.index, id, init))
    }

    fn parse_column_property(&mut self) -> Result<PropertyToken, IdeaError> {
        let key = self.parse_camel_identifier()?;
        self.expect_whitespace()?;
        let value = self.parse_type_literal()?;
        self.expect_whitespace()?;
        let attributes = self.parse_attribute_properties()?;
        self.skip_noncode()?;

        let value_start = value.start;
        let end = self.index;
        Ok(PropertyToken::new(
            key.start,
            end,
            key,
            DataToken::Object(ObjectToken::new(
                value_start,
                end,
                vec![
                    PropertyToken::new(
                        value_start,
                        value.end,
                        IdentifierToken::new(value_start, value.end, "type"),
                        DataToken::Literal(value.clone()),
                    ),
                    PropertyToken::new(
                        value_start,
                        end,
                        IdentifierToken::new(value_start, value.end, "attributes"),
                        DataToken::Object(ObjectToken::new(value_start, end, attributes)),
                    ),
                ],
            )),
        ))
    }

    fn parse_attribute_properties(&mut self) -> Result<Vec<PropertyToken>, IdeaError> {
        let mut properties = Vec::new();
        while self.check_char('@') {
            properties.push(self.parse_attribute_property()?);
            self.skip_noncode()?;
        }
        Ok(properties)
    }

    /// Attributes are the trickiest part of the grammar because they mix two forms:
    /// `@flag` and `@method(arg1 arg2)`.
    ///
    /// The parser keeps them normalized as object properties so finalization can
    /// resolve prop references later without caring whether the source came from a
    /// top-level declaration attribute or a column attribute.
    fn parse_attribute_property(&mut self) -> Result<PropertyToken, IdeaError> {
        let start = self.index;
        self.expect_char('@')?;
        let key = self.parse_attribute_identifier(start)?;
        let value = if self.consume_char('(') {
            self.skip_noncode()?;
            let mut elements = Vec::new();
            while !self.check_char(')') {
                elements.push(self.parse_attribute_data()?);
                self.skip_noncode()?;
            }
            self.expect_char(')')?;
            DataToken::Array(ArrayToken::new(start, self.index, elements))
        } else {
            DataToken::Literal(LiteralToken::new(start, self.index, Value::Bool(true), "true"))
        };

        Ok(PropertyToken::new(start, self.index, key, value))
    }

    fn parse_attribute_data(&mut self) -> Result<DataToken, IdeaError> {
        if self.current() == Some('{') {
            return Ok(DataToken::Object(self.parse_object_literal()?));
        }
        if self.current() == Some('[') {
            return Ok(DataToken::Array(self.parse_array_literal()?));
        }
        if self.current() == Some('"') || self.starts_with("env(\"") || matches!(self.current(), Some(ch) if ch.is_ascii_digit() || ch == '-') {
            return self.parse_data();
        }

        if let Some(word) = self.peek_word() {
            if matches!(word.as_str(), "true" | "false" | "null") {
                return self.parse_data();
            }
            if is_capital_identifier(&word) {
                let start = self.index;
                let identifier = self.parse_capital_identifier()?;
                return Ok(DataToken::Identifier(IdentifierToken::new(start, self.index, identifier.name)));
            }
        }

        self.parse_data()
    }

    fn parse_data(&mut self) -> Result<DataToken, IdeaError> {
        if self.current() == Some('{') {
            return Ok(DataToken::Object(self.parse_object_literal()?));
        }
        if self.current() == Some('[') {
            return Ok(DataToken::Array(self.parse_array_literal()?));
        }
        if self.starts_with("env(\"") {
            return Ok(DataToken::Literal(self.parse_env_literal()?));
        }
        if self.current() == Some('"') {
            return Ok(DataToken::Literal(self.parse_string_literal()?));
        }
        if matches!(self.current(), Some(ch) if ch.is_ascii_digit() || ch == '-') {
            return Ok(DataToken::Literal(self.parse_number_literal()?));
        }

        let word = self.peek_word().ok_or_else(|| {
            IdeaError::new(ErrorCode::UnexpectedToken, "Expected data").with_span(self.index, self.index + 1)
        })?;
        if matches!(word.as_str(), "true" | "false" | "null") {
            return Ok(DataToken::Literal(self.parse_scalar_literal()?));
        }

        let identifier = self.parse_any_identifier()?;
        Ok(DataToken::Identifier(identifier))
    }

    fn parse_object_literal(&mut self) -> Result<ObjectToken, IdeaError> {
        let start = self.index;
        self.expect_char('{')?;
        self.skip_noncode()?;
        let mut properties = Vec::new();
        while !self.check_char('}') {
            let key = self.parse_any_identifier()?;
            self.expect_whitespace()?;
            let value = self.parse_data()?;
            let end = value_end(&value);
            properties.push(PropertyToken::new(key.start, end, key, value));
            self.skip_noncode()?;
        }
        self.expect_char('}')?;
        Ok(ObjectToken::new(start, self.index, properties))
    }

    fn parse_array_literal(&mut self) -> Result<ArrayToken, IdeaError> {
        let start = self.index;
        self.expect_char('[')?;
        self.skip_noncode()?;
        let mut elements = Vec::new();
        while !self.check_char(']') {
            elements.push(self.parse_data()?);
            self.skip_noncode()?;
        }
        self.expect_char(']')?;
        Ok(ArrayToken::new(start, self.index, elements))
    }

    fn parse_env_literal(&mut self) -> Result<LiteralToken, IdeaError> {
        let start = self.index;
        self.expect_keyword("env")?;
        self.expect_char('(')?;
        let key = self.parse_string_literal()?;
        self.expect_char(')')?;
        let env_key = key.value.as_str().unwrap_or_default();
        let value = std::env::var(env_key).unwrap_or_default();
        Ok(LiteralToken::new(start, self.index, Value::String(value.clone()), format!("'{}'", value)))
    }

    fn parse_string_literal(&mut self) -> Result<LiteralToken, IdeaError> {
        let start = self.index;
        self.expect_char('"')?;
        let mut value = String::new();
        while let Some(ch) = self.current() {
            if ch == '"' {
                self.advance_char();
                return Ok(LiteralToken::new(start, self.index, Value::String(value.clone()), format!("'{}'", value)));
            }
            value.push(ch);
            self.advance_char();
        }
        Err(IdeaError::new(ErrorCode::UnexpectedEof, "Unterminated string literal")
            .with_span(start, self.source.len()))
    }

    fn parse_number_literal(&mut self) -> Result<LiteralToken, IdeaError> {
        let start = self.index;
        if self.current() == Some('-') {
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
        let raw = &self.source[start..self.index];
        if is_float {
            let value = raw.parse::<f64>().map_err(|_| {
                IdeaError::new(ErrorCode::InvalidLiteral, "Invalid float literal")
                    .with_span(start, self.index)
            })?;
            Ok(LiteralToken::new(start, self.index, Value::from(value), raw))
        } else {
            let value = raw.parse::<i64>().map_err(|_| {
                IdeaError::new(ErrorCode::InvalidLiteral, "Invalid integer literal")
                    .with_span(start, self.index)
            })?;
            Ok(LiteralToken::new(start, self.index, Value::from(value), raw))
        }
    }

    fn parse_scalar_literal(&mut self) -> Result<LiteralToken, IdeaError> {
        if self.current() == Some('"') {
            return self.parse_string_literal();
        }
        if matches!(self.current(), Some(ch) if ch.is_ascii_digit() || ch == '-') {
            return self.parse_number_literal();
        }

        let start = self.index;
        let word = self.parse_word()?;
        match word.as_str() {
            "true" => Ok(LiteralToken::new(start, self.index, Value::Bool(true), "true")),
            "false" => Ok(LiteralToken::new(start, self.index, Value::Bool(false), "false")),
            "null" => Ok(LiteralToken::new(start, self.index, Value::Null, "null")),
            _ => Err(IdeaError::new(ErrorCode::InvalidLiteral, format!("Invalid literal {}", word))
                .with_span(start, self.index)),
        }
    }

    fn parse_type_literal(&mut self) -> Result<LiteralToken, IdeaError> {
        let start = self.index;
        let word = self.parse_word()?;
        if !is_type_identifier(&word) {
            return Err(IdeaError::new(ErrorCode::InvalidLiteral, format!("Invalid type {}", word))
                .with_span(start, self.index));
        }
        Ok(LiteralToken::new(start, self.index, Value::String(word.clone()), format!("\"{}\"", word)))
    }

    fn parse_attribute_identifier(&mut self, start: usize) -> Result<IdentifierToken, IdeaError> {
        let mut value = String::new();
        while matches!(self.current(), Some(ch) if ch.is_ascii_alphanumeric() || matches!(ch, '_' | '.')) {
            value.push(self.advance_char().unwrap_or_default());
        }

        if value.is_empty() {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, "Expected attribute identifier")
                .with_span(start, self.index));
        }

        Ok(IdentifierToken::new(start, self.index, value))
    }

    fn parse_any_identifier(&mut self) -> Result<IdentifierToken, IdeaError> {
        let start = self.index;
        let word = self.parse_word()?;
        if !is_any_identifier(&word) {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, format!("Invalid identifier {}", word))
                .with_span(start, self.index));
        }
        Ok(IdentifierToken::new(start, self.index, word))
    }

    fn parse_capital_identifier(&mut self) -> Result<IdentifierToken, IdeaError> {
        let start = self.index;
        let word = self.parse_word()?;
        if !is_capital_identifier(&word) {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, format!("Invalid identifier {}", word))
                .with_span(start, self.index));
        }
        Ok(IdentifierToken::new(start, self.index, word))
    }

    fn parse_upper_identifier(&mut self) -> Result<IdentifierToken, IdeaError> {
        let start = self.index;
        let word = self.parse_word()?;
        if !is_upper_identifier(&word) {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, format!("Invalid identifier {}", word))
                .with_span(start, self.index));
        }
        Ok(IdentifierToken::new(start, self.index, word))
    }

    fn parse_camel_identifier(&mut self) -> Result<IdentifierToken, IdeaError> {
        let start = self.index;
        let word = self.parse_word()?;
        if !is_camel_identifier(&word) {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, format!("Invalid identifier {}", word))
                .with_span(start, self.index));
        }
        Ok(IdentifierToken::new(start, self.index, word))
    }

    fn parse_word(&mut self) -> Result<String, IdeaError> {
        let start = self.index;
        let mut word = String::new();
        while matches!(self.current(), Some(ch)
            if ch.is_ascii_alphanumeric() || matches!(ch, '_' | '.' | '?' | '[' | ']' | '/' | '-'))
        {
            word.push(self.advance_char().unwrap_or_default());
        }
        if word.is_empty() {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, "Expected word")
                .with_span(start, start + 1));
        }
        Ok(word)
    }

    fn peek_word(&self) -> Option<String> {
        let mut index = self.index;
        let mut word = String::new();
        while index < self.source.len() {
            let ch = self.source[index..].chars().next()?;
            if !(ch.is_ascii_alphanumeric() || matches!(ch, '_' | '.' | '?' | '[' | ']' | '/' | '-')) {
                break;
            }
            word.push(ch);
            index += ch.len_utf8();
        }
        if word.is_empty() { None } else { Some(word) }
    }

    fn expect_keyword(&mut self, value: &str) -> Result<(), IdeaError> {
        let start = self.index;
        let word = self.parse_word()?;
        if word != value {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, format!("Expected {}", value))
                .with_span(start, self.index));
        }
        Ok(())
    }

    fn expect_whitespace(&mut self) -> Result<(), IdeaError> {
        if !matches!(self.current(), Some(ch) if ch.is_whitespace()) {
            return Err(IdeaError::new(ErrorCode::UnexpectedToken, "Expected whitespace")
                .with_span(self.index, self.index + 1));
        }
        while matches!(self.current(), Some(ch) if ch.is_whitespace()) {
            self.advance_char();
        }
        Ok(())
    }

    fn expect_char(&mut self, expected: char) -> Result<(), IdeaError> {
        match self.current() {
            Some(ch) if ch == expected => {
                self.advance_char();
                Ok(())
            }
            _ => Err(IdeaError::new(ErrorCode::UnexpectedToken, format!("Expected {}", expected))
                .with_span(self.index, self.index + 1)),
        }
    }

    fn consume_char(&mut self, expected: char) -> bool {
        if self.current() == Some(expected) {
            self.advance_char();
            true
        } else {
            false
        }
    }

    fn check_char(&mut self, expected: char) -> bool {
        self.current() == Some(expected)
    }

    fn declaration(
        &self,
        kind: &'static str,
        mutable: Option<bool>,
        start: usize,
        end: usize,
        id: IdentifierToken,
        init: ObjectToken,
    ) -> DeclarationToken {
        DeclarationToken {
            node_type: "VariableDeclaration",
            kind,
            mutable,
            start,
            end,
            declarations: vec![DeclaratorToken {
                node_type: "VariableDeclarator",
                start: id.start,
                end,
                id,
                init,
            }],
        }
    }
}

fn value_end(value: &DataToken) -> usize {
    match value {
        DataToken::Identifier(value) => value.end,
        DataToken::Literal(value) => value.end,
        DataToken::Object(value) => value.end,
        DataToken::Array(value) => value.end,
    }
}

fn is_any_identifier(value: &str) -> bool {
    let mut chars = value.chars();
    matches!(chars.next(), Some(ch) if ch.is_ascii_alphabetic() || ch == '_')
        && chars.all(|ch| ch.is_ascii_alphanumeric() || ch == '_')
}

fn is_capital_identifier(value: &str) -> bool {
    let mut chars = value.chars();
    matches!(chars.next(), Some(ch) if ch.is_ascii_uppercase() || ch == '_')
        && chars.all(|ch| ch.is_ascii_alphanumeric() || ch == '_')
}

fn is_upper_identifier(value: &str) -> bool {
    let mut chars = value.chars();
    matches!(chars.next(), Some(ch) if ch.is_ascii_uppercase() || ch == '_')
        && chars.all(|ch| ch.is_ascii_uppercase() || ch.is_ascii_digit() || ch == '_')
}

fn is_camel_identifier(value: &str) -> bool {
    let mut chars = value.chars();
    matches!(chars.next(), Some(ch) if ch.is_ascii_lowercase() || ch == '_')
        && chars.all(|ch| ch.is_ascii_alphanumeric() || ch == '_')
}

fn is_type_identifier(value: &str) -> bool {
    let base = value.trim_end_matches('?');
    let base = base.trim_end_matches("[]");
    is_capital_identifier(base)
}
