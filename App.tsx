
import React, { useState, useRef } from 'react';
import { toBlob, toPng, toSvg } from 'html-to-image';
import { 
  Download, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  Info,
  ExternalLink,
  ChevronRight,
  Code,
  FileCode,
  Share2,
  Type
} from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import PreviewCard from './components/PreviewCard';
import { SnippetSettings, Language } from './types';
import { detectLanguageAndPolish, explainCode } from './services/geminiService';

const DEFAULT_CODE = `function highlightableCode() {
  // Use High-Quality PNG for Medium articles
  const message = "Copy me from the image creator";
  console.log(message);
}

highlightableCode();`;

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
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success'>('idle');

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `${settings.title || 'snippet'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG Download failed', err);
    }
  };

  const handleDownloadSvg = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toSvg(cardRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `${settings.title || 'snippet'}-${Date.now()}.svg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('SVG Download failed', err);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!cardRef.current) return;
    setCopyStatus('copying');
    try {
      const blob = await toBlob(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopyStatus('success');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    } catch (err) {
      console.error('Copy failed', err);
      setCopyStatus('idle');
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
              Code Snippet Creator
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">High-Fidelity Assets</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAIPolish}
            disabled={isPolishing}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50"
            title="Polish with AI"
          >
            {isPolishing ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span className="hidden sm:inline">AI Polish</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-800 mx-1" />

          <button 
            onClick={handleCopyToClipboard}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium border ${
              copyStatus === 'success' 
              ? 'bg-green-600/20 border-green-500 text-green-400' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {copyStatus === 'copying' ? <RefreshCw className="animate-spin" size={16} /> : <Copy size={16} />}
            <span className="hidden sm:inline">{copyStatus === 'success' ? 'Copied!' : 'Copy Image'}</span>
          </button>

          <div className="flex bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <button 
              onClick={handleDownloadPng}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-slate-200 transition-all text-sm font-medium border-r border-slate-700"
              title="Download High-Res PNG (Best for Medium)"
            >
              <Download size={16} />
              <span className="hidden sm:inline">PNG (High-Res)</span>
            </button>
            <button 
              onClick={handleDownloadSvg}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 text-blue-400 transition-all text-sm font-medium"
              title="Download SVG (Vector format)"
            >
              <FileCode size={16} />
              <span className="hidden sm:inline">SVG</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Controls */}
        <aside className="w-80 h-full border-r border-slate-800 bg-slate-950/30 overflow-hidden hidden lg:block">
          <ControlPanel settings={settings} setSettings={setSettings} />
        </aside>

        {/* Center: Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0b0e14] to-[#0b0e14]">
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
            
            {/* AI Explanation Box */}
            {showExplanation && (
              <div className="w-full max-w-4xl mb-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-4 duration-500 relative">
                <button 
                  onClick={() => setShowExplanation(false)}
                  className="absolute top-2 right-2 text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
                <div className="flex gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-full h-fit">
                    <Info size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-1 flex items-center gap-2">
                      AI Explanation
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {isExplaining ? 'Thinking...' : explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Title Input Area */}
            <div className="w-full max-w-4xl mb-4 group">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                <ChevronRight size={14} /> Snippet Title
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-600">
                  <Type size={14} />
                </div>
                <input 
                  type="text"
                  value={settings.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. main.js, styles.css"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Code Input Area */}
            <div className="w-full max-w-4xl mb-8 group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ChevronRight size={14} /> Source Input
                </span>
                <button 
                  onClick={handleAIExplain}
                  className="text-xs font-medium text-slate-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles size={12} /> Explain with AI
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-48 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 font-mono-code text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none shadow-inner"
                placeholder="Paste your source code here..."
              />
            </div>

            {/* Live Preview Container */}
            <div className="w-full flex flex-col items-center">
               <div className="flex items-center justify-between mb-4 self-start max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  <ChevronRight size={14} /> Preview
                </div>
                <div className="flex items-center gap-2 text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  <Share2 size={10} /> ASSET READY
                </div>
              </div>
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <PreviewCard code={code} settings={settings} cardRef={cardRef} />
              </div>
              <p className="mt-4 text-[10px] text-slate-500 text-center max-w-md">
                Tip: Use <b>High-Res PNG</b> for platforms like Medium. Our PNG exports are rendered at 3x resolution for crystal clear quality.
              </p>
            </div>
            
            <div className="mt-12 text-slate-600 text-xs flex items-center gap-6 pb-8">
              <span className="flex items-center gap-1 cursor-default">
                <ExternalLink size={12} /> Powered by Gemini
              </span>
              <span className="flex items-center gap-1 cursor-default">
                <Download size={12} /> 3x Supersampling
              </span>
              <span className="flex items-center gap-1 cursor-default">
                <Copy size={12} /> Clipboard API
              </span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Disclaimer */}
      <div className="lg:hidden fixed inset-0 bg-slate-950 z-[100] flex items-center justify-center p-8 text-center">
        <div>
          <Code size={48} className="text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Desktop View Recommended</h2>
          <p className="text-slate-400">Code Snippet Creator is designed for precision code visualization. Please visit on a larger screen to use the full suite of customization tools.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
