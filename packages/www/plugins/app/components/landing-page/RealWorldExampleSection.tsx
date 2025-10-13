//modules
import { Translate, useLanguage } from 'r22n';
//local
import Code from '../../../docs/components/Code.js';

//code example
//----------------------------------------------------------------------

const exampleSchema = `
// schema.idea
enum UserRole {
  ADMIN     "Administrator"
  CUSTOMER  "Customer"
  VENDOR    "Vendor"
}

type Address {
  street  String @required
  city    String @required
  country String @default("US")
}

model User {
  id    String     @id @default("nanoid()")
  email String     @unique @required @field.input(Email)
  name  String     @required @field.input(Text)
  role  UserRole   @default("CUSTOMER")
  address Address?
  orders Order[]   @relation(Order.userId)
  created Date     @default("now()")
}

model Product {
  id          String  @id @default("nanoid()")
  name        String  @required @field.input(Text)
  price       Number  @required @field.input(Currency)
  description String  @field.textarea
  category    String  @field.select
  inStock     Boolean @default(true)
}

model Order {
  id String          @id @default("nanoid()")
  userId String      @relation(User.id)
  user User          @relation(User, userId)
  items OrderItem[]  @relation(OrderItem.orderId)
  total Number       @required
  status OrderStatus @default("PENDING")
  created Date       @default("now()")
}

// Plugin configurations
plugin "./plugins/typescript-generator.js" {
  output "./src/types/schema.ts"
}

plugin "./plugins/database-generator.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

plugin "./plugins/react-forms.js" {
  output "./src/components/forms/"
  framework "react"
  styling "tailwind"
}

plugin "./plugins/api-generator.js" {
  output "./src/api/"
  framework "express"
  includeValidation true
}`;

//----------------------------------------------------------------------

export default function RealWorldExampleSection() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Real-World Example Section Content */}
      <section className="max-w-7xl mx-auto px-4 py-20 rounded-lg">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold mb-4">
              {_('Real-World Example')}
            </h2>

            <p className="text-lg mb-6">
              <Translate>
                See how a simple e‑commerce schema can generate a
                full-stack application:
              </Translate>
            </p>

            <Code
              copy
              language="javascript"
              className="bg-dark-800 rounded-lg text-white p-3"
            >
              {exampleSchema}
            </Code>
          </div>

          <div className="w-full lg:w-5/12">
            <div
              className="bg-yellow-50 rounded-lg border border-yellow-200 p-6"
            >
              <h3 className="font-bold mb-4 text-yellow-900 text-lg">
                {_('From this single schema, generate:')}
              </h3>

              <ul className="text-base space-y-3 text-gray-900">
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3 "></i>
                  <Translate>
                    TypeScript interfaces and types
                  </Translate>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3"></i>
                  <Translate>
                    PostgreSQL database schema
                  </Translate>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3"></i>
                  <Translate>
                    React form components with Tailwind CSS
                  </Translate>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3"></i>
                  <Translate>
                    Express.js API routes with validation
                  </Translate>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3"></i>
                  <Translate>
                    OpenAPI documentation
                  </Translate>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3"></i>
                  <Translate>
                    Test data and fixtures
                  </Translate>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3"></i>
                  <Translate>
                    Database migration files
                  </Translate>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-check text-green-500 mr-3"></i>
                  <Translate>
                    Validation schemas (Zod, Joi, etc.)
                  </Translate>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
