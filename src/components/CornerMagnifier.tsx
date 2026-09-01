import React from 'react';
import { Point } from '../types';
import { CENTER_POINT, RADIUS } from '../utils/geometry';

interface CornerMagnifierProps {
  vertices: Point[];
  n: number;
  showAngles: boolean;
  angleDeg: number;
}

export const CornerMagnifier: React.FC<CornerMagnifierProps> = ({
  vertices,
  n,
  showAngles,
  angleDeg,
}) => {
  if (vertices.length < 3) return null;

  // Focus on top vertex (index 0)
  const topVertex = vertices[0];
  const nextVertex = vertices[1];
  const prevVertex = vertices[vertices.length - 1];

  // Circle arc around top vertex
  const topAngle = -Math.PI / 2;
  const arcSpan = Math.PI / 4; // 45 degrees span
  const cP1x = CENTER_POINT.x + RADIUS * Math.cos(topAngle - arcSpan / 2);
  const cP1y = CENTER_POINT.y + RADIUS * Math.sin(topAngle - arcSpan / 2);
  const cP2x = CENTER_POINT.x + RADIUS * Math.cos(topAngle + arcSpan / 2);
  const cP2y = CENTER_POINT.y + RADIUS * Math.sin(topAngle + arcSpan / 2);

  // Zoom view box centered around topVertex
  const zoomSize = 90;
  const minX = topVertex.x - zoomSize / 2;
  const minY = topVertex.y - zoomSize / 2;

  return (
    <div
      id="corner-magnifier-card"
      className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border-4 border-amber-400 rounded-3xl p-3 shadow-[4px_4px_0px_#f59e0b] z-20 flex flex-col items-center w-48 transition-all"
    >
      <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 mb-1.5 self-start">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block"></span>
        <span>🔍 かどの拡大（ズーム）</span>
      </div>

      <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-amber-300 bg-sky-50 shadow-inner">
        <svg
          viewBox={`${minX} ${minY} ${zoomSize} ${zoomSize}`}
          className="w-full h-full"
        >
          {/* Circular reference curve */}
          <path
            d={`M ${cP1x} ${cP1y} A ${RADIUS} ${RADIUS} 0 0 1 ${cP2x} ${cP2y}`}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3.5"
            strokeDasharray="4 3"
          />

          {/* Polygon edges meeting at top vertex */}
          <line
            x1={prevVertex.x}
            y1={prevVertex.y}
            x2={topVertex.x}
            y2={topVertex.y}
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1={topVertex.x}
            y1={topVertex.y}
            x2={nextVertex.x}
            y2={nextVertex.y}
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Vertex point */}
          <circle
            cx={topVertex.x}
            cy={topVertex.y}
            r="6"
            fill="#e11d48"
            stroke="#ffffff"
            strokeWidth="2.5"
          />
        </svg>

        {/* Legend inside lens */}
        <div className="absolute bottom-1 left-1.5 right-1.5 flex justify-between items-center text-[9px] bg-white/90 px-2 py-0.5 rounded-lg border border-amber-200 text-slate-700 font-black">
          <span className="text-emerald-700">― 辺</span>
          <span className="text-slate-600">--- 円</span>
        </div>
      </div>

      {/* Visual angle badge */}
      {showAngles && (
        <div className="mt-2 w-full text-center bg-rose-100 border-2 border-rose-300 rounded-xl py-1 text-rose-900 text-xs font-black">
          角度: <span className="text-sm font-black text-rose-600">{angleDeg.toFixed(1)}°</span>
        </div>
      )}
    </div>
  );
};
