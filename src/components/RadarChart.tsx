import React from 'react';
import { DIMENSIONS } from '../data/leaders';
import { DimensionKey, LeaderScores } from '../types';

export interface RadarDataset {
  label: string;
  scores: LeaderScores;
  strokeColor: string;
  fillColor: string;
  strokeWidth?: number;
}

interface RadarChartProps {
  datasets: RadarDataset[];
  size?: number;
  showLabels?: boolean;
  interactive?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  datasets,
  size = 320,
  showLabels = true,
}) => {
  const center = size / 2;
  const radius = (size / 2) - (showLabels ? 50 : 20);
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const count = DIMENSIONS.length; // 6
  const angleStep = (Math.PI * 2) / count;

  // Calculate coordinates for an axis at a specific normalized value (0 - 1)
  const getCoordinates = (index: number, value: number) => {
    // Start from top (- PI / 2) and rotate clockwise
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * Math.max(0, Math.min(1, value));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
      >
        {/* Background Concentric Polygons */}
        {levels.map((level, lvlIdx) => {
          const points = DIMENSIONS.map((_, i) => {
            const { x, y } = getCoordinates(i, level);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={`level-${lvlIdx}`}
              points={points}
              fill={lvlIdx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)'}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray={lvlIdx === levels.length - 1 ? 'none' : '2,2'}
            />
          );
        })}

        {/* Axis Spokes from Center to Outer Vertex */}
        {DIMENSIONS.map((dim, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          return (
            <line
              key={`spoke-${dim.key}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
          );
        })}

        {/* Datasets (Polygons) */}
        {datasets.map((dataset, dsIdx) => {
          const points = DIMENSIONS.map((dim, i) => {
            const val = (dataset.scores[dim.key as DimensionKey] || 0) / 100;
            const { x, y } = getCoordinates(i, val);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={`dataset-${dsIdx}`}>
              <polygon
                points={points}
                fill={dataset.fillColor}
                stroke={dataset.strokeColor}
                strokeWidth={dataset.strokeWidth || 2}
                className="transition-all duration-300"
              />
              {/* Vertex dots */}
              {DIMENSIONS.map((dim, i) => {
                const val = (dataset.scores[dim.key as DimensionKey] || 0) / 100;
                const { x, y } = getCoordinates(i, val);
                return (
                  <circle
                    key={`dot-${dsIdx}-${dim.key}`}
                    cx={x}
                    cy={y}
                    r={3.5}
                    fill={dataset.strokeColor}
                    stroke="#1c1917"
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Labels around the perimeter */}
        {showLabels &&
          DIMENSIONS.map((dim, i) => {
            const { x, y } = getCoordinates(i, 1.22);
            // Text anchor calculation based on angle
            const angle = i * angleStep - Math.PI / 2;
            let textAnchor: 'start' | 'middle' | 'end' = 'middle';
            if (Math.cos(angle) > 0.3) textAnchor = 'start';
            else if (Math.cos(angle) < -0.3) textAnchor = 'end';

            return (
              <text
                key={`label-${dim.key}`}
                x={x}
                y={y + 4}
                textAnchor={textAnchor}
                className="text-[11px] font-medium fill-stone-400 select-none tracking-wide"
              >
                {dim.shortLabel}
              </text>
            );
          })}
      </svg>

      {/* Legend if multiple datasets */}
      {datasets.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
          {datasets.map((ds, i) => (
            <div key={i} className="flex items-center gap-1.5 text-stone-300">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ds.strokeColor }}
              />
              <span className="font-medium">{ds.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
