import { writable } from 'svelte/store';
import type { DrillResult } from '$lib/types/DrillResult';
import type { WeeklyTestData, CountingTestResult, WordMemoryTestResult, StroopTestResult } from '$lib/stores/weeklyTestResults';
import type { Medal } from '$lib/types';

export interface DebugState {
  isEnabled: boolean;
  activeGenerators: Set<string>;
}

export interface GeneratorOptions {
  days?: number;
  participationRate?: number; // 0.0 to 1.0 - percentage of days/weeks user participates
  pattern?: 'random' | 'improving' | 'consistent' | 'declining';
  medalDistribution?: { gold: number; silver: number; bronze: number; none: number };
}

export interface TestDataGenerator<T> {
  name: string;
  description: string;
  generate(options: GeneratorOptions): T[];
  clear(): void;
}

function createDebugStore() {
  const initialState: DebugState = {
    isEnabled: false,
    activeGenerators: new Set()
  };

  const { subscribe, update, set } = writable(initialState);

  // Medal thresholds (matching statistics page constants)
  const MEDAL_THRESHOLDS = {
    GOLD: 30,
    SILVER: 60,
    BRONZE: 90
  };

  /**
   * Generates random time based on medal distribution
   */
  function generateTimeForMedal(medal: Medal): number {
    switch (medal) {
      case 'gold': return Math.random() * MEDAL_THRESHOLDS.GOLD;
      case 'silver': return MEDAL_THRESHOLDS.GOLD + Math.random() * (MEDAL_THRESHOLDS.SILVER - MEDAL_THRESHOLDS.GOLD);
      case 'bronze': return MEDAL_THRESHOLDS.SILVER + Math.random() * (MEDAL_THRESHOLDS.BRONZE - MEDAL_THRESHOLDS.SILVER);
      case 'none': return MEDAL_THRESHOLDS.BRONZE + Math.random() * 60;
      default: return 60;
    }
  }

  /**
   * Applies time progression pattern
   */
  function applyPattern(baseTime: number, dayIndex: number, totalDays: number, pattern: string): number {
    switch (pattern) {
      case 'improving':
        // Start worse, get better over time
        const improvementFactor = 1 - (dayIndex / totalDays) * 0.4;
        return baseTime * improvementFactor;
      case 'declining':
        // Start better, get worse over time  
        const declineFactor = 1 + (dayIndex / totalDays) * 0.3;
        return baseTime * declineFactor;
      case 'consistent':
        // Small random variations around base time
        return baseTime * (0.9 + Math.random() * 0.2);
      default: // random
        return baseTime;
    }
  }

  /**
   * Selects medal based on distribution weights
   */
  function selectMedal(distribution: NonNullable<GeneratorOptions['medalDistribution']>): Medal {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [medal, weight] of Object.entries(distribution)) {
      cumulative += weight;
      if (rand <= cumulative) {
        return medal as Medal;
      }
    }
    return 'none';
  }

  /**
   * Generates realistic drill results with various patterns
   * Business rule: Maximum 1 drill result per day
   */
  function generateDrillResults(options: GeneratorOptions = {}): DrillResult[] {
    const {
      days = 30,
      participationRate = 0.6, // 60% participation by default
      pattern = 'random',
      medalDistribution = { gold: 0.15, silver: 0.25, bronze: 0.35, none: 0.25 }
    } = options;

    const results: DrillResult[] = [];
    const now = new Date();

    for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
      if (Math.random() > participationRate) continue;

      const date = new Date(now);
      date.setDate(date.getDate() - dayOffset);
      date.setHours(0, 0, 0, 0); // normalize to start of day

      const medal = selectMedal(medalDistribution);
      const baseTime = generateTimeForMedal(medal);
      const timeInSeconds = Math.max(10, applyPattern(baseTime, dayOffset, days, pattern));
      const timeWithVariation = timeInSeconds + (Math.random() - 0.5) * 10;
      const finalTime = Math.max(10, timeWithVariation);

      results.push({
        id: crypto.randomUUID(),
        date,
        timeInSeconds: finalTime,
        problemCount: 10,
        correctCount: 10,
        medal
      });
    }

    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Generates realistic weekly test results
   * Business rule: Maximum 1 test result per week (every 7 days)
   */
  function generateWeeklyTestData(options: GeneratorOptions = {}): WeeklyTestData {
    const {
      days = 30,
      pattern = 'improving',
      participationRate = 0.7 // 70% participation in weekly tests by default
    } = options;
    const now = new Date();

    const countingTest: CountingTestResult[] = [];
    const wordMemoryTest: WordMemoryTestResult[] = [];
    const stroopTest: StroopTestResult[] = [];

    // Calculate number of weeks to generate
    const totalWeeks = Math.floor(days / 7);
    
    // Generate data for each week (starting from oldest)
    for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
      // Check if user participated this week (based on participation rate)
      if (Math.random() > participationRate) {
        continue; // Skip this week
      }

      // Calculate the date for this week (always on the same day of week for consistency)
      const date = new Date(now);
      date.setDate(date.getDate() - (totalWeeks - weekIndex) * 7);
      
      // Counting test (1-120 exercise) - target time around 40-80 seconds
      const baseCountingTime = 50 + Math.random() * 30;
      const countingTime = Math.max(20, applyPattern(baseCountingTime, weekIndex, totalWeeks, pattern));
      
      countingTest.push({
        date: date.toISOString(),
        time: Math.round(countingTime)
      });

      // Word memory test - accuracy typically 60-95%
      const baseAccuracy = 0.65 + Math.random() * 0.25;
      let accuracy = baseAccuracy;
      
      if (pattern === 'improving') {
        accuracy = Math.min(0.95, baseAccuracy + (weekIndex / totalWeeks) * 0.3);
      } else if (pattern === 'declining') {
        accuracy = Math.max(0.4, baseAccuracy - (weekIndex / totalWeeks) * 0.2);
      }
      
      const recalledCount = Math.round(20 * accuracy);
      
      wordMemoryTest.push({
        date: date.toISOString(),
        wordsPresentedCount: 20,
        wordsRecalledCount: Math.max(1, Math.min(20, recalledCount))
      });

      // Stroop test - similar to counting, but typically faster
      const baseStroopTime = 25 + Math.random() * 15;
      const stroopTime = Math.max(15, applyPattern(baseStroopTime, weekIndex, totalWeeks, pattern));
      
      stroopTest.push({
        date: date.toISOString(),
        time: Math.round(stroopTime)
      });
    }

    return {
      countingTest,
      wordMemoryTest,
      stroopTest
    };
  }

  return {
    subscribe,
    // State management
    enable: () => update(state => ({ ...state, isEnabled: true })),
    disable: () => update(state => ({ ...state, isEnabled: false })),
    toggle: () => update(state => ({ ...state, isEnabled: !state.isEnabled })),
    
    // Data generators
    generateDrillResults,
    generateWeeklyTestData,
    
    // Generator presets
    presets: {
      beginner: {
        days: 14,
        participationRate: 0.4, // 40% - inconsistent, just starting
        pattern: 'improving' as const,
        medalDistribution: { gold: 0.05, silver: 0.15, bronze: 0.4, none: 0.4 }
      },
      intermediate: {
        days: 30,
        participationRate: 0.7, // 70% - regular user, some gaps
        pattern: 'consistent' as const,
        medalDistribution: { gold: 0.2, silver: 0.3, bronze: 0.3, none: 0.2 }
      },
      expert: {
        days: 60,
        participationRate: 0.85, // 85% - dedicated user, rare gaps
        pattern: 'random' as const,
        medalDistribution: { gold: 0.4, silver: 0.3, bronze: 0.2, none: 0.1 }
      },
      realistic: {
        days: 45,
        participationRate: 0.6, // 60% - real-world usage with breaks
        pattern: 'improving' as const,
        medalDistribution: { gold: 0.15, silver: 0.25, bronze: 0.35, none: 0.25 }
      }
    }
  };
}

export const debugStore = createDebugStore();