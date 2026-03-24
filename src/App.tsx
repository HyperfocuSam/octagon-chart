import { useRef, useEffect, useState, useCallback } from 'react';
import { useChartState } from './hooks/useChartState';
import { usePresets } from './hooks/usePresets';
import { themes, DEFAULT_THEME_ID } from './themes';
import type { ChartTheme } from './types/theme';
import { OctagonChart } from './components/OctagonChart';
import { BarChart } from './components/BarChart';
import { ControlPanel } from './components/ControlPanel';
import { ThemeSelector } from './components/ThemeSelector';
import { ExportBar } from './components/ExportBar';
import { ChartModeMenu } from './components/ChartModeMenu';
import { ImageThemeGenerator } from './components/ImageThemeGenerator';
import './global.css';

export default function App() {
  const {
    title,
    setTitle,
    stats,
    updateStat,
    updateLabel,
    setStats,
    addStat,
    removeStat,
    themeId,
    setThemeId,
    chartMode,
    setChartMode,
    loadConfig,
    getConfig,
  } = useChartState();

  const { allPresets, savePreset, deletePreset, isCustom } = usePresets();
  const [customImageTheme, setCustomImageTheme] = useState<ChartTheme | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const theme = themeId === 'custom-image' && customImageTheme
    ? customImageTheme
    : themes[themeId] ?? themes[DEFAULT_THEME_ID];

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const linkId = `font-${theme.id}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = theme.fonts.import;
      document.head.appendChild(link);
    }
  }, [theme]);

  // Trigger entrance animation on mode or theme change
  const prevMode = useRef(chartMode);
  const prevTheme = useRef(themeId);
  useEffect(() => {
    if (prevMode.current !== chartMode || prevTheme.current !== themeId) {
      setAnimKey(k => k + 1);
      prevMode.current = chartMode;
      prevTheme.current = themeId;
    }
  }, [chartMode, themeId]);

  const handleImageTheme = useCallback((newTheme: ChartTheme) => {
    setCustomImageTheme(newTheme);
    setThemeId('custom-image');
  }, [setThemeId]);

  const cssVars = {
    '--page-bg': theme.ui.pageBg,
    '--panel-bg': theme.ui.panelBg,
    '--panel-border': theme.ui.panelBorder,
    '--text-primary': theme.ui.textPrimary,
    '--text-secondary': theme.ui.textSecondary,
    '--accent': theme.ui.accent,
    '--accent-hover': theme.ui.accentHover,
    '--input-bg': theme.ui.inputBg,
    '--input-border': theme.ui.inputBorder,
    '--slider-track': theme.ui.sliderTrack,
    '--slider-thumb': theme.ui.sliderThumb,
    '--font-display': `'${theme.fonts.display}', sans-serif`,
    '--font-body': `'${theme.fonts.body}', sans-serif`,
  } as React.CSSProperties;

  const renderChart = () => {
    const common = { ref: svgRef, stats, theme, size: 460, hoveredIndex, onHoverIndex: setHoveredIndex, animKey };
    switch (chartMode) {
      case 'bar':
        return <BarChart {...common} />;
      case 'octagon':
      default:
        return <OctagonChart {...common} />;
    }
  };

  return (
    <div className="app-root" style={cssVars}>
      <header className="app-header">
        <div className="header-left">
          <ChartModeMenu currentMode={chartMode} onSelect={setChartMode} />
        </div>
        <div className="header-center">
          <ThemeSelector
            currentThemeId={themeId}
            onSelect={setThemeId}
            customImageTheme={customImageTheme}
          />
        </div>
        <div className="header-right">
          <ExportBar
            chartRef={chartContainerRef}
            svgRef={svgRef}
            getConfig={getConfig}
            onLoadConfig={loadConfig}
          />
        </div>
      </header>

      <main className="app-main">
        <aside className="app-sidebar">
          <ControlPanel
            title={title}
            onTitleChange={setTitle}
            stats={stats}
            onValueChange={updateStat}
            onLabelChange={updateLabel}
            onPresetSelect={setStats}
            onPresetSave={savePreset}
            onPresetDelete={deletePreset}
            presets={allPresets}
            isCustomPreset={isCustom}
            theme={theme}
            chartMode={chartMode}
            onAddStat={addStat}
            onRemoveStat={removeStat}
            hoveredIndex={hoveredIndex}
            onHoverIndex={setHoveredIndex}
          />
          <div className="panel-section" style={{ padding: '0 20px 20px' }}>
            <label className="panel-label">Image Theme</label>
            <ImageThemeGenerator onThemeGenerated={handleImageTheme} />
          </div>
        </aside>

        <section className="app-chart-area">
          <div
            className="chart-container"
            ref={chartContainerRef}
            style={{
              background: theme.chart.background,
              boxShadow: theme.effects.chartShadow,
            }}
          >
            {theme.effects.scanLines && <div className="scan-lines" />}
            <div className="chart-title" style={{ fontFamily: `'${theme.fonts.display}', sans-serif` }}>
              {title}
            </div>
            {renderChart()}
          </div>
        </section>
      </main>
    </div>
  );
}
