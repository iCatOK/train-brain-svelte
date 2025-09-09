<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { settings } from '$lib/stores/settings';
  import { dayCounter } from '$lib/stores/dayCounter';
  import { drillStore } from '$lib/stores/drillStore';

  $: TOTAL_PROBLEMS = $settings.dailyProblemsCount;
  $: drillState = $drillStore;

  let answerInput: HTMLInputElement;
  let localUserAnswer = '';

  // Clear local answer when starting a new drill or when drill state resets
  $: if (drillState.gameState === 'idle' || drillState.gameState === 'finished') {
    localUserAnswer = '';
  }

  function startDrill() {
    drillStore.startDrill(TOTAL_PROBLEMS);
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (drillState.gameState !== 'drilling' || drillState.problems.length === 0) return;

    drillStore.submitAnswer(localUserAnswer);
    localUserAnswer = ''; // Clear the input after submission
    answerInput?.focus();
  }

  function goBack() {
    drillStore.stopTimer();
    drillStore.resetToIdle();
    goto('/');
  }

  function tryAgain() {
    drillStore.resetToIdle();
    startDrill();
  }

  onMount(() => {
    // Initialize the day counter
    dayCounter.initialize();
  });

  onDestroy(() => {
    drillStore.stopTimer();
  });

  $: currentProblemDisplay = drillState.problems.length > 0 && drillState.gameState === 'drilling'
    ? drillState.problems[drillState.currentProblemIndex]
    : null;
</script>

<div class="page-container">
  <div class="drill-card">
    {#if drillState.gameState === 'idle'}
      <button class="start-button" on:click={startDrill}>Start Daily Drill</button>
    {:else if drillState.gameState === 'drilling' && currentProblemDisplay}
      <div class="header-controls">
        <button class="back-button" on:click={goBack} aria-label="Go back">←</button>
        <div class="stopwatch">{drillState.formattedTime}</div>
      </div>
      <div class="progress-indicator">
        Problem {drillState.currentProblemIndex + 1} of {drillState.problems.length}
      </div>
      <div class="problem-area">
        {currentProblemDisplay.problem} = ?
      </div>
      <form on:submit={handleSubmit} class="answer-form">
        <input
          type="number"
          bind:value={localUserAnswer}
          bind:this={answerInput}
          placeholder="Enter your answer"
          aria-label="Your answer"
          required
        />
        <button type="submit">Submit</button>
      </form>
    {:else if drillState.gameState === 'finished'}
      <div class="results-area">
        <h2>🎉 Congrats! 🎉</h2>
        <p>Your time: <strong>{drillState.formattedTime}</strong></p>
        <p>
          Medal:
          <span class="medal medal-{drillState.awardedMedal}">
            {#if drillState.awardedMedal === 'gold'}🥇 Gold{/if}
            {#if drillState.awardedMedal === 'silver'}🥈 Silver{/if}
            {#if drillState.awardedMedal === 'bronze'}🥉 Bronze{/if}
            {#if drillState.awardedMedal === 'none'}No Medal{/if}
          </span>
        </p>
            <div class="results-actions">
              <button on:click={tryAgain}>Try Again</button>
              <button on:click={() => goto('/')}>Go Home</button>
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
    justify-content: center; /* This helps center the card */
    min-height: calc(100vh - 60px - 40px); /* Adjust 60px for header, 40px for footer approx. */
    padding: 20px;
    font-family: sans-serif; /* Can inherit from body */
  }

  .drill-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    min-height: 300px; /* Ensure card has some height */
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center content vertically if card is taller */
  }

  .start-button {
    padding: 12px 24px;
    font-size: 1.2em;
    background-color: #0ea5e9; /* Blue from image */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .start-button:hover {
    background-color: #0284c7;
  }

  .header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    width: 100%; /* Ensure it takes full width of card */
  }

  .back-button {
    background: none;
    border: none;
    font-size: 1.8em;
    cursor: pointer;
    color: #333;
    padding: 0; /* Remove padding to align better */
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
    font-size: 2.8em; /* Larger font for problem */
    font-weight: bold;
    margin-bottom: 24px;
    color: #333;
    word-wrap: break-word; /* Ensure long problems don't break layout */
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
  /* Hide number input spinners for a cleaner look */
  .answer-form input[type="number"]::-webkit-inner-spin-button,
  .answer-form input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .answer-form input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield; /* Firefox */
  }


  .answer-form button {
    padding: 12px;
    font-size: 1.1em;
    background-color: #0ea5e9; /* Blue from image */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .answer-form button:hover {
    background-color: #0284c7;
  }

  .results-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .results-area h2 {
    margin-bottom: 8px;
    color: #333;
  }

  .results-area p {
    font-size: 1.1em;
    color: #555;
    margin: 4px 0;
  }

  .medal {
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .medal-gold { color: #b08d00; /* background-color: #fff3cd; */ }
  .medal-silver { color: #6c757d; /* background-color: #e9ecef; */ }
  .medal-bronze { color: #8c531b; /* background-color: #ffe8d6; */ }
  .medal-none { color: #333; }

  .results-actions {
    margin-top: 20px;
    display: flex;
    gap: 16px;
  }

  .results-actions button {
    padding: 10px 20px;
    font-size: 1em;
    border: 1px solid #0ea5e9;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  .results-actions button:first-child { /* Try Again */
    background-color: #0ea5e9;
    color: white;
  }
  .results-actions button:first-child:hover {
    background-color: #0284c7;
  }
  .results-actions button:last-child { /* Go Home */
    background-color: transparent;
    color: #0ea5e9;
  }
  .results-actions button:last-child:hover {
    background-color: #e0f2fe;
  }

</style>