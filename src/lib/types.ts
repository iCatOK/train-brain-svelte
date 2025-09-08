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