/**
 * Centralized reset service for the Train Brain application.
 *
 * This service coordinates reset operations across all stores and handles
 * the complete reset of user progress data. It ensures that all related
 * data is properly cleared and reset to initial states.
 *
 * @example
 * ```typescript
 * import { resetService } from '$lib/resetService';
 *
 * // Reset all user progress
 * resetService.resetAllProgress();
 * ```
 */

import { drillResults } from '$lib/stores/drillResults';
import { weeklyTestStore } from '$lib/stores/weeklyTestResults';
import { dayCounter } from '$lib/stores/dayCounter';
import { settings } from '$lib/stores/settings';
import { browser } from '$app/environment';

/**
 * Centralized reset service that coordinates all reset operations
 */
class ResetService {
  /**
   * Resets all user progress data including:
   * - Drill results
   * - Weekly test results
   * - Day counter and related localStorage data
   * - Settings are preserved (not reset)
   *
   * This method ensures all stores are reset in the correct order
   * and handles any dependencies between reset operations.
   */
  resetAllProgress(): void {
    try {
      // Reset drill results first
      drillResults.clearResults();

      // Reset weekly test results
      weeklyTestStore.clearAllResults();

      // Reset day counter (this handles localStorage cleanup)
      dayCounter.reset();

      console.log('All user progress has been reset successfully');
    } catch (error) {
      console.error('Failed to reset user progress:', error);
      throw new Error('Failed to reset user progress. Please try again.');
    }
  }

  /**
   * Resets only drill-related data:
   * - Drill results
   * - Day counter
   */
  resetDrillProgress(): void {
    try {
      drillResults.clearResults();
      dayCounter.reset();
      console.log('Drill progress has been reset successfully');
    } catch (error) {
      console.error('Failed to reset drill progress:', error);
      throw new Error('Failed to reset drill progress. Please try again.');
    }
  }

  /**
   * Resets only weekly test results
   */
  resetWeeklyTestProgress(): void {
    try {
      weeklyTestStore.clearAllResults();
      console.log('Weekly test progress has been reset successfully');
    } catch (error) {
      console.error('Failed to reset weekly test progress:', error);
      throw new Error('Failed to reset weekly test progress. Please try again.');
    }
  }

  /**
   * Resets settings to their default values
   */
  resetSettings(): void {
    try {
      settings.resetToDefaults();
      console.log('Settings have been reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw new Error('Failed to reset settings. Please try again.');
    }
  }

  /**
   * Safely removes legacy localStorage keys that may have been
   * set by older versions of the application
   */
  cleanupLegacyData(): void {
    if (!browser) return;

    const legacyKeys = [
      'firstDrillDay', // Now handled by dayCounter store
      'lastDrillDate', // Now handled by dayCounter store
    ];

    legacyKeys.forEach(key => {
      try {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`Cleaned up legacy localStorage key: ${key}`);
        }
      } catch (error) {
        console.warn(`Failed to cleanup legacy key ${key}:`, error);
      }
    });
  }
}

/**
 * Singleton instance of the reset service
 */
export const resetService = new ResetService();