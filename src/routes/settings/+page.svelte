<script lang="ts">
  import { goto } from '$app/navigation';
  import { settings } from '$lib/stores/settings';
  import { resetService } from '$lib/resetService';
  import DailyProblemsForm from '$lib/components/settings/DailyProblemsForm.svelte';
  import ResetProgress from '$lib/components/settings/ResetProgress.svelte';
  import ResetOnboarding from '$lib/components/settings/ResetOnboarding.svelte';
  import ConfirmationDialog from '$lib/components/settings/ConfirmationDialog.svelte';

  let tempCount = $settings.dailyProblemsCount;
  let errorMessage = ""
  let showResetConfirm = false;
  let showOnboardingResetConfirm = false;
  let successMessage = "";

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
    try {
      resetService.resetAllProgress();
      showResetConfirm = false;
      goto('/')
    } catch (error) {
      console.error('Reset failed:', error);
      // Could show an error message to the user here
    }
  }

  function cancelReset() {
    showResetConfirm = false;
  }

  function handleOnboardingReset() {
    showOnboardingResetConfirm = true;
  }

  function confirmOnboardingReset() {
    try {
      settings.resetOnboarding();
      showOnboardingResetConfirm = false;
      successMessage = "Onboarding has been reset successfully!";
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage = "";
      }, 3000);
    } catch (error) {
      console.error('Onboarding reset failed:', error);
      // Could show an error message to the user here
    }
  }

  function cancelOnboardingReset() {
    showOnboardingResetConfirm = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      cancelReset();
    }
  }

  function handleOnboardingKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      cancelOnboardingReset();
    }
  }

  $: validateCount(tempCount);
</script>

<div class="page-container">
  <div class="settings-card">
    <h2>Settings</h2>
    
    {#if successMessage}
      <div class="success-message">
        {successMessage}
      </div>
    {/if}
    
    <div class="settings-form">
      <DailyProblemsForm bind:tempCount errorMessage={errorMessage} onSave={handleSave} />
      <ResetOnboarding onResetTrigger={handleOnboardingReset} />
      <ResetProgress onResetTrigger={handleResetProgress} />
    </div>

    <ConfirmationDialog {showResetConfirm} onConfirm={confirmReset} onCancel={cancelReset} handleKeydown={handleKeydown} />
    
    <!-- Onboarding Reset Confirmation Dialog -->
    {#if showOnboardingResetConfirm}
      <div class="confirm-dialog-overlay" on:click={cancelOnboardingReset} role="button" tabindex="0" on:keydown={handleOnboardingKeydown}>
        <div class="confirm-dialog" on:click|stopPropagation on:keydown|stopPropagation={handleOnboardingKeydown} role="button" tabindex="0">
          <h3>Reset Onboarding</h3>
          <p>Are you sure you want to reset the onboarding tutorial? This will allow you to see the introduction screens again on your next visit.</p>
          <div class="confirm-buttons">
            <button class="cancel-button" on:click={cancelOnboardingReset}>Cancel</button>
            <button class="confirm-reset-button" on:click={confirmOnboardingReset}>Yes, Reset Onboarding</button>
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

  .success-message {
    background-color: #dcfce7;
    color: #166534;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #bbf7d0;
    margin-bottom: 16px;
    font-weight: 500;
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
    background-color: #0ea5e9;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .confirm-reset-button:hover {
    background-color: #0284c7;
  }
</style>