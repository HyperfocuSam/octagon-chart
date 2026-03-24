import { useState, useEffect, useRef } from 'react';
import type { ChartMode } from '../types/chart';
import { CHART_MODES } from '../types/chart';

interface ChartModeMenuProps {
  currentMode: ChartMode;
  onSelect: (mode: ChartMode) => void;
}

export function ChartModeMenu({ currentMode, onSelect }: ChartModeMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const current = CHART_MODES.find(m => m.id === currentMode) ?? CHART_MODES[0];

  return (
    <div className="mode-menu" ref={menuRef}>
      <button
        className="mode-menu-trigger"
        onClick={() => setOpen(!open)}
        title="Switch chart type"
      >
        <span className="mode-menu-hamburger">☰</span>
        <span className="mode-menu-title">{current.icon} {current.name}</span>
      </button>

      {open && (
        <div className="mode-menu-dropdown">
          {CHART_MODES.map(mode => (
            <button
              key={mode.id}
              className={`mode-menu-item ${mode.id === currentMode ? 'active' : ''}`}
              onClick={() => { onSelect(mode.id); setOpen(false); }}
            >
              <span className="mode-item-icon">{mode.icon}</span>
              <div className="mode-item-text">
                <span className="mode-item-name">{mode.name}</span>
                <span className="mode-item-desc">{mode.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
