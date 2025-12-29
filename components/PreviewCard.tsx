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
         <div className="mb-2 text-xs font-medium text-center opacity-40 select-none pb-2 border-b border-white/5">
           {settings.title}
         </div>
       ) : null;
    }
    
    if (settings.windowStyle === 'mac') {
      return (
        <div className="flex items-center justify-between mb-6 relative">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
          </div>
          {settings.title && (
            <div className="absolute left-1/2 -translate-x-1/2 text-[12px] font-medium opacity-50 select-none whitespace-nowrap">
              {settings.title}
            </div>
          )}
          <div className="w-12"></div>
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-between mb-6">
        {settings.title && (
          <div className="text-[12px] font-medium opacity-50 select-none whitespace-nowrap">
            {settings.title}
          </div>
        )}
        {!settings.title && <div />}
        <div className="flex gap-4 opacity-70">
          <div className="w-3 h-0.5 bg-slate-400 mt-2"></div>
          <div className="w-3.5 h-3.5 border-2 border-slate-400"></div>
          <div className="w-3.5 h-3.5 text-slate-400 text-[10px] flex items-center justify-center font-bold">✕</div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="inline-block overflow-visible"
      style={{ 
        background: activeTheme.background,
        padding: 0,
        margin: 0
      }}
    >
      <div 
        ref={cardRef}
        className="relative overflow-visible inline-block"
        style={{ 
          padding: `${settings.padding}px`,
          background: activeTheme.background,
          width: 'max-content',
          height: 'max-content'
        }}
      >
        <div 
          className="rounded-xl border border-white/10 selection:bg-blue-500/40 selection:text-white inline-block"
          style={{ 
            backgroundColor: activeTheme.codeBackground,
            boxShadow: settings.boxShadow ? '0 50px 100px -20px rgba(0, 0, 0, 0.6)' : 'none',
            minWidth: '400px',
            width: 'max-content',
            overflow: 'visible'
          }}
        >
          <div className="p-8 relative overflow-visible">
            {renderWindowHeader()}
            
            <div className="font-mono-code leading-relaxed overflow-visible">
              <SyntaxHighlighter
                language={settings.language}
                style={prismStyle}
                showLineNumbers={settings.showLineNumbers}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  fontSize: `${settings.fontSize}px`,
                  background: 'transparent',
                  overflow: 'visible',
                  whiteSpace: 'pre',
                  wordSpacing: 'normal',
                  wordBreak: 'normal',
                  minWidth: '100%',
                }}
                lineNumberStyle={{
                  opacity: 0.2,
                  marginRight: '2rem',
                  fontSize: '0.9em',
                  userSelect: 'none',
                  minWidth: '2.5em',
