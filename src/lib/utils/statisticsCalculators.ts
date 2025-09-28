import type { DrillResult } from '$lib/types/DrillResult';
import type { StatsData, RecentActivity, MedalCounts } from '$lib/types/Statistics';
import type { Medal } from '$lib/types';
import { MEDAL_THRESHOLDS, CHART_COLORS, RECENT_ACTIVITIES_LIMIT } from '$lib/constants/statistics';
import { formatDate, formatTime } from './dateFormatters';

/**
 * Determines medal based on time in seconds
 */
export function getMedalForTime(seconds: number): Medal {
  if (seconds < MEDAL_THRESHOLDS.GOLD) return 'gold';
  if (seconds < MEDAL_THRESHOLDS.SILVER) return 'silver';
  if (seconds < MEDAL_THRESHOLDS.BRONZE) return 'bronze';
  return 'none';
}

/**
 * Gets color for chart points based on time
 */
export function getChartColor(seconds: number): string {
  const medal = getMedalForTime(seconds);
  switch (medal) {
    case 'gold': return CHART_COLORS.GOLD;
    case 'silver': return CHART_COLORS.SILVER;
    case 'bronze': return CHART_COLORS.BRONZE;
    default: return CHART_COLORS.DEFAULT;
  }
}

/**
 * Calculates comprehensive statistics from drill results
 */
export function calculateStats(results: DrillResult[]): StatsData {
  const totalDrills = results.length;

  // Calculate average time safely
  const validTimes = results
    .map(dr => dr.timeInSeconds)
    .filter(time => typeof time === 'number' && !isNaN(time) && time >= 0);

  const averageTime = validTimes.length > 0
    ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
    : 0;

  // Count medals
  const medals: MedalCounts = {
    gold: results.filter(dr => dr.medal === 'gold').length,
    silver: results.filter(dr => dr.medal === 'silver').length,
    bronze: results.filter(dr => dr.medal === 'bronze').length
  };

  // Get recent activities (last RECENT_ACTIVITIES_LIMIT)
  const recentActivities: RecentActivity[] = results
    .slice(0, RECENT_ACTIVITIES_LIMIT)
    .map(dr => ({
      date: formatDate(dr.date),
      time: formatTime(dr.timeInSeconds),
      medal: dr.medal
    }));

  return {
    totalDrills,
    averageTime: formatTime(averageTime),
    medals,
    recentActivities
  };
}