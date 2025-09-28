<script lang="ts">
  // Screen 3: Weekly Tests Overview
  // Content from introduction_screens.md lines 68-71
  import { t } from '$lib/i18n';
</script>

<div class="weekly-tests-screen">
  <div class="screen-icon">📊</div>
  
  <h1 class="screen-title">{$t('onboarding.weeklyTests.title')}</h1>
  
  <div class="content">
    <p class="intro-text">
      {$t('onboarding.weeklyTests.intro1')} <strong>{$t('onboarding.weeklyTests.strong1')}</strong>{$t('onboarding.weeklyTests.intro2')}
    </p>
    
    <div class="tests-overview">
      <h3>{$t('onboarding.weeklyTests.testsLabel')}</h3>
      
      <div class="test-cards">
        <div class="test-card counting-card">
          <div class="card-header">
            <div class="test-icon">
              <span class="number-icon">123</span>
              <span class="stopwatch">⏱️</span>
            </div>
            <h4>{$t('onboarding.weeklyTests.counting.title')}</h4>
          </div>
          <div class="card-content">
            <p class="test-description">
              {$t('onboarding.weeklyTests.counting.description')}
            </p>
            <div class="test-focus">
              <strong>{$t('onboarding.weeklyTests.counting.focusLabel')}</strong> {$t('onboarding.weeklyTests.counting.focus')}
            </div>
          </div>
          <div class="card-indicator">
            <span class="pulse-dot"></span>
            {$t('onboarding.weeklyTests.counting.indicator')}
          </div>
        </div>
        
        <div class="test-card memory-card">
          <div class="card-header">
            <div class="test-icon">
              <span class="book-icon">📚</span>
              <span class="words-icon">ABC</span>
            </div>
            <h4>{$t('onboarding.weeklyTests.wordMemory.title')}</h4>
          </div>
          <div class="card-content">
            <p class="test-description">
              {$t('onboarding.weeklyTests.wordMemory.description')}
            </p>
            <div class="test-focus">
              <strong>{$t('onboarding.weeklyTests.wordMemory.focusLabel')}</strong> {$t('onboarding.weeklyTests.wordMemory.focus')}
            </div>
          </div>
          <div class="card-indicator">
            <span class="pulse-dot"></span>
            {$t('onboarding.weeklyTests.wordMemory.indicator')}
          </div>
        </div>
        
        <div class="test-card stroop-card">
          <div class="card-header">
            <div class="test-icon">
              <div class="colorful-words">
                <span class="red-word">RED</span>
                <span class="blue-word">BLUE</span>
                <span class="green-word">GREEN</span>
              </div>
            </div>
            <h4>{$t('onboarding.weeklyTests.stroop.title')}</h4>
          </div>
          <div class="card-content">
            <p class="test-description">
              {$t('onboarding.weeklyTests.stroop.description')}
            </p>
            <div class="test-focus">
              <strong>{$t('onboarding.weeklyTests.stroop.focusLabel')}</strong> {$t('onboarding.weeklyTests.stroop.focus')}
            </div>
          </div>
          <div class="card-indicator">
            <span class="pulse-dot"></span>
            {$t('onboarding.weeklyTests.stroop.indicator')}
          </div>
        </div>
      </div>
    </div>
    
    <div class="assessment-info">
      <div class="info-card">
        <span class="brain-icon">🧠</span>
        <div class="info-content">
          <strong>{$t('onboarding.weeklyTests.assessment.title')}</strong>
          <p>{$t('onboarding.weeklyTests.assessment.description')}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .weekly-tests-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .screen-icon {
    font-size: 3.5rem;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
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
  
  .tests-overview h3 {
    color: #1e293b;
    font-size: 1.1rem;
    margin-bottom: 20px;
    text-align: left;
  }
  
  .test-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .test-card {
    background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px 18px;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 3px rgba(0, 0, 0, 0.06);
  }
  
  .test-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 12px 32px rgba(14, 165, 233, 0.15),
      0 6px 16px rgba(14, 165, 233, 0.1);
    border-color: #bae6fd;
  }
  
  .counting-card {
    border-left: 4px solid #0ea5e9;
  }
  
  .memory-card {
    border-left: 4px solid #10b981;
  }
  
  .stroop-card {
    border-left: 4px solid #f59e0b;
  }
  
  .card-header {
    margin-bottom: 12px;
  }
  
  .test-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
    height: 40px;
  }
  
  .number-icon {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0ea5e9;
  }
  
  .stopwatch {
    font-size: 1.2rem;
    animation: tick 1s infinite;
  }
  
  .book-icon {
    font-size: 1.5rem;
  }
  
  .words-icon {
    font-size: 1.2rem;
    font-weight: 600;
    color: #10b981;
  }
  
  .colorful-words {
    display: flex;
    gap: 4px;
    font-size: 0.8rem;
    font-weight: 700;
  }
  
  .red-word { color: #ef4444; }
  .blue-word { color: #3b82f6; }
  .green-word { color: #10b981; }
  
  .test-card h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .card-content {
    margin-bottom: 16px;
  }
  
  .test-description {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.4;
    margin-bottom: 8px;
  }
  
  .test-focus {
    font-size: 0.8rem;
    color: #475569;
  }
  
  .test-focus strong {
    color: #0ea5e9;
  }
  
  .card-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .pulse-dot {
    width: 6px;
    height: 6px;
    background: #0ea5e9;
    border-radius: 50%;
    animation: pulse-dot 2s infinite;
  }
  
  .assessment-info {
    margin-top: 24px;
  }
  
  .info-card {
    background: linear-gradient(135deg, #edf6ff 0%, #f0f9ff 100%);
    border: 1px solid #bae6fd;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: flex-start;
    gap: 18px;
    text-align: left;
    box-shadow:
      0 4px 12px rgba(14, 165, 233, 0.08),
      0 1px 3px rgba(14, 165, 233, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .info-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 24px rgba(14, 165, 233, 0.12),
      0 4px 8px rgba(14, 165, 233, 0.08);
  }
  
  .brain-icon {
    font-size: 1.5rem;
    margin-top: 2px;
  }
  
  .info-content strong {
    color: #0ea5e9;
    font-size: 1rem;
    display: block;
    margin-bottom: 8px;
  }
  
  .info-content p {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
    margin: 0;
  }
  
  strong {
    font-weight: 700;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
      filter: drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3));
    }
    50% {
      transform: translateY(-6px);
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
  
  @keyframes tick {
    0%, 50% { transform: scale(1); }
    25% { transform: scale(1.1); }
  }
  
  @keyframes pulse-dot {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .weekly-tests-screen {
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
    
    .test-cards {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .test-card {
      padding: 20px 16px;
      border-radius: 12px;
    }
    
    .intro-text {
      font-size: 1rem;
      line-height: 1.6;
    }
    
    .info-card {
      padding: 20px;
      gap: 16px;
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
    
    .test-card {
      padding: 18px 14px;
    }
    
    .info-card {
      padding: 18px;
      gap: 14px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .screen-icon {
      animation: none;
    }
    
    .weekly-tests-screen {
      animation: none;
    }
    
    .test-card, .info-card {
      transition: none;
    }
    
    .test-card:hover, .info-card:hover {
      transform: none;
    }
  }
</style>