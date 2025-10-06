//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const customValidatorsExample = 
`// In plugin configuration
customValidators: {
  Email: "z.string().email().transform(val => val.toLowerCase())",
  Password: "z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)",
  Slug: "z.string().regex(/^[a-z0-9-]+$/)",
  Color: "z.string().regex(/^#[0-9A-F]{6}$/i)",
  JSON: "z.string().transform(val => JSON.parse(val))"
}`

//----------------------------------------------------------------------

const conditionalValidationExample = 
`// Generated schema with conditional validation
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  adminCode: z.string().optional(),
}).refine((data) => {
  // Admin users must have admin code
  if (data.role === 'admin' && !data.adminCode) {
    return false;
  }
  return true;
}, {
  message: "Admin users must provide an admin code",
  path: ["adminCode"],
});`

//----------------------------------------------------------------------

const transformPreprocessExample = 
`// Add transforms to generated schemas
function addTransforms(schema: string, column: any): string {
  if (column.attributes?.transform) {
    switch (column.attributes.transform) {
      case 'lowercase':
        return schema + '.transform(val => val.toLowerCase())';
      case 'uppercase':
        return schema + '.transform(val => val.toUpperCase())';
      case 'trim':
        return schema + '.transform(val => val.trim())';
      case 'slug':
        return schema + '.transform(val => val.toLowerCase().replace(/\\s+/g, "-"))';
    }
  }
  
  return schema;
}`

//----------------------------------------------------------------------

const asyncValidationExample = 
`// Generate async validation schemas
export const UserSchemaAsync = UserSchema.extend({
  email: z.string().email().refine(async (email) => {
    // Check if email is unique
    const exists = await checkEmailExists(email);
    return !exists;
  }, {
    message: "Email already exists",
  }),
});

// Usage
const validateUserAsync = async (data: unknown) => {
  try {
    const user = await UserSchemaAsync.parseAsync(data);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};`

//----------------------------------------------------------------------

export default function AdvancedFeatures() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Advanced Features Section Content */}
      <section id="advanced-features">
      <H1>{_('7. Advanced Features')}</H1>
      <P>
        <Translate>
          Advanced features extend the basic Zod schema generation with sophisticated 
          validation patterns, conditional logic, data transformation, and asynchronous 
          validation. These features enable production-ready validation that handles 
          complex business requirements.
        </Translate>
      </P>

      <H2>{_('7.1. Custom Validators')}</H2>
      <P>
        <Translate>
          Custom validators allow you to define specialized validation logic for 
          specific data types or business rules. This feature enables the creation 
          of reusable validation patterns that can be applied across multiple 
          schema definitions.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {customValidatorsExample}
      </Code>

      <H2>{_('7.2. Conditional Validation')}</H2>
      <P>
        <Translate>
          Conditional validation enables complex validation logic that depends on 
          the values of other fields. This feature is essential for implementing 
          business rules that require cross-field validation and context-dependent 
          constraints.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {conditionalValidationExample}
      </Code>

      <H2>{_('7.3. Transform and Preprocess')}</H2>
      <P>
        <Translate>
          Transform and preprocess capabilities allow you to modify data during 
          validation, enabling data normalization, formatting, and cleanup. This 
          feature ensures data consistency and proper formatting before validation.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {transformPreprocessExample}
      </Code>

      <H2>{_('7.4. Async Validation')}</H2>
      <P>
        <Translate>
          Async validation enables validation rules that require external data 
          sources or API calls, such as checking for unique values or validating 
          against external services. This feature is crucial for comprehensive 
          data validation in real applications.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {asyncValidationExample}
      </Code>
      </section>
    </>
  );
}