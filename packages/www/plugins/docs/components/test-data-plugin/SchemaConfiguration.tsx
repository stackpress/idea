//modules
import { useLanguage, Translate } from 'r22n';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
//local
import { H1, H2, P, C, SS } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const schemaConfigExample = 
`plugin "./plugins/test-data.js" {
  output "./generated/test-data.ts"
  format "typescript"
  count 20
  seed 12345
  locale "en"
  generateFactories true
  generateFixtures true
  relationships true
  customGenerators {
    Email "faker.internet.email()"
    Password "faker.internet.password()"
    Slug "faker.lorem.slug()"
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
          The schema configuration section demonstrates how to integrate
          the test data plugin into your .idea schema files. This includes
          plugin declaration syntax, configuration options, and examples
          of how to customize the plugin behavior for different use cases.
        </Translate>
      </P>
      <P>
        <Translate>
          Add the Test Data plugin to your <C>.idea</C> schema file:
        </Translate>
      </P>
      <Code copy language='idea' className='bg-black text-white'>
        {schemaConfigExample}
      </Code>

      <H2>{_('5.1. Configuration Options')}</H2>
      <P>
        <Translate>
          The following options will be processed by the test data plugin
          in this tutorial.
        </Translate>
      </P>

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
            <Translate>Output file path for test data</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>format</C></Tcol>
          <Tcol><C>'json'|'typescript'|'javascript'</C></Tcol>
          <Tcol><SS>Required</SS></Tcol>
          <Tcol>
            <Translate>Output format</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>count</C></Tcol>
          <Tcol><C>number</C></Tcol>
          <Tcol><C>10</C></Tcol>
          <Tcol>
            <Translate>Number of records to generate per model</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>seed</C></Tcol>
          <Tcol><C>number</C></Tcol>
          <Tcol><C>undefined</C></Tcol>
          <Tcol>
            <Translate>Seed for reproducible data generation</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>locale</C></Tcol>
          <Tcol><C>string</C></Tcol>
          <Tcol><C>'en'</C></Tcol>
          <Tcol>
            <Translate>Locale for faker.js data generation</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>generateFactories</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><C>true</C></Tcol>
          <Tcol>
            <Translate>Generate data factory functions</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>generateFixtures</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><C>true</C></Tcol>
          <Tcol>
            <Translate>Generate test fixtures</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>customGenerators</C></Tcol>
          <Tcol><C>object</C></Tcol>
          <Tcol><C>{`{}`}</C></Tcol>
          <Tcol>
            <Translate>Custom data generators for specific types</Translate>
          </Tcol>
        </Trow>
        <Trow>
          <Tcol><C>relationships</C></Tcol>
          <Tcol><C>boolean</C></Tcol>
          <Tcol><C>false</C></Tcol>
          <Tcol>
            <Translate>Handle model relationships</Translate>
          </Tcol>
        </Trow>
      </Table>
      </section>
    </>
  );
}