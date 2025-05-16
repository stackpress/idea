<div align="center">
  <h1>💡 Idea</h1>
  <a href="https://www.npmjs.com/package/@stackpress/idea"><img src="https://img.shields.io/npm/v/@stackpress/idea.svg?style=flat" /></a>
  <a href="https://github.com/stackpress/idea/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat" /></a>
  <a href="https://github.com/stackpress/idea/commits/main/"><img src="https://img.shields.io/github/last-commit/stackpress/idea" /></a>
  <a href="https://github.com/stackpress/idea/actions"><img src="https://img.shields.io/github/actions/workflow/status/stackpress/idea/test.yml" /></a>
  <a href="https://coveralls.io/github/stackpress/idea?branch=main"><img src="https://coveralls.io/repos/github/stackpress/idea/badge.svg?branch=main" /></a>
  <a href="https://github.com/stackpress/idea/blob/main/docs/contribute.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <br />
  <br />
  <a href="https://github.com/stackpress/idea/blob/main/docs/schema.md">Form an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/stackpress/idea/blob/main/docs/transform.md">Transform an Idea</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://marketplace.visualstudio.com/items?itemName=stackpress.idea-schema">Code Extension</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/stackpress/idea/blob/main/docs/plugins.md">Plugins</a>
  <br />
  <hr />
</div>

> A meta language to express and transform your ideas to reality. 

The purpose of this language is to streamline and automate parts of 
software development that follow a common pattern and therefore can be 
rendered. Some example code that can be generated using `.idea` files 
including the following.

 - Database calls with any ORM
 - API, REST, or GraphQL endpoints
 - React components
 - TypeScript type safety
 - Admin pages
 - more than 70% of the code you produce

> It all starts with an idea...

## Install

```bash
$ npm i -D @stackpress/idea
```

## How It Works

 1. Describe your idea in a flexible schema format `my.idea`.
 2. Install plugins to transform your idea to code `make-database`.
 3. Generate your platform using the Idea commandline `$ idea`.

## Benefits

This tool is particularly useful for startups and companies looking 
to build scalable and flexible software solutions quickly. 

 - **Speed and Efficiency**: Dramatically speeds up development time. 
   What might normally take weeks can be done in minutes, reducing the 
   cost and time to market.
 - **Customization and Flexibility**: Ideas can be highly customized. 
   This means it can be adapted for a wide range of applications, from 
   simple to complex data structures.
 - **Scalability**: As your needs grow, the system is designed to 
   scale seamlessly. You can add more ideas or adjust existing ones 
   with minimal effort.
 - **Documentation**: Generate documentation and tech specs based on 
   your idea file.
 - **Error Reduction**: By automating the code generation, we reduce 
   the chance of human error, ensuring more reliable and stable 
   software.
 - **Modular**: Use ideas from any vendor or source out your own ideas.
 - **Pluggable**: Reduce development time significantly by using 
   existing plugins or publish your own. 
 - **Closer to AI**: Idea files are perfect training data for AI 
   projects.

## Usage

This is an example idea schema.

```js
//my.idea
model Product @label("Product" "Products") @suggested("[name]") @icon("gift") {
  name        String   @label("Name") 
                       @field.text
                       @is.required("Name is required")
                       @list.detail @view.text

  image       String   @label("Image") 
                       @field.image
                       @list.image({ width 20 height 20 }) 
                       @view.image({ width 100 height 100 })

  description String   @label("Description") 
                       @field.textarea
                       @list.none @view.text
  
  currency    String   @label("Currency")
                       @filterable @default("USD")
                       @field.currency
                       @is.ceq(3 "Should be valid currency prefix")
                       @list.text @view.text
  
  srp         Float?   @label("SRP")
                       @min(0.00) @step(0.01)
                       @field.number({ min 0.00 step 0.01 })
                       @list.price @view.price
  
  price       Float?   @label("Offer Price")
                       @min(0.00) @step(0.01)
                       @field.number({ min 0.00 step 0.01 })
                       @list.price @view.price
}
```

> "Ideas are worthless without execution" - Many People

To transform an idea, you need to plugin a transformer like the 
following example.

```js
//my.idea
plugin "idea-ts" {
  ts true
  output "./modules/[name]/types"
}
// ... your idea ...
// model Product ...
```

You can use other ideas, just import them like the following example.

```js
//my.idea
use "./another.idea"
// ... your idea ...
// model Product ...
```

To execute an idea, you just need to run the following command.

```bash
$ npx idea --i my.idea
```

Learn more:

 - [Form an Idea](https://github.com/stackpress/idea/blob/main/docs/schema.md)
 - [Transform an Idea](https://github.com/stackpress/idea/blob/main/docs/transform.md)
 - [Plugins](https://github.com/stackpress/idea/blob/main/docs/plugins.md)