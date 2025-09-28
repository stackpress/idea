//modules
import { useState, useEffect } from 'react';
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

export function Head(props: LayoutHeadProps) {
  const { theme, toggleTheme } = props;
  const { _ } = useLanguage();
  const themeColor = theme === 'dark' ? 'bg-gray-600' : 'bg-orange-600';
  const themeIcon = theme === 'dark' ? 'fa-moon' : 'fa-sun';
  return (
    <header className="theme-bg-bg1 theme-bc-bd0 duration-200 absolute 
    px-h-60 px-l-0 px-r-0 px-t-0 border-b">
      <div className="flex justify-between align-middle items-center px-px-20 px-h-100-0">
        <div className='flex items-center'>
          <a
            className="theme-tx1 flex items-center no-underline px-mr-10"
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
              className="theme-tx1 flex items-center no-underline 
          uppercase mt-1 hover:text-yellow-500"
              href="/docs/introduction"
            >
              {_('Docs')}
            </a>
          </nav>
        </div>
        <div className='flex items-center'>
          <SearchField />

          <nav className="rmd-hidden flex items-center">
            <a
              href="https://marketplace.visualstudio.com/items?itemName=stackpress.idea-schema"
              className="px-mr-10 hover:text-yellow-500 theme-tx1"
            >
              <i className="px-fs-22 fa-solid fa-puzzle-piece"></i>
            </a>
            <a className="px-mr-10" href="https://github.com/stackpress/idea">
              <i className="px-fs-26 fab fa-github"></i>
            </a>
            <a
              className="px-mr-10 px-w-26 px-h-26 hex-bg-CB3837 rounded-full 
            flex justify-center items-center"
              href="https://www.npmjs.com/package/@stackpress/idea"
            >
              <i className="px-fs-16 fab fa-npm text-white"></i>
            </a>
            {toggleTheme && (
              <button
                className={`flex justify-center items-center b-0 px-mr-10 
              px-h-26 px-w-26 px-fs-20 rounded-full text-white ${themeColor}`}
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
    <div className={`${theme} relative overflow-hidden px-w-100-0 px-h-100-0 
    theme-bg-bg0 theme-tx1`}>
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