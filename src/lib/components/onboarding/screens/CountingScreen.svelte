<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CountingTest from '$lib/components/weekly-tests/CountingTest.svelte';
  
  const dispatch = createEventDispatcher<{ testCompleted: 'counting' }>();
  
  function handleTestCompleted(event: CustomEvent<'counting'>) {
    dispatch('testCompleted', event.detail);
  }
</script>

<div class="counting-screen">
  <div class="test-badge">
    <span class="test-number">1</span>
    <span class="test-total">/ 3</span>
  </div>
  
  <div class="screen-icon">🔢</div>
  
  <h1 class="screen-title">Initial Assessment: Counting Test</h1>
  
  <div class="content">
    <div class="test-overview">
      <p class="intro-text">
        This is the first test of your initial assessment. Your task is to 
        <strong>count aloud from 1 to 120 as quickly as possible</strong>. 
        Just press <strong>Start</strong> button to start measuring time and
        <strong>Stop</strong> button when you done. Don't worry about perfect pronunciation.
      </p>
      
      <div class="test-container">
        <CountingTest on:testCompleted={handleTestCompleted} />
      </div>
    </div>
  </div>
</div>

<style>
  .counting-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .test-badge {
    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
    color: white;
    padding: 10px 18px;
    border-radius: 24px;
    font-size: 0.9375rem;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow:
      0 4px 12px rgba(14, 165, 233, 0.3),
      0 2px 4px rgba(14, 165, 233, 0.4);
    letter-spacing: 0.025em;
  }
  
  .test-number {
    font-size: 1.1rem;
  }
  
  .test-total {
    opacity: 0.8;
  }
  
  .screen-icon {
    font-size: 3.5rem;
    margin-bottom: 20px;
    animation: count-pulse 2s ease-in-out infinite;
    filter: drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3));
  }
  
  .screen-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #0ea5e9;
    margin: 0 0 28px 0;
    line-height: 1.3;
    text-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
    letter-spacing: -0.025em;
  }
  
  .content {
    width: 100%;
  }
  
  .intro-text {
    font-size: 1.0625rem;
    color: #475569;
    line-height: 1.65;
    margin-bottom: 28px;
    text-align: left;
    font-weight: 400;
  }
  
  .test-container {
    background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 28px;
    margin-top: 28px;
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.06),
      0 2px 8px rgba(0, 0, 0, 0.04);
  }
  
  strong {
    color: #0ea5e9;
    font-weight: 700;
  }
  
  @keyframes count-pulse {
    0%, 100% {
      transform: scale(1);
      filter: drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3));
    }
    50% {
      transform: scale(1.05);
      filter: drop-shadow(0 6px 16px rgba(14, 165, 233, 0.4));
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
  
  @keyframes number-highlight {
    0%, 100% { background: #0ea5e9; }
    50% { background: #0284c7; }
  }
  
  @keyframes flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes tick {
    0%, 50% { transform: scale(1); }
    25% { transform: scale(1.1); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .counting-screen {
      padding: 16px;
    }
    
    .screen-title {
      font-size: 1.625rem;
      margin-bottom: 24px;
    }
    
    .screen-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }
    
    .test-container {
      padding: 24px;
      border-radius: 12px;
    }
  }
  
  @media (max-width: 480px) {
    .screen-title {
      font-size: 1.5rem;
    }
    
    .screen-icon {
      font-size: 2.75rem;
    }
    
    .test-container {
      padding: 20px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .screen-icon {
      animation: none;
    }
    
    .counting-screen {
      animation: none;
    }
  }
</style>