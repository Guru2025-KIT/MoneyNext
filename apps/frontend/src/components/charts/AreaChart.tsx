'use client';

interface AreaChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export default function AreaChart({ data, height = 200, color = '#3b82f6' }: AreaChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 20;
  const width = 400;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (d.value / maxValue) * chartHeight;
    return { x, y, value: d.value, label: d.label };
  });
  
  const pathData = points.map((p, i) => 
    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
  ).join(' ');
  
  const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
        
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + chartHeight * ratio}
          x2={width - padding}
          y2={padding + chartHeight * ratio}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}
      
      {/* Area fill */}
      <path
        d={areaData}
        fill="url(#areaGradient)"
      />
      
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      
      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill="white"
            stroke={color}
            strokeWidth="3"
            className="cursor-pointer hover:r-6 transition-all"
          />
          <circle
            cx={p.x}
            cy={p.y}
            r="2"
            fill={color}
          />
        </g>
      ))}
      
      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={height - 5}
          textAnchor="middle"
          className="text-xs fill-gray-600"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}
