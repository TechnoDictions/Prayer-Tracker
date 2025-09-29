import React, { useState, useEffect } from 'react';
import DailyTracker from './components/ImageUploader';
import Summary from './components/PromptControls';
import PrayerHistory from './components/PrayerHistory';
import { Prayer, PrayerName, PrayerLog, PRAYER_NAMES, DailyPrayers, PrayerStatus } from './types';
import { LogoIcon } from './components/icons/LogoIcon';
import Auth from './components/Auth';

const PRAYERS: Prayer[] = [
  { name: 'Fajr', time: 'Dawn' },
  { name: 'Dhuhr', time: 'Noon' },
  { name: 'Asr', time: 'Afternoon' },
  { name: 'Maghrib', time: 'Sunset' },
  { name: 'Isha', time: 'Night' },
];

// Helper to get date key in YYYY-MM-DD format
const getDateKey = (date: Date) => date.toISOString().split('T')[0];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [prayerLog, setPrayerLog] = useState<PrayerLog>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  // Check for logged-in user on initial load
  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem('currentUser');
      if (loggedInUser) {
        setCurrentUser(loggedInUser);
        const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userLog = allUserData[loggedInUser]?.prayerLog || {};
        setPrayerLog(userLog);
      }
    } catch (error) {
      console.error("Failed to initialize user session", error);
    }
  }, []);

  // Save prayer log whenever it changes for the current user
  useEffect(() => {
    if (currentUser) {
      try {
        const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        allUserData[currentUser] = { ...allUserData[currentUser], prayerLog };
        localStorage.setItem('userData', JSON.stringify(allUserData));
      } catch (error) {
        console.error("Failed to save prayer log", error);
      }
    }
  }, [prayerLog, currentUser]);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    const allUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userLog = allUserData[username]?.prayerLog || {};
    setPrayerLog(userLog);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPrayerLog({});
    localStorage.removeItem('currentUser');
  };

  const dateKey = getDateKey(currentDate);
  const todayPrayers = prayerLog[dateKey] || PRAYER_NAMES.reduce((acc, name) => {
    acc[name] = 'Not Prayed';
    return acc;
  }, {} as DailyPrayers);

  const handleUpdateStatus = (prayerName: PrayerName, status: PrayerStatus) => {
    setPrayerLog(prevLog => {
      const newLog = { ...prevLog };
      const currentDayPrayers = newLog[dateKey] || PRAYER_NAMES.reduce((acc, name) => {
        acc[name] = 'Not Prayed';
        return acc;
      }, {} as DailyPrayers);
      
      newLog[dateKey] = {
        ...currentDayPrayers,
        [prayerName]: status
      };
      
      return newLog;
    });
  };

  const handlePreviousDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const isToday = getDateKey(new Date()) === dateKey;

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col p-4 sm:p-6 lg:p-8">
        <header className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <LogoIcon className="w-10 h-10 text-sky-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                Prayer Tracker
              </h1>
              <p className="text-sm sm:text-base text-slate-400">
                Welcome, {currentUser}!
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-sm font-semibold"
          >
            Logout
          </button>
        </header>

        <main className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <DailyTracker
            prayers={PRAYERS}
            dailyStatus={todayPrayers}
            onUpdateStatus={handleUpdateStatus}
            currentDate={currentDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            isNextDayDisabled={isToday}
          />
          <Summary log={prayerLog} todayPrayers={todayPrayers} />
        </main>
        
        <section className="w-full max-w-4xl mx-auto mt-12">
           <PrayerHistory log={prayerLog} />
        </section>
      </div>
    </>
  );
};

export default App;
