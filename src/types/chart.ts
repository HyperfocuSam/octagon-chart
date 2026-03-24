export interface StatItem {
  label: string;
  value: number;
}

export type ChartMode = 'octagon' | 'bar';

export interface ChartModeInfo {
  id: ChartMode;
  name: string;
  description: string;
  icon: string;
  requiredStats?: number; // undefined = any count
}

export const CHART_MODES: ChartModeInfo[] = [
  {
    id: 'octagon',
    name: 'Octagon',
    description: 'Radar chart with 8 axes',
    icon: '⬡',
    requiredStats: 8,
  },
  {
    id: 'bar',
    name: 'Ability Bars',
    description: 'Horizontal bar chart',
    icon: '▮',
  },
];

export interface ChartConfig {
  version: 1;
  title: string;
  stats: StatItem[];
  themeId: string;
  chartMode?: ChartMode;
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
