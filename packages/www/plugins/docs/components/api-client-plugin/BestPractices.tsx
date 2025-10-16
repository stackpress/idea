//modules
import { useLanguage, Translate } from 'r22n';
//local
import { H1, H2, P } from '../../../docs/components/index.js';
import Code from '../../../docs/components/Code.js';

//code examples
//--------------------------------------------------------------------//

const typeSafety = 
`// Always use generated types
interface UserWithPosts extends User {
  posts: Post[];
}

// Type-safe error handling
function handleUserResponse(response: APIResponse<User>) {
  if (response.success) {
    // TypeScript knows response.data is User
    console.log(response.data.email);
  } else {
    // TypeScript knows response.error exists
    console.error(response.error);
  }
}`;

//--------------------------------------------------------------------//

const errorHandlingPattern = 
`// Centralized error handling
class APIErrorHandler {
  static handle(response: APIResponse<any>) {
    if (!response.success) {
      if (response.errors) {
        // Handle validation errors
        Object.entries(response.errors).forEach(([field, messages]) => {
          console.error(\`\${field}: \${messages.join(', ')}\`);
        });
      } else {
        // Handle general errors
        console.error(response.error);
      }
    }
  }
}

// Usage
const response = await client.user.create(userData);
APIErrorHandler.handle(response);`;

//--------------------------------------------------------------------//

const clientExtension = 
`// Extend base client for custom behavior
class CustomAPIClient extends APIClient {
  constructor(baseUrl?: string) {
    super(baseUrl);
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Add request logging
    const originalRequest = this.request;
    this.request = async (method, url, data, options) => {
      console.log(\`\${method} \${url}\`, data);
      return originalRequest.call(this, method, url, data, options);
    };
  }
}`;

//--------------------------------------------------------------------//

const cachingPattern = 
`// Simple in-memory cache
class CachedAPIClient extends APIClient {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  async getCached<T>(key: string, fetcher: () => Promise<APIResponse<T>>): Promise<APIResponse<T>> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return { success: true, data: cached.data };
    }
    
    const response = await fetcher();
    
    if (response.success) {
      this.cache.set(key, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response;
  }
}`;

//--------------------------------------------------------------------//

export default function BestPractices() {
  //hooks
  const { _ } = useLanguage();

  return (
    <>
      {/* Best Practices Section Content */}
      <section id="best-practices">
      <H1>{_('8. Best Practices')}</H1>
      <P>
        <Translate>
          Following best practices ensures your API client is maintainable,
          performant, and robust. These patterns have been proven in
          production environments and help avoid common pitfalls when 
          working with generated API clients.
        </Translate>
      </P>

      <H2>{_('8.1. Type Safety')}</H2>
      <P>
        <Translate>
          Leverage TypeScript's type system to catch errors at compile time
          and improve developer experience. Always use the generated types
          and interfaces to maintain type safety throughout your application.
        </Translate>
      </P>
      <Code copy language="typescript" className="bg-black text-white">
        {typeSafety}
      </Code>

      <H2>{_('8.2. Error Handling')}</H2>
      <P>
        <Translate>
          Implement consistent error handling patterns across your
          application. Create centralized error handling utilities to avoid
          code duplication and ensure consistent error presentation to users.
        </Translate>
      </P>
      <Code copy language="typescript" className="bg-black text-white">
        {errorHandlingPattern}
      </Code>

      <H2>{_('8.3. Client Extension')}</H2>
      <P>
        <Translate>
          Extend the generated client for custom functionality while
          maintaining the generated code's integrity. Use inheritance and
          composition patterns to add logging, metrics, or custom behavior.
        </Translate>
      </P>
      <Code copy language="typescript" className="bg-black text-white">
        {clientExtension}
      </Code>

      <H2>{_('8.4. Caching Strategies')}</H2>
      <P>
        <Translate>
          Implement appropriate caching strategies to improve performance 
          and reduce server load. Consider using in-memory caches for 
          frequently accessed data and implement cache invalidation 
          strategies.
        </Translate>
      </P>
      <Code copy language="typescript" className="bg-black text-white">
        {cachingPattern}
      </Code>
      </section>
    </>
  );
}