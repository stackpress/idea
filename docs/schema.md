# Forming an Idea

The following describes how to write an idea using the schema format. 
The idea schema format is a loose meta language with simple and 
flexible syntax that any [transformer](./transform.md) can use as a 
basis to render code.

The syntax does not require the use of separators like commas (`,`) and
colons (`:`) because the parser can logically make a determination 
of separations. To simplify further, only double quotes (`"`) are used 
to represent strings. Consider the following example.

```js
// with .js
{ foo: "bar", bar: "foo" }
[ "foo", "bar" ]
// with .idea
{ foo "bar" bar "foo" }
[ "foo" "bar" ]
```

## Learn More

 1. [Attribute](#1-attribute)
 2. [Column](#2-column)
 3. [Enum](#3-enum)
 4. [Prop](#4-prop)
 5. [Type](#5-type)
 6. [Model](#6-model)
 7. [Transformer](#7-transformer)

<a name="attribute"></a>

## 1. Attribute

Attributes can be attached to [columns](#2-column), [types](#5-type) 
and [models](#6-model). Attributes always start with the at symbol 
(`@`) followed by letters, numbers and periods. Attributes can also 
be expressed as a function with multiple arguments. Consider the 
following example.

```js
// filterable = true
@filterable
// filterable = [ "Name" ]
@label("Name")
// is.cgt = [ 3, "Name should be more than 3 characters" ]
@is.cgt(3 "Name should be more than 3 characters")
// view.image = [ { width: 100, height: 100 } ]
@view.image({ width 100 height 100 })
```

> You can add any kind of arbitrary attribute you want in an idea 
file, but it is up to the transformer to recognize and process it.

## 2. Column

Columns are found in the body of [types](#5-type) and [models](#6-model). 
The column syntax starts with a name, then a type, and any combination 
of attributes. Consider the following example where `currency` is an 
arbitrary name, and `String` is a type.

```js
currency String @filterable @default("USD")
```

Column types can be expressed as optional or multiple 
like the following example.

```js
//currency is optional
currency String? 
//currencies is many string values
currencies String[]
```

While types are technically arbitrary as well, most transformers would 
know how to process natural and referenced column types.

### 2.1. Natural Types

Transformers *(like database and typesafe transformers)* rely on column 
types that are both generic and predictable enough to expect to generate 
code.

 - **String** - A short string usually under 255 characters
 - **Text** - A long string usually over 255 characters
 - **Number** - An integer or a float
 - **Integer** - Strictly an integer value
 - **Float** - Strictly a float or decimal value
 - **Boolean** - Specifically `true` or `false`
 - **Date** - A Date object or valid date string
 - **Datetime** - A Date object or valid datetime string
 - **Time** - A Date object or valid time string
 - **Json** - An object
 - **Object** - An object
 - **Hash** - An object

### 2.2. Referenced Types

Types can also reference [enums](#3-enum), other [types](#5-type) 
and [models](#6-model). Consider the following example.

```js
//a column named `role` that can be one of the valid roles in `enum Role`
role Roles @default("USER")
//a column named `products` containing a list of products in a `Product` model
products Product[]
//a column named `author` expressing the relation to a `User` model
author User @relation({ local "userId" foreign "id" })
```

## 3. Enum

An enum is a pretermined list of values. Enums can be used as a 
property type. Consider the following example.

```js
enum Roles {
  ADMIN "admin"
  MANAGER "manager"
  USER "user"
}

model User {
  roles Roles
}
```

### 4. Prop

A prop is a generic property that can be defined and referenced in 
other props and [attributes](#1-attribute). Consider the following  
prop definitions.

```js
//example of an Input field
prop Input { type "text" placeholder null hidden false }
//example of Shirt settings
prop Shirts { sizes ["xl" "sm" "md"] price 100.50 }
//example of a Price format
prop Price { min 0 max 100 step 0.01 }
//example of a list of countries
props Countries {
  options [
    { label "United States" value "US" }
    { label "Mexico" value "MX" }
    { label "Canada" value "CA" }
  ]
}
//example of a User model using Input prop in an attribute
model User {
  name String @field.input(Input)
}
```

### 5. Type

A composite type is used to define specifics of a JSON column in 
a [model](#6-model). Consider the following example.

```js
//example address type
//many attributes can be expressed in a drop down format for readability
type Address {
  street       String   @label("Street Address")
                        @field.text
                        @is.required("Street is required")
                        @list.text @view.text

  city         String   @label("City")
                        @filterable
                        @field.text
                        @is.required("City is required")
                        @list.text @view.text
  
  country      String?  @label("Country")
                        @filterable @default("USA")
                        @field.country
                        @list.text @view.text
  
  postal       String   @label("Postal Code")
                        @filterable
                        @field.text
                        @is.required("Postal Code is required")
                        @list.text @view.text
}
//example of a user model with many addresses
model User @label("User" "Users") {
  addresses Address[] @label("Addresses")
}
```

### 5. Model

A model is a representation of a database table or collection. 
It uses props and types. Consider the following example.

```js
//example of a User model using Role enum and Address type
//many attributes can be expressed in a drop down format for readability
model User @label("User" "Users") @icon("user") {
  id          String   @label("ID") 
                       @id @generated @default("cuid()")
                       @list.char({ hellip false length 8 })
  
  name        String   @label("Name") 
                       @searchable
                       @field.text
                       @is.required("Name is required")
                       @list.detail @view.text

  image       String?  @label("Image") 
                       @field.url
                       @list.image({ width 20 height 20 }) 
                       @view.image({ width 100 height 100 })
  
  role        Role     @label("Roles") 
                       @filterable @default("USER")
                       @field.select(Role)
                       @list.lower @view.lower
  
  tags        String[] @label("Tags") 
                       @field.tags
                       @list.hide
                       @view.tags
  
  references  Hash?    @label("References") 
                       @field.metadata
                       @list.hide
                       @view.metadata
  
  active      Boolean  @label("Active") 
                       @generated @active @default(true) 
                       @list.hide @view.yesno
  
  created     Datetime @label("Created") 
                       @generated @created @spanable @sortable @default("now()") 
                       @list.date("m d, Y h:iA") 
                       @view.date("m d, Y h:iA")
  
  updated     Datetime @label("Updated") 
                       @generated @updated @spanable @sortable @default("now()")
                       @list.date("m d, Y h:iA") 
                       @view.date("m d, Y h:iA")
    
  files       File[]       @label("Files")
  addresses   Address[]    @label("Addresses") @default("[]")
}
```