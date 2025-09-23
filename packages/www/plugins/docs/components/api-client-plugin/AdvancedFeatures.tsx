import { useLanguage, Translate } from 'r22n';
import { H2, H3, P } from '../index.js';
import Code from '../Code.js';

const authenticationStrategies = `// Bearer token authentication
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
}`;

const errorHandlingStrategies = `// Return errors in response (default)
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
});`;

const requestCancellation = `// Using AbortController for request cancellation
const controller = new AbortController();

const response = await client.user.getAll({}, {
  signal: controller.signal
});

// Cancel the request
controller.abort();`;

const customHeaders = `// Add custom headers to requests
const response = await client.user.getById('123', {
  headers: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US'
  }
});`;

export default function AdvancedFeatures() {
  const { _ } = useLanguage();

  return (
    <section id="7-advanced-features">
      <H2>{_('7. Advanced Features')}</H2>
      <P>
        <Translate>
          Advanced features extend the basic API client functionality with
          sophisticated authentication, error handling, request management,
          and customization options. These features enable production-ready
          API clients that can handle complex scenarios and enterprise
          requirements.
        </Translate>
      </P>

      <H3>{_('7.1. Authentication Strategies')}</H3>
      <Code copy language='typescript' className='bg-black text-white'>
        {authenticationStrategies}
      </Code>

      <H3>{_('7.2. Error Handling Strategies')}</H3>
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

      <H3>{_('7.3. Request Cancellation')}</H3>
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

      <H3>{_('7.4. Custom Headers')}</H3>
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
  );
}