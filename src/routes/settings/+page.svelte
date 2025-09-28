<script lang="ts">
  import { goto } from '$app/navigation';
  import { settings } from '$lib/stores/settings';
  import { resetService } from '$lib/resetService';
  import DailyProblemsForm from '$lib/components/settings/DailyProblemsForm.svelte';
  import ResetProgress from '$lib/components/settings/ResetProgress.svelte';
  import ResetOnboarding from '$lib/components/settings/ResetOnboarding.svelte';
  import ConfirmationDialog from '$lib/components/settings/ConfirmationDialog.svelte';

  import { locale } from 'svelte-i18n';
  import { t } from "$lib/i18n"

  // available languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' }
  ];

  let currentLocale: string | null | undefined;
  $: locale.subscribe(l => currentLocale = l);

  function changeLanguage(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    locale.set(value); // updates globally & persists via i18n.ts
  }
  
  let tempCount = $settings.dailyProblemsCount;
  let errorMessage = ""
  let showResetConfirm = false;
  let showOnboardingResetConfirm = false;
  let successMessage = "";
  const lessThanValue = 10;
  const moreThanValue = 100;

  let lessThanMessage = $t('settingsPage.dailyProblems.lessThan', { values: { count: lessThanValue } })
  let moreThanMessage = $t('settingsPage.dailyProblems.moreThan', { values: { count: moreThanValue } })
  let resetOnboardingSuccessMessage = $t('settingsPage.resetOnboarding.resetSuccess')


  function validateCount(count: number): boolean {
    if (count < lessThanValue) {
      errorMessage = lessThanMessage;
      return false;
    }
    if (count > moreThanValue) {
      errorMessage = moreThanMessage;
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
      successMessage = resetOnboardingSuccessMessage;
      
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
    <h2>{$t('settingsPage.title')}</h2>
    
    {#if successMessage}
      <div class="success-message">
        {successMessage}
      </div>
    {/if}
    
    <div class="settings-form">
      <div class="language-selector">
        <label for="language">Language:</label>
        <select id="language" on:change={changeLanguage} bind:value={currentLocale}>
          {#each languages as lang}
            <option value={lang.code}>{lang.label}</option>
          {/each}
        </select>
      </div>
      <DailyProblemsForm bind:tempCount errorMessage={errorMessage} onSave={handleSave} />
      <ResetOnboarding onResetTrigger={handleOnboardingReset} />
      <ResetProgress onResetTrigger={handleResetProgress} />
    </div>

    <ConfirmationDialog {showResetConfirm} onConfirm={confirmReset} onCancel={cancelReset} handleKeydown={handleKeydown} />
    
    <!-- Onboarding Reset Confirmation Dialog -->
    {#if showOnboardingResetConfirm}
      <div class="confirm-dialog-overlay" on:click={cancelOnboardingReset} role="button" tabindex="0" on:keydown={handleOnboardingKeydown}>
        <div class="confirm-dialog" on:click|stopPropagation on:keydown|stopPropagation={handleOnboardingKeydown} role="button" tabindex="0">
          <h3>{$t('settingsPage.resetOnboarding.modalTitle')}</h3>
          <p>{$t('settingsPage.resetOnboarding.modalText')}</p>
          <div class="confirm-buttons">
            <button class="cancel-button" on:click={cancelOnboardingReset}>{$t('settingsPage.resetOnboarding.modalCancel')}</button>
            <button class="confirm-reset-button" on:click={confirmOnboardingReset}>{$t('settingsPage.resetOnboarding.modalConfirm')}</button>
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

  .language-selector label {
    color: #333;
    margin-bottom: 8px;
  }

  .language-selector {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.language-selector label {
  font-weight: 500;
  color: #333;
}

.language-selector select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

</style>