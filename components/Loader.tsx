import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const percentage = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="bg-sky-500 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
