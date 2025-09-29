import React from 'react';
import { PrayerLog, DailyPrayers, PRAYER_NAMES, PrayerStatus, PRAYER_STATUSES } from '../types';
import { ProgressBar } from './Loader';
import AllTimeProgress from './AllTimeProgress';
import PieChart from './PieChart';

interface SummaryProps {
  log: PrayerLog;
  todayPrayers: DailyPrayers;
}

const getDateKey = (date: Date) => date.toISOString().split('T')[0];

const calculateStreak = (log: PrayerLog): number => {
  let streak = 0;
  let currentDate = new Date();
  
  const todayKey = getDateKey(currentDate);
  const todayHasPrayer = log[todayKey] && Object.values(log[todayKey]).some(s => s !== 'Not Prayed');

  // If today has no completed prayers logged, the streak count should start from yesterday.
  if (!todayHasPrayer) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dateKey = getDateKey(currentDate);
    const dayLog = log[dateKey];
    const hasCompletedPrayer = dayLog && Object.values(dayLog).some(s => s !== 'Not Prayed');

    if (hasCompletedPrayer) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // End of streak
    }
  }
  return streak;
};


const Summary: React.FC<SummaryProps> = ({ log, todayPrayers }) => {
  const completedToday = Object.values(todayPrayers).filter(status => status !== 'Not Prayed').length;
  const todayProgress = (completedToday / PRAYER_NAMES.length) * 100;

  const overallStats = PRAYER_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<PrayerStatus, number>);

  Object.values(log).forEach(day => {
    Object.values(day).forEach(status => {
      overallStats[status]++;
    });
  });
  
  const totalPrayers = Object.values(overallStats).reduce((sum, count, index) => {
    if (PRAYER_STATUSES[index] !== 'Not Prayed') {
      return sum + count;
    }
    return sum;
  }, 0);

  const currentStreak = calculateStreak(log);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-slate-200">Today's Summary</h3>
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-400">Progress</p>
          <p className="font-semibold text-sky-400">{completedToday} / {PRAYER_NAMES.length}</p>
        </div>
        <ProgressBar value={todayProgress} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
          <p className="text-sm text-slate-400">Current Streak</p>
          <p className="text-3xl font-bold text-sky-400 tracking-tight">{currentStreak} <span className="text-lg font-medium text-slate-300">days</span></p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
          <p className="text-sm text-slate-400">Total Prayers</p>
          <p className="text-3xl font-bold text-sky-400 tracking-tight">{totalPrayers}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-slate-200">Overall Summary</h3>
        <PieChart stats={overallStats} totalPrayers={totalPrayers} />
      </div>

      <AllTimeProgress log={log} />
    </div>
  );
};

export default Summary;