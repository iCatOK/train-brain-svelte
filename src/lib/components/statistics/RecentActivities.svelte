<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { RecentActivity } from '$lib/types/Statistics';

  export let activities: RecentActivity[];
</script>

<div class="recent-activities">
  <h3>{$_('statistics.recentActivities')}</h3>
  <div class="activities-list">
    {#if activities.length === 0}
      <div class="empty-state">{$_('statistics.noDrillResults')}</div>
    {:else}
      {#each activities as activity}
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

<style>
  .recent-activities {
    border-top: 1px solid #eee;
    padding-top: 24px;
  }

  .recent-activities h3 {
    color: #333;
    text-align: center;
    margin-bottom: 24px;
  }

  .activities-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .empty-state {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 20px;
  }

  .activity-item {
    display: grid;
    grid-template-columns: 4rem 1fr 2rem;
    gap: 12px;
    align-items: center;
    padding: 12px;
    background-color: #f8fafc;
    border-radius: 8px;
  }

  .date {
    color: #666;
    grid-column: 1;
    text-align: left;
  }

  .time {
    color: #0ea5e9;
    font-weight: bold;
    grid-column: 2;
    text-align: center;
  }

  .medal {
    font-size: 1.2em;
    grid-column: 3;
    text-align: center;
  }
</style>