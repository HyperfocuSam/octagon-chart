import type { ChartTheme } from '../types/theme';

export const rpgFantasy: ChartTheme = {
  id: 'rpg-fantasy',
  name: 'RPG Fantasy',
  description: 'Dark parchment with golden accents',
  fonts: {
    display: 'Cinzel',
    body: 'Crimson Text',
    import: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:wght@400;600&display=swap',
  },
  chart: {
    background: '#1a1410',
    gridLines: '#8b7355',
    gridLineWidth: 1,
    axisLines: '#6b5a3e',
    axisLineWidth: 1,
    fillColor: '#e8a838',
    fillOpacity: 0.25,
    strokeColor: '#f0c060',
    strokeWidth: 2.5,
    dotColor: '#ffd700',
    dotRadius: 5,
    labelColor: '#d4c4a0',
    valueColor: '#a89070',
    glowColor: '#f0c060',
    glowBlur: 6,
    gradientFill: {
      stops: [
        { offset: '0%', color: '#f0c060', opacity: 0.4 },
        { offset: '100%', color: '#e8a838', opacity: 0.1 },
      ],
    },
    gridRings: 4,
    gridStyle: 'octagon',
  },
  ui: {
    pageBg: '#12100c',
    panelBg: '#1e1a14',
    panelBorder: '#3d3428',
    textPrimary: '#d4c4a0',
    textSecondary: '#8b7a60',
    accent: '#e8a838',
    accentHover: '#f0c060',
    inputBg: '#16130e',
    inputBorder: '#3d3428',
    sliderTrack: '#3d3428',
    sliderThumb: '#e8a838',
  },
  effects: {
    chartShadow: '0 0 40px rgba(232, 168, 56, 0.15)',
    animateGlow: true,
  },
};
