
import React, { useState, useRef, useCallback } from 'react';
import { toBlob, toPng } from 'html-to-image';
import { 
  Download, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  Info,
  ExternalLink,
  ChevronRight,
  Code
} from 'lucide-react';
import ControlPanel from './components/ControlPanel';
import PreviewCard from './components/PreviewCard';
import { SnippetSettings, Language } from './types';
import { detectLanguageAndPolish, explainCode } from './services/geminiService';

const DEFAULT_CODE = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

// Click AI Polish to enhance this code
greet('CodeSnap Pro User');`;

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
    title: 'New Snippet'
  });
  const [isPolishing, setIsPolishing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `codesnap-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!cardRef.current) return;
    try {
      const blob = await toBlob(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Image copied to clipboard!');
      }
    } catch (err) {
      console.error('Copy failed', err);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-200">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            