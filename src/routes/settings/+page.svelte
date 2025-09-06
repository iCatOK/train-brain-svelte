<script lang="ts">
  import { goto } from '$app/navigation';
  import { settings } from '$lib/stores/settings';
  import { drillResults } from '$lib/stores/drillResults';
  import { weeklyTestStore } from '$lib/stores/weeklyTestResults';

  let tempCount = $settings.dailyProblemsCount;
  let errorMessage = ""
  let showResetConfirm = false;

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
      goto('/')
    }
  }

  function handleResetProgress() {
    showResetConfirm = true;
  }

  function confirmReset() {
    drillResults.clearResults();
    weeklyTestStore.clearAllResults();

    // Clear first and last drill dates from localStorage
    localStorage.removeItem('firstDrillDay');
    localStorage.removeItem('lastDrillDate');

    showResetConfirm = false;
    // Optionally show a success message or redirect
  }

  function cancelReset() {
    showResetConfirm = false;
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

      <div class="reset-section">
        <h3>Danger Zone</h3>
        <p class="reset-description">Reset all your progress data. This action cannot be undone.</p>
        <button
          class="reset-button"
          on:click={handleResetProgress}
        >Reset All Progress</button>
      </div>
    </div>

    {#if showResetConfirm}
      <div class="confirm-dialog-overlay" on:click={cancelReset}>
        <div class="confirm-dialog" on:click|stopPropagation>
          <h3>Confirm Reset</h3>
          <p>Are you sure you want to reset all your progress? This will permanently delete all drill results, weekly test data, and reset your day counter to Day 1.</p>
          <div class="confirm-buttons">
            <button class="cancel-button" on:click={cancelReset}>Cancel</button>
            <button class="confirm-reset-button" on:click={confirmReset}>Yes, Reset Everything</button>
          </div>
        </div>
      </div>
    {/if}
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

  .confirm-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .confirm-dialog {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .confirm-dialog h3 {
    color: #333;
    margin-bottom: 16px;
    text-align: center;
  }

  .confirm-dialog p {
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .confirm-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .cancel-button {
    background-color: #6b7280;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .cancel-button:hover {
    background-color: #4b5563;
  }

  .confirm-reset-button {
    background-color: #dc2626;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .confirm-reset-button:hover {
    background-color: #b91c1c;
  }
</style>