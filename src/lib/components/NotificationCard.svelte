<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let icon: string = '⚠️';
  export let title: string;
  export let message: string;
  export let refreshIcon: string = '🔄';
  export let variant: 'warning' | 'success' = 'warning';
  
  const dispatch = createEventDispatcher();

  function handleRefreshClick() {
    dispatch('refresh');
  }
</script>

<section class="notification-card {variant}">
  <div class="icon-area">{icon}</div>
  <div class="text-area">
    <h3>
      {title}
      {#if refreshIcon}
        <button class="refresh-button" on:click={handleRefreshClick}>
          <span class="refresh-icon">{refreshIcon}</span>
        </button>
      {/if}
    </h3>
    <p>{message}</p>
  </div>
</section>

<style>
  .notification-card {
    background-color: #fffbeb;
    border: 1px solid #fef3c7;
    border-left: 4px solid #f59e0b;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .notification-card .icon-area {
    font-size: 1.5rem;
    padding-top: 2px;
  }

  .alert-icon { /* This could be a prop if icons vary more widely */
    color: #f59e0b;
  }

  .refresh-icon {
    font-size: 0.9em;
    margin-left: 4px;
    color: #6b7280;
    display: inline-block;
  }
  .notification-card .text-area h3 {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
    color: #78350f;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .notification-card .text-area p {
    margin: 0;
    font-size: 0.95rem;
    color: #92400e;
  }

  /* Success variant styles */
  .notification-card.success {
    background-color: #ecfdf5;
    border: 1px solid #d1fae5;
    border-left: 4px solid #10b981;
  }

  .notification-card.success .icon-area {
    color: #10b981;
  }

  .notification-card.success .text-area h3 {
    color: #065f46;
  }

  .notification-card.success .text-area p {
    color: #047857;
  }

  /* Refresh button styles */
  .refresh-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }

  .refresh-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
</style>