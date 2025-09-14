# Debug Mode Documentation

## Overview

The debug mode provides comprehensive testing capabilities for chart rendering and data visualization in the Train Brain Game statistics page. It generates realistic test data to help developers test different scenarios and chart states.

## Activation

### Methods to Enable Debug Mode:

1. **Keyboard Shortcut**: `Ctrl + Shift + D` (anywhere on the statistics page)
2. **Debug Button**: Click the 🐛 button in the top-right corner of the statistics page
3. **Programmatic**: Call `debugStore.enable()` from code

### Methods to Disable Debug Mode:

1. **Keyboard Shortcut**: `Esc` key (when debug panel is open)
2. **Close Button**: Click the ✕ button in the debug panel header
3. **Programmatic**: Call `debugStore.disable()` from code

## Features

### Quick Presets

The debug mode includes 4 predefined data generation presets:

#### 🌱 Beginner
- **Duration**: 14 days of data
- **Pattern**: Improving performance over time
- **Participation Rate**: 40% (inconsistent usage, just starting)
- **Medal Distribution**: 5% Gold, 15% Silver, 40% Bronze, 40% None
- **Use Case**: Testing with new user progression patterns

#### ⚡ Intermediate
- **Duration**: 30 days of data
- **Pattern**: Consistent performance
- **Participation Rate**: 70% (regular usage with some gaps)
- **Medal Distribution**: 20% Gold, 30% Silver, 30% Bronze, 20% None
- **Use Case**: Testing with balanced skill levels

#### 🏆 Expert
- **Duration**: 60 days of data
- **Pattern**: Random performance variations
- **Participation Rate**: 85% (dedicated usage with rare gaps)
- **Medal Distribution**: 40% Gold, 30% Silver, 20% Bronze, 10% None
- **Use Case**: Testing with high-skill user data

#### 🎯 Realistic
- **Duration**: 45 days of data
- **Pattern**: Improving with occasional setbacks
- **Participation Rate**: 60% (real-world usage with breaks)
- **Medal Distribution**: 15% Gold, 25% Silver, 35% Bronze, 25% None
- **Use Case**: Testing with real-world usage patterns

### Weekly Test Data Generation

Generates realistic data for all three weekly tests with proper business rules:

- **Counting Test (1-120)**: Times between 20-100 seconds, max 1 result per week
- **Word Memory Test**: Accuracy between 60-95% (12-19 words out of 20), max 1 result per week
- **Stroop Test**: Times between 15-50 seconds, max 1 result per week
- **Business Rule**: Weekly tests can only be performed once per week (every 7 days)

## Technical Architecture

### Core Components

#### 1. Debug Store (`src/lib/stores/debugStore.ts`)
Central state management and data generation logic:

```typescript
// Enable/disable debug mode
debugStore.enable()
debugStore.disable()
debugStore.toggle()

// Generate data with presets
const results = debugStore.generateDrillResults(debugStore.presets.realistic)
const weeklyData = debugStore.generateWeeklyTestData(debugStore.presets.beginner)
```

#### 2. Debug Panel (`src/lib/components/debug/DebugPanel.svelte`)
User interface component with:
- Floating toggle button
- Collapsible control panel
- Preset buttons and data generation controls
- Clear data functionality

#### 3. Integration (`src/routes/statistics/+page.svelte`)
Seamlessly integrated into the statistics page without disrupting the main UI.

### Data Generation Algorithm

The debug system uses sophisticated algorithms to create realistic test data following proper business rules:

#### Business Rules Implementation
- **Daily Drills**: Maximum 1 result per day (user can only do daily drill once)
- **Weekly Tests**: Maximum 1 result per week (tests available weekly, done once)
- **Participation Rate**: 0.0-1.0 determines percentage of days/weeks user participates

#### Time Generation
```typescript
// Medal-based time generation
function generateTimeForMedal(medal: Medal): number {
  switch (medal) {
    case 'gold': return Math.random() * 30;           // 0-30 seconds
    case 'silver': return 30 + Math.random() * 30;    // 30-60 seconds
    case 'bronze': return 60 + Math.random() * 30;    // 60-90 seconds
    case 'none': return 90 + Math.random() * 60;      // 90-150 seconds
  }
}
```

#### Participation Logic
```typescript
// Daily drill participation check
for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
  if (Math.random() > participationRate) {
    continue; // Skip this day - user didn't participate
  }
  // Generate exactly 1 result for this day
}
```

