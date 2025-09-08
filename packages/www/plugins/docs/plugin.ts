//stackpress
import type { Server, Response } from 'stackpress/server';
//view
import type { ViewConfig, BrandConfig, LanguageConfig } from 'stackpress';

export function setServerProps(server: Server, res: Response) {
  //get the view, brand and auth config
  const view = server.config.path<ViewConfig>('view', {});
  const brand = server.config.path<BrandConfig>('brand', {});
  const language = server.config.path<LanguageConfig>('language', {
    key: 'locale',
    locale: 'en_US',
    languages: {}
  });
  //set data for template layer
  res.data.set('view', {
    base: view.base || '/',
    props: view.props || {}
  });
  res.data.set('brand', {
    name: brand.name || 'Stackpress',
    logo: brand.logo || '/logo.png',
    icon: brand.icon || '/icon.png',
    favicon: brand.favicon || '/favicon.ico',
  });
  res.data.set('language', {
    key: language.key || 'locale',
    locale: language.locale || 'en_US',
    languages: language.languages || {}
  });
}

export default function plugin(server: Server) {
  //on route, add docs routes
  server.on('route', _ => {
    server.get('/docs', (_req, res, ctx) => setServerProps(ctx, res));
    server.get('/docs/**', (_req, res, ctx) => setServerProps(ctx, res));
    server.get('/docs', '@/plugins/docs/views/index', -100);
    server.get('/docs/introduction', '@/plugins/docs/views/index', -100);

    //other routes
    [
      'getting-started',
      //specifications
      'specifications/introduction',
      'specifications/syntax-overview',
      'specifications/data-types',
      'specifications/schema-elements',
      'specifications/schema-structure',
      'specifications/schema-directives',
      'specifications/processing-flow',
      'specifications/plugin-system',
      'specifications/complete-examples',
      'specifications/best-practices',
      'specifications/error-handling',
      //parser
      'parser/installation',
      'parser/core-concepts',
      'parser/api-reference',
      'parser/examples',
      'parser/best-practices',
      'parser/pages/compiler',
      'parser/pages/lexer',
      'parser/pages/ast',
      'parser/pages/tokens',
      'parser/pages/exception-handling',
      //transformers
      'transformers/introduction',
      'transformers/api-reference',
      'transformers/architecture',
      'transformers/usage-patterns',
      'transformers/common-use-cases',
      'transformers/examples',
      'transformers/error-handling',
      'transformers/best-practices',
      'transformers/pages/transformer',
      'transformers/pages/terminal',
      //plugins
      'plugin-development/plugin-development-guide',
      'plugin-development/plugin-examples',
      'plugin-development/plugin-configuration',
      'plugin-development/error-handling',
      'plugin-development/best-practices',
      'plugin-development/available-tutorials',
      'plugin-development/advanced-tutorials',
      'plugin-development/getting-started',
      //tutorials
      'tutorials/tsmorph-plugin-guide',
      'tutorials/mysql-table-plugin',
      'tutorials/html-form-plugin',
      'tutorials/markdown-documentation-plugin',
      'tutorials/graphql-schema-plugin',
      'tutorials/typescript-interface-plugin',
      'tutorials/api-client-plugin',
      'tutorials/validation-plugin',
      'tutorials/test-data-plugin',
      'tutorials/openapi-specification-plugin',
    ].map(route => {
      server.get(`/docs/${route}`, `@/plugins/docs/views/${route}`, -100);
    });
  });
};