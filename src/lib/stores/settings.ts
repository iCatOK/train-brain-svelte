import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'trainBrainSettings';

const defaultSettings = {
  dailyProblemsCount: 10
};

function loadFromLocalStorage() {
  if (typeof localStorage !== 'undefined') {
    try {
      const storedJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedJson) {
        const parsedData = JSON.parse(storedJson);
        return {
          dailyProblemsCount: typeof parsedData.dailyProblemsCount === 'number' ? parsedData.dailyProblemsCount : 10
        };
      }
    } catch (error) {
      console.error('Failed to parse settings from localStorage:', error);
    }
  }
  return defaultSettings;
}

const initialSettings = browser ? loadFromLocalStorage() : defaultSettings;

const store = writable(initialSettings);

if (browser) {
  store.set(loadFromLocalStorage());
}

store.subscribe((currentSettings) => {
  if (browser) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }
});

export const settings = store;