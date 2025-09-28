<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  import StroopTest from '$lib/components/weekly-tests/StroopTest.svelte';
  
  const dispatch = createEventDispatcher<{ testCompleted: 'stroop' }>();
  
  function handleTestCompleted(event: CustomEvent<'stroop'>) {
    dispatch('testCompleted', event.detail);
  }
</script>

<div class="stroop-screen">
  <div class="test-badge">
    <span class="test-number">{$t('onboarding.stroopScreen.badgeNumber')}</span>
    <span class="test-total">/ {$t('onboarding.stroopScreen.badgeTotal')}</span>
  </div>
  
  <div class="screen-icon">🎨</div>
  
  <h1 class="screen-title">{$t('onboarding.stroopScreen.title')}</h1>
  
  <div class="content">
    <div class="test-overview">
      <p class="intro-text">
        {$t('onboarding.stroopScreen.intro1')} <strong>{$t('onboarding.stroopScreen.strong1')}</strong>{$t('onboarding.stroopScreen.intro2')} <strong>{$t('onboarding.stroopScreen.strong2')}</strong>.
      </p>
      
      <div class="stroop-explanation">
        <div class="explanation-header">
          <span class="explanation-icon">🎯</span>
          <h3>{$t('onboarding.stroopScreen.howItWorks')}</h3>
        </div>
        
        <div class="example-demonstration">
          <div class="demo-card">
            <div class="demo-word" style="color: #3b82f6; font-weight: 700; font-size: 1.5rem;">{$t('onboarding.stroopScreen.explanationIncorrect')}</div>
            <div class="demo-arrow">→</div>
            <div class="demo-answer">
              <span class="answer-label">{$t('onboarding.stroopScreen.example.label')}</span>
              <span class="answer-value" style="color: #3b82f6; font-weight: 700;">{$t('onboarding.stroopScreen.explanationCorrect')}</span>
            </div>
          </div>
          
          <p class="demo-explanation">
            {$t('onboarding.stroopScreen.explanation1')} <span style="color: #3b82f6; font-weight: 600;">{$t('onboarding.stroopScreen.explanationColor')}</span>{$t('onboarding.stroopScreen.explanation2')} <strong>"{$t('onboarding.stroopScreen.explanationCorrect')}"</strong>{$t('onboarding.stroopScreen.explanation3')}
          </p>
        </div>
      </div>

      <div class="test-container">
        <StroopTest on:testCompleted={handleTestCompleted} />
      </div>
    </div>
  </div>
</div>

<style>
  .stroop-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .test-badge {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
      0 4px 12px rgba(245, 158, 11, 0.3),
      0 2px 4px rgba(245, 158, 11, 0.4);
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
    animation: color-shift 3s ease-in-out infinite;
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
  
  .stroop-explanation {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 28px;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 3px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .stroop-explanation:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 20px rgba(14, 165, 233, 0.08),
      0 4px 8px rgba(14, 165, 233, 0.06);
  }
  
  .explanation-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .explanation-icon {
    font-size: 1.2rem;
  }
  
  .explanation-header h3 {
    color: #1e293b;
    font-size: 1rem;
    margin: 0;
    text-align: left;
  }
  
  .demo-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background: #ffffff;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  
  .demo-word {
    font-size: 1.5rem;
    font-weight: 700;
    padding: 8px 16px;
    background: #f8fafc;
    border-radius: 8px;
  }
  
  .demo-arrow {
    font-size: 1.5rem;
    color: #0ea5e9;
    font-weight: bold;
  }
  
  .demo-answer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  
  .answer-label {
    font-size: 0.8rem;
    color: #64748b;
  }
  
  .answer-value {
    font-size: 1.2rem;
    font-weight: 700;
    padding: 4px 12px;
    background: #f0f9ff;
    border-radius: 6px;
  }
  
  .demo-explanation {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
    text-align: left;
    margin: 0;
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
  
  @keyframes color-shift {
    0% {
      filter: hue-rotate(0deg) drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3));
    }
    50% {
      filter: hue-rotate(60deg) drop-shadow(0 6px 16px rgba(14, 165, 233, 0.4));
    }
    100% {
      filter: hue-rotate(0deg) drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3));
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
  
  @keyframes tick {
    0%, 50% { transform: scale(1); }
    25% { transform: scale(1.1); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .stroop-screen {
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
    
    .demo-card {
      flex-direction: column;
      gap: 16px;
    }
    
    .demo-arrow {
      transform: rotate(90deg);
      font-size: 1.2rem;
    }
    
    .stroop-explanation {
      padding: 20px;
      margin-bottom: 24px;
      border-radius: 12px;
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
    
    .stroop-explanation {
      padding: 18px;
      margin-bottom: 20px;
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
    
    .stroop-screen {
      animation: none;
    }
    
    .stroop-explanation {
      transition: none;
    }
    
    .stroop-explanation:hover {
      transform: none;
    }
  }
</style>