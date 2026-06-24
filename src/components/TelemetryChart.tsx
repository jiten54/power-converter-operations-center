import React, { useState, useEffect } from "react";

interface TelemetryChartProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  maxLimit: number;
  minLimit: number;
}

export default function TelemetryChart({
  label,
  value,
  unit,
  color,
  maxLimit,
  minLimit
}: TelemetryChartProps) {
  const [history, setHistory] = useState<number[]>([]);
  const maxPoints = 40;

  useEffect(() => {
    setHistory((prev) => {
      const next = [...prev, value];
      if (next.length > maxPoints) {
        next.shift();
      }
      return next;
    });
  }, [value]);

  // SVG parameters
  const width = 360;
  const height = 110;
  const paddingX = 10;
  const paddingY = 15;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Find min/max in current history to scale
  const activeMin = history.length > 0 ? Math.min(...history) : minLimit;
  const activeMax = history.length > 0 ? Math.max(...history) : maxLimit;
  const range = activeMax - activeMin || 1;

  // Add padding to chart boundaries
  const yMin = activeMin - range * 0.1;
  const yMax = activeMax + range * 0.1;
  const yRange = yMax - yMin;

  const points = history.map((val, idx) => {
    const x = paddingX + (idx / (maxPoints - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((val - yMin) / yRange) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="bg-[#161a23] rounded-xl border border-slate-800 p-4 flex flex-col font-mono animate-fade-in" id={`telemetry-chart-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
        <span className="font-semibold uppercase tracking-wider">{label}</span>
        <span className="text-[10px] text-slate-500">Limits: {minLimit} - {maxLimit} {unit}</span>
      </div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-2xl font-bold tracking-tight text-white flex items-baseline">
          {value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
          <span className="text-xs font-normal text-slate-400 ml-1">{unit}</span>
        </span>
        <div className="flex space-x-2 text-[9px] text-slate-500">
          <span>MIN: {Math.min(...history, value).toFixed(1)}</span>
          <span>MAX: {Math.max(...history, value).toFixed(1)}</span>
        </div>
      </div>

      <div className="relative flex-1 min-h-[100px] bg-[#0b0e14] rounded-md overflow-hidden border border-slate-800/60">
        {/* Horizontal & Vertical grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%">
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
          </svg>
        </div>

        {/* Live SVG Graph line */}
        {history.length > 1 && (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Gradient shadow area */}
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`M ${paddingX},${paddingY + chartHeight} L ${points} L ${paddingX + ((history.length - 1) / (maxPoints - 1)) * chartWidth},${paddingY + chartHeight} Z`}
              fill={`url(#gradient-${label})`}
              className="transition-all duration-300"
            />
            {/* Primary waveform line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
              className="transition-all duration-300"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Blinking sweeping dot at current reading */}
            <circle
              cx={paddingX + ((history.length - 1) / (maxPoints - 1)) * chartWidth}
              cy={paddingY + chartHeight - ((value - yMin) / yRange) * chartHeight}
              r="4"
              fill={color}
              className="animate-pulse"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
