// Lexical analyzer for the .idea schema language
// The lexer is responsible for breaking down raw text into meaningful tokens
// that can be consumed by the parser to build an Abstract Syntax Tree

use std::fmt;

/// Represents the different types of tokens that can appear in .idea schema files
/// Each variant corresponds to a specific language construct or literal value
#[derive(Debug, Clone, PartialEq)]
pub enum TokenType {
    // Keywords - reserved words that have special meaning
    Plugin,     // "plugin" keyword
    Use,        // "use" keyword  
    Prop,       // "prop" keyword
    Enum,       // "enum" keyword
    Type,       // "type" keyword
    Model,      // "model" keyword
    
    // Identifiers and literals
    Identifier(String),  // Variable names, type names, etc.
    String(String),      // String literals in quotes
    Number(f64),         // Numeric literals (integers and floats)
    Boolean(bool),       // true/false literals
    Null,                // null literal
    
    // Symbols and operators
    LeftBrace,    // {
    RightBrace,   // }
    LeftBracket,  // [
    RightBracket, // ]
    LeftParen,    // (
    RightParen,   // )
    At,           // @ (for attributes)
    Dot,          // . (for attribute paths like @field.input)
    Question,     // ? (for optional types)
    Exclamation,  // ! (for non-mergeable declarations)
    
    // Special tokens
    Eof,          // End of file marker
}

/// Represents a single token with its type, value, and position information
/// Position tracking is crucial for providing meaningful error messages
#[derive(Debug, Clone)]
pub struct Token {
    pub token_type: TokenType,
    pub start: usize,       // Starting position in the source code
    pub end: usize,         // Ending position in the source code
}

impl Token {
    /// Create a new token with position information
    pub fn new(token_type: TokenType, _lexeme: String, start: usize, end: usize) -> Self {
        Self {
            token_type,
            start,
            end,
        }
    }
}

/// The main lexer structure that processes source code character by character
/// and produces a stream of tokens for the parser to consume
pub struct Lexer<'a> {
    input: &'a str,           // The source code being tokenized
    current: usize,           // Current position in the input
    start: usize,             // Start position of the current token being built
}

impl<'a> Lexer<'a> {
    /// Create a new lexer for the given input string
    /// 
    /// # Arguments
    /// * `input` - The source code to tokenize
    /// 
    /// # Returns
    /// A new Lexer instance ready to process the input
    pub fn new(input: &'a str) -> Self {
        Self {
            input,
            current: 0,
            start: 0,
        }
    }
    
    /// Check if we've reached the end of the input
    /// This is used throughout the lexer to prevent reading past the end
    fn is_at_end(&self) -> bool {
        self.current >= self.input.len()
    }
    
    /// Get the current character without advancing the position
    /// Returns None if we're at the end of input
    fn peek(&self) -> Option<char> {
        if self.is_at_end() {
            None
        } else {
            self.input.chars().nth(self.current)
        }
    }
    
    /// Get the next character without advancing the position
    /// This is useful for lookahead when we need to check what comes after the current character
    fn peek_next(&self) -> Option<char> {
        if self.current + 1 >= self.input.len() {
            None
        } else {
            self.input.chars().nth(self.current + 1)
        }
    }
    
    /// Consume and return the current character, advancing the position
    /// Returns None if we're at the end of input
    fn advance(&mut self) -> Option<char> {
        if self.is_at_end() {
            None
        } else {
            let ch = self.input.chars().nth(self.current);
            self.current += 1;
            ch
        }
    }
    
    /// Check if the current character matches the expected character
    /// If it matches, consume it and return true; otherwise return false
    fn match_char(&mut self, expected: char) -> bool {
        if self.is_at_end() {
            return false;
        }
        
        if let Some(ch) = self.peek() {
            if ch == expected {
                self.advance();
                return true;
            }
        }
        
        false
    }
    
    /// Create a token from the current lexeme (text between start and current positions)
    fn make_token(&self, token_type: TokenType) -> Token {
        let lexeme = self.input[self.start..self.current].to_string();
        Token::new(token_type, lexeme, self.start, self.current)
    }
    
    /// Create an error token with a custom message
    /// This is used when the lexer encounters invalid input
    fn error_token(&self, message: &str) -> Token {
        Token::new(
            TokenType::Identifier(message.to_string()),
            message.to_string(),
            self.start,
            self.current,
        )
    }
    
    /// Skip whitespace characters (spaces, tabs, newlines)
    /// Whitespace is generally not significant in .idea files except for separating tokens
    fn skip_whitespace(&mut self) {
        loop {
            match self.peek() {
                Some(' ') | Some('\r') | Some('\t') | Some('\n') => {
                    self.advance();
                }
                _ => break,
            }
        }
    }
    
