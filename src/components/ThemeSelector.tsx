import type { ChartTheme } from '../types/theme';
import { themeList } from '../themes';
import { ThemePreview } from './ThemePreview';

interface ThemeSelectorProps {
  currentThemeId: string;
  onSelect: (themeId: string) => void;
}

export function ThemeSelector({ currentThemeId, onSelect }: ThemeSelectorProps) {
  return (
    <div className="theme-selector">
      <span className="theme-selector-label">Theme</span>
      <div className="theme-selector-list">
        {themeList.map((theme: ChartTheme) => (
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
