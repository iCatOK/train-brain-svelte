<script lang="ts">
  import type { MedalCounts } from '$lib/types/Statistics';

  export let title: string;
  export let value: string | number;
  export let type: 'default' | 'medals' = 'default';
  export let medals: MedalCounts | undefined = undefined;
</script>

<div class="stat-box" class:medals={type === 'medals'}>
  <h3>{title}</h3>
  {#if type === 'medals' && medals}
    <div class="medals-grid">
      <div>🥇 {medals.gold}</div>
      <div>🥈 {medals.silver}</div>
      <div>🥉 {medals.bronze}</div>
    </div>
  {:else}
    <p class="stat-value">{value}</p>
  {/if}
</div>

<style>
  .stat-box {
    background-color: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    text-align: center;
  }

  .stat-box h3 {
    font-size: 1em;
    margin-bottom: 8px;
    color: #333;
  }

  .stat-value {
    font-size: 2em;
    font-weight: bold;
    color: #0ea5e9;
    margin: 0;
  }

  .medals-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    font-size: 1.2em;
  }
</style>