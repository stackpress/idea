//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C, SS } from '../index.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const schemaConfigExample = 
`plugin "./plugins/api-client.js" {
  output "./generated/api-client.ts"
  clientType "rest"
  httpLibrary "fetch"
  baseUrl "/api/v1"
  authentication {
    type "bearer"
    headerName "Authorization"
  }
  generateTypes true
  includeValidation false
  errorHandling "return"
}`

//----------------------------------------------------------------------

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
          Add the API Client plugin to your <C>.idea</C> schema file:
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {schemaConfigExample}
      </Code>

      <H2>{_('Configuration Options')}</H2>

      <Table className="text-left">
        <Trow className="theme-bg-bg1">
          <Thead>Option</Thead>
          <Thead>Type</Thead>
          <Thead>Default</Thead>
          <Thead>Description</Thead>
        </Trow>
        <Trow>
          <Tcol><C>output</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol><SS>Required</SS></Tcol>
          <Tcol>
            <Translate>Output file path for the API client</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>clientType</C></Tcol>
          <Tcol><C>'rest'|'graphql'|'both'</C></Tcol>
          <Tcol><SS>Required</SS></Tcol>
          <Tcol>
            <Translate>Type of client to generate</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>httpLibrary</C></Tcol>
          <Tcol><C>'fetch'|'axios'</C></Tcol>
          <Tcol><C>'fetch'</C></Tcol>
          <Tcol>
            <Translate>HTTP library to use</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>baseUrl</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol><C>'/api'</C></Tcol>
          <Tcol>
            <Translate>Base URL for API requests</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>authentication</C></Tcol>
          <Tcol><C>object</C></Tcol>
          <Tcol><C>undefined</C></Tcol>
          <Tcol>
            <Translate>Authentication configuration</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>generateTypes</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><C>true</C></Tcol>
          <Tcol>
            <Translate>Generate TypeScript types</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>includeValidation</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><C>false</C></Tcol>
          <Tcol>
            <Translate>Include request validation</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>errorHandling</C></Tcol>
          <Tcol><C>'throw'|'return'|'callback'</C></Tcol>
          <Tcol><C>'return'</C></Tcol>
          <Tcol>
            <Translate>Error handling strategy</Translate>
          </Tcol>
        </Trow>
      </Table>
      </section>
    </>
  );
}