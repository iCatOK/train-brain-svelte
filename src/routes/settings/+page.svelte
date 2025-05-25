<script lang="ts">
  import { settings } from '$lib/stores/settings';
  
  let tempCount = $settings.dailyProblemsCount;
  let errorMessage = ""

  function validateCount(count: number): boolean {
    if (count < 10) {
      errorMessage = "Number of problems cannot be less than 10";
      return false;
    }
    if (count > 100) {
      errorMessage = "Number of problems cannot be more than 100";
      return false;
    }
    errorMessage = "";
    return true;
  }

  function handleSave() {
    if (validateCount(tempCount)) {
      settings.update(s => ({...s, dailyProblemsCount: tempCount}));
    }
  }

  $: validateCount(tempCount);
</script>

<div class="page-container">
  <div class="settings-card">
    <h2>Settings</h2>
    <div class="settings-form">
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
        on:click={handleSave}
        disabled={errorMessage !== ""}>Save Changes</button>
    </div>
  </div>
</div>

<style>
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 60px - 40px);
    padding: 20px;
  }

  .settings-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    width: 100%;
    max-width: 400px;
  }

  h2 {
    color: #333;
    margin-bottom: 24px;
    text-align: center;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .setting-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
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