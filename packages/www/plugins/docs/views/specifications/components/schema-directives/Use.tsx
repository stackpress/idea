import { H1, H2, P, SS, C } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const useExamples = [
  `use "package/to/schema.idea"
use "./relative/path/schema.idea"
use "../parent/directory/schema.idea"`,
  `// Common types used across multiple schemas
type Address {
  street String @required
  city String @required
  country String @default("US")
}

enum Status {
  ACTIVE "Active"
  INACTIVE "Inactive"
}

prop Email {
  type "email"
  validation {
    required true
    format "email"
  }
}`,
  `// Import common definitions
use "../shared/common.idea"

// Extend the Status enum (will merge with imported one)
enum Status {
  PENDING "Pending Approval"
  SUSPENDED "Temporarily Suspended"
}

// Use imported types and props
model User {
  id String @id @default("nanoid()")
  email String @field.input(Email)
  address Address
  status Status @default("PENDING")
}`,
  `// The Status enum now contains all values
enum Status {
  ACTIVE "Active"           // From common.idea
  INACTIVE "Inactive"       // From common.idea
  PENDING "Pending Approval"    // From user-schema.idea
  SUSPENDED "Temporarily Suspended" // From user-schema.idea
}`,
`enum UserRole {
  USER "Regular User"
  ADMIN "Administrator"
}`,
`use "./base-schema.idea"

// This will NOT merge with the imported UserRole
// Instead, it will override it completely
enum UserRole! {
  GUEST "Guest User"
  MEMBER "Member"
  MODERATOR "Moderator"
  ADMIN "Administrator"
}`,
`// ✅ Good - organize by domain
use "./shared/common-types.idea"
use "./auth/user-types.idea"
use "./commerce/product-types.idea"

// ✅ Good - clear file naming
use "./enums/status-enums.idea"
use "./types/address-types.idea"
use "./props/form-props.idea"

// ❌ Avoid - unclear imports
use "./stuff.idea"
use "./misc.idea"`
]

export default function Use() {
  return (
    <section id="use">
      <H1>Use</H1>
      <P>
        The <C>use</C> directive imports definitions from other <C>.idea</C> files, enabling modular schema organization and reusability. When importing, data types with the same name are automatically merged unless the <C>!</C> (non-mergeable) indicator is used.
      </P>
      <H2>Syntax</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {useExamples[0]}
      </Code>

      <H2>Structure</H2>
      <ul className="px-lh-30 px-px-20">
        <li className="list-disc"><SS>Path:</SS> Relative or absolute path to the <C>.idea</C> file to import</li>
        <li className="list-disc"><SS>Automatic Merging:</SS> Data types with matching names are merged by default</li>
        <li className="list-disc"><SS>Merge Prevention:</SS> Use <C>!</C> suffix to prevent merging</li>
      </ul>

      <H2>Example</H2>
      <P><C>shared/common.idea</C></P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {useExamples[1]}
      </Code>

      <P><C>user/user-schema.idea:</C></P>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {useExamples[2]}
      </Code>

      <H2>Result after merging:</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {useExamples[3]}
      </Code>

      <SS>Prevent merging with <C>!</C></SS>
      <P>
        When you want to prevent automatic merging and keep definitions separate, use the ! suffix:
      </P>

      <SS>base-schema.idea:</SS>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {useExamples[4]}
      </Code>

      <SS>extended-schema.idea:</SS>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {useExamples[5]}
      </Code>

      <H2>Use Cases</H2>
      <ul className="px-lh-30 px-px-20">
        <li className="list-disc"><SS>Shared Types:</SS> Define common types once and reuse across multiple schemas</li>
        <li className="list-disc"><SS>Modular Organization:</SS> Split large schemas into manageable, focused files</li>
        <li className="list-disc"><SS>Team Collaboration:</SS> Different teams can work on separate schema files</li>
        <li className="list-disc"><SS>Environment-Specific:</SS> Override certain definitions for different environments</li>
      </ul>

      <H2>Best Practices</H2>
      <Code copy language="javascript" className="bg-black text-white px-mx-10 px-mb-20">
        {useExamples[6]}
      </Code>
    </section>
  )
}
