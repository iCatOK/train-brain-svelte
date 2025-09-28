<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import { onboarding } from '$lib/stores/onboarding';
  import type { OnboardingState } from '$lib/types';
  import ProgressIndicator from './navigation/ProgressIndicator.svelte';
  import NavigationControls from './navigation/NavigationControls.svelte';
  
  // Import all screen components
  import WelcomeScreen from './screens/WelcomeScreen.svelte';
  import DailyTasksScreen from './screens/DailyTasksScreen.svelte';
  import WeeklyTestsScreen from './screens/WeeklyTestsScreen.svelte';
  import CountingScreen from './screens/CountingScreen.svelte';
  import WordMemoryScreen from './screens/WordMemoryScreen.svelte';
  import StroopScreen from './screens/StroopScreen.svelte';
  import ProgressScreen from './screens/ProgressScreen.svelte';
  
  const dispatch = createEventDispatcher<{
    complete: void;
  }>();
  
  // Subscribe to onboarding store
  $: currentState = $onboarding;
  
  let contentContainer: HTMLElement;
  let previousScreen = -1;
  
  // Reset scroll position when screen changes
  $: if (currentState.currentScreen !== previousScreen) {
    if (contentContainer) {
      resetScrollPosition();
    }
    previousScreen = currentState.currentScreen;
  }
  
  async function resetScrollPosition() {
    // Wait for DOM to update before scrolling
    await tick();
    if (contentContainer) {
      contentContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  
  function handleComplete() {
    onboarding.completeOnboarding();
    dispatch('complete');
  }
  
  async function handleNext() {
    if (currentState.currentScreen === 6) {
      handleComplete();
    } else {
      onboarding.nextScreen();
      // Ensure scroll reset happens immediately for button clicks
      await resetScrollPosition();
    }
  }
  
  async function handlePrevious() {
    onboarding.prevScreen();
    // Ensure scroll reset happens immediately for button clicks
    await resetScrollPosition();
  }
  
  function handleSkip() {
    handleComplete();
  }
  
  function handleTestCompleted(event: CustomEvent<'counting' | 'wordMemory' | 'stroop'>) {
    // Automatically advance to the next screen when a test is completed
    setTimeout(async () => {
      onboarding.nextScreen();
      // Ensure scroll reset happens after test completion
      await resetScrollPosition();
    }, 1000); // Small delay to show completion
  }
</script>

<div class="onboarding-container" id="onboarding-title">
  <header class="onboarding-header">
    <ProgressIndicator
      currentScreen={currentState.currentScreen}
      totalScreens={7}
    />
  </header>
  
  <main class="onboarding-content" class:test-screen={currentState.currentScreen >= 3 && currentState.currentScreen <= 5} bind:this={contentContainer}>
    {#if currentState.currentScreen === 0}
      <!-- Screen 1: Welcome -->
      <div class="screen-container">
        <WelcomeScreen />
      </div>
    {:else if currentState.currentScreen === 1}
      <!-- Screen 2: Daily Tasks -->
      <div class="screen-container">
        <DailyTasksScreen />
      </div>
    {:else if currentState.currentScreen === 2}
      <!-- Screen 3: Weekly Tests Overview -->
      <div class="screen-container">
        <WeeklyTestsScreen />
      </div>
    {:else if currentState.currentScreen === 3}
      <!-- Screen 4: Counting Test -->
      <div class="test-screen-container">
        <CountingScreen on:testCompleted={handleTestCompleted} />
      </div>
    {:else if currentState.currentScreen === 4}
      <!-- Screen 5: Word Memory Test -->
      <div class="test-screen-container">
        <WordMemoryScreen on:testCompleted={handleTestCompleted} />
      </div>
    {:else if currentState.currentScreen === 5}
      <!-- Screen 6: Stroop Test -->
      <div class="test-screen-container">
        <StroopScreen on:testCompleted={handleTestCompleted} />
      </div>
    {:else if currentState.currentScreen === 6}
      <!-- Screen 7: Progress Tracking -->
      <div class="screen-container">
        <ProgressScreen />
      </div>
    {/if}
  </main>
  
  {#if !(currentState.currentScreen >= 3 && currentState.currentScreen <= 5)}
    <footer class="onboarding-footer">
      <NavigationControls
        currentScreen={currentState.currentScreen}
        totalScreens={7}
        on:next={handleNext}
        on:previous={handlePrevious}
        on:skip={handleSkip}
        on:complete={handleComplete}
      />
    </footer>
  {/if}
</div>

<style>
  .onboarding-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #1e293b;
    position: relative;
  }
  
  .onboarding-header {
    padding: 24px 32px 16px;
    border-bottom: 1px solid #e2e8f0;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    position: relative;
    z-index: 10;
  }
  
  .onboarding-content {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 20px 32px 32px;
    overflow-y: auto;
    position: relative;
    min-height: 0; /* Allow flex shrinking */
  }

  .onboarding-content.test-screen {
    padding: 20px;
    max-width: none;
  }

  .test-screen-container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    animation: slideInFromRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .screen-container {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    animation: slideInFromRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .onboarding-footer {
    padding: 16px 32px 24px;
    border-top: 1px solid #e2e8f0;
    background: linear-gradient(180deg, #f8fafc 0%, #edf6ff 100%);
    transition: all 0.3s ease;
  }

  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .onboarding-header {
      padding: 16px 20px 12px;
    }
    
    .onboarding-content {
      padding: 16px 20px 20px;
    }
    
    .onboarding-footer {
      padding: 12px 20px 20px;
    }
  }
  
  /* Enhanced animations for screen transitions */
  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(32px);
      filter: blur(2px);
    }
    50% {
      opacity: 0.7;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      filter: blur(0px);
    }
  }
  
  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-32px);
      filter: blur(2px);
    }
    50% {
      opacity: 0.7;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      filter: blur(0px);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .screen-container,
    .test-screen-container {
      animation: fadeInReduced 0.3s ease-out;
    }
    
    @keyframes fadeInReduced {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  }
</style>