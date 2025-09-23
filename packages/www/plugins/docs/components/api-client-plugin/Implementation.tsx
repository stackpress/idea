import { useLanguage, Translate } from 'r22n';
import { H2, H3, P } from '../index.js';
import Code from '../Code.js';

const corePluginFunction = `export default async function generateAPIClient(
  props: PluginProps<{ config: APIClientConfig }>
) {
  const { config, schema, transformer } = props;
  
  try {
    // Validate configuration
    validateConfig(config);
    
    // Generate client content
    let content = '';
    
    // Add file header and imports
    content += generateFileHeader(config);
    content += generateImports(config);
    
    // Generate types if requested
    if (config.generateTypes) {
      content += generateTypes(schema, config);
    }
    
    // Generate base client class
    content += generateBaseClient(config);
    
    // Generate model-specific clients
    if (schema.model) {
      if (config.clientType === 'rest' || config.clientType === 'both') {
        content += generateRESTClients(schema.model, config);
      }
      
      if (config.clientType === 'graphql' || config.clientType === 'both') {
        content += generateGraphQLClients(schema.model, config);
      }
    }
    
    // Generate main client export
    content += generateMainClient(schema, config);
    
    // Write to output file
    const outputPath = await transformer.loader.absolute(config.output);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log(\`✅ API client generated: \${outputPath}\`);
    
  } catch (error) {
    console.error('❌ API client generation failed:', error.message);
    throw error;
  }
}`;

const headerAndImports = `function generateFileHeader(config: APIClientConfig): string {
  const timestamp = new Date().toISOString();
  return \`/**
 * Generated API Client
 * Generated at: \${timestamp}
 * Client Type: \${config.clientType}
 * HTTP Library: \${config.httpLibrary || 'fetch'}
 * 
 * This file is auto-generated. Do not edit manually.
 */

\`;
}

function generateImports(config: APIClientConfig): string {
  let imports = '';
  
  if (config.httpLibrary === 'axios') {
    imports += \`import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';\\n\`;
  }
  
  if (config.clientType === 'graphql' || config.clientType === 'both') {
    imports += \`import { ApolloClient, InMemoryCache, gql, DocumentNode } from '@apollo/client';\\n\`;
  }
  
  imports += \`
// Base types
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> extends APIResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

\`;
  
  return imports;
}`;

const typeGeneration = `function generateTypes(schema: any, config: APIClientConfig): string {
  let content = '// Generated Types\\n';
  
  // Generate enums
  if (schema.enum) {
    for (const [enumName, enumDef] of Object.entries(schema.enum)) {
      content += \`export enum \${enumName} {\\n\`;
      for (const [key, value] of Object.entries(enumDef)) {
        content += \`  \${key} = "\${value}",\\n\`;
      }
      content += '}\\n\\n';
    }
  }
  
  // Generate interfaces
  if (schema.model) {
    for (const [modelName, model] of Object.entries(schema.model)) {
      content += \`export interface \${modelName} {\\n\`;
      for (const column of model.columns || []) {
        const optional = !column.required ? '?' : '';
        const type = mapTypeToTypeScript(column.type);
        content += \`  \${column.name}\${optional}: \${type};\\n\`;
      }
      content += '}\\n\\n';
      
      // Generate input types
      const autoFields = model.columns
        ?.filter((col: any) => col.attributes?.id || col.attributes?.default)
        .map((col: any) => \`'\${col.name}'\`)
        .join(' | ');
      
      if (autoFields) {
        content += \`export type Create\${modelName}Input = Omit<\${modelName}, \${autoFields}>;\\n\`;
      } else {
        content += \`export type Create\${modelName}Input = \${modelName};\\n\`;
      }
      
      content += \`export type Update\${modelName}Input = Partial<\${modelName}>;\\n\\n\`;
    }
  }
  
  return content;
}`;

