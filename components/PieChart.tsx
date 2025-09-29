import React, { useState } from 'react';
import { PrayerStatus, STATUS_COLORS, PRAYER_STATUSES } from '../types';

interface PieChartProps {
  stats: Record<PrayerStatus, number>;
  totalPrayers: number;
}

const STATUS_DISPLAY_ORDER: PrayerStatus[] = ['Jama\'ah', 'Alone', 'Late', 'Not Prayed'];

const PieChart: React.FC<PieChartProps> = ({ stats, totalPrayers }) => {
  const [hoveredSlice, setHoveredSlice] = useState<PrayerStatus | null>(null);

  const total = Object.values(stats).reduce((sum, value) => sum + value, 0);

  if (total === 0) {
    return <div className="text-center py-8 text-slate-400">No data for summary yet.</div>;
  }
  
  const pieData = STATUS_DISPLAY_ORDER.map(status => ({
    status,
    value: stats[status],
    percentage: total > 0 ? (stats[status] / total) * 100 : 0,
    color: STATUS_COLORS[status],
  }));

  let cumulativePercentage = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
        <div className="relative w-40 h-40 shrink-0">
            <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)' }}>
                {pieData.map(slice => {
                    if (slice.percentage === 0) return null;

                    const [startX, startY] = getCoordinatesForPercent(cumulativePercentage / 100);
                    cumulativePercentage += slice.percentage;
                    const [endX, endY] = getCoordinatesForPercent(cumulativePercentage / 100);

                    const largeArcFlag = slice.percentage > 50 ? 1 : 0;
                    
                    const pathData = [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(' ');

                    return (
                        <path
                            key={slice.status}
                            d={pathData}
                            fill={slice.color}
                            onMouseEnter={() => setHoveredSlice(slice.status)}
                            onMouseLeave={() => setHoveredSlice(null)}
                            className="transition-transform duration-200"
                            style={{transform: hoveredSlice === slice.status ? 'scale(1.05)' : 'scale(1)'}}
                        />
                    );
                })}
                 <circle cx="0" cy="0" r="0.65" fill="#1e293b" />
            </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                 {hoveredSlice ? (
                     <>
                        <span className="text-3xl font-bold tracking-tight" style={{color: STATUS_COLORS[hoveredSlice]}}>{pieData.find(s => s.status === hoveredSlice)?.percentage.toFixed(0)}%</span>
                        <span className="text-xs text-slate-400">{hoveredSlice}</span>
                     </>
                 ) : (
                    <>
                        <span className="text-3xl font-bold text-sky-400 tracking-tight">{totalPrayers}</span>
                        <span className="text-xs text-slate-400">Prayers</span>
                    </>
                 )}
            </div>
        </div>

        <div className="flex flex-col gap-2">
            {pieData.map(slice => (
                <div key={slice.status} className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: slice.color }}></div>
                    <span className="text-slate-300 w-20">{slice.status}</span>
                    <span className="font-medium text-slate-400">{slice.percentage.toFixed(0)}%</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default PieChart;
