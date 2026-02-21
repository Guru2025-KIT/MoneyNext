'use client';

interface SpendingGaugeProps {
  current: number;
  limit: number;
  size?: number;
}

export default function SpendingGauge({ current, limit, size = 180 }: SpendingGaugeProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;
  
  const getColor = () => {
    if (percentage < 70) return '#10b981';
    if (percentage < 90) return '#f59e0b';
    return '#ef4444';
  };
  
  const color = getColor();
  const radius = size * 0.4;
  const centerX = size / 2;
  const centerY = size / 2 + 20;
  
  const needleX = centerX + radius * Math.cos((angle * Math.PI) / 180);
  const needleY = centerY + radius * Math.sin((angle * Math.PI) / 180);
  
  return (
    <svg width={size} height={size} className="overflow-visible">
      <defs>
        <linearGradient id="gaugeGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      
      {/* Background arc */}
      <path
        d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="20"
        strokeLinecap="round"
      />
      
      {/* Progress arc */}
      <path
        d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 ${percentage > 50 ? 1 : 0} 1 ${needleX} ${needleY}`}
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth="20"
        strokeLinecap="round"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
        }}
      />
      
      {/* Center dot */}
      <circle
        cx={centerX}
        cy={centerY}
        r="8"
        fill="white"
        stroke={color}
        strokeWidth="3"
      />
      
      {/* Percentage text */}
      <text
        x={centerX}
        y={centerY + 40}
        textAnchor="middle"
        className="text-3xl font-bold"
        fill={color}
      >
        {percentage.toFixed(0)}%
      </text>
      
      <text
        x={centerX}
        y={centerY + 60}
        textAnchor="middle"
        className="text-xs fill-gray-500"
      >
        of ₹{Math.round(limit / 1000)}K limit
      </text>
    </svg>
  );
}
