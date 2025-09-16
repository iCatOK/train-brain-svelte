<script lang="ts">
  import type { StatsData } from '$lib/types/Statistics';
  import StatisticCard from './StatisticCard.svelte';

  export let stats: StatsData;
</script>

<div class="stats-grid">
  <StatisticCard
    title="Total Drills"
    value={stats.totalDrills}
  />
  
  <StatisticCard
    title="Average Time"
    value={stats.averageTime}
  />
  
  <StatisticCard
    title="Medals Earned"
    type="medals"
    medals={stats.medals}
    value=""
  />
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }
</style>