import type { StatItem } from '../types/chart';

export interface Preset {
  name: string;
  stats: StatItem[];
}

export const presets: Preset[] = [
  {
    name: 'RPG Character',
    stats: [
      { label: 'STR', value: 70 },
      { label: 'DEX', value: 55 },
      { label: 'CON', value: 80 },
      { label: 'INT', value: 60 },
      { label: 'WIS', value: 45 },
      { label: 'CHA', value: 65 },
      { label: 'SPD', value: 50 },
      { label: 'LCK', value: 40 },
    ],
  },
  {
    name: 'Sports Athlete',
    stats: [
      { label: 'Speed', value: 75 },
      { label: 'Power', value: 80 },
      { label: 'Stamina', value: 70 },
      { label: 'Agility', value: 65 },
      { label: 'Technique', value: 55 },
      { label: 'Defense', value: 60 },
      { label: 'Mental', value: 50 },
      { label: 'Teamwork', value: 85 },
    ],
  },
  {
    name: 'Developer Skills',
    stats: [
      { label: 'Frontend', value: 80 },
      { label: 'Backend', value: 70 },
      { label: 'DevOps', value: 45 },
      { label: 'Design', value: 55 },
      { label: 'Testing', value: 50 },
      { label: 'Security', value: 40 },
      { label: 'Data', value: 60 },
      { label: 'Comms', value: 75 },
    ],
  },
  {
    name: 'Business Profile',
    stats: [
      { label: 'Strategy', value: 85 },
      { label: 'Sales', value: 70 },
      { label: 'Marketing', value: 65 },
      { label: 'Finance', value: 50 },
      { label: 'Ops', value: 60 },
      { label: 'Tech', value: 75 },
      { label: 'People', value: 80 },
      { label: 'Vision', value: 90 },
    ],
  },
  {
    name: 'Blank Canvas',
    stats: [
      { label: 'Stat 1', value: 50 },
      { label: 'Stat 2', value: 50 },
      { label: 'Stat 3', value: 50 },
      { label: 'Stat 4', value: 50 },
      { label: 'Stat 5', value: 50 },
      { label: 'Stat 6', value: 50 },
      { label: 'Stat 7', value: 50 },
      { label: 'Stat 8', value: 50 },
    ],
  },
];
