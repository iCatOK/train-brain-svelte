<script lang="ts">
  import { goto } from '$app/navigation';
  import { settings } from '$lib/stores/settings';
  import { resetService } from '$lib/resetService';
  import DailyProblemsForm from '$lib/components/settings/DailyProblemsForm.svelte';
  import ResetProgress from '$lib/components/settings/ResetProgress.svelte';
  import ConfirmationDialog from '$lib/components/settings/ConfirmationDialog.svelte';

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
    try {
      resetService.resetAllProgress();
      showResetConfirm = false;
      // Optionally show a success message or redirect
    } catch (error) {
      console.error('Reset failed:', error);
      // Could show an error message to the user here
    }
  }

  function cancelReset() {
    showResetConfirm = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      cancelReset();
    }
  }

  $: validateCount(tempCount);
</script>

<div class="page-container">
  <div class="settings-card">
    <h2>Settings</h2>
    <div class="settings-form">
      <DailyProblemsForm bind:tempCount errorMessage={errorMessage} onSave={handleSave} />
      <ResetProgress onResetTrigger={handleResetProgress} />
    </div>

    <ConfirmationDialog {showResetConfirm} onConfirm={confirmReset} onCancel={cancelReset} handleKeydown={handleKeydown} />
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
</style>