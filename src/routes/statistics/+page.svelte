<script lang="ts">
  import { drillResults } from '$lib/stores/drillResults';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { weeklyTestStore } from '$lib/stores/weeklyTestResults';
  import { goto } from '$app/navigation';
  
  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

  let weeklyCanvas: HTMLCanvasElement;
  let weeklyChart: Chart | null = null;
  let activeTab = '1-120';
  let sortKey = 'date';
  let sortDir = -1;
  let weeklyData: any = { countingTest: [], wordMemoryTest: [], stroopTest: [] };
  let sessions: any[] = [];

  // Subscribe to weekly data
  weeklyTestStore.subscribe((data) => {
    weeklyData = data;
  });

  // Update stats whenever drill results change
  $: stats = {
    totalDrills: $drillResults.length,
    averageTime: formatTime(
      $drillResults.length > 0
        ? $drillResults.reduce((sum, dr) => {
            // Ensure timeInSeconds is a valid number
            const time = typeof dr.timeInSeconds === 'number' && !isNaN(dr.timeInSeconds) ? dr.timeInSeconds : 0;
            return sum + time;
          }, 0) / $drillResults.length
        : 0
    ),
    medals: {
      gold: $drillResults.filter(dr => dr.medal === 'gold').length,
      silver: $drillResults.filter(dr => dr.medal === 'silver').length,
      bronze: $drillResults.filter(dr => dr.medal === 'bronze').length
    },
    recentActivities: $drillResults
      .slice(0, 10)
      .map(dr => ({
        date: dr.date.toLocaleDateString(),
        time: formatTime(typeof dr.timeInSeconds === 'number' && !isNaN(dr.timeInSeconds) ? dr.timeInSeconds : 0),
        medal: dr.medal
      }))
  };

  $: if (chart) {
    updateChart($drillResults);
  }

  $: sessions = deriveSessions(weeklyData);

  $: sortSessions();

  $: if (weeklyChart && weeklyData) {
    updateWeeklyChart(activeTab, weeklyData);
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }

  function updateChart(results: typeof $drillResults) {
    // Group results by date
    const dailyData = results.reduce((acc, result) => {
      const date = formatDate(result.date);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(result.timeInSeconds);
      return acc;
    }, {} as Record<string, number[]>);

    const labels = Object.keys(dailyData).sort((a, b) => {
      // Sort dates in ascending order
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const datasets = [{
      label: 'Time per Attempt',
      data: labels.map(date => {
        const times = dailyData[date];
        return times.map(time => ({
          x: date,
          y: time
        }));
      }).flat(),
      backgroundColor: ({ raw }: { raw: { y: number } }) => {
        // Color points based on medal times
        if (raw.y < 30) return '#FFD700'; // gold
        if (raw.y < 60) return '#C0C0C0'; // silver
        if (raw.y < 90) return '#CD7F32'; // bronze
        return '#0ea5e9'; // default blue
      },
      borderColor: 'transparent',
      pointRadius: 6,
      pointHoverRadius: 8,
    }];

    chart.data.labels = labels;
    (chart.data.datasets as any) = datasets;
    chart.update();
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  function formatWeeklyDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function normalizeDate(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0];
  }

  function deriveSessions(data: any): any[] {
    // Group results by normalized date (YYYY-MM-DD)
    const grouped: Record<string, { counting?: any, word?: any, stroop?: any }> = {};

    // Process counting test results
    data.countingTest.forEach((r: any) => {
      const normDate = normalizeDate(r.date);
      if (!grouped[normDate]) grouped[normDate] = {};
      // Take the latest result for the day
      if (!grouped[normDate].counting || new Date(r.date) > new Date(grouped[normDate].counting.date)) {
        grouped[normDate].counting = r;
      }
    });

    // Process word memory test results
    data.wordMemoryTest.forEach((r: any) => {
      const normDate = normalizeDate(r.date);
      if (!grouped[normDate]) grouped[normDate] = {};
      if (!grouped[normDate].word || new Date(r.date) > new Date(grouped[normDate].word.date)) {
        grouped[normDate].word = r;
      }
    });

    // Process stroop test results
    data.stroopTest.forEach((r: any) => {
      const normDate = normalizeDate(r.date);
      if (!grouped[normDate]) grouped[normDate] = {};
      if (!grouped[normDate].stroop || new Date(r.date) > new Date(grouped[normDate].stroop.date)) {
        grouped[normDate].stroop = r;
      }
    });

    // Get sorted normalized dates
    const dates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return dates.map(date => {
      const counting = grouped[date].counting;
      const word = grouped[date].word;
      const stroop = grouped[date].stroop;
      const wordAccuracy = word ? ((word.wordsRecalledCount / 20) * 100).toFixed(1) + '%' : 'N/A';
      return {
        date: date,
        dateStr: formatWeeklyDate(date),
        countingTime: counting ? counting.time + ' sec' : 'N/A',
        wordAccuracyNum: word ? (word.wordsRecalledCount / 20) * 100 : null,
        countingNum: counting ? counting.time : null,
        stroopNum: stroop ? stroop.time : null,
        wordAccuracy,
        stroopTime: stroop ? stroop.time + ' sec' : 'N/A'
      };
    });
  }

  function sortSessions() {
    sessions = [...sessions].sort((a: any, b: any) => {
      let valA, valB;
      if (sortKey === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else if (sortKey === 'counting') {
        valA = a.countingNum ?? Infinity;
        valB = b.countingNum ?? Infinity;
      } else if (sortKey === 'word') {
        valA = a.wordAccuracyNum ?? Infinity;
        valB = b.wordAccuracyNum ?? Infinity;
      } else if (sortKey === 'stroop') {
        valA = a.stroopNum ?? Infinity;
        valB = b.stroopNum ?? Infinity;
      }
      return ((valA ?? 0) - (valB ?? 0)) * sortDir;
    });
  }

  function sortTable(key: string) {
    if (sortKey === key) {
      sortDir = sortDir === 1 ? -1 : 1;
    } else {
      sortKey = key;
      sortDir = -1;
    }
    sortSessions();
  }

  function updateWeeklyChart(tab: string, data: any) {
    if (!weeklyChart || !data) return;
    const chartOptions = (weeklyChart.options as any);
    const scales = (chartOptions.scales as any);
    const yScale = (scales.y as any);

    let labels: string[] = [];
    let datasetData: number[] = [];
    let yLabel = '';
    let yMax = 120;

    if (tab === '1-120') {
      // Group by normalized date and take latest per day
      const grouped: Record<string, any> = {};
      data.countingTest.forEach((r: any) => {
        const normDate = normalizeDate(r.date);
        if (!grouped[normDate] || new Date(r.date) > new Date(grouped[normDate].date)) {
          grouped[normDate] = r;
        }
      });
      const results = Object.values(grouped).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      labels = results.map((r: any) => formatWeeklyDate(r.date));
      datasetData = results.map((r: any) => r.time);
      yLabel = 'Time (seconds)';
    } else if (tab === 'word') {
      // Group by normalized date and take latest per day
      const grouped: Record<string, any> = {};
      data.wordMemoryTest.forEach((r: any) => {
        const normDate = normalizeDate(r.date);
        if (!grouped[normDate] || new Date(r.date) > new Date(grouped[normDate].date)) {
          grouped[normDate] = r;
        }
      });
      const results = Object.values(grouped).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      labels = results.map((r: any) => formatWeeklyDate(r.date));
      datasetData = results.map((r: any) => (r.wordsRecalledCount / 20) * 100);
      yLabel = 'Accuracy (%)';
      yMax = 100;
    } else if (tab === 'stroop') {
      // Group by normalized date and take latest per day
      const grouped: Record<string, any> = {};
      data.stroopTest.forEach((r: any) => {
        const normDate = normalizeDate(r.date);
        if (!grouped[normDate] || new Date(r.date) > new Date(grouped[normDate].date)) {
          grouped[normDate] = r;
        }
      });
      const results = Object.values(grouped).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      labels = results.map((r: any) => formatWeeklyDate(r.date));
      datasetData = results.map((r: any) => r.time);
      yLabel = 'Time (seconds)';
    }

    const datasets = [{
      label: yLabel,
      data: datasetData,
      borderColor: tab === 'word' ? '#10b981' : '#0ea5e9',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.1,
      pointRadius: 5,
      pointHoverRadius: 7
    }];

    weeklyChart.data.labels = labels;
    weeklyChart.data.datasets = datasets;
    yScale.title.text = yLabel;
    yScale.max = yMax;
    yScale.min = 0;
    weeklyChart.update('none');
  }

  onMount(() => {
    if (!chartCanvas) return;

    chart = new Chart(chartCanvas, {
      type: 'scatter',
      data: {
        datasets: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 20  // Add more bottom padding for x-axis labels
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Time (seconds)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: '#e2e8f0'
            },
            ticks: {
              callback: (value) => formatTime(value as number)
            }
          },
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Date',
              font: {
                size: 14,
                weight: 'bold'
              },
              padding: { bottom: 10 }  // Add padding below axis title
            },
            grid: {
              display: false
            },
            ticks: {
              padding: 8  // Add padding for axis labels
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            titleFont: {
              weight: 'bold'
            },
            bodyColor: '#666',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              title: (items) => {
                return items[0].label;
              },
              label: (context) => {
                const seconds = context.parsed.y;
                let medal = '';
                if (seconds < 30) medal = ' 🥇';
                else if (seconds < 60) medal = ' 🥈';
                else if (seconds < 90) medal = ' 🥉';
                return `Time: ${formatTime(seconds)}${medal}`;
              }
            }
          }
        }
      }
    });

    updateChart($drillResults);

    // Initialize weekly chart
    if (weeklyCanvas) {
      weeklyChart = new Chart(weeklyCanvas, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 20
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time (seconds)',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              grid: {
                color: '#e2e8f0'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date',
                font: {
                  size: 14,
                  weight: 'bold'
                },
                padding: { bottom: 10 }
              },
              grid: {
                display: false
              },
              ticks: {
                padding: 8
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              titleFont: {
                weight: 'bold'
              },
              bodyColor: '#666',
              borderColor: '#e2e8f0',
              borderWidth: 1,
              padding: 10,
              cornerRadius: 6
            }
          }
        }
      });
    }

    return () => {
      chart.destroy();
      if (weeklyChart) {
        weeklyChart.destroy();
      }
    };
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
      <table class="weekly-table" role="table" aria-label="Weekly test results">
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" onclick={() => sortTable('date')} aria-sort={sortKey === 'date' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>Date</th>
            <th role="columnheader" onclick={() => sortTable('counting')} aria-sort={sortKey === 'counting' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>1-120 Time (sec)</th>
            <th role="columnheader" onclick={() => sortTable('word')} aria-sort={sortKey === 'word' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>Word Memory Accuracy (%)</th>
            <th role="columnheader" onclick={() => sortTable('stroop')} aria-sort={sortKey === 'stroop' ? sortDir === -1 ? 'descending' : 'ascending' : 'none'}>Stroop Time (sec)</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {#each sessions as session (session.date)}
            <tr role="row">
              <td role="cell">{session.dateStr}</td>
              <td role="cell">{session.countingTime}</td>
              <td role="cell">{session.wordAccuracy}</td>
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

  .back-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #6b7280;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    margin-top: 16px;
    transition: background-color 0.2s;
    text-align: center;
  }

  .back-button:hover {
    background-color: #4b5563;
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