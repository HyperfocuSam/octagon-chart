import { useRef, useEffect, useState } from 'react';
import { useChartState } from './hooks/useChartState';
import { usePresets } from './hooks/usePresets';
import { themes, DEFAULT_THEME_ID } from './themes';
import type { ChartTheme } from './types/theme';
import { OctagonChart } from './components/OctagonChart';
import { ControlPanel } from './components/ControlPanel';
import { ThemeSelector } from './components/ThemeSelector';
import { ExportBar } from './components/ExportBar';
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
    themeId,
    setThemeId,
    loadConfig,
    getConfig,
  } = useChartState();

  const { allPresets, savePreset, deletePreset, isCustom } = usePresets();
  const [customImageTheme, setCustomImageTheme] = useState<ChartTheme | null>(null);

  // Resolve current theme: check custom first, then built-in
  const theme = themeId === 'custom-image' && customImageTheme
    ? customImageTheme
    : themes[themeId] ?? themes[DEFAULT_THEME_ID];

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Load theme font
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

  const handleImageTheme = (newTheme: ChartTheme) => {
    setCustomImageTheme(newTheme);
    setThemeId('custom-image');
  };

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

  return (
    <div className="app-root" style={cssVars}>
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Octagon Chart</h1>
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
            <OctagonChart ref={svgRef} stats={stats} theme={theme} size={460} />
          </div>
        </section>
      </main>
    </div>
  );
}
