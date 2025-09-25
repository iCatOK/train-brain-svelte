import type { DrillResult } from '$lib/types/DrillResult';
import type { ChartPoint, ProcessedChartData } from '$lib/types/Chart';
import type { CountingTestResult, WordMemoryTestResult, StroopTestResult } from '$lib/stores/weeklyTestResults';
import { formatDate, formatWeeklyDate, normalizeDate } from './dateFormatters';
import { getChartColor } from './statisticsCalculators';
import { CHART_COLORS } from '$lib/constants/statistics';

/**
 * Groups drill results by date and returns daily data
 */
export function groupResultsByDate(results: DrillResult[], locale?: string): Record<string, number[]> | { grouped: Record<string, number[]>, labels: string[], dateMap: Record<string, string> } {
  const grouped = results.reduce((acc, result) => {
    const date = formatDate(result.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(result.timeInSeconds);
    return acc;
  }, {} as Record<string, number[]>);

  if (locale) {
    const loc = locale || 'en';
    const sortedDates = Object.keys(grouped).sort();
    const labels = sortedDates.map(dateStr => new Intl.DateTimeFormat(loc, { month: 'short', day: 'numeric' }).format(new Date(dateStr)));
    const dateMap = Object.fromEntries(labels.map((label, i) => [label, sortedDates[i]]));
    return { grouped, labels, dateMap };
  }

  return grouped;
}

/**
 * Creates chart dataset from daily data
 */
export function createChartDataset(dailyData: Record<string, number[]> | { grouped: Record<string, number[]>, labels: string[], dateMap: Record<string, string> }) {
  let data: Record<string, number[]>;
  let labels: string[];
  let dateMap: Record<string, string> | undefined;

  if ((dailyData as any).grouped) {
    data = (dailyData as any).grouped;
    labels = (dailyData as any).labels;
    dateMap = (dailyData as any).dateMap;
  } else {
    data = dailyData as Record<string, number[]>;
    labels = Object.keys(data).sort();
  }

  // Collect all data points with their colors
  const allData: ChartPoint[] = labels.map(label => {
    const dateKey = dateMap ? dateMap[label] : label;
    const times = data[dateKey];
    return times.map(time => ({
      x: label,
      y: time,
      color: getChartColor(time)
    }));
  }).flat();

  // Sort all data by date if not already sorted
  if (!dateMap) {
    allData.sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  }

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
  valueExtractor: (result: T) => number,
  locale?: string
): ProcessedChartData {
  const grouped = groupTestResultsByDate(results);

  const sortedResults = Object.values(grouped)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const loc = locale || 'en';
  return {
    labels: sortedResults.map(r => new Intl.DateTimeFormat(loc, { month: 'short', day: 'numeric' }).format(new Date(r.date))),
    data: sortedResults.map(valueExtractor)
  };
}