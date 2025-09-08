import Code from 'frui/format/Code';

export default function RealWorldExampleSection() {
  const schema = `enum UserRole {
  ADMIN "Administrator"
  CUSTOMER "Customer"
  VENDOR "Vendor"
}

type Address {
  street String @required
  city String @required
  country String @default("US")
}

model User {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  name String @required @field.input(Text)
  role UserRole @default("CUSTOMER")
  address Address?
  orders Order[] @relation(Order.userId)
  created Date @default("now()")
}

model Product {
  id String @id @default("nanoid()")
  name String @required @field.input(Text)
  price Number @required @field.input(Currency)
  description String @field.textarea
  category String @field.select
  inStock Boolean @default(true)
}

model Order {
  id String @id @default("nanoid()")
  userId String @relation(User.id)
  user User @relation(User, userId)
  items OrderItem[] @relation(OrderItem.orderId)
  total Number @required
  status OrderStatus @default("PENDING")
  created Date @default("now()")
}

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

  const outputs = [
    'TypeScript interfaces and types',
    'PostgreSQL database schema',
    'React form components with Tailwind CSS',
    'Express.js API routes with validation',
    'OpenAPI documentation',
    'Test data and fixtures',
    'Database migration files',
    'Validation schemas (Zod, Joi, etc.)'
  ];

  return (
    <section className="theme-bg-bg1 mx-auto px-4 sm:px-8 md:px-12 py-10 sm:py-16 md:py-24 rounded-xl">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Real‑World Example</h3>
          <p className="text-base sm:text-lg opacity-90 mb-5">See how a simple e‑commerce schema can generate a full-stack application:</p>
          <div className="bg-dark rounded-xl border border-gray-200/10 shadow-lg p-4 sm:p-6 mb-2">
            <Code language='javascript' className='bg-transparent text-white text-xs sm:text-sm md:text-base font-mono whitespace-pre-wrap'>
              {schema}
            </Code>
          </div>
        </div>
        <div className="w-full md:w-5/12 lg:w-4/12 mt-8 md:mt-0">
          <div className="rounded-xl border border-yellow-300/30 bg-dark/90 text-white shadow-lg p-4 sm:p-6">
            <div className="font-semibold mb-3 text-yellow-200 text-base sm:text-lg">From this single schema, generate:</div>
            <ul className="text-sm sm:text-base opacity-95 space-y-2 pl-5 list-disc">
              {outputs.map((item, idx) => (
                <li key={idx} className="">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}