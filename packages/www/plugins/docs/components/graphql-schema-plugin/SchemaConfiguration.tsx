//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P, C, SS, Code } from '../../../docs/components/index.js';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';

//code examples
//----------------------------------------------------------------------

const schemaConfigurationExample = 
`plugin "./plugins/graphql-schema.js" {
  output "./generated/schema.graphql"
  includeQueries true
  includeMutations true
  includeSubscriptions false
  generateInputTypes true
  customScalars {
    Email "String"
    URL "String"
    PhoneNumber "String"
  }
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
          Schema configuration demonstrates how to integrate the GraphQL schema 
          generator into your <C>.idea</C> schema files. This section covers 
          plugin configuration options and their effects on the generated 
          GraphQL schema definitions.
        </Translate>
      </P>
      <P>
        <Translate>
          Add the GraphQL plugin to your <C>.idea</C> schema file:
        </Translate>
      </P>
      <Code lang='idea'>
        {schemaConfigurationExample}
      </Code>

      <H2>{_('Configuration Options')}</H2>
      <P>
        <Translate>
          Configuration options control how GraphQL schema definitions are 
          generated, including operation types, input generation, and custom 
          scalar handling. Understanding these options helps you customize the 
          plugin to meet your specific GraphQL requirements.
        </Translate>
      </P>

      <Table className="text-left">
        <Thead className='theme-bg-bg2'>{_('Option')}</Thead>
        <Thead className='theme-bg-bg2'>{_('Type')}</Thead>
        <Thead className='theme-bg-bg2'>{_('Default')}</Thead>
        <Thead className='theme-bg-bg2'>{_('Description')}</Thead>
        <Trow>
          <Tcol><C>output</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol><SS>{_('Required')}</SS></Tcol>
          <Tcol>
            <Translate>
              Output file path for the GraphQL schema
            </Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>includeQueries</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><SS><C>false</C></SS></Tcol>
          <Tcol>
            <Translate>
              Generate Query type with CRUD operations
            </Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>includeMutations</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><SS><C>false</C></SS></Tcol>
          <Tcol>
            <Translate>
              Generate Mutation type with CRUD operations
            </Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>includeSubscriptions</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><SS><C>false</C></SS></Tcol>
          <Tcol>
            <Translate>
              Generate Subscription type for real-time updates
            </Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>generateInputTypes</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><SS><C>true</C></SS></Tcol>
          <Tcol>
            <Translate>
              Generate input types for mutations
            </Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>customScalars</C></Tcol>
          <Tcol><C>object</C></Tcol>
          <Tcol><SS><C>&#123;&#125;</C></SS></Tcol>
          <Tcol>
            <Translate>
              Custom scalar type mappings.
            </Translate>
          </Tcol>
        </Trow>
      </Table>
      </section>
    </>
  );
}