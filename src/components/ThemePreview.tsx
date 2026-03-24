import type { ChartTheme } from '../types/theme';
import { getGridPolygon, getPolygonPoints } from '../utils/geometry';

interface ThemePreviewProps {
  theme: ChartTheme;
  active: boolean;
  onClick: () => void;
}

const PREVIEW_SIZE = 48;
const CX = PREVIEW_SIZE / 2;
const CY = PREVIEW_SIZE / 2;
const RADIUS = 16;
const SAMPLE_VALUES = [80, 55, 70, 60, 45, 75, 50, 65];

export function ThemePreview({ theme, active, onClick }: ThemePreviewProps) {
  const { chart } = theme;

  return (
    <button
      className="theme-preview-btn"
      onClick={onClick}
      title={theme.name}
      style={{
        background: chart.background,
        borderColor: active ? theme.ui.accent : theme.ui.panelBorder,
        boxShadow: active ? `0 0 0 2px ${theme.ui.accent}40` : 'none',
      }}
    >
      <svg width={PREVIEW_SIZE} height={PREVIEW_SIZE} viewBox={`0 0 ${PREVIEW_SIZE} ${PREVIEW_SIZE}`}>
        <polygon
          points={getGridPolygon(CX, CY, RADIUS)}
          fill="none"
          stroke={chart.gridLines}
          strokeWidth={0.5}
        />
        <polygon
          points={getPolygonPoints(CX, CY, RADIUS, SAMPLE_VALUES)}
          fill={chart.fillColor}
          fillOpacity={chart.fillOpacity}
          stroke={chart.strokeColor}
          strokeWidth={1}
        />
      </svg>
      <span
        className="theme-preview-name"
        style={{ color: active ? theme.ui.accent : theme.ui.textSecondary }}
      >
        {theme.name}
      </span>
    </button>
  );
}
