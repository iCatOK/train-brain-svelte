<script lang="ts">
  // Screen 2: Daily Tasks
  // Content from introduction_screens.md lines 63-66
</script>

<div class="daily-tasks-screen">
  <div class="screen-icon">📝</div>
  
  <h1 class="screen-title">Daily Training: Arithmetic Problems</h1>
  
  <div class="content">
    <p class="intro-text">
      You will solve blocks of simple arithmetic examples including <strong>addition, subtraction, and multiplication</strong>. 
      The key goal is to <strong>perform tasks as quickly as possible</strong> for maximum activation of the prefrontal cortex.
    </p>
    
    <div class="examples-section">
      <h3>For example:</h3>
      <div class="arithmetic-examples">
        <div class="example-card">
          <div class="problem">8 + 7 = <span class="answer-field">15</span></div>
          <div class="speed-indicator">⚡ Fast!</div>
        </div>
        <div class="example-card">
          <div class="problem">5 * 8 = <span class="answer-field">40</span></div>
          <div class="speed-indicator">⚡ Rapid!</div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .daily-tasks-screen {
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
    animation: bounce 2s infinite;
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
  
  .examples-section {
    margin: 24px 0;
  }
  
  .examples-section h3 {
    color: #1e293b;
    font-size: 1.1rem;
    margin-bottom: 16px;
    text-align: left;
  }
  
  .arithmetic-examples {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .example-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 18px 14px;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }
  
  .example-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 8px 20px rgba(14, 165, 233, 0.15),
      0 4px 8px rgba(14, 165, 233, 0.1);
    border-color: #bae6fd;
  }
  
  .problem {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }
  
  .answer-field {
    background: #0ea5e9;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
  }
  
  .speed-indicator {
    font-size: 0.85rem;
    color: #10b981;
    font-weight: 500;
  }
  
  strong {
    color: #0ea5e9;
    font-weight: 700;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
      filter: drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3));
    }
    40% {
      transform: translateY(-8px);
      filter: drop-shadow(0 6px 16px rgba(14, 165, 233, 0.4));
    }
    60% {
      transform: translateY(-4px);
      filter: drop-shadow(0 5px 14px rgba(14, 165, 233, 0.35));
    }
  }
  
  @keyframes pulse-brain {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
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
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .daily-tasks-screen {
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
    
    .arithmetic-examples {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .intro-text {
      font-size: 1rem;
      line-height: 1.6;
    }
  }
  
  @media (max-width: 480px) {
    .screen-title {
      font-size: 1.5rem;
    }
    
    .screen-icon {
      font-size: 2.75rem;
    }
    
    .example-card {
      padding: 14px 10px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .screen-icon {
      animation: none;
    }
    
    .daily-tasks-screen {
      animation: none;
    }
    
    .example-card {
      transition: none;
    }
    
    .example-card:hover {
      transform: none;
    }
  }
</style>