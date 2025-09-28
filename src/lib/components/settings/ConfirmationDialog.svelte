<script lang="ts">
  export let showResetConfirm: boolean;
  export let onConfirm: () => void;
  export let onCancel: () => void;
  export let handleKeydown: (event: KeyboardEvent) => void;
  import { t } from '$lib/i18n';
</script>

{#if showResetConfirm}
  <div class="confirm-dialog-overlay" on:click={onCancel} role="button" tabindex="0" on:keydown={handleKeydown}>
    <div class="confirm-dialog" on:click|stopPropagation on:keydown|stopPropagation={handleKeydown} role="button" tabindex="0">
      <h3>{$t('settingsPage.resetConfirm.title')}</h3>
      <p>{$t('settingsPage.resetConfirm.message')}</p>
      <div class="confirm-buttons">
        <button class="cancel-button" on:click={onCancel}>{$t('settingsPage.resetConfirm.buttons.cancel')}</button>
        <button class="confirm-reset-button" on:click={onConfirm}>{$t('settingsPage.resetConfirm.buttons.confirm')}</button>
      </div>
    </div>
  </div>
{/if}

<style>
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