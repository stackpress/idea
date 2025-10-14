//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const circularDependenciesExample =
  `// Handle circular references with lazy evaluation
const UserSchema: z.ZodSchema<User> = z.lazy(() => z.object({
  id: z.string(),
  posts: z.array(PostSchema),
}));

const PostSchema: z.ZodSchema<Post> = z.lazy(() => z.object({
  id: z.string(),
  author: UserSchema,
}));`;

//-----------------------------------------------------------------

const complexValidationExample =
  `// Use refinements for complex validation
const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /\\d/.test(password), {
    message: "Password must contain at least one number",
  });`;

//-----------------------------------------------------------------

const performanceOptimizationExample =
  `// Use preprocess for expensive operations
const OptimizedSchema = z.preprocess(
  (data) => {
    // Expensive preprocessing
    return normalizeData(data);
  },
  z.object({
    // Schema definition
  })
);`;

//-----------------------------------------------------------------

const schemaTestingExample =
  `// Test schemas with various inputs
describe('UserSchema', () => {
  it('should validate valid user data', () => {
    const validData = {
      email: 'test@example.com',
      name: 'Test User',
      age: 25
    };
    
    expect(() => UserSchema.parse(validData)).not.toThrow();
  });
  
  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      name: 'Test User',
      age: 25
    };
    
    expect(() => UserSchema.parse(invalidData)).toThrow();
  });
});`;

//-----------------------------------------------------------------

const errorCustomizationExample =
  `// Customize error messages for better UX
const UserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  age: z.number().min(18, "You must be at least 18 years old"),
});`;

//-----------------------------------------------------------------

export default function Troubleshooting() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Troubleshooting Section Content */}
      <section id="troubleshooting">
        <H1>{_('9. Troubleshooting')}</H1>
        <P>
          <Translate>
            This section addresses common issues that you may find when
            generating Zod validation schemas. It also provides solutions
            for debugging and resolving problems. By learning these
            troubleshooting techniques, you can help ensure that your
            validation schema generation is reliable.
          </Translate>
        </P>

        <H2>{_('9.1. Common Issues')}</H2>
        <P>
          <Translate>
            Common issues include circular dependencies, complex
            validation rules, and performance problems with large
            schemas. These problems typically arise from schema
            complexity or validation requirements that need specialized
            handling.
          </Translate>
        </P>

        <H2>{_('9.1.1. Circular Dependencies')}</H2>
        <P>
          <Translate>
            Circular dependencies occur when schemas reference each
            other in a way that creates infinite loops. Zod provides
            lazy evaluation to handle these scenarios while maintaining
            type safety and validation integrity.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {circularDependenciesExample}
        </Code>

        <H2>{_('9.1.2. Complex Validation Rules')}</H2>
        <P>
          <Translate>
            Complex validation rules require sophisticated logic that
            goes beyond simple type checking. Use Zod's refinement
            capabilities to implement business rules and cross-field
            validation while maintaining clear error messages.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {complexValidationExample}
        </Code>

        <H2>{_('9.1.3. Performance Issues')}</H2>
        <P>
          <Translate>
            Performance issues can arise when validation schemas are
            complex or when handling large datasets. Improve validation
            performance by using preprocessing, caching, and designing
            efficient schemas with optimal patterns.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {performanceOptimizationExample}
        </Code>

        <H2>{_('9.2. Debugging Tips')}</H2>
        <P>
          <Translate>
            Debugging tips help identify and resolve issues during Zod
            schema generation and usage. These techniques provide
            visibility into validation behavior and help diagnose
            problems with schema logic or performance.
          </Translate>
        </P>

        <H2>{_('9.2.1. Schema Testing')}</H2>
        <P>
          <Translate>
            Schema testing ensures your validation works in all situations
            by verifying logic against many scenarios. Comprehensive tests
            catch edge cases and guarantee validation acts as expected
            in production.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {schemaTestingExample}
        </Code>

        <H2>{_('9.2.2. Error Message Customization')}</H2>
        <P>
          <Translate>
            Error message customization makes the user experience better by
            giving clear, actionable feedback when validation fails. Good
            error messages help users understand what went wrong and what
            steps to take to fix it.
          </Translate>
        </P>
        <Code copy language="typescript" className="bg-black text-white">
          {errorCustomizationExample}
        </Code>

        <P>
          <Translate>
            This tutorial provides a comprehensive foundation for creating
            Zod validation schemas from .idea files. The generated schemas
            provide runtime type checking and validation with excellent
            TypeScript integration.
          </Translate>
        </P>
      </section>
    </>
  );
}