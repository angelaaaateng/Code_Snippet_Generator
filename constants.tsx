
import { AppTheme, Language } from './types';

export const THEMES: AppTheme[] = [
  {
    id: 'hyper',
    name: 'Hyper',
    background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    codeBackground: '#1d1f21',
    textColor: '#f8f8f2'
  },
  {
    id: 'ocean',
    name: 'Oceanic',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    codeBackground: '#011627',
    textColor: '#d6deeb'
  },
  {
    id: 'midnight',
    name: 'Midnight',
    background: 'linear-gradient(to right, #24243e, #302b63, #0f0c29)',
    codeBackground: '#0b0e14',
    textColor: '#abb2bf'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    background: 'linear-gradient(to right, #ff512f, #dd2476)',
    codeBackground: '#1a1a1a',
    textColor: '#e6e6e6'
  },
  {
    id: 'mint',
    name: 'Fresh Mint',
    background: 'linear-gradient(to right, #00b09b, #96c93d)',
    codeBackground: '#2b2b2b',
    textColor: '#f8f8f2'
  },
  {
    id: 'glass',
    name: 'Frosty Glass',
    background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    codeBackground: 'rgba(255, 255, 255, 0.1)',
    textColor: '#1f2937'
  },
  {
    id: 'candy',
    name: 'Cotton Candy',
    background: 'linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)',
    codeBackground: '#282a36',
    textColor: '#f8f8f2'
  }
];

export const LANGUAGES = [
  { label: 'JavaScript', value: Language.Javascript },
  { label: 'TypeScript', value: Language.Typescript },
  { label: 'Python', value: Language.Python },
  { label: 'Rust', value: Language.Rust },
  { label: 'Go', value: Language.Go },
  { label: 'HTML', value: Language.Html },
  { label: 'CSS', value: Language.Css },
  { label: 'C++', value: Language.Cpp },
  { label: 'Java', value: Language.Java },
  { label: 'C#', value: Language.Csharp },
];
