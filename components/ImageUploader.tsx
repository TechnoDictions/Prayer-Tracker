import React, { useState } from 'react';
import { Prayer, PrayerName, DailyPrayers, PrayerStatus, STATUS_STYLES, PRAYER_STATUSES } from '../types';

interface DailyTrackerProps {
  prayers: Prayer[];
  dailyStatus: DailyPrayers;
  onUpdateStatus: (prayerName: PrayerName, status: PrayerStatus) => void;
  currentDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  isNextDayDisabled: boolean;
}

const statusButtons: { status: PrayerStatus; color: string; hover: string }[] = [
    { status: 'Jama\'ah', color: 'bg-green-500', hover: 'hover:bg-green-600' },
    { status: 'Alone', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
    { status: 'Late', color: 'bg-red-500', hover: 'hover:bg-red-600' },
    { status: 'Not Prayed', color: 'bg-slate-500', hover: 'hover:bg-slate-600' },
];

const DailyTracker: React.FC<DailyTrackerProps> = ({
  prayers,
  dailyStatus,
  onUpdateStatus,
  currentDate,
  onPreviousDay,
  onNextDay,
  isNextDayDisabled,
}) => {
  const [expandedPrayer, setExpandedPrayer] = useState<PrayerName | null>(null);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const isToday = new Date().toDateString() === currentDate.toDateString();

  const handlePrayerClick = (prayerName: PrayerName) => {
    setExpandedPrayer(prev => (prev === prayerName ? null : prayerName));
  };
  
  const handleStatusSelect = (prayerName: PrayerName, status: PrayerStatus) => {
      onUpdateStatus(prayerName, status);
      setExpandedPrayer(null);
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100">
          {isToday ? 'Today\'s Prayers' : dateFormatter.format(currentDate)}
        </h2>
        <div className="flex items-center justify-center gap-4 mt-2">
          <button onClick={onPreviousDay} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">&larr; Prev</button>
          <button onClick={onNextDay} disabled={isNextDayDisabled} className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next &rarr;</button>
        </div>
      </div>
      <div className="space-y-2">
        {prayers.map((prayer) => {
          const status: PrayerStatus = dailyStatus[prayer.name] || 'Not Prayed';
          const styles = STATUS_STYLES[status];
          const isExpanded = expandedPrayer === prayer.name;

          return (
            <div
              key={prayer.name}
              className={`rounded-lg border transition-all duration-300 ${styles.bg} ${styles.border} ${isExpanded ? 'bg-slate-700/50' : ''}`}
            >
              <button
                onClick={() => handlePrayerClick(prayer.name)}
                aria-label={`Update status for ${prayer.name}`}
                aria-expanded={isExpanded}
                className={`w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg`}
              >
                <div className="text-left">
                  <p className={`font-bold text-lg ${status === 'Not Prayed' ? 'text-slate-300' : 'text-slate-100'}`}>{prayer.name}</p>
                  <p className="text-sm text-slate-400">{prayer.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${styles.text}`}>{status}</span>
                  <div className={`w-3 h-3 rounded-full ${status === 'Jama\'ah' ? 'bg-green-500' : status === 'Alone' ? 'bg-yellow-500' : status === 'Late' ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                </div>
              </button>
              {isExpanded && (
                <div className="p-4 pt-0">
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                     {statusButtons.map(btn => (
                        <button
                          key={btn.status}
                          onClick={() => handleStatusSelect(prayer.name, btn.status)}
                          className={`w-full text-white text-sm font-semibold py-2 rounded-md transition-colors duration-200 ${btn.color} ${btn.hover}`}
                        >
                          {btn.status}
                        </button>
                     ))}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyTracker;