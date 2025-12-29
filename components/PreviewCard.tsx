
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

  const renderWindowHeader = () => {
    if (settings.windowStyle === 'none') {
       return settings.title ? (
         <div className="mb-2 text-xs font-medium text-center opacity-40 select-none">
           {settings.title}
         </div>
       ) : null;
    }
    
    if (settings.windowStyle === 'mac') {
      return (
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {settings.title && (
            <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium opacity-50 select-none truncate max-w-[50%]">
              {settings.title}
            </div>
          )}
          <div className="w-12"></div> {/* Spacer for symmetry */}
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-between mb-4">
        {settings.title && (
          <div className="text-[11px] font-medium opacity-50 select-none truncate max-w-[70%]">
            {settings.title}
          </div>
        )}
        {!settings.title && <div />}
        <div className="flex gap-3 opacity-70">
          <div className="w-3 h-0.5 bg-slate-400 mt-2"></div>
          <div className="w-3 h-3 border-2 border-slate-400"></div>
          <div className="w-3 h-3 text-slate-400 text-[8px] flex items-center justify-center font-bold">✕</div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="flex items-center justify-center min-h-[400px] overflow-hidden rounded-lg p-10"
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
          className={`overflow-hidden rounded-xl border border-white/10 transition-shadow duration-500 selection:bg-blue-500/40 selection:text-white`}
          style={{ 
            backgroundColor: activeTheme.codeBackground,
            boxShadow: settings.boxShadow ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
            minWidth: '400px',
            maxWidth: '1000px'
          }}
        >
          <div className="p-4 relative">
            {renderWindowHeader()}
            
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
                  fontSize: '0.8em',
                  userSelect: 'none'
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
