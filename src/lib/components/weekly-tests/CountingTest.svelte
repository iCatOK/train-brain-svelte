<script lang="ts">
  import { weeklyTestStore } from '$lib/stores/weeklyTestResults';
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';

  const dispatch = createEventDispatcher<{ testCompleted: 'counting' }>();

  type TestStage = 'initial' | 'running' | 'finished';

  let testStage = $state<TestStage>('initial');
  let startTime = $state<number | null>(null);
  let elapsedTimeInSeconds = $state<number>(0);
  let finalTime = $state<number | null>(null);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  // Correctly define $derived properties for reactive formatting
  const formattedTime = $derived(() => {
    const minutes = Math.floor(elapsedTimeInSeconds / 60);
    const seconds = elapsedTimeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  const formattedFinalTime = $derived(() => {
    if (finalTime === null) return "0:00"; // Use finalTime for this derived value
    const minutes = Math.floor(finalTime / 60);
    const seconds = finalTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  function startTest() {
    testStage = 'running';
    startTime = Date.now();
    elapsedTimeInSeconds = 0;
    finalTime = null; // Reset finalTime
    timerInterval = setInterval(() => {
      if (startTime) {
        elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      }
    }, 100);
  }

  function stopTest() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (startTime) {
      // Set finalTime directly from the last calculated elapsed time
      finalTime = elapsedTimeInSeconds;
      weeklyTestStore.addCountingTestResult(finalTime);
    }
    testStage = 'finished';
  }

  function nextTest() {
    dispatch('testCompleted', 'counting');
    resetTest();
  }

  function resetTest() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    testStage = 'initial';
    startTime = null;
    elapsedTimeInSeconds = 0;
    finalTime = null;
  }

  $effect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  });

</script>

<div class="counting-test-container">
  <h3>{$t('countingTest.title')}</h3>
  <p class="instructions">
    {$t('countingTest.description')}
  </p>
  {#if testStage === 'finished'}
    <p class="instructions">{$t('countingTest.finishedText')}</p>
  {/if}

  <div class="timer-display" class:finished={testStage === 'finished'}>
    {#if testStage === 'finished'}
      {formattedFinalTime()}
    {:else}
      {formattedTime()}
    {/if}
  </div>

  <div class="controls">
    {#if testStage === 'initial'}
      <button class="test-button start" onclick={startTest}>{$t('countingTest.start')}</button>
    {:else if testStage === 'running'}
      <button class="test-button stop" onclick={stopTest}>{$t('countingTest.stop')}</button>
    {:else if testStage === 'finished'}
      <button class="test-button next" onclick={nextTest}>{$t('countingTest.next')}</button>
    {/if}
  </div>
</div>

<style>
  .counting-test-container {
    text-align: center;
    width: 100%;
  }

  .instructions {
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .timer-display {
    font-size: 3.5em;
    font-weight: bold;
    color: #333;
    margin-bottom: 32px;
    line-height: 1.2;
  }

  .timer-display.finished {
    color: #10b981;
  }

  .controls {
    margin-top: 24px;
  }

  .test-button {
    padding: 12px 24px;
    font-size: 1.2em;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: 120px;
  }

  .test-button.start {
    background-color: #0ea5e9;
  }
  .test-button.start:hover {
    background-color: #0284c7;
  }

  .test-button.stop {
    background-color: #dc2626;
  }
  .test-button.stop:hover {
    background-color: #b91c1c;
  }

  .test-button.next {
    background-color: #6366f1;
  }
  .test-button.next:hover {
    background-color: #4f46e5;
  }

  h3 {
    font-size: 1.75rem;
    color: #1e293b;
    margin-bottom: 8px;
  }
</style>