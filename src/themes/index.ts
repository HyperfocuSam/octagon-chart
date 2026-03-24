import type { ChartTheme } from '../types/theme';
import { cleanMinimal } from './clean-minimal';
import { rpgFantasy } from './rpg-fantasy';
import { cyberpunkNeon } from './cyberpunk-neon';
import { animeBattle } from './anime-battle';
import { retroPixel } from './retro-pixel';

export const themes: Record<string, ChartTheme> = {
  'clean-minimal': cleanMinimal,
  'rpg-fantasy': rpgFantasy,
  'cyberpunk-neon': cyberpunkNeon,
  'anime-battle': animeBattle,
  'retro-pixel': retroPixel,
};

export const themeList: ChartTheme[] = [
  cleanMinimal,
  rpgFantasy,
  cyberpunkNeon,
  animeBattle,
  retroPixel,
];

export const DEFAULT_THEME_ID = 'clean-minimal';
