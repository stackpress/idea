import { useLanguage, Translate } from 'r22n';
import { H1, H2, P, SS, C } from '../../index.js';
import Code from '../../Code.js';

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
  const { _ } = useLanguage();

  return (
    <section id="props-1">
      <H1>{_('Props')}</H1>

      <P>
        <Translate>
          Props are reusable property configurations that define common
          field behaviors, validation rules, and UI components. They
          promote consistency and reduce duplication across your schema.
        </Translate>
      </P>

      <H2>{_('Syntax')}</H2>
      <Code
        copy
        language="javascript"
        className="bg-black text-white px-mb-20"
      >
        {propsExamples[0]}
      </Code>

      <H2>{_('Structure')}</H2>

      <ul className="px-lh-30 px-px-20 list-disc">
        <li>
          <SS>{_('PropName:')}</SS>
          <Translate>
            The identifier used to reference this prop
          </Translate>
        </li>
        <li>
          <SS>{_('property:')}</SS>
          <Translate>Configuration key-value pairs</Translate>
        </li>
        <li>
          <SS>{_('nested:')}</SS>
          <Translate>A nested prop</Translate>
        </li>
      </ul>

      <H2>{_('Example')}</H2>
      <Code
        copy
        language="javascript"
        className="bg-black text-white px-mb-20"
      >
        {propsExamples[1]}
      </Code>

      <SS>{_('Usage in Models')}</SS>
      <P>
        <Translate>Props are referenced using the </Translate>
        <C>{_('@field')}</C> {_('attribute:')}
      </P>
      <Code
        copy
        language="javascript"
        className="bg-black text-white px-mb-20"
      >
        {propsExamples[2]}
      </Code>
    </section>
  )
}