const baseClientGeneration = `function generateBaseClient(config: APIClientConfig): string {
  const authType = config.authentication?.type || 'bearer';
  const headerName = config.authentication?.headerName || 'Authorization';
  
  return \`
// Base Client Class
export class BaseAPIClient {
  private baseUrl: string;
  private authToken?: string;
  \${config.httpLibrary === 'axios' ? 'private axiosInstance: AxiosInstance;' : ''}

  constructor(baseUrl: string = '\${config.baseUrl || '/api'}') {
    this.baseUrl = baseUrl.replace(/\\/$/, '');
    \${config.httpLibrary === 'axios' ? generateAxiosSetup() : ''}
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private getAuthHeaders(): Record<string, string> {
    if (!this.authToken) return {};
    
    \${generateAuthHeaders(authType, headerName)}
  }

  \${config.httpLibrary === 'axios' ? generateAxiosMethods() : generateFetchMethods()}
}

\`;
}`;

const restClientGeneration = `function generateRESTClients(models: Record<string, any>, config: APIClientConfig): string {
  let content = '// REST API Clients\\n';
  
  for (const [modelName, model] of Object.entries(models)) {
    const lowerName = modelName.toLowerCase();
    const pluralName = \`\${lowerName}s\`;
    
    content += \`
export class \${modelName}Client extends BaseAPIClient {
  // Get all \${pluralName}
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }, options?: RequestOptions): Promise<PaginatedResponse<\${modelName}>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sort) queryParams.set('sort', params.sort);
    
    const query = queryParams.toString();
    const url = \\\`/\${pluralName}\\\${query ? \\\`?\\\${query}\\\` : ''}\\\`;
    
    return this.get<\${modelName}[]>(url, options) as Promise<PaginatedResponse<\${modelName}>>;
  }

  // Get single \${lowerName} by ID
  async getById(id: string, options?: RequestOptions): Promise<APIResponse<\${modelName}>> {
    return this.get<\${modelName}>(\\\`/\${pluralName}/\\\${id}\\\`, options);
  }

  // Create new \${lowerName}
  async create(data: Create\${modelName}Input, options?: RequestOptions): Promise<APIResponse<\${modelName}>> {
    return this.post<\${modelName}>(\\\`/\${pluralName}\\\`, data, options);
  }

  // Update existing \${lowerName}
  async update(id: string, data: Update\${modelName}Input, options?: RequestOptions): Promise<APIResponse<\${modelName}>> {
    return this.put<\${modelName}>(\\\`/\${pluralName}/\\\${id}\\\`, data, options);
  }

  // Delete \${lowerName}
  async delete(id: string, options?: RequestOptions): Promise<APIResponse<boolean>> {
    return this.delete<boolean>(\\\`/\${pluralName}/\\\${id}\\\`, options);
  }
}
\`;
  }
  
  return content;
}`;

export default function Implementation() {
  const { _ } = useLanguage();

  return (
    <section id="implementation">
      <H2>{_('4. Implementation')}</H2>
      <P>
        <Translate>
          The implementation section covers the core plugin function and
          supporting utilities that handle API client generation. This
          includes configuration validation, content generation, file
          writing, and error handling throughout the generation process.
        </Translate>
      </P>

      <H3>{_('4.1. Core Plugin Function')}</H3>
      <P>
        <Translate>
          The core plugin function serves as the main entry point for API
          client generation. It orchestrates the entire process from
          configuration validation through content generation to file
          output, ensuring proper error handling and logging throughout.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {corePluginFunction}
      </Code>

      <H3>{_('4.2. Generation Functions')}</H3>
      <P>
        <Translate>
          The generation functions handle the creation of specific parts of
          the API client code. These utility functions generate file headers,
          imports, type definitions, base client classes, and model-specific
          client methods, ensuring consistent code structure and proper
          TypeScript typing.
        </Translate>
      </P>
      <Code copy language='typescript' className='bg-black text-white'>
        {headerAndImports}
      </Code>
      <Code copy language='typescript' className='bg-black text-white'>
        {typeGeneration}
      </Code>
      <Code copy language='typescript' className='bg-black text-white'>
        {baseClientGeneration}
      </Code>
      <Code copy language='typescript' className='bg-black text-white'>
        {restClientGeneration}
      </Code>
    </section>
  );
}