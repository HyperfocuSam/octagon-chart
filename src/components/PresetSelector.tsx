import { useState } from 'react';
import type { StatItem } from '../types/chart';
import type { Preset } from '../utils/presets';

interface PresetSelectorProps {
  presets: Preset[];
  onSelect: (stats: StatItem[]) => void;
  onSave: (name: string, stats: StatItem[]) => void;
  onDelete: (name: string) => void;
  isCustom: (name: string) => boolean;
  currentStats: StatItem[];
}

export function PresetSelector({ presets, onSelect, onSave, onDelete, isCustom, currentStats }: PresetSelectorProps) {
  const [showSave, setShowSave] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onSave(trimmed, currentStats);
    setNewName('');
    setShowSave(false);
  };

  return (
    <div className="preset-selector">
      <div className="preset-header">
        <label className="preset-label">Presets</label>
        <button
          className="preset-add-btn"
          onClick={() => setShowSave(!showSave)}
          title="Save current stats as preset"
        >
          {showSave ? '×' : '+'}
        </button>
      </div>

      {showSave && (
        <div className="preset-save-row">
          <input
            className="preset-save-input"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowSave(false); }}
            placeholder="Preset name..."
            maxLength={24}
            autoFocus
          />
          <button className="preset-save-confirm" onClick={handleSave}>Save</button>
        </div>
      )}

      <div className="preset-list">
        {presets.map(p => (
          <div key={p.name} className="preset-item">
            <button
              className="preset-btn"
              onClick={() => onSelect(p.stats)}
            >
              {p.name}
            </button>
            {isCustom(p.name) && (
              <button
                className="preset-delete-btn"
                onClick={() => onDelete(p.name)}
                title="Delete preset"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
