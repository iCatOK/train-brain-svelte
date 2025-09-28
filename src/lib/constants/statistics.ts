export const MEDAL_THRESHOLDS = {
  GOLD: 30,
  SILVER: 60,
  BRONZE: 90
} as const;

export const CHART_COLORS = {
  GOLD: '#FFD700',
  SILVER: '#C0C0C0',
  BRONZE: '#CD7F32',
  DEFAULT: '#0ea5e9',
  WORD_ACCURACY: '#10b981'
} as const;

export const CHART_CONFIG = {
  PADDING: { left: 10, right: 10, top: 10, bottom: 20 },
  FONT_SIZE: 14,
  GRID_COLOR: '#e2e8f0',
  TOOLTIP_BACKGROUND: 'rgba(255, 255, 255, 0.9)',
  TOOLTIP_BORDER: '#e2e8f0'
} as const;

export const WORD_MEMORY_TOTAL_WORDS = 20;
export const RECENT_ACTIVITIES_LIMIT = 10;

export const CHART_CONFIGS = {
  '1-120': {
    dataKey: 'countingTest' as const,
    yLabel: 'Time (seconds)',
    yMax: 120,
    borderColor: '#0ea5e9'
  },
  word: {
    dataKey: 'wordMemoryTest' as const,
    yLabel: 'Accuracy (%)',
    yMax: 100,
    borderColor: '#10b981'
  },
  stroop: {
    dataKey: 'stroopTest' as const,
    yLabel: 'Time (seconds)',
    yMax: 120,
    borderColor: '#0ea5e9'
  }
} as const;