import { useMemo, forwardRef } from 'react';
import type { StatItem } from '../types/chart';
import type { ChartTheme } from '../types/theme';
import { getPoint, getPolygonPoints, getGridPolygon, getLabelAnchor, getLabelOffset } from '../utils/geometry';

interface OctagonChartProps {
  stats: StatItem[];
  theme: ChartTheme;
  size?: number;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  animKey: number;
}

export const OctagonChart = forwardRef<SVGSVGElement, OctagonChartProps>(
  function OctagonChart({ stats, theme, size = 500, hoveredIndex, onHoverIndex, animKey }, ref) {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.36;
    const labelPadding = 24;
    const { chart } = theme;

    const gridRings = useMemo(() => {
      return Array.from({ length: chart.gridRings }).map((_, i) => {
        const r = radius * ((i + 1) / chart.gridRings);
        if (chart.gridStyle === 'circle') {
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={chart.gridLines} strokeWidth={chart.gridLineWidth} />;
        }
        return <polygon key={i} points={getGridPolygon(cx, cy, r)} fill="none" stroke={chart.gridLines} strokeWidth={chart.gridLineWidth} />;
      });
    }, [cx, cy, radius, chart]);

    const axisLines = useMemo(() => {
      return Array.from({ length: 8 }).map((_, i) => {
        const pt = getPoint(cx, cy, radius, i);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke={chart.axisLines} strokeWidth={chart.axisLineWidth} />;
      });
    }, [cx, cy, radius, chart]);

    const values = stats.map(s => s.value);
    const polygonPoints = getPolygonPoints(cx, cy, radius, values);

    const gradientId = `fill-gradient-${theme.id}`;
    const glowId = `glow-${theme.id}`;
    const highlightGlowId = `highlight-glow-${theme.id}`;

    const labels = stats.map((stat, i) => {
      const pt = getPoint(cx, cy, radius, i);
      const offset = getLabelOffset(i, labelPadding);
      const anchor = getLabelAnchor(i);
      const lx = pt.x + offset.dx;
      const ly = pt.y + offset.dy;
      const isHovered = hoveredIndex === i;

      return (
        <g
          key={i}
          onMouseEnter={() => onHoverIndex(i)}
          onMouseLeave={() => onHoverIndex(null)}
          style={{ cursor: 'default' }}
        >
          <text
            x={lx}
            y={ly - 6}
            textAnchor={anchor}
            fill={isHovered ? chart.strokeColor : chart.labelColor}
            style={{
              fontFamily: `'${theme.fonts.display}', sans-serif`,
              fontSize: isHovered ? '13px' : '12px',
              fontWeight: isHovered ? 700 : 600,
              transition: 'all 0.2s ease',
            }}
          >
            {stat.label}
          </text>
          <text
            x={lx}
            y={ly + 10}
            textAnchor={anchor}
            fill={isHovered ? chart.strokeColor : chart.valueColor}
            style={{
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: '11px',
              fontWeight: isHovered ? 600 : 400,
              transition: 'all 0.2s ease',
            }}
          >
            {stat.value}
          </text>
        </g>
      );
    });

    const dots = stats.map((_, i) => {
      const v = values[i];
      const r = (v / 100) * radius;
      const pt = getPoint(cx, cy, r, i);
      const isHovered = hoveredIndex === i;
      return (
        <circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={isHovered ? chart.dotRadius * 1.8 : chart.dotRadius}
          fill={chart.dotColor}
          filter={isHovered ? `url(#${highlightGlowId})` : (chart.glowColor ? `url(#${glowId})` : undefined)}
          onMouseEnter={() => onHoverIndex(i)}
          onMouseLeave={() => onHoverIndex(null)}
          style={{ cursor: 'default', transition: 'r 0.2s ease' }}
        />
      );
    });

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {chart.gradientFill && (
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              {chart.gradientFill.stops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />
              ))}
            </radialGradient>
          )}
          {chart.glowColor && (
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={chart.glowBlur ?? 4} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
          <filter id={highlightGlowId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={(chart.glowBlur ?? 4) * 2} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {gridRings}

        {/* Axis lines */}
        {axisLines}

        {/* Stat polygon */}
        <polygon
          key={`poly-${animKey}`}
          points={polygonPoints}
          fill={chart.gradientFill ? `url(#${gradientId})` : chart.fillColor}
          fillOpacity={chart.gradientFill ? 1 : chart.fillOpacity}
          stroke={chart.strokeColor}
          strokeWidth={chart.strokeWidth}
          strokeLinejoin="round"
          filter={chart.glowColor ? `url(#${glowId})` : undefined}
          className="octagon-polygon"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Vertex dots */}
        {dots}

        {/* Labels */}
        {labels}
      </svg>
    );
  }
);