#### Pattern Application
- **Improving**: Performance gets better over time (40% improvement)
- **Declining**: Performance gets worse over time (30% decline)
- **Consistent**: Small random variations (±10%)
- **Random**: No pattern, pure randomization

#### Distribution Weighting
Medal distribution uses weighted random selection to create realistic result patterns.

## Extending the Debug Mode

### Adding New Test Types

1. **Define New Data Structure**:
```typescript
export interface NewTestResult {
  date: string;
  score: number;
  // Add other relevant fields
}
```

2. **Create Generator Function**:
```typescript
function generateNewTestData(options: GeneratorOptions): NewTestResult[] {
  // Implementation here
}
```

3. **Add to Debug Store**:
```typescript
return {
  // ... existing methods
  generateNewTestData,
}
```

4. **Update UI**:
Add new buttons and controls in `DebugPanel.svelte`

### Adding New Patterns

1. **Extend Pattern Type**:
```typescript
type Pattern = 'random' | 'improving' | 'consistent' | 'declining' | 'newPattern';
```

2. **Implement Pattern Logic**:
```typescript
function applyPattern(baseValue: number, dayIndex: number, totalDays: number, pattern: string): number {
  switch (pattern) {
    case 'newPattern':
      // Your pattern logic here
      return modifiedValue;
    // ... existing patterns
  }
}
```

### Adding New Presets

```typescript
presets: {
  // ... existing presets
  customPreset: {
    days: 21,
    participationRate: 0.8, // 80% participation rate
    pattern: 'improving' as const,
    medalDistribution: { gold: 0.1, silver: 0.2, bronze: 0.4, none: 0.3 }
  }
}
```

## Usage Examples

### Basic Usage
1. Navigate to Statistics page
2. Press `Ctrl + Shift + D` or click 🐛 button
3. Click 📊 to expand the control panel
4. Choose a preset (e.g., "🎯 Realistic")
5. Observe charts update with generated data

### Testing Specific Scenarios
- **Empty State**: Click "🗑️ Clear All Data" to test empty charts
- **High Performance**: Use "🏆 Expert" preset for gold medal heavy data
- **Learning Curve**: Use "🌱 Beginner" preset for improvement patterns
- **Mixed Data**: Use "🎯 Realistic" for varied, realistic patterns

### Development Testing
```typescript
// Generate custom test data programmatically
const customResults = debugStore.generateDrillResults({
  days: 7,
  participationRate: 0.9, // User participated 90% of days (6-7 days out of 7)
  pattern: 'improving',
  medalDistribution: { gold: 0.5, silver: 0.3, bronze: 0.2, none: 0.0 }
});

drillResults.setResults(customResults);
```

## Performance Considerations

- Generated data is stored in browser localStorage
- Large datasets (60+ days with high participation rates) may impact chart rendering performance
- Clear data regularly during testing to avoid memory bloat
- Debug mode automatically disabled in production builds
- Business rules ensure realistic data sizes (max 1 result per day/week)

## Troubleshooting

### Common Issues

**Debug panel not appearing**:
- Ensure you're on the statistics page
- Try the keyboard shortcut `Ctrl + Shift + D`
- Check browser console for JavaScript errors

**Charts not updating**:
- Data generation is immediate - charts should update instantly
- Try clearing data first, then generating new data
- Refresh the page if charts appear frozen

**Performance issues**:
- Reduce the number of days or participation rate in custom scenarios
- Clear existing data before generating new datasets
- Use smaller presets like "Beginner" for testing

### Debug Console Commands

Open browser DevTools and use these commands:

```javascript
// Enable debug mode
debugStore.enable()

// Generate specific data
const data = debugStore.generateDrillResults(debugStore.presets.realistic)
drillResults.setResults(data)

// Clear all data
drillResults.clearResults()
weeklyTestStore.clearAllResults()
```

## Future Enhancements

Planned extensions for the debug mode:

1. **Custom Data Import**: Allow CSV/JSON import for specific test scenarios
2. **Performance Benchmarking**: Measure chart rendering performance with different data sizes
3. **Automated Testing**: Generate test suites for different user personas
4. **Data Export**: Export generated test data for documentation or external analysis
5. **Real-time Data**: Simulate live data updates for testing reactive features

## Contributing

When adding new debug features:

1. Follow the existing pattern architecture
2. Add comprehensive documentation
3. Include realistic data generation algorithms  
4. Test with various data sizes and patterns
5. Ensure non-intrusive UI integration