    /// Parse a string literal enclosed in double quotes
    /// Handles escape sequences and reports errors for unterminated strings
    fn string(&mut self) -> Token {
        // Keep consuming characters until we find the closing quote
        while let Some(ch) = self.peek() {
            if ch == '"' {
                break;
            }
            
            // Handle escape sequences
            if ch == '\\' {
                self.advance(); // Skip the backslash
                self.advance(); // Skip the escaped character
            } else {
                self.advance();
            }
        }
        
        // Check if we found the closing quote
        if self.is_at_end() {
            return self.error_token("Unterminated string");
        }
        
        // Consume the closing quote
        self.advance();
        
        // Extract the string content (without the quotes)
        let value = self.input[self.start + 1..self.current - 1].to_string();
        Token::new(TokenType::String(value.clone()), value, self.start, self.current)
    }
    
    /// Parse a numeric literal (integer or floating-point)
    /// Supports both integers (42) and floats (3.14)
    fn number(&mut self) -> Token {
        // Consume all digits
        while let Some(ch) = self.peek() {
            if ch.is_ascii_digit() {
                self.advance();
            } else {
                break;
            }
        }
        
        // Check for decimal point
        if let Some('.') = self.peek() {
            if let Some(next_ch) = self.peek_next() {
                if next_ch.is_ascii_digit() {
                    // Consume the decimal point
                    self.advance();
                    
                    // Consume fractional digits
                    while let Some(ch) = self.peek() {
                        if ch.is_ascii_digit() {
                            self.advance();
                        } else {
                            break;
                        }
                    }
                }
            }
        }
        
        // Parse the number value
        let lexeme = &self.input[self.start..self.current];
        match lexeme.parse::<f64>() {
            Ok(value) => Token::new(TokenType::Number(value), lexeme.to_string(), self.start, self.current),
            Err(_) => self.error_token("Invalid number"),
        }
    }
    
    /// Parse an identifier or keyword
    /// Identifiers start with a letter or underscore and can contain letters, digits, and underscores
    /// Some identifiers are recognized as keywords (plugin, use, prop, enum, type, model)
    fn identifier(&mut self) -> Token {
        // Consume all valid identifier characters
        while let Some(ch) = self.peek() {
            if ch.is_alphanumeric() || ch == '_' {
                self.advance();
            } else {
                break;
            }
        }
        
        let text = &self.input[self.start..self.current];
        
        // Check if this identifier is actually a keyword
        let token_type = match text {
            "plugin" => TokenType::Plugin,
            "use" => TokenType::Use,
            "prop" => TokenType::Prop,
            "enum" => TokenType::Enum,
            "type" => TokenType::Type,
            "model" => TokenType::Model,
            "true" => TokenType::Boolean(true),
            "false" => TokenType::Boolean(false),
            "null" => TokenType::Null,
            _ => TokenType::Identifier(text.to_string()),
        };
        
        Token::new(token_type, text.to_string(), self.start, self.current)
    }
    
    /// Skip a single-line comment that starts with //
    /// Comments extend to the end of the line
    fn skip_line_comment(&mut self) {
        while let Some(ch) = self.peek() {
            if ch == '\n' {
                break;
            }
            self.advance();
        }
    }
    
    /// Skip a block comment that starts with /* and ends with */
    /// Block comments can span multiple lines and can be nested
    fn skip_block_comment(&mut self) -> Result<(), String> {
        let mut depth = 1; // Track nesting depth
        
        while depth > 0 && !self.is_at_end() {
            match self.peek() {
                Some('/') if self.peek_next() == Some('*') => {
                    // Found start of nested comment
                    self.advance(); // consume '/'
                    self.advance(); // consume '*'
                    depth += 1;
                }
                Some('*') if self.peek_next() == Some('/') => {
                    // Found end of comment
                    self.advance(); // consume '*'
                    self.advance(); // consume '/'
                    depth -= 1;
                }
                _ => {
                    self.advance();
                }
            }
        }
        
        if depth > 0 {
            Err("Unterminated block comment".to_string())
        } else {
            Ok(())
        }
    }
    
    /// Get the next token from the input stream
    /// This is the main entry point for tokenization
    /// 
    /// # Returns
    /// The next token in the input, or an EOF token if we've reached the end
    pub fn next_token(&mut self) -> Token {
        // Skip any leading whitespace
        self.skip_whitespace();
        
        // Mark the start of the new token
        self.start = self.current;
        
        // Check if we've reached the end of input
        if self.is_at_end() {
            return self.make_token(TokenType::Eof);
        }
        
        // Get the current character and decide what kind of token to create
        if let Some(ch) = self.advance() {
            match ch {
                // Single-character tokens
                '{' => self.make_token(TokenType::LeftBrace),
                '}' => self.make_token(TokenType::RightBrace),
                '[' => self.make_token(TokenType::LeftBracket),
                ']' => self.make_token(TokenType::RightBracket),
                '(' => self.make_token(TokenType::LeftParen),
                ')' => self.make_token(TokenType::RightParen),
                '@' => self.make_token(TokenType::At),
                '.' => self.make_token(TokenType::Dot),
                '?' => self.make_token(TokenType::Question),
                '!' => self.make_token(TokenType::Exclamation),
                
                // String literals
                '"' => self.string(),
                
                // Comments
                '/' => {
                    if self.match_char('/') {
                        // Single-line comment
                        self.skip_line_comment();
                        self.next_token() // Recursively get the next token after the comment
                    } else if self.match_char('*') {
                        // Block comment
                        match self.skip_block_comment() {
                            Ok(()) => self.next_token(), // Recursively get the next token after the comment
                            Err(msg) => self.error_token(&msg),
                        }
                    } else {
                        self.error_token("Unexpected character")
                    }
                }
                
                // Numbers
                ch if ch.is_ascii_digit() => self.number(),
                
                // Identifiers and keywords
                ch if ch.is_alphabetic() || ch == '_' => self.identifier(),
                
                // Unexpected character
                _ => self.error_token(&format!("Unexpected character: {}", ch)),
            }
        } else {
            self.make_token(TokenType::Eof)
        }
    }
    
}

/// Implement Display for TokenType to make debugging easier
impl fmt::Display for TokenType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            TokenType::Plugin => write!(f, "PLUGIN"),
            TokenType::Use => write!(f, "USE"),
            TokenType::Prop => write!(f, "PROP"),
            TokenType::Enum => write!(f, "ENUM"),
            TokenType::Type => write!(f, "TYPE"),
            TokenType::Model => write!(f, "MODEL"),
            TokenType::Identifier(name) => write!(f, "IDENTIFIER({})", name),
            TokenType::String(value) => write!(f, "STRING({})", value),
            TokenType::Number(value) => write!(f, "NUMBER({})", value),
            TokenType::Boolean(value) => write!(f, "BOOLEAN({})", value),
            TokenType::Null => write!(f, "NULL"),
            TokenType::LeftBrace => write!(f, "{{"),
            TokenType::RightBrace => write!(f, "}}"),
            TokenType::LeftBracket => write!(f, "["),
            TokenType::RightBracket => write!(f, "]"),
            TokenType::LeftParen => write!(f, "("),
            TokenType::RightParen => write!(f, ")"),
            TokenType::At => write!(f, "@"),
            TokenType::Dot => write!(f, "."),
            TokenType::Question => write!(f, "?"),
            TokenType::Exclamation => write!(f, "!"),
            TokenType::Eof => write!(f, "EOF"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_tokens() {
        let mut lexer = Lexer::new("{ } [ ] ( ) @ . ? !");
        
        assert!(matches!(lexer.next_token().token_type, TokenType::LeftBrace));
        assert!(matches!(lexer.next_token().token_type, TokenType::RightBrace));
        assert!(matches!(lexer.next_token().token_type, TokenType::LeftBracket));
        assert!(matches!(lexer.next_token().token_type, TokenType::RightBracket));
        assert!(matches!(lexer.next_token().token_type, TokenType::LeftParen));
        assert!(matches!(lexer.next_token().token_type, TokenType::RightParen));
        assert!(matches!(lexer.next_token().token_type, TokenType::At));
        assert!(matches!(lexer.next_token().token_type, TokenType::Dot));
        assert!(matches!(lexer.next_token().token_type, TokenType::Question));
        assert!(matches!(lexer.next_token().token_type, TokenType::Exclamation));
        assert!(matches!(lexer.next_token().token_type, TokenType::Eof));
    }

    #[test]
    fn test_keywords() {
        let mut lexer = Lexer::new("plugin use prop enum type model");
        
        assert!(matches!(lexer.next_token().token_type, TokenType::Plugin));
        assert!(matches!(lexer.next_token().token_type, TokenType::Use));
        assert!(matches!(lexer.next_token().token_type, TokenType::Prop));
        assert!(matches!(lexer.next_token().token_type, TokenType::Enum));
        assert!(matches!(lexer.next_token().token_type, TokenType::Type));
        assert!(matches!(lexer.next_token().token_type, TokenType::Model));
    }

    #[test]
    fn test_string_literal() {
        let mut lexer = Lexer::new(r#""hello world""#);
        let token = lexer.next_token();
        
        if let TokenType::String(value) = token.token_type {
            assert_eq!(value, "hello world");
        } else {
            panic!("Expected string token");
        }
    }

    #[test]
    fn test_number_literal() {
        let mut lexer = Lexer::new("42 3.14");
        
        let token1 = lexer.next_token();
        if let TokenType::Number(value) = token1.token_type {
            assert_eq!(value, 42.0);
        } else {
            panic!("Expected number token");
        }
        
        let token2 = lexer.next_token();
        if let TokenType::Number(value) = token2.token_type {
            assert_eq!(value, 3.14);
        } else {
            panic!("Expected number token");
        }
    }
}
