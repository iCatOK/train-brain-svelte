<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { weeklyTestStore } from '$lib/stores/weeklyTestResults';
  import { t } from '$lib/i18n';
  import { locale } from 'svelte-i18n';

  type TestStage = 'idle' | 'memorizing' | 'recalling' | 'showingResults' | 'finished';

  let stage = $state<TestStage>('idle');
  const wordMemorizingTime = 120;
  let timeLeft = $state(wordMemorizingTime);
  let timerInterval: ReturnType<typeof setInterval> | null = null;

  let currentLocale = $state<string | null | undefined>();

  $effect(() => {
    const unsubscribe = locale.subscribe(l => currentLocale = l);
    return unsubscribe;
  });

  // For simplicity, using a fixed list of 20 words.
  // In a real app, this would come from a larger pool and be randomized.
  const englishWords = ["apple", "bicycle", "cloud", "diamond", "elephant", "forest", "guitar", "harbor", "island", "jacket", "kangaroo", "lemon", "mountain", "notebook", "ocean", "pencil", "quarter", "rainbow", "sunshine", "telescope", "umbrella", "village", "waterfall", "xylophone", "yogurt", "zeppelin", "cat", "dog", "house", "tree"];
  const russianWords = ["яблоко", "велосипед", "облако", "алмаз", "слон", "лес", "гитара", "гавань", "остров", "куртка", "кенгуру", "лимон", "гора", "тетрадь", "океан", "карандаш", "четверть", "радуга", "солнце", "телескоп", "зонт", "деревня", "водопад", "ксилофон", "йогурт", "дирижабль", "кот", "собака", "дом", "дерево"];
  const allWords = $derived(currentLocale === 'ru' ? russianWords : englishWords);
  
  
  let wordsToMemorize = $state<string[]>([]);
  const wordsToMemorizeCount = 30; // Number of words to show

  let recalledWords = $state<string[]>([]);
  let currentInputWord = $state('');
  let correctWords = $state<string[]>([]);
  let missedWords = $state<string[]>([]);

  const dispatch = createEventDispatcher<{ testCompleted: 'wordMemory' }>();

  function selectWords() {
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    wordsToMemorize = shuffled.slice(0, wordsToMemorizeCount);
  }

  const formattedTimeLeft = $derived(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  function startMemorization() {
    selectWords();
    stage = 'memorizing';
    timeLeft = wordMemorizingTime;
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval!);
        timerInterval = null;
        stage = 'recalling';
        timeLeft = 0; // Ensure it shows 0:00
      }
    }, 1000);
  }
  function addRecalledWord(event: Event) {
    event.preventDefault()
    if (currentInputWord.trim() && !recalledWords.includes(currentInputWord.trim().toLowerCase())) {
      recalledWords.push(currentInputWord.trim().toLowerCase());
    }
    currentInputWord = '';
  }

  function removeRecalledWord(wordToRemove: string) {
    recalledWords = recalledWords.filter(w => w !== wordToRemove);
  }

  function removeAllRecalledWords() {
    recalledWords = [];
  }

  function showResults() {
    stage = 'showingResults';
    // Calculate correct and missed words
    correctWords = wordsToMemorize.filter(word => recalledWords.includes(word));
    missedWords = wordsToMemorize.filter(word => !recalledWords.includes(word));
  }

  function finishTest() {
    weeklyTestStore.addWordMemoryTestResult(wordsToMemorize.length, correctWords.length);
    console.log("done")
    stage = 'finished';
    dispatch('testCompleted', 'wordMemory');
    resetTestState();
  }

  function resetTestState() {
    stage = 'idle';
    timeLeft = wordMemorizingTime;
    if (timerInterval) clearInterval(timerInterval);
    wordsToMemorize = [];
    recalledWords = [];
    correctWords = [];
    missedWords = [];
    currentInputWord = '';
  }

  $effect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

</script>

