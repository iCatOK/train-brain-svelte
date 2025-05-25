<script lang="ts">
  export let icon: string = '⚠️'; // Default icon, can be overridden
  export let title: string;
  export let message: string;
  export let refreshIcon: string = '🔄'; // Or pass as a prop if it varies
</script>

<section class="notification-card">
  <div class="icon-area alert-icon">{icon}</div>
  <div class="text-area">
    <h3>{title} {#if refreshIcon}<span class="refresh-icon">{refreshIcon}</span>{/if}</h3>
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
  }

  .notification-card .text-area p {
    margin: 0;
    font-size: 0.95rem;
    color: #92400e;
  }
</style>