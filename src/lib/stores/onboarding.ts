/**
 * Onboarding store for the Train Brain application.
 *
 * This store manages user progress through the 8-screen onboarding flow.
 * It provides persistence via localStorage, validation, and navigation methods.
 *
 * @example
 * ```typescript
 * import { onboarding } from '$lib/stores/onboarding';
 *
 * // Subscribe to onboarding changes
 * onboarding.subscribe(state => {
 *   console.log('Current screen:', state.currentScreen);
 * });
 *
 * // Navigate through screens
 * onboarding.nextScreen();
 * onboarding.prevScreen();
 * onboarding.completeOnboarding();
 * ```
 */

import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { OnboardingState } from '$lib/types';

const LOCAL_STORAGE_KEY = 'trainBrainOnboarding';

/**
 * Default onboarding state used when no stored state is available or validation fails.
 */
const defaultOnboardingState: OnboardingState = {
  isCompleted: false,
  currentScreen: 0,
  hasSeenOnboarding: false,
  startedAt: null,
  completedAt: null
};

/**
 * Validates and sanitizes onboarding state object.
 *
 * Ensures that all state values are within acceptable ranges.
 * Invalid values are replaced with defaults and logged as warnings.
 *
 * @param state - Partial onboarding state object to validate
 * @returns Validated onboarding state object with all required properties
 */
function validateOnboardingState(state: Partial<OnboardingState>): OnboardingState {
  const validated: OnboardingState = { ...defaultOnboardingState };

  if (typeof state.isCompleted === 'boolean') {
    validated.isCompleted = state.isCompleted;
  }

  if (typeof state.currentScreen === 'number') {
    const screen = Math.round(state.currentScreen);
    // Clamp screen index to valid range (0-6 for 7 screens)
    validated.currentScreen = Math.max(0, Math.min(screen, 6));
  }

  if (typeof state.hasSeenOnboarding === 'boolean') {
    validated.hasSeenOnboarding = state.hasSeenOnboarding;
  }

  if (typeof state.startedAt === 'string' || state.startedAt === null) {
    validated.startedAt = state.startedAt;
  }

  if (typeof state.completedAt === 'string' || state.completedAt === null) {
    validated.completedAt = state.completedAt;
  }

  return validated;
}

/**
 * Loads onboarding state from localStorage with validation and error handling.
 *
 * @returns Validated onboarding state object, or defaults if loading fails
 */
function loadFromLocalStorage(): OnboardingState {
  if (!browser) return defaultOnboardingState;

  try {
    const storedJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedJson) {
      const parsedData = JSON.parse(storedJson);
      if (parsedData && typeof parsedData === 'object') {
        return validateOnboardingState(parsedData);
      }
    }
  } catch (error) {
    console.error('Failed to parse onboarding state from localStorage:', error);
  }

  return defaultOnboardingState;
}

/**
 * Saves onboarding state to localStorage with error handling.
 *
 * @param state - Onboarding state object to save
 */
function saveToLocalStorage(state: OnboardingState): void {
  if (!browser) return;

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save onboarding state to localStorage:', error);
  }
}

/**
 * Detects if this is a first-time user based on stored state.
 *
 * @returns True if user has never seen onboarding before
 */
function isFirstTimeUser(): boolean {
  const stored = loadFromLocalStorage();
  return !stored.hasSeenOnboarding;
}

/**
 * Creates an onboarding store with validation, persistence, and navigation methods.
 *
 * The store automatically saves changes to localStorage and validates all updates.
 *
 * @returns Onboarding store object with enhanced methods
 */
function createOnboardingStore() {
  const initialState = loadFromLocalStorage();
  const { subscribe, update, set } = writable<OnboardingState>(initialState);

  // Subscribe to changes and save to localStorage
  subscribe(saveToLocalStorage);

  return {
    /**
     * Subscribe to onboarding state changes
     */
    subscribe,
    /**
     * Update onboarding state using a function (with validation)
     * @param updater - Function that receives current state and returns new state
     */
    update: (updater: (current: OnboardingState) => OnboardingState) => {
      update(current => {
        const updated = updater(current);
        return validateOnboardingState({ ...current, ...updated });
      });
    },
    /**
     * Set onboarding state directly (with validation)
     * @param state - New onboarding state object
     */
    set: (state: OnboardingState) => {
      set(validateOnboardingState(state));
    },
    /**
     * Navigate to the next onboarding screen
     */
    nextScreen: () => {
      update(current => {
        const newState = { ...current };
        if (current.currentScreen < 6) {
          newState.currentScreen = current.currentScreen + 1;
        }
        if (!current.hasSeenOnboarding) {
          newState.hasSeenOnboarding = true;
          newState.startedAt = new Date().toISOString();
        }
        return validateOnboardingState(newState);
      });
    },
    /**
     * Navigate to the previous onboarding screen
     */
    prevScreen: () => {
      update(current => {
        const newState = { ...current };
        if (current.currentScreen > 0) {
          newState.currentScreen = current.currentScreen - 1;
        }
        return validateOnboardingState(newState);
      });
    },
    /**
     * Mark onboarding as completed
     */
    completeOnboarding: () => {
      update(current => {
        return validateOnboardingState({
          ...current,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          hasSeenOnboarding: true,
          startedAt: current.startedAt || new Date().toISOString()
        });
      });
    },
    /**
     * Reset onboarding to initial state
     */
    resetOnboarding: () => {
      set(defaultOnboardingState);
    },
    /**
     * Check if this is a first-time user
     * @returns True if user has never seen onboarding before
     */
    isFirstTimeUser
  };
}

/**
 * Main onboarding store instance.
 *
 * Use this store to manage onboarding flow with automatic persistence and validation.
 *
 * @example
 * ```typescript
 * import { onboarding } from '$lib/stores/onboarding';
 *
 * // Get current state
 * onboarding.subscribe(state => console.log(state));
 *
 * // Navigate screens
 * onboarding.nextScreen();
 * onboarding.prevScreen();
 *
 * // Complete onboarding
 * onboarding.completeOnboarding();
 *
 * // Reset to start
 * onboarding.resetOnboarding();
 * ```
 */
export const onboarding = createOnboardingStore();