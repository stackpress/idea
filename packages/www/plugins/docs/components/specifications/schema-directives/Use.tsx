//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, SS, C } from '../../../../docs/components/index.js';
import Code from '../../../../docs/components/Code.js';

//code examples
//-----------------------------------------------------------------

const useExamples = [
  `use "package/to/schema.idea"
use "./relative/path/schema.idea"
use "../parent/directory/schema.idea"`,

  //---------------------------------------------------------------

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

  //---------------------------------------------------------------

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

  //---------------------------------------------------------------

  `// The Status enum now contains all values
enum Status {
  ACTIVE "Active"           // From common.idea
  INACTIVE "Inactive"       // From common.idea
  PENDING "Pending Approval"    // From user-schema.idea
  SUSPENDED "Temporarily Suspended" // From user-schema.idea
}`,

  //---------------------------------------------------------------

  `enum UserRole {
  USER "Regular User"
  ADMIN "Administrator"
}`,

  //---------------------------------------------------------------

  `use "./base-schema.idea"

// This will NOT merge with the imported UserRole
// Instead, it will override it completely
enum UserRole! {
  GUEST "Guest User"
  MEMBER "Member"
  MODERATOR "Moderator"
  ADMIN "Administrator"
}`,

  //---------------------------------------------------------------

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
];

//-----------------------------------------------------------------

export default function Use() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Use Section Content */}
      <section id="use">
        <H1>{_('Use')}</H1>
        <P>
          <Translate>
            The <C>use</C> directive imports definitions from other{' '}
            <C>.idea</C> files, enabling modular schema organization and{' '}
            reusability. When importing, data types with the same name are{' '}
            automatically merged unless the <C>!</C> (non-mergeable){' '}
            indicator is used.
          </Translate>
        </P>

        {/* Syntax Section Content */}
        <section>
          <H2>{_('Syntax')}</H2>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {useExamples[0]}
          </Code>
        </section>

        {/* Structure Section Content */}
        <section>
          <H2>{_('Structure')}</H2>
          <ul className="px-lh-30 px-px-20">
            <li className="list-disc">
              <SS>{_('Path:')}</SS> {_('Relative or absolute path to the')}{' '}
              <C>.idea</C> {_('file to import')}
            </li>
            <li className="list-disc">
              <SS>{_('Automatic Merging:')}</SS>{' '}
              {_('Data types with matching names are merged by default')}
            </li>
            <li className="list-disc">
              <SS>{_('Merge Prevention:')}</SS> {_('Use')} <C>!</C>{' '}
              {_('suffix to prevent merging')}
            </li>
          </ul>
        </section>

        {/* Example Section Content */}
        <section>
          <H2>{_('Example')}</H2>
          <P><C>shared/common.idea</C></P>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {useExamples[1]}
          </Code>

          <P><C>user/user-schema.idea:</C></P>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {useExamples[2]}
          </Code>

          <H2>{_('Result after merging:')}</H2>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {useExamples[3]}
          </Code>
        </section>

        {/* Prevent Merging with ! Section Content */}
        <section>
          <SS>{_('Prevent merging with')} <C>!</C></SS>
          <P>
            <Translate>
              When you want to prevent automatic merging and keep definitions{' '}
              separate, use the ! suffix:
            </Translate>
          </P>

          <SS>{_('base-schema.idea:')}</SS>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {useExamples[4]}
          </Code>

          <SS>{_('extended-schema.idea:')}</SS>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {useExamples[5]}
          </Code>
        </section>

        {/* Use Cases Content */}
        <section>
          <H2>{_('Use Cases')}</H2>
          <ul className="px-lh-30 px-px-20">
            <li className="list-disc">
              <SS>{_('Shared Types:')}</SS>{' '}
              {_('Define common types once and reuse across multiple schemas')}
            </li>
            <li className="list-disc">
              <SS>{_('Modular Organization:')}</SS>{' '}
              {_('Split large schemas into manageable, focused files')}
            </li>
            <li className="list-disc">
              <SS>{_('Team Collaboration:')}</SS>{' '}
              {_('Different teams can work on separate schema files')}
            </li>
            <li className="list-disc">
              <SS>{_('Environment-Specific:')}</SS>{' '}
              {_('Override certain definitions for different environments')}
            </li>
          </ul>
        </section>

        {/* Best Practices Section Content */}
        <section>
          <H2>{_('Best Practices')}</H2>
          <Code
            copy
            language="javascript"
            className="bg-black px-mb-20 px-mx-10 text-white"
          >
            {useExamples[6]}
          </Code>
        </section>
      </section>
    </>
  );
}
