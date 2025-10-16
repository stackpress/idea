//modules
import type {
  ServerConfigProps,
  ServerPageProps
} from 'stackpress/view/client';
import { useLanguage } from 'r22n';
//local
import { H1, H2, Nav } from '../../components/index.js';
import Code from '../../components/Code.js';
import Layout from '../../components/Layout.js';

//code examples
//--------------------------------------------------------------------//

const ecommerceSchema =
  `// E-commerce application schema
plugin "./plugins/generate-types.js" {
  output "./src/types/schema.ts"
}

plugin "./plugins/generate-database.js" {
  output "./database/schema.sql"
  dialect "postgresql"
}

plugin "./plugins/generate-api-docs.js" {
  output "./docs/api.yaml"
  format "openapi"
}

// Reusable props
prop Email {
  type "email"
  validation {
    required true
    format "email"
  }
  ui {
    placeholder "Enter email address"
    icon "envelope"
  }
}

prop Currency {
  type "number"
  format "currency"
  validation {
    min 0
    precision 2
  }
  ui {
    symbol "$"
    locale "en-US"
  }
}

prop Text {
  type "text"
  validation {
    maxLength 255
  }
}

// Enums
enum UserRole {
  ADMIN "Administrator"
  CUSTOMER "Customer"
  VENDOR "Vendor"
}

enum OrderStatus {
  PENDING "Pending"
  CONFIRMED "Confirmed"
  SHIPPED "Shipped"
  DELIVERED "Delivered"
  CANCELLED "Cancelled"
}

enum PaymentStatus {
  PENDING "Pending"
  COMPLETED "Completed"
  FAILED "Failed"
  REFUNDED "Refunded"
}

// Types
type Address {
  street String @required @field.input(Text)
  city String @required @field.input(Text)
  state String @required @field.select
  postalCode String @required @field.input(Text)
  country String @default("US") @field.select
}

type Money {
  amount Number @required @field.input(Currency)
  currency String @default("USD")
}

// Models
model User! {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  username String @unique @required @field.input(Text)
  firstName String @required @field.input(Text)
  lastName String @required @field.input(Text)
  role UserRole @default("CUSTOMER")
  addresses Address[] @relation(UserAddress.userId)
  orders Order[] @relation(Order.userId)
  active Boolean @default(true)
  emailVerified Boolean @default(false)
  created Date @default("now()")
  updated Date @default("updated()")
}

model Category {
  id String @id @default("nanoid()")
  name String @unique @required @field.input(Text)
  slug String @unique @generated
  description String @field.textarea
  parentId String? @relation(Category.id)
  parent Category? @relation(Category, parentId)
  children Category[] @relation(Category.parentId)
  products Product[] @relation(Product.categoryId)
  active Boolean @default(true)
  created Date @default("now()")
}

model Product! {
  id String @id @default("nanoid()")
  name String @required @field.input(Text)
  slug String @unique @generated
  description String @field.richtext
  shortDescription String @field.textarea
  sku String @unique @required @field.input(Text)
  price Money @required
  comparePrice Money?
  cost Money?
  categoryId String @relation(Category.id)
  category Category @relation(Category, categoryId)
  images String[] @field.upload
  inventory {
    quantity Number @default(0)
    trackQuantity Boolean @default(true)
    allowBackorder Boolean @default(false)
  }
  seo {
    title String @field.input(Text)
    description String @field.textarea
    keywords String[] @field.tags
  }
  active Boolean @default(true)
  featured Boolean @default(false)
  created Date @default("now()")
  updated Date @default("updated()")
}

model Order {
  id String @id @default("nanoid()")
  orderNumber String @unique @generated
  userId String @relation(User.id)
  user User @relation(User, userId)
  items OrderItem[] @relation(OrderItem.orderId)
  status OrderStatus @default("PENDING")
  paymentStatus PaymentStatus @default("PENDING")
  shippingAddress Address @required
  billingAddress Address @required
  subtotal Money @required
  tax Money @required
  shipping Money @required
  total Money @required
  notes String? @field.textarea
  created Date @default("now()")
  updated Date @default("updated()")
}

model OrderItem {
  id String @id @default("nanoid()")
  orderId String @relation(Order.id)
  order Order @relation(Order, orderId)
  productId String @relation(Product.id)
  product Product @relation(Product, productId)
  quantity Number @required @min(1)
  price Money @required
  total Money @required
}`

//--------------------------------------------------------------------//

