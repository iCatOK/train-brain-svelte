/**
 * Settings store for the Train Brain application.
 *
 * This store manages user preferences, particularly the number of daily problems to solve.
 * It provides persistence via localStorage, validation, and reactive updates.
 *
 * @example
 * ```typescript
 * import { settings } from '$lib/stores/settings';
 *
 * // Subscribe to settings changes
 * settings.subscribe(currentSettings => {
 *   console.log('Daily problems:', currentSettings.dailyProblemsCount);
 * });
 *
 * // Update settings
 * settings.updateSettings({ dailyProblemsCount: 50 });
 * ```
 */

import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Settings } from '$lib/types';
import { onboarding } from './onboarding';

const LOCAL_STORAGE_KEY = 'trainBrainSettings';

/**
 * Default settings values used when no stored settings are available or validation fails.
 */
const defaultSettings: Settings = {
  dailyProblemsCount: 100
};

/**
 * Validates and sanitizes settings object.
 *
 * Ensures that all settings values are within acceptable ranges.
 * Invalid values are replaced with defaults and logged as warnings.
 *
 * @param settings - Partial settings object to validate
 * @returns Validated settings object with all required properties
 */
function validateSettings(settings: Partial<Settings>): Settings {
  const validated: Settings = { ...defaultSettings };

  if (typeof settings.dailyProblemsCount === 'number') {
    const count = Math.round(settings.dailyProblemsCount);
    const min = 10;
    const max = 100;
    // Clamp the value to the nearest valid boundary.
    validated.dailyProblemsCount = Math.max(min, Math.min(count, max));
  }
  return validated;
}

/**
 * Loads settings from localStorage with validation and error handling.
 *
 * @returns Validated settings object, or defaults if loading fails
 */
function loadFromLocalStorage(): Settings {
  if (!browser) return defaultSettings;

  try {
    const storedJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedJson) {
      const parsedData = JSON.parse(storedJson);
      if (parsedData && typeof parsedData === 'object') {
        return validateSettings(parsedData);
      }
    }
  } catch (error) {
    console.error('Failed to parse settings from localStorage:', error);
  }

  return defaultSettings;
}

/**
 * Saves settings to localStorage with error handling.
 *
 * @param settings - Settings object to save
 */
function saveToLocalStorage(settings: Settings): void {
  if (!browser) return;

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

/**
 * Creates a settings store with validation, persistence, and custom methods.
 *
 * The store automatically saves changes to localStorage and validates all updates.
 *
 * @returns Settings store object with enhanced methods
 */
function createSettingsStore() {
  const initialSettings = loadFromLocalStorage();
  const { subscribe, update, set } = writable<Settings>(initialSettings);

  // Subscribe to changes and save to localStorage
  subscribe(saveToLocalStorage);

  return {
    /**
     * Subscribe to settings changes
     */
    subscribe,
    /**
     * Update settings using a function (with validation)
     * @param updater - Function that receives current settings and returns new settings
     */
    update: (updater: (current: Settings) => Settings) => {
      update(current => {
        const updated = updater(current);
        return validateSettings({ ...current, ...updated });
      });
    },
    /**
     * Set settings directly (with validation)
     * @param settings - New settings object
     */
    set: (settings: Settings) => {
      set(validateSettings(settings));
    },
    /**
     * Update specific settings properties (with validation)
     * @param newSettings - Partial settings object to merge with current settings
     */
    updateSettings: (newSettings: Partial<Settings>) => {
      update(current => validateSettings({ ...current, ...newSettings }));
    },
    /**
     * Reset all settings to their default values
     */
    resetToDefaults: () => {
      set(defaultSettings);
    },
    /**
     * Reset onboarding state for testing purposes
     */
    resetOnboarding: () => {
      onboarding.resetOnboarding();
    }
  };
}

/**
 * Main settings store instance.
 *
 * Use this store to manage application settings with automatic persistence and validation.
 *
 * @example
 * ```typescript
 * import { settings } from '$lib/stores/settings';
 *
 * // Get current settings
 * settings.subscribe(settings => console.log(settings));
 *
 * // Update daily problems count
 * settings.updateSettings({ dailyProblemsCount: 50 });
 *
 * // Reset to defaults
 * settings.resetToDefaults();
 * ```
 */
export const settings = createSettingsStore();