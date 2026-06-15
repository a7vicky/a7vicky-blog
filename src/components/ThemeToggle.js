'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      <span className="theme-icon">{theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}</span>
    </button>
  );
}
