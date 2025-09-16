import type { DrillResult } from '$lib/types/DrillResult';
import type { ChartPoint, ProcessedChartData } from '$lib/types/Chart';
import type { CountingTestResult, WordMemoryTestResult, StroopTestResult } from '$lib/stores/weeklyTestResults';
import { formatDate, formatWeeklyDate, normalizeDate } from './dateFormatters';
import { getChartColor } from './statisticsCalculators';
import { CHART_COLORS } from '$lib/constants/statistics';

/**
 * Groups drill results by date and returns daily data
 */
export function groupResultsByDate(results: DrillResult[]): Record<string, number[]> {
  return results.reduce((acc, result) => {
    const date = formatDate(result.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(result.timeInSeconds);
    return acc;
  }, {} as Record<string, number[]>);
}

/**
 * Creates chart dataset from daily data
 */
export function createChartDataset(dailyData: Record<string, number[]>, labels: string[]) {
  // Collect all data points with their colors
  const allData: ChartPoint[] = labels.map(date => {
    const times = dailyData[date];
    return times.map(time => ({
      x: date,
      y: time,
      color: getChartColor(time)
    }));
  }).flat();

  // Sort all data by date to ensure chronological order
  allData.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());

  // Create a single dataset with all points
  return [{
    label: 'Time per Attempt',
    data: allData,
    backgroundColor: 'transparent',
    borderColor: CHART_COLORS.DEFAULT,
    borderWidth: 2,
    fill: false,
    showLine: true,
    tension: 0.1,
    pointRadius: 6,
    pointHoverRadius: 8,
    pointBackgroundColor: allData.map(point => point.color),
    pointBorderColor: allData.map(point => point.color),
  }];
}

/**
 * Groups test results by date, keeping the latest result per day
 */
export function groupTestResultsByDate<T extends { date: string }>(results: T[]): Record<string, T> {
  const grouped: Record<string, T> = {};

  results.forEach(result => {
    const normDate = normalizeDate(result.date);
    if (!grouped[normDate] || new Date(result.date) > new Date(grouped[normDate].date)) {
      grouped[normDate] = result;
    }
  });

  return grouped;
}

/**
 * Processes test data for chart display
 */
export function processChartData<T extends { date: string }>(
  results: T[],
  valueExtractor: (result: T) => number
): ProcessedChartData {
  const grouped = groupTestResultsByDate(results);

  const sortedResults = Object.values(grouped)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    labels: sortedResults.map(r => formatWeeklyDate(r.date)),
    data: sortedResults.map(valueExtractor)
  };
}