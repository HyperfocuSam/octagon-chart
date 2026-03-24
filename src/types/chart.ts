export interface StatItem {
  label: string;
  value: number;
}

export interface ChartConfig {
  version: 1;
  title: string;
  stats: StatItem[];
  themeId: string;
}

export const DEFAULT_STATS: StatItem[] = [
  { label: 'STR', value: 70 },
  { label: 'DEX', value: 55 },
  { label: 'CON', value: 80 },
  { label: 'INT', value: 60 },
  { label: 'WIS', value: 45 },
  { label: 'CHA', value: 65 },
  { label: 'SPD', value: 50 },
  { label: 'LCK', value: 40 },
];
