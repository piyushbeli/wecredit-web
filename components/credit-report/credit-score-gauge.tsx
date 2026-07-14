'use client';

import { useEffect, useState, type ReactNode } from 'react';
import {
  getCreditScoreProgress,
  getScoreRatingClassName,
} from '@/lib/utils/credit-report-formatters';

interface CreditScoreGaugeProps {
  readonly score: number;
  readonly minimumScore: number;
  readonly maximumScore: number;
  readonly rating: string;
}

const VIEW_WIDTH = 280;
const VIEW_HEIGHT = 168;
const CENTER_X = 140;
const CENTER_Y = 150;
const RADIUS = 112;
const STROKE_WIDTH = 18;
const SEGMENT_COUNT = 60;
const ANIMATION_MS = 900;

interface ArcPoint {
  readonly x: number;
  readonly y: number;
}

interface GaugeSegment {
  readonly key: string;
  readonly path: string;
  readonly color: string;
}

function getArcPoint(progress: number): ArcPoint {
  const clamped = Math.min(1, Math.max(0, progress));
  const angle = Math.PI * (1 - clamped);
  return {
    x: CENTER_X + RADIUS * Math.cos(angle),
    y: CENTER_Y - RADIUS * Math.sin(angle),
  };
}

function buildSegmentPath(fromProgress: number, toProgress: number): string {
  const start = getArcPoint(fromProgress);
  const end = getArcPoint(toProgress);
  return `M ${start.x} ${start.y} A ${RADIUS} ${RADIUS} 0 0 1 ${end.x} ${end.y}`;
}

function getGaugeColorAt(progress: number): string {
  const stops: Array<{ t: number; color: [number, number, number] }> = [
    { t: 0, color: [226, 59, 59] },
    { t: 0.35, color: [240, 154, 46] },
    { t: 0.65, color: [232, 198, 26] },
    { t: 1, color: [31, 175, 90] },
  ];
  const t = Math.min(1, Math.max(0, progress));
  let left = stops[0];
  let right = stops[stops.length - 1];
  for (let index = 0; index < stops.length - 1; index += 1) {
    if (t >= stops[index].t && t <= stops[index + 1].t) {
      left = stops[index];
      right = stops[index + 1];
      break;
    }
  }
  const span = right.t - left.t || 1;
  const localT = (t - left.t) / span;
  const red = Math.round(left.color[0] + (right.color[0] - left.color[0]) * localT);
  const green = Math.round(left.color[1] + (right.color[1] - left.color[1]) * localT);
  const blue = Math.round(left.color[2] + (right.color[2] - left.color[2]) * localT);
  return `rgb(${red}, ${green}, ${blue})`;
}

function buildColoredSegments(animatedProgress: number): GaugeSegment[] {
  const segments: GaugeSegment[] = [];
  const activeCount = Math.max(1, Math.round(SEGMENT_COUNT * animatedProgress));
  for (let index = 0; index < activeCount; index += 1) {
    const fromProgress = index / SEGMENT_COUNT;
    const toProgress = Math.min(animatedProgress, (index + 1) / SEGMENT_COUNT);
    if (toProgress <= fromProgress) {
      continue;
    }
    const mid = (fromProgress + toProgress) / 2;
    segments.push({
      key: `seg-${index}`,
      path: buildSegmentPath(fromProgress, toProgress),
      color: getGaugeColorAt(mid),
    });
  }
  return segments;
}

/**
 * Semicircular credit-score gauge — continuous colour arc fills to the score.
 */
export function CreditScoreGauge({
  score,
  minimumScore,
  maximumScore,
  rating,
}: CreditScoreGaugeProps): ReactNode {
  const targetProgress = getCreditScoreProgress(score, minimumScore, maximumScore);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [displayScore, setDisplayScore] = useState(minimumScore);
  const trackPath = buildSegmentPath(0, 1);
  const tipPoint = getArcPoint(animatedProgress);
  const startPoint = getArcPoint(0);
  const hasProgress = animatedProgress > 0.01;
  const coloredSegments = buildColoredSegments(animatedProgress);
  const ratingClassName = getScoreRatingClassName(rating);

  useEffect(() => {
    let frameId = 0;
    const startedAt = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - startedAt) / ANIMATION_MS);
      const eased = 1 - (1 - t) ** 3;
      setAnimatedProgress(targetProgress * eased);
      setDisplayScore(Math.round(minimumScore + (score - minimumScore) * eased));
      if (t < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };
    frameId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [score, minimumScore, targetProgress]);

  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`Credit score ${score} out of ${minimumScore} to ${maximumScore}, rated ${rating}`}
      >
        <path
          d={trackPath}
          fill="none"
          stroke="#E7ECF3"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
        {coloredSegments.map((segment) => (
          <path
            key={segment.key}
            d={segment.path}
            fill="none"
            stroke={segment.color}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="butt"
          />
        ))}
        {hasProgress ? (
          <>
            <circle
              cx={startPoint.x}
              cy={startPoint.y}
              r={STROKE_WIDTH / 2}
              fill={getGaugeColorAt(0)}
              aria-hidden
            />
            <circle
              cx={tipPoint.x}
              cy={tipPoint.y}
              r={STROKE_WIDTH / 2}
              fill={getGaugeColorAt(animatedProgress)}
              aria-hidden
            />
          </>
        ) : null}
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center">
        <p className="text-[48px] font-bold leading-none tracking-tight text-[#1F2937] lg:text-[52px]">
          {displayScore}
        </p>
        <p className={`mt-1 text-sm font-bold uppercase tracking-[0.08em] ${ratingClassName}`}>
          {rating}
        </p>
      </div>
    </div>
  );
}
