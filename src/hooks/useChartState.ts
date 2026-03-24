import { useState, useCallback, useEffect } from 'react';
import type { StatItem, ChartConfig, ChartMode } from '../types/chart';
import { DEFAULT_STATS } from '../types/chart';

const STORAGE_KEY = 'octagon-chart-state';

interface SavedState {
  title: string;
  stats: StatItem[];
  themeId: string;
  chartMode?: ChartMode;
}

function loadFromStorage(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data.stats) && data.stats.length > 0) return data;
  } catch { /* corrupt storage */ }
  return null;
}

export function useChartState() {
  const saved = loadFromStorage();

  const [title, setTitle] = useState(saved?.title ?? 'Character Stats');
  const [stats, setStats] = useState<StatItem[]>(saved?.stats ?? DEFAULT_STATS);
  const [themeId, setThemeId] = useState(saved?.themeId ?? 'clean-minimal');
  const [chartMode, setChartMode] = useState<ChartMode>(saved?.chartMode ?? 'octagon');

  const updateStat = useCallback((index: number, value: number) => {
    setStats(prev => prev.map((s, i) => i === index ? { ...s, value } : s));
  }, []);

  const updateLabel = useCallback((index: number, label: string) => {
    setStats(prev => prev.map((s, i) => i === index ? { ...s, label } : s));
  }, []);

  const loadConfig = useCallback((config: ChartConfig) => {
    if (Array.isArray(config.stats) && config.stats.length > 0) {
      setTitle(config.title);
      setStats(config.stats);
      if (config.themeId) setThemeId(config.themeId);
      if (config.chartMode) setChartMode(config.chartMode);
    }
  }, []);

  const getConfig = useCallback((): ChartConfig => ({
    version: 1,
    title,
    stats,
    themeId,
    chartMode,
  }), [title, stats, themeId, chartMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, stats, themeId, chartMode }));
  }, [title, stats, themeId, chartMode]);

  return {
    title, setTitle,
    stats, updateStat, updateLabel, setStats,
    themeId, setThemeId,
    chartMode, setChartMode,
    loadConfig, getConfig,
  };
}
