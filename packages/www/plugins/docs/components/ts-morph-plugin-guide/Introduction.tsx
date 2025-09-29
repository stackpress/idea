//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C, SS } from '../index.js';

export default function Introduction() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
    {/* Introduction Section Content */}
      <section id="introduction">
        <H1>{_('Creating Plugins with ts-morph: A Comprehensive Guide')}</H1>
        <P>
          <Translate>
            This guide demonstrates how to create powerful code generation
            plugins using ts-morph, a TypeScript library that provides an
            easier way to programmatically navigate and manipulate TypeScript
            and JavaScript code. We'll walk through creating a complete plugin
            that generates TypeScript interfaces from schema definitions.
          </Translate>
        </P>

        <H1>{_('1. Introduction')}</H1>
        <P>
          <Translate>
            <C>ts-morph</C> is a powerful TypeScript library that wraps the
            TypeScript Compiler API, making it much easier to work with
            TypeScript Abstract Syntax Trees (AST). This introduction covers
            the fundamental concepts and advantages of using <C>ts-morph</C>
            for plugin development.
          </Translate>
        </P>
        <P>
          <Translate>
            Unlike string-based code generation, <C>ts-morph</C> provides:
          </Translate>
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <SS>{_('Type-safe code manipulation:')}</SS>
            <Translate>
              Work with actual TypeScript nodes instead of strings
            </Translate>
          </li>
          <li className="my-2">
            <SS>{_('Automatic formatting:')}</SS>
            <Translate>
              Generated code is properly formatted and follows TypeScript
              conventions
            </Translate>
          </li>
          <li className="my-2">
            <SS>{_('IntelliSense support:')}</SS>
            <Translate>
              Full IDE support when writing your plugins
            </Translate>
          </li>
          <li className="my-2">
            <SS>{_('AST navigation:')}</SS>
            <Translate>
              Easy traversal and modification of code structures
            </Translate>
          </li>
          <li className="my-2">
            <SS>{_('Validation:')}</SS>
            <Translate>
              Automatic syntax validation of generated code
            </Translate>
          </li>
        </ul>

        <H2>{_('Why Use ts-morph for Plugins?')}</H2>
        <P>
          <Translate>
            Understanding the advantages of <C>ts-morph</C> over traditional
            code generation approaches helps you make informed decisions about
            plugin architecture. This comparison highlights the key benefits
            that make <C>ts-morph</C> an excellent choice for TypeScript code
            generation.
          </Translate>
        </P>
        <P>
          <Translate>
            Traditional code generation often involves:
          </Translate>
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Concatenating strings to build code
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Manual indentation and formatting
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Error-prone syntax construction
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Difficulty maintaining complex code structures
            </Translate>
          </li>
        </ul>

        <P>
          <Translate>
            With <C>ts-morph</C>, you can:
          </Translate>
        </P>
        <ul className="list-disc pl-6 my-4">
          <li className="my-2">
            <Translate>
              Create TypeScript constructs programmatically
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Leverage the compiler's knowledge for validation
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Generate properly formatted, syntactically correct code
            </Translate>
          </li>
          <li className="my-2">
            <Translate>
              Easily modify existing code structures
            </Translate>
          </li>
        </ul>
      </section>
    </>
  )
}
