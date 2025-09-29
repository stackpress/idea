//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../index.js';
import Code from '../Code.js';

//code examples
//----------------------------------------------------------------------

const corsIssues = 
`// Ensure your API server allows CORS
// Add appropriate headers in your API configuration

// For development, you might need to proxy requests
const client = new APIClient('/api/proxy');`

//----------------------------------------------------------------------

const authenticationIssues = 
`// Check token format and expiration
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Refresh token automatically
client.setAuthToken(await refreshToken());`

//----------------------------------------------------------------------

const networkIssues = 
`// Implement retry logic
async function withRetry<T>(
  operation: () => Promise<APIResponse<T>>,
  maxRetries: number = 3
): Promise<APIResponse<T>> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await operation();
      if (result.success) return result;
      
      if (i === maxRetries - 1) return result;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}`

//----------------------------------------------------------------------

const debuggingTips = 
`// Add to base client
private logRequest(method: string, url: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.group(\`API \${method} \${url}\`);
    if (data) console.log('Data:', data);
    console.groupEnd();
  }
}`

//----------------------------------------------------------------------

const responseValidation = 
`// Validate response structure
function validateResponse<T>(response: any): response is APIResponse<T> {
  return (
    typeof response === 'object' &&
    typeof response.success === 'boolean' &&
    (response.success ? 'data' in response : 'error' in response)
  );
}`

//----------------------------------------------------------------------

export default function Troubleshooting() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Troubleshooting Section Content */}
      <section id="troubleshooting">
      <H1>{_('9. Troubleshooting')}</H1>
      <P>
        <Translate>
          This section covers common issues you might encounter when using the
          generated API client and provides solutions and debugging strategies
          to resolve them quickly.
        </Translate>
      </P>

      <H2>{_('9.1. CORS Issues')}</H2>
      <P>
        <Translate>
          Cross-Origin Resource Sharing (CORS) issues are common when making
          API requests from web applications. Ensure your server is properly
          configured to handle CORS or use appropriate proxy settings during
          development.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {corsIssues}
      </Code>

      <H2>{_('9.2. Authentication Problems')}</H2>
      <P>
        <Translate>
          Authentication issues often stem from expired tokens, incorrect
          formats, or missing headers. Implement proper token validation and
          refresh mechanisms to handle these scenarios gracefully.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {authenticationIssues}
      </Code>

      <H2>{_('9.3. Network Issues')}</H2>
      <P>
        <Translate>
          Network connectivity problems require robust retry logic and proper
          error handling. Implement exponential backoff strategies for
          transient failures and provide meaningful feedback to users.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {networkIssues}
      </Code>

      <H2>{_('9.4. Debugging Tips')}</H2>
      <P>
        <Translate>
          Enable comprehensive logging during development to track request
          flows and identify issues. Use browser developer tools and server
          logs to diagnose problems effectively.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {debuggingTips}
      </Code>

      <H2>{_('9.5. Response Validation')}</H2>
      <P>
        <Translate>
          Validate API responses to ensure they match expected formats. This
          helps catch schema mismatches and API changes that could break your
          application.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {responseValidation}
      </Code>
      </section>
    </>
  );
}