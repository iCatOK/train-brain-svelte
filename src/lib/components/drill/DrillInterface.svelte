<script lang="ts">
  import type { DrillState } from '$lib/stores/drillStore';
  import type { Problem } from '$lib/types';

  export let drillState: DrillState;
  export let currentProblemDisplay: Problem | null;
  export let handleSubmit: (event: Event) => void;
  export let goBack: () => void;
  export let localUserAnswer: string;
  export let answerInput: HTMLInputElement;
</script>

<div class="header-controls">
  <button class="back-button" on:click={goBack} aria-label="Go back">←</button>
  <div class="stopwatch">{drillState.formattedTime}</div>
</div>
<div class="progress-indicator">
  Problem {drillState.currentProblemIndex + 1} of {drillState.problems.length}
</div>
<div class="problem-area">
  {currentProblemDisplay?.problem} = ?
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
</style>