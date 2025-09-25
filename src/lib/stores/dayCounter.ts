import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { dailyDrillPending } from './dailyDrill';
import { _ } from 'svelte-i18n'; // Add this import

function createDayCounterStore() {
  // Initialize the store with a default value of 1 (Day 1)
  const { subscribe, set, update } = writable(1);

  /**
   * Safely gets an item from localStorage
   */
  function getLocalStorageItem(key: string): string | null {
    if (!browser) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Safely sets an item in localStorage
   */
  function setLocalStorageItem(key: string, value: string): void {
    if (!browser) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage:`, error);
    }
  }

  /**
   * Safely removes an item from localStorage
   */
  function removeLocalStorageItem(key: string): void {
    if (!browser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error);
    }
  }

  return {
    subscribe,
    initialize: () => {
      // Get the first day from localStorage or default to 1
      const firstDayStr = getLocalStorageItem('firstDrillDay');
      const lastDrillDateStr = getLocalStorageItem('lastDrillDate');

      if (!firstDayStr && !lastDrillDateStr) {
        // User has never done a drill, so it's Day 1
        set(1);
        return;
      }

      if (!firstDayStr && lastDrillDateStr) {
        // User has done a drill but we don't have a first day record
        // Set today as the first day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setLocalStorageItem('firstDrillDay', today.toISOString());
        set(1);
        return;
      }

      // Calculate days since first drill
      const firstDay = new Date(firstDayStr || new Date().toISOString());
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate the difference in days
      const diffTime = Math.abs(today.getTime() - firstDay.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Day count is diffDays + 1 (including the first day)
      set(diffDays + 1);
    },
    recordFirstDay: () => {
      // Only set the first day if it doesn't exist yet
      if (!getLocalStorageItem('firstDrillDay')) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setLocalStorageItem('firstDrillDay', today.toISOString());
      }
    },
    /**
     * Resets the day counter by clearing localStorage and resetting to day 1
     */
    reset: () => {
      removeLocalStorageItem('firstDrillDay');
      removeLocalStorageItem('lastDrillDate');
      set(1);
    }
  };
}

export const dayCounter = createDayCounterStore();

// Create a formatted day counter for display
export const formattedDayCounter = derived(
  [dayCounter, _],
  ([$dayCounter, $locale]) => $locale('journey.day',  { values: { number: $dayCounter } })
);