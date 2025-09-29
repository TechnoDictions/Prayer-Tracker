import React from 'react';
import { PrayerLog, PRAYER_NAMES, STATUS_COLORS } from '../types';

interface PrayerHistoryProps {
  log: PrayerLog;
}

const getDateKey = (date: Date) => date.toISOString().split('T')[0];

const PrayerHistory: React.FC<PrayerHistoryProps> = ({ log }) => {
  const logEntries = Object.keys(log);
  if (logEntries.length === 0) {
    return null; // Don't render if no history
  }

  const startDate = new Date(Math.min(...logEntries.map(key => new Date(key).getTime())));
  const today = new Date();

  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  // Ensure we don't get stuck in an infinite loop
  let safety = 0;
  while (currentDate <= today && safety < 365 * 5) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
    safety++;
  }
  
  const reversedDates = dates.reverse();

  const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700">
      <h2 className="text-2xl font-bold text-slate-100 mb-1">Prayer History</h2>
      <p className="text-slate-400 mb-6">A visual summary of your prayer consistency over time.</p>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-slate-700">
                        <th className="py-3 pr-4 font-semibold text-slate-300 w-24">Prayer</th>
                        {reversedDates.map(date => (
                            <th key={date.toISOString()} className="py-3 px-2 text-center font-medium text-slate-400 text-sm whitespace-nowrap">
                                {dateFormatter.format(date)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {PRAYER_NAMES.map(prayerName => (
                        <tr key={prayerName} className="border-b border-slate-800">
                            <td className="py-3 pr-4 font-bold text-slate-200">{prayerName}</td>
                            {reversedDates.map(date => {
                                const dateKey = getDateKey(date);
                                const status = log[dateKey]?.[prayerName] || 'Not Prayed';
                                const color = STATUS_COLORS[status];
                                return (
                                    <td key={date.toISOString()} className="py-3 px-2 text-center">
                                        <div className="flex justify-center items-center">
                                            <div 
                                                className="w-5 h-5 rounded-md" 
                                                style={{ backgroundColor: color }}
                                                title={`${prayerName} on ${dateFormatter.format(date)}: ${status}`}
                                            ></div>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default PrayerHistory;