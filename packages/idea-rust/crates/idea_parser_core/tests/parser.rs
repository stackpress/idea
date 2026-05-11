use idea_parser_core::{finalize, parse_ast, tokenize};

fn fixture(name: &str) -> String {
    let path = format!(
        "{}/../../tests/fixtures/{}",
        env!("CARGO_MANIFEST_DIR"),
        name
    );
    std::fs::read_to_string(path).expect("fixture should exist")
}

#[test]
fn tokenize_returns_tokens() {
    let source = fixture("enum.idea");
    let tokens = tokenize(&source).expect("tokenize should succeed");
    assert!(!tokens.is_empty());
}

#[test]
fn parse_schema_fixture() {
    let source = fixture("schema.idea");
    let ast = parse_ast(&source).expect("parse should succeed");
    assert_eq!(ast.kind, "schema");
    assert!(!ast.body.is_empty());
}

#[test]
fn finalize_schema_fixture() {
    unsafe {
        std::env::set_var("DATABASE_URL", "test");
    }
    let source = fixture("schema.idea");
    let final_schema = finalize(&source).expect("finalize should succeed");
    assert!(final_schema.plugin.contains_key("./custom-plugin"));
    assert!(final_schema.r#enum.contains_key("Roles"));
    assert!(final_schema.r#type.contains_key("Address"));
    assert!(final_schema.model.contains_key("User"));
}
