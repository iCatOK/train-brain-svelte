<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  
  const dispatch = createEventDispatcher<{
    next: void;
    previous: void;
    skip: void;
    complete: void;
  }>();
  
  export let currentScreen: number = 0;
  export let totalScreens: number = 7;
  
  $: isFirstScreen = currentScreen === 0;
  $: isLastScreen = currentScreen === totalScreens - 1;
  $: nextButtonText = isLastScreen ? $t('onboarding.navigation.getStarted') : $t('onboarding.navigation.next');
  
  function handleNext() {
    dispatch('next');
  }
  
  function handlePrevious() {
    dispatch('previous');
  }
  
  function handleSkip() {
    dispatch('skip');
  }
</script>

<div class="navigation-controls" role="navigation" aria-label="Onboarding navigation">
  <div class="nav-left">
    {#if !isFirstScreen}
      <button
        type="button"
        class="nav-button secondary"
        on:click={handlePrevious}
        aria-label="Go to previous onboarding screen"
        title="Navigate to the previous screen"
      >
        {$t('onboarding.navigation.previous')}
      </button>
    {/if}
  </div>
  
  <div class="nav-center">
    {#if !isLastScreen}
      <button
        type="button"
        class="skip-button"
        on:click={handleSkip}
        aria-label="Skip the onboarding tour and go directly to the application"
        title="Skip the remaining onboarding steps"
      >
        {$t('onboarding.navigation.skip')}
      </button>
    {/if}
  </div>
  
  <div class="nav-right">
    <button
      type="button"
      class="nav-button primary"
      class:complete-button={isLastScreen}
      on:click={handleNext}
      aria-label={isLastScreen ? "Complete onboarding and start using the application" : "Continue to the next onboarding screen"}
      title={isLastScreen ? "Complete the onboarding process" : "Go to the next screen"}
    >
      {nextButtonText}
    </button>
  </div>
</div>

<style>
  .navigation-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    padding: 4px 0;
  }
  
  .nav-left,
  .nav-right {
    flex: 0 0 auto;
  }
  
  .nav-center {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  
  .nav-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 130px;
    justify-content: center;
    position: relative;
    overflow: hidden;
    letter-spacing: 0.025em;
  }
  
  .nav-button::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: inherit;
  }
  
  .nav-button:active {
    transform: translateY(1px) scale(0.98);
  }
  
  .nav-button:focus-visible {
    outline: 2px solid #0ea5e9;
    outline-offset: 2px;
  }
  
  .nav-button.primary {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    box-shadow:
      0 4px 8px rgba(14, 165, 233, 0.25),
      0 1px 3px rgba(14, 165, 233, 0.4);
  }
  
  .nav-button.primary::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  }
  
  .nav-button.primary:hover {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    transform: translateY(-2px);
    box-shadow:
      0 8px 20px rgba(14, 165, 233, 0.4),
      0 4px 8px rgba(14, 165, 233, 0.3);
  }
  
  .nav-button.primary:hover::before {
    opacity: 1;
  }
  
  .nav-button.complete-button {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    font-weight: 700;
    padding: 16px 36px;
    font-size: 1.0625rem;
    box-shadow:
      0 6px 12px rgba(16, 185, 129, 0.3),
      0 2px 4px rgba(16, 185, 129, 0.4);
  }
  
  .nav-button.complete-button::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%);
  }
  
  .nav-button.complete-button:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    box-shadow:
      0 10px 24px rgba(16, 185, 129, 0.4),
      0 6px 12px rgba(16, 185, 129, 0.35);
    transform: translateY(-3px);
  }
  
  .nav-button.complete-button:hover::before {
    opacity: 1;
  }
  
  .nav-button.secondary {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    color: #475569;
    border: 2px solid #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .nav-button.secondary::before {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, transparent 100%);
  }
  
  .nav-button.secondary:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-color: #cbd5e1;
    color: #334155;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
  
  .nav-button.secondary:hover::before {
    opacity: 1;
  }
  
  .skip-button {
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    text-decoration: none;
  }
  
  .skip-button::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 1px;
    background-color: #0ea5e9;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  .skip-button:hover {
    color: #0ea5e9;
    background-color: rgba(14, 165, 233, 0.05);
    transform: translateY(-1px);
  }
  
  .skip-button:hover::after {
    width: 60%;
  }
  
  .skip-button:focus-visible {
    outline: 2px solid #0ea5e9;
    outline-offset: 2px;
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .navigation-controls {
      flex-direction: column;
      gap: 16px;
    }
    
    .nav-left,
    .nav-center,
    .nav-right {
      width: 100%;
    }
    
    .nav-center {
      order: -1;
    }
    
    .nav-button {
      width: 100%;
      min-width: auto;
      padding: 16px 24px;
    }
    
    .nav-button.complete-button {
      padding: 18px 32px;
    }
    
    .skip-button {
      width: 100%;
      text-align: center;
      padding: 12px 20px;
    }
  }
  
  /* Small mobile adjustments */
  @media (max-width: 480px) {
    .navigation-controls {
      gap: 12px;
    }
    
    .nav-button {
      padding: 14px 20px;
      font-size: 0.9375rem;
    }
    
    .nav-button.complete-button {
      padding: 16px 24px;
      font-size: 1rem;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .nav-button {
      transition: all 0.2s ease;
    }
    
    .nav-button:hover {
      transform: none;
    }
    
    .skip-button {
      transition: all 0.2s ease;
    }
    
    .skip-button:hover {
      transform: none;
    }
  }
</style>