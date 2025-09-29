//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, Code } from '../index.js';

//code examples
//----------------------------------------------------------------------

const basicSchemaExample = 
`enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

model User {
  id String @id @default("nanoid()")
  email String @unique @required
  name String @required
  role UserRole @default("USER")
  active Boolean @default(true)
  createdAt Date @default("now()")
}

plugin "./plugins/graphql-schema.js" {
  output "./schema.graphql"
  includeQueries true
  includeMutations true
}`

//----------------------------------------------------------------------

const generatedOutputExample = `# Custom Scalars
scalar DateTime
scalar JSON

# Enums
enum UserRole {
  ADMIN
  USER
  GUEST
}

# Types
type User {
  id: ID!
  email: String!
  name: String!
  role: UserRole!
  active: Boolean!
  createdAt: DateTime!
}

# Input Types
input UserInput {
  email: String
  name: String
  role: UserRole
  active: Boolean
}

input UserUpdateInput {
  email: String
  name: String
  role: UserRole
  active: Boolean
  createdAt: DateTime
}

# Queries
type Query {
  user(id: ID!): User
  users(limit: Int, offset: Int): [User]
}

# Mutations
type Mutation {
  createUser(input: UserInput!): User
  updateUser(id: ID!, input: UserUpdateInput!): User
  deleteUser(id: ID!): Boolean
}`

//----------------------------------------------------------------------

export default function UsageExamples() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Usage Examples Section Content */}
      <section id="usage-examples">
      <H1>{_('6. Usage Examples')}</H1>
      <P>
        <Translate>
          Usage examples demonstrate practical applications of the GraphQL 
          schema generator with real-world scenarios. These examples show how 
          to configure the plugin for different use cases and how the generated 
          GraphQL schemas integrate into development workflows.
        </Translate>
      </P>

      <H2>{_('Basic Schema')}</H2>
      <P>
        <Translate>
          A basic schema example shows the fundamental structure needed to 
          generate GraphQL type definitions. This includes model definitions 
          with proper attributes, enum declarations, and plugin configuration 
          that produces comprehensive GraphQL schemas.
        </Translate>
      </P>
      <Code lang='idea'>
        {basicSchemaExample}
      </Code>

      <H2>{_('Generated Output')}</H2>
      <P>
        <Translate>
          The generated output demonstrates the GraphQL schema produced by the 
          plugin from the basic schema example. This shows how schema 
          definitions are transformed into proper GraphQL type definitions 
          with full type safety and operation support.
        </Translate>
      </P>
      <Code lang='graphql'>
        {generatedOutputExample}
      </Code>
      </section>
    </>
  );
}