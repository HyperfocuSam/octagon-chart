import { useRef } from 'react';
import type { ChartConfig } from '../types/chart';
import { exportPng } from '../utils/export-png';
import { exportSvg } from '../utils/export-svg';
import { exportJson } from '../utils/export-json';
import { importJson } from '../utils/export-json';

interface ExportBarProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
  getConfig: () => ChartConfig;
  onLoadConfig: (config: ChartConfig) => void;
}

export function ExportBar({ chartRef, svgRef, getConfig, onLoadConfig }: ExportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePng = async () => {
    if (chartRef.current) {
      await exportPng(chartRef.current);
    }
  };

  const handleSvg = () => {
    if (svgRef.current) {
      exportSvg(svgRef.current);
    }
  };

  const handleJsonSave = () => {
    exportJson(getConfig());
  };

  const handleJsonLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const config = await importJson(file);
      onLoadConfig(config);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load file');
    }
    e.target.value = '';
  };

  return (
    <div className="export-bar">
      <button className="export-btn" onClick={handlePng} title="Download as PNG">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11v3h12v-3M8 2v8M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        PNG
      </button>
      <button className="export-btn" onClick={handleSvg} title="Download as SVG">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 11v3h12v-3M8 2v8M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        SVG
      </button>
      <button className="export-btn" onClick={handleJsonSave} title="Save configuration">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2h7l3 3v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/><path d="M5 2v4h5V2M5 14v-4h6v4" stroke="currentColor" strokeWidth="1.5"/></svg>
        Save
      </button>
      <button className="export-btn" onClick={() => fileInputRef.current?.click()} title="Load configuration">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 13h12M8 10V2M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Load
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleJsonLoad}
        style={{ display: 'none' }}
      />
    </div>
  );
}
