import { H1, H2, P, C, SS } from '../../../../components/index.js';

export default function Introduction() {
  return (
    <section id="1-introduction">
      <H1>1. Introduction</H1>
      <P>
        <C>ts-morph</C> is a powerful TypeScript library that wraps the TypeScript Compiler API, making it much easier to work with TypeScript Abstract Syntax Trees (AST). This introduction covers the fundamental concepts and advantages of using <C>ts-morph</C> for plugin development.
      </P>
      <P>Unlike string-based code generation, <C>ts-morph</C> provides:</P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2"><SS>Type-safe code manipulation:</SS> Work with actual TypeScript nodes instead of strings</li>
        <li className="my-2"><SS>Automatic formatting:</SS> Generated code is properly formatted and follows TypeScript conventions</li>
        <li className="my-2"><SS>IntelliSense support:</SS> Full IDE support when writing your plugins</li>
        <li className="my-2"><SS>AST navigation:</SS> Easy traversal and modification of code structures</li>
        <li className="my-2"><SS>Validation:</SS> Automatic syntax validation of generated code</li>
      </ul>

      <H2>Why Use ts-morph for Plugins?</H2>
      <P>
        Understanding the advantages of <C>ts-morph</C> over traditional code generation approaches helps you make informed decisions about plugin architecture. This comparison highlights the key benefits that make <C>ts-morph</C> an excellent choice for TypeScript code generation.
      </P>
      <P>Traditional code generation often involves:</P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Concatenating strings to build code</li>
        <li className="my-2">Manual indentation and formatting</li>
        <li className="my-2">Error-prone syntax construction</li>
        <li className="my-2">Difficulty maintaining complex code structures</li>
      </ul>

      <P>With <C>ts-morph</C>, you can:</P>
      <ul className="list-disc pl-6 my-4">
        <li className="my-2">Create TypeScript constructs programmatically</li>
        <li className="my-2">Leverage the compiler's knowledge for validation</li>
        <li className="my-2">Generate properly formatted, syntactically correct code</li>
        <li className="my-2">Easily modify existing code structures</li>
      </ul>
    </section>
  )
}
