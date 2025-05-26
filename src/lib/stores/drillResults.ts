import { writable } from 'svelte/store';
import type { DrillResult } from '$lib/types/DrillResult';

function createDrillResultsStore() {
  const { subscribe, update } = writable<DrillResult[]>([]);

  return {
    subscribe,
    addResult: (result: DrillResult) => {
      update(results => [result, ...results]);
    },
    clearResults: () => {
      update(() => []);
    }
  };
}

export const drillResults = createDrillResultsStore();
