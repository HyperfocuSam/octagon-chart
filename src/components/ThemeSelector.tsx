import type { ChartTheme } from '../types/theme';
import { themeList } from '../themes';
import { ThemePreview } from './ThemePreview';

interface ThemeSelectorProps {
  currentThemeId: string;
  onSelect: (themeId: string) => void;
  customImageTheme: ChartTheme | null;
}

export function ThemeSelector({ currentThemeId, onSelect, customImageTheme }: ThemeSelectorProps) {
  const allThemes = customImageTheme ? [...themeList, customImageTheme] : themeList;

  return (
    <div className="theme-selector">
      <span className="theme-selector-label">Theme</span>
      <div className="theme-selector-list">
        {allThemes.map((theme: ChartTheme) => (
          <ThemePreview
            key={theme.id}
            theme={theme}
            active={theme.id === currentThemeId}
            onClick={() => onSelect(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}
