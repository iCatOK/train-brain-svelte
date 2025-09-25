<script lang="ts">
  export let tempCount: number;
  export let errorMessage: string;
  export let onSave: () => void;
</script>

<div class="setting-item">
  <label for="problemCount">Number of Daily Problems</label>
  <input
    type="number"
    id="problemCount"
    bind:value={tempCount}
    min="10"
    max="100"
    class:error={errorMessage}
  />
  <span class="help-text">Choose between 10 and 100 problems</span>
  {#if errorMessage}
    <span class="error-message">{errorMessage}</span>
  {/if}
</div>
<button
  class="save-button"
  on:click={onSave}
  disabled={errorMessage !== ""}>Save Changes</button>

<style>
  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid #e2e8f0;
    padding-top: 24px;
  }

  label {
    font-weight: bold;
    color: #333;
  }

  input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1.1em;
  }

  .help-text {
    font-size: 0.9em;
    color: #666;
  }

  .save-button {
    padding: 12px 24px;
    background-color: #0ea5e9;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .save-button:hover {
    background-color: #0284c7;
  }

  .error {
    border-color: #dc2626;
    background-color: #fef2f2;
  }

  .error-message {
    color: #dc2626;
    font-size: 0.9em;
    margin-top: 4px;
  }

  .save-button:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
</style>