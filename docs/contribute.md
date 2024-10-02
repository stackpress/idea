# Contributing

Thanks for being an awesome developer! We are always looking for 
contributors and sponsors. If your interested, 
[contact us](https://github.com/stackpress) so we can discuss. 
Clone this repo and run the following commands in the project folder.

```js
$ yarn
$ yarn build
$ yarn test
```

The projects in this monorepo are the following.

1. `@stackpress/idea-parser` - Parses a schema file to AST
2. `@stackpress/idea-language` - A language server used by vscode/vim to read 
   from `.idea` files and check for syntax errors and to enable 
   intellisense for the file type.
3. `@stackpress/idea-transformer` - A programmatical command line interface used 
   by projects and that calls on external plugins to make relevant 
   code (like SQL schema, GraphQL, react components, etc.)
4. `@stackpress/idea` - A stand alone command line tool used that calls on 
   external plugins to make relevant code (like SQL schema, GraphQL, 
   react components, etc.) 

Please follow the steps below to properly contribute to this repository.

> Do not commit code that is not related to a GitHub issue!

> Please tag all your commits with `[type]/[issue#]`.

> Please include the time it took per commit. ie. `1s` or `1h`.

 1. Per issue on Github, you should create a branch. example: `[type]/[issue#]`
    - Per feature you should create a feature branch. ie. `feature/1001`.
    - Per bug you should create a fix branch. ie. `fix/1002`.
    - Per task you should create a task branch. ie. `task/1003`
 2. Commits need to reference the issue that is being worked on. example: `updated copy #1004` or `fixes #1005`
    - It's also good to to add the amount of time to your commit message. example: `fixed button #1006 30m` or `built awsome feature #1007 16h`
 3. When you are finished with your branch, you should create a pull request back to the `main` branch.
    - Assign another developer to review your code. 
    - All contributors are expected to both write and review code. 
    - Ask [Dev lead](https://github.com/cblanquera) for assignments.