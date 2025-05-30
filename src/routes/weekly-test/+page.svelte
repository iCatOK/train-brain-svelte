<script lang="ts">
  import CountingTest from '$lib/components/weekly-tests/CountingTest.svelte';
  import WordMemoryTest from '$lib/components/weekly-tests/WordMemoryTest.svelte';
  import { createEventDispatcher } from 'svelte';

  type TestName = 'counting' | 'wordMemory' | 'stroop' | 'finished'; // Added 'stroop' as placeholder for test 3

  let currentTest = $state<TestName>('counting');
  let totalTests = 3;

  const dispatch = createEventDispatcher<{ testCompleted: TestName }>();

  function handleTestCompletion(event: CustomEvent<TestName>) {
    const completedTest = event.detail;
    if (completedTest === 'counting') {
      currentTest = 'wordMemory';
    } else if (completedTest === 'wordMemory') {
      currentTest = 'stroop'; // Or 'finished' if it's the last one implemented
    } else if (completedTest === 'stroop') {
      currentTest = 'finished';
    }
  }

  const currentTestNumber = $derived(() => {
    if (currentTest === 'counting') return 1;
    if (currentTest === 'wordMemory') return 2;
    if (currentTest === 'stroop') return 3;
    return totalTests;
  });

  const testTitle = $derived(() => {
    // This could be more dynamic if test components provided their titles
    if (currentTest === 'counting') return "Weekly test";
    if (currentTest === 'wordMemory') return "Weekly test";
    if (currentTest === 'stroop') return "Weekly test"; // Placeholder
    if (currentTest === 'finished') return "Weekly Test Complete!";
    return "Weekly test";
  });
</script>

<div class="page-container">
  <div class="drill-card">
    <div class="weekly-test-header">
      <h1>{testTitle()}</h1>
      {#if currentTest !== 'finished'}
        <div class="progress-indicator">{currentTestNumber()} of {totalTests}</div>
      {/if}
    </div>

    {#if currentTest === 'counting'}
      <CountingTest on:testCompleted={handleTestCompletion} />
    {:else if currentTest === 'wordMemory'}
      <WordMemoryTest on:testCompleted={handleTestCompletion} />
    {:else if currentTest === 'stroop'}
      <div class="placeholder-test">
        <h3>Stroop Test (Test 3)</h3>
        <p>This test is not yet implemented.</p>
        <button class="test-button next" onclick={() => handleTestCompletion({detail: 'stroop'} as CustomEvent<TestName>)}>
          Simulate Completion
        </button>
      </div>
    {:else if currentTest === 'finished'}
      <div class="test-finished-message">
        <h2>All tests completed!</h2>
        <p>Your weekly test results have been saved.</p>
        <a href="/" class="test-button start" style="text-decoration: none; display: inline-block; margin-top: 20px;">Go Home</a>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Styles from previous step for .page-container, .drill-card, .weekly-test-header, .progress-indicator */
  .page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: calc(100vh - 60px - 40px);
    padding: 40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .drill-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 24px 32px;
    width: 100%;
    max-width: 500px; /* Increased max-width for word grid */
    text-align: center;
    min-height: 450px; /* Adjusted min-height for new test */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .weekly-test-header {
    margin-bottom: 24px;
  }

  .weekly-test-header h1 {
    font-size: 2rem;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  .progress-indicator {
    font-size: 0.9em;
    color: #64748b;
  }

  .placeholder-test, .test-finished-message {
    text-align: center;
    margin-top: 40px;
  }
  .placeholder-test h3, .test-finished-message h2 {
    font-size: 1.5rem;
    color: #1e293b;
    margin-bottom: 16px;
  }
  .placeholder-test p, .test-finished-message p {
    font-size: 1rem;
    color: #475569;
    margin-bottom: 24px;
  }
  /* Re-using test-button styles from CountingTest for consistency */
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
  .test-button.start { /* For "Go Home" */
    background-color: #0ea5e9;
  }
  .test-button.start:hover {
    background-color: #0284c7;
  }
  .test-button.next { /* For "Simulate Completion" */
    background-color: #6366f1;
  }
  .test-button.next:hover {
    background-color: #4f46e5;
  }
</style>