<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '$lib/i18n';
  import WordMemoryTest from '$lib/components/weekly-tests/WordMemoryTest.svelte';
  
  const dispatch = createEventDispatcher<{ testCompleted: 'wordMemory' }>();
  
  // Sample words for demonstration
  const sampleWords = [
    'APPLE', 'CHAIR', 'MUSIC', 'OCEAN', 'BRIGHT', 'FOREST',
    'HAPPY', 'CAMERA', 'GARDEN', 'PURPLE', 'WINTER', 'PENCIL',
    'BRIDGE', 'COOKIE', 'PLANET', 'SILVER', 'FLOWER', 'ROCKET',
    'YELLOW', 'CASTLE', 'PIZZA', 'TIGER', 'CLOUD', 'DIAMOND',
    'GUITAR', 'RAINBOW', 'COFFEE', 'MOUNTAIN', 'BUTTERFLY', 'SUNSET'
  ];
  
  function handleTestCompleted(event: CustomEvent<'wordMemory'>) {
    dispatch('testCompleted', event.detail);
  }
</script>

<div class="word-memory-screen">
  <div class="test-badge">
    <span class="test-number">{$t('onboarding.wordMemoryScreen.badgeNumber')}</span>
    <span class="test-total">/ {$t('onboarding.wordMemoryScreen.badgeTotal')}</span>
  </div>
  
  <div class="screen-icon">📚</div>
  
  <h1 class="screen-title">{$t('onboarding.wordMemoryScreen.title')}</h1>
  
  <div class="content">
    <div class="test-overview">
      <p class="intro-text">
        {$t('onboarding.wordMemoryScreen.intro1')} <strong>{$t('onboarding.wordMemoryScreen.strong1')}</strong>{$t('onboarding.wordMemoryScreen.intro2')} <strong>{$t('onboarding.wordMemoryScreen.strong2')}</strong>{$t('onboarding.wordMemoryScreen.intro3')} <strong>{$t('onboarding.wordMemoryScreen.strong3')}</strong>{$t('onboarding.wordMemoryScreen.intro4')}
      </p>
      
      <div class="test-phases">
        <div class="phase-card memorization-phase">
          <div class="phase-header">
            <span class="phase-icon">👁️</span>
            <h3>{$t('onboarding.wordMemoryScreen.phase1.title')}</h3>
            <span class="phase-time">{$t('onboarding.wordMemoryScreen.phase1.time')}</span>
          </div>
          <p class="phase-description">{$t('onboarding.wordMemoryScreen.phase1.description')}</p>
        </div>
        
        <div class="phase-arrow">→</div>
        
        <div class="phase-card recall-phase">
          <div class="phase-header">
            <span class="phase-icon">✏️</span>
            <h3>{$t('onboarding.wordMemoryScreen.phase2.title')}</h3>
            <span class="phase-time">{$t('onboarding.wordMemoryScreen.phase2.time')}</span>
          </div>
          <p class="phase-description">{$t('onboarding.wordMemoryScreen.phase2.description')}</p>
        </div>
      </div>
      
      <div class="memory-tips">
        <div class="tips-header">
          <span class="tips-icon">🧠</span>
          <h4>{$t('onboarding.wordMemoryScreen.tips.title')}</h4>
        </div>
        
        <ul class="tips-list">
          <li>{$t('onboarding.wordMemoryScreen.tips.group')}</li>
          <li>{$t('onboarding.wordMemoryScreen.tips.story')}</li>
          <li>{$t('onboarding.wordMemoryScreen.tips.visualization')}</li>
          <li>{$t('onboarding.wordMemoryScreen.tips.patterns')}</li>
        </ul>
      </div>
      
      <div class="test-container">
        <WordMemoryTest on:testCompleted={handleTestCompleted} />
      </div>
    </div>
  </div>
</div>

<style>
  .word-memory-screen {
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
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
      0 4px 12px rgba(16, 185, 129, 0.3),
      0 2px 4px rgba(16, 185, 129, 0.4);
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
    animation: book-flip 3s ease-in-out infinite;
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
  
  .test-phases {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    justify-content: center;
  }
  
  .phase-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    flex: 1;
    max-width: 200px;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 3px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .phase-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 20px rgba(14, 165, 233, 0.08),
      0 4px 8px rgba(14, 165, 233, 0.06);
  }
  
  .memorization-phase {
    border-left: 4px solid #10b981;
  }
  
  .recall-phase {
    border-left: 4px solid #8b5cf6;
  }
  
  .phase-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .phase-header h3 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .phase-icon {
    font-size: 1.2rem;
  }
  
  .phase-time {
    background: #10b981;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .recall-phase .phase-time {
    background: #8b5cf6;
  }
  
  .phase-description {
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0;
    text-align: left;
  }
  
  .phase-arrow {
    font-size: 1.5rem;
    color: #0ea5e9;
    font-weight: bold;
    animation: arrow-bounce 2s infinite;
  }
  
  .memory-tips {
    background: linear-gradient(135deg, #edf6ff 0%, #f0f9ff 100%);
    border: 1px solid #bae6fd;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 28px;
    text-align: left;
    box-shadow:
      0 4px 12px rgba(14, 165, 233, 0.08),
      0 1px 3px rgba(14, 165, 233, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .memory-tips:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 24px rgba(14, 165, 233, 0.12),
      0 4px 8px rgba(14, 165, 233, 0.08);
  }
  
  .tips-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .tips-icon {
    font-size: 1.2rem;
  }
  
  .tips-header h4 {
    color: #1e293b;
    font-size: 1rem;
    margin: 0;
  }
  
  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;
  }
  
  .tips-list li {
    padding: 6px 0;
    padding-left: 20px;
    position: relative;
    color: #475569;
    line-height: 1.4;
    font-size: 0.9rem;
  }
  
  .tips-list li::before {
    content: '💡';
    position: absolute;
    left: 0;
    font-size: 0.8rem;
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
  
  @keyframes book-flip {
    0%, 100% {
      transform: rotateY(0deg);
      filter: drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3));
    }
    50% {
      transform: rotateY(10deg);
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
  
  @keyframes arrow-bounce {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(4px); }
  }
  
  @keyframes tick {
    0%, 50% { transform: scale(1); }
    25% { transform: scale(1.1); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .word-memory-screen {
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
    
    .test-phases {
      flex-direction: column;
      gap: 16px;
    }
    
    .phase-arrow {
      transform: rotate(90deg);
      font-size: 1.2rem;
    }
    
    .phase-card {
      max-width: none;
      width: 100%;
      border-radius: 12px;
    }
    
    .memory-tips {
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
    
    .memory-tips {
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
    
    .word-memory-screen {
      animation: none;
    }
    
    .phase-card, .memory-tips {
      transition: none;
    }
    
    .phase-card:hover, .memory-tips:hover {
      transform: none;
    }
  }
</style>