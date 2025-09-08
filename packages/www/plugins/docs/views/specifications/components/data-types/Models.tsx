import { H1, H2, P, SS, C } from '../../../../components/index.js';
import Code from '../../../../components/Code.js';

const modelsExamples = [
  `model ModelName {
  columnName DataType @attribute1 @attribute2
  relationColumn RelatedModel @relation
}

model ModelName! {  // Mutable model
  // columns...
}`,
`// base-schema.idea
model User {
  id String @id
  name String @required
}

// extended-schema.idea
use "./base-schema.idea"

// This will merge with the imported User model
model User {
  email String @required
  created Date @default("now()")
}

// This will NOT merge - it completely replaces the imported User
model User! {
  id String @id
  username String @required
  password String @required
}`,
`model User! {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  username String @unique @required @field.input(Text)
  password String @required @field.input(Password)
  profile UserProfile?
  role UserRole @default("USER")
  active Boolean @default(true)
  lastLogin Date?
  created Date @default("now()")
  updated Date @default("updated()")
}

model UserProfile {
  id String @id @default("nanoid()")
  userId String @relation(User.id)
  firstName String @required @field.input(Text)
  lastName String @required @field.input(Text)
  bio String @field.textarea
  avatar String @field.upload
  address Address
  contact ContactInfo
  preferences {
    theme String @default("light")
    language String @default("en")
    notifications Boolean @default(true)
  }
}

model Post {
  id String @id @default("nanoid()")
  title String @required @field.input(Text)
  slug String @unique @generated
  content String @required @field.richtext
  excerpt String @field.textarea
  authorId String @relation(User.id)
  author User @relation(User, authorId)
  status PostStatus @default("DRAFT")
  tags String[] @field.tags
  publishedAt Date?
  created Date @default("now()")
  updated Date @default("updated()")
}

enum PostStatus {
  DRAFT "Draft"
  PUBLISHED "Published"
  ARCHIVED "Archived"
}`

]

export default function Models() {
  return (
    <section id="models">
      <H1>Models</H1>
      <P>Models represent the core entities in your application, typically corresponding to database tables or API resources. They define the structure, relationships, and behavior of your data.</P>
      <H2>Syntax</H2>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {modelsExamples[0]}
      </Code>

      <H2>Structure</H2>
      <ul className="px-lh-30 px-px-20">
        <li className="list-disc"><SS>ModelName:</SS> The identifier for this model</li>
        <li className="list-disc"><SS>!:</SS> Optional non-mergeable indicator (prevents automatic merging when using <C>use</C> directives)</li>
        <li className="list-disc"><SS>columnName:</SS> The field name within the model</li>
        <li className="list-disc"><SS>DataType:</SS> Built-in types (String, Number, Boolean, Date) or custom types/enums</li>
        <li className="list-disc"><SS>@attribute:</SS> Attributes for validation, relationships, UI, etc.</li>
      </ul>

      <H2>Merging Behavior</H2>
      <P>By default, when importing schemas with use directives, models with the same name are automatically merged. The ! suffix prevents this behavior:</P>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {modelsExamples[1]}
      </Code>

      <H2>Example</H2>
      <Code copy language="typescript" className="bg-black text-white px-mx-10 px-mb-20">
        {modelsExamples[2]}
      </Code>
    </section>
  )
}
