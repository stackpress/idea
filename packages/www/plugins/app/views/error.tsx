import '../styles/page.css';
import type { Trace, ServerPageProps } from 'stackpress/view/client';
import Layout from '../Layout.js';

//placeholder for translation
const _ = (text: string) => text;

export type Config = {
  server: { mode: string }
}

export default function ErrorPage(props: ServerPageProps<Config>) {
  const {
    data = { server: { mode: 'production' } },
    request,
    response
  } = props;

  const theme = request.session.theme as string | undefined;
  const mode = data.server?.mode || 'production';
  const production = mode === 'production';
  const notfound = response.code === 404;
  const title = notfound ? _('Not Found') : _('Oops...');
  const description = notfound 
    ? _('The requested resource was not found.') 
    : _(response.error || 'There was an error.');
  const stack = (response.stack || []) as (Trace & { 
    snippet: Record<string, string|undefined> 
  })[];
  const red = theme === 'dark' ? 'bg-red-900' : 'bg-red-100';
  return (
    <Layout>
      <main className={`${theme} px-p-10 px-w-100-0 px-h-100-0 theme-bg-bg0 theme-tx1`}>
        <h1 className="px-py-20 px-fs-20 font-bold">
          {title}
        </h1>
        <p className={`${red} px-p-10 rounded`}>
          <i className="text-red-600 px-mr-10 fas fa-fw fa-times-circle"></i>
          {description}
        </p>
        {!production && !notfound && stack.length > 0 && (
          <div>
            {stack.map((trace, index) => (
              <div key={index} className="theme-bc-bd0 px-mt-20 px-pb-20 border-b">
                <h3 className="font-bold px-m-0">
                  #{stack.length - Number(index)} {trace.method}
                </h3>
                <div className="font-italic theme-muted text-sm">
                  {trace.file}:{trace.line}:{trace.char}
                </div>
                {trace.snippet && (
                  <div className="bg-black text-gray-300 px-mt-10 px-p-10 rounded">
                    {trace.snippet.before && (
                      <pre>{trace.line - 1} | {trace.snippet.before}</pre>
                    )}
                    {trace.snippet.main && (
                      <pre>{trace.line} | {trace.snippet.main}</pre>
                    )}
                    {trace.snippet.location && (
                      <pre>{' '.repeat(String(trace.line).length + 3)}{trace.snippet.location}</pre>
                    )}
                    {trace.snippet.after && (
                      <pre>{trace.line + 1} | {trace.snippet.after}</pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  )
}

export function Head(props: ServerPageProps<Config>) {
  const {
    request,
    response,
    styles = []
  } = props;

  const notfound = response.code === 404;
  const url = request.url?.pathname || '/';
  const title = notfound ? _('Not Found') : _('Oops...');
  const description = notfound 
    ? _('The requested resource was not found.') 
    : _('There was an error.');
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/icon.png" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/icon.png" />

      <link rel="icon" type="image/x-icon" href="/icon.png" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}