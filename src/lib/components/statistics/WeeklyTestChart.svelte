<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { WeeklyTestData, CountingTestResult, WordMemoryTestResult, StroopTestResult } from '$lib/stores/weeklyTestResults';
  import type { ChartTab } from '$lib/types/Statistics';
  import { CHART_CONFIGS, CHART_CONFIG, WORD_MEMORY_TOTAL_WORDS } from '$lib/constants/statistics';
  import { processChartData } from '$lib/utils/chartHelpers';
  import { _, locale } from 'svelte-i18n';

  export let weeklyData: WeeklyTestData;
  export let activeTab: ChartTab = '1-120';

  const dispatch = createEventDispatcher<{
    tabChange: { tab: ChartTab };
  }>();

  let weeklyCanvas: HTMLCanvasElement;
  let weeklyChart: Chart | null = null;
  let currentLocale = 'en';

  $: if ($locale, weeklyChart) {
    currentLocale = $locale || 'en';
    cleanupChart();
    weeklyChart = initializeWeeklyChart();
    updateWeeklyChart(activeTab, weeklyData);
  }

  function formatTimeOrPercent(value: number, tab: ChartTab, locale: string): string {
    const localeCode = locale === 'en' ? 'en-US' : locale === 'ru' ? 'ru-RU' : 'en-US';
    if (tab === 'word') {
      return new Intl.NumberFormat(localeCode, { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);
    } else {
      return new Intl.NumberFormat(localeCode, { minimumFractionDigits: 1 }).format(value) + ' ' + $_('statistics.seconds');
    }
  }

  function handleTabClick(tab: ChartTab) {
    dispatch('tabChange', { tab });
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
        locale: currentLocale === 'en' ? 'en-US' : currentLocale === 'ru' ? 'ru-RU' : 'en-US',
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
              text: $_('statistics.timeSeconds'),
              font: { size: CHART_CONFIG.FONT_SIZE, weight: 'bold' }
            },
            grid: { color: CHART_CONFIG.GRID_COLOR }
          },
          x: {
            title: {
              display: true,
              text: $_('statistics.date'),
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
   * Updates the weekly test chart based on selected tab
   */
  function updateWeeklyChart(tab: ChartTab, data: WeeklyTestData) {
    if (!weeklyChart || !data) return;

    try {
      const config = CHART_CONFIGS[tab];
      const testData = data[config.dataKey];

      let labels: string[] = [];
      let datasetData: number[] = [];

      if (tab === '1-120') {
        const result = processChartData(
          testData as CountingTestResult[],
          (result: CountingTestResult) => result.time,
          currentLocale
        );
        labels = result.labels;
        datasetData = result.data;
      } else if (tab === 'word') {
        const result = processChartData(
          testData as WordMemoryTestResult[],
          (result: WordMemoryTestResult) => (result.wordsRecalledCount / WORD_MEMORY_TOTAL_WORDS) * 100,
          currentLocale
        );
        labels = result.labels;
        datasetData = result.data;
      } else if (tab === 'stroop') {
        const result = processChartData(
          testData as StroopTestResult[],
          (result: StroopTestResult) => result.time,
          currentLocale
        );
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
      yScale.title.text = tab === 'word' ? $_('statistics.accuracyPercent') : $_('statistics.timeSeconds');
      yScale.max = config.yMax;
      yScale.min = 0;

      chartOptions.plugins.tooltip.callbacks = {
        label: (context: any) => formatTimeOrPercent(context.parsed.y, tab, currentLocale)
      };

      weeklyChart.update('none');
    } catch (error) {
      console.error('Error updating weekly chart:', error);
    }
  }

  function cleanupChart() {
    if (weeklyChart) weeklyChart.destroy();
  }

  onMount(() => {
    weeklyChart = initializeWeeklyChart();
    if (weeklyChart && weeklyData) {
      updateWeeklyChart(activeTab, weeklyData);
    }
    return cleanupChart;
  });

  onDestroy(cleanupChart);

  $: if (weeklyChart && weeklyData) {
    updateWeeklyChart(activeTab, weeklyData);
  }
</script>

<div class="weekly-chart-section">
  <div class="weekly-tabs" role="tablist">
    <button
      role="tab"
      aria-selected={activeTab === '1-120'}
      aria-controls="weekly-chart"
      tabindex={activeTab === '1-120' ? 0 : -1}
      class:active={activeTab === '1-120'}
      on:click={() => handleTabClick('1-120')}
    >{$_('statistics.tab1_120')}</button>
    <button
      role="tab"
      aria-selected={activeTab === 'word'}
      aria-controls="weekly-chart"
      tabindex={activeTab === 'word' ? 0 : -1}
      class:active={activeTab === 'word'}
      on:click={() => handleTabClick('word')}
    >{$_('statistics.tabWord')}</button>
    <button
      role="tab"
      aria-selected={activeTab === 'stroop'}
      aria-controls="weekly-chart"
      tabindex={activeTab === 'stroop' ? 0 : -1}
      class:active={activeTab === 'stroop'}
      on:click={() => handleTabClick('stroop')}
    >{$_('statistics.tabStroop')}</button>
  </div>

  <div class="weekly-chart-container" id="weekly-chart" role="tabpanel" aria-label="Weekly progress chart">
    <canvas bind:this={weeklyCanvas}></canvas>
  </div>
</div>

<style>
  .weekly-chart-section {
    margin-top: 24px;
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
    .weekly-tabs {
      flex-direction: column;
      align-items: center;
    }

    .weekly-chart-container {
      height: 300px;
    }
  }
</style>