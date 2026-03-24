import { useRef, useState } from 'react';
import { extractColors, generateThemeFromColors } from '../utils/color-extract';
import type { ChartTheme } from '../types/theme';

interface ImageThemeGeneratorProps {
  onThemeGenerated: (theme: ChartTheme) => void;
}

export function ImageThemeGenerator({ onThemeGenerated }: ImageThemeGeneratorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<string[] | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setLoading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const extracted = await extractColors(file);
      setColors(extracted);

      const { chart, ui } = generateThemeFromColors(extracted);

      const theme: ChartTheme = {
        id: 'custom-image',
        name: 'Custom',
        description: 'Generated from uploaded image',
        fonts: {
          display: 'Plus Jakarta Sans',
          body: 'Plus Jakarta Sans',
          import: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
        },
        chart,
        ui,
        effects: {
          chartShadow: `0 0 40px ${extracted[2]}26`,
          animateGlow: true,
        },
      };

      onThemeGenerated(theme);
    } catch {
      setColors(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="image-theme-gen">
      <div
        className="image-drop-zone"
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Uploaded" className="image-preview" />
        ) : (
          <div className="image-drop-text">
            {loading ? 'Extracting...' : 'Drop image or click'}
          </div>
        )}
      </div>

      {colors && (
        <div className="color-palette">
          {colors.map((c, i) => (
            <div
              key={i}
              className="color-swatch"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}
