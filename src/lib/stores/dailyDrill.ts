import { writable } from 'svelte/store';

function createDailyDrillStore() {
  const { subscribe, set } = writable(true); // Start with pending state

  return {
    subscribe,
    markCompleted: () => {
      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Save completion date to localStorage
      localStorage.setItem('lastDrillDate', today.toISOString());
      set(false);
    },
    checkStatus: () => {
      const lastDrillDate = localStorage.getItem('lastDrillDate');
      if (!lastDrillDate) {
        set(true);
        return;
      }

      const lastDate = new Date(lastDrillDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // If the last drill was before today, set pending to true
      set(lastDate < today);
    }
  };
}

export const dailyDrillPending = createDailyDrillStore();
