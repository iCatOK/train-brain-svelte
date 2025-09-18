<script lang="ts">
  // Screen 7: Progress Tracking
  // Content from introduction_screens.md lines 88-91
  
  // Sample data for demonstration charts
  const weeklyData = [
    { week: 'Week 1', counting: 45, memory: 12, stroop: 38 },
    { week: 'Week 2', counting: 42, memory: 15, stroop: 35 },
    { week: 'Week 3', counting: 40, memory: 18, stroop: 32 },
    { week: 'Week 4', counting: 38, memory: 21, stroop: 29 }
  ];
  
  const dailyTimes = [
    { day: 'Mon', time: 2.3 },
    { day: 'Tue', time: 2.1 },
    { day: 'Wed', time: 1.9 },
    { day: 'Thu', time: 1.8 },
    { day: 'Fri', time: 1.7 },
    { day: 'Sat', time: 1.6 },
    { day: 'Sun', time: 1.5 }
  ];
</script>

<div class="progress-screen">
  <div class="screen-icon">📈</div>
  
  <h1 class="screen-title">Track Your Progress and Achievements</h1>
  
  <div class="content">
    <div class="progress-overview">
      <p class="intro-text">
        The application will save <strong>daily results of arithmetic tasks (time spent)</strong> and 
        <strong>weekly results of all tests</strong>. Progress will be displayed with visual graphs 
        to help you track your improvement over time.
      </p>
      
      <div class="tracking-features">
        <div class="feature-card daily-tracking">
          <div class="feature-header">
            <span class="feature-icon">📝</span>
            <h3>Daily Arithmetic Results</h3>
          </div>
          <p class="feature-description">
            Track completion time for each daily math session
          </p>
          <div class="feature-example">
            <div class="daily-chart">
              {#each dailyTimes as day}
                <div class="chart-bar">
                  <div class="bar-fill" style="height: {(day.time / 2.5) * 100}%;"></div>
                  <div class="bar-label">{day.day}</div>
                  <div class="bar-value">{day.time}m</div>
                </div>
              {/each}
            </div>
            <p class="chart-caption">Daily completion times getting faster!</p>
          </div>
        </div>
        
        <div class="feature-card weekly-tracking">
          <div class="feature-header">
            <span class="feature-icon">📊</span>
            <h3>Weekly Test Results</h3>
          </div>
          <p class="feature-description">
            Monitor performance across all three cognitive tests
          </p>
          <div class="feature-example">
            <div class="weekly-chart">
              <div class="chart-legend">
                <span class="legend-item counting">● Counting (sec)</span>
                <span class="legend-item memory">● Memory (words)</span>
                <span class="legend-item stroop">● Stroop (sec)</span>
              </div>
              <div class="chart-container">
                <svg class="chart-svg" viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <!-- Define styles for axes -->
                    <style>
                      .axis-line { stroke: #64748b; stroke-width: 1; }
                      .grid-line { stroke: #e2e8f0; stroke-width: 0.5; opacity: 0.6; }
                      .axis-label { font-family: system-ui, sans-serif; font-size: 10px; fill: #64748b; }
                      .tick-mark { stroke: #64748b; stroke-width: 1; }
                    </style>
                  </defs>
                  
                  <!-- Chart area background -->
                  <rect x="40" y="10" width="260" height="80" fill="#f8fafc" stroke="#e2e8f0" stroke-width="0.5" rx="2"/>
                  
                  <!-- Y-axis gridlines -->
                  <g class="y-gridlines">
                    <line x1="40" y1="90" x2="300" y2="90" class="grid-line" />
                    <line x1="40" y1="70" x2="300" y2="70" class="grid-line" />
                    <line x1="40" y1="50" x2="300" y2="50" class="grid-line" />
                    <line x1="40" y1="30" x2="300" y2="30" class="grid-line" />
                    <line x1="40" y1="10" x2="300" y2="10" class="grid-line" />
                  </g>
                  
                  <!-- X-axis gridlines -->
                  <g class="x-gridlines">
                    {#each weeklyData as week, index}
                      <line x1="{105 + index * 65}" y1="10" x2="{105 + index * 65}" y2="90" class="grid-line" />
                    {/each}
                  </g>
                  
                  <!-- Y-axis -->
                  <line x1="40" y1="10" x2="40" y2="90" class="axis-line" />
                  
                  <!-- X-axis -->
                  <line x1="40" y1="90" x2="300" y2="90" class="axis-line" />
                  
                  <!-- Y-axis labels and tick marks -->
                  <g class="y-axis-labels">
                    <line x1="35" y1="90" x2="40" y2="90" class="tick-mark" />
                    <text x="32" y="94" text-anchor="end" class="axis-label">0%</text>
                    
                    <line x1="35" y1="70" x2="40" y2="70" class="tick-mark" />
                    <text x="32" y="74" text-anchor="end" class="axis-label">25%</text>
                    
                    <line x1="35" y1="50" x2="40" y2="50" class="tick-mark" />
                    <text x="32" y="54" text-anchor="end" class="axis-label">50%</text>
                    
                    <line x1="35" y1="30" x2="40" y2="30" class="tick-mark" />
                    <text x="32" y="34" text-anchor="end" class="axis-label">75%</text>
                    
                    <line x1="35" y1="10" x2="40" y2="10" class="tick-mark" />
                    <text x="32" y="14" text-anchor="end" class="axis-label">100%</text>
                  </g>
                  
                  <!-- X-axis labels and tick marks -->
                  <g class="x-axis-labels">
                    {#each weeklyData as week, index}
                      <line x1="{105 + index * 65}" y1="90" x2="{105 + index * 65}" y2="95" class="tick-mark" />
                      <text x="{105 + index * 65}" y="108" text-anchor="middle" class="axis-label">{week.week}</text>
                    {/each}
                  </g>
                  
                  <!-- Data lines -->
                  <g class="data-lines">
                    <!-- Counting line -->
                    <polyline
                      fill="none"
                      stroke="#0ea5e9"
                      stroke-width="2"
                      points="{weeklyData.map((week, index) => `${105 + index * 65},${90 - (week.counting / 50 * 80)}`).join(' ')}"
                    />
                    
                    <!-- Memory line -->
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      stroke-width="2"
                      points="{weeklyData.map((week, index) => `${105 + index * 65},${90 - (week.memory / 25 * 80)}`).join(' ')}"
                    />
                    
                    <!-- Stroop line -->
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      stroke-width="2"
                      points="{weeklyData.map((week, index) => `${105 + index * 65},${90 - (week.stroop / 50 * 80)}`).join(' ')}"
                    />
                  </g>
                  
                  <!-- Data points -->
                  <g class="data-points">
                    {#each weeklyData as week, index}
                      <!-- Counting points -->
                      <circle
                        cx="{105 + index * 65}"
                        cy="{90 - (week.counting / 50 * 80)}"
                        r="4"
                        fill="#0ea5e9"
                        stroke="white"
                        stroke-width="2"
                      />
                      
                      <!-- Memory points -->
                      <circle
                        cx="{105 + index * 65}"
                        cy="{90 - (week.memory / 25 * 80)}"
                        r="4"
                        fill="#10b981"
                        stroke="white"
                        stroke-width="2"
                      />
                      
                      <!-- Stroop points -->
                      <circle
                        cx="{105 + index * 65}"
                        cy="{90 - (week.stroop / 50 * 80)}"
                        r="4"
                        fill="#f59e0b"
                        stroke="white"
                        stroke-width="2"
                      />
                    {/each}
                  </g>
                </svg>
              </div>
            </div>
            <p class="chart-caption">Weekly improvements across all tests</p>
          </div>
        </div>
      </div>
      
      <div class="consistency-importance">
        <div class="consistency-header">
          <span class="consistency-icon">🏆</span>
          <h3>The Importance of Consistency</h3>
        </div>
        
        <div class="consistency-content">
          <div class="consistency-points">
            <div class="point-item">
              <span class="point-icon">⏰</span>
              <div class="point-text">
                <strong>Just a few minutes per day</strong>
                <p>Even short, consistent training sessions are highly effective</p>
              </div>
            </div>
            
            <div class="point-item">
              <span class="point-icon">📈</span>
              <div class="point-text">
                <strong>Personal growth matters most</strong>
                <p>Each result is unique - focus on your own improvement journey</p>
              </div>
            </div>
            
            <div class="point-item">
              <span class="point-icon">🧠</span>
              <div class="point-text">
                <strong>Brain plasticity requires repetition</strong>
                <p>Regular practice strengthens neural pathways over time</p>
              </div>
            </div>
          </div>
          
          <div class="consistency-visual">
            <div class="calendar-example">
              <h4>Your Training Calendar</h4>
              <div class="calendar-grid">
                <div class="calendar-day completed">1</div>
                <div class="calendar-day completed">2</div>
                <div class="calendar-day completed">3</div>
                <div class="calendar-day completed">4</div>
                <div class="calendar-day completed">5</div>
                <div class="calendar-day missed">6</div>
                <div class="calendar-day completed">7</div>
                <div class="calendar-day completed">8</div>
                <div class="calendar-day completed">9</div>
                <div class="calendar-day completed">10</div>
                <div class="calendar-day completed">11</div>
                <div class="calendar-day completed">12</div>
                <div class="calendar-day today">13</div>
                <div class="calendar-day future">14</div>
              </div>
              <div class="calendar-stats">
                <span class="stat-item">
                  <span class="stat-dot completed"></span>
                  11 days completed
                </span>
                <span class="stat-item">
                  <span class="stat-dot missed"></span>
                  1 day missed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="motivation-message">
        <div class="message-content">
          <span class="message-icon">💪</span>
          <div class="message-text">
            <strong>Remember: Every small improvement counts!</strong>
            <p>Your brain is constantly adapting and growing stronger with each training session.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .progress-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 750px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .screen-icon {
    font-size: 3.5rem;
    margin-bottom: 20px;
    animation: chart-grow 3s ease-in-out infinite;
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
  
  .tracking-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .feature-card {
    background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    text-align: left;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 3px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 20px rgba(14, 165, 233, 0.08),
      0 4px 8px rgba(14, 165, 233, 0.06);
  }
  
  .daily-tracking {
    border-left: 4px solid #10b981;
  }
  
  .weekly-tracking {
    border-left: 4px solid #8b5cf6;
  }
  
  .feature-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .feature-icon {
    font-size: 1.2rem;
  }
  
  .feature-header h3 {
    color: #1e293b;
    font-size: 1rem;
    margin: 0;
    font-weight: 600;
  }
  
  .feature-description {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 16px;
    line-height: 1.4;
  }
  
  .daily-chart {
    display: flex;
    align-items: end;
    justify-content: space-between;
    height: 80px;
    background: #f8fafc;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 8px;
  }
  
  .chart-bar {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  
  .bar-fill {
    width: 12px;
    background: linear-gradient(to top, #10b981, #34d399);
    border-radius: 2px;
    margin-bottom: 4px;
    transition: height 0.5s ease;
  }
  
  .bar-label {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 500;
  }
  
  .bar-value {
    font-size: 0.6rem;
    color: #10b981;
    font-weight: 600;
    position: absolute;
    top: -16px;
  }
  
  .weekly-chart {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    height: 140px;
    position: relative;
    margin-bottom: 8px;
  }
  
  .chart-legend {
    display: flex;
    gap: 16px;
    font-size: 0.75rem;
    margin-bottom: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    color: #475569;
  }
  
  .legend-item.counting { color: #0ea5e9; }
  .legend-item.memory { color: #10b981; }
  .legend-item.stroop { color: #f59e0b; }
  
  .chart-container {
    position: relative;
    height: 120px;
    width: 100%;
    overflow: visible;
  }
  
  .chart-svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .chart-caption {
    font-size: 0.75rem;
    color: #10b981;
    font-weight: 500;
    text-align: center;
    margin: 0;
    font-style: italic;
  }
  
  .consistency-importance {
    background: linear-gradient(135deg, #edf6ff 0%, #f0f9ff 100%);
    border: 1px solid #bae6fd;
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 28px;
    text-align: left;
    box-shadow:
      0 4px 12px rgba(14, 165, 233, 0.08),
      0 1px 3px rgba(14, 165, 233, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .consistency-importance:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 24px rgba(14, 165, 233, 0.12),
      0 4px 8px rgba(14, 165, 233, 0.08);
  }
  
  .consistency-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .consistency-icon {
    font-size: 1.5rem;
  }
  
  .consistency-header h3 {
    color: #1e293b;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 600;
  }
  
  .consistency-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  
  .point-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .point-icon {
    font-size: 1.2rem;
    margin-top: 2px;
  }
  
  .point-text strong {
    color: #0ea5e9;
    font-size: 0.9rem;
    display: block;
    margin-bottom: 4px;
  }
  
  .point-text p {
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0;
  }
  
  .calendar-example h4 {
    color: #1e293b;
    font-size: 0.9rem;
    margin: 0 0 12px 0;
    text-align: center;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 12px;
  }
  
  .calendar-day {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    border: 1px solid #e2e8f0;
  }
  
  .calendar-day.completed {
    background: #dcfce7;
    border-color: #10b981;
    color: #065f46;
  }
  
  .calendar-day.missed {
    background: #fee2e2;
    border-color: #f87171;
    color: #991b1b;
  }
  
  .calendar-day.today {
    background: #dbeafe;
    border-color: #3b82f6;
    color: #1e40af;
    box-shadow: 0 0 0 2px #bfdbfe;
  }
  
  .calendar-day.future {
    background: #f8fafc;
    color: #94a3b8;
  }
  
  .calendar-stats {
    display: flex;
    justify-content: center;
    gap: 12px;
    font-size: 0.7rem;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
    font-weight: 500;
  }
  
  .stat-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  
  .stat-dot.completed { background: #10b981; }
  .stat-dot.missed { background: #ef4444; }
  
  .motivation-message {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 1px solid #bbf7d0;
    border-radius: 16px;
    padding: 24px;
    text-align: left;
    box-shadow:
      0 4px 12px rgba(16, 185, 129, 0.08),
      0 1px 3px rgba(16, 185, 129, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .motivation-message:hover {
    transform: translateY(-2px);
    box-shadow:
      0 8px 24px rgba(16, 185, 129, 0.12),
      0 4px 8px rgba(16, 185, 129, 0.08);
  }
  
  .message-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  
  .message-icon {
    font-size: 1.5rem;
    margin-top: 2px;
  }
  
  .message-text strong {
    color: #10b981;
    font-size: 1rem;
    display: block;
    margin-bottom: 8px;
  }
  
  .message-text p {
    font-size: 0.9rem;
    color: #475569;
    line-height: 1.5;
    margin: 0;
  }
  
  strong {
    color: #0ea5e9;
    font-weight: 700;
  }
  
  @keyframes chart-grow {
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
  
  @keyframes pulse-point {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .progress-screen {
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
    
    .tracking-features {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .feature-card {
      border-radius: 12px;
    }
    
    .consistency-content {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    
    .calendar-grid {
      grid-template-columns: repeat(7, 1fr);
      gap: 3px;
    }
    
    .calendar-day {
      width: 22px;
      height: 22px;
      font-size: 0.65rem;
    }
    
    .weekly-chart {
      height: 150px;
      padding: 12px;
    }
    
    .chart-legend {
      gap: 10px;
      font-size: 0.6875rem;
    }
    
    .chart-container {
      height: 110px;
    }
    
    .consistency-importance {
      padding: 24px;
      margin-bottom: 24px;
      border-radius: 12px;
    }
    
    .motivation-message {
      padding: 20px;
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
    
    .consistency-importance {
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .motivation-message {
      padding: 18px;
    }
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .screen-icon {
      animation: none;
    }
    
    .progress-screen {
      animation: none;
    }
    
    .feature-card, .consistency-importance, .motivation-message {
      transition: none;
    }
    
    .feature-card:hover, .consistency-importance:hover, .motivation-message:hover {
      transform: none;
    }
  }
</style>