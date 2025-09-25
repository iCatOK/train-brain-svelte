<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { StatsData } from '$lib/types/Statistics';
  import StatisticCard from './StatisticCard.svelte';

  export let stats: StatsData;
</script>

<div class="stats-grid">
  <StatisticCard
    title={$_('statistics.totalDrills')}
    value={stats.totalDrills}
  />

  <StatisticCard
    title={$_('statistics.averageTime')}
    value={stats.averageTime}
  />

  <StatisticCard
    title={$_('statistics.medalsEarned')}
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