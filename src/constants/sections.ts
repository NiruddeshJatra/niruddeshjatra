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
  map['writing/on-running-for-nothing.md'] = 'writing/on-running-for-nothing';
  map['on-running-for-nothing'] = 'writing/on-running-for-nothing';
  map['writing/on-running-for-nothing-bn'] = 'writing/on-running-for-nothing-bn';
  map['writing/on-running-for-nothing-bn.md'] = 'writing/on-running-for-nothing-bn';
  return map;
})();

export type SectionId = string;
