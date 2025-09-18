<script lang="ts">
  export let currentScreen: number = 0;
  export let totalScreens: number = 7;
  
  $: progressPercentage = ((currentScreen + 1) / totalScreens) * 100;
</script>

<div class="progress-indicator" role="progressbar" aria-valuenow={currentScreen + 1} aria-valuemin="1" aria-valuemax={totalScreens} aria-label="Onboarding progress">
  <div class="progress-text" aria-live="polite">
    Screen {currentScreen + 1} of {totalScreens}
  </div>
  
  <div class="progress-bar-container" aria-hidden="true">
    <div class="progress-bar" style="width: {progressPercentage}%"></div>
  </div>
  
  <div class="progress-dots" role="tablist" aria-label="Screen indicators">
    {#each Array(totalScreens) as _, index}
      <div
        class="progress-dot"
        class:active={index === currentScreen}
        class:completed={index < currentScreen}
        role="tab"
        aria-selected={index === currentScreen}
        aria-label="Screen {index + 1}{index < currentScreen ? ' (completed)' : index === currentScreen ? ' (current)' : ' (upcoming)'}"
        tabindex={index === currentScreen ? 0 : -1}
      ></div>
    {/each}
  </div>
  
  <div class="sr-only">
    {#if currentScreen === 0}
      Beginning onboarding process
    {:else if currentScreen === totalScreens - 1}
      Final step of onboarding
    {:else}
      Step {currentScreen + 1} of {totalScreens} in the onboarding process
    {/if}
  </div>
</div>

<style>
  .progress-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 4px 0;
  }
  
  .progress-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    text-align: center;
    letter-spacing: 0.025em;
    transition: color 0.3s ease;
  }
  
  .progress-bar-container {
    width: 100%;
    max-width: 400px;
    height: 8px;
    background-color: #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%);
    border-radius: 8px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);
  }
  
  .progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .progress-dots {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 8px 0;
  }
  
  .progress-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #cbd5e1;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 2px solid transparent;
    position: relative;
    cursor: default;
  }
  
  .progress-dot::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: transparent;
    transition: all 0.3s ease;
  }
  
  .progress-dot.completed {
    background-color: #0ea5e9;
    transform: scale(1.15);
    box-shadow:
      0 0 0 2px rgba(14, 165, 233, 0.2),
      0 2px 4px rgba(14, 165, 233, 0.3);
  }
  
  .progress-dot.completed::before {
    background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
  }
  
  .progress-dot.active {
    background-color: #0ea5e9;
    border-color: #ffffff;
    box-shadow:
      0 0 0 3px rgba(14, 165, 233, 0.3),
      0 0 12px rgba(14, 165, 233, 0.4),
      0 4px 8px rgba(14, 165, 233, 0.2);
    transform: scale(1.3);
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow:
        0 0 0 3px rgba(14, 165, 233, 0.3),
        0 0 12px rgba(14, 165, 233, 0.4),
        0 4px 8px rgba(14, 165, 233, 0.2);
    }
    50% {
      box-shadow:
        0 0 0 6px rgba(14, 165, 233, 0.2),
        0 0 20px rgba(14, 165, 233, 0.3),
        0 6px 12px rgba(14, 165, 233, 0.3);
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .progress-indicator {
      gap: 12px;
    }
    
    .progress-text {
      font-size: 0.8125rem;
    }
    
    .progress-bar-container {
      max-width: 280px;
      height: 6px;
    }
    
    .progress-dots {
      gap: 8px;
    }
    
    .progress-dot {
      width: 10px;
      height: 10px;
    }
  }
  
  @media (max-width: 480px) {
    .progress-indicator {
      gap: 10px;
    }
    
    .progress-bar-container {
      max-width: 240px;
    }
    
    .progress-dots {
      gap: 6px;
    }
    
    .progress-dot {
      width: 8px;
      height: 8px;
    }
  }
  
  /* Screen reader only content */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Focus styles for progress dots */
  .progress-dot:focus {
    outline: 2px solid #0ea5e9;
    outline-offset: 2px;
  }
  
  .progress-dot:focus:not(:focus-visible) {
    outline: none;
  }
  
  .progress-dot:focus-visible {
    outline: 2px solid #0ea5e9;
    outline-offset: 2px;
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .progress-bar {
      transition: width 0.3s ease;
    }
    
    .progress-bar::after {
      animation: none;
    }
    
    .progress-dot {
      transition: all 0.2s ease;
    }
    
    .progress-dot.active {
      animation: none;
    }
  }
</style>