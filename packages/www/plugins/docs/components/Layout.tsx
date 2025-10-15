//modules
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import clsx from 'clsx';
//stackpress
import type {
  LayoutProviderProps,
  PanelAppProps,
} from 'stackpress/view/client';
import {
  LayoutProvider,
  NotifyContainer,
  unload,
  useTheme,
  useRequest,
  useToggle
} from 'stackpress/view/client';
//styles
import '../styles/styles.css';
//components
import Search from '../../app/components/Search.js';

//styles
//----------------------------------------------------------------------

const menuAnchorTagStyles = clsx(
  'flex',
  'font-semibold',
  'items-center',
  'px-fs-16',
  'px-mb-0',
  'px-mt-0',
  'px-px-20',
  'px-py-12',
  'theme-bc-bd1',
  'theme-bg-bg2',
  'theme-tx1',
  'uppercase'
);

const rightNavStyles = clsx(
  'absolute',
  'duration-200',
  'px-b-0',
  'px-r-0',
  'px-t-0',
  'px-t-60',
  'px-w-220',
  'px-z-100',
  'rlg-hidden'
);

//----------------------------------------------------------------------

export function LayoutHead(props: {
  open?: boolean,
  theme: string,
  base?: string,
  logo?: string,
  brand?: string,
  toggleLeft?: () => void,
  toggleTheme?: () => void
}) {
  const {
    open,
    theme,
    base,
    logo,
    brand,
    toggleLeft,
    toggleTheme
  } = props;
  const left = open ? 'rmd-px-l-220' : 'rmd-px-l-0';
  const full = typeof open === 'undefined' ? 'px-l-0' : 'px-l-220';
  const themeColor = theme === 'dark' ? 'bg-gray-600' : 'bg-orange-600';
  const themeIcon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
  return (
    <header
      className={
        clsx(
          'absolute',
          'duration-200',
          'px-h-60',
          'px-r-0',
          'px-t-0',
          'theme-bg-bg1',
          full,
          left
        )
      }
    >
      <div className="flex items-center px-h-100-0 px-px-20">
        {toggleLeft && (
          <button
            className="b-0 bg-transparent md-hidden p-0 text-xl theme-tx1"
            onClick={toggleLeft}
          >
            <i className="fas fa-bars"></i>
          </button>
        )}
        <div className="flex-grow">
          {base ? (
            <a className="flex items-center no-underline theme-tx1" href={base}>
              {logo && <img src={logo} alt={brand} className="px-h-30 px-mr-10 px-w-30" />}
              {brand && <span className="px-fs-16 uppercase">{brand}</span>}
            </a>
          ) : brand || logo ? (
            <span>
              {logo && <img src={logo} alt={brand} className="px-h-30 px-mr-10 px-w-30" />}
              {brand && <span className="px-fs-16 uppercase">{brand}</span>}
            </span>
          ) : undefined}
        </div>

        {/* Search Component */}
        <Search />

        {toggleTheme && (
          <button
            className={
              clsx(
                'b-0',
                'flex',
                'items-center',
                'justify-center',
                'px-fs-18',
                'px-h-26',
                'px-mr-10',
                'px-w-26',
                'rounded-full',
                'text-white',
                themeColor
              )
            }
            onClick={() => toggleTheme()}
          >
            <i className={`fas ${themeIcon}`}></i>
          </button>
        )}
      </div>
    </header>
  );
}

