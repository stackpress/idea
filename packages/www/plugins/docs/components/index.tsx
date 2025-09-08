import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { notify, useLanguage, Translate } from 'stackpress/view/client';
import Alert from 'frui/element/Alert';
import CodeView from './Code.js';
import Editor from './Editor.js';
import Layout from './Layout.js';

export type { File, Folder } from './Editor.js';

export { Editor, Layout };

export function Header1({ children }: { children: string }) {
  const { _ } = useLanguage();
  return (
    <h1 className="px-fs-24 font-bold px-pt-40 px-pb-20">
      {_(children)}
    </h1>
  );
}

export function Header2({ children }: { children: string }) {
  const { _ } = useLanguage();
  return (
    <h2 className="px-fs-16 font-bold px-pt-40">
      {_(children)}
    </h2>
  );
}

export function Header3({ children }: { children: string }) {
  const { _ } = useLanguage();
  return (
    <h3 className="font-normal uppercase px-pt-60">
      {_(children)}
    </h3>
  );
}

export function Header4({ children }: { children: string }) {
  const { _ } = useLanguage();
  return (
    <h4 className="font-semibold px-fs-12 uppercase px-py-5">
      {_(children)}
    </h4>
  );
}

export function Paragraph({ children }: { children: ReactNode }) {
  return (
    <div className="px-lh-30 px-py-20 block">
      <Translate>{children}</Translate>
    </div>
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="inline">
      <span className="theme-tx1 theme-bg-bg2 inline-block px-px-6 rounded px-lh-24">
        {children}
      </span>
    </span>
  );
}

export function InlineCode({ lang = 'typescript', children }: { 
  lang?: string, 
  children: string 
}) {
  const [ mounted, setMounted ] = useState(false);
  //only add highlighting when mounted
  //necessary because of problems with SSR
  useEffect(() => {
    setMounted(true);
  }, []);
  if (mounted) {
    return (
      <span className="inline">
        <span className="hex-CFCFCF hex-bg-444444 inline-block px-px-6 rounded px-lh-24">
          <SyntaxHighlighter
            language={lang}
            style={atomOneDark}
            customStyle={{
              display: 'inline',
              background: 'transparent',
              color: 'inherit',
              padding: '0'
            }}
          >{children}</SyntaxHighlighter>
        </span>
      </span>
    );
  }
  return null;
}

export function Bash({ children }: { children: string }) {
  return (
    <InlineCode lang="bash">{children}</InlineCode>
  );
}

export function Code(props: { lang?: string, children: string }) {
  const { lang = 'typescript', children } = props;
  return (
    <CodeView 
      copy 
      language={lang}
      className="bg-black text-white px-mb-20 px-fs-13"
      onCopy={() => notify('success', 'Copied to clipboard')}
    >{children}</CodeView>
  );
}

export function Link(props: { 
  className?: string, 
  blank?: boolean, 
  href?: string, 
  children: ReactNode 
}) {
  const { className = '', blank, children, ...attributes } = props;
  return (
    <a {...attributes} 
      target={blank? '_blank': undefined} 
      className={`theme-info underline ${className}`}
    >{children}</a>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return (
    <strong className="font-bold">
      {children}
    </strong>
  );
}

export function Semibold({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold">
      {children}
    </strong>
  );
}

export function Emphasis({ children }: { children: ReactNode }) {
  return (
    <em className="font-italic">
      {children}
    </em>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <Alert info outline curved className="px-lh-28">
      <i className="inline-block px-mr-5 fas fa-info-circle" /> 
      <SS>NOTE:</SS>&nbsp;{children}
    </Alert>
  );
}

export function Congrats({ children }: { children: ReactNode }) {
  return (
    <Alert success outline curved className="px-lh-28">
      <i className="inline-block px-mr-5 fas fa-check-circle" /> 
      <SS>CONGRATS:</SS>&nbsp;{children}
    </Alert>
  );
}

export function Warn({ children }: { children: ReactNode }) {
  return (
    <Alert warning outline curved className="px-lh-24">
      <i className="inline-block px-mr-5 fas fa-exclamation-triangle" /> 
      <SS>WARNING:</SS>&nbsp;{children}
    </Alert>
  );
}

export function Nav({ next, prev }: { 
  next?: { text: string, href: string },
  prev?: { text: string, href: string } 
}) {
  const { _ } = useLanguage();
  return (
    <nav className="flex">
      {prev ? (
        <a className="theme-primary px-py-40" href={prev.href}>
          <i className="fas fa-fw fa-chevron-left" />
          {_(prev.text)}
        </a>
      ): null}
      {next ?(
        <a className="theme-primary flex-grow text-right px-py-40" href={next.href}>
          {_(next.text)}
          <i className="fas fa-fw fa-chevron-right" />
        </a>
      ): null}
    </nav>
  );
}

export const H1 = Header1;
export const H2 = Header2;
export const H3 = Header3;
export const H4 = Header4;
export const A = Link;
export const H = Highlight;
export const S = Semibold;
export const SS = Strong;
export const E = Emphasis;
export const P = Paragraph;
export const C = InlineCode;
export const B = Bash;
