<script lang="ts">
  import { drillResults } from '$lib/stores/drillResults';
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  
  let chartCanvas: HTMLCanvasElement;
  let chart: Chart;

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
    chart.data.datasets = datasets;
    chart.update();
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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

    return () => {
      chart.destroy();
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
</style>