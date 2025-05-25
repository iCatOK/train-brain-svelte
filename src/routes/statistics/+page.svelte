<script lang="ts">
  // Mock data - in a real app, this would come from a store or API
  const mockStats = {
    totalDrills: 25,
    averageTime: '01:45',
    medals: {
      gold: 8,
      silver: 12,
      bronze: 3
    },
    recentTimes: [
      { date: '2024-05-24', time: '01:23', medal: 'gold' },
      { date: '2024-05-23', time: '01:45', medal: 'silver' },
      { date: '2024-05-22', time: '02:15', medal: 'bronze' },
    ]
  };
</script>

<div class="page-container">
  <div class="stats-card">
    <h2>Your Statistics</h2>
    
    <div class="stats-grid">
      <div class="stat-box">
        <h3>Total Drills</h3>
        <p class="stat-value">{mockStats.totalDrills}</p>
      </div>
      
      <div class="stat-box">
        <h3>Average Time</h3>
        <p class="stat-value">{mockStats.averageTime}</p>
      </div>
      
      <div class="stat-box medals">
        <h3>Medals Earned</h3>
        <div class="medals-grid">
          <div>🥇 {mockStats.medals.gold}</div>
          <div>🥈 {mockStats.medals.silver}</div>
          <div>🥉 {mockStats.medals.bronze}</div>
        </div>
      </div>
    </div>

    <div class="recent-activities">
      <h3>Recent Activities</h3>
      <div class="activities-list">
        {#each mockStats.recentTimes as activity}
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