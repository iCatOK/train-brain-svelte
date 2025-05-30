<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { ProblemGenerator, type Problem } from '$lib/ProblemGenerator'; // Ensure path is correct
  import type { Medal } from '$lib/types'; // Ensure path is correct
  import { goto } from '$app/navigation';
  import { settings } from '$lib/stores/settings';
  import { drillResults } from '$lib/stores/drillResults';
  import { dailyDrillPending } from '$lib/stores/dailyDrill';
  import type { DrillResult } from '$lib/types/DrillResult';

  $: TOTAL_PROBLEMS = $settings.dailyProblemsCount;
  let problems: Problem[] = [];
  let currentProblemIndex = 0;
  let userAnswer: string = ''; // Use string for input binding
  let score = 0; // Or could be number of correct answers

  let startTime: number | null = null;
  let elapsedTimeInSeconds = 0;
  let timerInterval: ReturnType<typeof setInterval> | undefined = undefined;
  let formattedTime = '00:00';

  let gameState: 'idle' | 'drilling' | 'finished' = 'idle';
  let awardedMedal: Medal = 'none';

  function formatTimeDisplay(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function startTimer() {
    startTime = Date.now();
    elapsedTimeInSeconds = 0;
    formattedTime = formatTimeDisplay(0);
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (startTime) {
        elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        formattedTime = formatTimeDisplay(elapsedTimeInSeconds);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    }
    if (startTime) {
        elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000); // final accurate time
        formattedTime = formatTimeDisplay(elapsedTimeInSeconds);
    }
  }

  function calculateMedal(timeSeconds: number): Medal {
    if (timeSeconds < 30) return 'gold';
    if (timeSeconds < 60) return 'silver';
    if (timeSeconds < 90) return 'bronze';
    return 'none';
  }

  function startDrill() {
    problems = ProblemGenerator.generateProblems(TOTAL_PROBLEMS);
    if (problems.length === 0) {
        alert("Could not generate problems. Please check ProblemGenerator.");
        gameState = 'idle';
        return;
    }
    currentProblemIndex = 0;
    userAnswer = '';
    score = 0; // Reset score if you track correct answers
    gameState = 'drilling';
    startTimer();
  }

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (gameState !== 'drilling' || problems.length === 0) return;

    const currentProblem = problems[currentProblemIndex];
    const userAnswerNum = parseInt(userAnswer, 10);
    let canContinue = true;

    if (!isNaN(userAnswerNum) && userAnswerNum === currentProblem.answer) {
      score++; // Optional: track correct answers
    } else {
      // Optional: handle incorrect answer (e.g., show feedback, dock points)
      canContinue = false;
    }

    userAnswer = ''; // Clear input

    if (canContinue) {
      currentProblemIndex++;
    }

    if (currentProblemIndex > problems.length - 1) {
      finishDrill();
    }
  }

  function finishDrill() {
    stopTimer();
    awardedMedal = calculateMedal(elapsedTimeInSeconds);
    gameState = 'finished';
    
    // Save drill result
    const result: DrillResult = {
      id: crypto.randomUUID(),
      date: new Date(),
      timeInSeconds: elapsedTimeInSeconds,
      problemCount: problems.length,
      correctCount: score,
      medal: awardedMedal
    };
    drillResults.addResult(result);
    dailyDrillPending.markCompleted();
  }

  function goBack() {
    // For a real app, use SvelteKit's goto:
    // import { goto } from '$app/navigation';
    // goto('/');
    // For this MVP, just reset to allow restart
    stopTimer(); // Stop timer if running
    resetToIdle(); // Reset local state
    goto('/'); // Navigate to home page
  }

  function resetToIdle() {
    stopTimer();
    problems = [];
    currentProblemIndex = 0;
    userAnswer = '';
    score = 0;
    elapsedTimeInSeconds = 0;
    formattedTime = '00:00';
    gameState = 'idle';
    awardedMedal = 'none';
  }


  onMount(() => {
    
  });

  onDestroy(() => {
    stopTimer();
  });

  $: currentProblemDisplay = problems.length > 0 && gameState === 'drilling' ? problems[currentProblemIndex] : null;
</script>

<div class="page-container">
  <div class="drill-card">
    {#if gameState === 'idle'}
      <button class="start-button" on:click={startDrill}>Start Daily Drill</button>
    {:else if gameState === 'drilling' && currentProblemDisplay}
      <div class="header-controls">
        <button class="back-button" on:click={goBack} aria-label="Go back">←</button>
        <div class="stopwatch">{formattedTime}</div>
      </div>
      <div class="progress-indicator">
        Problem {currentProblemIndex + 1} of {problems.length}
      </div>
      <div class="problem-area">
        {currentProblemDisplay.problem} = ?
      </div>
      <form on:submit={handleSubmit} class="answer-form">
        <input
          type="number"
          bind:value={userAnswer}
          placeholder="Enter your answer"
          aria-label="Your answer"
          required
        />
        <button type="submit">Submit</button>
      </form>
    {:else if gameState === 'finished'}
      <div class="results-area">
        <h2>🎉 Congrats! 🎉</h2>
        <p>Your time: <strong>{formattedTime}</strong></p>
        <p>
          Medal:
          <span class="medal medal-{awardedMedal}">
            {#if awardedMedal === 'gold'}🥇 Gold{/if}
            {#if awardedMedal === 'silver'}🥈 Silver{/if}
            {#if awardedMedal === 'bronze'}🥉 Bronze{/if}
            {#if awardedMedal === 'none'}No Medal{/if}
          </span>
        </p>
            <div class="results-actions">
              <button on:click={() => { resetToIdle(); startDrill(); }}>Try Again</button>
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