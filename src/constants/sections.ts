import { files } from '../components/FileExplorer';

// Derived from FileExplorer.files — single source of truth for all section navigation
export const SECTION_ALIASES: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const f of files) {
    if (!f.section) continue;
    // "about.txt" → "about", "lab/" → "lab"
    map[f.name] = f.section;
    // bare name → section
    map[f.section] = f.section;
  }
  // Root aliases
  map['/'] = 'welcome';
  map['~'] = 'welcome';
  map['home'] = 'welcome';
  // Writing essay aliases (full path forms and short forms not auto-derived)
  map['writing/essays'] = 'writing';
  map['writing/essays/'] = 'writing';
  map['writing/tech-articles'] = 'writing';
  map['writing/tech-articles/'] = 'writing';
  map['writing/essays/on-running-for-nothing'] = 'writing-essays-on-running-for-nothing';
  map['writing/essays/on-running-for-nothing.md'] = 'writing-essays-on-running-for-nothing';
  map['writing/essays/on-running-for-nothing-bn'] = 'writing-essays-on-running-for-nothing-bn';
  map['writing/essays/on-running-for-nothing-bn.md'] = 'writing-essays-on-running-for-nothing-bn';
  map['on-running-for-nothing'] = 'writing-essays-on-running-for-nothing';
  map['writing/essays/on-staying-small'] = 'writing-essays-on-staying-small';
  map['writing/essays/on-staying-small.md'] = 'writing-essays-on-staying-small';
  map['on-staying-small'] = 'writing-essays-on-staying-small';
  map['writing/essays/on-forgetting'] = 'writing-essays-on-forgetting';
  map['writing/essays/on-forgetting.md'] = 'writing-essays-on-forgetting';
  map['on-forgetting'] = 'writing-essays-on-forgetting';
  return map;
})();

export type SectionId = string;
