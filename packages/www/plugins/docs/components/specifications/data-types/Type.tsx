//moudles
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, SS } from '../../index.js';
import Code from '../../Code.js';

//code examples
//----------------------------------------------------------------------

const typeExamples = [
  `type TypeName {
  columnName DataType @attribute1 @attribute2
  anotherColumn DataType @attribute
}`,

//----------------------------------------------------------------------

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

//----------------------------------------------------------------------

`model Company {
  name String @required
  address Address @required
  contact ContactInfo
  revenue Money
}`
]

export default function Type() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Type Section Content */}
      <section id="type">
        <H1>{_('Type')}</H1>

        <P>
          <Translate>
            Types define custom data structures with multiple columns,
            similar to objects or structs in programming languages. They
            are perfect for representing complex data that doesn't warrant
            a full model.
          </Translate>
        </P>

        <H2>{_('Syntax')}</H2>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20"
        >
          {typeExamples[0]}
        </Code>

        <H2>{_('Structure')}</H2>

        <ul className="px-lh-30 px-px-20 list-disc">
          <li>
            <SS>{_('TypeName: ')}</SS>
            <Translate>
              The identifier used to reference this type
            </Translate>
          </li>
          <li>
            <SS>{_('columnName: ')}</SS>
            <Translate>The field name within the type</Translate>
          </li>
          <li>
            <SS>{_('DataType: ')}</SS>
            <Translate>
              The data type (String, Number, Boolean, Date, etc.)
            </Translate>
          </li>
          <li>
            <SS>{_('attribute: ')}</SS>
            <Translate>
              Optional attributes for validation, UI, or behavior
            </Translate>
          </li>
        </ul>

        <H2>{_('Example')}</H2>

        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20">
          {typeExamples[1]}
        </Code>

        <H2>{_('Usage in Models')}</H2>
        <P>
          <Translate> Types are used as column data types:</Translate>
        </P>
        <Code
          copy
          language="typescript"
          className="bg-black text-white px-mb-20">
          {typeExamples[2]}
        </Code>
      </section>
    </>
  )
}
