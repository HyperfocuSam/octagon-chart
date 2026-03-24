export interface RGB {
  r: number;
  g: number;
  b: number;
}

function luminance(c: RGB): number {
  return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
}

function distance(a: RGB, b: RGB): number {
  return (a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2;
}

function rgbToHex(c: RGB): string {
  return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function mixColors(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: Math.round(ca.r + (cb.r - ca.r) * t),
    g: Math.round(ca.g + (cb.g - ca.g) * t),
    b: Math.round(ca.b + (cb.b - ca.b) * t),
  });
}

function darken(hex: string, amount: number): string {
  return mixColors(hex, '#000000', amount);
}

function lighten(hex: string, amount: number): string {
  return mixColors(hex, '#ffffff', amount);
}

/**
 * K-means clustering to extract dominant colors from pixel data.
 * Downsamples to maxSamples for performance.
 */
function kMeans(pixels: RGB[], k: number, maxIter: number = 20): RGB[] {
  if (pixels.length === 0) return [];

  // Initialize centroids by picking evenly spaced pixels
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids: RGB[] = Array.from({ length: k }, (_, i) => ({ ...pixels[i * step] }));

  for (let iter = 0; iter < maxIter; iter++) {
    // Assign pixels to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => []);
    for (const p of pixels) {
      let minDist = Infinity;
      let best = 0;
      for (let c = 0; c < k; c++) {
        const d = distance(p, centroids[c]);
        if (d < minDist) { minDist = d; best = c; }
      }
      clusters[best].push(p);
    }

    // Recompute centroids
    let converged = true;
    for (let c = 0; c < k; c++) {
      if (clusters[c].length === 0) continue;
      const newCentroid: RGB = {
        r: Math.round(clusters[c].reduce((s, p) => s + p.r, 0) / clusters[c].length),
        g: Math.round(clusters[c].reduce((s, p) => s + p.g, 0) / clusters[c].length),
        b: Math.round(clusters[c].reduce((s, p) => s + p.b, 0) / clusters[c].length),
      };
      if (distance(newCentroid, centroids[c]) > 1) converged = false;
      centroids[c] = newCentroid;
    }
    if (converged) break;
  }

  return centroids;
}

/**
 * Extract dominant colors from an image file.
 * Returns 4 hex colors sorted dark-to-light.
 */
export function extractColors(imageFile: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      // Downsample to small canvas for speed
      const maxDim = 100;
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);

      const data = ctx.getImageData(0, 0, w, h).data;
      const pixels: RGB[] = [];

      // Sample every 2nd pixel, skip very dark/light extremes
      for (let i = 0; i < data.length; i += 8) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 128) continue; // skip transparent
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 8 || lum > 248) continue; // skip near-black/white
        pixels.push({ r, g, b });
      }

      if (pixels.length < 4) {
        reject(new Error('Image has too few distinct colors'));
        URL.revokeObjectURL(url);
        return;
      }

      const colors = kMeans(pixels, 4);
      const sorted = colors.sort((a, b) => luminance(a) - luminance(b));
      const hexColors = sorted.map(rgbToHex);

      URL.revokeObjectURL(url);
      resolve(hexColors);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Generate a ChartTheme from 4 extracted colors.
 * Colors should be sorted dark-to-light.
 */
import type { ChartThemeChart, ChartThemeUI } from '../types/theme';

export function generateThemeFromColors(colors: string[]): {
  chart: ChartThemeChart;
  ui: ChartThemeUI;
} {
  const [darkest, dark, mid, lightest] = colors;

  const pageBg = darken(darkest, 0.6);
  const panelBg = darken(darkest, 0.4);
  const chartBg = darken(darkest, 0.3);

  return {
    chart: {
      background: chartBg,
      gridLines: darken(dark, 0.2),
      gridLineWidth: 1,
      axisLines: dark,
      axisLineWidth: 1,
      fillColor: mid,
      fillOpacity: 0.25,
      strokeColor: lightest,
      strokeWidth: 2.5,
      dotColor: lightest,
      dotRadius: 5,
      labelColor: lighten(mid, 0.3),
      valueColor: dark,
      glowColor: mid,
      glowBlur: 6,
      gradientFill: {
        stops: [
          { offset: '0%', color: lightest, opacity: 0.35 },
          { offset: '60%', color: mid, opacity: 0.2 },
          { offset: '100%', color: dark, opacity: 0.05 },
        ],
      },
      gridRings: 4,
      gridStyle: 'octagon' as const,
    },
    ui: {
      pageBg,
      panelBg,
      panelBorder: dark,
      textPrimary: lighten(lightest, 0.2),
      textSecondary: mid,
      accent: lightest,
      accentHover: lighten(lightest, 0.3),
      inputBg: darken(darkest, 0.5),
      inputBorder: dark,
      sliderTrack: dark,
      sliderThumb: lightest,
    },
  };
}
