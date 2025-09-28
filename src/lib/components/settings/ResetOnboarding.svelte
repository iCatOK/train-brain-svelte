<script lang="ts">
  import { onboarding } from '$lib/stores/onboarding';
  import { t } from '$lib/i18n';
  
  export let onResetTrigger: () => void;
  
  let onboardingState = $onboarding;
  
  // Subscribe to onboarding changes to update status
  onboarding.subscribe(state => {
    onboardingState = state;
  });
  
  $: statusText = onboardingState.isCompleted ? $t('settingsPage.resetOnboarding.completed') : $t('settingsPage.resetOnboarding.notCompleted');
</script>

<div class="onboarding-section">
  <h3>{$t('settingsPage.resetOnboarding.title')}</h3>
  <p class="section-description">{$t('settingsPage.resetOnboarding.description')}</p>
  <div class="status-display">
    <span class="status-label">{$t('settingsPage.resetOnboarding.statusLabel')}</span>
    <span class="status-value" class:completed={onboardingState.isCompleted}>
      {statusText}
    </span>
  </div>
  <button
    class="reset-onboarding-button"
    on:click={onResetTrigger}
  >{$t('settingsPage.resetOnboarding.button')}</button>
</div>

<style>
  .onboarding-section {
    border-top: 1px solid #e2e8f0;
    padding-top: 24px;
    margin-top: 32px;
  }

  .onboarding-section h3 {
    color: #333;
    margin-bottom: 8px;
  }

  .section-description {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 16px;
  }

  .status-display {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    background-color: #f8fafc;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  .status-label {
    font-weight: 500;
    color: #374151;
  }

  .status-value {
    font-weight: 600;
    color: #dc2626;
    text-transform: capitalize;
  }

  .status-value.completed {
    color: #059669;
  }

  .reset-onboarding-button {
    background-color: #0ea5e9;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 1.1em;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .reset-onboarding-button:hover {
    background-color: #0284c7;
  }
</style>