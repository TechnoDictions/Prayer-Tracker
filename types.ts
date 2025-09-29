export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export const PRAYER_STATUSES = ['Not Prayed', 'Jama\'ah', 'Alone', 'Late'] as const;

export type PrayerName = typeof PRAYER_NAMES[number];
export type PrayerStatus = typeof PRAYER_STATUSES[number];

export interface Prayer {
  name: PrayerName;
  time: string;
}

export type DailyPrayers = Record<PrayerName, PrayerStatus>;
export type PrayerLog = Record<string, DailyPrayers>; // Key is 'YYYY-MM-DD'

export const STATUS_COLORS: Record<PrayerStatus, string> = {
  'Jama\'ah': '#22c55e', // green-500
  'Alone': '#eab308', // yellow-500
  'Late': '#ef4444', // red-500
  'Not Prayed': '#64748b', // slate-500
};

export const STATUS_STYLES: Record<PrayerStatus, { bg: string; border: string; text: string; }> = {
    'Jama\'ah': {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
    },
    'Alone': {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
        text: 'text-yellow-400',
    },
    'Late': {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
    },
    'Not Prayed': {
        bg: 'bg-slate-800',
        border: 'border-slate-700',
        text: 'text-slate-300',
    },
};
