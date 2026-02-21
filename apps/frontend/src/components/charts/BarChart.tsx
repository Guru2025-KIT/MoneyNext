'use client';

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  height?: number;
}

export default function BarChart({ data, height = 250 }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 40;
  const width = 400;
  const chartHeight = height - padding * 2;
  const barWidth = (width - padding * 2) / data.length * 0.7;
  const barGap = (width - padding * 2) / data.length * 0.3;
  
  return (
    <svg width={width} height={height}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <g key={i}>
          <line
            x1={padding}
            y1={padding + chartHeight * ratio}
            x2={width - padding}
            y2={padding + chartHeight * ratio}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x={padding - 10}
            y={padding + chartHeight * ratio + 4}
            textAnchor="end"
            className="text-xs fill-gray-500"
          >
            {Math.round(maxValue * (1 - ratio) / 1000)}K
          </text>
        </g>
      ))}
      
      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = padding + i * (barWidth + barGap);
        const y = padding + chartHeight - barHeight;
        
        return (
          <g key={i}>
            {/* Shadow */}
            <rect
              x={x + 2}
              y={y + 2}
              width={barWidth}
              height={barHeight}
              fill="rgba(0,0,0,0.05)"
              rx="4"
            />
            
            {/* Bar */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={d.color}
              rx="4"
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
            
            {/* Value label */}
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              className="text-xs font-semibold fill-gray-700"
            >
              ₹{Math.round(d.value / 1000)}K
            </text>
            
            {/* Category label */}
            <text
              x={x + barWidth / 2}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
