import { useLanguage, Translate } from 'r22n';
import { H1, H2, P, SS } from '../../index.js';
import Code from '../../Code.js';

const enumsExamples = [
  `enum EnumName {
  KEY1 "Display Value 1"
  KEY2 "Display Value 2"
  KEY3 "Display Value 3"
}`,
  `enum UserRole {
  ADMIN "Administrator"
  MODERATOR "Moderator"
  USER "Regular User"
  GUEST "Guest User"
}

enum OrderStatus {
  PENDING "Pending Payment"
  PAID "Payment Confirmed"
  SHIPPED "Order Shipped"
  DELIVERED "Order Delivered"
  CANCELLED "Order Cancelled"
}

enum Priority {
  LOW "Low Priority"
  MEDIUM "Medium Priority"
  HIGH "High Priority"
  URGENT "Urgent"
}`,
  `export enum UserRole {
  ADMIN = "Administrator",
  MODERATOR = "Moderator",
  USER = "Regular User",
  GUEST = "Guest User"
}`,
  `{
  "enum": {
    "UserRole": {
      "ADMIN": "Administrator",
      "MODERATOR": "Moderator",
      "USER": "Regular User",
      "GUEST": "Guest User"
    }
  }
}`
]

export default function Enums() {
  const { _ } = useLanguage();

  return (
    <section id="enums">
      <H1>{_('Enums')}</H1>

      <P>
        <Translate>
          Enums define a set of named constants with associated values,
          perfect for representing fixed sets of options like user roles,
          status values, or categories.
        </Translate>
      </P>

      <H2>{_('Syntax')}</H2>

      <Code
        copy
        language="javascript"
        className="bg-black text-white px-mb-20">
        {enumsExamples[0]}
      </Code>

      <H2>{_('Structure')}</H2>
      <ul className="px-lh-30 px-px-20 list-disc">
        <li>
          <SS>{_('EnumName: ')}</SS>
          <Translate>The identifier used to reference this enum</Translate>
        </li>
        <li>
          <SS>{_('KEY: ')}</SS>
          <Translate>The constant name (typically uppercase)</Translate>
        </li>
        <li>
          <SS>{_('"Display Value": ')}</SS>
          <Translate>Human-readable label for the constant</Translate>
        </li>
      </ul>

      <H2>{_('Example')}</H2>

      <Code
        copy
        language="javascript"
        className="bg-black text-white px-mb-20">
        {enumsExamples[1]}
      </Code>

      <H2>{_('Generate Output')}</H2>

      <P>
        <Translate>
          When processed, enums generate language-specific constants:
        </Translate>
      </P>

      <H2>{_('TypeScript:')}</H2>

      <Code
        copy
        language="typescript"
        className="bg-black text-white px-mb-20">
        {enumsExamples[2]}
      </Code>

      <H2>{_('JSON:')}</H2>
      
      <Code
        copy
        language="json"
        className="bg-black text-white  px-mb-20">
        {enumsExamples[3]}
      </Code>
    </section>
  )
}
