export interface Point {
  x: number;
  y: number;
}

export interface PolygonMetrics {
  n: number;
  name: string;
  radius: number; // constant circumscribed radius R
  interiorAngleDeg: number;
  sideLength: number; // in relative units / pixels
  perimeter: number;
  area: number;
  circleCircumference: number;
  circleArea: number;
  perimeterRatioPercent: number; // (P / C) * 100
  areaRatioPercent: number; // (A / Area_circle) * 100
  closenessScore: number; // 0 to 100%
}

export interface ViewOptions {
  showAngles: boolean; // かくど（内角の開き）
  showLengthLines: boolean; // ながさ（重心と頂点を結ぶ線分の長さ・半径）
  showCircle: boolean; // 目標の外接円
  showMagnifier: boolean; // かどの拡大ズーム
}
