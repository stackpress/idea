//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const authenticationStrategies = 
`// Bearer token authentication
authentication: {
  type: "bearer",
  headerName: "Authorization"
}

// API key authentication
authentication: {
  type: "apikey",
  headerName: "X-API-Key"
}

// Basic authentication
authentication: {
  type: "basic",
  headerName: "Authorization"
}

// Custom authentication
authentication: {
  type: "custom",
  headerName: "X-Custom-Auth"
}`

//----------------------------------------------------------------------

const errorHandlingStrategies = 
`// Return errors in response (default)
errorHandling: "return"
const response = await client.user.getById('123');
if (!response.success) {
  console.error(response.error);
}

// Throw errors as exceptions
errorHandling: "throw"
try {
  const user = await client.user.getById('123');
} catch (error) {
  console.error(error.message);
}

// Use callback for error handling
errorHandling: "callback"
const response = await client.user.getById('123', {
  onError: (error) => console.error(error)
});`

//----------------------------------------------------------------------

const requestCancellation = 
`// Using AbortController for request cancellation
const controller = new AbortController();

const response = await client.user.getAll({}, {
  signal: controller.signal
});
 
controller.abort();`

//----------------------------------------------------------------------

const customHeaders = 
`// Add custom headers to requests
const response = await client.user.getById('123', {
  headers: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US'
  }
});`

//----------------------------------------------------------------------

export default function AdvancedFeatures() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Advanced Features Section Content */}
      <section id="advanced-features">
      <H1>{_('7. Advanced Features')}</H1>
      <P>
        <Translate>
          Advanced features extend the basic API client functionality with
          sophisticated authentication, error handling, request management,
          and customization options. These features enable production-ready
          API clients that can handle complex scenarios and enterprise
          requirements.
        </Translate>
      </P>

      <H2>{_('7.1. Authentication Strategies')}</H2>
      <Code copy language='typescript' className='bg-black text-white'>
        {authenticationStrategies}
      </Code>

      <H2>{_('7.2. Error Handling Strategies')}</H2>
      <P>
        <Translate>
          Error handling strategies determine how the API client responds to
          and manages different types of errors. The plugin supports multiple
          approaches including returning errors in responses, throwing
          exceptions, and using callback functions for flexible error
          management.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {errorHandlingStrategies}
      </Code>

      <H2>{_('7.3. Request Cancellation')}</H2>
      <P>
        <Translate>
          Request cancellation allows you to abort ongoing API requests when
          they are no longer needed. This is essential for preventing
          unnecessary network traffic and improving application performance,
          especially in scenarios with user navigation or component
          unmounting.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {requestCancellation}
      </Code>

      <H2>{_('7.4. Custom Headers')}</H2>
      <P>
        <Translate>
          Custom headers allow you to add additional metadata to requests,
          such as localization preferences, custom authentication tokens, or
          API versioning information. The generated client supports flexible
          header management for each request.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {customHeaders}
      </Code>
      </section>
    </>
  );
}