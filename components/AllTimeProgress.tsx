import React from 'react';
import { PrayerLog, PRAYER_NAMES, PRAYER_STATUSES, PrayerStatus, STATUS_COLORS } from '../types';

interface AllTimeProgressProps {
  log: PrayerLog;
}

const STATUS_DISPLAY_ORDER: PrayerStatus[] = ['Jama\'ah', 'Alone', 'Late', 'Not Prayed'];

const AllTimeProgress: React.FC<AllTimeProgressProps> = ({ log }) => {
  if (Object.keys(log).length === 0) {
      return (
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-slate-200">All-Time Progress</h3>
              <div className="text-center py-8 text-slate-400">
                  <p>No prayer data logged yet.</p>
                  <p className="text-sm">Start tracking to see your summary.</p>
              </div>
          </div>
      );
  }

  const overallStats = PRAYER_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<PrayerStatus, number>);

  const perPrayerStats = PRAYER_NAMES.reduce((acc, name) => {
    acc[name] = PRAYER_STATUSES.reduce((sAcc, s) => {
      sAcc[s] = 0;
      return sAcc;
    }, {} as Record<PrayerStatus, number>);
    return acc;
  }, {} as Record<typeof PRAYER_NAMES[number], Record<PrayerStatus, number>>);

  let totalLoggedPrayers = 0;

  Object.values(log).forEach(day => {
    PRAYER_NAMES.forEach(prayerName => {
        const status = day[prayerName] || 'Not Prayed';
        overallStats[status]++;
        perPrayerStats[prayerName][status]++;
        totalLoggedPrayers++;
    });
  });

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-slate-200">All-Time Progress</h3>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8">
        {STATUS_DISPLAY_ORDER.map(status => {
          const percentage = totalLoggedPrayers > 0 ? ((overallStats[status] / totalLoggedPrayers) * 100).toFixed(0) : 0;
          const displayName = status === "Jama'ah" ? 'In Jama\'ah' : status;
          return (
            <div key={status} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-md" style={{ backgroundColor: STATUS_COLORS[status] }}></div>
              <span className="text-slate-300">{displayName} ({percentage}%)</span>
            </div>
          );
        })}
      </div>

      {/* Per Prayer Bars */}
      <div className="space-y-6">
        {PRAYER_NAMES.map(prayerName => {
          const prayerTotals = perPrayerStats[prayerName];
          const totalForPrayer = Object.values(prayerTotals).reduce((sum, count) => sum + count, 0);
          
          if (totalForPrayer === 0) return null;

          return (
            <div key={prayerName}>
              <div className="flex items-center justify-between mb-2">
                 <p className="font-bold text-slate-100">{prayerName}</p>
                 <div className="flex items-center gap-3 text-sm text-slate-400">
                    {STATUS_DISPLAY_ORDER.map(status => {
                        const percentage = totalForPrayer > 0 ? ((prayerTotals[status] / totalForPrayer) * 100) : 0;
                        if (percentage > 0) {
                            return (
                                <div key={status} className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: STATUS_COLORS[status]}}></div>
                                    <span>{percentage.toFixed(0)}%</span>
                                </div>
                            );
                        }
                        return null;
                    })}
                 </div>
              </div>

              {/* Stacked Bar */}
              <div className="flex w-full h-3.5 rounded-full overflow-hidden bg-slate-700">
                 {STATUS_DISPLAY_ORDER.map(status => {
                    const percentage = totalForPrayer > 0 ? ((prayerTotals[status] / totalForPrayer) * 100) : 0;
                     if (percentage > 0) {
                         return (
                            <div 
                                key={status}
                                className="h-full"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: STATUS_COLORS[status]
                                }}
                                title={`${status}: ${percentage.toFixed(0)}%`}
                            ></div>
                         );
                     }
                     return null;
                 })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTimeProgress;
