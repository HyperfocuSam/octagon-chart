import { useState, useCallback, useEffect } from 'react';
import type { StatItem, ChartConfig } from '../types/chart';
import { DEFAULT_STATS } from '../types/chart';

const STORAGE_KEY = 'octagon-chart-state';

function loadFromStorage(): { title: string; stats: StatItem[]; themeId: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data.stats?.length === 8) return data;
  } catch { /* ignore */ }
  return null;
}

export function useChartState() {
  const saved = loadFromStorage();

  const [title, setTitle] = useState(saved?.title ?? 'Character Stats');
  const [stats, setStats] = useState<StatItem[]>(saved?.stats ?? DEFAULT_STATS);
  const [themeId, setThemeId] = useState(saved?.themeId ?? 'clean-minimal');

  const updateStat = useCallback((index: number, value: number) => {
    setStats(prev => prev.map((s, i) => i === index ? { ...s, value } : s));
  }, []);

  const updateLabel = useCallback((index: number, label: string) => {
    setStats(prev => prev.map((s, i) => i === index ? { ...s, label } : s));
  }, []);

  const loadConfig = useCallback((config: ChartConfig) => {
    if (config.stats?.length === 8) {
      setTitle(config.title);
      setStats(config.stats);
      if (config.themeId) setThemeId(config.themeId);
    }
  }, []);

  const getConfig = useCallback((): ChartConfig => ({
    version: 1,
    title,
    stats,
    themeId,
  }), [title, stats, themeId]);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, stats, themeId }));
  }, [title, stats, themeId]);

  return {
    title,
    setTitle,
    stats,
    updateStat,
    updateLabel,
    setStats,
    themeId,
    setThemeId,
    loadConfig,
    getConfig,
  };
}
