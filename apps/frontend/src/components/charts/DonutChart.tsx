'use client';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export default function DonutChart({ data, size = 200 }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;
  
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle = endAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const innerRadius = size * 0.28;
    const outerRadius = size * 0.45;
    
    const x1 = size / 2 + outerRadius * Math.cos(startRad);
    const y1 = size / 2 + outerRadius * Math.sin(startRad);
    const x2 = size / 2 + outerRadius * Math.cos(endRad);
    const y2 = size / 2 + outerRadius * Math.sin(endRad);
    
    const x3 = size / 2 + innerRadius * Math.cos(endRad);
    const y3 = size / 2 + innerRadius * Math.sin(endRad);
    const x4 = size / 2 + innerRadius * Math.cos(startRad);
    const y4 = size / 2 + innerRadius * Math.sin(startRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');
    
    return {
      path: pathData,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(1),
    };
  });

  return (
    <div className="flex items-center gap-8">
      <svg width={size} height={size} className="drop-shadow-sm">
        {/* Subtle shadow circle */}
        <circle
          cx={size / 2}
          cy={size / 2 + 2}
          r={size * 0.46}
          fill="rgba(0,0,0,0.03)"
        />
        
        {/* Chart segments with hand-drawn effect */}
        {segments.map((seg, i) => (
          <g key={i}>
            <path
              d={seg.path}
              fill={seg.color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
              }}
            />
          </g>
        ))}
        
        {/* Center circle for donut hole */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.26}
          fill="white"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      </svg>
      
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-sm flex-shrink-0"
              style={{
                backgroundColor: seg.color,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{seg.label}</div>
              <div className="text-xs text-gray-500">{seg.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
