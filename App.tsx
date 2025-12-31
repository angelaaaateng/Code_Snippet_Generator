import React, { useState, useRef, useEffect } from 'react';
import { toBlob, toPng } from 'html-to-image';
import { 
  Download, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  Info,
  ExternalLink,
  ChevronRight,
  Code,
  Share2,
  Type,
  ClipboardCheck,
  Link as LinkIcon,
  // Fix: Add missing Settings2 icon import
  Settings2
} from 'lucide-react';
import ControlPanel from './components/ControlPanel.tsx';
import PreviewCard from './components/PreviewCard.tsx';
import { SnippetSettings, Language } from './types.ts';
import { detectLanguageAndPolish, explainCode } from './services/geminiService.ts';

const DEFAULT_CODE = `function highlightableCode() {
  // Use High-Quality PNG for Medium articles
  const message = "Copy me from the image creator 🚀";
  console.log(message);
}

highlightableCode();`;

// Unicode-safe base64 helpers
const toBase64 = (str: string) => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
  } catch (e) {
    return '';
  }
};

const fromBase64 = (str: string) => {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
  } catch (e) {
    return DEFAULT_CODE;
  }
};

const App: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [settings, setSettings] = useState<SnippetSettings>({
    language: Language.Javascript,
    themeId: 'hyper',
    padding: 64,
    fontSize: 16,
    showLineNumbers: true,
    windowStyle: 'mac',
    boxShadow: true,
    title: 'main.js'
  });
  
  const [isPolishing, setIsPolishing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [copyImageStatus, setCopyImageStatus] = useState<'idle' | 'copying' | 'success'>('idle');
  const [copyTextStatus, setCopyTextStatus] = useState<'idle' | 'success'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'success'>('idle');

  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize from URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const params = new URLSearchParams(hash);
        const encodedCode = params.get('code');
        const title = params.get('title');
        const language = params.get('language');
        
        if (encodedCode) {
          const decoded = fromBase64(encodedCode);
          if (decoded) setCode(decoded);
        }
        if (title || language) {
          setSettings(prev => ({
            ...prev,
            title: title || prev.title,
            language: (language as Language) || prev.language
          }));
        }
      } catch (e) {
        console.warn("Failed to parse URL state", e);
      }
    }
  }, []);

  // Update URL on changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const params = new URLSearchParams();
        const encoded = toBase64(code);
        if (encoded) {
          params.set('code', encoded);
          params.set('title', settings.title);
          params.set('language', settings.language);
          window.history.replaceState(null, '', `#${params.toString()}`);
        }
      } catch (e) {
        console.warn("Failed to update URL state", e);
      }
    }, 800);
    return () => clearTimeout(timeout);
  }, [code, settings.title, settings.language]);

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3,
        style: { transform: 'scale(1)' }
      });
      const link = document.createElement('a');
      link.download = `${settings.title || 'snippet'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG Download failed', err);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!cardRef.current) return;
    setCopyImageStatus('copying');
    try {
      const blob = await toBlob(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopyImageStatus('success');
        setTimeout(() => setCopyImageStatus('idle'), 2000);
      }
    } catch (err) {
      console.error('Copy failed', err);
      setCopyImageStatus('idle');
      alert('Failed to copy image to clipboard. Try downloading instead.');
    }
  };

  const handleCopyCodeText = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyTextStatus('success');
      setTimeout(() => setCopyTextStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus('success');
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to share link', err);
    }
  };

  const handleAIPolish = async () => {
    setIsPolishing(true);
    try {
      const { language, polishedCode } = await detectLanguageAndPolish(code);
      setCode(polishedCode);
      setSettings(prev => ({ ...prev, language: language as Language }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAIExplain = async () => {
    setIsExplaining(true);
    setShowExplanation(true);
    try {
      const desc = await explainCode(code);
      setExplanation(desc);
    } catch (err) {
      console.error(err);
      setExplanation('Failed to generate explanation.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, title: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-200">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Code size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-none">
              CodeSnap Pro
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5 whitespace-nowrap">High-Res Snippet Studio</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleShareLink}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium border ${
              shareStatus === 'success' 
              ? 'bg-purple-600/20 border-purple-500 text-purple-400' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {shareStatus === 'success' ? <ClipboardCheck size={16} /> : <LinkIcon size={16} />}
            <span className="hidden sm:inline">{shareStatus === 'success' ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button 
            onClick={handleAIPolish}
            disabled={isPolishing}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50"
          >
            {isPolishing ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span className="hidden sm:inline">AI Polish</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden xs:block" />

          <button 
            onClick={handleCopyToClipboard}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium border ${
              copyImageStatus === 'success' 
              ? 'bg-green-600/20 border-green-500 text-green-400' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {copyImageStatus === 'copying' ? <RefreshCw className="animate-spin" size={16} /> : <Copy size={16} />}
            <span className="hidden sm:inline">Copy Image</span>
          </button>

          <button 
            onClick={handleDownloadPng}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-blue-600/20"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download PNG</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 h-full border-r border-slate-800 bg-slate-950/30 overflow-y-auto hidden lg:block scroll-smooth">
          <ControlPanel settings={settings} setSettings={setSettings} />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0b0e14] to-[#0b0e14]">
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
            
            {showExplanation && (
              <div className="w-full max-w-4xl mb-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-4 relative">
                <button onClick={() => setShowExplanation(false)} className="absolute top-2 right-2 text-slate-500 hover:text-slate-300">✕</button>
                <div className="flex gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-full h-fit"><Info size={18} className="text-blue-400" /></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-400 mb-1">AI Explanation</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{isExplaining ? 'Thinking...' : explanation}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full max-w-4xl mb-4 group">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                <ChevronRight size={14} className="text-blue-500" /> Snippet Title
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-600"><Type size={14} /></div>
                <input 
                  type="text"
                  value={settings.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Building AI Agents with Swarm"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="w-full max-w-4xl mb-8 group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ChevronRight size={14} className="text-blue-500" /> Source Input
                </span>
                <button onClick={handleAIExplain} className="text-[10px] font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest">
                  <Sparkles size={12} /> Explain Code
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono-code text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all resize-none shadow-inner"
                placeholder="Paste your source code here..."
              />
            </div>

            <div className="w-full flex flex-col items-center">
               <div className="flex items-center justify-between mb-4 self-start max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <ChevronRight size={14} className="text-blue-500" /> Preview
                </div>
                <button 
                   onClick={handleCopyCodeText}
                   className="text-[10px] font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                >
                   {copyTextStatus === 'success' ? <ClipboardCheck size={12} /> : <Copy size={12} />}
                   {copyTextStatus === 'success' ? 'Copied!' : 'Copy Source'}
                </button>
              </div>
              
              <div className="w-full max-w-full overflow-x-auto overflow-y-hidden pb-12 flex justify-center">
                <div className="inline-block shadow-[0_0_80px_-15px_rgba(0,0,0,0.4)] rounded-2xl">
                  <PreviewCard code={code} settings={settings} cardRef={cardRef} />
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-slate-600 text-[10px] flex items-center gap-8 pb-12 font-medium uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><ExternalLink size={12} /> Gemini Powered</span>
              <span className="flex items-center gap-1.5"><Share2 size={12} /> URL Persistent</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Control Toggle (Simulated) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button className="p-4 bg-blue-600 rounded-full shadow-xl shadow-blue-500/40 text-white">
            <Settings2 size={24} />
          </button>
      </div>
    </div>
  );
};

export default App;