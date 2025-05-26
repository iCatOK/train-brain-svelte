<script lang="ts">
  import { drillResults } from '$lib/stores/drillResults';
  
  // Update stats whenever drill results change
  $: stats = {
    totalDrills: $drillResults.length,
    averageTime: formatTime(
      $drillResults.length > 0 
        ? $drillResults.reduce((sum, dr) => sum + dr.timeInSeconds, 0) / $drillResults.length 
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
        time: formatTime(dr.timeInSeconds),
        medal: dr.medal
      }))
  };

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
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
</style>