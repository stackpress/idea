import { useState } from 'react';
import { notify } from 'stackpress/view/client';
import Code from './Code.js';

export type File = {
  type: 'file',
  id: string,
  name: string,
  level: number,
  content: string
};
export type Folder = {
  type: 'folder',
  name: string,
  level: number
};
export type EditorTabsProps = {
  active: string,
  files: (File|Folder)[],
  open: (file: string) => void
};
export type EditorFilesProps = {
  active: string,
  files: (File|Folder)[],
  className?: string
};
export type EditorExplorerProps = {
  active: string,
  files: (File|Folder)[],
  open: (file: string) => void
};
export type EditorProps = {
  files: (File|Folder)[],
  value: string,
  className?: string,
  leftClassName?: string,
  topClassName?: string,
  mainClassName?: string,
  title?: string
};

export function EditorExplorer(props: EditorExplorerProps) {
  const { active, files, open } = props;
  return (
    <div className="flex-grow overflow-auto px-pb-20">
      {files.map((item, index) => {
        const left = 5 + (item.level * 15);
        if (item.type === 'folder') {
          return (
            <div 
              key={`explorer-${index}`} 
              className="flex items-center" 
              style={{ paddingLeft: `${left}px` }}
            >
              <i className="inline-block px-fs-10 px-mr-5 fas fa-chevron-down"></i>
              {item.name}
            </div>
          );
        }
        const icon = item.name.endsWith('.tsx') ? 'fab fa-react' : 'fas fa-file';
        return (
          <div 
            key={index} 
            className={`${active === item.id ? 'theme-bg-bg1': ''} cursor-pointer flex items-center`}
            style={{ paddingLeft: `${left}px` }}
            onClick={() => open(item.id)}
          >
            <i className={`inline-block px-fs-10 px-mr-5 ${icon}`}></i>
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export function EditorTabs(props: EditorTabsProps) {
  const { active, files, open } = props;
  return (
    <div className="flex px-pt-5 px-px-3">
      {files.filter(item => item.type === 'file').map((item, index) => {
        const icon = item.name.endsWith('.tsx') ? 'fab fa-react' : 'fas fa-file';
        return (
          <div 
            key={`tab-${index}`}
            className={`${active === item.id ? 'bg-black text-white': 'theme-bg-bg1'} px-mr-3 px-py-5 px-px-16 inline-block whitespace-nowrap cursor-pointer`}
            onClick={() => open(item.id)}
          >
            <i className={`inline-block px-fs-10 px-mr-5 ${icon}`}></i>
            {item.name}
          </div>
        );
      })}
    </div>
  );
};

export function EditorFiles(props: EditorFilesProps) {
  const { active, className = '', files } = props;
  return (
    <>
      {files.filter(item => item.type === 'file').map((item, index) => {
        return (
          <Code numbers copy 
            key={`file-${index}`}
            language="javascript" 
            onCopy={() => notify('success', 'Copied to clipboard')}
            className={`${active !== item.id ? 'hidden': ''} rsm-px-l-0 bg-black text-white overflow-auto !absolute px-r-0 px-b-0 px-t-34 ${className}`}
          >{item.content}</Code>
        );
      })}
    </>
  );
};

export default function Editor(props: EditorProps) {
  const { 
    title = 'PROJECT', 
    files = [], 
    value, 
    className = '',
    leftClassName = '',
    topClassName = '',
    mainClassName = ''
  } = props;
  const [ file, open ] = useState(value);
  return (
    <div className={`relative ${className}`}>
      <div className={`theme-bg-bg2 px-lh-30 absolute px-t-0 px-b-0 flex flex-col rsm-hidden ${leftClassName}`}>
        <div className="px-p-5">{title}</div>
        <EditorExplorer active={file} files={files} open={open} />
      </div>
      <div className={`theme-bg-bg3 overflow-x-auto absolute px-r-0 px-t-0 px-h-34 rsm-px-l-0 ${topClassName}`}>
        <EditorTabs active={file} files={files} open={open} />
      </div>
      <EditorFiles className={mainClassName} active={file} files={files} />
    </div>
  );
}