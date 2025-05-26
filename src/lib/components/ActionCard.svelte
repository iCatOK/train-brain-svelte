<script lang="ts">
  import { goto } from '$app/navigation';

  export let icon: string;
  export let iconClass: string = '';
  export let title: string;
  export let subtitle: string;
  export let description: string;  export let buttonText: string;
  export let targetRoute: string;
  export let disabled = false;

  function handleAction() {
    if (targetRoute && !disabled) {
      goto(targetRoute);
    }
  }
</script>

<div class="action-card">
  <div class="card-icon {iconClass}">{icon}</div>
  <h2>{title}</h2>
  <p class="subtitle">{subtitle}</p>
  <p class="description">{description}</p>
  <button on:click={handleAction} {disabled} class:disabled>{buttonText}</button>
</div>

<style>
  .action-card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
  }

  .card-icon {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }

  .math-icon { color: #0ea5e9; }
  .stats-icon { color: #10b981; }
  .settings-icon { color: #6366f1; }
  .profile-icon { color: #8b5cf6; }


  .action-card h2 {
    font-size: 1.5rem;
    margin: 0 0 4px 0;
    color: #1e293b;
  }

  .action-card .subtitle {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 12px;
  }

  .action-card .description {
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 20px;
    flex-grow: 1;
    line-height: 1.5;
  }

  .action-card button {
    display: inline-block;
    width: 100%;
    background-color: #0ea5e9;
    color: white;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: auto;
  }
  .action-card button:hover:not(.disabled) {
    background-color: #0284c7;
  }

  .action-card button.disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>