<script lang="ts">
  // Screen 1: Welcome & Introduction
  // Content from introduction_screens.md lines 58-61
  import { t } from '$lib/i18n';
</script>

<div class="welcome-screen">
  <div class="screen-icon">🧠</div>
  
  <h1 class="screen-title">{$t('onboarding.welcome.title')}</h1>
  
  <div class="content">
    <p class="intro-text">
      {$t('onboarding.welcome.intro1')} <strong>{$t('onboarding.welcome.strong1')}</strong>{$t('onboarding.welcome.intro2')} <strong>{$t('onboarding.welcome.strong2')}</strong>{$t('onboarding.welcome.intro3')}
    </p>
    
    <div class="highlight-card">
      <div class="brain-activity">
        <div class="brain-icon">🧠</div>
        <div class="activity-waves">
          <span class="wave"></span>
          <span class="wave"></span>
          <span class="wave"></span>
        </div>
      </div>
      <p class="highlight-text">
        {$t('onboarding.welcome.highlight')}
      </p>
    </div>
    
    <p class="method-explanation">
      {$t('onboarding.welcome.explanation1')} <strong>{$t('onboarding.welcome.explanationStrong1')}</strong> {$t('onboarding.welcome.explanation2')}
    </p>
  </div>
</div>

<style>
  .welcome-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .screen-icon {
    font-size: 3.5rem;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
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
  
  .highlight-card {
    background: linear-gradient(135deg, #edf6ff 0%, #f0f9ff 100%);
    border: 1px solid #bae6fd;
    border-radius: 16px;
    padding: 24px;
    margin: 28px 0;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 4px 12px rgba(14, 165, 233, 0.08),
      0 1px 3px rgba(14, 165, 233, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .highlight-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 24px rgba(14, 165, 233, 0.12),
      0 4px 8px rgba(14, 165, 233, 0.08);
  }
  
  .brain-activity {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    position: relative;
  }
  
  .brain-icon {
    font-size: 2rem;
    z-index: 2;
    position: relative;
  }
  
  .activity-waves {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .wave {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 2px solid #0ea5e9;
    border-radius: 50%;
    opacity: 0;
    animation: wave-pulse 2s infinite;
  }
  
  .wave:nth-child(2) {
    width: 60px;
    height: 60px;
    animation-delay: 0.3s;
  }
  
  .wave:nth-child(3) {
    width: 80px;
    height: 80px;
    animation-delay: 0.6s;
  }
  
  .highlight-text {
    font-size: 1rem;
    color: #0ea5e9;
    font-weight: 500;
    margin: 0;
    line-height: 1.5;
  }
  
  .method-explanation {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.6;
    text-align: left;
    margin-top: 20px;
  }
  
  strong {
    color: #0ea5e9;
    font-weight: 700;
  }
  
  @keyframes pulse {
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
  
  @keyframes wave-pulse {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .welcome-screen {
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
    
    .intro-text, .method-explanation {
      font-size: 1rem;
      line-height: 1.6;
    }
    
    .highlight-card {
      padding: 20px;
      margin: 24px 0;
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
    
    .highlight-card {
      padding: 18px;
      margin: 20px 0;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .screen-icon {
      animation: none;
    }
    
    .welcome-screen {
      animation: none;
    }
    
    .highlight-card {
      transition: none;
    }
    
    .highlight-card:hover {
      transform: none;
    }
  }
</style>