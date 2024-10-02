# Mapping

Idea is a meta language that parses to an AST and a readable tree. 
The overall schema object passed to plugins will look like the 
following format.

```js
{ 
  "plugin": { ... },
  "enum": { ... },
  "type": { ... },
  "model": { ... }
}
```

You can easily access these constructs in a plugin like the following code.

```js
// make-enums.ts
import type { 
  PluginProps, 
  PluginConfig,
  EnumConfig,
  TypeConfig, 
  ModelConfig 
} from '@stackpress/idea';

export default function generate({ config, schema, cli }: PluginProps) {
  if (typeof schema.enum === 'object') {
    const plugins = schema.plugin as Record<string, PluginConfig>;
    // ... your code ...
  }
  if (typeof schema.enum === 'object') {
    const enums = schema.enum as Record<string, EnumConfig>;
    // ... your code ...
  }
  if (typeof schema.type === 'object') {
    const enums = schema.enum as Record<string, TypeConfig>;
    // ... your code ...
  }
  if (typeof schema.model === 'object') {
    const enums = schema.enum as Record<string, ModelConfig>;
    // ... your code ...
  }
};
```

To understand what each construct in the schema object makes available, 
the following will map example constructs to their JSON object. 

## 1. Enums

```js
enum Roles {
  ADMIN "Admin"
  MANAGER "Manager"
  USER "User"
}
```

```json
{
  "Roles": {
    "ADMIN": "Admin",
    "MANAGER": "Manager",
    "USER": "User"
  }
}
```

## 2. Types

```js
type Address @label("Address" "Addresses") {
  street  String    @field.input(Text) 
                    @is.required @list.hide

  city    String?   @field.input(Text) @is.required

  country String    @field.select(Countries) 
                    @is.option(Countries) 
                    @list.text(Uppercase) @view.text(Uppercase)
                    
  postal  String    @field.input(Text) @is.required
}
```

```json
{
  "Address": {
    "name": "Address",
    "attributes": {
      "label": [
        "Address",
        "Addresses"
      ]
    },
    "columns": [
      {
        "type": "String",
        "name": "street",
        "required": true,
        "multiple": false,
        "attributes": {
          "field.input": [
            {
              "type": "text"
            }
          ],
          "is.required": true,
          "list.hide": true
        }
      },
      {
        "type": "String",
        "name": "city",
        "required": false,
        "multiple": false,
        "attributes": {
          "field.input": [
            {
              "type": "text"
            }
          ],
          "is.required": true
        }
      },
      {
        "type": "String",
        "name": "country",
        "required": true,
        "multiple": false,
        "attributes": {
          "field.select": [
            {
              "options": [
                {
                  "label": "United States",
                  "value": "US"
                },
                {
                  "label": "Mexico",
                  "value": "MX"
                },
                {
                  "label": "Canada",
                  "value": "CA"
                }
              ]
            }
          ],
          "is.option": [
            {
              "options": [
                {
                  "label": "United States",
                  "value": "US"
                },
                {
                  "label": "Mexico",
                  "value": "MX"
                },
                {
                  "label": "Canada",
                  "value": "CA"
                }
              ]
            }
          ],
          "list.text": [
            {
              "format": "uppercase"
            }
          ],
          "view.text": [
            {
              "format": "uppercase"
            }
          ]
        }
      },
      {
        "type": "String",
        "name": "postal",
        "required": true,
        "multiple": false,
        "attributes": {
          "field.input": [
            {
              "type": "text"
            }
          ],
          "is.required": true
        }
      }
    ]
  }
}
```

## 2. Models

