import { writable, derived } from 'svelte/store';
import { dailyDrillPending } from './dailyDrill';

function createDayCounterStore() {
  // Initialize the store with a default value of 1 (Day 1)
  const { subscribe, set, update } = writable(1);

  return {
    subscribe,
    initialize: () => {
      // Get the first day from localStorage or default to 1
      const firstDayStr = localStorage.getItem('firstDrillDay');
      const lastDrillDateStr = localStorage.getItem('lastDrillDate');
      
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
        localStorage.setItem('firstDrillDay', today.toISOString());
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
      if (!localStorage.getItem('firstDrillDay')) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        localStorage.setItem('firstDrillDay', today.toISOString());
      }
    }
  };
}

export const dayCounter = createDayCounterStore();

// Create a formatted day counter for display
export const formattedDayCounter = derived(
  dayCounter,
  $dayCounter => `Day ${$dayCounter} of your math journey`
);