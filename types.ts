
export enum Language {
  Javascript = 'javascript',
  Typescript = 'typescript',
  Python = 'python',
  Java = 'java',
  Cpp = 'cpp',
  Csharp = 'csharp',
  Html = 'html',
  Css = 'css',
  Rust = 'rust',
  Go = 'go',
  Ruby = 'ruby',
  Swift = 'swift'
}

export interface AppTheme {
  id: string;
  name: string;
  background: string;
  codeBackground: string;
  textColor: string;
}

export interface SnippetSettings {
  language: Language;
  themeId: string;
  padding: number;
  fontSize: number;
  showLineNumbers: boolean;
  windowStyle: 'mac' | 'windows' | 'none';
  boxShadow: boolean;
  title: string;
}
