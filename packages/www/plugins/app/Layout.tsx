//modules
import { useState, useEffect } from 'react';
import clsx from 'clsx';
//views
import type {
  PanelAppProps,
  LayoutHeadProps,
  LayoutPanelProps
} from 'stackpress/view/client';
import {
  unload,
  useTheme,
  useLanguage,
  NotifyContainer,
  LayoutMain,
  LayoutProvider
} from 'stackpress/view/client';
//styles
import './styles/page.css';

//components
import SearchField from './components/Search.js';

//styles
//----------------------------------------------------------------------

const headerStyles = clsx(
  'absolute',
  'border-b',
  'duration-200',
  'px-h-60',
  'px-l-0',
  'px-r-0',
  'px-t-0',
  'theme-bc-bd0',
  'theme-bg-bg1'
);

const headerContainerStyles = clsx(
  'align-middle',
  'flex',
  'items-center',
  'justify-between',
  'px-h-100-0',
  'px-px-20'
);

const docsAnchorTagStyles = clsx(
  'flex',
  'hover:text-yellow-500',
  'items-center',
  'mt-1',
  'no-underline',
  'theme-tx1',
  'uppercase'
);

const npmAnchorTagStyles = clsx(
  'flex',
  'hex-bg-CB3837',
  'items-center',
  'justify-center',
  'px-h-26',
  'px-mr-10',
  'px-w-26',
  'rounded-full'
);

//----------------------------------------------------------------------

export function Head(props: LayoutHeadProps) {
  const { theme, toggleTheme } = props;
  const { _ } = useLanguage();
  const themeColor = theme === 'dark' ? 'bg-gray-600' : 'bg-orange-600';
  const themeIcon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
  return (
    <header className={headerStyles}>
      <div className={headerContainerStyles}>
        <div className='flex items-center'>
          <a
            className="flex items-center no-underline px-mr-10 theme-tx1"
            href="/"
          >
            <img
              src="/icon.png"
              alt="idea-logo"
              className='px-w-30 px-h-30 px-mr-10'
            />
            <span className="px-fs-20 font-extrabold">idea</span>
          </a>
          <nav>
            <a
              className={docsAnchorTagStyles}
              href="/docs/introduction"
            >
              {_('Docs')}
            </a>
          </nav>
        </div>
        <div className='flex items-center'>

          {/* Search Field Component */}
          <SearchField />

          <nav className="flex items-center rmd-hidden">
            <a
              href="https://marketplace.visualstudio.com/items?itemName=stackpress.idea-schema"
              className="hover:text-yellow-500 px-mr-10 theme-tx1"
            >
              <i className="fa-solid fa-puzzle-piece px-fs-22"></i>
            </a>
            <a className="px-mr-10" href="https://github.com/stackpress/idea">
              <i className="fab fa-github px-fs-26"></i>
            </a>
            <a
              className={npmAnchorTagStyles}
              href="https://www.npmjs.com/package/@stackpress/idea"
            >
              <i className="fab fa-npm px-fs-16 text-white"></i>
            </a>
            {toggleTheme && (
              <button
                className={
                  clsx(
                    'b-0',
                    'flex',
                    'items-center',
                    'justify-center',
                    'px-fs-20',
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
          </nav>
        </div>
      </div>
    </header>
  );
}

export function App(props: PanelAppProps) {
  const { children } = props;
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <div
      className={
        clsx(
          'overflow-hidden',
          'px-h-100-0',
          'px-w-100-0',
          'relative',
          'theme-bg-bg0',
          'theme-tx1',
          theme
        )
      }
    >
      <Head theme={theme} toggleTheme={toggleTheme} />
      <LayoutMain head>{children}</LayoutMain>
    </div>
  );
}

export default function Layout(props: LayoutPanelProps) {
  const {
    data,
    session,
    response,
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
  if (!request?.session?.theme) {
    return null;
  }

  return (
    <LayoutProvider
      data={data}
      session={session}
      request={request as any}
      response={response}
    >
      <App>{children}</App>
      <NotifyContainer />
    </LayoutProvider>
  );
}