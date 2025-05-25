import { writable } from 'svelte/store';

export const settings = writable({
  dailyProblemsCount: 10
});