export function LayoutLeft(props: {
  pathname?: string,
  open: boolean,
  toggle: () => void
}) {
  const { pathname = '/', open, toggle } = props;
  const left = open ? 'rmd-px-l-0' : 'rmd-px-l--220';
  const { _ } = useLanguage();
  const menu = [
    {
      label: '',
      search: '',
      children: [
        {
          label: 'Introduction',
          search: '/docs/introduction',
          href: '/docs/introduction'
        },
        {
          label: 'Getting Started',
          search: '/docs/getting-started',
          href: '/docs/getting-started'
        }
      ]
    },
    {
      label: 'Specifications',
      search: '/docs/specifications',
      children: [
        {
          label: 'Syntax Overview',
          search: '/docs/specifications/syntax-overview',
          href: '/docs/specifications/syntax-overview'
        },
        {
          label: 'Data Types',
          search: '/docs/specifications/data-types',
          href: '/docs/specifications/data-types'
        },
        {
          label: 'Schema Elements',
          search: '/docs/specifications/schema-elements',
          href: '/docs/specifications/schema-elements'
        },
        {
          label: 'Schema Structure',
          search: '/docs/specifications/schema-structure',
          href: '/docs/specifications/schema-structure'
        },
        {
          label: 'Schema Directives',
          search: '/docs/specifications/schema-directives',
          href: '/docs/specifications/schema-directives'
        },
        {
          label: 'Processing Flow',
          search: '/docs/specifications/processing-flow',
          href: '/docs/specifications/processing-flow'
        },
        {
          label: 'Plugin System',
          search: '/docs/specifications/plugin-system',
          href: '/docs/specifications/plugin-system'
        },
        {
          label: 'Complete Example',
          search: '/docs/specifications/complete-examples',
          href: '/docs/specifications/complete-examples'
        },
        {
          label: 'Best Practices',
          search: '/docs/specifications/best-practices',
          href: '/docs/specifications/best-practices'
        },
        {
          label: 'Error Handling',
          search: '/docs/specifications/error-handling',
          href: '/docs/specifications/error-handling'
        }
      ]
    },
    {
      label: 'Parser',
      search: '/docs/parser',
      children: [
        {
          label: 'Installation',
          search: '/docs/parser/installation',
          href: '/docs/parser/installation'
        },
        {
          label: 'Core Concepts',
          search: '/docs/parser/core-concepts',
          href: '/docs/parser/core-concepts'
        },
        {
          label: 'API Reference',
          search: '/docs/parser/api-reference',
          href: '/docs/parser/api-reference'
        },
        {
          label: 'Examples',
          search: '/docs/parser/examples',
          href: '/docs/parser/examples'
        },
        {
          label: 'Best Practices',
          search: '/docs/parser/best-practices',
          href: '/docs/parser/best-practices'
        }
      ]
    },
    {
      label: 'Transformers',
      search: '/docs/transformers',
      children: [
        {
          label: 'Introduction',
          search: '/docs/transformers/introduction',
          href: '/docs/transformers/introduction'
        },
        {
          label: 'API Reference',
          search: '/docs/transformers/api-reference',
          href: '/docs/transformers/api-reference'
        },
        {
          label: 'Architecture',
          search: '/docs/transformers/architecture',
          href: '/docs/transformers/architecture'
        },
        {
          label: 'Usage Patterns',
          search: '/docs/transformers/usage-patterns',
          href: '/docs/transformers/usage-patterns'
        },
        {
          label: 'Common Use Cases',
          search: '/docs/transformers/common-use-cases',
          href: '/docs/transformers/common-use-cases'
        },
        {
          label: 'Examples',
          search: '/docs/transformers/examples',
          href: '/docs/transformers/examples'
        },
        {
          label: 'Error Handling',
          search: '/docs/transformers/error-handling',
          href: '/docs/transformers/error-handling'
        },
        {
          label: 'Best Practices',
          search: '/docs/transformers/best-practices',
          href: '/docs/transformers/best-practices'
        }

      ]
    },
    {
      label: 'Plugin',
      search: '/docs/plugin-development',
      children: [
        {
          label: 'Plugin Development Guide',
          search: '/docs/plugin-development/plugin-development-guide',
          href: '/docs/plugin-development/plugin-development-guide'
        },
        {
          label: 'Plugin Examples',
          search: '/docs/plugin-development/plugin-examples',
          href: '/docs/plugin-development/plugin-examples'
        },
        {
          label: 'Plugin Configuration',
          search: '/docs/plugin-development/plugin-configuration',
          href: '/docs/plugin-development/plugin-configuration'
        },
        {
          label: 'Error Handling',
          search: '/docs/plugin-development/error-handling',
          href: '/docs/plugin-development/error-handling'
        },
        {
          label: 'Best Practices',
          search: '/docs/plugin-development/best-practices',
          href: '/docs/plugin-development/best-practices'
        },
        {
          label: 'Available Tutorials',
          search: '/docs/plugin-development/available-tutorials',
          href: '/docs/plugin-development/available-tutorials'
        },
        {
          label: 'Advanced Tutorials',
          search: '/docs/plugin-development/advanced-tutorials',
          href: '/docs/plugin-development/advanced-tutorials'
        },
        {
          label: 'Getting Started',
          search: '/docs/plugin-development/getting-started',
          href: '/docs/plugin-development/getting-started'
        }
      ]
    },
    {
      label: 'Tutorials',
      search: '/docs/tutorials',
      children: [
        {
          label: 'TSMorph Plugin Guide',
          search: '/docs/tutorials/tsmorph-plugin-guide',
          href: '/docs/tutorials/tsmorph-plugin-guide'
        },
        {
          label: 'MySQL Tables Plugin',
          search: '/docs/tutorials/mysql-table-plugin',
          href: '/docs/tutorials/mysql-table-plugin'
        },
        {
          label: 'HTML Form Plugin',
          search: '/docs/tutorials/html-form-plugin',
          href: '/docs/tutorials/html-form-plugin'
        },
        {
          label: 'Markdown Documentation Plugin',
          search: '/docs/tutorials/markdown-documentation-plugin',
          href: '/docs/tutorials/markdown-documentation-plugin'
        },
        {
          label: 'GraphQL Schema Plugin',
          search: '/docs/tutorials/graphql-schema-plugin',
          href: '/docs/tutorials/graphql-schema-plugin'
        },
        {
          label: 'TypeScript Interface Plugin',
          search: '/docs/tutorials/typescript-interface-plugin',
          href: '/docs/tutorials/typescript-interface-plugin'
        },
        {
          label: 'API Client Plugin',
          search: '/docs/tutorials/api-client-plugin',
          href: '/docs/tutorials/api-client-plugin'
        },
        {
          label: 'Validation Plugin',
          search: '/docs/tutorials/validation-plugin',
          href: '/docs/tutorials/validation-plugin'
        },
        {
          label: 'Test Data Plugin',
          search: '/docs/tutorials/test-data-plugin',
          href: '/docs/tutorials/test-data-plugin'
        },
        {
          label: 'OpenAPI Specification Plugin',
          search: '/docs/tutorials/openapi-specification-plugin',
          href: '/docs/tutorials/openapi-specification-plugin'
        }

      ]
    }

  ];
  return (
    <aside
      className={
        clsx(
          'absolute',
          'duration-200',
          'flex',
          'flex-col',
          'px-b-0',
          'px-h-100-0',
          'px-l-0',
          'px-t-0',
          'px-w-220',
          'px-z-100',
          left
        )
      }
    >
      <header className="flex items-center px-h-60 px-p-10 theme-bg-bg0">
        <h3 className="flex-grow px-m-0">
          <a className="flex items-center no-underline theme-tx1" href="/">
            <i className="fas fa-lightbulb px-mr-10 text-2xl text-yellow-500"></i>
            <span className="font-extrabold px-fs-20">{_('idea')}</span>
            <span className="mt-2 px-ml-5 text-gray-400">{_('v0.6.1')}</span>
          </a>
        </h3>
        <button
          className="b-0 bg-transparent md-hidden p-0 text-xl theme-tx1"
          onClick={toggle}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </header>
      <main className="flex-grow overflow-auto px-pb-40 px-pt-10 theme-bg-bg1">
        {menu.map((section, i) => (
          <div key={i}>
            {section.label.length ? (
              <a
                href={section.children[0].href}
                className={menuAnchorTagStyles}
              >
                <span className="flex-grow">{_(section.label)}</span>
                {pathname.startsWith(section.search) ? (
                  <i className="fas fa-caret-down px-fs-12 theme-muted"></i>
                ) : (
                  <i className="fas fa-caret-left px-fs-12 theme-muted"></i>
                )}

              </a>
            ) : null}
            {section.children.map((item, j) => {
              const left = section.label.length ? 'px-pl-40' : 'px-pl-20';
              return pathname.startsWith(section.search) ? (
                (pathname === item.search || pathname.startsWith(`${item.search}/`)) ? (
                  <a
                    key={j}
                    className={`block font-bold px-py-10 theme-tx1 ${left}`}
                    href={item.href}
                  >
                    {_(item.label)}
                  </a>
                ) : (
                  <a
                    key={j}
                    className={`block px-py-10 theme-muted ${left}`}
                    href={item.href}
                  >
                    {_(item.label)}
                  </a>
                )
              ) : null;
            })}
          </div>
        ))}
      </main>
    </aside>
  );
}

