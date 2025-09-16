import type { WeeklyTestData, CountingTestResult, WordMemoryTestResult, StroopTestResult } from '$lib/stores/weeklyTestResults';
import type { SessionData, SessionGroup } from '$lib/types/Statistics';
import { formatWeeklyDate, normalizeDate } from './dateFormatters';
import { groupTestResultsByDate } from './chartHelpers';
import { WORD_MEMORY_TOTAL_WORDS } from '$lib/constants/statistics';

/**
 * Derives session data from weekly test results
 */
export function deriveSessions(data: WeeklyTestData): SessionData[] {
  const grouped: Record<string, SessionGroup> = {};

  // Process all test types using the generic function
  const countingGrouped = groupTestResultsByDate(data.countingTest);
  const wordGrouped = groupTestResultsByDate(data.wordMemoryTest);
  const stroopGrouped = groupTestResultsByDate(data.stroopTest);

  // Merge all groups
  Object.keys(countingGrouped).forEach(date => {
    if (!grouped[date]) grouped[date] = {};
    grouped[date].counting = countingGrouped[date];
  });

  Object.keys(wordGrouped).forEach(date => {
    if (!grouped[date]) grouped[date] = {};
    grouped[date].word = wordGrouped[date];
  });

  Object.keys(stroopGrouped).forEach(date => {
    if (!grouped[date]) grouped[date] = {};
    grouped[date].stroop = stroopGrouped[date];
  });

  // Get sorted dates (newest first)
  const dates = Object.keys(grouped).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return dates.map(date => {
    const session = grouped[date];
    const counting = session.counting;
    const word = session.word;
    const stroop = session.stroop;

    const wordAccuracy = word
      ? `${((word.wordsRecalledCount / WORD_MEMORY_TOTAL_WORDS) * 100).toFixed(1)}%`
      : 'N/A';

    return {
      date,
      dateStr: formatWeeklyDate(date),
      countingTime: counting ? `${counting.time} sec` : 'N/A',
      wordAccuracy,
      stroopTime: stroop ? `${stroop.time} sec` : 'N/A',
      wordAccuracyNum: word ? (word.wordsRecalledCount / WORD_MEMORY_TOTAL_WORDS) * 100 : null,
      countingNum: counting ? counting.time : null,
      stroopNum: stroop ? stroop.time : null
    };
  });
}

/**
 * Sorts sessions array based on sort key and direction
 * Uses Infinity as fallback for null values to push them to the end
 */
export function sortSessions(
  sessions: SessionData[],
  sortKey: string,
  sortDir: 1 | -1
): SessionData[] {
  return [...sessions].sort((a: SessionData, b: SessionData) => {
    let valA: number, valB: number;

    try {
      switch (sortKey) {
        case 'date':
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
          break;
        case 'counting':
          valA = a.countingNum ?? Infinity;
          valB = b.countingNum ?? Infinity;
          break;
        case 'word':
          valA = a.wordAccuracyNum ?? Infinity;
          valB = b.wordAccuracyNum ?? Infinity;
          break;
        case 'stroop':
          valA = a.stroopNum ?? Infinity;
          valB = b.stroopNum ?? Infinity;
          break;
        default:
          valA = valB = 0;
      }

      return (valA - valB) * sortDir;
    } catch (error) {
      console.warn('Error sorting sessions:', error);
      return 0;
    }
  });
}