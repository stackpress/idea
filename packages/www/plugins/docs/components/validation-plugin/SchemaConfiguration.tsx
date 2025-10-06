//modules
import { useLanguage, Translate } from 'r22n';
import { Table, Thead, Trow, Tcol } from 'frui/element/Table';
//local
import { H1, H2, P, C } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//----------------------------------------------------------------------

const basicConfiguration = 
`plugin "./plugins/zod-validation.js" {
  output "./generated/validation.ts"
  generateTypes true
  includeEnums true
  strictMode true
  exportStyle "named"
  customValidators {
    Email "z.string().email()"
    Password "z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)"
    PhoneNumber "z.string().regex(/^\\+?[1-9]\\d{1,14}$/)"
  }
  errorMessages {
    email "Please enter a valid email address"
    password "Password must be at least 8 characters with uppercase, lowercase, and number"
    required "This field is required"
  }
}`

//----------------------------------------------------------------------

const configurationOptions = [
  { 
    option: 'output', 
    type: 'string', 
    description: 'Output file path for validation schemas', 
    default: 'Required' 
  },
  { 
    option: 'generateTypes', 
    type: 'boolean', 
    description: 'Generate TypeScript types from schemas', 
    default: 'true' 
  },
  { 
    option: 'includeEnums', 
    type: 'boolean', 
    description: 'Generate enum validation schemas', 
    default: 'true' 
  },
  { 
    option: 'customValidators', 
    type: 'object', 
    description: 'Custom Zod validators for specific types', 
    default: '{}' 
  },
  { 
    option: 'errorMessages', 
    type: 'object', 
    description: 'Custom error messages for validation', 
    default: '{}' 
  },
  { 
    option: 'strictMode', 
    type: 'boolean', 
    description: 'Use strict object validation', 
    default: 'false' 
  },
  { 
    option: 'exportStyle', 
    type: '\'named\'|\'default\'|\'namespace\'', 
    description: 'Export style for schemas', 
    default: '\'named\'' 
  }
];

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
          Schema configuration demonstrates how to integrate the Zod validation 
          generator into your .idea schema files. This section covers plugin 
          configuration options and their effects on the generated validation schemas.
        </Translate>
      </P>

      <P>
        <Translate>
          Add the Zod validation plugin to your .idea schema file:
        </Translate>
      </P>
      <Code copy language='hcl' className='bg-black text-white'>
        {basicConfiguration}
      </Code>

      <H2>{_('Configuration Options')}</H2>
      <P>
        <Translate>
          Configuration options control how Zod validation schemas are generated, 
          including output formatting, validation strictness, and feature enablement. 
          Understanding these options helps you customize the plugin to meet your 
          specific validation requirements.
        </Translate>
      </P>
      <Table>
        <Trow className="theme-bg-bg1 text-left font-bold">
          <Thead>Option</Thead>
          <Thead>Type</Thead>
          <Thead>Description</Thead>
          <Thead>Default</Thead>
        </Trow>
        {configurationOptions.map(config => (
          <Trow key={config.option}>
            <Tcol><C>{config.option}</C></Tcol>
            <Tcol><C>{config.type}</C></Tcol>
            <Tcol>{_(config.description)}</Tcol>
            <Tcol><C>{config.default}</C></Tcol>
          </Trow>
        ))}
      </Table>
      </section>
    </>
  );
}