export interface ChartThemeChart {
  background: string;
  gridLines: string;
  gridLineWidth: number;
  axisLines: string;
  axisLineWidth: number;
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWidth: number;
  dotColor: string;
  dotRadius: number;
  labelColor: string;
  valueColor: string;
  glowColor?: string;
  glowBlur?: number;
  gradientFill?: {
    stops: Array<{ offset: string; color: string; opacity: number }>;
  };
  gridRings: number;
  gridStyle: 'octagon' | 'circle';
}

export interface ChartThemeUI {
  pageBg: string;
  panelBg: string;
  panelBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  inputBg: string;
  inputBorder: string;
  sliderTrack: string;
  sliderThumb: string;
}

export interface ChartThemeEffects {
  chartShadow?: string;
  animateGlow?: boolean;
  scanLines?: boolean;
  noise?: boolean;
}

export interface ChartTheme {
  id: string;
  name: string;
  description: string;
  fonts: {
    display: string;
    body: string;
    import: string;
  };
  chart: ChartThemeChart;
  ui: ChartThemeUI;
  effects: ChartThemeEffects;
}
