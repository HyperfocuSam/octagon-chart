import { forwardRef, useMemo } from 'react';
import type { StatItem } from '../types/chart';
import type { ChartTheme } from '../types/theme';

interface BarChartProps {
  stats: StatItem[];
  theme: ChartTheme;
  size?: number;
}

const BAR_HEIGHT = 28;
const BAR_GAP = 8;
const LABEL_WIDTH = 70;
const VALUE_WIDTH = 36;
const PADDING_X = 16;
const PADDING_Y = 12;
const BAR_RADIUS = 6;

export const BarChart = forwardRef<SVGSVGElement, BarChartProps>(
  function BarChart({ stats, theme, size = 460 }, ref) {
    const { chart } = theme;

    const barAreaWidth = size - LABEL_WIDTH - VALUE_WIDTH - PADDING_X * 2;
    const totalHeight = PADDING_Y * 2 + stats.length * (BAR_HEIGHT + BAR_GAP) - BAR_GAP;

    const gradientId = `bar-gradient-${theme.id}`;
    const glowId = `bar-glow-${theme.id}`;

    const bars = useMemo(() => {
      return stats.map((stat, i) => {
        const y = PADDING_Y + i * (BAR_HEIGHT + BAR_GAP);
        const barX = LABEL_WIDTH + PADDING_X;
        const barWidth = (stat.value / 100) * barAreaWidth;

        return (
          <g key={i}>
            {/* Track background */}
            <rect
              x={barX}
              y={y}
              width={barAreaWidth}
              height={BAR_HEIGHT}
              rx={BAR_RADIUS}
              ry={BAR_RADIUS}
              fill={chart.gridLines}
              opacity={0.4}
            />

            {/* Filled bar */}
            <rect
              x={barX}
              y={y}
              width={Math.max(barWidth, BAR_RADIUS * 2)}
              height={BAR_HEIGHT}
              rx={BAR_RADIUS}
              ry={BAR_RADIUS}
              fill={chart.gradientFill ? `url(#${gradientId})` : chart.fillColor}
              fillOpacity={chart.gradientFill ? 1 : chart.fillOpacity + 0.3}
              stroke={chart.strokeColor}
              strokeWidth={chart.strokeWidth * 0.5}
              filter={chart.glowColor ? `url(#${glowId})` : undefined}
              style={{ transition: 'width 0.3s ease' }}
            />

            {/* Label */}
            <text
              x={PADDING_X}
              y={y + BAR_HEIGHT / 2}
              dominantBaseline="central"
              fill={chart.labelColor}
              style={{
                fontFamily: `'${theme.fonts.display}', sans-serif`,
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {stat.label}
            </text>

            {/* Value */}
            <text
              x={LABEL_WIDTH + PADDING_X + barAreaWidth + 8}
              y={y + BAR_HEIGHT / 2}
              dominantBaseline="central"
              fill={chart.valueColor}
              style={{
                fontFamily: `'${theme.fonts.body}', sans-serif`,
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {stat.value}
            </text>
          </g>
        );
      });
    }, [stats, barAreaWidth, chart, theme, gradientId, glowId]);

    return (
      <svg
        ref={ref}
        width={size}
        height={totalHeight}
        viewBox={`0 0 ${size} ${totalHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {chart.gradientFill && (
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {chart.gradientFill.stops.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity + 0.2} />
              ))}
            </linearGradient>
          )}
          {chart.glowColor && (
            <filter id={glowId} x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(1, (chart.glowBlur ?? 4) * 0.5)} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>
        {bars}
      </svg>
    );
  }
);
