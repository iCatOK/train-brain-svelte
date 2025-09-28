<script lang="ts">
  import type { DrillState } from '$lib/stores/drillStore';
  import type { Problem } from '$lib/types';
  import { onDestroy } from 'svelte';
  import { drillStore } from '$lib/stores/drillStore';
  import { t } from "$lib/i18n"

  export let drillState: DrillState;
  export let currentProblemDisplay: Problem | null;
  export let handleSubmit: (event: Event) => void;
  export let goBack: () => void;
  export let localUserAnswer: string;
  export let answerInput: HTMLInputElement;

  let errorTimeout: number | null = null;

  $: if (drillState.inputError && !errorTimeout) {
    errorTimeout = setTimeout(() => {
      drillStore.clearInputError();
      errorTimeout = null;
    }, 2500);
  }

  $: if (!drillState.inputError && errorTimeout) {
    clearTimeout(errorTimeout);
    errorTimeout = null;
  }

  function handleInput() {
    drillStore.clearInputError();
  }

  onDestroy(() => {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
  });
</script>

<div class="header-controls">
  <button class="back-button" on:click={goBack} aria-label="Go back">←</button>
  <div class="stopwatch">{drillState.formattedTime}</div>
</div>
<div class="progress-indicator">
 {$t('dailyDrillPage.problemTitle', { values: { current: drillState.currentProblemIndex + 1, total: drillState.problems.length } })}
</div>
<div class="problem-area">
  {currentProblemDisplay?.problem} = ?
</div>
<form on:submit={handleSubmit} class="answer-form">
  <input
    type="number"
    bind:value={localUserAnswer}
    bind:this={answerInput}
    placeholder={$t('dailyDrillPage.answerPlaceholder')}
    aria-label="Your answer"
    aria-invalid={drillState.inputError}
    aria-describedby={drillState.inputError ? "error-desc" : undefined}
    required
    on:input={handleInput}
    class:error={drillState.inputError}
  />
  <button type="submit">{$t('dailyDrillPage.submit')}</button>

  {#if drillState.inputError}
    <div class="error-message" id="error-desc" role="alert">{$t('dailyDrillPage.incorrectAnswer')}</div>
  {/if}
</form>

<style>
  .header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    width: 100%;
  }

  .back-button {
    background: none;
    border: none;
    font-size: 1.8em;
    cursor: pointer;
    color: #333;
    padding: 0;
  }

  .stopwatch {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
  }

  .progress-indicator {
    font-size: 0.9em;
    color: #666;
    margin-bottom: 24px;
  }

  .problem-area {
    font-size: 2.8em;
    font-weight: bold;
    margin-bottom: 24px;
    color: #333;
    word-wrap: break-word;
  }

  .answer-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .answer-form input {
    padding: 12px;
    font-size: 1.1em;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
  }
  .answer-form input[type="number"]::-webkit-inner-spin-button,
  .answer-form input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .answer-form input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }

  .answer-form button {
    padding: 12px;
    font-size: 1.1em;
    background-color: #0ea5e9;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .answer-form button:hover {
    background-color: #0284c7;
  }

  .answer-form input.error {
    border-color: #ef4444;
    background-color: #fef2f2;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  .error-message {
    color: #ef4444;
    font-size: 0.9em;
    margin-top: 8px;
    text-align: center;
  }
</style>