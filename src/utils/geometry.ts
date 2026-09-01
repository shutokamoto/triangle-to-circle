import { Point, PolygonMetrics } from '../types';

export const CANVAS_SIZE = 520;
export const CENTER_POINT: Point = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
export const RADIUS = 200; // Fixed radius R for circumscribed circle and centroid-to-vertex segments

// Convert number to Japanese Kanji for polygon names (3 to 60+)
export function numberToKanji(num: number): string {
  const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (num < 10) return digits[num];
  if (num === 10) return '十';
  if (num < 20) return `十${digits[num % 10]}`;
  const tens = Math.floor(num / 10);
  const ones = num % 10;
  return `${digits[tens]}十${digits[ones]}`;
}

// Japanese names for elementary school with Kanji numerals
export function getPolygonName(n: number): string {
  if (n === 4) {
    return '正方形';
  }
  return `正${numberToKanji(n)}角形`;
}

// Calculate polygon vertices
export function getPolygonVertices(n: number, center: Point = CENTER_POINT, radius: number = RADIUS): Point[] {
  const vertices: Point[] = [];
  // Start with top vertex at angle -PI/2 (12 o'clock)
  const startAngle = -Math.PI / 2;
  const angleStep = (2 * Math.PI) / n;

  for (let i = 0; i < n; i++) {
    const angle = startAngle + i * angleStep;
    vertices.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    });
  }
  return vertices;
}

// Generate SVG path string from vertices
export function getPolygonPathD(vertices: Point[]): string {
  if (vertices.length === 0) return '';
  return (
    vertices.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`, '') +
    ' Z'
  );
}

// Calculate all metrics for n-gon
export function calculatePolygonMetrics(n: number, radius: number = RADIUS): PolygonMetrics {
  const interiorAngleDeg = ((n - 2) * 180) / n;
  const sideLength = 2 * radius * Math.sin(Math.PI / n);
  const perimeter = n * sideLength;
  const area = 0.5 * n * radius * radius * Math.sin((2 * Math.PI) / n);

  const circleCircumference = 2 * Math.PI * radius;
  const circleArea = Math.PI * radius * radius;

  const perimeterRatioPercent = (perimeter / circleCircumference) * 100;
  const areaRatioPercent = (area / circleArea) * 100;

  // Closeness score: average of perimeter and area ratio
  const closenessScore = Math.min(100, Math.max(0, (perimeterRatioPercent + areaRatioPercent) / 2));

  return {
    n,
    name: getPolygonName(n),
    radius,
    interiorAngleDeg,
    sideLength,
    perimeter,
    area,
    circleCircumference,
    circleArea,
    perimeterRatioPercent,
    areaRatioPercent,
    closenessScore,
  };
}

// Generate angle arc SVG path for a vertex i
export function getAngleArcPath(
  vertices: Point[],
  vertexIndex: number,
  arcRadius: number = 24
): { pathD: string; textPos: Point } {
  const n = vertices.length;
  const curr = vertices[vertexIndex];
  const prev = vertices[(vertexIndex - 1 + n) % n];
  const next = vertices[(vertexIndex + 1) % n];

  // Vectors from current vertex to neighbors
  const vPrev = { x: prev.x - curr.x, y: prev.y - curr.y };
  const vNext = { x: next.x - curr.x, y: next.y - curr.y };

  const anglePrev = Math.atan2(vPrev.y, vPrev.x);
  const angleNext = Math.atan2(vNext.y, vNext.x);

  // Normalize arc direction (interior of polygon)
  let diff = angleNext - anglePrev;
  while (diff < 0) diff += 2 * Math.PI;
  while (diff > 2 * Math.PI) diff -= 2 * Math.PI;

  let startAngle = anglePrev;
  let endAngle = angleNext;
  let sweepFlag = 1;

  if (diff > Math.PI) {
    // Take the smaller interior angle
    startAngle = angleNext;
    endAngle = anglePrev;
    sweepFlag = 1;
    diff = 2 * Math.PI - diff;
  }

  const p1 = {
    x: curr.x + arcRadius * Math.cos(startAngle),
    y: curr.y + arcRadius * Math.sin(startAngle),
  };
  const p2 = {
    x: curr.x + arcRadius * Math.cos(endAngle),
    y: curr.y + arcRadius * Math.sin(endAngle),
  };

  const midAngle = startAngle + diff / 2;
  const textDist = arcRadius + 16;
  const textPos = {
    x: curr.x + textDist * Math.cos(midAngle),
    y: curr.y + textDist * Math.sin(midAngle),
  };

  const pathD = `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;

  return { pathD, textPos };
}

// Calculate midpoint and normal vector for edge length label
export function getEdgeDimension(
  p1: Point,
  p2: Point,
  offset: number = 18
): { midX: number; midY: number; labelX: number; labelY: number; angleDeg: number } {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;

  // Vector from center to midpoint
  const dx = midX - CENTER_POINT.x;
  const dy = midY - CENTER_POINT.y;
  const dist = Math.hypot(dx, dy) || 1;

  // Outward normal unit vector
  const nx = dx / dist;
  const ny = dy / dist;

  const labelX = midX + nx * offset;
  const labelY = midY + ny * offset;

  // Rotation angle for text alignment along the edge
  let angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
  if (angleDeg > 90) angleDeg -= 180;
  if (angleDeg < -90) angleDeg += 180;

  return { midX, midY, labelX, labelY, angleDeg };
}
