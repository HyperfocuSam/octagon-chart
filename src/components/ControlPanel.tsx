import type { StatItem } from '../types/chart';
import type { ChartTheme } from '../types/theme';
import { StatRow } from './StatRow';
import { PresetSelector } from './PresetSelector';

interface ControlPanelProps {
  title: string;
  onTitleChange: (title: string) => void;
  stats: StatItem[];
  onValueChange: (index: number, value: number) => void;
  onLabelChange: (index: number, label: string) => void;
  onPresetSelect: (stats: StatItem[]) => void;
  theme: ChartTheme;
}

export function ControlPanel({
  title,
  onTitleChange,
  stats,
  onValueChange,
  onLabelChange,
  onPresetSelect,
  theme,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="panel-section">
        <label className="panel-label">Title</label>
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Character name..."
          maxLength={40}
        />
      </div>

      <PresetSelector onSelect={onPresetSelect} />

      <div className="panel-section">
        <label className="panel-label">Stats</label>
        <div className="stats-list">
          {stats.map((stat, i) => (
            <StatRow
              key={i}
              index={i}
              label={stat.label}
              value={stat.value}
              onValueChange={onValueChange}
              onLabelChange={onLabelChange}
              accentColor={theme.ui.accent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
