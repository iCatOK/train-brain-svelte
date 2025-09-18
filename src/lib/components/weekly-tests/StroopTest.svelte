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
    max-width: 600px;
    margin: 0 auto;
    padding: 0 10px;
  }

  .instructions {
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 20px;
    line-height: 1.5;
    text-align: left;
  }

  .timer-display {
    font-size: clamp(2rem, 8vw, 3.5rem);
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    line-height: 1.2;
    word-break: break-all;
  }

  .timer-display.finished {
    color: #10b981;
  }

  .color-grid {
    display: flex;
    flex-direction: column;
    gap: clamp(3px, 1vw, 8px);
    margin: 20px 0;
    font-weight: bold;
    overflow-x: auto;
    padding: 5px;
  }

  .color-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: clamp(2px, 0.5vw, 5px);
    min-width: 280px;
  }

  .color-cell {
    padding: clamp(3px, 1vw, 8px);
    font-size: clamp(0.75rem, 3vw, 1.2rem);
    text-transform: uppercase;
    background-color: #8ea9c5;
    border-radius: 4px;
    text-align: center;
    word-break: break-word;
    overflow-wrap: break-word;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1.1;
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
    padding: clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px);
    font-size: clamp(1rem, 3vw, 1.2rem);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    min-width: clamp(100px, 25vw, 120px);
    touch-action: manipulation;
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
    font-size: clamp(1.25rem, 5vw, 1.75rem);
    color: #1e293b;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .stroop-test-container {
      padding: 0 5px;
    }
    
    .instructions {
      font-size: 0.9rem;
      margin-bottom: 16px;
    }
    
    .color-grid {
      margin: 16px 0;
      padding: 3px;
    }
    
    .color-row {
      min-width: 260px;
      gap: 2px;
    }
    
    .color-cell {
      min-height: 32px;
      font-size: clamp(0.7rem, 2.8vw, 1rem);
    }
    
    .controls {
      margin-top: 20px;
    }
    
    .button-group {
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
    
    .button-group .test-button {
      width: 100%;
      max-width: 200px;
    }
  }

  @media (max-width: 480px) {
    .stroop-test-container {
      padding: 0 3px;
    }
    
    .instructions {
      font-size: 0.85rem;
      text-align: center;
    }
    
    .color-grid {
      margin: 12px 0;
    }
    
    .color-row {
      min-width: 240px;
      gap: 1px;
    }
    
    .color-cell {
      min-height: 28px;
      padding: 2px;
      font-size: clamp(0.6rem, 2.5vw, 0.9rem);
    }
    
    .timer-display {
      margin-bottom: 16px;
    }
    
    .test-button {
      font-size: 1rem;
      padding: 10px 16px;
    }
  }

  @media (max-width: 360px) {
    .color-row {
      min-width: 220px;
    }
    
    .color-cell {
      min-height: 24px;
      font-size: 0.6rem;
      padding: 1px 2px;
    }
  }

  /* High DPI / Retina Display Support */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .color-cell {
      text-rendering: optimizeLegibility;
    }
  }

  /* Landscape Phone Orientation */
  @media (max-height: 500px) and (orientation: landscape) {
    .timer-display {
      font-size: clamp(1.5rem, 6vw, 2.5rem);
      margin-bottom: 12px;
    }
    
    .color-grid {
      margin: 8px 0;
    }
    
    .instructions {
      font-size: 0.8rem;
      margin-bottom: 12px;
    }
    
    h3 {
      font-size: clamp(1.1rem, 4vw, 1.4rem);
      margin-bottom: 6px;
    }
  }
</style>