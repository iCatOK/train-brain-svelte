<script lang="ts">
  import type { DrillState } from '$lib/stores/drillStore';

  export let drillState: DrillState;
  export let onGoHome: () => void;
</script>

<div class="results-area">
  <h2>🎉 Congrats! 🎉</h2>
  <p>Your time: <strong>{drillState.formattedTime}</strong></p>
  <p>
    Medal:
    <span class="medal medal-{drillState.awardedMedal}">
      {#if drillState.awardedMedal === 'gold'}🥇 Gold{/if}
      {#if drillState.awardedMedal === 'silver'}🥈 Silver{/if}
      {#if drillState.awardedMedal === 'bronze'}🥉 Bronze{/if}
      {#if drillState.awardedMedal === 'none'}No Medal{/if}
    </span>
  </p>
  <div class="results-actions">
    <button on:click={() => onGoHome()}>Go Home</button>
  </div>
</div>

<style>
  .results-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .results-area h2 {
    margin-bottom: 8px;
    color: #333;
  }

  .results-area p {
    font-size: 1.1em;
    color: #555;
    margin: 4px 0;
  }

  .medal {
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .medal-gold { color: #b08d00; }
  .medal-silver { color: #6c757d; }
  .medal-bronze { color: #8c531b; }
  .medal-none { color: #333; }

  .results-actions {
    margin-top: 20px;
    display: flex;
    gap: 16px;
  }

  .results-actions button {
    padding: 10px 20px;
    font-size: 1em;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  .results-actions button:first-child {
    background-color: #0ea5e9;
    color: white;
  }
  .results-actions button:first-child:hover {
    background-color: #0284c7;
  }
  .results-actions button:last-child {
    background-color: transparent;
    color: #0ea5e9;
  }
  .results-actions button:last-child:hover {
    background-color: #e0f2fe;
  }
</style>