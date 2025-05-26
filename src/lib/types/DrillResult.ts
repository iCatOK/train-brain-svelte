import type { Medal } from "$lib/types";

export interface DrillResult {
  id: string;
  date: Date;
  timeInSeconds: number;
  problemCount: number;
  correctCount: number;
  medal: Medal;
}
