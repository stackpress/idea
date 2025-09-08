import { H1, H2, P, SS, C } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const propsExamples = [
  `prop PropName {
  property "value"
  nested {
    property "value"
  }
}`,
`prop Email {
  type "email"
  format "email"
  validation {
    required true
    pattern "^[^\s@]+@[^\s@]+\.[^\s@]+$"
  }
  ui {
    component "EmailInput"
    placeholder "Enter your email address"
    icon "envelope"
  }
}

prop Password {
  type "password"
  validation {
    required true
    minLength 8
    pattern "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]"
  }
  ui {
    component "PasswordInput"
    placeholder "Enter a secure password"
    showStrength true
  }
}

prop Currency {
  type "number"
  format "currency"
  validation {
    min 0
    precision 2
  }
  ui {
    component "CurrencyInput"
    symbol "$"
    locale "en-US"
  }
}`,
`model User {
  email String @field.input(Email)
  password String @field.input(Password)
}`
]

export default function Props() {
  return (
    <section id="props-1">
      <H1>Props</H1>
      <P>Props are reusable property configurations that define common field behaviors, validation rules, and UI components. They promote consistency and reduce duplication across your schema.</P>
      <H2>Syntax</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {propsExamples[0]}
      </Code>

      <H2>Structure</H2>
      <ul className="px-lh-30 px-px-20">
        <li className="list-disc"><SS>PropName:</SS> The identifier used to reference this prop</li>
        <li className="list-disc"><SS>property:</SS> Configuration key-value pairs</li>
        <li className="list-disc"><SS>nested:</SS> A nested prop</li>
      </ul>

      <H2>Example</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {propsExamples[1]}
      </Code>

      <SS>Usage in Models</SS>
      <P>Props are referenced using the <C>@field</C> attribute:</P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {propsExamples[2]}
      </Code>
    </section>
  )
}
