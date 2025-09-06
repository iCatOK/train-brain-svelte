import { derived } from 'svelte/store';
import { drillResults } from './drillResults';

/**
 * A derived store that checks if the weekly test is available.
 * The weekly test is available when the number of completed drills is divisible by 7.
 */
export const weeklyTestAvailable = derived(
  drillResults,
  ($drillResults) => {
    // Check if the number of drill results is divisible by 7
    // Also ensure there's at least one drill completed
    return $drillResults.length > 0 && $drillResults.length % 7 === 0;
  }
);