```js
model User @label("User" "Users") {
  id       String       @label("ID")
                        @id @default("nanoid(20)")
  
  username String       @label("Username")
                        @searchable 
                        @field.input(Text) 
                        @is.required
  
  password String       @label("Password")
                        @field.password 
                        @is.clt(80) @is.cgt(8) @is.required 
                        @list.hide @view.hide
  
  role     Roles        @label("Role")
                        @filterable 
                        @field.select 
                        @list.text(Uppercase) 
                        @view.text(Uppercase)
  
  address  Address?     @label("Address")
                        @list.hide
  
  age      Number       @label("Age")
                        @unsigned @filterable @sortable 
                        @field.number(Age) 
                        @is.gt(0) @is.lt(150)
  
  salary   Number       @label("Salary")
                        @insigned @filterable @sortable 
                        @field.number(Price) 
                        @list.number @view.number
  
  balance  Number[]     @label("Balance")
                        @filterable @sortable 
                        @field.number() 
                        @list.number() @view.number
  
  bio      Text         @label("Bio")
                        @field.markdown
  
  active   Boolean      @label("Active")
                        @default(true) 
                        @filterable 
                        @field.switch 
                        @list.yesno @view.yesno
  
  created  Date         @label("Created")
                        @default("now()") 
                        @filterable @sortable 
                        @list.date(Pretty)
  
  updated  Date         @label("Updated")
                        @default("updated()") 
                        @filterable @sortable 
                        @list.date(Pretty)
  
  company  Company?     @label("My Company") 
}
```

```json
{
  "User": {
    "name": "User",
    "attributes": {
      "label": [
        "User",
        "Users"
      ]
    },
    "columns": [
      {
        "type": "String",
        "name": "id",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "ID"
          ],
          "id": true,
          "default": [
            "nanoid(20)"
          ]
        }
      },
      {
        "type": "String",
        "name": "username",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Username"
          ],
          "searchable": true,
          "field.input": [
            {
              "type": "text"
            }
          ],
          "is.required": true
        }
      },
      {
        "type": "String",
        "name": "password",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Password"
          ],
          "field.password": true,
          "is.clt": [
            80
          ],
          "is.cgt": [
            8
          ],
          "is.required": true,
          "list.hide": true,
          "view.hide": true
        }
      },
      {
        "type": "Roles",
        "name": "role",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Role"
          ],
          "filterable": true,
          "field.select": true,
          "list.text": [
            {
              "format": "uppercase"
            }
          ],
          "view.text": [
            {
              "format": "uppercase"
            }
          ]
        }
      },
      {
        "type": "Address",
        "name": "address",
        "required": false,
        "multiple": false,
        "attributes": {
          "label": [
            "Address"
          ],
          "list.hide": true
        }
      },
      {
        "type": "Number",
        "name": "age",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Age"
          ],
          "unsigned": true,
          "filterable": true,
          "sortable": true,
          "field.number": [
            {
              "min": 0,
              "max": 110
            }
          ],
          "is.gt": [
            0
          ],
          "is.lt": [
            150
          ]
        }
      },
      {
        "type": "Number",
        "name": "salary",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Salary"
          ],
          "insigned": true,
          "filterable": true,
          "sortable": true,
          "field.number": [
            {
              "min": 0
            }
          ],
          "list.number": true,
          "view.number": true
        }
      },
      {
        "type": "Number",
        "name": "balance",
        "required": true,
        "multiple": true,
        "attributes": {
          "label": [
            "Balance"
          ],
          "filterable": true,
          "sortable": true,
          "field.number": true,
          "list.number": true,
          "view.number": true
        }
      },
      {
        "type": "Text",
        "name": "bio",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Bio"
          ],
          "field.markdown": true
        }
      },
      {
        "type": "Boolean",
        "name": "active",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Active"
          ],
          "default": [
            true
          ],
          "filterable": true,
          "field.switch": true,
          "list.yesno": true,
          "view.yesno": true
        }
      },
      {
        "type": "Date",
        "name": "created",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Created"
          ],
          "default": [
            "now()"
          ],
          "filterable": true,
          "sortable": true,
          "list.date": [
            {
              "format": "pretty"
            }
          ]
        }
      },
      {
        "type": "Date",
        "name": "updated",
        "required": true,
        "multiple": false,
        "attributes": {
          "label": [
            "Updated"
          ],
          "default": [
            "updated()"
          ],
          "filterable": true,
          "sortable": true,
          "list.date": [
            {
              "format": "pretty"
            }
          ]
        }
      },
      {
        "type": "Company",
        "name": "company",
        "required": false,
        "multiple": false,
        "attributes": {
          "label": [
            "My Company"
          ]
        }
      }
    ]
  }
}
```