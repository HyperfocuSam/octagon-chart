import { forwardRef } from 'react';
import type { StatItem } from '../types/chart';
import type { ChartTheme } from '../types/theme';

interface BarChartProps {
  stats: StatItem[];
  theme: ChartTheme;
  size?: number;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  animKey: number;
}

const BAR_HEIGHT = 28;
const BAR_GAP = 8;
const LABEL_WIDTH = 70;
const VALUE_WIDTH = 36;
const PADDING_X = 16;
const PADDING_Y = 12;
const BAR_RADIUS = 6;

export const BarChart = forwardRef<SVGSVGElement, BarChartProps>(
  function BarChart({ stats, theme, size = 460, hoveredIndex, onHoverIndex, animKey }, ref) {
    const { chart } = theme;

    const barAreaWidth = size - LABEL_WIDTH - VALUE_WIDTH - PADDING_X * 2;
    const totalHeight = PADDING_Y * 2 + stats.length * (BAR_HEIGHT + BAR_GAP) - BAR_GAP;

    const gradientId = `bar-gradient-${theme.id}`;
    const glowId = `bar-glow-${theme.id}`;
    const highlightGlowId = `bar-highlight-glow-${theme.id}`;

    const bars = stats.map((stat, i) => {
      const y = PADDING_Y + i * (BAR_HEIGHT + BAR_GAP);
      const barX = LABEL_WIDTH + PADDING_X;
      const barWidth = (stat.value / 100) * barAreaWidth;
      const isHovered = hoveredIndex === i;

      return (
        <g
          key={i}
          onMouseEnter={() => onHoverIndex(i)}
          onMouseLeave={() => onHoverIndex(null)}
          style={{ cursor: 'default' }}
        >
          {/* Track background */}
          <rect
            x={barX}
            y={y}
            width={barAreaWidth}
            height={BAR_HEIGHT}
            rx={BAR_RADIUS}
            ry={BAR_RADIUS}
            fill={chart.gridLines}
            opacity={isHovered ? 0.6 : 0.4}
            style={{ transition: 'opacity 0.2s ease' }}
          />

          {/* Filled bar */}
          <rect
            x={barX}
            y={isHovered ? y - 1 : y}
            width={Math.max(barWidth, BAR_RADIUS * 2)}
            height={isHovered ? BAR_HEIGHT + 2 : BAR_HEIGHT}
            rx={BAR_RADIUS}
            ry={BAR_RADIUS}
            fill={chart.gradientFill ? `url(#${gradientId})` : chart.fillColor}
            fillOpacity={chart.gradientFill ? 1 : chart.fillOpacity + 0.3}
            stroke={chart.strokeColor}
            strokeWidth={isHovered ? chart.strokeWidth * 0.8 : chart.strokeWidth * 0.5}
            filter={isHovered ? `url(#${highlightGlowId})` : (chart.glowColor ? `url(#${glowId})` : undefined)}
            style={{
              transition: 'all 0.3s ease',
              animation: `growBar 0.6s ease-out ${i * 0.06}s both`,
            }}
          />

          {/* Label */}
          <text
            x={PADDING_X}
            y={y + BAR_HEIGHT / 2}
            dominantBaseline="central"
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

          {/* Value */}
          <text
            x={LABEL_WIDTH + PADDING_X + barAreaWidth + 8}
            y={y + BAR_HEIGHT / 2}
            dominantBaseline="central"
            fill={isHovered ? chart.strokeColor : chart.valueColor}
            style={{
              fontFamily: `'${theme.fonts.body}', sans-serif`,
              fontSize: '12px',
              fontWeight: isHovered ? 700 : 600,
              transition: 'all 0.2s ease',
            }}
          >
            {stat.value}
          </text>
        </g>
      );
    });

    return (
      <svg
        key={animKey}
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
          <filter id={highlightGlowId} x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(2, (chart.glowBlur ?? 4))} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {bars}
      </svg>
    );
  }
);
