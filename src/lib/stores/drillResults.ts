import { writable } from 'svelte/store';
import type { DrillResult } from '$lib/types/DrillResult';

const LOCAL_STORAGE_KEY = 'mathDrillResults';

function createDrillResultsStore() {
  // Load initial data from localStorage
  let initialResults: DrillResult[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const storedJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedJson) {
        const parsedData = JSON.parse(storedJson);
        // Ensure the data is an array
        if (Array.isArray(parsedData)) {
          // Convert date strings back to Date objects and adapt data structure
          initialResults = parsedData.map(item => ({
            id: item.id || crypto.randomUUID(), // Generate ID if missing
            date: new Date(item.date || item.timestamp), // Use timestamp if date is missing
            timeInSeconds: typeof item.timeInSeconds === 'number' ? item.timeInSeconds : 0, // Use timeInSeconds if available
            problemCount: typeof item.problemCount === 'number' ? item.problemCount : 10, // Default value if missing
            correctCount: typeof item.correctCount === 'number' ? item.correctCount : 10, // Default value if missing
            medal: item.medal || 'none' // Default to 'none' if missing
          }));
        }
      }
    } catch (error) {
      console.error('Failed to parse drill results from localStorage:', error);
      // Use empty array as fallback
      initialResults = [];
    }
  }

  const { subscribe, update, set } = writable<DrillResult[]>(initialResults);

  // Subscribe to store changes and save to localStorage
  subscribe((currentResults) => {
    if (typeof localStorage !== 'undefined') {
      try {
        // Convert Date objects to strings for JSON serialization
        const serializableResults = currentResults.map(result => ({
          ...result,
          date: result.date.toISOString()
        }));
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableResults));
      } catch (error) {
        console.error('Failed to save drill results to localStorage:', error);
      }
    }
  });

  return {
    subscribe,
    addResult: (result: DrillResult) => {
      update(results => [result, ...results]);
    },
    clearResults: () => {
      update(() => []);
    },
    // Method to manually set results (useful for testing)
    setResults: (results: DrillResult[]) => {
      set(results);
    }
  };
}

export const drillResults = createDrillResultsStore();
