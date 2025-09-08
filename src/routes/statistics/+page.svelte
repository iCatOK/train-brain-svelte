<script lang="ts">
  import { drillResults } from '$lib/stores/drillResults';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { weeklyTestStore, type WeeklyTestData, type CountingTestResult, type WordMemoryTestResult, type StroopTestResult } from '$lib/stores/weeklyTestResults';
  import { goto } from '$app/navigation';
  import type { DrillResult } from '$lib/types/DrillResult';

  // Constants
  const MEDAL_THRESHOLDS = {
    GOLD: 30,
    SILVER: 60,
    BRONZE: 90
  } as const;

  const CHART_COLORS = {
    GOLD: '#FFD700',
    SILVER: '#C0C0C0',
    BRONZE: '#CD7F32',
    DEFAULT: '#0ea5e9',
    WORD_ACCURACY: '#10b981'
  } as const;

  const CHART_CONFIG = {
    PADDING: { left: 10, right: 10, top: 10, bottom: 20 },
    FONT_SIZE: 14,
    GRID_COLOR: '#e2e8f0',
    TOOLTIP_BACKGROUND: 'rgba(255, 255, 255, 0.9)',
    TOOLTIP_BORDER: '#e2e8f0'
  } as const;

  const WORD_MEMORY_TOTAL_WORDS = 20;
  const RECENT_ACTIVITIES_LIMIT = 10;

  // Type definitions
  interface SessionData {
    date: string;
    dateStr: string;
    countingTime: string;
    wordAccuracy: string;
    stroopTime: string;
    wordAccuracyNum: number | null;
    countingNum: number | null;
    stroopNum: number | null;
  }

  interface StatsData {
    totalDrills: number;
    averageTime: string;
    medals: {
      gold: number;
      silver: number;
      bronze: number;
    };
    recentActivities: Array<{
      date: string;
      time: string;
      medal: string;
    }>;
  }

  // Utility functions
  /**
   * Formats a date to a short string (e.g., "Dec 25")
   */
  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Formats seconds to MM:SS string
   */
  function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  /**
   * Formats date for weekly display (DD/MM/YYYY)
   */
  function formatWeeklyDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }

  /**
   * Normalizes date string to YYYY-MM-DD format
   */
  function normalizeDate(dateStr: string): string {
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  }

  /**
   * Determines medal based on time in seconds
   */
  function getMedalForTime(seconds: number): 'gold' | 'silver' | 'bronze' | 'none' {
    if (seconds < MEDAL_THRESHOLDS.GOLD) return 'gold';
    if (seconds < MEDAL_THRESHOLDS.SILVER) return 'silver';
    if (seconds < MEDAL_THRESHOLDS.BRONZE) return 'bronze';
    return 'none';
  }

  /**
   * Gets color for chart points based on time
   */
  function getChartColor(seconds: number): string {
    const medal = getMedalForTime(seconds);
    switch (medal) {
      case 'gold': return CHART_COLORS.GOLD;
      case 'silver': return CHART_COLORS.SILVER;
      case 'bronze': return CHART_COLORS.BRONZE;
      default: return CHART_COLORS.DEFAULT;
    }
  }

  /**
   * Gets medal label for legend based on color
   */
  function getMedalLabel(color: string): string {
    switch (color) {
      case CHART_COLORS.GOLD: return 'Gold (≤30s)';
      case CHART_COLORS.SILVER: return 'Silver (≤60s)';
      case CHART_COLORS.BRONZE: return 'Bronze (≤90s)';
      default: return 'Other (>90s)';
    }
  }

  // Component state
  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

  let weeklyCanvas: HTMLCanvasElement;
  let weeklyChart: Chart | null = null;
  let activeTab: '1-120' | 'word' | 'stroop' = '1-120';
  let sortKey: 'date' | 'counting' | 'word' | 'stroop' = 'date';
  let sortDir: 1 | -1 = -1;
  let weeklyData: WeeklyTestData = { countingTest: [], wordMemoryTest: [], stroopTest: [] };
  let sessions: SessionData[] = [];

  // Subscribe to weekly data
  weeklyTestStore.subscribe((data) => {
    weeklyData = data;
  });

  /**
   * Calculates comprehensive statistics from drill results
   */
  function calculateStats(results: DrillResult[]): StatsData {
    const totalDrills = results.length;

    // Calculate average time safely
    const validTimes = results
      .map(dr => dr.timeInSeconds)
      .filter(time => typeof time === 'number' && !isNaN(time) && time >= 0);

    const averageTime = validTimes.length > 0
      ? validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length
      : 0;

    // Count medals
    const medals = {
      gold: results.filter(dr => dr.medal === 'gold').length,
      silver: results.filter(dr => dr.medal === 'silver').length,
      bronze: results.filter(dr => dr.medal === 'bronze').length
    };

    // Get recent activities (last RECENT_ACTIVITIES_LIMIT)
    const recentActivities = results
      .slice(0, RECENT_ACTIVITIES_LIMIT)
      .map(dr => ({
        date: formatDate(dr.date),
        time: formatTime(dr.timeInSeconds),
        medal: dr.medal
      }));

    return {
      totalDrills,
      averageTime: formatTime(averageTime),
      medals,
      recentActivities
    };
  }

  // Reactive stats calculation
  $: stats = calculateStats($drillResults);

  $: if (chart) {
    updateChart($drillResults);
  }

  $: sessions = deriveSessions(weeklyData);

  $: sortSessions();

  $: if (weeklyChart && weeklyData) {
    updateWeeklyChart(activeTab, weeklyData);
  }


  /**
   * Groups drill results by date and returns daily data
   */
  function groupResultsByDate(results: DrillResult[]): Record<string, number[]> {
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
  function createChartDataset(dailyData: Record<string, number[]>, labels: string[]) {
    // Collect all data points with their colors
    const allData = labels.map(date => {
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
   * Updates the main drill results chart
   */
  function updateChart(results: DrillResult[]) {
    if (!chart || !results) return;

    try {
      const dailyData = groupResultsByDate(results);
      const labels = Object.keys(dailyData).sort((a, b) =>
        new Date(a).getTime() - new Date(b).getTime()
      );

      const datasets = createChartDataset(dailyData, labels);

      chart.data.labels = labels;
      (chart.data.datasets as any) = datasets;
      chart.update();
    } catch (error) {
      console.error('Error updating drill chart:', error);
    }
  }


  /**
   * Groups test results by date, keeping the latest result per day
   */
  function groupTestResultsByDate<T extends { date: string }>(
    results: T[],
    key: keyof SessionGroup
  ): Record<string, T> {
    const grouped: Record<string, T> = {};

    results.forEach(result => {
      const normDate = normalizeDate(result.date);
      if (!grouped[normDate] || new Date(result.date) > new Date(grouped[normDate].date)) {
        grouped[normDate] = result;
      }
    });

    return grouped;
  }

  interface SessionGroup {
    counting?: CountingTestResult;
    word?: WordMemoryTestResult;
    stroop?: StroopTestResult;
  }

  /**
   * Derives session data from weekly test results
   */
  function deriveSessions(data: WeeklyTestData): SessionData[] {
    const grouped: Record<string, SessionGroup> = {};

    // Process all test types using the generic function
    const countingGrouped = groupTestResultsByDate(data.countingTest, 'counting');
    const wordGrouped = groupTestResultsByDate(data.wordMemoryTest, 'word');
    const stroopGrouped = groupTestResultsByDate(data.stroopTest, 'stroop');

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
        wordAccuracyNum: word ? (word.wordsRecalledCount / 20) * 100 : null,
        countingNum: counting ? counting.time : null,
        stroopNum: stroop ? stroop.time : null
      };
    });
  }

  /**
   * Sorts the sessions array based on the current sort key and direction
   * Uses Infinity as fallback for null values to push them to the end
   */
  function sortSessions() {
    sessions = [...sessions].sort((a: SessionData, b: SessionData) => {
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

  /**
   * Handles table sorting when a column header is clicked
   * @param key - The column key to sort by ('date', 'counting', 'word', 'stroop')
   */
  function sortTable(key: string) {
    try {
      if (sortKey === key) {
        sortDir = sortDir === 1 ? -1 : 1;
      } else {
        sortKey = key as typeof sortKey;
        sortDir = -1;
      }
      sortSessions();
    } catch (error) {
      console.error('Error sorting table:', error);
    }
  }

  /**
   * Configuration for different chart tabs
   */
  const CHART_CONFIGS = {
    '1-120': {
      dataKey: 'countingTest' as keyof WeeklyTestData,
      valueExtractor: (result: CountingTestResult) => result.time,
      yLabel: 'Time (seconds)',
      yMax: 120,
      borderColor: '#0ea5e9'
    },
    word: {
      dataKey: 'wordMemoryTest' as keyof WeeklyTestData,
      valueExtractor: (result: WordMemoryTestResult) => (result.wordsRecalledCount / WORD_MEMORY_TOTAL_WORDS) * 100,
      yLabel: 'Accuracy (%)',
      yMax: 100,
      borderColor: '#10b981'
    },
    stroop: {
      dataKey: 'stroopTest' as keyof WeeklyTestData,
      valueExtractor: (result: StroopTestResult) => result.time,
      yLabel: 'Time (seconds)',
      yMax: 120,
      borderColor: '#0ea5e9'
    }
  } as const;

  /**
   * Processes test data for chart display
   */
  function processChartData<T extends { date: string }>(
    results: T[],
    valueExtractor: (result: T) => number
  ): { labels: string[]; data: number[] } {
    const grouped: Record<string, T> = {};

    results.forEach(result => {
      const normDate = normalizeDate(result.date);
      if (!grouped[normDate] || new Date(result.date) > new Date(grouped[normDate].date)) {
        grouped[normDate] = result;
      }
    });

    const sortedResults = Object.values(grouped)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      labels: sortedResults.map(r => formatWeeklyDate(r.date)),
      data: sortedResults.map(valueExtractor)
    };
  }

  /**
   * Updates the weekly test chart based on selected tab
   */
  function updateWeeklyChart(tab: keyof typeof CHART_CONFIGS, data: WeeklyTestData) {
    if (!weeklyChart || !data) return;

    try {
      const config = CHART_CONFIGS[tab];
      const testData = data[config.dataKey];

      let labels: string[] = [];
      let datasetData: number[] = [];

      if (tab === '1-120') {
        const result = processChartData(testData as CountingTestResult[], config.valueExtractor as (result: CountingTestResult) => number);
        labels = result.labels;
        datasetData = result.data;
      } else if (tab === 'word') {
        const result = processChartData(testData as WordMemoryTestResult[], config.valueExtractor as (result: WordMemoryTestResult) => number);
        labels = result.labels;
        datasetData = result.data;
      } else if (tab === 'stroop') {
        const result = processChartData(testData as StroopTestResult[], config.valueExtractor as (result: StroopTestResult) => number);
        labels = result.labels;
        datasetData = result.data;
      }

      const datasets = [{
        label: config.yLabel,
        data: datasetData,
        borderColor: config.borderColor,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7
      }];

      weeklyChart.data.labels = labels;
      weeklyChart.data.datasets = datasets;

      const chartOptions = weeklyChart.options as any;
      const yScale = chartOptions.scales.y;
      yScale.title.text = config.yLabel;
      yScale.max = config.yMax;
      yScale.min = 0;

      weeklyChart.update('none');
    } catch (error) {
      console.error('Error updating weekly chart:', error);
    }
  }

  /**
   * Creates and configures the main drill results line chart
   */
  function initializeDrillChart(): Chart {
    return new Chart(chartCanvas, {
      type: 'line',
      data: { datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: CHART_CONFIG.PADDING
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Time (seconds)',
              font: { size: CHART_CONFIG.FONT_SIZE, weight: 'bold' }
            },
            grid: { color: CHART_CONFIG.GRID_COLOR },
            ticks: {
              callback: (value) => formatTime(value as number)
            }
          },
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Date',
              font: { size: 14, weight: 'bold' },
              padding: { bottom: 10 }
            },
            grid: { display: false },
            ticks: { padding: 8 }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              generateLabels: (chart) => {
                return [
                  {
                    text: 'Gold (≤30s)',
                    fillStyle: CHART_COLORS.GOLD,
                    strokeStyle: CHART_COLORS.GOLD,
                    pointStyle: 'circle',
                    datasetIndex: 0
                  },
                  {
                    text: 'Silver (≤60s)',
                    fillStyle: CHART_COLORS.SILVER,
                    strokeStyle: CHART_COLORS.SILVER,
                    pointStyle: 'circle',
                    datasetIndex: 0
                  },
                  {
                    text: 'Bronze (≤90s)',
                    fillStyle: CHART_COLORS.BRONZE,
                    strokeStyle: CHART_COLORS.BRONZE,
                    pointStyle: 'circle',
                    datasetIndex: 0
                  }
                ];
              }
            }
          },
          tooltip: {
            backgroundColor: CHART_CONFIG.TOOLTIP_BACKGROUND,
            titleColor: '#333',
            titleFont: { weight: 'bold' },
            bodyColor: '#666',
            borderColor: CHART_CONFIG.TOOLTIP_BORDER,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: (items) => items[0].label,
              label: (context) => {
                const seconds = context.parsed.y;
                const medal = getMedalForTime(seconds);
                const medalEmoji = medal === 'gold' ? ' 🥇' :
                                 medal === 'silver' ? ' 🥈' :
                                 medal === 'bronze' ? ' 🥉' : '';
                return `Time: ${formatTime(seconds)}${medalEmoji}`;
              }
            }
          }
        }
      }
    });
  }

  /**
   * Creates and configures the weekly test results line chart
   */
  function initializeWeeklyChart(): Chart | null {
    if (!weeklyCanvas) return null;

    return new Chart(weeklyCanvas, {
      type: 'line',
      data: { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: CHART_CONFIG.PADDING
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Time (seconds)',
              font: { size: CHART_CONFIG.FONT_SIZE, weight: 'bold' }
            },
            grid: { color: CHART_CONFIG.GRID_COLOR }
          },
          x: {
            title: {
              display: true,
              text: 'Date',
              font: { size: CHART_CONFIG.FONT_SIZE, weight: 'bold' },
              padding: { bottom: 10 }
            },
            grid: { display: false },
            ticks: { padding: 8 }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: CHART_CONFIG.TOOLTIP_BACKGROUND,
            titleColor: '#333',
            titleFont: { weight: 'bold' },
            bodyColor: '#666',
            borderColor: CHART_CONFIG.TOOLTIP_BORDER,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6
          }
        }
      }
    });
  }

  /**
   * Cleanup function for charts
   */
  function cleanupCharts() {
    if (chart) chart.destroy();
    if (weeklyChart) weeklyChart.destroy();
  }

  onMount(() => {
    if (!chartCanvas) return;

    // Initialize charts
    chart = initializeDrillChart();
    weeklyChart = initializeWeeklyChart();

    // Initial data updates
    updateChart($drillResults);
    if (weeklyChart && weeklyData) {
      updateWeeklyChart(activeTab, weeklyData);
    }

    return cleanupCharts;
  });
