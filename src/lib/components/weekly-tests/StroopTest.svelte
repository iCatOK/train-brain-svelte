<script lang="ts">
  import { weeklyTestStore } from '$lib/stores/weeklyTestResults';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ testCompleted: 'stroop' }>();

  type TestStage = 'initial' | 'running' | 'finished';
  type ColorName = 'RED' | 'GREEN' | 'BLUE' | 'YELLOW';
  type ColorValue = 'red' | 'green' | 'blue' | 'yellow';

  let testStage = $state<TestStage>('initial');
  let startTime = $state<number | null>(null);
  let elapsedTimeInSeconds = $state<number>(0);
  let finalTime = $state<number | null>(null);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  // Define the color grid
  const colorNames: ColorName[] = ['RED', 'GREEN', 'BLUE', 'YELLOW'];
  const colorValues: ColorValue[] = ['red', 'green', 'blue', 'yellow'];
  
  // Create a 10x5 grid of color words with random colors
  const colorGrid = $state<{text: ColorName, color: ColorValue}[][]>([]);

  // Generate the color grid with random combinations
  function generateColorGrid() {
    const rows = 10;
    const cols = 5;
    const newGrid: {text: ColorName, color: ColorValue}[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: {text: ColorName, color: ColorValue}[] = [];
      for (let j = 0; j < cols; j++) {
        const textIndex = Math.floor(Math.random() * colorNames.length);
        const colorIndex = Math.floor(Math.random() * colorValues.length);
        row.push({
          text: colorNames[textIndex],
          color: colorValues[colorIndex]
        });
      }
      newGrid.push(row);
    }
    
    colorGrid.length = 0;
    colorGrid.push(...newGrid);
  }

  // Correctly define $derived properties for reactive formatting
  const formattedTime = $derived(() => {
    const minutes = Math.floor(elapsedTimeInSeconds / 60);
    const seconds = elapsedTimeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  function startTest() {
    generateColorGrid();
    testStage = 'running';
    startTime = Date.now();
    elapsedTimeInSeconds = 0;
    finalTime = null;
    timerInterval = setInterval(() => {
      if (startTime) {
        elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
      }
    }, 100);
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    // Reset to initial state so user needs to press Start again
    testStage = 'initial';
    startTime = null;
    elapsedTimeInSeconds = 0;
  }

  function completeTest() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (startTime) {
      finalTime = elapsedTimeInSeconds;
      // Save the result to the store
      saveTestResult();
    }
    testStage = 'finished';
  }

  function saveTestResult() {
    // Save the Stroop test result to the store
    if (finalTime !== null) {
      weeklyTestStore.addStroopTestResult(finalTime);
    }
  }

  function nextTest() {
    dispatch('testCompleted', 'stroop');
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

<div class="stroop-test-container">
  <h3>The Stroop test</h3>
  
  <p class="instructions">
    The Stroop test measures your ability to name colors. After clicking the "Start" button, please name the colors that the words in the table are written in. If you make an error, simply say the correct color immediately. 
  </p>

  <div class="timer-display" class:finished={testStage === 'finished'}>
    {formattedTime()}
  </div>

  {#if testStage === 'running' || testStage === 'finished'}
    <div class="color-grid">
      {#each colorGrid as row}
        <div class="color-row">
          {#each row as cell}
            <div class="color-cell" style="color: {cell.color}">
              {cell.text}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}

  <div class="controls">
    {#if testStage === 'initial'}
      <button class="test-button start" onclick={startTest}>Start</button>
    {:else if testStage === 'running'}
      <div class="button-group">
        <button class="test-button stop" onclick={completeTest}>Stop</button>
        <button class="test-button reset" onclick={resetTimer}>Reset</button>
      </div>
    {:else if testStage === 'finished'}
      <button class="test-button done" onclick={nextTest}>Done</button>
    {/if}
  </div>
</div>

<style>
  .stroop-test-container {
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
    margin-bottom: 20px;
    line-height: 1.2;
  }

  .timer-display.finished {
    color: #10b981;
  }

  .color-grid {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 20px 0;
    font-weight: bold;
  }

  .color-row {
    display: flex;
    justify-content: space-between;
  }

  .color-cell {
    flex: 1;
    padding: 5px;
    font-size: 1.2rem;
    text-transform: uppercase;
    background-color: #8ea9c5; /* Light grey background for better contrast */
  }

  .controls {
    margin-top: 24px;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 10px;
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

  .test-button.reset {
    background-color: #f59e0b;
  }
  .test-button.reset:hover {
    background-color: #d97706;
  }

  .test-button.done {
    background-color: #6366f1;
  }
  .test-button.done:hover {
    background-color: #4f46e5;
  }

  h3 {
    font-size: 1.75rem;
    color: #1e293b;
    margin-bottom: 8px;
  }
</style>