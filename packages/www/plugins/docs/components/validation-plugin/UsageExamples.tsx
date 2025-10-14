//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const basicSchemaExample = 
`enum UserRole {
  ADMIN "admin"
  USER "user"
  GUEST "guest"
}

model User {
  id String @id @default("nanoid()")
  email String @email @required
  name String @min(2) @max(50) @required
  age Number @min(18) @max(120)
  role UserRole @default("USER")
  active Boolean @default(true)
  createdAt Date @default("now()")
}

plugin "./plugins/zod-validation.js" {
  output "./validation.ts"
  generateTypes true
  strictMode true
}`

//-----------------------------------------------------------------

const generatedValidationUsage = `import { 
  UserSchema, 
  CreateUserSchema, 
  UpdateUserSchema,
  UserRole 
} from './validation';

// Validate complete user object
const validateUser = (data: unknown) => {
  try {
    const user = UserSchema.parse(data);
    console.log('Valid user:', user);
    return { success: true, data: user };
  } catch (error) {
    console.error('Validation failed:', error.errors);
    return { success: false, errors: error.errors };
  }
};

// Validate user creation data
const validateCreateUser = (data: unknown) => {
  const result = CreateUserSchema.safeParse(data);
  
  if (result.success) {
    console.log('Valid create data:', result.data);
    return result.data;
  } else {
    console.error('Validation errors:', result.error.errors);
    throw new Error('Invalid user data');
  }
};

// Validate user update data
const validateUpdateUser = (data: unknown) => {
  return UpdateUserSchema.parse(data);
};

// Example usage
const userData = {
  email: 'john@example.com',
  name: 'John Doe',
  age: 30,
  role: 'user' as UserRole
};

const validUser = validateCreateUser(userData);`

//-----------------------------------------------------------------

const formValidationExample = 
`import { CreateUserSchema } from './validation';

// React form validation
function UserForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData);
    
    const result = CreateUserSchema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      
      setErrors(fieldErrors);
      return;
    }
    
    // Submit valid data
    submitUser(result.data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      {errors.email && <span>{errors.email}</span>}
      
      <input name="name" type="text" />
      {errors.name && <span>{errors.name}</span>}
      
      <input name="age" type="number" />
      {errors.age && <span>{errors.age}</span>}
      
      <button type="submit">Create User</button>
    </form>
  );
}`

//-----------------------------------------------------------------

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
          Usage examples demonstrate practical applications of the Zod 
          validation generator with real-world scenarios. These examples 
          show how to configure the plugin for different use cases and 
          how the generated validation schemas integrate into development 
          workflows.
        </Translate>
      </P>

      <H2>{_('6.1. Basic Schema')}</H2>
      <P>
        <Translate>
          A basic schema example shows the fundamental structure needed 
          to generate Zod validation schemas. This includes model 
          definitions with proper validation attributes and plugin 
          configuration that produces comprehensive validation rules.
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {basicSchemaExample}
      </Code>

      <H2>{_('6.2. Generated Validation Usage')}</H2>
      <P>
        <Translate>
          The generated validation usage demonstrates how to use the Zod 
          schemas produced by the plugin in real applications. This shows 
          practical patterns for data validation, error handling, and 
          type safety in TypeScript applications.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {generatedValidationUsage}
      </Code>

      <H2>{_('6.3. Form Validation Example')}</H2>
      <P>
        <Translate>
          Zod schemas with frontend frameworks for user input validation. 
          This demonstrates real-world usage patterns for form handling 
          and user feedback.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {formValidationExample}
      </Code>
      </section>
    </>
  );
}
