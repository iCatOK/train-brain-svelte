export interface Problem {
  problem: string;
  answer: number;
}

export type Medal = 'gold' | 'silver' | 'bronze' | 'none';

/**
 * Application settings interface.
 *
 * Defines the structure for user-configurable application settings.
 */
export interface Settings {
  /** Number of math problems to solve per day (10-100) */
  dailyProblemsCount: number;
}

/**
 * Onboarding state interface.
 *
 * Tracks user progress through the onboarding flow.
 */
export interface OnboardingState {
  /** Whether user has completed onboarding */
  isCompleted: boolean;
  /** Current screen index (0-7 for 8 screens) */
  currentScreen: number;
  /** Whether user has seen onboarding before */
  hasSeenOnboarding: boolean;
  /** When onboarding was started */
  startedAt: string | null;
  /** When onboarding was completed */
  completedAt: string | null;
}