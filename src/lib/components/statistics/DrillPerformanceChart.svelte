<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { DrillResult } from '$lib/types/DrillResult';
  import { CHART_COLORS, CHART_CONFIG, MEDAL_THRESHOLDS } from '$lib/constants/statistics';
  import { groupResultsByDate, createChartDataset } from '$lib/utils/chartHelpers';
  import { getMedalForTime } from '$lib/utils/statisticsCalculators';
  import { formatTime } from '$lib/utils/dateFormatters';

  export let results: DrillResult[];

  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

  /**
   * Creates and configures the drill results line chart
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
   * Updates the drill chart with new data
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

  function cleanupChart() {
    if (chart) chart.destroy();
  }

  onMount(() => {
    if (!chartCanvas) return;

    chart = initializeDrillChart();
    updateChart(results);

    return cleanupChart;
  });

  onDestroy(cleanupChart);

  $: if (chart) {
    updateChart(results);
  }
</script>

<div class="chart-container">
  <h3>Daily Performance</h3>
  <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
  .chart-container {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #eee;
    height: 400px;
    margin-bottom: 16px;
  }

  .chart-container h3 {
    margin-bottom: 16px;
    color: #333;
    text-align: center;
  }

  canvas {
    width: 100% !important;
    height: calc(100% - 20px) !important;
    margin-bottom: 20px;
  }
</style>