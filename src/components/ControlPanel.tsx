import type { StatItem, ChartMode } from '../types/chart';
import type { ChartTheme } from '../types/theme';
import type { Preset } from '../utils/presets';
import { StatRow } from './StatRow';
import { PresetSelector } from './PresetSelector';

const MIN_STATS = 2;
const MAX_STATS = 10;

interface ControlPanelProps {
  title: string;
  onTitleChange: (title: string) => void;
  stats: StatItem[];
  onValueChange: (index: number, value: number) => void;
  onLabelChange: (index: number, label: string) => void;
  onPresetSelect: (stats: StatItem[]) => void;
  onPresetSave: (name: string, stats: StatItem[]) => void;
  onPresetDelete: (name: string) => void;
  presets: Preset[];
  isCustomPreset: (name: string) => boolean;
  theme: ChartTheme;
  chartMode: ChartMode;
  onAddStat: () => void;
  onRemoveStat: (index: number) => void;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
}

export function ControlPanel({
  title,
  onTitleChange,
  stats,
  onValueChange,
  onLabelChange,
  onPresetSelect,
  onPresetSave,
  onPresetDelete,
  presets,
  isCustomPreset,
  theme,
  chartMode,
  onAddStat,
  onRemoveStat,
  hoveredIndex,
  onHoverIndex,
}: ControlPanelProps) {
  const canAdd = chartMode !== 'octagon' && stats.length < MAX_STATS;
  const canRemove = chartMode !== 'octagon' && stats.length > MIN_STATS;

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

      <PresetSelector
        presets={presets}
        onSelect={onPresetSelect}
        onSave={onPresetSave}
        onDelete={onPresetDelete}
        isCustom={isCustomPreset}
        currentStats={stats}
      />

      <div className="panel-section">
        <div className="stats-header">
          <label className="panel-label">Stats ({stats.length})</label>
          {canAdd && (
            <button className="stat-add-btn" onClick={onAddStat} title="Add stat">
              +
            </button>
          )}
        </div>
        <div className="stats-list">
          {stats.map((stat, i) => (
            <StatRow
              key={i}
              index={i}
              label={stat.label}
              value={stat.value}
              onValueChange={onValueChange}
              onLabelChange={onLabelChange}
              onRemove={canRemove ? onRemoveStat : undefined}
              accentColor={theme.ui.accent}
              highlighted={hoveredIndex === i}
              onMouseEnter={() => onHoverIndex(i)}
              onMouseLeave={() => onHoverIndex(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
