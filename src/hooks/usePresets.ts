import { useState, useCallback, useEffect } from 'react';
import type { StatItem } from '../types/chart';
import { presets as builtInPresets, type Preset } from '../utils/presets';

const STORAGE_KEY = 'octagon-chart-custom-presets';

function loadCustomPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function usePresets() {
  const [customPresets, setCustomPresets] = useState<Preset[]>(loadCustomPresets);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
  }, [customPresets]);

  const allPresets = [...builtInPresets, ...customPresets];

  const savePreset = useCallback((name: string, stats: StatItem[]) => {
    const preset: Preset = { name, stats: stats.map(s => ({ ...s })) };
    setCustomPresets(prev => {
      const existing = prev.findIndex(p => p.name === name);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = preset;
        return updated;
      }
      return [...prev, preset];
    });
  }, []);

  const deletePreset = useCallback((name: string) => {
    setCustomPresets(prev => prev.filter(p => p.name !== name));
  }, []);

  const isCustom = useCallback((name: string) => {
    return customPresets.some(p => p.name === name);
  }, [customPresets]);

  return { allPresets, savePreset, deletePreset, isCustom };
}