export function LayoutMain(props: {
  open?: boolean,
  right?: boolean,
  children: ReactNode
}) {
  const { open, children } = props;
  const left = open ? 'rmd-px-l-220' : 'rmd-px-l-0';
  const right = props.right ? 'px-r-220 rlg-px-r-0' : 'px-r-0';
  const full = typeof open === 'undefined' ? 'px-l-0' : 'px-l-220';
  return (
    <main
      className={
        clsx(
          'absolute',
          'duration-200',
          'px-b-0',
          'px-t-60',
          'theme-bg-bg0',
          full,
          left,
          right
        )
      }
    >
      {children}
    </main>
  );
}

export function LayoutRight({ children }: {
  children: ReactNode
}) {
  return (
    <aside className={rightNavStyles}>
      <div className="flex flex-col px-h-100-0 theme-bg-bg1">
        {children}
      </div>
    </aside>
  );
}

export function LayoutApp(props: {
  right?: ReactNode,
  children: ReactNode
}) {
  const { children } = props;
  const request = useRequest();
  const [left, toggleLeft] = useToggle();
  const { theme, toggle: toggleTheme } = useTheme();
  const pathname = request?.url?.pathname || '/';
  return (
    <div
      className={
        clsx(
          'overflow-hidden',
          'px-h-100-0',
          'px-w-100-0',
          'relative',
          'bg0',
          'theme-tx1',
          theme
        )
      }
    >
      <LayoutHead
        open={left}
        theme={theme}
        toggleLeft={toggleLeft}
        toggleTheme={toggleTheme}
      />
      <LayoutLeft
        pathname={pathname}
        open={left}
        toggle={toggleLeft}
      />
      {props.right ? (<LayoutRight>{props.right}</LayoutRight>) : null}
      <LayoutMain right={!!props.right} open={left}>{children}</LayoutMain>
    </div>
  );
}

export default function Layout(props: LayoutProviderProps & PanelAppProps) {
  const {
    data,
    session,
    response,
    right,
    children
  } = props;
  const [request, setRequest] = useState<Record<string, any>>({
    ...(props.request || {}),
    session: {
      ...(props.request?.session || {}),
      theme: props.request?.session?.theme || 'dark'
    }
  });
  //unload flash message
  useEffect(() => {
    const light = document.cookie.includes('theme=light');
    if (!request.session?.theme) {
      setRequest({
        ...request,
        session: { theme: light ? 'light' : 'dark' }
      });
    }
    unload();
  }, []);

  return (
    <LayoutProvider
      data={data}
      session={session}
      request={request as any}
      response={response}
    >
      <LayoutApp right={right}>
        {children}
      </LayoutApp>
      <NotifyContainer />
    </LayoutProvider>
  );
}