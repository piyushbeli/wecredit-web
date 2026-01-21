'use client';

/**
 * Circular Countdown Timer Component
 * Displays a circular progress indicator with countdown text in the center
 */

import { JSX, useMemo } from 'react';

interface CountdownTimerProps {
  countdown: number;
  totalDuration: number;
}

/** Circular progress indicator size constants */
const CIRCLE_SIZE = 120;
const CIRCLE_STROKE_WIDTH = 10;
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE_WIDTH) / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

/**
 * Formats seconds as MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Countdown Timer Component
 * Displays a circular progress indicator that fills as countdown decreases
 * Shows formatted time (MM:SS) in the center
 */
const CountdownTimer = ({ countdown, totalDuration }: CountdownTimerProps): JSX.Element => {
  // Calculate progress percentage for circular indicator
  const progress = useMemo(() => {
    return ((totalDuration - countdown) / totalDuration) * 100;
  }, [countdown, totalDuration]);

  // Calculate stroke offset for progress circle
  const offset = useMemo(() => {
    return CIRCLE_CIRCUMFERENCE - (progress / 100) * CIRCLE_CIRCUMFERENCE;
  }, [progress]);

  return (
    <div className="relative w-[120px] h-[120px] mb-6">
      <svg
        className="transform -rotate-90 w-[120px] h-[120px]"
        viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
      >
        {/* Background circle */}
        <circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={CIRCLE_STROKE_WIDTH}
        />
        {/* Progress circle */}
        <circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="url(#countdownGradient)"
          strokeWidth={CIRCLE_STROKE_WIDTH}
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Countdown text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-slate-950 text-2xl font-medium font-['Poppins'] leading-none tracking-wide">
          {formatTime(countdown)}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