</script>

<div class="page-container">
  <div class="stats-card">
    <h2>Your Statistics</h2>
    
    <div class="stats-grid">
      <div class="stat-box">
        <h3>Total Drills</h3>
        <p class="stat-value">{stats.totalDrills}</p>
      </div>
      
      <div class="stat-box">
        <h3>Average Time</h3>
        <p class="stat-value">{stats.averageTime}</p>
      </div>
      
      <div class="stat-box medals">
        <h3>Medals Earned</h3>
        <div class="medals-grid">
          <div>🥇 {stats.medals.gold}</div>
          <div>🥈 {stats.medals.silver}</div>
          <div>🥉 {stats.medals.bronze}</div>
        </div>
      </div>
    </div>

    <div class="recent-activities">
      <h3>Recent Activities</h3>      <div class="activities-list">
        {#if stats.recentActivities.length === 0}
          <div class="empty-state">No drill results yet. Complete your first drill to see your statistics!</div>
        {:else}
          {#each stats.recentActivities as activity}
            <div class="activity-item">
              <span class="date">{activity.date}</span>
              <span class="time">{activity.time}</span>
              <span class="medal">
                {#if activity.medal === 'gold'}🥇{/if}
                {#if activity.medal === 'silver'}🥈{/if}
                {#if activity.medal === 'bronze'}🥉{/if}
              </span>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <div class="chart-container">
      <h3>Daily Performance</h3>
      <canvas bind:this={chartCanvas}></canvas>
    </div>
  </div>

  {#if sessions.length > 0}
  <div class="weekly-stats">
    <h2>Weekly Test Statistics</h2>

    <div class="weekly-table-container">
      <table class="weekly-table" aria-label="Weekly test results">
        <thead>
          <tr>
            <th onclick={() => sortTable('date')} aria-sort={sortKey === 'date' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>Date</th>
            <th onclick={() => sortTable('counting')} aria-sort={sortKey === 'counting' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>1-120 Time (sec)</th>
            <th onclick={() => sortTable('word')} aria-sort={sortKey === 'word' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>Word Memory Accuracy (%)</th>
            <th onclick={() => sortTable('stroop')} aria-sort={sortKey === 'stroop' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>Stroop Time (sec)</th>
          </tr>
        </thead>
        <tbody>
          {#each sessions as session (session.date)}
            <tr>
              <td>{session.dateStr}</td>
              <td>{session.countingTime}</td>
              <td>{session.wordAccuracy}</td>
              <td role="cell">{session.stroopTime}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="weekly-tabs" role="tablist">
      <button
        role="tab"
        aria-selected={activeTab === '1-120'}
        aria-controls="weekly-chart"
        tabindex={activeTab === '1-120' ? 0 : -1}
        class:active={activeTab === '1-120'}
        onclick={() => activeTab = '1-120'}
      >1-120 Exercise</button>
      <button
        role="tab"
        aria-selected={activeTab === 'word'}
        aria-controls="weekly-chart"
        tabindex={activeTab === 'word' ? 0 : -1}
        class:active={activeTab === 'word'}
        onclick={() => activeTab = 'word'}
      >Word Memory</button>
      <button
        role="tab"
        aria-selected={activeTab === 'stroop'}
        aria-controls="weekly-chart"
        tabindex={activeTab === 'stroop' ? 0 : -1}
        class:active={activeTab === 'stroop'}
        onclick={() => activeTab = 'stroop'}
      >Stroop Test</button>
    </div>

    <div class="weekly-chart-container" id="weekly-chart" role="tabpanel" aria-label="Weekly progress chart">
      <canvas bind:this={weeklyCanvas}></canvas>
    </div>
  </div>
  {/if}
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 60px - 40px);
    padding: 20px;
  }

  .stats-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    width: 100%;
    max-width: 600px;
  }

  h2, h3 {
    color: #333;
    text-align: center;
    margin-bottom: 24px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-box {
    background-color: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
  }

  .stat-box h3 {
    font-size: 1em;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 2em;
    font-weight: bold;
    color: #0ea5e9;
  }

  .medals-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    font-size: 1.2em;
  }

  .recent-activities {
    border-top: 1px solid #eee;
    padding-top: 24px;
  }

  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .activity-item {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background-color: #f8fafc;
    border-radius: 8px;
  }

  .date { color: #666; }
  .time { color: #0ea5e9; font-weight: bold; }
  .medal { font-size: 1.2em; }
  .chart-container {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #eee;
    height: 400px;
    margin-bottom: 16px;  /* Add bottom margin to container */
  }

  .chart-container h3 {
    margin-bottom: 16px;
  }

  canvas {
    width: 100% !important;
    height: calc(100% - 20px) !important;  /* Subtract some height to ensure labels fit */
    margin-bottom: 20px;  /* Add bottom margin to canvas */
  }

  .weekly-stats {
    padding-top: 24px;
    border-top: 1px solid #eee;
    margin-top: 32px;
  }

  .weekly-stats h2 {
    color: #333;
    text-align: center;
    margin-bottom: 24px;
  }

  .weekly-table-container {
    overflow-x: auto;
    margin-bottom: 24px;
  }

  .weekly-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .weekly-table th,
  .weekly-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  .weekly-table th {
    background-color: #f8fafc;
    font-weight: bold;
    color: #374151;
    cursor: pointer;
    user-select: none;
  }

  .weekly-table th:hover {
    background-color: #e2e8f0;
  }

  .weekly-table tr:hover {
    background-color: #f8fafc;
  }

  .weekly-table tr:last-child td {
    border-bottom: none;
  }

  .weekly-tabs {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin: 24px 0;
  }

  .weekly-tabs button {
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    background-color: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }

  .weekly-tabs button:hover {
    background-color: #f3f4f6;
  }

  .weekly-tabs button.active {
    background-color: #0ea5e9;
    color: white;
    border-color: #0ea5e9;
  }

  .weekly-chart-container {
    height: 400px;
    margin-bottom: 24px;
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .weekly-table {
      font-size: 0.875rem;
    }

    .weekly-table th,
    .weekly-table td {
      padding: 8px 4px;
    }

    .weekly-tabs {
      flex-direction: column;
      align-items: center;
    }

    .weekly-chart-container {
      height: 300px;
    }
  }
</style>