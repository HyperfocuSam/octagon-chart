import { useState, useRef, useEffect } from 'react';

interface StatRowProps {
  label: string;
  value: number;
  index: number;
  onValueChange: (index: number, value: number) => void;
  onLabelChange: (index: number, label: string) => void;
  onRemove?: (index: number) => void;
  accentColor: string;
}

export function StatRow({ label, value, index, onValueChange, onLabelChange, onRemove, accentColor }: StatRowProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitLabel = () => {
    const trimmed = editValue.trim();
    if (trimmed) onLabelChange(index, trimmed);
    else setEditValue(label);
    setEditing(false);
  };

  return (
    <div className="stat-row">
      <div className="stat-label-wrap">
        <span className="stat-index">{String(index + 1).padStart(2, '0')}</span>
        {editing ? (
          <input
            ref={inputRef}
            className="stat-label-input"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={commitLabel}
            onKeyDown={e => { if (e.key === 'Enter') commitLabel(); if (e.key === 'Escape') { setEditValue(label); setEditing(false); } }}
            maxLength={16}
          />
        ) : (
          <button
            className="stat-label-btn"
            onClick={() => { setEditValue(label); setEditing(true); }}
            title="Click to rename"
          >
            {label}
          </button>
        )}
      </div>
      <div className="stat-slider-wrap">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={e => onValueChange(index, Number(e.target.value))}
          className="stat-slider"
          style={{
            '--slider-accent': accentColor,
            '--slider-pct': `${value}%`,
          } as React.CSSProperties}
        />
        <span className="stat-value">{value}</span>
      </div>
      {onRemove && (
        <button
          className="stat-remove-btn"
          onClick={() => onRemove(index)}
          title="Remove stat"
        >
          ×
        </button>
      )}
    </div>
  );
}
