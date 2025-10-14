//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, SS, C } from '../../../../docs/components/index.js';
import Code from '../../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const modelsExamples = [
  `model ModelName {
  columnName DataType @attribute1 @attribute2
  relationColumn RelatedModel @relation
}

model ModelName! {  // Mutable model
  // columns...
}`,

  //---------------------------------------------------------------

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

  //---------------------------------------------------------------

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
];

//-----------------------------------------------------------------

export default function Models() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Models Section Content */}
      <section id="models">
        <H1>{_('Models')}</H1>

        <P>
          <Translate>
            Models represent the core entities in your application,
            typically corresponding to database tables or API
            resources. They define the structure, relationships, and
            behavior of your data.
          </Translate>
        </P>

        <section>
          <H2>{_('Syntax')}</H2>
          <Code
            copy
            language="typescript"
            className="bg-black px-mb-20 text-white"
          >
            {modelsExamples[0]}
          </Code>

          <H2>{_('Structure')}</H2>
          <ul className="px-lh-30 px-px-20 list-disc">
            <li>
              <SS>{_('ModelName: ')}</SS>
              <Translate>The identifier for this model</Translate>
            </li>
            <li>
              <SS>!: </SS>
              <Translate>
                Optional non-mergeable indicator prevents automatic
                merging when using <C>use</C> directives
              </Translate>
            </li>
            <li>
              <SS>{_('columnName: ')}</SS>
              <Translate>The field name within the model</Translate>
            </li>
            <li>
              <SS>{_('DataType: ')}</SS>
              <Translate>
                Built-in types (String, Number, Boolean, Date) or custom
                types/enums
              </Translate>
            </li>
            <li>
              <SS>{_('@attribute: ')}</SS>
              <Translate>
                Attributes for validation, relationships, UI, etc.
              </Translate>
            </li>
          </ul>

          <H2>{_('Merging Behavior')}</H2>

          <P>
            <Translate>
              By default, when importing schemas with use directives,
              models with the same name are automatically merged. The !
              suffix prevents this behavior:
            </Translate>
          </P>
          <Code
            copy
            language="typescript"
            className="bg-black px-mb-20 text-white"
          >
            {modelsExamples[1]}
          </Code>

          <H2>{_('Example')}</H2>
          <Code
            copy
            language="typescript"
            className="bg-black px-mb-20 text-white"
          >
            {modelsExamples[2]}
          </Code>
        </section>
      </section>
    </>
  )
}