<div class="word-memory-test-container">
  <h3>{$t('wordMemoryTest.title')}</h3>

  {#if stage === 'idle'}
    <p class="instructions">{$t('wordMemoryTest.description1')}</p>
    <button class="test-button start" onclick={startMemorization}>{$t('wordMemoryTest.start')}</button>
  {/if}

  {#if stage === 'memorizing'}
    <div class="memorization-header">
      <p class="instructions">{$t('wordMemoryTest.description1')}</p>
      <div class="timer-display">{formattedTimeLeft()}</div>
    </div>
    <div class="word-grid">
      {#each wordsToMemorize as word (word)}
        <div class="word-chip">{word}</div>
      {/each}
    </div>
  {/if}

  {#if stage === 'recalling'}
    <p class="instructions">{$t('wordMemoryTest.description2')}</p>
    <form class="recall-form" onsubmit={addRecalledWord}>
      <input type="text" bind:value={currentInputWord} placeholder="word" />
      <button type="submit" class="test-button add">{$t('wordMemoryTest.add')}</button>
      <button type="button" class="test-button remove-all" onclick={removeAllRecalledWords}>{$t('wordMemoryTest.removeAll')}</button>
      <button type="button" class="test-button next" onclick={showResults}>{$t('wordMemoryTest.done')}</button>
    </form>
    <div class="recalled-words-grid">
      {#each recalledWords as word (word)}
        <div class="word-chip recalled">
          {word}
          <button class="remove-word-btn" onclick={() => removeRecalledWord(word)}>×</button>
        </div>
      {/each}
    </div>
  {/if}

  {#if stage === 'showingResults'}
    <p class="instructions">{$t('wordMemoryTest.resultsTitle')}</p>
    <p>{$t('wordMemoryTest.resultsDescription', { values: { correct: correctWords.length, total: wordsToMemorize.length } })}</p>
    <div class="results-grid">
      <div class="result-group">
        <h4>{$t('wordMemoryTest.correctWords')}</h4>
        <div class="word-grid">
          {#each correctWords as word (word)}
            <div class="word-chip correct">{word}</div>
          {/each}
        </div>
      </div>
      <div class="result-group">
        <h4>{$t('wordMemoryTest.missedWords')}</h4>
        <div class="word-grid">
          {#each missedWords as word (word)}
            <div class="word-chip missed">{word}</div>
          {/each}
        </div>
      </div>
    </div>
    <button class="test-button next" style="margin-top: 20px;" onclick={finishTest}>{$t('wordMemoryTest.next')}</button>
  {/if}

  {#if stage === 'finished'}
    <p class="instructions">{$t('wordMemoryTest.resultsSaved')}</p>
    <p>{$t('wordMemoryTest.resultsDescription', { values: { correct: correctWords.length, total: wordsToMemorize.length } })}</p>
  {/if}
</div>

<style>
  .word-memory-test-container {
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  h3 {
    font-size: 1.75rem;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .instructions {
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 12px; /* Reduced margin from CountingTest */
    line-height: 1.5;
  }

  .memorization-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 16px;
  }
  .memorization-header .instructions {
    text-align: left;
    margin-bottom: 0;
    flex-grow: 1;
  }

  .timer-display {
    font-size: 2em; /* Smaller than counting test, but still prominent */
    font-weight: bold;
    color: #333;
    padding-left: 16px;
  }

  .word-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
    max-height: 280px; /* Limit height and allow scroll if many words */
    overflow-y: auto; /* Add scroll for too many words */
    padding: 5px;
  }

  .word-chip {
    background-color: #f8fafc; /* From .stat-box */
    border: 1px solid #e2e8f0; /* From .app-header border */
    border-radius: 6px; /* Rounded corners */
    padding: 8px 12px;
    font-size: 0.95rem;
    color: #333;
    text-align: center;
    white-space: nowrap;
  }

  .recalled-words-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 20px;
    max-height: 150px;
    overflow-y: auto;
    padding: 5px;
  }

  .word-chip.recalled {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #e0f2fe; /* Light blue, from .results-actions button:last-child:hover */
  }

  .remove-word-btn {
    background: none;
    border: none;
    color: #ef4444; /* Red color for removal */
    font-size: 1.2em;
    cursor: pointer;
    padding: 0 0 0 8px;
    line-height: 1;
  }
  .remove-word-btn:hover {
    color: #dc2626;
  }


  .recall-form {
    display: flex;
    flex-wrap: wrap; /* Allow wrapping for smaller screens */
    gap: 10px;
    align-items: center;
    justify-content: center; /* Center items in form */
    margin-bottom: 16px;
  }

  .recall-form input[type="text"] {
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: left; /* Default input text align */
    flex-grow: 1; /* Allow input to take space */
    min-width: 150px; /* Ensure input is usable */
  }

  /* Button styles - re-use .test-button from parent or CountingTest if global */
  .test-button {
    padding: 10px 16px; /* Slightly smaller padding for these buttons */
    font-size: 1em; /* Standardized font size */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .test-button.start { background-color: #0ea5e9; }
  .test-button.start:hover { background-color: #0284c7; }

  .test-button.next { background-color: #6366f1; }
  .test-button.next:hover { background-color: #4f46e5; }

  .test-button.add { background-color: #10b981; } /* Green like .stats-icon */
  .test-button.add:hover { background-color: #059669; }

  .test-button.remove-all { background-color: #f59e0b; } /* Amber/Orange like NotificationCard */
  .test-button.remove-all:hover { background-color: #d97706; }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    margin: 20px 0;
  }

  .result-group {
    text-align: left;
  }

  .result-group h4 {
    margin-bottom: 12px;
    color: #1e293b;
  }

  .word-chip.correct {
    background-color: #dcfce7; /* Light green for correct words */
    color: #166534; /* Darker green for text */
    border-color: #86efac; /* Matching border color */
  }

  .word-chip.missed {
    background-color: #fee2e2; /* Light red for missed words */
    color: #991b1b; /* Darker red for text */
    border-color: #fca5a5; /* Matching border color */
  }

</style>