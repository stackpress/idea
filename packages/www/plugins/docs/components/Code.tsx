import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

// copy should reveal the copy button, but onCopy should be defined to modify its behavior
// meanwhile, the presence of onCopy should be enough to show the copy button

export default function Code(props: {
  copy?: boolean;
  className?: string;
  value?: string;
  language?: string;
  numbers?: boolean;
  onCopy?: () => void;
  children: string;
  style?: CSSProperties;
}) {
  const [ mounted, setMounted ] = useState(false);
  const { 
    children, 
    className, 
    copy, 
    onCopy, 
    language = 'javascript', 
    numbers, 
    style = {
      background: 'transparent',
      color: 'inherit',
      padding: '0 10px 10px',
      width: '100%'
    }
  } = props;

  const body = children
    .split('\n')
    .map((line) => (language === 'bash' ? `$ ${line}` : line))
    .join('\n');

  //extends the default copy function if an extension is provided
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    }
    navigator.clipboard.writeText(children.toString());
  };

  //only add highlighting when mounted
  //necessary because of problems with SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={className} style={{ position: 'relative' }}>
      {copy && (
        <div style={{
          textAlign: 'right',
          padding: '10px 10px 0 0',
          color: 'inherit',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }} onClick={copy && handleCopy}>
          <span>❐</span> Copy
        </div>
      )}
      {mounted && (
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          showLineNumbers={numbers}
          customStyle={style}
        >
          {body}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
