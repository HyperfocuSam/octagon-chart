import { presets } from '../utils/presets';
import type { StatItem } from '../types/chart';

interface PresetSelectorProps {
  onSelect: (stats: StatItem[]) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div className="preset-selector">
      <label className="preset-label">Presets</label>
      <div className="preset-list">
        {presets.map(p => (
          <button
            key={p.name}
            className="preset-btn"
            onClick={() => onSelect(p.stats)}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
