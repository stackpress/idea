//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

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

model Post {
  id String @id @default("nanoid()")
  title String @required
  content String @required
  authorId String @required
  published Boolean @default(false)
  createdAt Date @default("now()")
}

plugin "./plugins/api-client.js" {
  output "./api-client.ts"
  clientType "rest"
  httpLibrary "fetch"
  baseUrl "/api/v1"
  generateTypes true
}`

//----------------------------------------------------------------------

const generatedClientUsageExample = 
`import APIClient from './api-client';

// Initialize client
const client = new APIClient('https://api.example.com');

// Set authentication token
client.setAuthToken('your-jwt-token');

// Use the client
async function example() {
  // Get all users with pagination
  const usersResponse = await client.user.getAll({
    page: 1,
    limit: 10,
    search: 'john'
  });
  
  if (usersResponse.success) {
    console.log('Users:', usersResponse.data);
    console.log('Total:', usersResponse.total);
  }
  
  // Get user by ID
  const userResponse = await client.user.getById('user-123');
  
  if (userResponse.success) {
    console.log('User:', userResponse.data);
  }
  
  // Create new user
  const newUserResponse = await client.user.create({
    email: 'john@example.com',
    name: 'John Doe',
    role: UserRole.USER
  });
  
  if (newUserResponse.success) {
    console.log('Created user:', newUserResponse.data);
  }
  
  // Update user
  const updateResponse = await client.user.update('user-123', {
    name: 'John Smith'
  });
  
  // Delete user
  const deleteResponse = await client.user.delete('user-123');
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
          This section demonstrates practical usage of the API client
          generator plugin with real-world examples. The examples show how to
          configure the plugin in schema files and how to use the generated
          client code in applications.
        </Translate>
      </P>

      <H2>{_('6.1. Basic Schema')}</H2>
      <P>
        <Translate>
          A basic schema example shows the fundamental structure needed to
          generate API clients. This includes model definitions with proper
          attributes, enum declarations, and plugin configuration that
          produces a functional REST API client.
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {basicSchemaExample}
      </Code>

      <H2>{_('6.2. Generated Client Usage')}</H2>
      <P>
        <Translate>
          The generated client provides a type-safe interface for interacting
          with your API endpoints. This example demonstrates how to initialize
          the client, set authentication, and perform common CRUD operations
          with proper error handling and TypeScript support.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {generatedClientUsageExample}
      </Code>
      </section>
    </>
  );
}