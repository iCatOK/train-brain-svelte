<script lang="ts">
  export let onResetTrigger: () => void;
</script>

<div class="reset-section">
  <h3>Danger Zone</h3>
  <p class="reset-description">Reset all your progress data. This action cannot be undone.</p>
  <button
    class="reset-button"
    on:click={onResetTrigger}
  >Reset All Progress</button>
</div>

<style>
  .reset-section {
    border-top: 1px solid #e2e8f0;
    padding-top: 24px;
    margin-top: 32px;
  }

  .reset-section h3 {
    color: #dc2626;
    margin-bottom: 8px;
  }

  .reset-description {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 16px;
  }

  .reset-button {
    background-color: #dc2626;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .reset-button:hover {
    background-color: #b91c1c;
  }
</style>