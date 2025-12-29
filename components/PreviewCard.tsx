
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
  vscDarkPlus, 
  atomDark, 
  dracula, 
  materialDark, 
  nord, 
  oneDark, 
  synthwave84 
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SnippetSettings } from '../types';
import { THEMES } from '../constants';

interface PreviewCardProps {
  code: string;
  settings: SnippetSettings;
  cardRef: React.RefObject<HTMLDivElement>;
}

const PRISM_STYLES: Record<string, any> = {
  hyper: synthwave84,
  ocean: materialDark,
  midnight: vscDarkPlus,
  sunset: dracula,
  mint: nord,
  glass: oneDark,
  candy: dracula
};

const PreviewCard: React.FC<PreviewCardProps> = ({ code, settings, cardRef }) => {
  const activeTheme = THEMES.find(t => t.id === settings.themeId) || THEMES[0];
  const prismStyle = PRISM_STYLES[settings.themeId] || atomDark;

  const renderWindowControls = () => {
    if (settings.windowStyle === 'none') return null;
    
    if (settings.windowStyle === 'mac') {
      return (
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      );
    }
    
    return (
      <div className="flex justify-end gap-3 mb-4 opacity-70">
        <div className="w-3 h-0.5 bg-slate-400"></div>
        <div className="w-3 h-3 border-2 border-slate-400"></div>
        <div className="w-3 h-3 text-slate-400 text-[8px] flex items-center justify-center">✕</div>
      </div>
    );
  };

  return (
    <div 
      className="flex items-center justify-center min-h-[400px] overflow-hidden rounded-lg p-10 select-all"
      style={{ background: activeTheme.background }}
    >
      <div 
        ref={cardRef}
        className="relative transition-all duration-300"
        style={{ 
          padding: `${settings.padding}px`,
          background: activeTheme.background
        }}
      >
        <div 
          className={`overflow-hidden rounded-xl border border-white/10 transition-shadow duration-500`}
          style={{ 
            backgroundColor: activeTheme.codeBackground,
            boxShadow: settings.boxShadow ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
            minWidth: '400px',
            maxWidth: '900px'
          }}
        >
          <div className="p-4">
            {renderWindowControls()}
            
            <div className="font-mono-code leading-relaxed">
              <SyntaxHighlighter
                language={settings.language}
                style={prismStyle}
                showLineNumbers={settings.showLineNumbers}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  fontSize: `${settings.fontSize}px`,
                  background: 'transparent',
                }}
                lineNumberStyle={{
                  opacity: 0.3,
                  marginRight: '1rem',
                  fontSize: '0.8em'
                }}
              >
                {code || '// Paste your code here...'}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
