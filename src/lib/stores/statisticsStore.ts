import { derived, writable } from 'svelte/store';
import { drillResults } from './drillResults';
import { weeklyTestStore } from './weeklyTestResults';
import { calculateStats } from '$lib/utils/statisticsCalculators';
import { deriveSessions, sortSessions } from '$lib/utils/weeklyDataProcessors';
import type { StatsData, SessionData, SortKey, SortDirection, ChartTab } from '$lib/types/Statistics';
import type { WeeklyTestData } from './weeklyTestResults';
import type { DrillResult } from '$lib/types/DrillResult';

// Table sorting store
interface TableSortState {
  sortKey: SortKey;
  sortDir: SortDirection;
}

export const tableSortStore = writable<TableSortState>({
  sortKey: 'date',
  sortDir: -1
});

// Chart tab store
export const chartTabStore = writable<ChartTab>('1-120');

/**
 * Derived store for drill statistics data
 * Automatically recalculates when drill results change
 */
export const statisticsData = derived(
  drillResults,
  ($drillResults: DrillResult[]): StatsData => {
    try {
      // Handle empty data case
      if (!$drillResults || $drillResults.length === 0) {
        return {
          totalDrills: 0,
          averageTime: '0.0s',
          medals: { gold: 0, silver: 0, bronze: 0 },
          recentActivities: []
        };
      }

      // Filter out invalid drill results
      const validResults = $drillResults.filter(result => 
        result && 
        result.date instanceof Date && 
        !isNaN(result.date.getTime()) &&
        typeof result.timeInSeconds === 'number' &&
        !isNaN(result.timeInSeconds)
      );

      return calculateStats(validResults);
    } catch (error) {
      console.error('Error calculating statistics:', error);
      // Return safe default
      return {
        totalDrills: 0,
        averageTime: '0.0s',
        medals: { gold: 0, silver: 0, bronze: 0 },
        recentActivities: []
      };
    }
  }
);

/**
 * Derived store for weekly test sessions data
 * Automatically recalculates when weekly test results change
 */
export const weeklySessionsData = derived(
  weeklyTestStore,
  ($weeklyTestStore: WeeklyTestData): SessionData[] => {
    try {
      // Handle empty/invalid data case
      if (!$weeklyTestStore) {
        return [];
      }

      // Ensure all test arrays exist
      const safeTestData: WeeklyTestData = {
        countingTest: Array.isArray($weeklyTestStore.countingTest) ? $weeklyTestStore.countingTest : [],
        wordMemoryTest: Array.isArray($weeklyTestStore.wordMemoryTest) ? $weeklyTestStore.wordMemoryTest : [],
        stroopTest: Array.isArray($weeklyTestStore.stroopTest) ? $weeklyTestStore.stroopTest : []
      };

      return deriveSessions(safeTestData);
    } catch (error) {
      console.error('Error deriving weekly sessions:', error);
      // Return safe default
      return [];
    }
  }
);

/**
 * Legacy alias for statisticsData (for backward compatibility)
 */
export const drillStatistics = statisticsData;

/**
 * Derived store for sorted weekly test sessions
 * Automatically sorts sessions based on current sort state
 */
export const sortedSessionsStore = derived(
  [weeklySessionsData, tableSortStore],
  ([$sessions, $sortState]): SessionData[] => {
    try {
      if (!$sessions || $sessions.length === 0) {
        return [];
      }

      return sortSessions($sessions, $sortState.sortKey, $sortState.sortDir);
    } catch (error) {
      console.error('Error sorting sessions:', error);
      return $sessions || [];
    }
  }
);

// Export types for convenience
export type { StatsData, SessionData, MedalCounts, RecentActivity, SortKey, SortDirection, ChartTab, SessionGroup } from '$lib/types/Statistics';