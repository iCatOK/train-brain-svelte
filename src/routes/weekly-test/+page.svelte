<script lang="ts">
  import CountingTest from '$lib/components/weekly-tests/CountingTest.svelte';
  import WordMemoryTest from '$lib/components/weekly-tests/WordMemoryTest.svelte';
  import StroopTest from '$lib/components/weekly-tests/StroopTest.svelte';
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
      <StroopTest on:testCompleted={handleTestCompletion} />
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
    padding: clamp(16px, 4vw, 40px) clamp(10px, 2vw, 20px);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .drill-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: clamp(16px, 4vw, 32px) clamp(12px, 3vw, 32px);
    width: 100%;
    max-width: clamp(320px, 95vw, 700px);
    text-align: center;
    min-height: clamp(350px, 70vh, 450px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin: 0 auto;
  }

  .weekly-test-header {
    margin-bottom: 24px;
  }

  .weekly-test-header h1 {
    font-size: clamp(1.5rem, 5vw, 2rem);
    color: #1e293b;
    margin: 0 0 4px 0;
    line-height: 1.3;
  }

  .progress-indicator {
    font-size: clamp(0.8rem, 2.5vw, 0.9rem);
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

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    .page-container {
      padding: 16px 10px;
      min-height: calc(100vh - 60px - 32px);
    }
    
    .drill-card {
      padding: 20px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    
    .weekly-test-header {
      margin-bottom: 20px;
    }
    
    .test-button {
      font-size: 1.1rem;
      padding: 10px 20px;
      min-width: 100px;
    }
  }

  @media (max-width: 480px) {
    .page-container {
      padding: 12px 8px;
    }
    
    .drill-card {
      padding: 16px 12px;
      min-height: 320px;
    }
    
    .weekly-test-header {
      margin-bottom: 16px;
    }
    
    .weekly-test-header h1 {
      font-size: 1.4rem;
    }
    
    .progress-indicator {
      font-size: 0.8rem;
    }
    
    .test-button {
      font-size: 1rem;
      padding: 10px 16px;
      width: 100%;
      max-width: 200px;
    }
    
    .test-finished-message h2 {
      font-size: 1.3rem;
    }
    
    .test-finished-message p {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 360px) {
    .drill-card {
      padding: 12px 8px;
    }
    
    .weekly-test-header h1 {
      font-size: 1.25rem;
    }
  }

  /* Landscape Phone Orientation */
  @media (max-height: 500px) and (orientation: landscape) {
    .page-container {
      padding: 8px 10px;
      min-height: calc(100vh - 60px - 16px);
    }
    
    .drill-card {
      padding: 12px 16px;
      min-height: 280px;
    }
    
    .weekly-test-header {
      margin-bottom: 12px;
    }
    
    .weekly-test-header h1 {
      font-size: 1.3rem;
    }
  }
</style>