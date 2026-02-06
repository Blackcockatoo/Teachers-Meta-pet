"use client";

import type { KizunaLevel } from "@/lib/kizuna";
import {
  calculateMandalaPoints,
  generateMandalaPath,
  KIZUNA_TIERS,
} from "@/lib/kizuna";

interface KizunaMandalaProps {
  level: KizunaLevel;
  size?: number;
}

export function KizunaMandala({ level, size = 280 }: KizunaMandalaProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  const points = calculateMandalaPoints(centerX, centerY, radius, level);
  const path = generateMandalaPath(points);

  return (
    <div className="kizuna-mandala" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 1.1}
          fill="none"
          stroke="url(#gradient-shrine)"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* 7-pointed star outline */}
        <path
          d={path}
          fill="none"
          stroke="url(#gradient-shrine)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Filled star based on level */}
        {level > 0 && (
          <path d={path} fill="url(#gradient-fill)" opacity="0.2" />
        )}

        {/* Level points */}
        {points.map((point, index) => {
          const tier = KIZUNA_TIERS[(index + 1) as KizunaLevel];
          const isActive = point.active;

          return (
            <g key={index}>
              {/* Point circle */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isActive ? 12 : 8}
                fill={isActive ? "url(#gradient-shrine)" : "#374151"}
                stroke={isActive ? "#ec4899" : "#6b7280"}
                strokeWidth="2"
                className={isActive ? "animate-pulse" : ""}
              />

              {/* Level number */}
              <text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill={isActive ? "white" : "#9ca3af"}
              >
                {index + 1}
              </text>

              {/* Level name (Japanese) */}
              <text
                x={point.x}
                y={point.y - 20}
                textAnchor="middle"
                fontSize="10"
                fill={isActive ? "#ec4899" : "#6b7280"}
                className="japanese-text"
              >
                {tier.nameJP}
              </text>
            </g>
          );
        })}

        {/* Center icon */}
        <text x={centerX} y={centerY + 8} textAnchor="middle" fontSize="32">
          {KIZUNA_TIERS[level].icon}
        </text>

        {/* Gradient definitions */}
        <defs>
          <linearGradient
            id="gradient-shrine"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6b46c1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient
            id="gradient-fill"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6b46c1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
