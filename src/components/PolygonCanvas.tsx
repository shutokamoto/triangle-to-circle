import React from 'react';
import { Point, PolygonMetrics, ViewOptions } from '../types';
import {
  CANVAS_SIZE,
  CENTER_POINT,
  RADIUS,
  getAngleArcPath,
  getPolygonPathD,
} from '../utils/geometry';
import { CornerMagnifier } from './CornerMagnifier';

interface PolygonCanvasProps {
  metrics: PolygonMetrics;
  vertices: Point[];
  options: ViewOptions;
  highlightedVertexIndex: number | null;
  onSelectVertex: (index: number | null) => void;
}

export const PolygonCanvas: React.FC<PolygonCanvasProps> = ({
  metrics,
  vertices,
  options,
  highlightedVertexIndex,
  onSelectVertex,
}) => {
  const { n, interiorAngleDeg } = metrics;
  const pathD = getPolygonPathD(vertices);

  // Radius length in cm for visual discovery
  const displayRadiusCm = '10cm';

  // Number of vertices to display labels for (to avoid clutter when n is large)
  const showAllAngleLabels = n <= 8;

  return (
    <div
      id="polygon-canvas-container"
      className="relative w-full aspect-square max-w-[440px] xl:max-w-[480px] mx-auto bg-white rounded-3xl sm:rounded-[36px] border-4 sm:border-6 border-sky-200 shadow-[0_6px_0px_#bae6fd] p-2 sm:p-3 flex items-center justify-center overflow-hidden"
    >
      {/* Corner count badge in top-right of canvas */}
      <div
        id="canvas-corner-counter-badge"
        className="absolute top-3 right-3 z-20 bg-blue-500 border-3 border-blue-700 rounded-2xl px-3.5 py-1.5 sm:px-4 sm:py-2 shadow-[3px_3px_0px_#1d4ed8] flex flex-col items-center select-none"
      >
        <span className="text-white font-black text-[11px] sm:text-xs tracking-tight">
          かどの数
        </span>
        <span className="text-white font-black text-2xl sm:text-4xl leading-none">
          {n}
        </span>
      </div>

      {/* SVG Canvas */}
      <svg
        id="polygon-svg"
        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
        className="w-full h-full relative z-10 select-none overflow-visible"
      >
        {/* 1. Target Circumscribed Circle (めざす円 - no text annotation) */}
        {options.showCircle && (
          <g id="circumscribed-circle-group">
            <circle
              cx={CENTER_POINT.x}
              cy={CENTER_POINT.y}
              r={RADIUS}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3.5"
              strokeDasharray="8 8"
            />
          </g>
        )}

        {/* 2. Line Segments from Centroid to Vertices (重心と頂点を結ぶ線分の長さ) */}
        {options.showLengthLines && (
          <g id="radius-lines-group">
            {vertices.map((v, i) => (
              <line
                key={`radius-${i}`}
                x1={CENTER_POINT.x}
                y1={CENTER_POINT.y}
                x2={v.x}
                y2={v.y}
                stroke={i === 0 ? '#9333ea' : '#c084fc'}
                strokeWidth={i === 0 ? '3.5' : '2'}
                strokeDasharray={i === 0 ? 'none' : '4 4'}
              />
            ))}

            {/* Length label on the primary segment from centroid to top vertex */}
            <g transform={`translate(${CENTER_POINT.x + 12}, ${CENTER_POINT.y - RADIUS / 2})`}>
              <rect
                x="-8"
                y="-11"
                width="66"
                height="22"
                rx="7"
                fill="#f3e8ff"
                stroke="#9333ea"
                strokeWidth="2"
                className="shadow-sm"
              />
              <text
                x="25"
                y="4"
                textAnchor="middle"
                className="fill-purple-900 text-xs font-black"
              >
                {displayRadiusCm}
              </text>
            </g>
          </g>
        )}

        {/* 3. Main Regular Polygon (正多角形本体) */}
        <g id="polygon-body-group">
          <path
            d={pathD}
            fill="#10b981"
            fillOpacity="0.2"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinejoin="round"
            className="transition-all duration-150"
          />
        </g>

        {/* 4. Interior Angles (かくど / 内角) Display */}
        {options.showAngles && (
          <g id="interior-angles-group">
            {vertices.map((_, i) => {
              if (!showAllAngleLabels && i !== 0 && i !== 1 && i !== n - 1) {
                return null;
              }

              const arcRadius = Math.min(32, Math.max(16, 180 / n));
              const { pathD: arcD, textPos } = getAngleArcPath(vertices, i, arcRadius);

              return (
                <g key={`angle-${i}`} className="pointer-events-none">
                  {/* Arc Path */}
                  <path
                    d={arcD}
                    fill="rgba(244, 63, 94, 0.15)"
                    stroke="#e11d48"
                    strokeWidth="3.5"
                  />
                  {/* Degree Badge */}
                  <g transform={`translate(${textPos.x}, ${textPos.y})`}>
                    <rect
                      x="-24"
                      y="-11"
                      width="48"
                      height="22"
                      rx="7"
                      fill="#ffe4e6"
                      stroke="#e11d48"
                      strokeWidth="2"
                      className="shadow-sm"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      className="fill-rose-600 font-black text-xs"
                    >
                      {interiorAngleDeg >= 100
                        ? interiorAngleDeg.toFixed(1)
                        : interiorAngleDeg.toFixed(0)}
                      °
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        )}

        {/* 5. Vertex Points (ちょうてん・角) */}
        <g id="vertices-group">
          {vertices.map((v, i) => {
            const isTop = i === 0;
            const isHovered = highlightedVertexIndex === i;

            return (
              <g
                key={`vertex-${i}`}
                transform={`translate(${v.x}, ${v.y})`}
                className="cursor-pointer group"
                onClick={() => onSelectVertex(isHovered ? null : i)}
              >
                <circle cx="0" cy="0" r="14" fill="transparent" />

                {/* Visible vertex dot */}
                <circle
                  cx="0"
                  cy="0"
                  r={isTop ? '7' : isHovered ? '6.5' : Math.min(5.5, Math.max(2.5, 60 / n))}
                  fill={isTop ? '#e11d48' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-transform group-hover:scale-125 shadow"
                />
              </g>
            );
          })}
        </g>

        {/* 6. Centroid / Center Point (重心・中心 - clean visual dot, no text) */}
        <g id="center-point-group" transform={`translate(${CENTER_POINT.x}, ${CENTER_POINT.y})`}>
          <circle cx="0" cy="0" r="10" fill="rgba(14, 165, 233, 0.2)" />
          <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />
        </g>
      </svg>

      {/* Floating Corner Magnifier View */}
      {options.showMagnifier && (
        <CornerMagnifier
          vertices={vertices}
          n={n}
          showAngles={options.showAngles}
          angleDeg={interiorAngleDeg}
        />
      )}
    </div>
  );
};
