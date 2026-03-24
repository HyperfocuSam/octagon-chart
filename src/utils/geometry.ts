const AXIS_COUNT = 8;
const ANGLE_STEP = (2 * Math.PI) / AXIS_COUNT;
const START_ANGLE = -Math.PI / 2; // Start from top (12 o'clock)

export function getPoint(
  cx: number,
  cy: number,
  radius: number,
  index: number
): { x: number; y: number } {
  const angle = START_ANGLE + index * ANGLE_STEP;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function getPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  values: number[]
): string {
  return values
    .map((v, i) => {
      const r = (v / 100) * radius;
      const pt = getPoint(cx, cy, r, i);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

export function getGridPolygon(
  cx: number,
  cy: number,
  radius: number
): string {
  return Array.from({ length: AXIS_COUNT })
    .map((_, i) => {
      const pt = getPoint(cx, cy, radius, i);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');
}

export function getLabelAnchor(index: number): 'start' | 'middle' | 'end' {
  const angle = START_ANGLE + index * ANGLE_STEP;
  const x = Math.cos(angle);
  if (Math.abs(x) < 0.01) return 'middle';
  return x > 0 ? 'start' : 'end';
}

export function getLabelOffset(
  index: number,
  padding: number
): { dx: number; dy: number } {
  const angle = START_ANGLE + index * ANGLE_STEP;
  return {
    dx: Math.cos(angle) * padding,
    dy: Math.sin(angle) * padding,
  };
}
