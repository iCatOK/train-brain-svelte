export interface ChartPoint {
  x: string;
  y: number;
  color: string;
}

export interface ChartConfig<T = any> {
  dataKey: keyof import('$lib/stores/weeklyTestResults').WeeklyTestData;
  valueExtractor: (result: T) => number;
  yLabel: string;
  yMax: number;
  borderColor: string;
}

export interface ProcessedChartData {
  labels: string[];
  data: number[];
}