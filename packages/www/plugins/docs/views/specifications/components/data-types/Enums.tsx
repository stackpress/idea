import { H1, H2, P, SS } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

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
  return (
    <section id="enums">
      <H1>Enums</H1>
      <P>Enums define a set of named constants with associated values, perfect for representing fixed sets of options like user roles, status values, or categories.</P>
      <H2>Syntax</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {enumsExamples[0]}
      </Code>

      <H2>Structure</H2>
      <ul className="px-lh-30 px-px-20">
        <li className="list-disc"><SS>EnumName:</SS> The identifier used to reference this enum</li>
        <li className="list-disc"><SS>KEY:</SS> The constant name (typically uppercase)</li>
        <li className="list-disc"><SS>"Display Value":</SS> Human-readable label for the constant</li>
      </ul>

      <H2>Example</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {enumsExamples[1]}
      </Code>

      <H2>Generate Output</H2>
      <P>When processed, enums generate language-specific constants:</P>
      <SS>TypeScript:</SS>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {enumsExamples[2]}
      </Code>

      <SS>JSON:</SS>
      <Code copy language="json" className="bg-black text-white px-mx-10 px-mb-20">
        {enumsExamples[3]}
      </Code>
    </section>
  )
}
