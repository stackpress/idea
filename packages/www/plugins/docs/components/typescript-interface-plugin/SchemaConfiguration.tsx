//modules
import { useLanguage, Translate } from 'r22n';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
//local
import { H1, H2, P, C } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const basicConfigurationExample = 
`plugin "./plugins/typescript-interfaces.js" {
  output "./generated/types.ts"
  namespace "MyApp"
  exportType "named"
  generateUtilityTypes true
  includeComments true
  strictNullChecks true
  generateEnums true
  enumType "enum"
}`

//----------------------------------------------------------------------

const configurationTableData = [
  {
    option: 'output',
    type: 'string',
    defaultValue: 'Required',
    description: 'Output file path for TypeScript definitions'
  },
  {
    option: 'namespace',
    type: 'string',
    defaultValue: 'undefined',
    description: 'Wrap types in a namespace'
  },
  {
    option: 'exportType',
    type: "'named'|'default'|'namespace'",
    defaultValue: "'named'",
    description: 'Export style for types'
  },
  {
    option: 'generateUtilityTypes',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Generate helper utility types'
  },
  {
    option: 'includeComments',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Include JSDoc comments'
  },
  {
    option: 'strictNullChecks',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Handle null/undefined types'
  },
  {
    option: 'generateEnums',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Generate enum definitions'
  },
  {
    option: 'enumType',
    type: "'enum'|'union'|'const'",
    defaultValue: "'enum'",
    description: 'Enum generation style'
  }
];

export default function SchemaConfiguration() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Schema Configuration Section Content */}
      <section id="schema-configuration">
      <H1>{_('5. Schema Configuration')}</H1>
      <P>
        <Translate>
          Schema configuration demonstrates how to integrate the TypeScript
          interface generator into your <C>.idea</C> schema files. This
          section covers plugin configuration options and their effects on
          the generated TypeScript output.
        </Translate>
      </P>
      <P>
        <Translate>
          Add the TypeScript plugin to your <C>.idea</C> schema file:
        </Translate>
      </P>
      <Code
        language='idea'
        className='bg-black text-white'
      >
        {basicConfigurationExample}
      </Code>

      <H2>{_('Configuration Options')}</H2>
      <P>
        <Translate>
          Configuration options control how TypeScript interfaces are
          generated, including output formatting, type handling, and feature
          enablement. Understanding these options helps you customize the
          plugin to meet your specific project requirements.
        </Translate>
      </P>

      <Table>
        <Trow className="theme-bg-bg1 text-left font-bold">
          <Thead>Option</Thead>
          <Thead>Type</Thead>
          <Thead>Default</Thead>
          <Thead>Description</Thead>
        </Trow>
        {configurationTableData.map((row, index) => (
          <Trow key={index}>
            <Tcol>
              <C>{row.option}</C>
            </Tcol>
            <Tcol>
              <C>{row.type}</C>
            </Tcol>
            <Tcol>
              <C>{row.defaultValue}</C>
            </Tcol>
            <Tcol>
              <Translate>{row.description}</Translate>
            </Tcol>
          </Trow>
        ))}
      </Table>
      </section>
    </>
  );
}