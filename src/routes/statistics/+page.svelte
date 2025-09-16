<script lang="ts">
  import { drillResults } from '$lib/stores/drillResults';
  import { weeklyTestStore } from '$lib/stores/weeklyTestResults';
  import { drillStatistics, sortedSessionsStore, tableSortStore, chartTabStore } from '$lib/stores/statisticsStore';
  import type { SortKey, ChartTab } from '$lib/types/Statistics';
  
  import StatisticsOverview from '$lib/components/statistics/StatisticsOverview.svelte';
  import RecentActivities from '$lib/components/statistics/RecentActivities.svelte';
  import DrillPerformanceChart from '$lib/components/statistics/DrillPerformanceChart.svelte';
  import WeeklyTestsTable from '$lib/components/statistics/WeeklyTestsTable.svelte';
  import WeeklyTestChart from '$lib/components/statistics/WeeklyTestChart.svelte';
  import DebugPanel from '$lib/components/debug/DebugPanel.svelte';

  // Handle table sorting
  function handleSort(event: CustomEvent<{ key: SortKey }>) {
    const { key } = event.detail;
    tableSortStore.update(current => {
      if (current.sortKey === key) {
        return { sortKey: key, sortDir: current.sortDir === 1 ? -1 : 1 };
      } else {
        return { sortKey: key, sortDir: -1 };
      }
    });
  }

  // Handle chart tab changes
  function handleTabChange(event: CustomEvent<{ tab: ChartTab }>) {
    chartTabStore.set(event.detail.tab);
  }
</script>

<div class="page-container">
  <div class="stats-card">
    <h2>Your Statistics</h2>
    
    <StatisticsOverview stats={$drillStatistics} />
    
    <RecentActivities activities={$drillStatistics.recentActivities} />

    <DrillPerformanceChart results={$drillResults} />
  </div>

  {#if $sortedSessionsStore.length > 0}
    <div class="weekly-stats">
      <h2>Weekly Test Statistics</h2>

      <WeeklyTestsTable 
        sessions={$sortedSessionsStore}
        sortKey={$tableSortStore.sortKey}
        sortDir={$tableSortStore.sortDir}
        on:sort={handleSort}
      />

      <WeeklyTestChart 
        weeklyData={$weeklyTestStore}
        activeTab={$chartTabStore}
        on:tabChange={handleTabChange}
      />
    </div>
  {/if}
</div>

<!-- Debug Panel -->
<DebugPanel />

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

  h2 {
    color: #333;
    text-align: center;
    margin-bottom: 24px;
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
</style>