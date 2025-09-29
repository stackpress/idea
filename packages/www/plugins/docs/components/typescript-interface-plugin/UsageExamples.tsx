//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const basicSchemaExample = 
`enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

type Address {
  street String @required
  city String @required
  country String @required
  postal String
}

model User {
  id String @id @default("nanoid()")
  email String @unique @required
  name String @required
  role UserRole @default("USER")
  address Address?
  active Boolean @default(true)
  createdAt Date @default("now()")
}

plugin "./plugins/typescript-interfaces.js" {
  output "./types.ts"
  generateUtilityTypes true
  includeComments true
}`

//----------------------------------------------------------------------

const generatedOutputExample = 
`/**
 * Generated TypeScript interfaces
 * Generated at: 2024-01-15T10:30:00.000Z
 * 
 * This file is auto-generated. Do not edit manually.
 */

// Enums
/**
 * UserRole enumeration
 */
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

// Custom Types
/**
 * Address type definition
 */
export interface Address {
  street: string;
  city: string;
  country: string;
  postal?: string | null;
}

// Model Interfaces
/**
 * User model interface
 */
export interface User {
  /** Default: nanoid() */
  id: string;
  email: string;
  name: string;
  /** Default: USER */
  role: UserRole;
  address?: Address | null;
  /** Default: true */
  active: boolean;
  /** Default: now() */
  createdAt: Date;
}

// Utility Types
export type CreateUserInput = Omit<User, 'id' | 'createdAt'>;

export type UpdateUserInput = Partial<User>;

export type AnyModel = User;

export type UserKeys = keyof User;`

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
          Usage examples demonstrate practical applications of the TypeScript
          interface generator with real-world scenarios. These examples show
          how to configure the plugin for different use cases and how the
          generated TypeScript code integrates into development workflows.
        </Translate>
      </P>

      <H2>{_('Basic Schema')}</H2>
      <P>
        <Translate>
          A basic schema example shows the fundamental structure needed to
          generate TypeScript interfaces. This includes model definitions with
          proper attributes, enum declarations, and plugin configuration that
          produces clean, type-safe TypeScript code.
        </Translate>
      </P>
      <Code
        language='typescript'
        className='bg-black text-white'
      >
        {basicSchemaExample}
      </Code>

      <H2>{_('Generated Output')}</H2>
      <P>
        <Translate>
          The generated output demonstrates the TypeScript code produced by
          the plugin from the basic schema example. This shows how schema
          definitions are transformed into proper TypeScript interfaces with
          full type safety and documentation.
        </Translate>
      </P>
      <Code
        language='typescript'
        className='bg-black text-white'
      >
        {generatedOutputExample}
      </Code>
      </section>
    </>
  );
}