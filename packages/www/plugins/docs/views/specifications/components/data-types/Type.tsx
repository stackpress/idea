import { H1, H2, P, SS} from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const typeExamples = [
  `type TypeName {
  columnName DataType @attribute1 @attribute2
  anotherColumn DataType @attribute
}`,
`type Address {
  street String @required @field.input(Text)
  city String @required @field.input(Text)
  state String @field.select
  postalCode String @field.input(Text)
  country String @default("US") @field.select
  coordinates {
    latitude Number @field.input(Number)
    longitude Number @field.input(Number)
  }
}

type ContactInfo {
  email String @required @field.input(Email)
  phone String @field.input(Phone)
  website String @field.input(URL)
  socialMedia {
    twitter String @field.input(Text)
    linkedin String @field.input(Text)
    github String @field.input(Text)
  }
}

type Money {
  amount Number @required @field.input(Currency)
  currency String @default("USD") @field.select
  exchangeRate Number @field.input(Number)
}`,
`model Company {
  name String @required
  address Address @required
  contact ContactInfo
  revenue Money
}`
]

export default function Type() {
  return (
    <section id="type">
      <H1>Type</H1>
      <P>Types define custom data structures with multiple columns, similar to objects or structs in programming languages. They're perfect for representing complex data that doesn't warrant a full model.</P>
      <H2>Syntax</H2>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {typeExamples[0]}
      </Code>

      <H2>Structure</H2>
      <ul className="px-lh-30 px-px-20">
        <li className="list-disc"><SS>TypeName:</SS> The identifier used to reference this type</li>
        <li className="list-disc"><SS>columnName:</SS> The field name within the type</li>
        <li className="list-disc"><SS>DataType:</SS> The data type (String, Number, Boolean, Date, etc.)</li>
        <li className="list-disc"><SS>attribute1:</SS> Optional attributes for validation, UI, or behavior</li>
      </ul>

      <H2>Example</H2>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {typeExamples[1]}
      </Code>

      <SS>Usage in Models</SS>
      <P>Types are used as column data types:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {typeExamples[2]}
      </Code>
    </section>
  )
}
