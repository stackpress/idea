//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const errorHandlingExample = 
`// Centralized validation error handling
class ValidationError extends Error {
  constructor(public errors: z.ZodError) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
  
  getFieldErrors(): Record<string, string> {
    const fieldErrors: Record<string, string> = {};
    
    this.errors.errors.forEach((error) => {
      const field = error.path.join('.');
      fieldErrors[field] = error.message;
    });
    
    return fieldErrors;
  }
}

// Usage
function validateWithErrorHandling<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw new ValidationError(result.error);
  }
  
  return result.data;
}`

//----------------------------------------------------------------------

const schemaCompositionExample = `// Compose schemas for reusability
const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().min(1),
});

const PostSchema = BaseEntitySchema.extend({
  title: z.string().min(1),
  content: z.string(),
  authorId: z.string(),
});`

//----------------------------------------------------------------------

const typeGuardsExample = 
`// Generate type guards from schemas
export const isUser = (data: unknown): data is User => {
  return UserSchema.safeParse(data).success;
};

export const isCreateUserInput = (data: unknown): data is CreateUserInput => {
  return CreateUserSchema.safeParse(data).success;
};

// Usage
function processUserData(data: unknown) {
  if (isUser(data)) {
    // TypeScript knows data is User
    console.log(data.email);
  }
}`;

//----------------------------------------------------------------------

const apiIntegrationExample = 
`// Middleware for API validation
function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: result.error.errors.reduce((acc, err) => {
          const field = err.path.join('.');
          acc[field] = err.message;
          return acc;
        }, {} as Record<string, string>)
      });
    }
    
    req.body = result.data;
    next();
  };
}

// Usage
app.post('/users', validateBody(CreateUserSchema), (req, res) => {
  // req.body is now typed and validated
  const user = req.body; // Type: CreateUserInput
});`

//----------------------------------------------------------------------

export default function BestPractices() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Best Practices Section Content */}
      <section id="best-practices">
      <H1>{_('8. Best Practices')}</H1>
      <P>
        <Translate>
          Best practices ensure your generated Zod validation schemas are 
          maintainable, performant, and provide excellent developer experience. 
          These guidelines cover error handling, schema composition, type safety, 
          and API integration patterns.
        </Translate>
      </P>

      <H2>{_('8.1. Error Handling')}</H2>
      <P>
        <Translate>
          Proper error handling ensures that validation failures provide clear, 
          actionable feedback to users and developers. Implement centralized error 
          handling patterns and meaningful error messages to improve the overall 
          user experience.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {errorHandlingExample}
      </Code>

      <H2>{_('8.2. Schema Composition')}</H2>
      <P>
        <Translate>
          Schema composition enables the creation of reusable validation components 
          that can be combined to build complex validation schemas. This approach 
          promotes code reuse and maintains consistency across your validation logic.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {schemaCompositionExample}
      </Code>

      <H2>{_('8.3. Type Guards')}</H2>
      <P>
        <Translate>
          Type guards provide runtime type checking that integrates seamlessly 
          with TypeScript's type system. Generated type guards enable safe type 
          narrowing and improve code reliability by ensuring data conforms to 
          expected types.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {typeGuardsExample}
      </Code>

      <H2>{_('8.4. API Integration')}</H2>
      <P>
        <Translate>
          API integration patterns show how to use generated Zod schemas for 
          request validation in web applications. This includes middleware creation, 
          error response formatting, and type-safe request handling.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {apiIntegrationExample}
      </Code>
      </section>
    </>
  );
}