const blogSchema =
  `// Blog application schema
plugin "./plugins/generate-types.js" {
  output "./src/types/blog.ts"
}

plugin "./plugins/generate-forms.js" {
  output "./src/components/forms/"
  framework "react"
}

// Props
prop RichText {
  type "richtext"
  validation {
    required true
    minLength 100
  }
  ui {
    toolbar ["bold", "italic", "link", "image"]
    placeholder "Write your content here..."
  }
}

prop Slug {
  type "text"
  validation {
    pattern "^[a-z0-9-]+$"
    maxLength 100
  }
  ui {
    placeholder "url-friendly-slug"
  }
}

// Enums
enum PostStatus {
  DRAFT "Draft"
  PUBLISHED "Published"
  ARCHIVED "Archived"
}

enum CommentStatus {
  PENDING "Pending Moderation"
  APPROVED "Approved"
  REJECTED "Rejected"
}

// Models
model Author! {
  id String @id @default("nanoid()")
  email String @unique @required @field.input(Email)
  name String @required @field.input(Text)
  bio String @field.textarea
  avatar String @field.upload
  social {
    twitter String? @field.input(Text)
    github String? @field.input(Text)
    website String? @field.input(URL)
  }
  posts Post[] @relation(Post.authorId)
  active Boolean @default(true)
  created Date @default("now()")
}

model Category {
  id String @id @default("nanoid()")
  name String @unique @required @field.input(Text)
  slug String @unique @field.input(Slug)
  description String @field.textarea
  color String @field.color
  posts Post[] @relation(PostCategory.categoryId)
  created Date @default("now()")
}

model Tag {
  id String @id @default("nanoid()")
  name String @unique @required @field.input(Text)
  slug String @unique @field.input(Slug)
  posts Post[] @relation(PostTag.tagId)
  created Date @default("now()")
}

model Post! {
  id String @id @default("nanoid()")
  title String @required @field.input(Text)
  slug String @unique @field.input(Slug)
  excerpt String @field.textarea
  content String @required @field.input(RichText)
  featuredImage String @field.upload
  authorId String @relation(Author.id)
  author Author @relation(Author, authorId)
  categories Category[] @relation(PostCategory.postId)
  tags Tag[] @relation(PostTag.postId)
  status PostStatus @default("DRAFT")
  publishedAt Date? @field.datetime
  seo {
    title String @field.input(Text)
    description String @field.textarea
    keywords String[] @field.tags
  }
  stats {
    views Number @default(0)
    likes Number @default(0)
    shares Number @default(0)
  }
  comments Comment[] @relation(Comment.postId)
  created Date @default("now()")
  updated Date @default("updated()")
}

model Comment {
  id String @id @default("nanoid()")
  postId String @relation(Post.id)
  post Post @relation(Post, postId)
  authorName String @required @field.input(Text)
  authorEmail String @required @field.input(Email)
  content String @required @field.textarea
  status CommentStatus @default("PENDING")
  parentId String? @relation(Comment.id)
  parent Comment? @relation(Comment, parentId)
  replies Comment[] @relation(Comment.parentId)
  created Date @default("now()")
}`

//--------------------------------------------------------------------//

export function Head(props: ServerPageProps<ServerConfigProps>) {
  //props
  const { request, styles = [] } = props;
  //hooks
  const { _ } = useLanguage();
  //variables
  const title = _('Complete Examples');
  const description = _(
    'Complete examples of how to use the .idea file format to ' +
    'generate various outputs like TypeScript interfaces, database ' +
    'schemas, API documentation, and more.'
  );
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/icon.png" />
      <meta property="og:url" content={request.url.pathname} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link
          key={index}
          rel="stylesheet"
          type="text/css"
          href={href}
        />
      ))}
    </>
  )
}

export function Body() {
  //hooks
  const { _ } = useLanguage();

  return (
    <main className="overflow-auto px-h-100-0 px-p-10">
      <H1>{_('Complete Examples')}</H1>

      {/* E-commerce Example Content */}
      <section>
        <H2>{_('E-commerce Application Schema')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {ecommerceSchema}
        </Code>
      </section>

      {/* Blog Example Content */}
      <section>
        <H2>{_('Blog Application Schema')}</H2>
        <Code
          copy
          language="javascript"
          className="bg-black px-mb-20 text-white"
        >
          {blogSchema}
        </Code>
      </section>

      {/* Page Navigation */}
      <Nav
        prev={{
          text: _('Plugin System'),
          href: "/docs/specifications/plugin-system"
        }}
        next={{
          text: _('Best Practices'),
          href: "/docs/specifications/best-practices"
        }}
      />
    </main>
  );
}

export default function Page(props: ServerPageProps<ServerConfigProps>) {
  const { data, session, request, response } = props;
  return (
    <Layout
      data={data}
      session={session}
      request={request}
      response={response}
    >
      <Body />
    </Layout>
  );
}
