import type { ChartConfig } from '../types/chart';

export function exportJson(config: ChartConfig, filename: string = 'octagon-chart.json') {
  const json = JSON.stringify(config, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export function importJson(file: File): Promise<ChartConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as ChartConfig;
        if (data.version !== 1 || !Array.isArray(data.stats) || data.stats.length !== 8) {
          reject(new Error('Invalid chart configuration file'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
