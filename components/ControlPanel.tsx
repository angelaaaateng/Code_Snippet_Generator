import React from 'react';
import { SnippetSettings, Language } from '../types.ts';
import { THEMES, LANGUAGES } from '../constants.tsx';
import { 
  Monitor, 
  Type, 
  Layers, 
  Settings2, 
  Code2, 
  Palette,
  Maximize2,
  List
} from 'lucide-react';

interface ControlPanelProps {
  settings: SnippetSettings;
  setSettings: React.Dispatch<React.SetStateAction<SnippetSettings>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, setSettings }) => {
  const updateSetting = <K extends keyof SnippetSettings>(key: K, value: SnippetSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-8 h-full overflow-y-auto">
      <div className="flex items-center gap-2 text-blue-400 font-semibold text-lg border-b border-slate-800 pb-4">
        <Settings2 size={20} />
        <h2>Customization</h2>
      </div>

      {/* Language Selection */}
      <section className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Code2 size={16} /> Language
        </label>
        <select 
          value={settings.language}
          onChange={(e) => updateSetting('language', e.target.value as Language)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>{lang.label}</option>
          ))}
        </select>
      </section>

      {/* Theme Selection */}
      <section className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Palette size={16} /> Theme
        </label>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => updateSetting('themeId', t.id)}
              className={`text-xs p-2 rounded-lg border transition-all ${
                settings.themeId === t.id 
                ? 'border-blue-500 bg-blue-500/10 text-blue-200' 
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>

      {/* Window Style */}
      <section className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Monitor size={16} /> Window Style
        </label>
        <div className="flex gap-2">
          {(['mac', 'windows', 'none'] as const).map(style => (
            <button
              key={style}
              onClick={() => updateSetting('windowStyle', style)}
              className={`flex-1 text-xs py-2 rounded-lg capitalize border transition-all ${
                settings.windowStyle === style 
                ? 'border-blue-500 bg-blue-500/10 text-blue-200' 
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </section>

      {/* Sliders */}
      <div className="space-y-6">
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Maximize2 size={16} /> Padding
            </label>
            <span className="text-xs text-slate-500">{settings.padding}px</span>
          </div>
          <input 
            type="range" min="16" max="128" step="8"
            value={settings.padding}
            onChange={(e) => updateSetting('padding', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </section>

        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <Type size={16} /> Font Size
            </label>
            <span className="text-xs text-slate-500">{settings.fontSize}px</span>
          </div>
          <input 
            type="range" min="12" max="24" step="1"
            value={settings.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </section>
      </div>

      {/* Toggles */}
      <section className="space-y-3 pt-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-slate-300">
            <List size={16} /> Line Numbers
          </span>
          <input 
            type="checkbox" 
            checked={settings.showLineNumbers}
            onChange={(e) => updateSetting('showLineNumbers', e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
          />
        </label>
        
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-slate-300">
            <Layers size={16} /> Box Shadow
          </span>
          <input 
            type="checkbox" 
            checked={settings.boxShadow}
            onChange={(e) => updateSetting('boxShadow', e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
          />
        </label>
      </section>
    </div>
  );
};

export default ControlPanel;