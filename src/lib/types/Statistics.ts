import type { Medal } from '$lib/types';

export interface SessionData {
  date: string;
  dateStr: string;
  countingTime: string;
  wordAccuracy: string;
  stroopTime: string;
  wordAccuracyNum: number | null;
  countingNum: number | null;
  stroopNum: number | null;
}

export interface StatsData {
  totalDrills: number;
  averageTime: string;
  medals: MedalCounts;
  recentActivities: RecentActivity[];
}

export interface MedalCounts {
  gold: number;
  silver: number;
  bronze: number;
}

export interface RecentActivity {
  date: string;
  time: string;
  medal: Medal;
}

export type SortKey = 'date' | 'counting' | 'word' | 'stroop';
export type SortDirection = 1 | -1;
export type ChartTab = '1-120' | 'word' | 'stroop';

export interface SessionGroup {
  counting?: import('$lib/stores/weeklyTestResults').CountingTestResult;
  word?: import('$lib/stores/weeklyTestResults').WordMemoryTestResult;
  stroop?: import('$lib/stores/weeklyTestResults').StroopTestResult;
}